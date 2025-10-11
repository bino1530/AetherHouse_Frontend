// src/lib/cartStore.js
export const CART_KEY = "ah_cart_v1";
const FORM_KEY = "ah_checkout_form";


export const emitCartUpdate = () => {
  window.dispatchEvent(new CustomEvent("cart:update"));
};

export const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify({ items }));
  emitCartUpdate(); 
};

export const loadCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = JSON.parse(raw || '{"items":[]}');
    return Array.isArray(parsed.items) ? parsed.items : [];
  } catch { return []; }
};

export const getCartCount = () =>
  loadCart().reduce((s, it) => s + Number(it.qty || 1), 0);


export const addToCartLocal = (product, variant) => {
  const items = loadCart();

  const variantKey = (variant?.color || "default").toLowerCase();
  const _key = `${product._id}|${variantKey}`;

  const image =
    variant?.images?.[0]?.url ||
    variant?.images?.[0] ||
    product.images?.find((i) => i.is_main)?.url ||
    product.images?.[0]?.url ||
    "/placeholder.png";

  const price = Number((variant?.price ?? product.price) || 0);

  const idx = items.findIndex((it) => it._key === _key);
  if (idx >= 0) {
    items[idx].qty = (items[idx].qty || 1) + 1;
  } else {
    items.push({
      _key,                
      _id: product._id,
      name: product.name,
      price,
      image,
      qty: 1,
      variant: variant
        ? { color: variant.color, hex: variant.hex || null }
        : null,
    });
  }
  saveCart(items);
    window.dispatchEvent(new Event("cart:open"));

};




import { useEffect, useState } from "react";
export const useCartBadge = () => {
  const [count, setCount] = useState(getCartCount());
  useEffect(() => {
    const update = () => setCount(getCartCount());
    window.addEventListener("cart:update", update);
    window.addEventListener("storage", update);
    update();
    return () => {
      window.removeEventListener("cart:update", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return count;
};
