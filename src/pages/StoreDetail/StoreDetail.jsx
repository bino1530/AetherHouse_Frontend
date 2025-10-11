import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import "./StoreDetail.css";
import Usp from "../../components/usp/usp.jsx";

const StoreDetail = () => {
  const { slug } = useParams(); // chỉ lấy slug
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3000/api/stores/slug/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setStore(data.store);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <p>⏳ Đang tải...</p>;
  if (!store) return <p>⚡ Không tìm thấy cửa hàng</p>;

  return (
    <>
      <div className="store-detail-page margintop">
        <div className="link_page pad margintop">
          <p className="spacing">
            <Link to="/">Home</Link> / Custom Service / {store.city}
          </p>
        </div>

        {/* 🟢 Banner hiển thị title + description */}
        <div
          className="store-detail-banner"
          style={{ backgroundImage: `url(${store?.images?.url || "/placeholder.jpg"})` }}
        >
          <div className="store-detail-overlay" />
          
          <div className="store-detail-banner-content spacing">
            <h1 className="store-detail-title">{store.city}</h1>
            <p className="store-detail-desc">{store.description}</p>
            <button className="btn_style_1">
              <span>Get Directions</span>
            </button>
          </div>
        </div>

        <div className="store-info spacing">
          <h2>Store Information</h2>
          <p>{store.information}</p>
          <p>Phone: {store.phone}</p>
          <p>Email: {store.email}</p>
          <p>Address: {store.address}</p>
        </div>
      </div>

      <Usp />
    </>
  );
};

export default StoreDetail;
