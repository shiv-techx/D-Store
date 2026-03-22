/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Category from './pages/Category';
import ProductDetail from './pages/ProductDetail';
import Admin from './pages/Admin';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import CartDrawer from './components/CartDrawer';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <CurrencyProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Admin Route - Full Screen */}
              <Route path="/admin/*" element={<Admin />} />
              
              {/* Public Routes - With Layout */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans">
                    <Navbar />
                    <CartDrawer />
                    <main className="flex-grow">
                      <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/category/:categoryName" element={<Category />} />
                        <Route path="/product/:id" element={<ProductDetail />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                }
              />
            </Routes>
          </Router>
        </CartProvider>
      </CurrencyProvider>
    </ErrorBoundary>
  );
}
