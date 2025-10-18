import { useEffect, useState } from "react";
import FilterItem from "./FilterItem.jsx";
import "./FilterItem.css";
import api from "../../lib/axios";

const FilterRow = ({ onColorChange = () => {} }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [colorOptions, setColorOptions] = useState([]);
  const [loadingColors, setLoadingColors] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        setLoadingColors(true);
        // Gọi qua axios instance để ăn VITE_API_URL
        const res = await api.get("/variants/colors");
        const colors = res.data?.colors || []; // [{label,value,count}]
        if (!ignore) setColorOptions(colors);
      } catch (e) {
        console.error("fetch colors failed", e);
      } finally {
        if (!ignore) setLoadingColors(false);
      }
    })();
    return () => { ignore = true; };
  }, []);

  useEffect(() => {
    onColorChange(selectedColors);
  }, [selectedColors, onColorChange]);

  return (
    <div className="filter-row ">

      <FilterItem
        label={loadingColors ? "Colour (loading…)" : "Colour"}
        name="colour"
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        columns={3}
        options={colorOptions}
        selected={selectedColors}
        onChange={setSelectedColors}
      />
    </div>
  );
};

export default FilterRow;
