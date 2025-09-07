// src/components/nav/NavItem.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../../data/categories.jsx";
import { FAKE_ROOMS } from "../../data/fake_rooms";
import "./navItem.css";
const NavItem = ({ root }) => {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Fetch Categories
  useEffect(() => {
    const filteredCategories = CATEGORIES.filter(
      (category) => category.parent === root.slug
    );
    setCategories(filteredCategories);
  }, [root.slug]);

  // Fetch Rooms
  useEffect(() => {
    const filteredRooms = FAKE_ROOMS.filter((room) => room.parent === root.slug);
    setRooms(filteredRooms);
  }, [root.slug]);

  useEffect(() => {
    const onOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", onOutside);
    return () => document.removeEventListener("pointerdown", onOutside);
  }, []);
  const handleRootClick = () => {
    setOpen((v) => !v);
  };

  return (
    <div className={`navitem ${open ? "open" : ""}`} ref={wrapRef}>
      <button type="button" className="navitem__root" onClick={handleRootClick}>
        {root.name}
        <span className={`navitem__caret ${open ? "up" : "down"}`} />
      </button>

      {open && (
        <div className="navitem__dropdown">
          <div className="dropdown__inner">
            <div className="dropdown__grid spacing">
              <div className="dropdown__col">
                <h4>Shop by Category</h4>
                <ul>
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <li key={category.slug}>
                        <Link
                          to={`/products/${root.slug}/${category.slug}`}
                          onClick={() => setOpen(false)}
                        >
                          {category.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="muted">No items</li>
                  )}
                </ul>
              </div>

              <div className="dropdown__col">
                <h4>Shop by Room</h4>
                <ul>
                  {rooms.length > 0 ? (
                    rooms.map((room) => (
                      <li key={room.slug}>
                        <Link
                          to={`/products/room/${room.slug}`}
                          onClick={() => setOpen(false)}
                        >
                          {room.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="muted">No items</li>
                  )}
                </ul>
              </div>
              <div className="dropdown__col">
                <Link
                to={`/products/${root.slug}`}
                className="view-all"
                onClick={() => setOpen(false)}
              >
                View all {root.name}
              </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavItem;
