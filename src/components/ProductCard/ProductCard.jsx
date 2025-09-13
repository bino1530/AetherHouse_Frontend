import "./ProductCard.css";
import { Link } from "react-router-dom";

const getUrl = (img) => (typeof img === "string" ? img : img?.url) || "/placeholder.png";

const ProductCard = ({ product }) => {
  const imgs = Array.isArray(product?.images) ? product.images : [];
  const mainImg  = imgs.find(i => i?.is_main) || imgs[0];
  const hoverImg = imgs.find(i => !i?.is_main) || mainImg;

  const mainUrl  = getUrl(mainImg);
  const hoverUrl = getUrl(hoverImg);

  const status =
    typeof product?.status === "string"
      ? product.status
      : typeof product?.quantity === "number" && product.quantity > 0
      ? "available"
      : "out of stock";
  const categoryName = product?.category_id?.name || product?.category?.name || "";

  const colClass =
    String(product?.colspan) === "2"
      ? "col-12 col-sm-12 col-lg-6"
      : "col-12 col-sm-6 col-lg-3";

  return (
    <div className={`col_studio_fav_product_1 ${colClass}`}>
      <div className="studio_card">
        <div className="studio_img_wrapper">
          {/* Ảnh chính (is_main:true) */}
            <Link to={`/product/${product.slug}`}  state={{ productId: product._id }} className="studio_card">
          <img
            src={mainUrl}
            alt={product?.name || "Product"}
            className="studio_img studio_img--main"
            loading="lazy"
          />
          {hoverUrl !== mainUrl && (
            <img
              src={hoverUrl}
              alt={product?.name || "Product alt"}
              className="studio_img studio_img--hover"
              loading="lazy"
            />
          )}
          {status && <span className="studio_status">{status}</span>}
          </Link>
        </div>

        <div className="studio_info_wrapper">
          <div className="studio_info_content">
            <h3>{product?.name}</h3>
                        {categoryName && <p className="studio_category">{categoryName}</p>}

          </div>
          <div className="studio_info_price">
            <span className="studio_price">${Number(product?.price || 0).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
