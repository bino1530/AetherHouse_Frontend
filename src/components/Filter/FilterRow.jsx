import { useEffect, useState } from "react";
import axios from "axios";
import FilterItem from "./FilterItem.jsx";
import "./FilterItem.css";

const FilterRow = ({ onColorChange = () => {} }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  // Colour
  const [colorOptions, setColorOptions] = useState([]);
  const [loadingColors, setLoadingColors] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoadingColors(true);
        // Ưu tiên endpoint nhẹ: /api/variants/colors
        const res = await axios.get("/api/variants/colors");
        const colors = res.data?.colors || []; // [{label,value,count}]
        if (!ignore) setColorOptions(colors);
      } catch (e) {
        console.error("fetch colors failed", e);
        // fallback: nếu chưa có endpoint, vẫn để rỗng
      } finally {
        if (!ignore) setLoadingColors(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  // bắn ra ngoài khi chọn màu đổi
  useEffect(() => {
    onColorChange(selectedColors);
  }, [selectedColors, onColorChange]);

  return (
    <div className="filter-row spacing">
      <FilterItem
        label="Price"
        name="price"
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        options={[
          "Under 1,000,000",
          "1,000,000 – 3,000,000",
          "3,000,000 – 5,000,000",
          "5,000,000+",
        ]}
      />


      <FilterItem
        label={loadingColors ? "Colour (loading…)" : "Colour"}
        name="colour"
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        columns={3}
        options={colorOptions}          // [{label,value,count}]
        selected={selectedColors}       // mảng value đang chọn
        onChange={setSelectedColors}    // cập nhật chọn
      />

      
    </div>
  );
};

export default FilterRow;
