import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign Up Data:", formData);
  };

  return (
    <div className="signup-container  style={{ backgroundImage: `url(${bgImage})` }}">
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
            pattern="[^@]+@[^@]+\.[a-zA-Z]{2,6}"
            title="Email phải chứa ký tự @"
          />
          <input
            type="password"
            name="password"
            placeholder="Password (8 digits)"
            required
            pattern="[0-9]{8}"
            title="Password phải trên 8 chữ số"
          />
          <button type="submit">Login</button>
        </form>

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
