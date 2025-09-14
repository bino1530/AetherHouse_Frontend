import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState(""); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/api/users/registerUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Đăng ký thành công:", data);
        setMessage("Đăng ký thành công!");
      } else {
        const err = await res.json();
        console.error("Lỗi:", err);
        setMessage("Có lỗi xảy ra: " + (err.message || "Không rõ"));
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      setMessage("Không kết nối được đến server.");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* Logo */}
        <img className="logo" src="./logo.webp" alt="" />

        {/* Tiêu đề */}
        <h2 className="title">Login</h2>
        <p className="subtitle">Choose how you'd to login</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            pattern="[^@]+@[^@]+\\.[a-zA-Z]{2,6}"
            title="Email phải chứa ký tự @"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password (8 digits)"
            required
            pattern="[0-9]{8}"
            title="Password phải gồm đúng 8 chữ số"
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit">Login</button>
        </form>

        {/* Thông báo */}
        {message && <p className="message">{message}</p>}

        {/* Chính sách */}
        <p className="policy">
          By signing up, you agree to our{" "}
          <Link to="/sign">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
