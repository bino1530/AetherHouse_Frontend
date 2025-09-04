import { useState } from "react";
import "./FilterItem.css"; 

const FilterItem = ({ label, name, options, columns = 1, openDropdown, setOpenDropdown }) => {
  const isOpen = openDropdown === name;

  const toggle = () => {
    setOpenDropdown(isOpen ? null : name);
  };

  return (
    <div className="filter-item">
      <button className="filter-btn" onClick={toggle}>
        {label} <span className="caret" />
      </button>

      {isOpen && (
        <div className="dropdown">
          <ul className={`menu grid-${columns}`}>
            {options.map((text, i) => (
              <li key={i}>
                <label>
                  <input type="checkbox" /> {text}
                </label>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FilterItem;
