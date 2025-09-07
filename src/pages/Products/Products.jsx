// src/pages/Products/Products.jsx
import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./products.css";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import FilterRow from "../../components/Filter/FilterRow.jsx";

const toTitle = (s="") => s.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
const sortByCategoryThenName = (a,b) => {
  const aCat = (a?.category_id?.name || a?.category?.name || "").toLowerCase();
  const bCat = (b?.category_id?.name || b?.category?.name || "").toLowerCase();
  if (aCat !== bCat) return aCat.localeCompare(bCat);
  return (a?.name || "").localeCompare(b?.name || "");
};

export default function Products() {
  const { rootSlug, slug } = useParams(); // hỗ trợ /:rootSlug và /:rootSlug/:slug
  const { state } = useLocation() || {};

  const [mode, setMode] = useState(slug ? "loading" : (rootSlug ? "root" : "all")); // all|root|category|room|loading|unknown
  const [rootName, setRootName] = useState(rootSlug ? toTitle(rootSlug) : "Products");
  const [childName, setChildName] = useState(slug ? toTitle(slug) : "");

  const [products, setProducts] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  // Xác định slug là category hay room (nếu có slug)
  useEffect(() => {
    if (!slug) { setMode(rootSlug ? "root" : "all"); setChildName(""); return; }

    let aborted = false;
    setMode("loading");

    fetch("http://localhost:3000/api/categories/menu")
      .then(res => { if (!res.ok) throw new Error("HTTP " + res.status); return res.json(); })
      .then(json => {
        if (aborted) return;
        const list = Array.isArray(json?.data) ? json.data : Array.isArray(json) ? json : [];
        const entry = list.find(it => it?.parent?.slug === rootSlug);

        if (!entry) { setMode("unknown"); return; }

        // Tên root/child “đẹp”
        if (!state?.rootName && entry.parent?.name) setRootName(entry.parent.name);
        const foundRoom = entry.rooms?.find(r => r.slug === slug);
        const foundCat  = entry.children?.find(c => c.slug === slug);
        if (!state?.roomName && (foundRoom?.name || foundCat?.name)) {
          setChildName(foundRoom?.name || foundCat?.name);
        }

        setMode(foundCat ? "category" : (foundRoom ? "room" : "unknown"));
      })
      .catch(() => setMode("unknown"));

    return () => { aborted = true; };
  }, [rootSlug, slug, state?.rootName, state?.roomName]);

  // Fetch products theo mode (KHÔNG dùng API_BASE)
  useEffect(() => {
    let aborted = false;

    const run = async () => {
      if (mode === "loading") return; // đợi phân loại
      setLoading(true); setError("");

      try {
        let url = "http://localhost:3000/api/products";
        if (mode === "root")      url += `?root=${encodeURIComponent(rootSlug)}`;
        else if (mode === "category") url += `?root=${encodeURIComponent(rootSlug)}&category=${encodeURIComponent(slug)}`;
        else if (mode === "room")     url += `?root=${encodeURIComponent(rootSlug)}&room=${encodeURIComponent(slug)}`;
        else if (mode === "unknown")  url += `?root=${encodeURIComponent(rootSlug)}&category=${encodeURIComponent(slug)}`; // fallback
        // mode === 'all' => không query

        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status} - ${await res.text()}`);
        const data = await res.json();
        const list = Array.isArray(data?.products) ? data.products : [];
        const visible = list.filter(p => !p.is_hidden).sort(sortByCategoryThenName);

        if (!aborted) setProducts(visible);
      } catch (e) {
        if (!aborted) setError("Không lấy được danh sách sản phẩm.");
      } finally {
        if (!aborted) setLoading(false);
      }
    };

    run();
    return () => { aborted = true; };
  }, [mode, rootSlug, slug]);

  // Breadcrumb + tiêu đề
  const breadcrumb = useMemo(() => {
    if (mode === "root") return (<p className="spacing"><Link to="/">Home</Link> / <span>{rootName}</span></p>);
    if (mode === "category" || mode === "room")
      return (<p className="spacing"><Link to="/">Home</Link> / <Link to={`/${rootSlug}`}>{rootName}</Link> / <span>{childName}</span></p>);
    return (<p className="spacing"><Link to="/">Home</Link> / <span>Products</span></p>);
  }, [mode, rootName, childName, rootSlug]);

  const heading = useMemo(() => {
    if (mode === "root") return rootName;
    if (mode === "category" || mode === "room") return `${rootName} / ${childName}`;
    if (mode === "unknown") return `${toTitle(rootSlug || "Products")} / ${toTitle(slug || "")}`;
    return "All Products";
  }, [mode, rootName, childName, rootSlug, slug]);

  return (
    <div className="margintop">
      <div className="link_page pad">{breadcrumb}</div>
      <h1 className="title spacing">{heading}</h1>

      <FilterRow />
      <hr className="spacing" />

      <div className="products spacing">
        {loading && (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border" role="status" aria-label="Đang tải">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && !loading && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <div className="product_row row">
            {products.map(p => <ProductCard key={p._id} product={p} />)}
            {products.length === 0 && <p>No Products.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
