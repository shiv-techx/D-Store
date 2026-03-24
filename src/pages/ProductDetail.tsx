import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import { Star, ArrowLeft, Share2, Check, ShoppingCart, PlayCircle } from 'lucide-react';
import { sanityClient, urlFor } from '../sanity/client';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const { addToCart, setIsCartOpen } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const fetchedProduct = await sanityClient.fetch(
          `*[_type == "product" && status == "Active" && (slug.current == $id || _id == $id)][0]`,
          { id }
        );
        console.log("Fetched product:", fetchedProduct);
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product from Sanity:", error);
        setProduct(null);
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

  const safeImages = Array.isArray(product.images) ? product.images : [];
  const allImages = [product.image, ...safeImages].filter(Boolean);
  
  const getImageUrl = (img: any, width: number = 1200) => {
    return typeof img === 'string'
      ? img
      : img 
        ? urlFor(img).width(width).url() 
        : `https://placehold.co/${width}x${width}?text=No+Image`;
  };

  const mainImageUrl = getImageUrl(allImages[mainImageIndex]);

  // Helper to get embed URL for YouTube/Vimeo
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('youtube.com/watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'youtube.com/embed/');
    }
    if (url.includes('vimeo.com/')) {
      return url.replace('vimeo.com/', 'player.vimeo.com/video/');
    }
    return url;
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      <Link to="/" className="inline-flex items-center text-stone-500 hover:text-stone-900 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Store
      </Link>

      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 overflow-hidden mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
          {/* Product Media Gallery */}
          <div className="flex flex-col p-6 md:p-8 bg-stone-50">
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white border border-stone-100 mb-4 shadow-sm">
              {showVideo && product.videoUrl ? (
                <iframe
                  src={getEmbedUrl(product.videoUrl)}
                  className="absolute inset-0 w-full h-full"
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              ) : (
                <img
                  src={mainImageUrl}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  referrerPolicy="no-referrer"
                />
              )}
              
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-semibold text-stone-800 shadow-sm uppercase tracking-wider z-10">
                {product.category}
              </div>
              {product.discount > 0 && (
                <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm uppercase tracking-wider bg-red-500 text-white z-10">
                  -{product.discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setMainImageIndex(idx);
                    setShowVideo(false);
                  }}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all snap-start ${
                    mainImageIndex === idx && !showVideo ? 'border-indigo-600 shadow-md' : 'border-transparent hover:border-indigo-300'
                  }`}
                >
                  <img
                    src={getImageUrl(img, 200)}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
              
              {product.videoUrl && (
                <button
                  onClick={() => setShowVideo(true)}
                  className={`relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 flex items-center justify-center bg-stone-900 transition-all snap-start ${
                    showVideo ? 'border-indigo-600 shadow-md' : 'border-transparent hover:border-indigo-300'
                  }`}
                >
                  <PlayCircle className="w-8 h-8 text-white" />
                  <span className="absolute bottom-1 text-[10px] font-bold text-white uppercase tracking-wider">Video</span>
                </button>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="p-8 md:p-12 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h1 className="text-3xl md:text-4xl font-bold text-stone-900 leading-tight">
                {product.name}
              </h1>
              <div className="relative ml-4 flex-shrink-0">
                <button
                  onClick={handleCopyLink}
                  className="p-3 text-stone-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors flex items-center justify-center bg-stone-50 border border-stone-200"
                  title="Copy link to share"
                >
                  {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Share2 className="w-5 h-5" />}
                </button>
                {copied && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs font-bold py-1.5 px-3 rounded-lg whitespace-nowrap shadow-lg">
                    Link copied!
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-stone-900 rotate-45"></div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold text-indigo-600">
                ${product.price || 0}
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
                onClick={() => {
                  addToCart({
                    id: product._id,
                    name: product.name,
                    price: product.price,
                    image: getImageUrl(product.image),
                    affiliateLink: product.affiliateLink,
                    category: product.category,
                    description: product.description,
                  });
                  setAddedToCart(true);
                  setIsCartOpen(true);
                  setTimeout(() => setAddedToCart(false), 2000);
                }}
                className="w-full flex items-center justify-center gap-2 py-4 px-8 rounded-2xl font-bold text-lg text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                {addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
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

      {/* Reviews Section */}
      <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8 md:p-12">
        <h2 className="text-2xl font-bold text-stone-900 mb-8">Customer Reviews</h2>
        {Array.isArray(product.reviews) && product.reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product.reviews.map((review, idx) => (
              <div key={review._key || idx} className="bg-stone-50 p-6 rounded-2xl border border-stone-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      {review.name?.charAt(0) || 'U'}
                    </div>
                    <span className="font-bold text-stone-900">{review.name || 'Anonymous'}</span>
                  </div>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < (review.rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`} 
                      />
                    ))}
                  </div>
                </div>
                <p className="text-stone-600 leading-relaxed italic">"{review.comment || ''}"</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-stone-500 italic text-lg">No reviews yet.</p>
        )}
      </div>
    </div>
  );
}
