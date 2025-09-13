import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./navItem.css";

const NavItem = ({ root, menuBySlug }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const location = useLocation();

  const cats = useMemo(
    () => menuBySlug?.[root.slug]?.children || [],
    [menuBySlug, root.slug]
  );

  useEffect(() => {
    const onOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onOutside);
    return () => document.removeEventListener("pointerdown", onOutside);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleRootClick = () => setOpen(v => !v);
  const hasMenu = (cats?.length || 0) > 0;

  return (
    <div className={`navitem ${open ? "open" : ""}`} ref={wrapRef}>
      <button
        type="button"
        className="navitem__root"
        onClick={handleRootClick}
        aria-expanded={open}
        aria-haspopup="true"
      >
        {root.name}
      </button>

      <div
        className={`navitem__backdrop ${open ? "show" : ""}`}
        onClick={() => setOpen(false)}
        aria-hidden={!open}
      />

      <div className={`navitem__dropdown ${open ? "show" : ""}`} role="menu">
        <div className="dropdown__inner">
          <div className="dropdown__grid spacing">
            <div className="dropdown__col">
              <h4>Shop by Category</h4>
              <ul>
                {cats.length ? (
                  cats.map((cat) => (
                    <li key={cat.slug}>
                      <Link to={`/${root.slug}/${cat.slug}`} onClick={() => setOpen(false)}>
                        {cat.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="muted">No items</li>
                )}
              </ul>
            </div>

            <div className="dropdown__col">
              <Link to={`/${root.slug}`} className="view-all" onClick={() => setOpen(false)}>
                View all {root.name}
              </Link>
            </div>
          </div>

          {!hasMenu && (
            <div className="muted" style={{ marginTop: 8 }}>
              * Root này hiện không có danh mục — vẫn có thể “View all”.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavItem;
