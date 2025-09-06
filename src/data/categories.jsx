// Flat list: parent === null là root; còn lại là con của slug đó
export const CATEGORIES = [
  // ROOTS
  { name: "What's New", slug: "whatsnew", parent: null, kind: "category", order: 1 },
  { name: "Lighting",   slug: "lighting", parent: null, kind: "category", order: 2 },
  { name: "Furniture",  slug: "furniture", parent: null, kind: "category", order: 3 },
  { name: "Accessories",slug: "accessories", parent: null, kind: "category", order: 4 },
  { name: "Gifts",      slug: "gifts", parent: null, kind: "category", order: 5 },
  { name: "Explore",    slug: "explore", parent: null, kind: "category", order: 6 },

  // CHILDREN of lighting (kind=category)
  { name: "Portable Lights", slug: "portable-lights", parent: "lighting", kind: "category" },
  { name: "Pendant Lights",  slug: "pendant-lights",  parent: "lighting", kind: "category" },
  { name: "Floor Lights",    slug: "floor-lights",    parent: "lighting", kind: "category" },
  { name: "Ceiling Lights",  slug: "ceiling-lights",  parent: "lighting", kind: "category" },
  { name: "Desk Lights",     slug: "desk-lights",     parent: "lighting", kind: "category" },
  { name: "Table Lights",    slug: "table-lights",    parent: "lighting", kind: "category" },
  { name: "Outdoor Lights",  slug: "outdoor-lights",  parent: "lighting", kind: "category" },
  { name: "Wall Lights",     slug: "wall-lights",     parent: "lighting", kind: "category" },

  // CHILDREN of lighting (kind=room)
  { name: "Kitchen",     slug: "kitchen",      parent: "lighting", kind: "room" },
  { name: "Bathroom",    slug: "bathroom",     parent: "lighting", kind: "room" },
  { name: "Bedroom",     slug: "bedroom",      parent: "lighting", kind: "room" },
  { name: "Dining Room", slug: "dining-room",  parent: "lighting", kind: "room" },
  { name: "Hallway",     slug: "hallway",      parent: "lighting", kind: "room" },
  { name: "Living Room", slug: "living-room",  parent: "lighting", kind: "room" },
  { name: "Outdoors",    slug: "outdoors",     parent: "lighting", kind: "room" },
  { name: "Workspace",   slug: "workspace",    parent: "lighting", kind: "room" },

  // CHILDREN of furniture (ví dụ)
  { name: "Sofas",  slug: "sofas",  parent: "furniture", kind: "category" },
  { name: "Chairs", slug: "chairs", parent: "furniture", kind: "category" },
];
