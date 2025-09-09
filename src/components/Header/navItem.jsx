// src/components/nav/NavItem.jsx
import { useEffect,useMemo , useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
// import { CATEGORIES } from "../../data/categories.jsx";
// import { FAKE_ROOMS } from "../../data/fake_rooms";
import "./navItem.css";
const NavItem = ({ root, menuBySlug }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const location = useLocation();

  const cats = useMemo(
    () => (menuBySlug?.[root.slug]?.children || []),
    [menuBySlug, root.slug]
  );
  const rooms = useMemo(
    () => (menuBySlug?.[root.slug]?.rooms || []),
    [menuBySlug, root.slug]
  );

  useEffect(() => {
    const onOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onOutside);
    return () => document.removeEventListener("pointerdown", onOutside);
  }, []);
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onEsc);
    };
  }, [open]);
  useEffect(() => { setOpen(false); }, [location.pathname]);

  const handleRootClick = () => setOpen(v => !v);
  const hasMenu = (cats?.length || 0) + (rooms?.length || 0) > 0;

  return (
    <div className={`navitem ${open ? "open" : ""}`} ref={wrapRef}>
      <button type="button" className="navitem__root" onClick={handleRootClick} aria-expanded={open}>
        {root.name}
        <span className="navitem__caret" />
      </button>

        <>
        <div
      className={`navitem__backdrop ${open ? "show" : ""}`}
      onClick={() => setOpen(false)}
    />
    <div className={`navitem__dropdown ${open ? "show" : ""}`}>
      <div className="dropdown__inner">
        <div className="dropdown__grid spacing">
          <div className="dropdown__col">
            <h4>Shop by Category</h4>
            <ul>
              {cats.length ? cats.map(cat => (
                <li key={cat.slug}>
                  <Link to={`/${root.slug}/${cat.slug}`} onClick={() => setOpen(false)}>
                    {cat.name}
                  </Link>
                </li>
              )) : <li className="muted">No items</li>}
            </ul>
          </div>
          <div className="dropdown__col">
            <h4>Shop by Room</h4>
            <ul>
              {rooms.length ? rooms.map(room => (
                <li key={room.slug}>
                  <Link
                    to={`/${root.slug}/${room.slug}`}
                    state={{ rootName: root.name, roomName: room.name }}
                    onClick={() => setOpen(false)}
                  >
                    {room.name}
                  </Link>
                </li>
              )) : <li className="muted">No items</li>}
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
            * Root này hiện không có danh mục/phòng — vẫn có thể “View all”.
          </div>
        )}
      </div>
    </div>
        </>
    </div>
  );
};

export default NavItem;