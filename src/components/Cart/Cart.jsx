import React, { useEffect, useState } from "react";
import "./Cart.css";
import { loadCart, saveCart } from "../../lib/cartStore.jsx";
import { useNavigate } from "react-router-dom";

const CART_KEY = "ah_cart_v1";

const Cart = ({ isOpen, toggleCart }) => {
  const [items, setItems] = useState([]);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [pending, setPending] = useState({});
  const navigate = useNavigate();

  const setPendingFlag = (i, val) =>
    setPending((prev) => ({ ...prev, [i]: val }));
  useEffect(() => {
    if (isOpen) setItems(loadCart());
  }, [isOpen]);
  const updateQtySlow = (i, delta) => {
    if (pending[i]) return;
    setPendingFlag(i, true);

    setTimeout(() => {
      const next = [...items];
      next[i].qty = Math.max(1, (next[i].qty || 1) + delta);
      setItems(next);
      saveCart(next);
      setPendingFlag(i, false);
    }, 1000);
  };

  const removeItem = (i) => {
    if (pending[i]) return;
    const next = items.filter((_, idx) => idx !== i);
    setItems(next);
    saveCart(next);
  };

  const subtotal = items.reduce(
    (s, it) => s + Number(it.price || 0) * (it.qty || 1),
    0
  );

  return (
    <>
      {isOpen && <div className="cart_overlay" onClick={toggleCart} />}
      <div className={`cart_panel ${isOpen ? "open" : ""}`}>
        <div className="cart_header">
          <h1>Bag</h1>
          <button className="cart_close" onClick={toggleCart}>
            ✕
          </button>
        </div>

        <div className="cart_body">
          {items.length === 0 ? (
            <p className="cart_empty">Your bag is empty</p>
          ) : (
            items.map((item, i) => (
              <div className="cart_item" key={i}>
                <img src={item.image} alt={item.name} />
                <div className="cart_info">
                  <p className="cart_name">
                    <strong>{item.name}</strong>
                  </p>
                  {item?.variant?.color && (
                    <p className="cart_variant">
                      {/* swatch màu (nếu có hex) */}
                      <span
                        className="cart_variant__swatch"
                        style={{ backgroundColor: item.variant.hex || "#ccc" }}
                        aria-label={item.variant.color}
                        title={item.variant.color}
                      />
                      <span className="cart_variant__label">
                        {item.variant.color}
                      </span>
                    </p>
                  )}
                  <p className="cart_price">
                    ${Number(item.price).toLocaleString()}
                  </p>
                </div>
                <div className="cart_actions">
                  <button
                    className="qty_btn"
                    disabled={!!pending[i]}
                    onClick={() => updateQtySlow(i, -1)}
                  >
                    -
                  </button>

                  <span className="qty_wrap">
                    {pending[i] ? (
                      <span className="qty_spinner" aria-label="Updating…" />
                    ) : (
                      item.qty
                    )}
                  </span>

                  <button
                    className="qty_btn"
                    disabled={!!pending[i]}
                    onClick={() => updateQtySlow(i, +1)}
                  >
                    +
                  </button>

                  <button
                    className="btn_style_1 delete_btn"
                    disabled={!!pending[i]}
                    onClick={() => removeItem(i)}
                  >
                    <span>X</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart_footer">
            <div className="subtotal">
              <span>Subtotal</span>
              <strong>${subtotal.toLocaleString()}</strong>
            </div>
            <button
              className="btn_style_3 checkout_btn"
              onClick={() => {
                if (loadingCheckout) return;
                setLoadingCheckout(true); // 👈 bật loading
                setTimeout(() => {
                  setLoadingCheckout(false);
                  toggleCart(); // đóng giỏ
                  navigate("/checkout"); // chuyển trang
                }, 1000); // chờ 1s
              }}
            >
              <span>{loadingCheckout ? "Loading..." : "Checkout"}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
