import { useState , useEffect } from "react";
import "./store.css";
import {Link } from "react-router-dom";
import Usp from "../../components/usp/usp.jsx"
const Store = () => {
  const [stores , setStores] = useState([]);
  const [loading, setLoading] = useState(true); // trạng thái loading

  useEffect(() => {
    fetch('http://localhost:8000/api/stores')
    .then(res => res.json())
    .then(data => {
      setStores(data.stores)
      setLoading(false)
    })
    .catch(err => {
      console.error(err)
      setLoading(false)
    });
  }, [])
  

  return (
    <div className="margintop ">
      <div className="link_page pad ">
        <p className="spacing">
          <Link to="/">Home</Link> / Custom Service / Looking For a Store</p>
      </div>

      <div className="store_main pad  ">
        <div className="store_title spacing">
          <h1>Looking For a Store</h1>
        </div>
        <div className="store_row spacing ">
        {loading ? (
            <p>⏳ Đang tải...</p>
          ) : stores.length === 0 ? (
            <p>⚡ Hiện chưa có cửa hàng nào. Đang cập nhật...</p>
          ) : (
          stores.map((store) => (
            <div className="store_col" key={store._id}>
              <a href={`/store/${store.id}`}>
                <div className="store_frame_img">
                  <img src={store.images[0].url} alt={store.name} />
                </div>
              </a>

              <div className="store_info">
                <div className="store_info--top">
                  <div className="store_info--col1">
                    <span className="name_store">{store.name}</span>
                    <h2 className="country">{store.city}</h2>
                  </div>
                  <div className="store_info--col2">
                     <a href={`/store/${store.id}`} className="style_a">
                    <button className="btn_style_1">
                        <span>Store Page</span>
                    </button>
                  </a>
                  </div>
                </div>

                <div className="store_info--bottom">
                  <p>{store.desctription}</p>
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
