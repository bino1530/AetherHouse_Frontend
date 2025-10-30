import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import MainLayout from "./Layouts/MainLayout.jsx";
import Auth from "./Layouts/Auth.jsx";
import Home from "./pages/Home/Home.jsx";
import Store from "./pages/Store/Store.jsx";
import StoreDetail from "./pages/StoreDetail/StoreDetail.jsx";
import Products from "./pages/Products/Products.jsx";
import ProductDetails from "./pages/ProductDetail/ProductDetail.jsx";
import Explore from "./pages/Explore/Explore.jsx";
import Login from "./pages/Login/Login.jsx";
import UserProfile from "./pages/UserProfile/UserProfile.jsx";
import CheckoutPage from "./pages/checkout/Checkout.jsx";
import Verify from "./pages/Login/Verify.jsx";
import OrderSuccess from "./pages/Order/Order";
import SearchResults from "./pages/search/SearchResults.jsx";
import Signup from "./pages/Login/Signup.jsx"
function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/:rootSlug" element={<Products />} />
          <Route path="/:rootSlug/:slug" element={<Products />} />
          <Route path="/search" element={<SearchResults />} />
          <Route
            path="/:rootSlug/:slug/:productSlug"
            element={<ProductDetails />}
          />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/store" element={<Store />} />
          
          <Route path="/store/:slug" element={<StoreDetail />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/userprofile" element={<UserProfile />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/ordersuccess/:id" element={<OrderSuccess />} />


        </Route>
        <Route element={<Auth />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verify" element={<Verify />} />


        </Route>
      </Routes>
    </Router>
  );
}
export default App;
