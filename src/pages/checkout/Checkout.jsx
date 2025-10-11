import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loadCart, saveCart } from "../../lib/cartStore.jsx";
import api from "../../lib/axios";
import "./Checkout.css";

const FORM_KEY = "ah_checkout_form";




const getCachedForm = () => {
  try { return JSON.parse(localStorage.getItem("checkout_form") || "{}"); }
  catch { return {}; }
};
const saveCachedForm = (obj) =>
  localStorage.setItem("checkout_form", JSON.stringify(obj));

const getDefaultAddress = (addresses = []) => {
  if (!Array.isArray(addresses) || addresses.length === 0) return null;
  const def = addresses.find(a => a?.is_default);
  return def || addresses[0];
};










// const readUser = () => {
//   try { return JSON.parse(localStorage.getItem("user") || "null"); }
//   catch { return null; }
// };

export default function CheckoutPage() {
 const navigate = useNavigate();
  const items = loadCart();
  const subtotal = items.reduce((s, it) => s + Number(it.price || 0) * (it.qty || 1), 0);

  const cachedUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") || "null"); }
    catch { return null; }
  })();

  const [loading, setLoading] = useState(true);
  const [addrLoading, setAddrLoading] = useState(true);
  const [addresses, setAddresses] = useState([]);
  const [user, setUser] = useState(cachedUser);
  const cached = getCachedForm();
  const [name, setName] = useState(cached.name || user?.name || "");
  const [email, setEmail] = useState(cached.email || user?.email || "");
  const [phone, setPhone] = useState(cached.phone || "");
  const [address, setAddress] = useState(cached.address || "");
  const [ward, setWard] = useState(cached.ward || "");
  const [city, setCity] = useState(cached.city || "");
  const [country, setCountry] = useState(cached.country || "");
  const [note, setNote] = useState(cached.note || "");
  const safeJSON = (k) => { try { return JSON.parse(localStorage.getItem(k) || "null"); } catch { return null; } };

  const [form, setForm] = useState(() => safeJSON(FORM_KEY) || {
    name: "", email: "", phone: "",
    address: "", ward: "", city: "", country: "",
    note: ""
  });

    useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }
    setLoading(false);
  }, [navigate]);



  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login", { replace: true });
      return;
    }
    setLoading(false);
  }, [navigate]);



  useEffect(() => {
    const id = cachedUser?._id;
    if (!id) { setAddrLoading(false); return; }
    let mounted = true;
    (async () => {
      try {
        const { data } = await api.get(`/users/${id}`);
        if (!mounted) return;
        const u = data?.user || cachedUser;
        setUser(u);
        const addrs = data?.addresses || [];
        setAddresses(addrs);
        const hasManual = !!localStorage.getItem("checkout_form");
        if (!hasManual || (!address && !city && !phone)) {
          const a = getDefaultAddress(addrs);
          if (a) {
            setName(u?.name || "");
            setEmail(u?.email || "");
            setPhone(a.phone || "");
            setAddress(a.address || "");
            setWard(a.ward || "");
            setCity(a.city || "");
            setCountry(a.country || "");
          }
        }
      } catch (e) {
        console.error("[Checkout] get user error", e);
      }
    })();
    return () => { mounted = false; };
  }, []);




  const canSubmit = useMemo(() => {
    return name && email && phone && address && city && country;
  }, [name, email, phone, address, city, country]);

  if (loading) return <div className="co_wrap pad margintop">Loading…</div>;



 const placeOrderDemo = () => {    
  if (!canSubmit) return; 
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
            <p className="co_label"><strong>Contact</strong></p>
            <div className="co_input">
              <input
                type="text" placeholder="Full name"
                value={name} onChange={(e) => setName(e.target.value)} 
              />
              <input
                type="email" placeholder="Email"
                value={email} onChange={(e) => setEmail(e.target.value)}
                disabled
              />
              <input
                type="tel" placeholder="Phone"
                value={phone} onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="co_section">
            <p className="co_label"><strong>Shipping address</strong></p>
            {addrLoading ? (
              <div className="co_note muted">Loading your saved address…</div>
            ) : addresses.length === 0 ? (
              <div className="co_note">
                You haven’t added any addresses yet.{" "}
                <Link to="/userprofile">Add address</Link>
              </div>
            ) : (
              <div className="co_note">
                Using your saved address.{" "}
                <Link to="/userprofile">Edit address</Link>
              </div>
            )}
            <div className="co_input">
              <input
                type="text" placeholder="Street address"
                value={address} onChange={(e) => setAddress(e.target.value)}
              />
              <div className="co_row2">
                <input
                  type="text" placeholder="Ward"
                  value={ward} onChange={(e) => setWard(e.target.value)}
                />
                <input
                  type="text" placeholder="City"
                  value={city} onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="co_input">
                <input
                  type="text" placeholder="Country"
                  value={country} onChange={(e) => setCountry(e.target.value)}
                />
              </div>
            </div>
          </div>
          

          <div className="co_actions">
            <button
              className="btn_style_3 continue_btn"
              disabled={!canSubmit}
              onClick={placeOrderDemo}
            >
              <span>Place Order</span>
            </button>
          </div>
        </section>

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
                  {it.variant?.color && (
                    <p className="co_variant">
                      Colour: {it.variant.color}
                    </p>
                  )}
                </div>
                <div className="co_lineprice">£{(it.price * it.qty).toLocaleString()}</div>
              </li>
            ))}
          </ul>

          <div className="co_totals">
            <div><span>Subtotal</span><strong>£{subtotal.toLocaleString()}</strong></div>
            <div className="co_discount"><span>Shipping</span><strong>Calculated next</strong></div>
            <div className="co_grand"><span>Total</span><strong>£{subtotal.toLocaleString()}</strong></div>
          </div>
        </aside>
      </div>
    </div>
  );
}
