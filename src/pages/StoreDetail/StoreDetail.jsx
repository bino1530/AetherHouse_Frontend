import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom"; 
import "./StoreDetail.css";
import Usp from "../../components/usp/usp.jsx"

const StoreDetail = () => {
  const { storeId, setStoreID } = useParams();
  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/stores/${storeId}`)
      .then((res) => res.json())
      .then((data) => {
        setStore(data.store);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [storeId]);

  if (loading) return <p>⏳ Đang tải...</p>;
  if (!store) return <p>⚡ Không tìm thấy cửa hàng</p>;

  return (
    <>
      <div className="store-detail-page margintop">
      <div className="link_page pad margintop">
        <p className="spacing">
          <Link to="/">Home</Link> / Custom Service / {store.name}
        </p>
      </div>
      <img src={store.images.url} alt={store.name} />
    
     <div className="store-info">
        <h2>Store Information</h2>
        <p>{store.information}</p>
        <p>{store.description}</p>
        <p>Phone: {store.phone}</p>
        <p>Email: {store.email}</p>
        <p>Address: {store.address}</p>
    </div>


    </div>
    
  <Usp/>
  </>
  );
};

export default StoreDetail;
