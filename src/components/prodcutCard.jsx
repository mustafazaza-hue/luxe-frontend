import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faCube, 
  faVrCardboard,
  faHeart as faHeartSolid,
  faStar,
  faStarHalfAlt
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline } from '@fortawesome/free-regular-svg-icons';
import Link from 'next/link';

const ProductCard = ({ product }) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5186';
  const [arLoading, setArLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const getImageUrl = (path) => {
    if (!path) return 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return `$${price.toLocaleString()}`;
  };

  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1">
        {[...Array(4)].map((_, i) => (
          <FontAwesomeIcon 
            key={i} 
            icon={faStar} 
            className="text-[var(--luxury-gold)] text-sm" 
          />
        ))}
        <FontAwesomeIcon 
          icon={faStarHalfAlt} 
          className="text-[var(--luxury-gold)] text-sm" 
        />
      </div>
    );
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleViewInAR = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product.arEnabled && !product.productCount) return;
    
    setArLoading(true);
    setTimeout(() => {
      setArLoading(false);
      alert(`Opening ${product.name} in AR Room...`);
    }, 800);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.productCount) {
      // هذا عبارة عن category وليس product
      window.location.href = `/categories?cat=${encodeURIComponent(product.name.toLowerCase())}`;
    } else {
      alert(`Added ${product.name} to cart!`);
    }
  };

  // إذا كان هذا category وليس product
  if (product.productCount) {
    return (
      <Link 
        href={`/categories?cat=${encodeURIComponent(product.name.toLowerCase())}`}
        className="group bg-[var(--soft-gray)] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow block"
      >
        <div className="relative h-64 overflow-hidden">
          <img
            src={getImageUrl(product.imageUrl || product.img || product.displayImage)}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop";
            }}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
            <p className="text-white/90">
              {product.productCount} Products
            </p>
          </div>
        </div>
      </Link>
    );
  }

  // إذا كان هذا product عادي
  return (
    <Link 
      href={`/product/${product.id}`}
      className="group bg-[var(--soft-gray)] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow block"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={getImageUrl(product.imageUrl || product.img || product.displayImage)}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop";
          }}
        />
        
        {product.arEnabled && (
          <div className="absolute top-4 right-4 bg-[var(--luxury-gold)] text-white px-3 py-1 rounded-full text-sm font-semibold">
            AR Ready
          </div>
        )}
        
        <button
          onClick={handleToggleFavorite}
          className="absolute top-4 left-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all z-10"
        >
          <FontAwesomeIcon
            icon={isFavorite ? faHeartSolid : faHeartOutline}
            className={isFavorite ? "text-red-500" : "text-[var(--charcoal)]"}
          />
        </button>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-[var(--charcoal)] mb-2">
          {product.name}
        </h3>
        
        <p className="text-gray-600 mb-4">
          {product.description || product.desc || product.material || 'Premium furniture piece'}
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-[var(--charcoal)]">
            {formatPrice(product.price)}
          </span>
          
          <div className="flex items-center space-x-1">
            {renderStars()}
          </div>
        </div>

        <div className="flex space-x-2">
          {/* زر Add to Cart */}
          <button
            onClick={handleAddToCart}
            className="flex-1 bg-[var(--luxury-gold)] hover:bg-[var(--warm-copper)] text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <FontAwesomeIcon icon={faShoppingCart} />
            <span>Add to Cart</span>
          </button>

          {/* زر AR إذا كان المدعوم */}
          {product.arEnabled && (
            <button
              onClick={handleViewInAR}
              disabled={arLoading}
              className="px-4 border-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)] hover:bg-[var(--luxury-gold)] hover:text-white rounded-lg transition-all flex items-center justify-center"
            >
              {arLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[var(--luxury-gold)]"></div>
              ) : (
                <FontAwesomeIcon icon={faCube} className="text-lg" />
              )}
            </button>
          )}
        </div>

        {/* زر AR إضافي ممتد */}
        {product.arEnabled && (
          <button
            onClick={handleViewInAR}
            disabled={arLoading}
            className="w-full mt-3 border-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)] py-3 rounded-lg hover:bg-[var(--luxury-gold)] hover:text-white transition-all flex items-center justify-center space-x-2 font-medium"
          >
            {arLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[var(--luxury-gold)] mr-2"></div>
                <span>Loading AR...</span>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faVrCardboard} />
                <span>Experience in Augmented Reality</span>
              </>
            )}
          </button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;