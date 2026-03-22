import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingCart, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const location = useLocation();
  const { cartItems, setIsCartOpen } = useCart();
  const { currency, setCurrency } = useCurrency();
  const currencyRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Kids', path: '/category/Kids' },
    { name: 'Beauty', path: '/category/Beauty' },
    { name: 'Fashion', path: '/category/Fashion' },
    { name: 'Design', path: '/category/Design' },
  ];

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setIsCurrencyOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-md' : 'bg-white border-b border-stone-200'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 md:h-24">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group cursor-pointer">
              <img 
                src="/logo.png" 
                alt="Dstore Logo" 
                className="h-14 md:h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105 group-hover:opacity-90" 
              />
              <span className="text-2xl md:text-3xl font-bold text-stone-900 tracking-tight transition-colors group-hover:text-indigo-600">Store</span>
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
            
            {/* Currency Switcher */}
            <div className="relative" ref={currencyRef}>
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center gap-1 text-stone-600 hover:text-indigo-600 font-medium transition-colors"
              >
                <span>{currency}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isCurrencyOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCurrencyOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-stone-100 py-2 z-50">
                  {currencies.map((c) => (
                    <button
                      key={c.code}
                      onClick={() => {
                        setCurrency(c.code as any);
                        setIsCurrencyOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                        currency === c.code 
                          ? 'bg-indigo-50 text-indigo-600 font-bold' 
                          : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
                      }`}
                    >
                      <span className="inline-block w-6 text-center font-bold">{c.symbol}</span>
                      {c.code}
                    </button>
                  ))}
                </div>
              )}
            </div>

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
            
            {/* Mobile Currency Switcher */}
            <div className="pt-4 pb-2 border-t border-stone-200 mt-4">
              <p className="px-3 text-sm font-bold text-stone-500 uppercase tracking-wider mb-2">Currency</p>
              <div className="grid grid-cols-2 gap-2 px-3">
                {currencies.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => {
                      setCurrency(c.code as any);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currency === c.code 
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                        : 'bg-stone-50 text-stone-700 border border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <span className="font-bold">{c.symbol}</span>
                    {c.code}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
