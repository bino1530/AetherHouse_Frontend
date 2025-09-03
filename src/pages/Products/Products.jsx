import { Link, useParams } from "react-router-dom";
import "./products.css";
import ProductCard from "../../components/ProductCard/ProductCard.jsx";
// DEMO DATA
const DEMO_PRODUCTS = {
  lighting: [
    {
      id: 1,
      name: "Copper Pendant",
      price: 1990000,
      image_first: "/product1.webp",
      status: "available",
    },
    {
      id: 1,
      name: "Copper Pendant",
      price: 1990000,
      image_first: "/product1.webp",
      status: "available",
    },
    {
      id: 1,
      name: "Copper Pendant",
      price: 1990000,
      image_first: "/product1.webp",
      status: "available",
    },
    {
      id: 1,
      name: "Copper Pendant",
      price: 1990000,
      image_first: "/product1.webp",
      status: "available",
    },
    {
      id: 2,
      name: "Ceiling Lamp",
      price: 2990000,
      image_first: "/product1.webp",
      status: "out of stock",
    },
  ],
  furniture: [
    {
      id: 3,
      name: "Wooden Chair",
      price: 1490000,
      image_first: "/product1.webp",
      status: "available",
    },
  ],
  accessory: [
    {
      id: 4,
      name: "Wall Hook",
      price: 99000,
      image_first: "/product1.webp",
      status: "available",
    },
  ],
  gifts: [
    {
      id: 5,
      name: "Gift Box - Small",
      price: 59000,
      image_first: "/product1.webp",
      status: "available",
    },
  ],
};

// fake data tk cà té

const DEMO_CATEGORIES = [
  {
    id: 1,
    name: "Lighting",
    slug: "lighting",
    description:
      "Pendant lights, desk lamps, and portable LED lighting with warm ambiancaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaae.",
  },
  {
    id: 2,
    name: "Furniture",
    slug: "furniture",
    description:
      "Modern tables, chairs, and shelving made from quality wood and metal.",
  },
  {
    id: 3,
    name: "Accessories",
    slug: "accessory",
    description:
      "Decorative hooks, trays, and small pieces to enhance your space.",
  },
  {
    id: 4,
    name: "Gifts",
    slug: "gifts",
    description:
      "Pre-packed gift boxes and curated sets for any special occasion.",
  },
];
//map tk product với tk cà té
const DEMO_PRODUCT_CATEGORIES = [
  { productId: 1, categories_id: [1] },
  { productId: 2, categories_id: [1] },
  { productId: 3, categories_id: [2] },
  { productId: 4, categories_id: [3] },
  { productId: 5, categories_id: [4] },
];
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const flattenAllWithSlug = (productsObj) =>
  Object.entries(productsObj).flatMap(([slug, items]) =>
    items.map((p) => ({ ...p, category_slug: slug }))
  );

const Products = () => {
  const { categorySlug } = useParams();

  
  // dùng sờ lúc để map cate
  const products = categorySlug
    ? (DEMO_PRODUCTS[categorySlug] || []).map((p) => ({
        ...p,
        category_slug: categorySlug,
      }))
    : flattenAllWithSlug(DEMO_PRODUCTS);


    
  // lấy dữ liệu cà té để show ra
  const currentCategory = categorySlug
    ? DEMO_CATEGORIES.find((c) => c.slug === categorySlug)
    : null;



  // đặt title trang dựa trên cà té
  const pageTitle = capitalize(categorySlug || "All");

  return (
    <div className="margintop">
      <div className="link_page pad">
        <p className="spacing">
          <Link to="/">Home</Link> / <Link to="/products">Products</Link>
          {categorySlug && <> / {capitalize(categorySlug)}</>}
        </p>
      </div>
      <h1 className="title spacing">{pageTitle}</h1>
      <div className="descriptions spacing">
        {/* dùng toán tử 19 ngôi nếu không có cà té thì hiện thị câu mặc định */}
        <p className="desc_text">
          {currentCategory
            ? currentCategory.description
            : "Explore our full collection of featured products."}
        </p>
      </div>
      
      <hr className="spacing"/>


      <div className="products spacing">
        <div className="product_row row">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categories={DEMO_CATEGORIES}
              productCategories={DEMO_PRODUCT_CATEGORIES}
            />
          ))}
          {products.length === 0 && <p>No Products.</p>}
        </div>
      </div>
    </div>
  );
};

export default Products;
