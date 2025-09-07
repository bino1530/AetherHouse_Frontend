import React from "react";
import { Link } from "react-router-dom";
import Usp from "../../components/usp/usp.jsx"
import "./Explore.css";



const Explore = () => {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="link_page pad margintop">
        <p className="spacing">
          <Link to="/">Home</Link> / About Us
        </p>
      </div>

      {/* Giới thiệu thương hiệu */}
      <div className="about-container">
        <h1>About Us</h1>
        <p className="intro">
          Established in 2002, Tom Dixon is a British luxury design brand which
          is represented in 90 countries and employing 100+ people world-wide.
          Specialising in furniture, lighting and accessories, Tom Dixon has
          hubs in London, Milan, Hong Kong, New York, Tokyo, Shanghai and
          Hangzhou.
        </p>
        <p className="highlight">
          With an aesthetic that is intrinsically inspired by the brand’s
          British roots, the products are internationally recognised and
          appreciated for their pioneering use of materials and techniques.
        </p>
        <p>
          Founder and eponymous Creative Director Tom Dixon is a restless
          innovator who rose to prominence in the mid-1980s as a maverick,
          untrained designer with a line in welded salvage furniture. While
          working with the Italian giant Cappellini he designed the widely
          acclaimed ‘S’ Chair.
        </p>
        <p>
          In the late 90s Tom became Creative Director at Habitat and rejuvenated
          the brand while maintaining Terence Conran’s vision of enriching
          everyday life through simple, modern design. In 2001, Tom was awarded
          an OBE by Her Majesty the Queen for his services to British design. In
          2014 he was awarded ‘Designer of The Year’ at Maison & Objet, Paris.
        </p>
      </div>

      {/* Interview section */}
      <div className="interview-container">
        <div className="interview-image">
          <img src="/explore.webp" alt="Interview" />

        </div>

        <div className="interview-content">
          <p className="quote">
            ‘Extraordinary objects for everyday use’ is my mantra. I guess I’m
            trying to create a modern take on British design – whatever that
            looks like.
          </p>

        {/* ✅ bọc button + logo trong 1 div */}
          <div className="interview-actions">
           <button className="btn_style_2">
            <span>Read the interview</span>
           </button>
            <div className="logo">Livingetc</div>
          </div>
        
        </div>
 </div>


      {/* Interior Architecture Section */}
<div className="drs-container">
  <div className="drs-image">
    <img src="/explore1.webp" alt="DRS" />
  </div>
  <div className="drs-content">
    <p className="drs-text">
      Our interior architecture facility, Design Research Studio,
      conceives the interiors and exteriors of tomorrow.
    </p>
    <div className="drs-actions">
      <button className="btn_style_3">
            <span>Learn more</span>
           </button>
      <div className="drs-logo">D . R . S</div>
    </div>
  </div>
</div>

<Usp />
<div>
  
</div>



      
    </div>
  );
};

export default Explore;
