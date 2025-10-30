import { useEffect, useState } from "react";
import FilterItem from "./FilterItem.jsx";
import "./FilterItem.css";
import api from "../../lib/axios";

const FilterRow = ({ onColorChange = () => {}, scopeParams = { scope: "all" } }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [colorOptions, setColorOptions] = useState([]);
  const [loadingColors, setLoadingColors] = useState(false);
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoadingColors(true);
        const res = await api.get("/variants/colors", { params: scopeParams });
        const colors = res.data?.colors || []; 
        if (!ignore) setColorOptions(colors);
      } catch (e) {
        console.error("fetch colors failed", e);
        if (!ignore) setColorOptions([]);
      } finally {
        if (!ignore) setLoadingColors(false);
      }
    })();

    return () => { ignore = true; };
  }, [JSON.stringify(scopeParams)]); // refetch khi đổi category/page

  useEffect(() => {
    onColorChange(selectedColors);
  }, [selectedColors, onColorChange]);

  return (
    <div className="filter-row">
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
