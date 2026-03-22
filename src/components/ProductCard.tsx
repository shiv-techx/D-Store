import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Check, Share2 } from 'lucide-react';
import { Product } from '../types';
import { urlFor } from '../sanity/client';
import { useCart } from '../context/CartContext';
import { useCurrency } from '../context/CurrencyContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, setIsCartOpen } = useCart();
  const { formatPrice } = useCurrency();
  const [addedToCart, setAddedToCart] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!product) return null;

  const imageUrl = typeof product.image === 'string' 
    ? product.image 
    : product.image 
      ? urlFor(product.image).width(600).url() 
      : 'https://placehold.co/600x600?text=No+Image';

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/product/${product.slug?.current || product._id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full relative">
      <Link to={`/product/${product.slug?.current || product._id}`} className="block relative aspect-square overflow-hidden bg-stone-100">
        <img
          src={imageUrl}
          alt={product.name}
          className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-stone-800 shadow-sm uppercase tracking-wider">
          {product.category}
        </div>
        {product.discount > 0 && (
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider bg-red-500 text-white">
            -{product.discount}% OFF
          </div>
        )}
      </Link>
      
      {/* Share Button */}
      <div className="absolute top-3 right-3 z-10">
        {product.discount > 0 ? (
          <button
            onClick={handleCopyLink}
            className="mt-8 p-2 bg-white/90 backdrop-blur-sm hover:bg-white text-stone-700 hover:text-indigo-600 rounded-full shadow-sm transition-colors flex items-center justify-center"
            title="Share product"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        ) : (
          <button
            onClick={handleCopyLink}
            className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white text-stone-700 hover:text-indigo-600 rounded-full shadow-sm transition-colors flex items-center justify-center"
            title="Share product"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          </button>
        )}
        {copied && (
          <div className="absolute top-full right-0 mt-2 bg-stone-900 text-white text-[10px] font-bold py-1 px-2 rounded whitespace-nowrap shadow-lg">
            Link copied!
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-extrabold text-stone-900">{formatPrice(product.price || 0)}</span>
          <div className="flex items-center bg-stone-50 px-2 py-1 rounded-md border border-stone-100">
            <Star className="w-4 h-4 text-amber-500 fill-current" />
            <span className="ml-1 text-sm font-bold text-stone-700">{product.rating ? product.rating.toFixed(1) : 'New'}</span>
          </div>
        </div>
        <Link to={`/product/${product.slug?.current || product._id}`} className="block mb-2">
          <h3 className="text-lg font-bold text-stone-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-stone-500 text-sm line-clamp-2 mb-6 flex-grow leading-relaxed">
          {product.description}
        </p>
        <div className="mt-auto flex flex-col gap-2">
          <button
            onClick={() => {
              addToCart({
                id: product._id,
                name: product.name,
                price: product.price,
                image: imageUrl,
                affiliateLink: product.affiliateLink,
                category: product.category,
                description: product.description,
              });
              setAddedToCart(true);
              setIsCartOpen(true);
              setTimeout(() => setAddedToCart(false), 2000);
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            {addedToCart ? (
              <>
                <Check className="w-4 h-4" />
                Added
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
          <a
            href={product.affiliateLink || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center py-2.5 px-4 rounded-xl font-semibold text-white bg-stone-900 hover:bg-stone-800 shadow-md hover:shadow-lg transition-all"
          >
            Buy Now
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
