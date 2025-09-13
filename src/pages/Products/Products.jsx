import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./products.css";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import FilterRow from "../../components/Filter/FilterRow.jsx";

const toTitle = (s="") =>
  s.split("-").map(w => (w[0]?.toUpperCase()||"") + w.slice(1)).join(" ");

const sortByCategoryThenName = (a,b) => {
  const aCat = (a?.category_id?.name || a?.category?.name || "").toLowerCase();
  const bCat = (b?.category_id?.name || b?.category?.name || "").toLowerCase();
  if (aCat !== bCat) return aCat.localeCompare(bCat);
  return (a?.name || "").localeCompare(b?.name || "");
};

export default function Products() {
  const { rootSlug, slug } = useParams();
  const mode = useMemo(() => (slug ? "category" : rootSlug ? "root" : "all"), [rootSlug, slug]);

  const path = useMemo(() => {
    if (mode === "category") return `/api/products/by-cate/${rootSlug}/${slug}`;
    if (mode === "root")     return `/api/products/by-cate/${rootSlug}`;
    return `/api/products`;
  }, [mode, rootSlug, slug]);

  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true); setError(""); setProducts([]);

    fetch(path, { signal: ac.signal })
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(data => {
        const list = Array.isArray(data?.products) ? data.products : [];
        setProducts(list.filter(p => !p.is_hidden).sort(sortByCategoryThenName));
      })
      .catch(e => { if (e.name !== "AbortError") setError("Không lấy được danh sách sản phẩm."); })
      .finally(() => setLoading(false));

    return () => ac.abort();
  }, [path]);

  const rootName  = mode === "all" ? "Products" : toTitle(rootSlug);
  const childName = mode === "category"
    ? (products[0]?.category_id?.name || products[0]?.category?.name || toTitle(slug))
    : "";

  const breadcrumb = (
    <p className="spacing">
      <Link to="/">Home</Link> /{" "}
      {mode === "root" && <span>{rootName}</span>}
      {mode === "category" && <>
        <Link to={`/${rootSlug}`}>{rootName}</Link> / <span>{childName}</span>
      </>}
      {mode === "all" && <span>Products</span>}
    </p>
  );
  const heading = mode === "category" ? childName : (mode === "root" ? rootName : "All Products");

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
            {products.map(p => {
              const inferredRoot =
                rootSlug ||
                p?.category_id?.parent?.slug ||
                p?.category?.parent?.slug ||
                "";
              return <ProductCard key={p._id} product={p} rootSlug={inferredRoot} />;
            })}
            {products.length === 0 && <p>No Products.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
