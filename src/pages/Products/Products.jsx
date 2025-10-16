import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./products.css";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import FilterRow from "../../components/Filter/FilterRow.jsx";

const toTitle = (s = "") =>
  s.split("-").map(w => (w[0]?.toUpperCase() || "") + w.slice(1)).join(" ");

const byCateThenName = (a, b) =>
  ((a?.category_id?.name || a?.category?.name || "").toLowerCase())
    .localeCompare((b?.category_id?.name || b?.category?.name || "").toLowerCase())
  || (a?.name || "").localeCompare(b?.name || "");






export default function Products() {
  const { rootSlug, slug } = useParams();
  const mode = slug ? "category" : rootSlug ? "root" : "all";
  const path = useMemo(() => (
    mode === "category" ? `/api/products/by-cate/${rootSlug}/${slug}` :
    mode === "root"     ? `/api/products/by-cate/${rootSlug}` : `/api/products`
  ), [mode, rootSlug, slug]);





  const [baseItems, setBaseItems] = useState([]); 
  const [state, setState] = useState({ items: [], loading: true, error: "" });
  const [selectedColors, setSelectedColors] = useState([]);

  useEffect(() => {
    const ac = new AbortController();
    setState({ items: [], loading: true, error: "" });
    setSelectedColors([]); 

    (async () => {
      try {
        const r = await fetch(path, { signal: ac.signal });
        if (!r.ok) throw new Error("fetch failed");
        const data = await r.json();
        const items = (data?.products || [])
          .filter(p => !p.is_hidden)
          .sort(byCateThenName);

        setBaseItems(items);
        setState({ items, loading: false, error: "" });
      } catch (e) {
        if (e.name !== "AbortError") {
          setState({ items: [], loading: false, error: "lỗi" });
        }
      }
    })();

    return () => ac.abort();
  }, [path]);





  useEffect(() => {
    if (!selectedColors.length) {
      setState(s => ({ ...s, items: baseItems }));
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setState(s => ({ ...s, loading: true }));
        const results = await Promise.all(
          selectedColors.map(c =>
            fetch(`/api/products/by-color/${encodeURIComponent(c)}`).then(r => r.json())
          )
        );
        const map = new Map();
        results.forEach(res => {
          (res?.products || []).forEach(p => {
            if (!map.has(p._id)) map.set(p._id, p);
          });
        });
        let unionList = Array.from(map.values());
        if (mode !== "all") {
          const allowedIds = new Set(baseItems.map(p => p._id));
          unionList = unionList.filter(p => allowedIds.has(p._id));
        }

        unionList.sort(byCateThenName);

        if (!cancelled) {
          setState(s => ({ ...s, items: unionList, loading: false, error: "" }));
        }
      } catch (e) {
        if (!cancelled) setState(s => ({ ...s, loading: false, error: "lỗi" }));
      }
    })();

    return () => { cancelled = true; };
  }, [selectedColors, mode, baseItems]);






  const { items, loading, error } = state;
  const rootName  = mode === "all" ? "Products" : toTitle(rootSlug);
  const childName = mode === "category"
    ? (items[0]?.category_id?.name || items[0]?.category?.name || toTitle(slug))
    : "";


  return (
    <div className="margintop">
      <h1 className="title-product spacing">
        {mode === "category" ? childName : mode === "root" ? rootName : "All Products"}
      </h1>



      <hr className="spacing" />
      <div className="link_page pad spacing">
        <Link to="/">Home</Link> /{" "}
        {mode === "all" && <span>Products</span>}
        {mode === "root" && <span>{rootName}</span>}
        {mode === "category" && (
          <>
            <Link to={`/${rootSlug}`}>{rootName}</Link> / <span>{childName}</span>
          </>
        )}
      </div>



      <FilterRow onColorChange={setSelectedColors} />

      <div className="products spacing">
        {loading && (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border" role="status" aria-label="Đang tải">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!loading && error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <div className="product_row row">
            {items.length === 0 && <p>No Products.</p>}
            {items.map(p => (
              <ProductCard
                key={p._id}
                product={p}
                rootSlug={
                  rootSlug ||
                  p?.category_id?.parent?.slug ||
                  p?.category?.parent?.slug ||
                  ""
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
