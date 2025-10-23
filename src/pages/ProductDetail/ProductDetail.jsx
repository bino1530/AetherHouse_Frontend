// // src/pages/ProductDetail/ProductDetail.jsx
// import { useEffect, useMemo, useState } from "react";
// import { Link, useLocation, useParams } from "react-router-dom";
// import "./ProductDetail.css";
// import { addToCartLocal } from "../../lib/cartStore.jsx";
// import Usp from "../../components/usp/usp.jsx";
// const deriveStatus = (p = {}) => {
//   const norm = (v) =>
//     String(v ?? "")
//       .trim()
//       .toLowerCase();
//   const s = norm(p.status);
//   if (["preorder", "pre-order"].includes(s)) return { text: "Pre-Order" };
//   if (["sale", "discount", "clearance"].includes(s)) return { text: "Sale" };
//   if (["unavailable", "out_of_stock", "out-of-stock", "oos"].includes(s))
//     return { text: "Unavailable" };
//   if (["available", "in_stock", "in-stock"].includes(s))
//     return { text: "Available" };
//   if (p.is_hidden) return { text: "Unavailable" };
//   const qty = Number(p.quantity);
//   if (Number.isFinite(qty) && qty <= 0) return { text: "Unavailable" };
//   return { text: "Available" };
// };

// const orderImages = (images = []) => {
//   const arr = Array.isArray(images) ? images : [];
//   return [...arr.filter((i) => i?.is_main), ...arr.filter((i) => !i?.is_main)];
// };

// const fetchJSON = async (url, signal) => {
//   const r = await fetch(url, { signal });
//   if (!r.ok) throw new Error(`HTTP ${r.status} @ ${url}`);
//   return r.json();
// };

// export default function ProductDetail() {
//   const { rootSlug, slug, categorySlug: cSlug, productSlug } = useParams();
//   const categorySlug = cSlug || slug || "";
//   const idFromState = useLocation()?.state?.id;

//   const [product, setProduct] = useState(null);
//   const [variants, setVariants] = useState([]); // thêm state variant
//   const [selectedVariant, setSelectedVariant] = useState(null); // variant đang chọn
//   const [variants, setVariants] = useState([]); 
//   const [pendingVariant, setPendingVariant] = useState(null);
//   const [selectedVariant, setSelectedVariant] = useState(null); 
//   const [selectedImage, setSelectedImage] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");


// useEffect(() => {
//   if (showColors) setPendingVariant(selectedVariant);
// }, [showColors, selectedVariant]);

// useEffect(() => {
//   document.body.style.overflow = showColors ? "hidden" : "";
//   return () => (document.body.style.overflow = "");
// }, [showColors]);

//   useEffect(() => {
//     const ac = new AbortController();
//     (async () => {
//       try {
//         setLoading(true);
//         setError("");
//         setProduct(null);
//         let id = idFromState;
//         if (!id) {
//           const listUrl = `/api/products/by-cate/${rootSlug}/${categorySlug}`;
//           const data = await fetchJSON(listUrl, ac.signal);
//           id = (data?.products || []).find((p) => p?.slug === productSlug)?._id;
//           if (!id) throw new Error(`not-found slug=${productSlug}`);
//         }

//         const detailUrl = `/api/products/by-id/${id}`;
//         const json = await fetchJSON(detailUrl, ac.signal);
//         const p = json?.product || json;
//         if (!p?._id) throw new Error("bad-payload");

//         setProduct(p);

//         const variantUrl = `/api/variants/by-product/${p._id}`;
//         const variantData = await fetchJSON(variantUrl, ac.signal);
//         const variantList = variantData?.variant?.Variation || [];
//         setVariants(variantList);

//         const defaultVar =
//           variantList.find(v => v.color?.toLowerCase() === "copper") || variantList[0];

//         setSelectedVariant(defaultVar);
//         setSelectedImage(defaultVar?.images?.[0] || p?.images?.[0]?.url || "");

//         document.title = `${p.name} – AetherHouse`;
//       } catch (e) {
//         if (e.name !== "AbortError") {
//           console.error("[ProductDetail]", e);
//           setError("Không tìm thấy sản phẩm.");
//         }
//       } finally {
//         if (!ac.signal.aborted) setLoading(false);
//       }
//     })();
//     return () => ac.abort();
//   }, [rootSlug, categorySlug, productSlug, idFromState]);

//   const imgs = useMemo(() => orderImages(product?.images), [product]);
//   const handleImgErr = (e) => {
//     e.currentTarget.src = "/placeholder.png";
//   };

//   if (loading) return <div className="pd_wrap pad spacing">Loading...</div>;
//   if (error)
//     return (
//       <div className="pd_wrap pad spacing" style={{ color: "red" }}>
//         {error}
//       </div>
//     );
//   if (!product) return null;

//   const cateName =
//     product?.category_id?.name || product?.category?.name || categorySlug;
//   if (!product) return null;
//   const st = deriveStatus(product);

//   return (
//     <div className="pd_wrap pad margintop">
//       <p className="link_page pad spacing">
//         <Link to="/">Home</Link> / <Link to={`/${rootSlug}`}>{rootSlug}</Link> /{" "}
//         <Link to={`/${rootSlug}/${categorySlug}`}>{cateName}</Link> /{" "}
//         <span>{product.name}</span>
//       </p>

//       <div className="pd_grids">
//         <div className="pd_gallery">
//           <div className="pd_galleryGrid">
//             {(selectedVariant?.images && selectedVariant.images.length > 0
//               ? selectedVariant.images
//               : imgs
//             ).map((im, i) => (
//               <img
//                 key={i}
//                 src={im?.url || im || "/placeholder.png"}
//                 alt={`${product.name} - ${selectedVariant?.color || "default"}`}
//                 loading="lazy"
//                 onError={handleImgErr}
//                 className="pd_img"
//               />
//             ))}
//           </div>
//         </div>

//         <div className="pd_info spacing">
//           <div className="pd_info_title">
//             <h1 className="pd_title">{product.name}</h1>
//             <span className="studio_status--inline">{st.text}</span>
//           </div>

//           {cateName && <p className="pd_cate">{cateName}</p>}

//           {product.description && (
//             <div className="pd_desc">
//               {String(product.description)
//                 .split("\n")
//                 .map((line, i) => (
//                   <p key={i}>{line}</p>
//                 ))}
//             </div>
//           )}

          

//           <hr className="pd_divider" />

//           {/* variant */}
//           <div className="pd_variant">
//   <div className="variant_colors">
//     {variants.map((v) => (
//       <span
//         key={v._id}
//         className={`swatch ${selectedVariant?._id === v._id ? "active" : ""}`}
//         style={{
//           backgroundColor: v.hex || "#ccc",
//           border:
//             selectedVariant?._id === v._id,
//         }}
//         aria-label={v.color}
//         title={v.color}
//         onClick={() => {
//           setSelectedVariant(v);
//           setSelectedImage(v.images?.[0]?.url || ""); // ✅ đổi ảnh theo variant
//         }}
//       ></span>
//     ))}
//   </div>

//   {/* Hiển thị tên màu hiện tại */}
//   <div className="current_color">
//     {selectedVariant?.color ? (
//       <p>Colour: <b>{selectedVariant.color}</b></p>
//     ) : (
//       <p>No colour selected</p>
//     )}
//   </div>
// </div>


//           <hr className="pd_divider" />

//           <p className="pd_warranty">
//             <span className="ico_shield" aria-hidden="true"></span>
//             Ultimate peace of mind. An additional 1-year warranty when purchased
//             from AetherHouse.
//           </p>

//           {/* purchase card */}
//           <div className="pd_purchaseCard">
//             <p className="pd_eta">
//               Be the first! Order today to receive in late September
//             </p>
//             <div className="pd_priceRow">
//               <div className="pd_price">
//                 ${Number(product.price || 0).toLocaleString()}
//               </div>
//               <button
//                 className="btn_style_3"
//                 type="button"
//                 onClick={() => {
//                   addToCartLocal(product, selectedVariant); 
//                 }}
//               >
//                 <span>Add To Cart</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//       {showColors && (
//               <>
//                 <div className="overlay" onClick={() => setShowColors(false)} />

//                 <div
//                   className="color_panel slide_in_right"
//                   role="dialog"
//                   aria-modal="true"
//                   aria-labelledby="panel_title"
//                 >
//                   <div className="panel_header">
//                     <h3 id="panel_title">Product Configuration</h3>
//                     <button className="close_btn" onClick={() => setShowColors(false)}>✕</button>
//                   </div>

//                   <div className="panel_section">
//                     <h4>Select Colour</h4>
//                     <div className="color_grid">
//                       {variants.map((v) => (
//                         <div
//                           key={v._id}
//                           className={`color_card ${selectedVariant?._id === v._id ? "active" : ""}`}
//                           onClick={() => {
//                             setPendingVariant(v);
//                             setSelectedImage(v.images?.[0] || "");
//                           }}
//                         >
//                           <div className="color_square" style={{ backgroundColor: v.hex || "#ccc" }} />
//                           <div className="color_info">
//                             <p className="color_name">{v.color}</p>
//                             {v.price && <p className="color_price">${v.price}</p>}
//                           </div>
//                           {pendingVariant?._id === v._id && (
//                             <div className="color_selected">✔</div>
//                           )}
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="panel_footer">
//                     <button
//                       className="btn_style_3"
//                       onClick={() => {
//                         if (!pendingVariant) return;
//                         setSelectedVariant(pendingVariant);
//                         setSelectedImage(pendingVariant.images?.[0] || "");
//                         setShowColors(false);
//                       }}
//                     >
//                       <span>Confirm Selection</span>
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//       <Usp />
              
//     </div>
//   );
// }

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import "./ProductDetail.css";
import { addToCartLocal } from "../../lib/cartStore.jsx";
import Usp from "../../components/usp/usp.jsx";
import api from "../../lib/axios"; 

const deriveStatus = (p = {}) => {
  const norm = (v) => String(v ?? "").trim().toLowerCase();
  const s = norm(p.status);
  if (["preorder", "pre-order"].includes(s)) return { text: "Pre-Order" };
  if (["sale", "discount", "clearance"].includes(s)) return { text: "Sale" };
  if (["unavailable", "out_of_stock", "out-of-stock", "oos"].includes(s))
    return { text: "Unavailable" };
  if (["available", "in_stock", "in-stock"].includes(s))
    return { text: "Available" };
  if (p.is_hidden) return { text: "Unavailable" };
  const qty = Number(p.quantity);
  if (Number.isFinite(qty) && qty <= 0) return { text: "Unavailable" };
  return { text: "Available" };
};

const orderImages = (images = []) => {
  const arr = Array.isArray(images) ? images : [];
  return [...arr.filter((i) => i?.is_main), ...arr.filter((i) => !i?.is_main)];
};

export default function ProductDetail() {
  const { rootSlug, slug, categorySlug: cSlug, productSlug } = useParams();
  const categorySlug = cSlug || slug || "";
  const idFromState = useLocation()?.state?.id;

  const [product, setProduct] = useState(null);
  const [variants, setVariants] = useState([]);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const ac = new AbortController();

    (async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        // 1) Lấy id từ state hoặc query theo slug
        let id = idFromState;
        if (!id) {
          // ❗ KHÔNG có /api vì baseURL đã chứa /api
          const listUrl =
            `/products/by-cate/${encodeURIComponent(rootSlug)}/${encodeURIComponent(categorySlug)}`;
          const { data } = await api.get(listUrl, { signal: ac.signal });
          id = (data?.products || []).find((p) => p?.slug === productSlug)?._id;
          if (!id) throw new Error(`not-found slug=${productSlug}`);
        }

        // 2) Lấy chi tiết
        const detailUrl = `/products/by-id/${id}`;
        const { data: detailData } = await api.get(detailUrl, { signal: ac.signal });
        const p = detailData?.product || detailData;
        if (!p?._id) throw new Error("bad-payload");

        setProduct(p);

        // 3) Lấy variants theo product
        const variantUrl = `/variants/by-product/${p._id}`;
        const { data: variantData } = await api.get(variantUrl, { signal: ac.signal });
        const variantList = variantData?.variant?.Variation || [];
        setVariants(variantList);

        // 4) Chọn default variant
        const defaultVar =
          variantList.find((v) => v.color?.toLowerCase() === "copper") || variantList[0];
        setSelectedVariant(defaultVar);
        setSelectedImage(defaultVar?.images?.[0]?.url || p?.images?.[0]?.url || "");

        // 5) Title
        document.title = `${p.name} – AetherHouse`;
      } catch (e) {
        if (e.name !== "CanceledError" && e.name !== "AbortError") {
          console.error("[ProductDetail]", e);
          setError("Không tìm thấy sản phẩm.");
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    })();

    return () => ac.abort();
  }, [rootSlug, categorySlug, productSlug, idFromState]);

  const imgs = useMemo(() => orderImages(product?.images), [product]);
  const handleImgErr = (e) => {
    e.currentTarget.src = "/placeholder.png";
  };

  if (loading) return <div className="pd_wrap pad spacing">Loading...</div>;
  if (error)
    return (
      <div className="pd_wrap pad spacing" style={{ color: "red" }}>
        {error}
      </div>
    );
  if (!product) return null;

  const cateName =
    product?.category_id?.name || product?.category?.name || categorySlug;
  const st = deriveStatus(product);

  return (
    <div className="pd_wrap pad margintop">
      <p className="link_page pad spacing">
        <Link to="/">Home</Link> / <Link to={`/${rootSlug}`}>{rootSlug}</Link> /{" "}
        <Link to={`/${rootSlug}/${categorySlug}`}>{cateName}</Link> /{" "}
        <span>{product.name}</span>
      </p>

      <div className="pd_grids">
        <div className="pd_gallery">
          <div className="pd_galleryGrid">
            {(selectedVariant?.images && selectedVariant.images.length > 0
              ? selectedVariant.images
              : imgs
            ).map((im, i) => (
              <img
                key={i}
                src={im?.url || im || "/placeholder.png"}
                alt={`${product.name} - ${selectedVariant?.color || "default"}`}
                loading="lazy"
                onError={handleImgErr}
                className="pd_img"
              />
            ))}
          </div>
        </div>

        <div className="pd_info spacing">
          <div className="pd_info_title">
            <h1 className="pd_title">{product.name}</h1>
            <span className="studio_status--inline">{st.text}</span>
          </div>

          {cateName && <p className="pd_cate">{cateName}</p>}

          {product.description && (
            <div
              className="pd_desc"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          <hr className="pd_divider" />

          {/* ✅ Chọn màu để đổi ảnh */}
          <div className="pd_variant">
            <div className="variant_colors">
              {variants.map((v) => (
                <span
                  key={v._id}
                  className={`swatch ${selectedVariant?._id === v._id ? "active" : ""}`}
                  style={{
                    backgroundColor: v.hex || "#ccc",
                    transform: selectedVariant?._id === v._id ? "scale(1.3)" : "scale(1)",
                    transition: "transform 0.2s ease",
                  }}
                  aria-label={v.color}
                  title={v.color}
                  onClick={() => {
                    setSelectedVariant(v);
                    setSelectedImage(v.images?.[0]?.url || "");
                  }}
                ></span>
              ))}
            </div>
          </div>

          <hr className="pd_divider" />

          <p className="pd_warranty">
            <span className="ico_shield" aria-hidden="true"></span>
            Ultimate peace of mind. An additional 1-year warranty when purchased
            from AetherHouse.
          </p>

          <div className="pd_purchaseCard">
            <p className="pd_eta">Be the first! Order today to receive in late September</p>
            <div className="pd_priceRow">
              <div className="pd_price">
                ${Number(product.price || 0).toLocaleString()}
              </div>
              <button
                className="btn_style_3"
                type="button"
                onClick={() => {
                  addToCartLocal(product, selectedVariant);
                }}
              >
                <span>Add To Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <Usp />
    </div>
  );
}
