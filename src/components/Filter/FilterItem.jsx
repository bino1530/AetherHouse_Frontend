// import { useState } from "react";
import "./FilterItem.css";

const FilterItem = ({
  label,
  name,
  options,
  columns = 1,
  openDropdown,
  setOpenDropdown,
}) => {
  const isOpen = openDropdown === name;

  const toggle = () => {
    setOpenDropdown(isOpen ? null : name);
  };

  return (
    <div className={`filter-item ${isOpen ? "is-open" : ""}`}>
      <button
        className="filter-btn"
        onClick={toggle}
        aria-expanded={isOpen}
        aria-controls={`dd-${name}`}
      >
        {label} <span className="caret" />
      </button>
      <div
        id={`dd-${name}`}
        className={`dropdown ${isOpen ? "show" : ""}`}
        role="menu"
        aria-hidden={!isOpen}
      >
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
    </div>
  );
};

export default FilterItem;
