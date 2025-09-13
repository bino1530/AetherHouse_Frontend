// src/pages/ProductDetail/ProductDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./ProductDetail.css";

const deriveStatus = (p = {}) => {
  const norm = (v) =>
    String(v ?? "")
      .trim()
      .toLowerCase();
  const s = norm(p.status);
  if (["preorder", "pre-order"].includes(s)) return { text: "Pre-Order" };
  if (["sale", "discount", "clearance"].includes(s)) return { text: "Sale" };
  if (["unavailable", "out_of_stock", "out-of-stock", "oos"].includes(s))
    return { text: "Unavailable" };
  if (["available", "in_stock", "in-stock"].includes(s))
    return { text: "Available" };
  if (p.is_hidden) return { text: "Unavailable" };
  const qty = Number(p.quantity);
  if (Number.isFinite(qty) && qty <= 0) return { text: "Unavailable" };
  return { text: "Available" };
};

const orderImages = (images = []) => {
  const arr = Array.isArray(images) ? images : [];
  return [...arr.filter((i) => i?.is_main), ...arr.filter((i) => !i?.is_main)];
};

const fetchJSON = async (url, signal) => {
  const r = await fetch(url, { signal });
  if (!r.ok) throw new Error(`HTTP ${r.status} @ ${url}`);
  return r.json();
};

export default function ProductDetail() {
  const { rootSlug, slug, categorySlug: cSlug, productSlug } = useParams();
  const categorySlug = cSlug || slug || "";
  const idFromState = useLocation()?.state?.id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    setError("");
    setProduct(null);

    (async () => {
      try {
        let id = idFromState;
        if (!id) {
          const listUrl = `/api/products/by-cate/${rootSlug}/${categorySlug}`;
          const data = await fetchJSON(listUrl, ac.signal);
          const list = Array.isArray(data?.products) ? data.products : [];
          id = list.find((p) => p?.slug === productSlug)?._id;
          if (!id) throw new Error(`not-found slug=${productSlug}`);
        }

        const detailUrl = `/api/products/by-id/${id}`;
        const json = await fetchJSON(detailUrl, ac.signal);
        const p = json?.product || json;
        if (!p?._id) throw new Error("bad-payload");

        setProduct(p);
        document.title = `${p.name} – AetherHouse`;
      } catch (e) {
        if (e.name === "AbortError") return;
        console.error("[ProductDetail]", e);
        setError("Không tìm thấy sản phẩm.");
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [rootSlug, categorySlug, productSlug, idFromState]);

  const imgs = useMemo(() => orderImages(product?.images), [product]);
  const handleImgErr = (e) => {
    e.currentTarget.src = "/placeholder.png";
  };

  if (loading) return <div className="pd_wrap pad spacing">Loading...</div>;
  if (error)
    return (
      <div className="pd_wrap pad spacing" style={{ color: "red" }}>
        {error}
      </div>
    );
  if (!product) return null;

  const cateName =
    product?.category_id?.name || product?.category?.name || categorySlug;
  if (!product) return null;
  const st = deriveStatus(product);

  return (
    <div className="pd_wrap pad margintop">
      <p className="link_page pad spacing">
        <Link to="/">Home</Link> / <Link to={`/${rootSlug}`}>{rootSlug}</Link> /{" "}
        <Link to={`/${rootSlug}/${categorySlug}`}>{cateName}</Link> /{" "}
        <span>{product.name}</span>
      </p>

      <div className="pd_grids ">
        <div className="pd_gallery">
          <div className="pd_galleryGrid">
            {imgs.map((im, i) => (
              <img
                key={i}
                src={im?.url || "/placeholder.png"}
                alt={`${product.name} ${i + 1}`}
                loading="lazy"
                onError={handleImgErr}
                className="pd_img"
              />
            ))}
          </div>
        </div>

        <div className="pd_info spacing">
          <div className="pd_info_title">
            <h1 className="pd_title">
              {product.name}
            </h1>
            <span className="studio_status--inline">
                {st.text}
            </span>
          </div>

          {cateName && <p className="pd_cate">{cateName}</p>}

          {/* mô tả */}
          {product.description && (
            <div className="pd_desc">
              {String(product.description)
                .split("\n")
                .map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
            </div>
          )}

          {/* kích thước: tĩnh trước đã */}
          <div className="pd_metrics">
            <dl className="pd_dims">
              <div>
                <dt>Width</dt>
                <dd>19.0</dd>
              </div>
              <div>
                <dt>Height</dt>
                <dd>28.0</dd>
              </div>
              <div>
                <dt>Length</dt>
                <dd>19.0</dd>
              </div>
            </dl>
            <div className="pd_units" role="tablist" aria-label="Units">
              <button className="unit is-active" type="button">
                CM
              </button>
              <button className="unit" type="button">
                IN
              </button>
            </div>
          </div>

          <hr className="pd_divider" />

          {/* màu sắc (tĩnh) */}
          <div className="pd_variant">
            <span
              className="swatch"
              style={{ backgroundColor: "#b87333" }}
              aria-hidden="true"
            ></span>
            <span className="variant_label">Copper</span>
            <button className="more_colors" type="button">
              9 More Colours ▸
            </button>
          </div>

          <hr className="pd_divider" />

          {/* warranty line */}
          <p className="pd_warranty">
            <span className="ico_shield" aria-hidden="true"></span>
            Ultimate peace of mind. An additional 1-year warranty when purchased
            from TomDixon.net
          </p>

          {/* purchase card */}
          <div className="pd_purchaseCard">
            <p className="pd_eta">
              Be the first! Order today to receive in late September
            </p>
            <div className="pd_priceRow">
              <div className="pd_price">
                ${Number(product.price || 0).toLocaleString()}
              </div>
              <button className="btn btn_primary" type="button">
                Add To Bag
              </button>
            </div>
            <p className="pd_finance">
              Pay later with <strong>Klarna</strong> <a href="#">Learn more</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
