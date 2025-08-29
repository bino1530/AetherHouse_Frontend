import './App.css'
import Header from './components/Header/Header.jsx'
import Home from './pages/Home/Home.jsx'
import Footer from './components/Footer/Footer.jsx'
function App() {

    return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/whatsnew" element={<WhatsNew />} />
        <Route path="/lighting" element={<Lighting />} />
        <Route path="/furniture" element={<Furniture />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/gifts" element={<Gifts />} />
        <Route path="/explore" element={<Explore />} />
      </Routes>
      {/* <Footer /> */}
    </BrowserRouter>
  )
}

export default App
