import './Home.css';
const Home = () => {
  return (
    <div className="home-banner">
      {/* Nội dung nằm trên banner */}
      <div className="banner-content">
        <h1>Welcome to Aether House</h1>
        <p>Discover the amazing living space!</p>
        <button className="btn_style_1">
          <span>Explore Now 
          </span>
        </button>
      </div>
    </div>
  );
};

export default Home;