import { useEffect, useState } from "react";
import "./Home.css";
import StudioProductCard from "../../components/StudioProductCard/StudioProductCard.jsx";
import Usp from "../../components/usp/usp.jsx";
import api from "../../lib/axios.jsx";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Lấy 3 sản phẩm mới nhất từ API
  useEffect(() => {
    const fetchNewest = async () => {
      try {
        const { data } = await api.get("/products/newest");
        if (data?.success) {
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Error fetching newest products:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNewest();
  }, []);
  console.log(products)
  return (
    <div>
      {/* --- Banner chính --- */}
      <div className="home-banner">
        <div className="banner-content">
          <h1>Welcome to Aether House</h1>
          <p>Discover the amazing living space!</p>
          <button className="btn_style_1">
            <span>Explore Now</span>
          </button>
        </div>
      </div>

      {/* --- Favorite Studios Section --- */}
      <div className="studio_fav spacing">
        <h1>Favorite Studios</h1>
        <div className="row_studio_fav_content">
          <div className="col_studio_fav_1">
            <p>
              Discover what we're loving right now — from best-selling essentials
              to exciting new arrivals and handpicked favourites straight from
              the studio.
            </p>
          </div>
          <div className="col_studio_fav_2">
            <button className="btn_style_2 hidden-back">
              <span>Explore Now</span>
            </button>
          </div>
        </div>

        {/* --- Products --- */}
        <div className="row_studio_fav_product row">
          {loading ? (
            <p>Loading newest products...</p>
          ) : products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                rootSlug={product.category_id ? [product.category_id] : []}
              />
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>

        <button className="btn_style_2 hidden spacing-top">
          <span>Explore Now</span>
        </button>
      </div>

      {/* --- Banner phụ --- */}
      <div className="home-banner-2 spacing">
        <div className="banner-content-2">
          <h1>Portable Lighting</h1>
          <p>
            Versatile, rechargeable, and expertly designed. Compact yet powerful,
            our portable lights offer 9 hours of battery life and
            energy-efficient LED lighting.
          </p>
          <button className="btn_style_1">
            <span>Shop Now</span>
          </button>
        </div>
      </div>

      {/* --- Newsletter Section --- */}
      <div className="home-newsletter spacing">
        <div className="newsletter-content-row row">
          <div className="newsletter-img col-lg-6 col-12">
            <img src="/bannerhome3.webp" alt="Glassware Banner" />
          </div>
          <div className="newsletter-content col-lg-6 col-12">
            <h3>Glassware</h3>
            <p>
              Expertly crafted by skilled artisans, our mouth-blown glassware
              combines design with everyday functionality. Each piece rich in
              character and unmistakable charm.
            </p>
            <button className="btn_style_1">
              <span>View Collection</span>
            </button>
          </div>
        </div>
      </div>

      {/* --- Contact Us Section --- */}
      <div className="contact-us spacing">
        <h1>Can We Help?</h1>
        <div className="contact-content">
          <p>
            For any questions about our products, placing an order, or our
            design services, feel free to get in touch with our Customer
            Experience Team. We are here to help. We also invite you to visit
            our shops to explore our collections and designs in person.
          </p>
        </div>
        <div className="contact-buttons">
          <button className="btn_style_3">
            <span>Contact Us</span>
          </button>
          <button className="btn_style_3">
            <span>Visit Us</span>
          </button>
        </div>
      </div>

      <Usp />
    </div>
  );
};

export default Home;
