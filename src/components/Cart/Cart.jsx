import React from "react";
import "./Cart.css";

const Cart = ({ isOpen, toggleCart, items = [] }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      {isOpen && <div className="cart_overlay" onClick={toggleCart}></div>}

      <div className={`cart_panel ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="cart_header">
          <h1>Bag</h1>
          <button className="cart_close" onClick={toggleCart}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="cart_body">
          {items.length === 0 ? (
            <p className="cart_empty">Your bag is empty</p>
          ) : (
            items.map((item, i) => (
              <div className="cart_item" key={i}>
                <img src={item.image} alt={item.name} />
                <div className="cart_info">
                  <p className="cart_name">{item.name}</p>
                  <small className="cart_desc">{item.desc}</small>
                  <p className="cart_price">£{item.price}</p>
                </div>

                <div className="cart_actions">
                  <button>-</button>
                  <span>{item.qty}</span>
                  <button>+</button>
                  <button className="delete_btn">🗑</button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart_footer">
            <div className="subtotal">
              <span>Subtotal</span>
              <strong>£{subtotal.toLocaleString()}</strong>
            </div>
            <button className="checkout_btn">Checkout</button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
