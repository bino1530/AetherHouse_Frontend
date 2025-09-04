import { useState } from "react";
import FilterItem from "./FilterItem.jsx";
import "./FilterItem.jsx"; 

const FilterRow = () => {
  const [openDropdown, setOpenDropdown] = useState(null);

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
          "5,000,000+"
        ]}
      />

      <FilterItem
        label="Room"
        name="room"
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        columns={2}
        options={[
          "Living Room",
          "Bedroom",
          "Dining",
          "Kitchen",
          "Office",
          "Outdoor"
        ]}
      />

      <FilterItem
        label="Colour"
        name="colour"
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        columns={3}
        options={[
          "Black", "White", "Gold",
          "Silver", "Bronze", "Copper"
        ]}
      />

      <FilterItem
        label="Material"
        name="material"
        openDropdown={openDropdown}
        setOpenDropdown={setOpenDropdown}
        columns={2}
        options={[
          "Metal", "Glass", "Wood",
          "Fabric", "Ceramic", "Plastic"
        ]}
      />
    </div>
  );
};

export default FilterRow;
