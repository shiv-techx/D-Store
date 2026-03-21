import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { urlFor } from '../sanity/client';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const imageUrl = typeof product.image === 'string' 
    ? product.image 
    : product.image 
      ? urlFor(product.image).width(600).url() 
      : 'https://placehold.co/600x600?text=No+Image';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
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
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-extrabold text-stone-900">${product.price?.toFixed(2)}</span>
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
            onClick={() => alert('Added to cart! (Demo only)')}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            Add to Cart
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
