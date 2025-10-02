import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadCart, saveCart } from "../../lib/cartStore.jsx";
import "./Checkout.css";

const readUser = () => {
  try { return JSON.parse(localStorage.getItem("user") || "null"); }
  catch { return null; }
};

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [form, setForm] = useState(() => {
    const raw = localStorage.getItem("ah_checkout_form");
    return raw ? JSON.parse(raw) : {
      email: readUser()?.email || "",
      country: "United Kingdom",
      first_name: "", last_name: "",
      address: "", apt: "", city: "", postal: "",
    };
  });

  useEffect(() => {
    const list = loadCart();
    setItems(list);
    if (!list.length) navigate("/");
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem("ah_checkout_form", JSON.stringify(form));
  }, [form]);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + Number(it.price || 0) * (it.qty || 1), 0),
    [items]
  );

  const hasAddr = form.address.trim().length > 0;
  const shipping = hasAddr ? 4.95 : null; // demo
  const total = Math.max(0, subtotal - discount) + (shipping ?? 0);

  const applyCode = () => {
    const c = code.trim().toUpperCase();
    if (!c) return;
    if (c === "AETHER10") setDiscount(Math.round(subtotal * 0.1));
    else if (c === "FREESHIP" && hasAddr) setDiscount(0);
    else { alert("Code không hợp lệ"); setDiscount(0); }
  };

  const onChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const placeOrderDemo = () => {    
    const orderId = "AH" + Date.now();
    saveCart([]);
    localStorage.removeItem("ah_checkout_form");
    navigate(`/order-success/${orderId}`, { replace: true });
  };

  return (
    <div className="co_wrap margintop pad">
      <div className="co_grid">
        {/* LEFT: form */}
        <section className="co_left">
          <Link to="/" className="co_logo">AetherHouse</Link>

          <div className="co_section">
            <h3 className="co_label">Express checkout</h3>
            <div className="co_express">
              <button className="btn_chip">Shop</button>
              <button className="btn_chip">PayPal</button>
              <button className="btn_chip dark">G Pay</button>
            </div>
            <div className="co_divider"><span>OR</span></div>
          </div>

          <div className="co_section">
            <div className="co_input">
              <input
                name="email" value={form.email} onChange={onChange}
                placeholder="Email"
              />
            </div>
          </div>

          <div className="co_section">
            <h3 className="co_label">Delivery</h3>

            <div className="co_input">
              <select name="country" value={form.country} onChange={onChange}>
                <option>United Kingdom</option>
                <option>United States</option>
                <option>Viet Nam</option>
              </select>
            </div>

            <div className="co_row2">
              <div className="co_input">
                <input name="first_name" value={form.first_name} onChange={onChange} placeholder="First name" />
              </div>
              <div className="co_input">
                <input name="last_name" value={form.last_name} onChange={onChange} placeholder="Last name" />
              </div>
            </div>

            <div className="co_input">
              <input name="address" value={form.address} onChange={onChange} placeholder="Address" />
            </div>

            <div className="co_input">
              <input name="apt" value={form.apt} onChange={onChange} placeholder="Apartment, suite, etc. (optional)" />
            </div>

            <div className="co_row3">
              <div className="co_input">
                <input name="city" value={form.city} onChange={onChange} placeholder="City" />
              </div>
              <div className="co_input">
                <input name="postal" value={form.postal} onChange={onChange} placeholder="Postal code" />
              </div>
            </div>
          </div>

          <div className="co_actions">
            <button className="btn_style_2 continue_btn" onClick={placeOrderDemo}>
              <span>Continue to payment</span>
            </button>
          </div>
        </section>

        {/* RIGHT: summary */}
        <aside className="co_right">
          <ul className="co_items">
            {items.map((it, i) => (
              <li className="co_item" key={i}>
                <div className="co_thumb">
                  <img src={it.image} alt={it.name} />
                  <span className="co_qtypill">{it.qty}</span>
                </div>
                <div className="co_meta">
                  <p className="co_name">{it.name}</p>
                  <small className="co_variant">Small / Fluoro</small>
                </div>
                <div className="co_lineprice">£{(it.price * it.qty).toLocaleString()}</div>
              </li>
            ))}
          </ul>

          <div className="co_code">
            <input
              placeholder="Discount code or gift card"
              value={code}
              onChange={(e)=>setCode(e.target.value)}
            />
            <button className="co_apply" onClick={applyCode}>Apply</button>
          </div>

          <div className="co_totals">
            <div><span>Subtotal</span><strong>{subtotal.toLocaleString()}$</strong></div>
  
            {discount > 0 && (
              <div className="co_discount">
                <span>Discount</span><strong>-{discount.toLocaleString()}$</strong>
              </div>
            )}
            <div className="co_grand">
              <span>Total</span>
              <strong>{total.toLocaleString()}$</strong>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
