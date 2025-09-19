import React, { useState } from "react";
import "./UserProfile.css";

export default function UserProfile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="od-page">
      {/* Header */}
      <header className="od-header">
        <div className="od-header-inner">
          <div className="od-left">
            <img src="/logo.webp" alt="Logo" className="od-logo" />
            <nav className="od-nav">
              <a href="#" className="od-nav-link">Shop</a>
              <a href="#" className="od-nav-link">Your Account</a>
              <a href="#" className="od-nav-link active">Orders</a>
            </nav>
          </div>

          {/* Account avatar + dropdown */}
          <div className="od-account">
            <div
              className="od-account-circle"
              onClick={() => setOpen(!open)}
            >
              <img
                src="https://res.cloudinary.com/depbw3f5t/image/upload/v1757743780/86d6847a8b6f618b418dad34b931b048_hxwffu.jpg"
                alt="Avatar"
                className="od-avatar"
              />
            </div>

            {/* Dropdown */}
            <div className={`od-dropdown ${open ? "open" : ""}`}>
              <a href="#">Profile</a>
              <a href="#">Settings</a>
              <a href="#">Log out</a>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="od-main">
        <div className="od-container">
          <h2 className="od-title">Orders</h2>
          <div className="od-empty-card">
            <div className="od-empty-inner">
              <strong className="od-empty-head">No orders yet.</strong>
              <p className="od-empty-sub">Visit the store to place an order.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
