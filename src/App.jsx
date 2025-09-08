import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MainLayout from "./Layouts/MainLayout.jsx";
import AdminLayout from "./Layouts/AdminLayout.jsx";

import Home from "./pages/Home/Home.jsx";
import Store from "./pages/Store/Store.jsx";
import Products from "./pages/Products/Products.jsx";
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

          <Route path="/store" element={<Store />} />
          {/* View all theo root, ví dụ /lighting */}
          <Route path="/:rootSlug" element={<Products />} />

          {/* Room hoặc Category: /:rootSlug/:slug (bedroom hoặc pendant-lights) */}
          <Route path="/:rootSlug/:slug" element={<Products />} />
          <Route path="/explore" element={<Explore />} />
        </Route>

        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign" element={<Sign />} />
        </Route>
      </Routes>
    </Router>
<<<<<<< Updated upstream
  );
=======
  )
>>>>>>> Stashed changes
}
export default App;
