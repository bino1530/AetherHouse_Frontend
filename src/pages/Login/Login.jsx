import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../lib/axios";
import "./Login.css";

const MIN_PASS = 6;

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ error: "", success: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (msg.error || msg.success) setMsg({ error: "", success: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg({ error: "", success: "" });

    const email = form.email.trim();
    const password = form.password;

    if (!email) return setMsg({ error: "Vui lòng nhập email", success: "" });
    if (password.length < MIN_PASS)
      return setMsg({
        error: `Mật khẩu phải ≥ ${MIN_PASS} ký tự`,
        success: "",
      });

    try {
      setLoading(true);
      const { data } = await api.post("/auth/login", { email, password });

      if (data?.accessToken) localStorage.setItem("token", data.accessToken);
      localStorage.setItem("user", JSON.stringify(data));
      setMsg({ error: "", success: "Đăng nhập thành công!" });
      setTimeout(() => navigate("/userprofile", { replace: true }), 300);
    } catch (err) {
      const errorText =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Đăng nhập thất bại. Vui lòng thử lại.";
      setMsg({ error: errorText, success: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="signup-container"
      style={{
        backgroundImage:
          "url(https://res.cloudinary.com/depbw3f5t/image/upload/v1757577575/background_2_efgu4s.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="signup-box">
        {/* Logo */}
        <img className="logo" src="./logo.webp" alt="Logo" />

        {/* Tiêu đề */}
        <h2 className="title">Login</h2>
        <p className="subtitle">Welcome back! Please log in.</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder={`Password (≥ ${MIN_PASS} ký tự)`}
            value={form.password}
            onChange={handleChange}
            required
          />

          {msg.success && <p className="success">{msg.success}</p>}
          {msg.error && <p className="error">{msg.error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Login"}
          </button>
        </form>

        {/* Liên kết */}
        <p className="policy">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
