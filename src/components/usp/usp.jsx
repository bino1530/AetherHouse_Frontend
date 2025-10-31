import { useEffect, useState } from "react";
import api from "../../lib/axios";
import "./usp.css";

const Usp = () => {
  const [usps, setUsps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsps = async () => {
      try {
        const { data } = await api.get("/usps");
        setUsps(data || []);
      } catch (err) {
        console.error("❌ Lỗi khi lấy USP:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsps();
  }, []);

  if (loading)
    return (
      <div className="usp-loading">
        <span className="spinner" />
      </div>
    );

  if (!usps.length)
    return (
      <div className="usp-empty">
        <p>Không có USP nào để hiển thị.</p>
      </div>
    );

  return (
    <div className="usp">
      <section className="usp-section">
      
        {usps.map((item) => (
          <div className="usp-item" key={item._id}>
            <div className="usp-item-left"   dangerouslySetInnerHTML={{ __html: item.icon }}>
            </div>
            <div className="usp-item-right">
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

export default Usp;
