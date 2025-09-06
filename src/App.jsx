import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'
import Home from './pages/Home/Home.jsx'
import Store from './pages/Store/Store.jsx'
import Products from './pages/Products/Products.jsx'
function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/store" element={<Store />} />
        <Route path="/products/:categorySlug?" element={<Products />} />
        {/* push ne uyen */}
      </Routes>
      <Footer />
    </Router>
  )
}
export default App
