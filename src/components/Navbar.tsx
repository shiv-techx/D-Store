import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { cartItems, setIsCartOpen } = useCart();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Kids', path: '/category/Kids' },
    { name: 'Beauty', path: '/category/Beauty' },
    { name: 'Fashion', path: '/category/Fashion' },
    { name: 'Design', path: '/category/Design' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white border-b border-stone-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 group cursor-pointer">
              <img 
                src="/logo.png" 
                alt="Dstore Logo" 
                className="h-10 md:h-11 w-auto object-contain transition-transform duration-300 group-hover:scale-105 group-hover:opacity-90" 
              />
              <span className="text-2xl font-bold text-stone-900 tracking-tight transition-colors group-hover:text-indigo-600">Store</span>
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-indigo-600'
                      : 'text-stone-600 hover:text-indigo-600'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-indigo-600 rounded-full" />
                  )}
                </Link>
              );
            })}
            <Link to="/contact" className="text-stone-600 hover:text-indigo-600 font-medium transition-colors">
              Contact
            </Link>

            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-600 hover:text-indigo-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-stone-600 hover:text-indigo-600 transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-600 hover:text-stone-900 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 shadow-lg absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-indigo-600 bg-indigo-50'
                      : 'text-stone-700 hover:text-indigo-600 hover:bg-stone-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link
              to="/contact"
              onClick={() => setIsOpen(false)}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-stone-700 hover:text-indigo-600 hover:bg-stone-50 transition-colors duration-300"
            >
              Contact
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
