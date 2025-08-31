import "./Home.css";
const Home = () => {
  const products = [
  { id: 1, name: "Bell Portable", image_first: "/product1.webp", status: "Back in stock" },
  { id: 2, name: "Melt Medium Pendant", image_first: "/product2.webp", status: "New" },
  { id: 3, name: "Bobble Cushion", image_first: "/product3.webp", status: "New" },
  { id: 4, name: "Bump Tall Vase", image_first: "/product4.webp", status: "Gifts" },
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
            <p>Discover what we're loving right now - from best-selling essentials to exciting new arrivals and handpicked favourites straight from the studio.</p>
          </div>
          <div className="col_studio_fav_2">
          <button className="btn_style_2">
            <span>Explore Now</span>
          </button>
          </div>
        </div>
        <div className="row_studio_fav_product row">
          {/* do cái product nó link với categories nên phải làm bước này cái ha */}
            {products.map((product) => {
              const productCat = productCategories.find(pc => pc.productId === product.id);
              const categoryNames = productCat?.categories_id.map(
                id => categories.find(c => c.id === id)?.name
              ) || [];

              return (
                <div
                  key={product.id}
                  className="col_studio_fav_product_1 col-lg-3 col-sm-4 col-12"
                >
                  <div className="studio_card">
                    <div className="studio_img_wrapper">
                      <img src={product.image_first} alt={product.name} className="studio_img" />
                      <span className="studio_status">{product.status}</span>
                    </div>
                    <h3>{product.name}</h3>
                    <p className="studio_categories">{categoryNames.join(", ")}</p>
                  </div>
                </div>
              );
            })}
          </div>
      </div>
    </div>
  );
};

export default Home;
