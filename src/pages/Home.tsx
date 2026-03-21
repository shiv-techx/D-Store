import { useState, useEffect } from 'react';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Zap, ShieldCheck, Sparkles, Navigation, Star } from 'lucide-react';
import { sanityClient } from '../sanity/client';
import { dummyProducts } from '../data/dummyProducts';

const services = [
  {
    icon: <Zap className="w-8 h-8 text-indigo-600" />,
    title: 'Fast & Reliable Recommendations',
    description: 'Discover the best products quickly with our curated lists.'
  },
  {
    icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
    title: 'Trusted Affiliate Products',
    description: 'We only recommend high-quality, verified products.'
  },
  {
    icon: <Sparkles className="w-8 h-8 text-indigo-600" />,
    title: 'Curated Best Deals',
    description: 'Save money with our handpicked discounts and offers.'
  },
  {
    icon: <Navigation className="w-8 h-8 text-indigo-600" />,
    title: 'Easy Navigation',
    description: 'Find exactly what you are looking for effortlessly.'
  }
];

const reviews = [
  {
    id: 1,
    name: 'Sarah Jenkins',
    rating: 5,
    text: 'Absolutely love the curated selections! Found the perfect dress for my vacation at a great discount.'
  },
  {
    id: 2,
    name: 'Michael Chen',
    rating: 5,
    text: 'The home design recommendations are top-notch. Transformed my living room with their picks.'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    rating: 4,
    text: 'Great deals on kids clothing. The site is super easy to navigate and find exactly what I need.'
  }
];

export default function Home() {
  const [todaysDeals, setTodaysDeals] = useState<Product[]>([]);
  const [discountProducts, setDiscountProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [deals, discounts] = await Promise.all([
          sanityClient.fetch(`*[_type == "product" && status == "Active" && isFeatured == true] | order(createdAt desc)[0...4]`),
          sanityClient.fetch(`*[_type == "product" && status == "Active" && discount > 0] | order(createdAt desc)[0...4]`)
        ]);
        setTodaysDeals(deals);
        setDiscountProducts(discounts);
      } catch (error) {
        console.error("Error fetching products from Sanity:", error);
        // Fallback to dummy data if Sanity is not configured
        setTodaysDeals(dummyProducts.filter(p => p.isFeatured).slice(0, 4));
        setDiscountProducts(dummyProducts.filter(p => p.discount > 0).slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Full-Screen Hero Section */}
      <section id="home" className="relative h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
        {/* Background Image with slow zoom */}
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1920&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        {/* Dark Overlay for readability */}
        <div className="absolute inset-0 bg-stone-900/60" />

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight mb-6 drop-shadow-lg"
          >
            Up to <span className="text-indigo-400">40% Discount</span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-stone-200 max-w-3xl mx-auto mb-10 drop-shadow-md font-medium"
          >
            Grab the best deals on trending products across all categories
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto"
          >
            <button
              onClick={() => scrollToSection('discount-products')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 text-white font-bold text-lg hover:bg-white/20 backdrop-blur-md border border-white/20 transition-all"
            >
              Explore
            </button>
            <button
              onClick={() => scrollToSection('todays-deals')}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 hover:scale-105 transition-all shadow-lg shadow-indigo-500/30"
            >
              Start Shopping
            </button>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center text-white/70 cursor-pointer hover:text-white transition-colors"
          onClick={() => scrollToSection('todays-deals')}
        >
          <span className="text-sm font-medium tracking-widest uppercase mb-2">Scroll</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1"
          >
            <div className="w-1.5 h-3 bg-current rounded-full" />
          </motion.div>
        </motion.div>
      </section>

      {/* Today's Deals */}
      <section id="todays-deals" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-stone-900 tracking-tight">Today's Deals</h2>
            <p className="text-stone-500 mt-3 text-lg">Don't miss out on these limited time offers.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {todaysDeals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Discount Products */}
      <section id="discount-products" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-indigo-50/50 rounded-3xl my-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-extrabold text-stone-900 tracking-tight">Discount Products</h2>
            <p className="text-stone-500 mt-3 text-lg">Massive savings on top-rated items.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {discountProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Our Services */}
      <section className="py-24 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold tracking-tight mb-4">Our Services</h2>
            <p className="text-stone-400 text-lg max-w-2xl mx-auto">Why choose us for your shopping needs?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-stone-800 p-8 rounded-2xl border border-stone-700 hover:border-indigo-500 transition-colors">
                <div className="bg-stone-900 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-stone-400 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ratings & Feedback */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-stone-900 tracking-tight mb-4">Customer Feedback</h2>
          <p className="text-stone-500 text-lg max-w-2xl mx-auto">See what our shoppers have to say.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white p-8 rounded-3xl shadow-sm border border-stone-100 flex flex-col h-full">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} />
                ))}
              </div>
              <p className="text-stone-600 text-lg leading-relaxed mb-6 flex-grow italic">"{review.text}"</p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                  {review.name.charAt(0)}
                </div>
                <span className="font-bold text-stone-900">{review.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center">
        <h2 className="text-4xl font-extrabold text-stone-900 tracking-tight mb-4">Get in Touch</h2>
        <p className="text-stone-500 text-lg max-w-2xl mx-auto mb-8">Have questions? We'd love to hear from you.</p>
        <a href="mailto:support@dstore.com" className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30">
          Contact Support
        </a>
      </section>
    </div>
  );
}
