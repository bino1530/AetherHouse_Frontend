import { Link } from "react-router-dom";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const firstImage =
    Array.isArray(product?.images) && product.images[0]
      ? product.images[0]
      : "/placeholder.png";

  const status =
    typeof product?.status === "string"
      ? product.status
      : typeof product?.quantity === "number" && product.quantity > 0
      ? "available"
      : "out of stock";
  const colClass =
    String(product.colspan) === "2"
      ? "col-12 col-sm-12 col-lg-6"
      : "col-12 col-sm-6 col-lg-3";
  return (
    <div className={`col_studio_fav_product_1 ${colClass}`}>
      <div className="studio_card">
        <div className="studio_img_wrapper">
          <img src={firstImage} alt={product.name} className="studio_img" />
          {status && <span className="studio_status">{status}</span>}
        </div>

        <div className="studio_info_wrapper">
          <div className="studio_info_content">
            <h3>{product.name}</h3>
            {/* Bỏ categories */}
          </div>
          <div className="studio_info_price">
            <span className="studio_price">{product.price}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
