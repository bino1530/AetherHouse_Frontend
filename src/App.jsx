import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MainLayout from "./Layouts/MainLayout.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";

import Home from "./pages/Home/Home.jsx";
import Store from "./pages/Store/Store.jsx";
import Products from "./pages/Products/Products.jsx";
import ProductDetails from "./pages/ProductDetail/ProductDetail.jsx";
import Explore from "./pages/Explore/Explore.jsx";
import Login from "./pages/Login/Login.jsx";
import Admin from "./pages/Admin/Admin.jsx";
import Sign from "./pages/Sign/Sign.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/:rootSlug" element={<Products />} />
          <Route path="/:rootSlug/:slug" element={<Products />} />

          <Route
            path="/:rootSlug/:slug/:productSlug"
            element={<ProductDetails />}
          />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/store" element={<Store />} />
          <Route path="/explore" element={<Explore />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign" element={<Sign />} />
        </Route>
      </Routes>
    </Router>
  );
}
export default App;
