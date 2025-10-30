import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Usp from "../../components/usp/usp.jsx";
import "./store.css";
import api from "../../lib/axios"; 

const Store = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
    const controller = new AbortController(); 
    api
      .get("/stores", { signal: controller.signal }) 
      .then(({ data }) => {
        setStores(data.stores || []); 
      })
      .catch((err) => {
        if (err.name === "CanceledError") return;
        console.error("Load stores failed:", err);
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  return (
    <div className="margintop ">
      <div className="link_page pad ">
        <p className="spacing">
          <Link to="/">Home</Link> / Custom Service / Looking For a Store
        </p>
      </div>

      <div className="store_main pad">
        <div className="store_title spacing">
          <h1>Looking For a Store</h1>
        </div>
        <div className="store_row spacing">
          {loading ? (
            <p>⏳ Đang tải...</p>
          ) : stores.length === 0 ? (
            <p>⚡ Hiện chưa có cửa hàng nào. Đang cập nhật...</p>
          ) : (
            stores.map((store) => (
              <div className="store_col" key={store._id}>
                {/* Link chỉ dùng slug */}
               {store.slug ? (
  <Link to={`/store/${store.slug}`}>
    <div className="store_frame_img">
      <img src={store.images.url} alt={store.name} />
    </div>
  </Link>
) : (
  <div className="store_frame_img">
    <img src={store.images.url} alt={store.name} />
  </div>
)}

                <div className="store_info">
                  <div className="store_info--top">
                    <div className="store_info--col1">
                      <span className="name_store">{store.name}</span>
                      <h2 className="country">{store.city}</h2>
                    </div>
                    <div className="store_info--col2">
                      <Link to={`/store/${store.slug}`} className="style_a">
                        <button className="btn_style_1">
                          <span>Store Page</span>
                        </button>
                      </Link>
                    </div>
                  </div>
                  <div className="store_info--bottom">
                    <p>{store.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <Usp />
      </div>
    </div>
  );
};

export default Store;
