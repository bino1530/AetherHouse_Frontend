import { Link, useParams, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "./products.css";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import FilterRow from "../../components/Filter/FilterRow.jsx";
import api from "../../lib/axios";

const toTitle = (s="") => s.split("-").map(w => (w[0]?.toUpperCase()||"")+w.slice(1)).join(" ");
const byCateThenName = (a,b) =>
  ((a?.category_id?.name || a?.category?.name || "").toLowerCase())
    .localeCompare((b?.category_id?.name || b?.category?.name || "").toLowerCase())
  || (a?.name || "").localeCompare(b?.name || "");

const LOCAL_LIMIT = 7;

export default function Products() {
  const { rootSlug, slug } = useParams();
  const mode = slug ? "category" : rootSlug ? "root" : "all";
  const path = useMemo(() => (
    mode === "category" ? `/products/by-cate/${rootSlug}/${slug}` :
    mode === "root"     ? `/products/by-cate/${rootSlug}`         : `/products`
  ), [mode, rootSlug, slug]);

  const [searchParams, setSearchParams] = useSearchParams();
  const pageQS = Math.max(parseInt(searchParams.get("page")||"1",10),1);
  const sortQS = searchParams.get("sort") || "createdAt_desc";

  const [selectedColors, setSelectedColors] = useState([]);
  const [state, setState] = useState({ loading:true, error:"", items:[], meta:null, baseItems:[] });
  const colorScope = useMemo(() => {
    if (mode === "category") {
      // /lighting/floor-lamps
      return { scope: "category", parentSlug: rootSlug, childSlug: slug };
    }
    if (mode === "root") {
      // /lighting
      return { scope: "category", rootSlug };
    }
    return { scope: "all" };
  }, [mode, rootSlug, slug]);
  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    next.set("page","1");
    if (sortQS) next.set("sort", sortQS);
    setSearchParams(next, { replace:false });
    // eslint-disable-next-line
  }, [selectedColors.join(",")]);

  useEffect(() => {
    const ac = new AbortController();
    setState(s => ({ ...s, loading:true, error:"", items:[], meta:null }));

    const fetchOneColor = (color) => api.get(
      `/products/by-color/${encodeURIComponent(color)}`,
      { params:{ page:pageQS, limit:7, sort: sortQS==="createdAt_desc"?undefined:sortQS }, signal:ac.signal }
    );

    const fetchMultiColors = async (colors) => {
      const params = { page:1, limit:60, sort: sortQS==="createdAt_desc"?undefined:sortQS };
      const rs = await Promise.all(colors.map(c =>
        api.get(`/products/by-color/${encodeURIComponent(c)}`, { params, signal:ac.signal }).catch(()=>({data:{products:[]}}))
      ));
      const seen = new Set();
      const merged = [];
      rs.forEach(r => (r?.data?.products||[]).forEach(p => {
        if (!p?.is_hidden && !seen.has(p._id)) { seen.add(p._id); merged.push(p); }
      }));
      return merged.sort(byCateThenName);
    };

    (async () => {
      try {
        if (selectedColors.length === 0) {
          const serverPaginate = mode==="root" || mode==="category";
          const params = serverPaginate ? { page:pageQS, limit:7, sort: sortQS==="createdAt_desc"?undefined:sortQS } : {};
          const { data } = await api.get(path, { params, signal:ac.signal });
          const list = (data?.products||[]).filter(p=>!p.is_hidden);
          if (serverPaginate && data?.meta?.total != null) {
            setState({ loading:false, error:"", items:list, meta:{...data.meta, limit:data.meta.limit??7}, baseItems:[] });
          } else {
            setState({ loading:false, error:"", items:[], meta:null, baseItems:[...list].sort(byCateThenName) });
          }
          return;
        }

        if (selectedColors.length === 1) {
          const { data } = await fetchOneColor(selectedColors[0]);
          const list = (data?.products||[]).filter(p=>!p.is_hidden);
          setState({ loading:false, error:"", items:list, meta:{...data?.meta, limit:data?.meta?.limit??6, sort:sortQS}, baseItems:[] });
          return;
        }

        const base = await fetchMultiColors(selectedColors);
        setState({ loading:false, error:"", items:[], meta:null, baseItems:base });
      } catch (e) {
        if (e.name!=="AbortError") setState(s=>({ ...s, loading:false, error:"Loading...", items:[], meta:null }));
      }
    })();

    return () => ac.abort();
  }, [path, pageQS, sortQS, mode, selectedColors]);

  const localPaged = state.meta ? null : (() => {
    const total = state.baseItems.length;
    const totalPages = Math.max(Math.ceil(total/LOCAL_LIMIT),1);
    const page = Math.min(pageQS,totalPages);
    const start = (page-1)*LOCAL_LIMIT;
    return {
      items: state.baseItems.slice(start, start+LOCAL_LIMIT),
      meta: {
        total, page, limit: LOCAL_LIMIT, totalPages,
        hasPrev: page>1, hasNext: page<totalPages,
        prevPage: page>1 ? page-1 : null,
        nextPage: page<totalPages ? page+1 : null,
        sort: sortQS
      }
    };
  })();

  const renderItems = state.meta ? state.items : (localPaged?.items||[]);
  const meta = state.meta || localPaged?.meta || { total:renderItems.length, page:1, totalPages:1, hasPrev:false, hasNext:false, prevPage:null, nextPage:null, limit:LOCAL_LIMIT, sort:sortQS };

  const rootName  = mode==="all" ? "Products" : toTitle(rootSlug);
  const childName = mode==="category" ? (renderItems[0]?.category_id?.name || renderItems[0]?.category?.name || toTitle(slug)) : "";

  const goPage = (p) => {
    if (!p || p<1) return;
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    if (sortQS) next.set("sort", sortQS);
    setSearchParams(next, { replace:false });
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const changeSort = (e) => {
    const next = new URLSearchParams(searchParams);
    const val = e.target.value;
    val ? next.set("sort", val) : next.delete("sort");
    next.set("page","1");
    setSearchParams(next, { replace:false });
  };

  const pages = Array.from({ length: meta.totalPages||1 }, (_,i)=>i+1);

  return (
    <div className="margintop">
      <h1 className="title-product spacing">
        {mode==="category" ? childName : mode==="root" ? rootName : "All Products"}
      </h1>

      <hr className="spacing" />
      <div className="link_page spacing">
        <Link to="/">Home</Link> /{" "}
        {mode==="all" && <span>Products</span>}
        {mode==="root" && <span>{rootName}</span>}
        {mode==="category" && (<><Link to={`/${rootSlug}`}>{rootName}</Link> / <span>{childName}</span></>)}
      </div>

      <div className="sortrow spacing">
        <FilterRow onColorChange={setSelectedColors} scopeParams={colorScope} />
          <div className="pad d-flex gap-2 align-items-center">
          <label htmlFor="sort" className="me-2">Sort:</label>
          <select id="sort" value={sortQS} onChange={changeSort}>
            <option value="createdAt_desc">Newest</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      <div className="products spacing">
        {state.loading && (
          <div className="d-flex justify-content-center py-4">
            <div className="spinner-border" role="status" aria-label="Đang tải">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {!state.loading && state.error && <p style={{ color:"red" }}>{state.error}</p>}

        {!state.loading && !state.error && (
          <>
            <div className="product_row row">
              {renderItems.length===0 && <p>No Products.</p>}
              {renderItems.map(p => (
                <ProductCard
                  key={p._id}
                  product={p}
                  rootSlug={rootSlug || p?.category_id?.parent?.slug || p?.category?.parent?.slug || ""}
                />
              ))}
            </div>

            {meta.totalPages>1 && (
              <nav className="spacing d-flex justify-content-center">
                <ul className="pagination">
                  <li className={`page-item ${!meta.hasPrev?"disabled":""}`}>
                    <button className="page-link" onClick={() => goPage(meta.prevPage)} disabled={!meta.hasPrev}>‹ Prev</button>
                  </li>
                  {pages.map(n => (
                    <li key={n} className={`page-item ${n===meta.page?"active":""}`}>
                      <button className="page-link" onClick={() => goPage(n)}>{n}</button>
                    </li>
                  ))}
                  <li className={`page-item ${!meta.hasNext?"disabled":""}`}>
                    <button className="page-link" onClick={() => goPage(meta.nextPage)} disabled={!meta.hasNext}>Next ›</button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
