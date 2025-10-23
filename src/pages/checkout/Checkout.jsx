import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadCart, saveCart } from "../../lib/cartStore.jsx";
import api from "../../lib/axios";
import "./Checkout.css";

const FORM_KEY = "checkout_form";

const getCachedForm = () => {
  try {
    return JSON.parse(localStorage.getItem(FORM_KEY) || "{}");
  } catch {
    return {};
  }
};
const saveCachedForm = (obj) =>
  localStorage.setItem(FORM_KEY, JSON.stringify(obj));

const getDefaultAddress = (addresses = []) => {
  if (!Array.isArray(addresses) || addresses.length === 0) return null;
  const def = addresses.find((a) => a?.is_default);
  return def || addresses[0];
};

export default function CheckoutPage() {
  const navigate = useNavigate();

  // ==== CART (state thay vì const) ====
  const [cart, setCart] = useState(() => loadCart());
  const updateCart = (next) => {
    setCart(next);
    saveCart(next);
  };
  const incQty = (idx) =>
    updateCart(
      cart.map((it, i) =>
        i === idx ? { ...it, qty: Math.min(99, Number(it.qty || 1) + 1) } : it
      )
    );
  const decQty = (idx) =>
    updateCart(
      cart.map((it, i) =>
        i === idx ? { ...it, qty: Math.max(1, Number(it.qty || 1) - 1) } : it
      )
    );
  const setQty = (idx, val) => {
    let n = parseInt(val, 10);
    if (isNaN(n)) n = 1;
    n = Math.max(1, Math.min(99, n));
    updateCart(cart.map((it, i) => (i === idx ? { ...it, qty: n } : it)));
  };
  const removeItem = (idx) => updateCart(cart.filter((_, i) => i !== idx));

  const subtotal = useMemo(
    () =>
      cart.reduce(
        (s, it) => s + Number(it.price || 0) * (Number(it.qty) || 1),
        0
      ),
    [cart]
  );

  // ==== VOUCHER ====
  const [voucherInput, setVoucherInput] = useState("");
  const [eligible, setEligible] = useState([]);
  const [vLoading, setVLoading] = useState(false);
  const [vError, setVError] = useState("");
  const [applied, setApplied] = useState(null);
  const [showAllVouchers, setShowAllVouchers] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setVLoading(true);
        setVError("");
        const { data } = await api.get("/vouchers/eligible", {
          params: { total: subtotal },
        });
        if (!ignore) {
          setEligible(data?.vouchers || []);
          if (applied) {
            const still = (data?.vouchers || []).some(
              (v) => String(v._id) === String(applied._id)
            );
            if (!still) setApplied(null);
          }
        }
      } catch (e) {
        if (!ignore) {
          setEligible([]);
          setVError("Không tải được voucher khả dụng.");
        }
      } finally {
        if (!ignore) setVLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subtotal]);

  const discount = useMemo(() => {
  if (!applied) return 0;

  // Lấy phần trăm từ applied.percent hoặc applied.value
  const pctRaw = Number(applied.percent ?? applied.value ?? 0);
  if (!isFinite(pctRaw) || pctRaw <= 0) return 0;

  // Hỗ trợ cả 15 (15%) và 0.15 (15%)
  const pct = pctRaw > 1 ? pctRaw / 100 : pctRaw;

  const raw = subtotal * pct;

  // Không cho giảm vượt quá subtotal
  return Math.max(0, Math.min(raw, subtotal));
}, [applied, subtotal]);
const grandTotal = useMemo(
  () => Math.max(0, subtotal - discount),
  [subtotal, discount]
);
  const applyVoucher = (v) => setApplied(v);
  const clearVoucher = () => {
    setApplied(null);
    setVoucherInput("");
  };

  // ==== USER + FORM (cached + auto-fill từ address) ====
  const [dirty, setDirty] = useState(false);
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });

  const cached = getCachedForm();
  const [name, setName] = useState(cached.name || user?.name || "");
  const [email, setEmail] = useState(cached.email || user?.email || "");
  const [phone, setPhone] = useState(cached.phone || "");
  const [address, setAddress] = useState(cached.address || "");
  const [ward, setWard] = useState(cached.ward || "");
  const [city, setCity] = useState(cached.city || "");
  const [country, setCountry] = useState(cached.country || "");

  const [loading, setLoading] = useState(true);

  // Address list + editing in-place
  const [addrLoading, setAddrLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);

  // Modal edit address ngay trong Checkout
  const [showAddrModal, setShowAddrModal] = useState(false);
  const [addrAddress, setAddrAddress] = useState("");
  const [addrWard, setAddrWard] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrCountry, setAddrCountry] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrSaving, setAddrSaving] = useState(false);

  const fillFromAddress = (a, u = user) => {
    if (!a) return;
    setName(u?.name || "");
    setEmail(u?.email || "");
    setPhone(a.phone || "");
    setAddress(a.address || "");
    setWard(a.ward || "");
    setCity(a.city || "");
    setCountry(a.country || "");
  };

  useEffect(() => {
    saveCachedForm({ name, email, phone, address, ward, city, country });
  }, [name, email, phone, address, ward, city, country]);

  // guard
  useEffect(() => {
    if (cart.length === 0) navigate("/", { replace: true });
  }, [cart.length, navigate]);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }
    setLoading(false);
  }, [navigate]);

  // fetch user + addresses; refill form nếu rỗng
  useEffect(() => {
    const id = user?._id;
    if (!id) {
      setAddrLoading(false);
      return;
    }
    let mounted = true;

    const refetch = async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        if (!mounted) return;
        const u = data?.user || user;
        setUser(u);
        const addrs = data?.addresses || [];
        setAddresses(addrs);

        if (!dirty || (!address && !city && !phone)) {
          const a = getDefaultAddress(addrs);
          if (a) fillFromAddress(a, u);
        }
        localStorage.removeItem("address_updated");
      } catch (e) {
        console.error("[Checkout] get user error", e);
      } finally {
        setAddrLoading(false);
      }
    };

    refetch();

    const onFocusOrStorage = () => {
      if (
        document.visibilityState === "visible" ||
        localStorage.getItem("address_updated")
      ) {
        refetch();
      }
    };
    document.addEventListener("visibilitychange", onFocusOrStorage);
    window.addEventListener("focus", onFocusOrStorage);
    window.addEventListener("storage", onFocusOrStorage);

    return () => {
      mounted = false;
      document.removeEventListener("visibilitychange", onFocusOrStorage);
      window.removeEventListener("focus", onFocusOrStorage);
      window.removeEventListener("storage", onFocusOrStorage);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, dirty]);

  const openAddressModal = () => {
    const a = getDefaultAddress(addresses) || {};
    
    setAddrAddress(a.address || "");
    setAddrWard(a.ward || "");
    setAddrCity(a.city || "");
    setAddrCountry(a.country || "");
    setAddrPhone(a.phone || "");
    setShowAddrModal(true);
    
  };
const lockAddr = addresses.length > 0;

  const saveAddressInCheckout = async () => {
    if (!user?._id) return;
    try {
      setAddrSaving(true);
      const payload = {
        name: user?.name,
        address: addrAddress,
        city: addrCity,
        ward: addrWard,
        country: addrCountry,
        phone: addrPhone,
        user_id: user?._id,
      };
      if (!addresses[0]?._id) {
        await api.post("/address", payload);
      } else {
        await api.put(`/address/${addresses[0]._id}/upaddress`, payload);
      }
      // refetch + fill form
      const { data } = await api.get(`/users/${user._id}`);
      const addrs = data?.addresses || [];
      setAddresses(addrs);
      const def = getDefaultAddress(addrs);
      fillFromAddress(def, data?.user || user);
      setShowAddrModal(false);
      localStorage.setItem("address_updated", "1");
    } catch (e) {
      alert("Lưu address thất bại!");
      console.error("saveAddressInCheckout", e);
    } finally {
      setAddrSaving(false);
    }
  };

  // SUBMIT
  const canSubmit = useMemo(() => {
    return (
      name && email && phone && address && city && country && cart.length > 0
    );
  }, [name, email, phone, address, city, country, cart.length]);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const handlePlaceOrder = async () => {
    if (!canSubmit) return;
    if (!addresses[0]?._id) {
      alert(
        "Bạn chưa có địa chỉ giao hàng. Vui lòng thêm trong Checkout (Edit address)."
      );
      return;
    }
    try {
      const orderItems = cart.map((it) => {
        if (!it?.variant?._id)
          throw new Error(`Sản phẩm "${it.name}" chưa chọn biến thể.`);
        return {
          product_id: it._id,
          productvariant_id: it.variant._id,
          quantity: Number(it.qty || 1),
          price: Number(it.price || 0),
        };
      });

      const defaultAddr = getDefaultAddress(addresses);

      const payload = {
        total_amount: Number((applied ? grandTotal : subtotal) || 0),
        address_id: defaultAddr?._id,
        user_id: user?._id,
        status: "pending",
        orderDetails: orderItems,
        ...(applied ? { voucher_id: applied._id } : {}),
        payment_method: paymentMethod,
      };
      console.log("[FE payload]", payload); // 👈 kiểm tra giá trị thực tế
      const { data } = await api.post("/orders", payload);
      saveCart([]);
      localStorage.removeItem(FORM_KEY);
      navigate("/userprofile?tab=orders", { replace: true });
    } catch (err) {
      console.error("❌ Order failed:", {
        url: err?.config?.url,
        method: err?.config?.method,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Đặt hàng thất bại!";
      alert(msg);
    }
  };

  if (loading) return <div className="co_wrap pad margintop">Loading…</div>;

  // voucher list view
  const PREVIEW_COUNT = 5;
  const list = showAllVouchers ? eligible : eligible.slice(0, PREVIEW_COUNT);

  return (
    <div className="co_wrap margintop pad">
      <div className="co_grid">
        {/* LEFT: form */}
        <section className="co_left">
          <Link to="/">
            <svg
              id="layer_1"
              className="logo"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 220.45 118.55"
            >
              <path
                d="M76.87,59.5q.8-.37,2.85-3.75a43.07,43.07,0,0,0,2.45-4.34,2.09,2.09,0,0,0,1.4.42,4.1,4.1,0,0,0,1.2-.21,68.84,68.84,0,0,1,7-1.74A38.34,38.34,0,0,1,97.43,49c.07,0,.11,0,.11.1a25.25,25.25,0,0,0,1.63,4,22.18,22.18,0,0,0,3.47,5.67,5,5,0,0,0,3.62,2.06,3.18,3.18,0,0,0,2.23-.87,2.88,2.88,0,0,0,.94-2.17,2.08,2.08,0,0,0-.27-1.13,13.78,13.78,0,0,0-1.49-1.64,26.54,26.54,0,0,1-4.87-7.86q-2.42-5.43-6.71-18.51a5.34,5.34,0,0,0,.16-1.47c0-.83-.15-1.35-.44-1.57a3.62,3.62,0,0,0-2.88-1A3.19,3.19,0,0,0,90.5,26.2c-.79,1.05-3,4.82-6.5,11.28q-2.66,4.82-5.86,9.71-5.9,9-5.89,9.86A2.52,2.52,0,0,0,73.44,59a3.53,3.53,0,0,0,2,.93A3.28,3.28,0,0,0,76.87,59.5ZM92,33.41c.06.14.18.46.35,1q2.76,8.46,3.33,9.84c-.69.11-1.38.24-2.07.38q-4.21.87-5.25,1c-1,.14-2,.3-3,.47Z"
                transform="translate(-18.85 -20.37)"
              />
              <path
                d="M129.91,56.74q4.09-3.39,4.1-5.83c0-1-.47-1.57-1.41-1.57a2.5,2.5,0,0,0-1.73.94q-4.64,4.86-9.35,4.85a3.54,3.54,0,0,1-2.66-1,3,3,0,0,1-1-2.14.81.81,0,0,1,.71-.85,21.17,21.17,0,0,0,10-5.09q3.92-3.69,3.91-7.77a5.57,5.57,0,0,0-5.81-5.63q-5.28,0-9.92,5.74a19.26,19.26,0,0,0-4.64,12.31,9.93,9.93,0,0,0,2.28,7,8,8,0,0,0,6.23,2.49A14.13,14.13,0,0,0,129.91,56.74Zm-8.34-16.35q2.48-3,4.52-3a1.38,1.38,0,0,1,1.11.53,2,2,0,0,1,.44,1.3c0,1.31-1,2.77-2.83,4.38a14.22,14.22,0,0,1-6.53,3.17A15.67,15.67,0,0,1,121.57,40.39Z"
                transform="translate(-18.85 -20.37)"
              />
              <path
                d="M155.63,51.82a1.5,1.5,0,0,0-1.09-.39,3.56,3.56,0,0,0-2.06,1,13,13,0,0,1-3.18,2.05,7.12,7.12,0,0,1-2.52.45,1.4,1.4,0,0,1-1.34-.76A6,6,0,0,1,145,51.5a48.63,48.63,0,0,1,1.11-6.33c.74-3.48,1.18-5.23,1.32-5.23l8.09-1.35q3.54-.57,3.54-2.65a1.86,1.86,0,0,0-.4-1.4,2.57,2.57,0,0,0-1.64-.36q-.72,0-8.18.66,2-6.87,2-7.25a2.51,2.51,0,0,0-.72-1.74,2.61,2.61,0,0,0-2-.79c-1.55,0-2.54,1-3,2.86-.73,3.06-1.43,5.54-2.08,7.43l-5,.19c-1.48,0-2.22.65-2.22,2a2.47,2.47,0,0,0,1.11,2.25,4.06,4.06,0,0,0,2.19.7h.49c.39,0,1.09-.05,2.09-.16q-2.37,9.47-2.37,12.63A7.63,7.63,0,0,0,141,58.18,6,6,0,0,0,145.68,60a11.15,11.15,0,0,0,7-2.62Q156,54.78,156,52.72A1.16,1.16,0,0,0,155.63,51.82Z"
                transform="translate(-18.85 -20.37)"
              />
              <path
                className="cls-1"
                d="M184.85,51.53a22.75,22.75,0,0,1-.89-3,33,33,0,0,1-.66-4.43q-.62-5.77-1.93-7.14a4.45,4.45,0,0,0-3.32-1.37,8.44,8.44,0,0,0-5.71,2.64q-2.82,2.63-6.71,9.92.47-2.67,1.52-7.19,1.74-7.5,2.37-10.93a33.79,33.79,0,0,0,.63-6,3.71,3.71,0,0,0-.91-2.67,2.86,2.86,0,0,0-2.16-1c-.59,0-1.24.44-2,1.31s-1.19,2.44-1.44,4.72q-1.52,14.2-3.91,26.79a35.81,35.81,0,0,0-.63,4,2.37,2.37,0,0,0,.89,2,3.6,3.6,0,0,0,2.32.7,1.79,1.79,0,0,0,1.45-.72,16.47,16.47,0,0,0,1.66-3.19,82,82,0,0,1,5.66-8.68q3.93-5.43,5.29-5.43c.67,0,1.15.45,1.44,1.36a35.87,35.87,0,0,1,.81,6.26,12.32,12.32,0,0,0,1.92,6.28,4.57,4.57,0,0,0,3.7,2.27,2.75,2.75,0,0,0,1.87-.7,2,2,0,0,0,.81-1.55,2.94,2.94,0,0,0-.71-1.76A9,9,0,0,1,184.85,51.53Z"
                transform="translate(-18.85 -20.37)"
              />
              <path
                className="cls-1"
                d="M197.88,60.12a14.15,14.15,0,0,0,9.26-3.38q4.1-3.39,4.1-5.83c0-1-.47-1.57-1.41-1.57a2.5,2.5,0,0,0-1.73.94q-4.65,4.86-9.35,4.85a3.54,3.54,0,0,1-2.66-1,3,3,0,0,1-1-2.14.81.81,0,0,1,.7-.85,21.12,21.12,0,0,0,10-5.09q3.92-3.69,3.92-7.77a5.59,5.59,0,0,0-5.81-5.63q-5.28,0-9.92,5.74a19.26,19.26,0,0,0-4.64,12.31,10,10,0,0,0,2.27,7A8,8,0,0,0,197.88,60.12Zm.91-19.73q2.49-3,4.53-3a1.38,1.38,0,0,1,1.11.53,2,2,0,0,1,.43,1.3q0,2-2.82,4.38a14.22,14.22,0,0,1-6.53,3.17A15.64,15.64,0,0,1,198.79,40.39Z"
                transform="translate(-18.85 -20.37)"
              />
              <path
                className="cls-1"
                d="M237.78,35.12a5.72,5.72,0,0,0-3.9-1.32c-2.08,0-4.21,1.19-6.39,3.55a39.76,39.76,0,0,0-6.1,9.25l-.4.75.58-3.61a21,21,0,0,1,.64-2.86,20.62,20.62,0,0,0,1-4.57,2.3,2.3,0,0,0-.66-1.59,2.42,2.42,0,0,0-1.92-.73,3.54,3.54,0,0,0-2.18.75,3.4,3.4,0,0,0-1.25,1.61,17.51,17.51,0,0,0-.48,3.15c0,.39-.09.93-.17,1.62q-.43,4-.53,6.7c-.07,1.94-.1,3.48-.1,4.62a19.08,19.08,0,0,0,.68,6,2.38,2.38,0,0,0,2.3,1.84,3.48,3.48,0,0,0,2.41-.79,4.27,4.27,0,0,0,1.15-2.75,25.11,25.11,0,0,1,5-12.28Q231.61,39,233.36,39a2.38,2.38,0,0,1,1.34.77,3.67,3.67,0,0,0,2.65,1.2,1.62,1.62,0,0,0,1.43-.81,3.57,3.57,0,0,0,.51-1.94A4,4,0,0,0,237.78,35.12Z"
                transform="translate(-18.85 -20.37)"
              />
              <path
                className="cls-1"
                d="M64.37,82.82a4.54,4.54,0,0,0-3.16,1.39,3.7,3.7,0,0,0-1.48,2.37A99.19,99.19,0,0,1,59,99.11q-.76,5.9-1.44,7.12t-9.73,2q-9,.78-14,.78c-1.5,0-2.35-.12-2.53-.35a57.73,57.73,0,0,1,1.23-9.5,50.91,50.91,0,0,0,1-8.26q0-5.76-4.64-5.76a3.94,3.94,0,0,0-2.62,1.1,3.94,3.94,0,0,0-1.42,2.31q-2.78,29.36-5.06,38.56a28.29,28.29,0,0,0-1,6.4,5,5,0,0,0,5.2,5.42q2,0,3.18-3.38a28,28,0,0,0,1.39-8.4Q29,118.57,30,116.67q.27-.28,5.78-.67c3.67-.25,5.93-.38,6.8-.38,1.2,0,3.43-.14,6.72-.42s5.43-.39,6.54-.39c.44,0,.66.56.66,1.69a83.5,83.5,0,0,1-1,9.56q-.94,7-.95,8.19a3.64,3.64,0,0,0,1.45,3,4.72,4.72,0,0,0,3,1.16q1.45,0,3.27-1.86a5.46,5.46,0,0,0,1.83-3.77q0-4,1-16.17a198.67,198.67,0,0,1,2.48-19.93,61.91,61.91,0,0,0,1.3-9.56,4,4,0,0,0-1.28-3.06A4.48,4.48,0,0,0,64.37,82.82Z"
                transform="translate(-18.85 -20.37)"
              />
              <path
                className="cls-1"
                d="M96,98.29q-8.82,0-15,8.78t-6.19,17.86a13.62,13.62,0,0,0,3.38,9.37,10.93,10.93,0,0,0,8.58,3.82q6.57,0,13.16-5.64a28.1,28.1,0,0,0,8.95-13.87v0a23,23,0,0,0,.6-5.24,16,16,0,0,0-3.73-10.6A12.1,12.1,0,0,0,96,98.29Zm.39,27.31q-4.71,5.18-9.07,5.17a3.2,3.2,0,0,1-2.83-1.9,9.73,9.73,0,0,1-1.07-4.81,21.53,21.53,0,0,1,2.35-9.6,22.65,22.65,0,0,1,4.82-7h0a6.94,6.94,0,0,1,4.67-1.8A4.83,4.83,0,0,1,99.58,108a10.7,10.7,0,0,1,1.53,6A16.78,16.78,0,0,1,96.4,125.6Z"
                transform="translate(-18.85 -20.37)"
              />
              <path
                className="cls-1"
                d="M150.93,133q-3.09-1.8-3.1-10.93a44.3,44.3,0,0,1,2.08-14,9.78,9.78,0,0,0,.6-2.39q0-4.08-3.66-4.08a3.94,3.94,0,0,0-3.48,1.86c-.82,1.25-1.76,3.87-2.81,7.88a29.31,29.31,0,0,1-6.79,12q-5.21,5.88-8.26,5.87-1.94,0-1.93-4.67a38.71,38.71,0,0,1,1.17-6.42,69.29,69.29,0,0,1,2.2-7.75,21.91,21.91,0,0,0,1.76-7.1,4.11,4.11,0,0,0-1.21-2.73,4.17,4.17,0,0,0-3.26-1.35,4.61,4.61,0,0,0-4.39,3A45.51,45.51,0,0,1,118,112.73q-2.1,8.44-2.11,12.63,0,5.89,2.76,8.75t5.47,2.85a14.27,14.27,0,0,0,9-3.62,32.81,32.81,0,0,0,7.82-9.78,30.42,30.42,0,0,0,1.49,10.53c1,2.62,2.42,3.92,4.27,3.92a6.43,6.43,0,0,0,3.41-1.12c1.2-.75,1.8-1.55,1.8-2.39A1.73,1.73,0,0,0,150.93,133Z"
                transform="translate(-18.85 -20.37)"
              />
              <path
                className="cls-1"
                d="M171.78,105.7a14.34,14.34,0,0,1,6.89-2.11,3.81,3.81,0,0,1,1.51.5,3.73,3.73,0,0,0,1.37.49,4,4,0,0,0,2.3-1.09,3.16,3.16,0,0,0,1.36-2.46c0-3.45-2-5.17-6-5.17s-8.37,1.55-13,4.66-7,6.73-7,10.88a8.63,8.63,0,0,0,2,5.47q2,2.5,9.25,6c3.94,1.83,6,3.37,6.05,4.64q-1.17,1.55-4.78,2.6a24.6,24.6,0,0,1-6.93,1.06,7.49,7.49,0,0,1-2.6-.53,7.06,7.06,0,0,0-2.08-.49,4.38,4.38,0,0,0-3,1.19,3.72,3.72,0,0,0-1.34,2.89q0,4.6,6.36,4.6a34.71,34.71,0,0,0,15.6-3.43q6.93-3.42,6.94-8.56a7.84,7.84,0,0,0-1.94-5.13c-1.28-1.55-4-3.28-8-5.2a22.44,22.44,0,0,1-5.45-3.22,3.72,3.72,0,0,1-1.34-2.65Q168,107.81,171.78,105.7Z"
                transform="translate(-18.85 -20.37)"
              />
              <path
                className="cls-1"
                d="M219.76,122a3.73,3.73,0,0,0-2.6,1.41q-7,7.28-14,7.27a5.37,5.37,0,0,1-4-1.52,4.62,4.62,0,0,1-1.49-3.22,1.21,1.21,0,0,1,1.06-1.27,31.74,31.74,0,0,0,15-7.64q5.88-5.54,5.87-11.66a8.36,8.36,0,0,0-8.72-8.44q-7.91,0-14.87,8.62t-7,18.45q0,6.69,3.41,10.43a12,12,0,0,0,9.35,3.74,21.22,21.22,0,0,0,13.89-5.08c4.1-3.38,6.15-6.3,6.15-8.73C221.87,122.77,221.17,122,219.76,122Zm-16.55-13.43q3.72-4.5,6.78-4.5a2.08,2.08,0,0,1,1.67.79,3,3,0,0,1,.65,2q0,3-4.24,6.58a21.31,21.31,0,0,1-9.79,4.74A23.36,23.36,0,0,1,203.21,108.55Z"
                transform="translate(-18.85 -20.37)"
              />
              <circle className="cls-1" cx="45.97" cy="36.62" r="5.4" />
              <circle className="cls-1" cx="211.45" cy="99.07" r="5.4" />
            </svg>
          </Link>
          
          <div className="co_section">
            <p className="co_label">
              <strong>Contact</strong>
            </p>

            <div className="co_input">
              <input
                type="text"
                placeholder="Full name"
                value={name}
                onChange={(e) => {
                  setDirty(true);
                  setName(e.target.value);
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setDirty(true);
                  setEmail(e.target.value);
                }}
                disabled
              />
              <input
                type="tel"
                placeholder="Phone"
                value={phone}
                onChange={(e) => {
                  setDirty(true);
                  setPhone(e.target.value);
                }}
              />
            </div>

            
          </div>

          <div className="co_section">
            <div className="co_label_row">
              <p className="co_label">
                <strong>Shipping address</strong>
              </p>
            </div>

            {addrLoading ? (
              <div className="co_note muted">Loading your saved address…</div>
            ) : addresses.length === 0 ? (
              <div className="co_note">
                Bạn chưa có địa chỉ — bấm{" "}
                <button className="btn_link" onClick={openAddressModal}>
                  Add
                </button>
                .
              </div>
            ) : (
              <div className="co_note">
                Using your saved address..{" "}
                <button className="btn_style_2" onClick={openAddressModal}>
                  <span>Edit</span>
                </button>
              </div>
            )}

            <div className="co_input">
              <label for="">Street Address</label>
              <input
                type="text"
                placeholder="Street address"
                value={address}
                onChange={(e) => {
                  setDirty(true);
                  setAddress(e.target.value);
                }}
                disabled={lockAddr}
              />
              <label for="">Ward</label>

              <input
                type="text"
                placeholder="Ward"
                value={ward}
                onChange={(e) => {
                  setDirty(true);
                  setWard(e.target.value);
                }}
                disabled={lockAddr}

              />
              <label for="">City</label>

              <input
                type="text"
                placeholder="City"
                value={city}
                onChange={(e) => {
                  setDirty(true);
                  setCity(e.target.value);
                }}
                disabled={lockAddr}

              />
              <label for="">Country</label>

              <input
                type="text"
                placeholder="Country"
                value={country}
                onChange={(e) => {
                  setDirty(true);
                  setCountry(e.target.value);
                }}
                disabled={lockAddr}

              />
            </div>
          </div>
            
        </section>
        
        {/* RIGHT: items + voucher + totals */}
        <aside className="co_right">
          <ul className="co_items">
            {cart.map((it, i) => (
              <li className="co_item" key={i}>
                <div className="co_thumb">
                  <img src={it.image} alt={it.name} />
                </div>
                <div className="co_meta">
                  <p className="co_name">{it.name}</p>
                  {it.variant?.color && (
                    <p className="co_variant">Colour: {it.variant.color}</p>
                  )}
                   <div className="co_linepricemain">
                  ${Number(it.price)}
                </div>
                  {/* Qty controls */}
                  <div className="co_qty">
                    <button
                      type="button"
                      className="co_qty_btn"
                      onClick={() => decQty(i)}
                      aria-label="Decrease"
                    >
                      −
                    </button>
                    <input
                      className="co_qty_input"
                      type="number"
                      min="1"
                      max="99"
                      value={Number(it.qty) || 1}
                      onChange={(e) => setQty(i, e.target.value)}
                    />
                    <button
                      type="button"
                      className="co_qty_btn"
                      onClick={() => incQty(i)}
                      aria-label="Increase"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div class="co_linepricemain">
                    
                <div className="co_lineprice">
                  ${(Number(it.price) * (Number(it.qty) || 1)).toLocaleString()}
                </div>
                </div>
                
              </li>
            ))}
          </ul>

          {/* Voucher */}
          <div className="co_voucher">
            <p className="co_label">
              <strong>Voucher</strong>
            </p>

           

            {vLoading && (
              <div className="co_note muted">Đang tải voucher phù hợp…</div>
            )}
            {vError && <div className="co_note error">{vError}</div>}

            {!vLoading && !vError && eligible.length > 0 && (
              <>
                <ul className="co_voucher_list">
                  {list.map((v) => (
                    <li
                      key={v._id}
                      className={`co_voucher_item ${
                        applied && applied._id === v._id ? "applied" : ""
                      }`}
                    >
                      <div className="co_voucher_head">
                        <span className="co_vcode">{v.voucher_code}</span>
                        <span className="co_vval">
                          -%{Number(v.value || 0).toLocaleString()}
                        </span>
                      </div>
                      {v.description && (
                        <div className="co_vdesc">{v.description}</div>
                      )}
                      <div className="co_vlimits">
                        <small>
                          Min ${Number(v.min_total ?? 0).toLocaleString()} — Max
                          ${Number(v.max_total ?? 0).toLocaleString()}
                        </small>
                        <small> | Còn: {Number(v.quantity ?? 0)}</small>
                      </div>
                      <div className="co_voucher_row">

                      <button
                        className="btn_style_2"
                        onClick={() => applyVoucher(v)}
                        disabled={applied && applied._id === v._id}
                      >
                        <span>
                          {applied && applied._id === v._id
                            ? "Đã áp dụng"
                            : "Dùng mã"}
                        </span>
                      </button>
                        {applied && (
                          <button
                            className="btn_style_2"
                            onClick={clearVoucher}
                            title="Bỏ voucher"
                          >
                           <span>Remove</span> 
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
                {eligible.length > PREVIEW_COUNT && (
                  <button
                    className="btn_link"
                    onClick={() => setShowAllVouchers((s) => !s)}
                    style={{ marginTop: ".25rem" }}
                  >
                    {showAllVouchers
                      ? "Thu gọn"
                      : `Xem thêm ${eligible.length - PREVIEW_COUNT} mã`}
                  </button>
                )}
              </>
            )}

            {!vLoading && !vError && eligible.length === 0 && (
              <div className="co_note muted">
                None
              </div>
            )}
          </div>
          <p className="co_label">
              <strong>Payment Method</strong>
            </p>
          <label className="ua-radio">
              <input
                type="radio"
                name="pay"
                value="COD"
                checked={paymentMethod === "COD"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Cash on Delivery
            </label>

            <label className="ua-radio" style={{ marginTop: 8 }}>
              <input
                type="radio"
                name="pay"
                value="BANK_TRANSFER"
                checked={paymentMethod === "BANK_TRANSFER"}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              Bank Transfer
            </label>
          <div className="co_totals">
            <div>
              <span>Subtotal</span>
              <strong>${subtotal.toLocaleString()}</strong>
            </div>
            {applied ? (
              <div className="co_discount">
                <span>Discount ({applied.voucher_code})</span>
                <strong>-${discount.toLocaleString()}</strong>
              </div>
            ) : (
              <div className="co_discount">
                <span>Discount</span>
              </div>
            )}
            <div className="co_grand">
              <span>Total</span>
              <strong>${grandTotal.toLocaleString()}</strong>
            </div>
          </div>
          <div className="co_actions">
            <button
              className="btn_style_3 continue_btn"
              disabled={!canSubmit}
              onClick={handlePlaceOrder}
            >
              <span>Place Order</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Address modal in Checkout */}
      {showAddrModal && (
        <div
          className="ua-modal-backdrop"
          onClick={(e) =>
            e.target === e.currentTarget && setShowAddrModal(false)
          }
        >
          <div className="ua-modal" role="dialog" aria-modal="true">
            <div className="ua-modal-header">
              <h3>{addresses.length ? "Edit address" : "Add address"}</h3>
              <button
                className="ua-modal-x"
                onClick={() => setShowAddrModal(false)}
              >
                ×
              </button>
            </div>
            <div className="ua-modal-body grid">
              <label for="">Address</label>
              <input
                className="ua-input"
                placeholder="Address"
                value={addrAddress}
                onChange={(e) => setAddrAddress(e.target.value)}
                disabled={lockAddr}
              />
              <label for="">Ward</label>

              <input
                className="ua-input"
                placeholder="Ward"
                value={addrWard}
                onChange={(e) => setAddrWard(e.target.value)}
              />
              <label for="">City</label>

              <input
                className="ua-input"
                placeholder="City"
                value={addrCity}
                onChange={(e) => setAddrCity(e.target.value)}
              />
              <label for="">Country</label>

              <input
                className="ua-input"
                placeholder="Country"
                value={addrCountry}
                onChange={(e) => setAddrCountry(e.target.value)}
              />
              <label for="">Phone</label>

              <input
                className="ua-input"
                placeholder="Phone"
                value={addrPhone}
                onChange={(e) => setAddrPhone(e.target.value)}
              />
            </div>
            <div className="ua-modal-footer">
              <button
                className="ua-btn"
                onClick={() => setShowAddrModal(false)}
                disabled={addrSaving}
              >
                Cancel
              </button>
              <button
                className="ua-btn ua-btn-primary"
                onClick={saveAddressInCheckout}
                disabled={addrSaving}
              >
                {addrSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
