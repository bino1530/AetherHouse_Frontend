import "./FilterItem.css";

const FilterItem = ({
  label,
  name,
  options,
  columns = 1,
  openDropdown,
  setOpenDropdown,
  selected = [],
  onChange = () => {},
}) => {
  const isOpen = openDropdown === name;

  const toggle = () => setOpenDropdown(isOpen ? null : name);

  const onToggleOption = (val) => {
    const has = selected.includes(val);
    const next = has ? selected.filter(v => v !== val) : [...selected, val];
    onChange(next);
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
          {options.map((opt, i) => {
            const value = typeof opt === "string" ? opt : (opt.value ?? opt.label);
            const text  = typeof opt === "string" ? opt : (opt.label ?? opt.value);
            const count = typeof opt === "object" ? opt.count : undefined;

            return (
              <li key={value || i}>
                <label>
                  <input
                    type="checkbox"
                    checked={selected.includes(value)}
                    onChange={() => onToggleOption(value)}
                  />{" "}
                  {text}{typeof count === "number" ? ` (${count})` : ""}
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default FilterItem;
