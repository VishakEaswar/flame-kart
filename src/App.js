import { Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import WishlistPage from './pages/WishlistPage';
import CartPage from './pages/CartPage';
import ProductView from './pages/ProductView';
import Footer from './pages/Footer';
import './App.css';
// import About from './pages/About';

function App() {
  return (
    <>
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/product" element={<ProductPage />} />
       <Route path="/wishlist" element={<WishlistPage />} />
       <Route path='/cartpage' element={<CartPage/>}/>
       <Route path="/productview" element={<ProductView />} />

    </Routes>
     <Footer />
  </>
    
  );
}

export default App;
