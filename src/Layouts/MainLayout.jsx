// layouts/MainLayout.jsx
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
function MainLayout() {
  return (
    <>
      <Header />
         <ScrollToTop />
        <Outlet />
      <Footer />
    </>
  );
}

export default MainLayout;
