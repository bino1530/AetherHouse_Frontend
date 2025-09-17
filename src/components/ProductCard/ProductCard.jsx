import { Link } from "react-router-dom";
import "./ProductCard.css";

const getUrl = (img) =>
  (typeof img === "string" ? img : img?.url) || "/placeholder.png";

const deriveStatus = (p = {}) => {
  const norm = (v) => String(v ?? "").trim().toLowerCase();

  const s = norm(p.status);
  if (["preorder", "pre-order"].includes(s))          return { text: "Pre-Order" };
  if (["sale", "discount", "clearance"].includes(s))  return { text: "Sale" };
  if (["unavailable", "out_of_stock", "out-of-stock", "oos"].includes(s))
    return { text: "Unavailable" };
  if (["available", "in_stock", "in-stock"].includes(s))
    return { text: "Available" };

  if (p.is_hidden) return { text: "Unavailable" };
  const qty = Number(p.quantity);
  if (Number.isFinite(qty) && qty <= 0) return { text: "Unavailable" };

  return { text: "Available" };
};

export default function ProductCard({ product, rootSlug }) {
  const imgs  = Array.isArray(product?.images) ? product.images : [];
  const main  = imgs.find((i) => i?.is_main) || imgs[0];
  const hover = imgs.find((i) => !i?.is_main) || main;

  const categorySlug = product?.category_id?.slug || product?.category?.slug || "";
  const details = `/${rootSlug}/${categorySlug}/${product?.slug}`;

  const st = deriveStatus(product);

  return (
    <div className="col_studio_fav_product_1 col-12 col-sm-6 col-lg-3">
      <div className="studio_card">
        <Link to={details} state={{ id: product?._id }} className="studio_link">
          <div className="studio_img_wrapper">
            <span className="studio_status" aria-label={`Status: ${st.text}`}>{st.text}</span>

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
            <h3>{product?.name}</h3>
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
