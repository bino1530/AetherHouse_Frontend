import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../../lib/axios";
import "./Order.css";

const toMoney = (n = 0) => `$${Number(n || 0).toLocaleString()}`;

export default function OrderSuccess() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [order, setOrder] = useState(null);
  const [details, setDetails] = useState([]);

  // voucher detail (nếu có)
  const [voucher, setVoucher] = useState(null);
  const [vLoading, setVLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await api.get(`/orders/${id}`);
        if (!mounted) return;
        const ord = data?.order || null;
        setOrder(ord);
        setDetails(data?.orderDetails || []);

        // nếu có voucher_id → fetch chi tiết để lấy voucher_code/value/desc
        if (ord?.voucher_id) {
          setVLoading(true);
          try {
            const { data: vData } = await api.get(`/vouchers/${ord.voucher_id}`);
            if (mounted) setVoucher(vData || null);
          } catch (e) {
            // không cần throw — chỉ là info phụ
            console.warn("[OrderSuccess] fetch voucher failed", e);
          } finally {
            if (mounted) setVLoading(false);
          }
        } else {
          setVoucher(null);
        }
      } catch (err) {
        console.error("[OrderSuccess] Axios error:", {
          url: err?.config?.baseURL + err?.config?.url,
          method: err?.config?.method,
          message: err?.message,
          code: err?.code,
          stack: err?.stack,
        });
        setErr("Không lấy được thông tin đơn hàng. " + (err?.message || ""));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  // Tính subtotal từ chi tiết
  const subtotal = useMemo(() => {
    return details.reduce(
      (s, d) => s + Number(d.price || 0) * Number(d.quantity || 0),
      0
    );
  }, [details]);

  // Tính discount từ chênh lệch subtotal và total_amount (fallback nếu BE không lưu discount)
  const discount = useMemo(() => {
    const final = Number(order?.total_amount || 0);
    const sub = Number(subtotal || 0);
    const d = sub - final;
    return d > 0 ? d : 0;
  }, [order?.total_amount, subtotal]);

  if (loading) return <div className="os_wrap pad ">Đang tải...</div>;
  if (err)
    return (
      <div className="os_wrap pad =" style={{ color: "red" }}>
        {err}
      </div>
    );

  const addr = order?.address_id || {};

  return (
    <div className="os_wrap spacing margintop">
        <h1>Your Order</h1>
        <p className="order_id"><strong>{order?.order_code}</strong></p>
      <div className="os_summary">
     
        <div className="os_row">
          <span>Trạng thái</span>
          <strong
            className={`os_status os_status--${order?.status || "pending"}`}
          >
            {order?.status || "pending"}
          </strong>
        </div>

        {(order?.voucher_id || discount > 0) && (
          <div className="os_row">
            <span>Voucher</span>
            <strong>
              {vLoading
                ? "Đang tải…"
                : voucher?.voucher_code || "Đã áp dụng voucher"}
            </strong>
          </div>
        )}

        {/* Tổng tiền cuối */}
        <div className="os_row">
          <span>Tổng tiền</span>
          <strong>{toMoney(order?.total_amount || subtotal)}</strong>
        </div>
      </div>

      <div className="os_grid">
        <section className="os_card">
          <h3>Địa chỉ giao hàng</h3>
          {addr ? (
            <div className="os_addr">
              <div>{addr.name}</div>
              <div>{addr.phone}</div>
              <div>{addr.address}</div>
              <div>
                {addr.ward}, {addr.city}
              </div>
              <div>{addr.country}</div>
            </div>
          ) : (
            <p className="muted">Không có địa chỉ.</p>
          )}
        </section>

        <section className="os_card">
          <h3>Sản phẩm</h3>
          {!details.length ? (
            <p className="muted">Không có sản phẩm trong đơn.</p>
          ) : (
            <ul className="os_items">
              {details.map((d) => {
                const p = d.product_id || {};
                const v = d.productvariant_id || {};
                return (
                  <li key={d._id} className="os_item">
                    <div className="os_item_meta">
                      <div className="os_item_name">{p.name || "Sản phẩm"}</div>
                      {v?.color && (
                        <div className="os_item_variant">Màu: {v.color}</div>
                      )}
                      <div className="os_item_qty">x{d.quantity}</div>
                    </div>
                    <div className="os_item_price">
                      {toMoney(d.price * d.quantity)}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="os_totals">
            <div>
              <span>Subtotal</span>
              <strong>{toMoney(subtotal)}</strong>
            </div>

            {/* Hàng Voucher/Discount (nếu có) */}
            {(order?.voucher_id || discount > 0) && (
              <div className="os_discount">
                <span>
                  Discount
                  {voucher?.voucher_code ? ` (${voucher.voucher_code})` : ""}
                </span>
                <strong>-{toMoney(discount)}</strong>
              </div>
            )}

          

            <div className="os_grand">
              <span>Total</span>
              <strong>{toMoney(order?.total_amount || subtotal)}</strong>
            </div>
          </div>
        </section>
      </div>

      {/* Nếu muốn, bạn có thể show mô tả voucher bên dưới */}
      {voucher?.description && (
        <div className="os_note">
          <small className="muted">
            {voucher.voucher_code}: {voucher.description}
          </small>
        </div>
      )}

      <div className="os_actions">
        <Link className="btn_style_3" to="/lighting">
          <span>Continue Shopping</span> 
        </Link>
        <Link className="btn_style_3" to="/userprofile?tab=orders">
          <span>My Order</span>
        </Link>
      </div>
    </div>
  );
}
