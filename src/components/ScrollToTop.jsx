// ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // Nếu có #anchor thì để trình duyệt tự cuộn đến anchor
    if (hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" }); // hoặc "smooth"
  }, [pathname, hash]);

  return null;
}
