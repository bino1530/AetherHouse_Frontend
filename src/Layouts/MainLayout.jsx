// layouts/MainLayout.jsx
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Header />
        <Outlet />
      <Footer />
    </>
  );
}

export default MainLayout;
