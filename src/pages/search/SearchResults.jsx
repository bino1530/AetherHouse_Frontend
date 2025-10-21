import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../../lib/axios";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
import "../Products/products.css"; // dùng chung style với trang Products

const LOCAL_LIMIT = 5;

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const q = (params.get("q") || "").trim();

  // cùng kiểu state như Products
  const [state, setState] = useState({
    loading: false,
    error: "",
    baseItems: [],   // tất cả items (đã fetch)
  });

  // sort giống trang Products (client-side vì API search không sort)
  const sortQS = params.get("sort") || "createdAt_desc";
  const pageQS = Math.max(parseInt(params.get("page") || "1", 10), 1);

  // fetch theo q
  useEffect(() => {
    if (!q) {
      setState({ loading: false, error: "", baseItems: [] });
      return;
    }
    const ac = new AbortController();
    setState(s => ({ ...s, loading: true, error: "" }));

    api.get(`/products/search?q=${encodeURIComponent(q)}`, { signal: ac.signal })
      .then(res => {
        const list = (res?.data?.products || []).filter(p => !p?.is_hidden);
        setState({ loading: false, error: "", baseItems: list });
      })
      .catch(e => {
        if (e.name !== "CanceledError") {
          setState({ loading: false, error: "Lỗi tìm kiếm", baseItems: [] });
        }
      });

    return () => ac.abort();
  }, [q]);

  // hàm sort local
  const sorted = useMemo(() => {
    const items = [...state.baseItems];
    if (sortQS === "price_asc") {
      items.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortQS === "price_desc") {
      items.sort((a, b) => Number(b.price) - Number(a.price));
    } else {
      // createdAt_desc (mặc định)
      items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return items;
  }, [state.baseItems, sortQS]);

  // phân trang local giống Products
  const localPaged = useMemo(() => {
    const total = sorted.length;
    const totalPages = Math.max(Math.ceil(total / LOCAL_LIMIT), 1);
    const page = Math.min(pageQS, totalPages);
    const start = (page - 1) * LOCAL_LIMIT;
    return {
      items: sorted.slice(start, start + LOCAL_LIMIT),
      meta: {
        total, page, limit: LOCAL_LIMIT, totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalPages ? page + 1 : null,
        sort: sortQS
      }
    };
  }, [sorted, pageQS, sortQS]);

  const renderItems = localPaged.items;
  const meta = localPaged.meta;
  const pages = Array.from({ length: meta.totalPages || 1 }, (_, i) => i + 1);

  const goPage = (p) => {
    if (!p || p < 1) return;
    const next = new URLSearchParams(params);
    next.set("page", String(p));
    if (sortQS) next.set("sort", sortQS);
    setParams(next, { replace: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const changeSort = (e) => {
    const next = new URLSearchParams(params);
    const val = e.target.value;
    val ? next.set("sort", val) : next.delete("sort");
    next.set("page", "1");
    setParams(next, { replace: false });
  };

  return (
    <div className="margintop">
      <h1 className="title-product spacing">
        {q ? `Kết quả cho “${q}”` : "Kết quả tìm kiếm"}
      </h1>

      <hr className="spacing" />
      <div className="link_page pad spacing">
        <Link to="/">Home</Link> / <span>Search</span>
      </div>

      <div className="sortrow spacing">
        {/* Giữ đúng layout: bên trái FilterRow của trang Products – trang Search bỏ trống */}
        <div className="pad" />
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

        {!state.loading && state.error && (
          <p style={{ color: "red" }}>{state.error}</p>
        )}

        {!state.loading && !state.error && (
          <>
            <div className="product_row row">
              {renderItems.length === 0 && <p>No Products.</p>}
              {renderItems.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  rootSlug={
                    p?.category_id?.parent?.slug ||
                    p?.category?.parent?.slug ||
                    ""
                  }
                />
              ))}
            </div>

            {meta.totalPages > 1 && (
              <nav className="spacing d-flex justify-content-center">
                <ul className="pagination">
                  <li className={`page-item ${!meta.hasPrev ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => goPage(meta.prevPage)}
                      disabled={!meta.hasPrev}
                    >
                      ‹ Prev
                    </button>
                  </li>
                  {pages.map((n) => (
                    <li key={n} className={`page-item ${n === meta.page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => goPage(n)}>
                        {n}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${!meta.hasNext ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => goPage(meta.nextPage)}
                      disabled={!meta.hasNext}
                    >
                      Next ›
                    </button>
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
