import { Link } from "react-router-dom";
import "./ProductCard.css";

const getUrl = (img) =>
  (typeof img === "string" ? img : img?.url) || "/placeholder.png";

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

const isNew = (createdAt) => {
  if (!createdAt) return false;
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return false;
  return Date.now() - created < 24 * 60 * 60 * 1000;
};

export default function ProductCard({ product, rootSlug }) {
  let imgs = Array.isArray(product?.images) ? [...product.images] : [];
  imgs.sort((a, b) => (b?.is_main === true) - (a?.is_main === true));
  const main = imgs[0];
  const hover = imgs[1] || imgs[0];

  const categorySlug =
    product?.category_id?.slug || product?.category?.slug || "";
  const details = `/${rootSlug}/${categorySlug}/${product?.slug}`;

  const st = deriveStatus(product);
  const showNew = st.text === "Available" && isNew(product?.createdAt);
  const badgeText = showNew ? "New" : st.text;

  // chỉ dùng Grid span class
  const spanClass = product.colspan === 2 ? "card-col--w6" : "card-col--w3";

  const hidden = Number(product?.quantity) <= 0;

  if (hidden) return null;

  return (
    <div className={`card-col ${spanClass}`}>
      <div className="studio_card">
        <Link to={details} state={{ id: product?._id }} className="studio_link">
          <div className="studio_img_wrapper">
            <span
              className={`studio_status ${showNew ? "is-new" : ""}`}
              aria-label={`Status: ${badgeText}`}
              title={badgeText}
            >
              {badgeText}
            </span>

            <img
              src={getUrl(main)}
              alt={product?.name}
              className="studio_img studio_img--main"
            />
            {getUrl(hover) !== getUrl(main) && (
              <img
                src={getUrl(hover)}
                alt={`${product?.name} alt`}
                className="studio_img studio_img--hover"
              />
            )}
          </div>
        </Link>

        <div className="studio_info_wrapper">
          <div className="studio_info_content">
            <h1>{product?.name}</h1>
            {(product?.category_id?.name || product?.category?.name) && (
              <p className="studio_category">
                {product?.category_id?.name || product?.category?.name}
              </p>
            )}
          </div>
          <div className="studio_info_price">
            <span className="studio_price">
              ${Number(product?.price || 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
