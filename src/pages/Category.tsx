import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import { motion } from 'motion/react';
import { sanityClient } from '../sanity/client';

const categoryData = {
  'Kids': {
    image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1920&q=80',
    tagline: 'Fun and essentials for kids'
  },
  'Beauty': {
    image: 'https://images.unsplash.com/photo-1596462502278-27bf85033e5a?w=1920&q=80',
    tagline: 'Glow with our premium beauty picks'
  },
  'Fashion': {
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=1920&q=80',
    tagline: 'Elevate your everyday style'
  },
  'Design': {
    image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80',
    tagline: 'Transform your living space'
  }
};

export default function Category() {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryName) return;
      setLoading(true);
      const sanityCategoryName = categoryName === 'Design' ? 'Home & Design' : categoryName;
      try {
        const fetchedProducts = await sanityClient.fetch(
          `*[_type == "product" && status == "Active" && category == $category] | order(createdAt desc)`,
          { category: sanityCategoryName }
        );
        console.log("Fetched category products:", fetchedProducts);
        setProducts(fetchedProducts || []);
      } catch (error) {
        console.error("Error fetching category products from Sanity:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName]);

  const currentCategoryData = categoryName && categoryData[categoryName as keyof typeof categoryData]
    ? categoryData[categoryName as keyof typeof categoryData]
    : { image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920&q=80', tagline: 'Discover amazing products' };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Mini Hero Banner */}
      <section className="relative h-[40vh] min-h-[300px] flex items-center justify-center overflow-hidden">
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: 1.05 }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
          className="absolute inset-0"
        >
          <img
            src={currentCategoryData.image}
            alt={`${categoryName} Category`}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </motion.div>
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-stone-900/50" />

        {/* Banner Content */}
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-extrabold text-white capitalize mb-4 drop-shadow-lg"
          >
            {categoryName} Collection
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-stone-200 drop-shadow-md font-medium"
          >
            {currentCategoryData.tagline}
          </motion.p>
        </div>
      </section>

      {/* Product Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {(products || []).map((product) => (
              <ProductCard key={product?._id || Math.random()} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-100">
            <h3 className="text-xl font-medium text-stone-900 mb-2">No products found</h3>
            <p className="text-stone-500">There are currently no products in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
}
