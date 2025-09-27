// src/lib/cartStore.js
export const CART_KEY = "ah_cart_v1";

export const emitCartUpdate = () => {
  window.dispatchEvent(new CustomEvent("cart:update"));
};

export const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify({ items }));
  emitCartUpdate(); // 🔔 báo cho badge
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


// tiện cho nơi thêm sản phẩm
export const addToCartLocal = (product) => {
  const items = loadCart();
  const idx = items.findIndex((it) => it._id === product._id);

  if (idx >= 0) items[idx].qty = (items[idx].qty || 1) + 1;
  else {
    const img =
      product.images?.find((i) => i.is_main)?.url ||
      product.images?.[0]?.url ||
      "/placeholder.png";
    items.push({
      _id: product._id,
      name: product.name,
      price: Number(product.price || 0),
      image: img,
      qty: 1,
    });
  }
  saveCart(items); // sẽ tự emitCartUpdate()
};

// custom hook cho badge
import { useEffect, useState } from "react";
export const useCartBadge = () => {
  const [count, setCount] = useState(getCartCount());
  useEffect(() => {
    const update = () => setCount(getCartCount());
    window.addEventListener("cart:update", update);
    window.addEventListener("storage", update); // bắt thay đổi từ tab khác
    // đồng bộ khi mount
    update();
    return () => {
      window.removeEventListener("cart:update", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return count;
};
