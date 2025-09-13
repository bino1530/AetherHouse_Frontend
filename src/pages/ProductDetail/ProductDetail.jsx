import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import './ProductDetail.css'

const getImagesOrdered = (images=[]) => {
  if (!Array.isArray(images)) return [];
  const main = images.filter(i => i?.is_main);
  const rest = images.filter(i => !i?.is_main);
  return [...main, ...rest];
};

const ProductDetails = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [activeIdx, setActiveIdx] = useState(0);

  // lấy 1 sản phẩm theo slug – thử nhiều endpoint “hay gặp”
  useEffect(() => {
    const ac = new AbortController();
    setLoading(true); setError(""); setProduct(null);

    const candidates = [
      `/api/product/${encodeURIComponent(slug)}`,            
      `/api/products/slug/${encodeURIComponent(slug)}`,      
      `/api/products?slug=${encodeURIComponent(slug)}`,      
      `/api/products`                                         
    ];

    (async () => {
      let data = null;
      for (const u of candidates) {
        try {
          const r = await fetch(u, { signal: ac.signal });
          if (!r.ok) throw new Error();
          const json = await r.json();
          data = json;
          const p =
            json?.product ||
            (Array.isArray(json?.products) ? json.products.find(x => x?.slug === slug) : null) ||
            (json?.slug ? json : null);
          if (p) {
            setProduct(p);
            document.title = `${p.name} – AetherHouse`;
            return;
          }
        } catch { /* thử endpoint kế tiếp */ }
      }
      setError("Không tìm thấy sản phẩm.");
    })()
      .catch(() => setError("Có lỗi khi tải sản phẩm."))
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [slug]);

  const imgs = useMemo(() => getImagesOrdered(product?.images), [product]);
  useEffect(() => { setActiveIdx(0); }, [product]); // reset ảnh khi đổi sp

  // Thêm vào giỏ: phát event đơn giản (Header có thể bắt sự kiện này để add vào state)
  const addToCart = () => {
    if (!product) return;
    window.dispatchEvent(new CustomEvent("cart:add", {
      detail: { _id: product._id, name: product.name, price: product.price, image: imgs[0]?.url, qty: 1 }
    }));
    // Hoặc lưu localStorage cho Header đọc:
    try {
      const key = "cartItems";
      const cur = JSON.parse(localStorage.getItem(key) || "[]");
      const idx = cur.findIndex(i => i._id === product._id);
      if (idx >= 0) cur[idx].qty += 1; else cur.push({ _id: product._id, name: product.name, price: product.price, image: imgs[0]?.url, qty: 1 });
      localStorage.setItem(key, JSON.stringify(cur));
    } catch {}
  };

  if (loading) return <div className="pd_wrap pad spacing">Loading...</div>;
  if (error)   return <div className="pd_wrap pad spacing" style={{color:"red"}}>{error}</div>;
  if (!product) return null;

  const cateName = product?.category_id?.name || product?.category?.name;
  const rootSlug = product?.category_id?.parent?.slug || product?.category?.parent?.slug; // nếu backend có
  const cateSlug = product?.category_id?.slug   || product?.category?.slug;

  return (
    <div className="pd_wrap pad spacing">
      <p className="pd_breadcrumb">
        <Link to="/">Home</Link> /
        {" "}
        {rootSlug ? <Link to={`/${rootSlug}`}>{rootSlug}</Link> : <span>Products</span>}
        {cateSlug && rootSlug && <> / <Link to={`/${rootSlug}/${cateSlug}`}>{cateName}</Link></>}
        {" "} / <span>{product.name}</span>
      </p>

      <div className="pd_grid">
        <div className="pd_gallery">
          <div className="pd_main">
            <img src={imgs[activeIdx]?.url || "/placeholder.png"} alt={product.name} />
          </div>
          {imgs.length > 1 && (
            <div className="pd_thumbs">
              {imgs.map((im, i) => (
                <button key={i}
                        className={`pd_thumb ${i===activeIdx ? "active" : ""}`}
                        onMouseEnter={() => setActiveIdx(i)}
                        onFocus={() => setActiveIdx(i)}
                        onClick={() => setActiveIdx(i)}>
                  <img src={im.url} alt={`${product.name} ${i+1}`} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pd_info">
          <h1 className="pd_title">{product.name}</h1>
          {cateName && <p className="pd_cate">{cateName}</p>}
          <div className="pd_price">${Number(product.price||0).toLocaleString()}</div>

          <div className="pd_actions">
            <button className="pd_add" onClick={addToCart}>Add to cart</button>
          </div>

          {product.description && (
            <div className="pd_desc">
              {String(product.description).split("\n").map((line, i) => <p key={i}>{line}</p>)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;