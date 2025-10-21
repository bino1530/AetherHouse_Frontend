import "./Home.css";
import StudioProductCard from "../../components/StudioProductCard/StudioProductCard.jsx"; 
import Usp from "../../components/usp/usp.jsx";
const Home = () => {
  const products = [
    {
      id: 1,
      name: "Bell Portable",
      image_first: "/product1.webp",
      status: "Back in stock",
    },
    {
      id: 2,
      name: "Melt Medium Pendant",
      image_first: "/product2.webp",
      status: "New",
    },
    {
      id: 3,
      name: "Bobble Cushion",
      image_first: "/product3.webp",
      status: "New",
    },
    {
      id: 4,
      name: "Bump Tall Vase",
      image_first: "/product4.webp",
      status: "Gifts",
    },
  ];
  const categories = [
    { id: 1, name: "High-Glass Fluoro" },
    { id: 2, name: "Polished Bronze Polycarbonate" },
    { id: 3, name: "Ochre Wool-Mix Boucle" },
    { id: 4, name: "Handmade Green Glass" },
  ];
  const productCategories = [
    { productId: 1, categories_id: [1] },
    { productId: 2, categories_id: [2] },
    { productId: 3, categories_id: [3] },
    { productId: 4, categories_id: [4] },
  ];
  return (
    <div>
      <div className="home-banner">
        <div className="banner-content">
          <h1>Welcome to Aether House</h1>
          <p>Discover the amazing living space!</p>
          <button className="btn_style_1">
            <span>Explore Now</span>
          </button>
        </div>
      </div>
      <div className="studio_fav spacing">
        <h1>Favorite Studios</h1>
        <div className="row_studio_fav_content">
          <div className="col_studio_fav_1">
            <p>
              Discover what we're loving right now - from best-selling
              essentials to exciting new arrivals and handpicked favourites
              straight from the studio.
            </p>
          </div>
          <div className="col_studio_fav_2">
            <button className="btn_style_2 hidden-back">
              <span>Explore Now</span>
            </button>
          </div>
        </div>
        <div className="row_studio_fav_product row">
          {products.map((product) => (
            <StudioProductCard
              key={product.id}
              product={product}
              categories={categories}
              productCategories={productCategories}
            />
          ))}
        </div>
        <button className="btn_style_2 hidden spacing-top">
          <span>Explore Now</span>
        </button>
      </div>
      <div className="home-banner-2 spacing">
        <div className="banner-content-2">
          <h1>Portable Lighting</h1>
          <p>
            Versatile, rechargeable, and expertly designed. Compact yet
            powerful, our portable lights offer 9 hours of battery life and
            energy-efficient LED lighting.
          </p>
          <button className="btn_style_1">
            <span>Shop Now</span>
          </button>
        </div>
      </div>
      <div className="home-newsletter spacing">
        <div className="newsletter-content-row row">
          <div className="newsletter-img col-lg-6 col-12">
            <img src="/bannerhome3.webp"></img>
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
      <div className="contact-us spacing">
        <h1> Can We Help?</h1>
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
            <button className="btn_style_3 ">
              <span>Visit Us</span>
            </button>
          </div>
      </div>
      <Usp /> 
    </div>
  );
};

export default Home;
