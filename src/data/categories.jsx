export const CATEGORIES = [
  { name: "Lighting", slug: "lighting", parent: null },  // Đặt parent: null để chúng là root categories
  { name: "Furniture", slug: "furniture", parent: null }, // Đặt parent: null
  { name: "Accessories", slug: "accessories", parent: null }, // Đặt parent: null
  { name: "Gifts", slug: "gifts", parent: null }, // Đặt parent: null
  { name: "Explore", slug: "explore", parent: null }, // Đặt parent: null

  { name: "Pendant Lights", slug: "pendant-lights", parent: "lighting" },
  { name: "Portable Lights", slug: "portable-lights", parent: "lighting" },
  { name: "Ceiling Lights", slug: "ceiling-lights", parent: "lighting" },

  { name: "Sofas", slug: "sofas", parent: "furniture" },
  { name: "Chairs", slug: "chairs", parent: "furniture" },
];
