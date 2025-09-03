import { Link } from "react-router-dom";
import "./ProductCard.css";
const ProductCard = ({ product, categories, productCategories }) => {
  const productCat = productCategories.find(
    (pc) => pc.productId === product.id
  );

  const categoryNames =
    productCat?.categories_id
      .map((id) => categories.find((c) => c.id === id)?.name)
      .filter(Boolean) || [];

  return (
    <div className="col_studio_fav_product_1 d-flex g-5 col-lg-3 col-sm-6 col-12">
      <div className="studio_card ">
        <div className="studio_img_wrapper">
          <img
            src={product.image_first}
            alt={product.name}
            className="studio_img"
          />
          <span className="studio_status">{product.status}</span>
        </div>
        <div className="studio_info_wrapper">
          <div className="studio_info_content">
            <h3>{product.name}</h3>
            <p className="studio_categories">{categoryNames.join(", ")}</p>
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
