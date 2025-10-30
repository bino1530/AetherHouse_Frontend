import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import "./UserProfile.css";
import api from "../../lib/axios";

export default function UserProfile() {
  const VALID_TABS = new Set(["shop", "account", "orders"]);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = (() => {
    const q = (searchParams.get("tab") || "").toLowerCase();
    return VALID_TABS.has(q) ? q : "account";
  })();

  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    const q = (searchParams.get("tab") || "").toLowerCase();
    if (VALID_TABS.has(q) && q !== tab) setTab(q);
  }, [searchParams, tab]);

  const goTab = (t) => {
    if (!VALID_TABS.has(t)) t = "account";
    if (t !== tab) setTab(t);
    const next = new URLSearchParams(searchParams);
    next.set("tab", t);
    setSearchParams(next, { replace: true });
  };

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);

  const [avatarFiles, setAvatarFiles] = useState([]);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [avatarErr, setAvatarErr] = useState("");
  const [savingAvatar, setSavingAvatar] = useState(false);

  // Name edit
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const [nameErr, setNameErr] = useState("");
  const [showNameModal, setShowNameModal] = useState(false);

  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem("user") || "null");
    const id = cached?._id;
    const hasToken = !!localStorage.getItem("token");
    if (!hasToken || !id) return navigate("/login", { replace: true });

    api
      .get(`/users/${id}`)
      .then(({ data }) => {
        const user = data?.user ?? cached;
        setUser(user);
        setAddress(data?.addresses || []);
        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch((err) => {
        console.error("Lỗi khi lấy user:", err);
      });
  }, [navigate]);

  // AVATAR

  const handleOpenPicker = () => {
    fileInputRef.current?.click();
  };

  const handlePickAvatar = (e) => {
    const files = Array.from(e.target.files || []);
    setAvatarErr("");
    setAvatarFiles(files);
    const first = files[0];
    if (first && first.type.startsWith("image/")) {
      setAvatarPreview(URL.createObjectURL(first));
    } else {
      setAvatarPreview("");
    }
  };

  const handleSaveAvatar = async () => {
    const first = avatarFiles[0];
    if (!first || !user?._id) return setAvatarErr("Chưa chọn file.");
    try {
      setSavingAvatar(true);
      const form = new FormData();
      form.append("avatar", first);
      const { data } = await api.put(`/users/${user._id}/avataruser`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const current = JSON.parse(localStorage.getItem("user") || "{}");
      const merged = {
        ...current,
        ...data.user,
        avatar: data?.user?.avatar || current.avatar,
      };
      localStorage.setItem("user", JSON.stringify(merged));
      window.location.reload();
    } catch (err) {
      setAvatarErr(err?.response?.data?.message || "Cập nhật avatar thất bại.");
    } finally {
      setSavingAvatar(false);
    }
  };
  const avatarUrl = user?.avatar?.url || "";

  // NAME

  const handleCancelEditName = () => {
    setEditingName(false);
    setNewName("");
    setNameErr("");
  };

  const openNameModal = () => {
    setNameErr("");
    setNewName(user?.name || "");
    setShowNameModal(true);
  };

  const closeNameModal = () => {
    setShowNameModal(false);
    setNameErr("");
  };

  const handleSaveName = async () => {
    try {
      setSavingName(true);
      await api.put(`/users/${user._id}/infor`, {
        name: newName.trim(),
        email: user.email,
      });
      const updatedUser = {
        ...JSON.parse(localStorage.getItem("user") || "{}"),
        name: newName.trim(),
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setShowNameModal(false);
      window.location.reload();
    } catch (err) {
      setNameErr(err?.response?.data?.error || "Cập nhật name thất bại.");
    } finally {
      setSavingName(false);
    }
  };

  const [addressList, setAddress] = useState([]);
  const [addressValue, setAddressValue] = useState("");
  const [wardValue, SetWardValue] = useState("");
  const [countryValue, SetCountryValue] = useState("");
  const [phoneValue, SetPhoneValue] = useState("");
  const [cityValue, SetCityValue] = useState("");
  const [loading, SetLoading] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const id = JSON.parse(localStorage.getItem("user") || "{}")?._id;
  console.log(id);

  const handleSaveAddress = async () => {
    try {
      SetLoading(true);
      console.log(id);
      const payload = {
        name: user?.name,
        address: addressValue,
        city: cityValue,
        ward: wardValue,
        country: countryValue,
        phone: phoneValue,
        user_id: id,
      };
      if (addressList.length === 0) {
        await api.post("/address", payload);
      } else {
        await api.put(`/address/${addressList[0]._id}/upaddress`, payload);
      }
      const { data } = await api.get(`/users/${id}`);
      setAddress(data?.addresses || []);
      setShowAddressModal(false);
    } catch (err) {
      alert("Lưu address thất bại!", err);
    } finally {
      SetLoading(false);
    }
  };

  const openAddressModal = () => {
    const a = addressList[0];
    setAddressValue(a?.address || "");
    SetWardValue(a?.ward || "");
    SetCountryValue(a?.country || "");
    SetPhoneValue(a?.phone || "");
    SetCityValue(a?.city || "");
    setShowAddressModal(true);
  };

  // ==== ORDERS (history) ====
  const [orders, setOrders] = useState([]);
  const [oLoading, setOLoading] = useState(false);
  const [oErr, setOErr] = useState("");
  // optional: phân trang (nếu BE có)
  const [oPage, setOPage] = useState(1);
  const O_LIMIT = 10;

  const fetchOrders = async (page = 1) => {
    try {
      setOLoading(true);
      setOErr("");
      // nếu BE hỗ trợ phân trang ?page=&limit=, giữ params; nếu không BE sẽ bỏ qua
      const { data } = await api.get("/orders/me/list", {
        params: { page, limit: O_LIMIT },
      });
      // data có thể là { orders: [], meta: {} } hoặc [] thuần
      const list = Array.isArray(data) ? data : data?.orders || [];
      setOrders(list);
      // nếu có meta có thể set tiếp:
      // setOMeta(data?.meta || null);
    } catch (err) {
      console.error("[Orders] getMyOrders error:", {
        url: err?.config?.url,
        method: err?.config?.method,
        status: err?.response?.status,
        data: err?.response?.data,
      });
      setOErr(
        err?.response?.data?.message ||
          err?.message ||
          "Không tải được đơn hàng."
      );
      setOrders([]);
    } finally {
      setOLoading(false);
    }
  };

  // auto fetch khi chuyển sang tab "orders"
  useEffect(() => {
    if (tab === "orders") {
      fetchOrders(oPage);
    }
  }, [tab, oPage]);

  const money = (n = 0) => `$${Number(n || 0).toLocaleString()}`;
  const fmtDate = (s) => {
    try {
      return new Date(s).toLocaleString();
    } catch {
      return s || "";
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  const handleLogout = () => {
    const token = localStorage.getItem("token");
    const p = token ? api.post("/auth/logout") : Promise.resolve();

    p.catch((err) => console.error("Logout failed:", err)).finally(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("token_expiry");
      window.location.href = "/";
    });
  };

  useEffect(() => {
    function onDocClick(e) {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  localStorage.setItem("address_updated", "1");

  return (
    <div className="od-page">
      {/* Header */}
      <header className="od-header">
        <div className="od-header-inner">
          <div className="od-left">
            <Link to="/">
              <svg
                id="layer_1"
                className="od-logo"
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
            <nav className="od-nav">
              
              
            </nav>
          </div>

          <div
            className="od-account"
            style={{ position: "relative" }}
            ref={dropdownRef}
          >
            <div
              className="od-account-circle"
              onClick={() => setOpen((v) => !v)}
            >
              <img src={avatarUrl} alt="Avatar" className="od-avatar" />
            </div>

            <div className={`od-dropdown ${open ? "open" : ""}`}>
              <button
                type="button"
                className={` ${tab === "orders" ? "active" : ""}`}
                onClick={() => goTab("orders")}
              >
                Orders
              </button>
              <button
                type="button"
                className={` ${tab === "account" ? "active" : ""}`}
                onClick={() => goTab("account")}
              >
                Your Account
              </button>
              <button
                onClick={() => {
                  setTab("account");
                  setOpen(false);
                }}
              >
                Profile
              </button>

              <button onClick={handleLogout}>Log out</button>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="od-main">
        <div className="od-container">
          {tab === "orders" && (
            <>
              <h2 className="od-title">Orders</h2>

              {oLoading && (
                <div className="od-empty-card">
                  <div className="od-empty-inner">
                    <strong className="od-empty-head">Loading…</strong>
                    <p className="od-empty-sub">Đang tải lịch sử mua hàng.</p>
                  </div>
                </div>
              )}

              {oErr && !oLoading && (
                <div className="od-empty-card od-error">
                  <div className="od-empty-inner">
                    <strong className="od-empty-head">Oops</strong>
                    <p className="od-empty-sub">{oErr}</p>
                    <button
                      className="ua-btn"
                      onClick={() => fetchOrders(oPage)}
                    >
                      Thử lại
                    </button>
                  </div>
                </div>
              )}

              {!oLoading && !oErr && orders.length === 0 && (
                <div className="od-empty-card">
                  <div className="od-empty-inner">
                    <strong className="od-empty-head">No orders yet.</strong>
                    <p className="od-empty-sub">
                      Visit the store to place an order.
                    </p>
                    <Link
                      to="/"
                      className="ua-btn ua-btn-primary"
                      style={{ marginTop: 8 }}
                    >
                      Go to shop
                    </Link>
                  </div>
                </div>
              )}

              {!oLoading && !oErr && orders.length > 0 && (
                <div className="od-orders-list">
                  {orders.map((o) => (
                    <Link
                      to={`/ordersuccess/${o?._id}`}
                      key={o?._id}
                      className="od-order-row"
                    >
                      <div className="od-order-col od-order-main">
                        <div className="od-order-id">#{o?._id}</div>
                        <div className="od-order-date">
                          {fmtDate(o?.createdAt)}
                        </div>
                        <div className="od-order-total">
                          {money(o?.total_amount)}
                        </div>
                      </div>

                      <div className="od-order-col od-order-mid">
                        <span
                          className={`od-badge od-badge--${
                            o?.status || "pending"
                          }`}
                        >
                          {o?.status || "pending"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </>
          )}
          {tab === "account" && (
            <>
              <h1 className="od-title">Your Account</h1>
              <section className="ua-grid">
                <div className="ua-card">
                  <p className="ua-card-title">
                    <strong>Avatar</strong>
                  </p>

                  <div className="ua-uploader">
                    {/* Wrapper để tạo overlay */}
                    <div className="ua-img-wrap" onClick={handleOpenPicker}>
                      <img
                        src={avatarPreview || avatarUrl}
                        alt="Avatar"
                        className="ua-uploader-img"
                      />
                      <div className="ua-img-overlay">
                        <span>Thay đổi hình</span>
                      </div>
                    </div>

                    {/* input file ẩn */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handlePickAvatar}
                      disabled={savingAvatar}
                    />

                    <div className="ua-uploader-right">
                      {avatarErr && <p className="ua-error">{avatarErr}</p>}
                      <button
                        className="ua-btn ua-btn-primary"
                        onClick={handleSaveAvatar}
                        disabled={!avatarFiles.length || savingAvatar}
                      >
                        {savingAvatar ? "Saving..." : "Save Avatar"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="ua-card">
                  <div className="ua-header">
                    {/* Hàng Name */}
                    <div className="ua-row">
                      <div className="ua-col-left">
                        <p className="ua-name">
                          <strong>
                            Name
                            <button
                              type="button"
                              className="ua-icon-btn"
                              title="Edit name"
                              onClick={openNameModal}
                            >
                              <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.004 1.004 0 0 0 0-1.42l-2.34-2.34a1.004 1.004 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                              </svg>
                            </button>
                          </strong>
                        </p>
                      </div>

                      {!editingName ? (
                        <div className="ua-col-right ua-inline">
                          <p className="ua-name">{user?.name || "User"}</p>
                        </div>
                      ) : (
                        <div className="ua-col-right">
                          <div className="ua-inline">
                            <input
                              className="ua-input"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              placeholder="Nhập tên mới"
                            />
                            <button
                              className="ua-btn ua-btn-primary"
                              onClick={handleSaveName}
                              disabled={savingName}
                            >
                              {savingName ? "Saving..." : "Save"}
                            </button>
                            <button
                              className="ua-btn"
                              onClick={handleCancelEditName}
                              disabled={savingName}
                            >
                              Cancel
                            </button>
                          </div>
                          {nameErr && (
                            <p className="ua-error" style={{ marginTop: 6 }}>
                              {nameErr}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="ua-row" style={{ marginTop: 16 }}>
                      <div className="ua-col-left">
                        <p className="ua-name">
                          <strong>Email</strong>
                        </p>
                      </div>
                      <div className="ua-col-right">
                        <p className="ua-email">
                          {user?.email || "no-email@example.com"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ua-card">
                  <p className="ua-card-title">
                    Address
                    <button className="ua-btn" onClick={openAddressModal}>
                      {addressList.length ? "Edit" : "+ Add"}
                    </button>
                  </p>

                  {addressList.length ? (
                    <div className="ua-muted">
                      <div>Address: {addressList[0].address}</div>
                      <div>Ward: {addressList[0].ward}</div>
                      <div>City: {addressList[0].city}</div>
                      <div>Country: {addressList[0].country}</div>
                      <div>Phone: {addressList[0].phone}</div>
                    </div>
                  ) : (
                    <p className="ua-muted">
                      You haven’t added any addresses yet.
                    </p>
                  )}
                </div>
              </section>
            </>
          )}

          {tab === "shop" && (
            <>
              <h2 className="od-title">Shop</h2>
              <div className="od-empty-card">
                <div className="od-empty-inner">
                  <strong className="od-empty-head">Coming soon.</strong>
                  <p className="od-empty-sub">We’re building this page.</p>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {showNameModal && (
        <div
          className="ua-modal-backdrop"
          onClick={(e) => e.target === e.currentTarget && closeNameModal()}
        >
          <div
            className="ua-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ua-modal-title"
          >
            <div className="ua-modal-header">
              <h3 id="ua-modal-title">Edit profile</h3>
              <button
                className="ua-modal-x"
                onClick={closeNameModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="ua-modal-body">
              <label className="ua-name">Name</label>
              <input
                className="ua-input ua-input-lg"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Your name"
                autoFocus
              />

              <label className="ua-name" style={{ marginTop: 12 }}>
                Email
              </label>
              <input
                className="ua-input ua-input-lg"
                value={user?.email || ""}
                disabled
              />

              <p className="ua-muted" style={{ marginTop: 6 }}>
                Email can’t be edited
              </p>

              {nameErr && (
                <p className="ua-error" style={{ marginTop: 8 }}>
                  {nameErr}
                </p>
              )}
            </div>

            <div className="ua-modal-footer">
              <button
                className="ua-btn"
                onClick={closeNameModal}
                disabled={savingName}
              >
                Cancel
              </button>
              <button
                className="ua-btn ua-btn-primary"
                onClick={handleSaveName}
                disabled={savingName}
              >
                {savingName ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* address modal */}
      {showAddressModal && (
        <div
          className="ua-modal-backdrop"
          onClick={(e) =>
            e.target === e.currentTarget && setShowAddressModal(false)
          }
        >
          <div className="ua-modal">
            <div className="ua-modal-header">
              <h3>{addressList.length ? "Edit address" : "Add address"}</h3>
              <button
                className="ua-modal-x"
                onClick={() => setShowAddressModal(false)}
              >
                ×
              </button>
            </div>

            <div className="ua-modal-body grid">
              <input
                className="ua-input"
                placeholder="Address"
                value={addressValue}
                onChange={(e) => setAddressValue(e.target.value)}
              />
              <input
                className="ua-input"
                placeholder="Ward"
                value={wardValue}
                onChange={(e) => SetWardValue(e.target.value)}
              />
              <input
                className="ua-input"
                placeholder="City"
                value={cityValue}
                onChange={(e) => SetCityValue(e.target.value)}
              />
              <input
                className="ua-input"
                placeholder="Country"
                value={countryValue}
                onChange={(e) => SetCountryValue(e.target.value)}
              />
              <input
                className="ua-input"
                placeholder="Phone"
                value={phoneValue}
                onChange={(e) => SetPhoneValue(e.target.value)}
              />
            </div>

            <div className="ua-modal-footer">
              <button
                className="ua-btn"
                onClick={() => setShowAddressModal(false)}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                className="ua-btn ua-btn-primary"
                onClick={handleSaveAddress}
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
