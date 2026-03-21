import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { Star, ArrowLeft, Share2, Check, ShoppingCart } from 'lucide-react';
import { sanityClient, urlFor } from '../sanity/client';
import { dummyProducts } from '../data/dummyProducts';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const fetchedProduct = await sanityClient.fetch(
          `*[_type == "product" && (slug.current == $id || _id == $id)][0]`,
          { id }
        );
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          // Fallback to dummy data if not found in Sanity
          const dummyProduct = dummyProducts.find(p => p._id === id || p.slug?.current === id);
          setProduct(dummyProduct || null);
        }
      } catch (error) {
        console.error("Error fetching product from Sanity:", error);
        // Fallback to dummy data on error
        const dummyProduct = dummyProducts.find(p => p._id === id || p.slug?.current === id);
        setProduct(dummyProduct || null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-32">
        <h2 className="text-2xl font-bold text-stone-900 mb-4">Product Not Found</h2>
        <Link to="/" className="text-indigo-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  const imageUrl = typeof product.image === 'string'
    ? product.image
    : product.image 
      ? urlFor(product.image).width(1200).url() 
      : 'https://placehold.co/1200x1200?text=No+Image';

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <Link to="/" className="inline-flex items-center text-stone-500 hover:text-stone-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Store
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Image */}
          <div className="bg-stone-50 relative aspect-square md:aspect-auto md:h-full">
            <img
              src={imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold text-stone-800 shadow-sm uppercase tracking-wider">
              {product.category}
            </div>
            {product.discount > 0 && (
              <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm uppercase tracking-wider bg-red-500 text-white">
                -{product.discount}% OFF
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
                {product.name}
              </h1>
              <button
                onClick={handleCopyLink}
                className="p-2 text-stone-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex-shrink-0 ml-4"
                title="Copy link to share"
              >
                {copied ? <Check className="w-6 h-6 text-emerald-500" /> : <Share2 className="w-6 h-6" />}
              </button>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-indigo-600">
                ${product.price?.toFixed(2)}
              </span>
              <div className="flex items-center bg-amber-50 px-3 py-1 rounded-full text-amber-600">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1.5 font-bold">{product.rating ? product.rating.toFixed(1) : 'New'}</span>
              </div>
            </div>

            <div className="prose prose-stone max-w-none mb-10 flex-grow">
              <p className="text-stone-600 text-lg leading-relaxed whitespace-pre-wrap">
                {product.description}
              </p>
            </div>

            <div className="mt-auto pt-8 border-t border-stone-100 flex flex-col gap-4">
              <button
                onClick={() => alert('Added to cart! (Demo only)')}
                className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-bold text-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </button>
              <a
                href={product.affiliateLink || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-4 px-8 rounded-2xl font-bold text-lg text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5"
              >
                Buy Now
              </a>
              <p className="text-center text-xs text-stone-400 mt-2">
                You will be redirected to our trusted partner to complete your purchase.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
