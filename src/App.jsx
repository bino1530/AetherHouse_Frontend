import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Store from './pages/Store/Store.jsx'
import Products from './pages/Products/Products.jsx'
import Explore from './pages/Explore/Explore.jsx';
import Login from './pages/Login/Login.jsx';
import Admin from './pages/Admin/Admin.jsx';
function App() {
  return (
    <Router>
      <Routes>
         <Route path="/admin" element={<Admin />} />
      </Routes>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
       
        <Route path="/store" element={<Store />} />
        <Route path="/products/:categorySlug?" element={<Products />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/login" element={<Login />} />

        {/* uyen nè */}
      </Routes>
      <Footer />
       <Routes>
         <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  )
}
export default App
