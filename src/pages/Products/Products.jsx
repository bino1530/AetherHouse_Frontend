import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./products.css";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import FilterRow from "../../components/Filter/FilterRow.jsx";
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/products");
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text}`);
        }
        const data = await res.json();
        const list = Array.isArray(data?.products) ? data.products : [];
        // chỉ hiển thị những thằng không ẩn
        setProducts(list.filter(p => !p.is_hidden));
        setError("");
      } catch (e) {
        console.error(e);
        setError("Không lấy được danh sách sản phẩm.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="margintop">
      <div className="link_page pad">
        <p className="spacing">
          <Link to="/">Home</Link> / <Link to="/products">Products</Link>
        </p>
      </div>
      <h1 className="title spacing">All Products</h1>
      <FilterRow />
      <hr className="spacing" />

      <div className="products spacing">
      {loading && (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border" role="status" aria-label="Đang tải">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {error && !loading && <p style={{ color: "red" }}>{error}</p>}
        {!loading && !error && (
          <div className="product_row row">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
            {products.length === 0 && <p>No Products.</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
