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
    <div className="co_wrap spacing margintop">
      <div className="co_grid">
        {/* LEFT: form */}
        <section className="co_left">
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
              <button className="btn_style_2" onClick={openAddressModal}>
                <span>Edit</span>
              </button>
            </div>

            {addrLoading ? (
              <div className="co_note muted">Loading your saved address…</div>
            ) : addresses.length === 0 ? (
              <div className="co_note">
                Bạn chưa có địa chỉ — bấm{" "}
                <button className="btn_style_2" onClick={openAddressModal}>
                  <span>Add</span>
                </button>
              </div>
            ) : (
              <>
                <div className="co_note"></div>

                <div className="co_addrview">
                  <div className="co_addrrow">
                    <span className="co_addrlabel">Full name</span>
                    <span className="co_addrval">
                      {name || user?.name || "—"}
                    </span>
                  </div>
                  <div className="co_addrrow">
                    <span className="co_addrlabel">Phone</span>
                    <span className="co_addrval">{phone || "—"}</span>
                  </div>
                  <div className="co_addrrow">
                    <span className="co_addrlabel">Street</span>
                    <span className="co_addrval">{address || "—"}</span>
                  </div>
                  <div className="co_addrrow">
                    <span className="co_addrlabel">Ward</span>
                    <span className="co_addrval">{ward || "—"}</span>
                  </div>
                  <div className="co_addrrow">
                    <span className="co_addrlabel">City</span>
                    <span className="co_addrval">{city || "—"}</span>
                  </div>
                  <div className="co_addrrow">
                    <span className="co_addrlabel">Country</span>
                    <span className="co_addrval">{country || "—"}</span>
                  </div>
                </div>
              </>
            )}
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
                  <div className="co_linepricemain">${Number(it.price)}</div>
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
                    <button
                      type="button"
                      className="co_remove"
                      onClick={() => removeItem(i)}
                      aria-label={`Remove ${it.name}`}
                      title="Remove"
                    >
                      X
                    </button>
                  </div>
                </div>
                <div class="co_linepricemain">
                  <div className="co_lineprice">
                    $
                    {(
                      Number(it.price) * (Number(it.qty) || 1)
                    ).toLocaleString()}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Voucher */}
          {!vLoading && !vError && eligible.length > 0 && (
            <div className="co_voucher">
              <p className="co_label">
                <strong>Voucher</strong>
              </p>

              <ul className="co_voucher_list">
                {list.map((v) => (
                  <li
                    key={v._id}
                    className={`co_voucher_item ${
                      applied
                        ? applied._id === v._id
                          ? "applied"
                          : "dimmed"
                        : ""
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
                        Min ${Number(v.min_total ?? 0).toLocaleString()} — Max $
                        {Number(v.max_total ?? 0).toLocaleString()}
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
                      {applied && applied._id === v._id && (
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
            </div>
          )}
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
