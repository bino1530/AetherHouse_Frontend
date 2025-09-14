import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Sign.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");   // Thông báo cho UI
  const [loading, setLoading] = useState(false); // Loading state

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("❌ Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("http://localhost:3000/api/users/registerUser", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setMessage("✅ Đăng ký thành công!");
      console.log("Kết quả:", res.data);
    } catch (error) {
      console.error("Chi tiết lỗi:", error.response?.data || error.message);

      // Lấy message chi tiết từ backend nếu có
      const backendMsg = error.response?.data?.message || error.response?.data || error.message;

      setMessage("❌ Có lỗi xảy ra: " + backendMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* Logo */}
        <img className="logo" src="./logo.webp" alt="logo" />

        {/* Tiêu đề */}
        <h2 className="title">Sign up</h2>
        <p className="subtitle">Create your account</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="name"
            placeholder="Full name"
            required
            value={formData.name}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            pattern="[^@]+@[^@]+\.[a-zA-Z]{2,63}" 
            title="Email phải hợp lệ (có @ và domain hợp lệ)"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password (ít nhất 8 ký tự)"
            required
            minLength="8"
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            required
            minLength="8"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Đang xử lý..." : "Sign Up"}
</button>
        </form>

        {/* Thông báo */}
        {message && <p className="message">{message}</p>}

        {/* Link Login */}
        <p className="policy">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
