'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faCube } from '@fortawesome/free-solid-svg-icons';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5186';

// روابط صور بديلة من Unsplash
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
  'https://images.unsplash.com/photo-1517705008128-361805f42e86?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80',
  'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80'
];

const RecommendedProducts = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // دالة للحصول على رابط صورة بديل
  const getFallbackImage = (index) => {
    return FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  };

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        // جلب المنتجات الجديدة (كمنتجات موصى بها)
        const response = await fetch(`${API_BASE_URL}/api/Products/new-arrivals`);
        
        if (response.ok) {
          const data = await response.json();
          // أخذ أول 4 منتجات فقط
          const products = data.slice(0, 4).map((product, index) => ({
            ...product,
            // إضافة رابط صورة افتراضي لكل منتج
            fallbackImage: getFallbackImage(index)
          }));
          setRecommendedProducts(products);
        } else {
          // Fallback data
          setRecommendedProducts([
            {
              id: 101,
              name: 'Modern Coffee Table',
              price: 599,
              category: 'Living Room',
              imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/edfa987077-fa6718b21ab10a9ebbf8.png',
              arEnabled: true,
              fallbackImage: getFallbackImage(0)
            },
            {
              id: 102,
              name: 'Velvet Accent Chair',
              price: 749,
              category: 'Living Room',
              imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/35c4756062-06e8afe44947176f8e54.png',
              arEnabled: true,
              fallbackImage: getFallbackImage(1)
            },
            {
              id: 103,
              name: 'Oak Nightstand',
              price: 399,
              category: 'Bedroom',
              imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/0f5e2e93d2-d71955203a32352d63b2.png',
              arEnabled: true,
              fallbackImage: getFallbackImage(2)
            },
            {
              id: 104,
              name: 'Modern Bookshelf',
              price: 899,
              category: 'Office',
              imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2d125078ec-da1c16d4acf53b196181.png',
              arEnabled: true,
              fallbackImage: getFallbackImage(3)
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching recommended products:', error);
        // استخدام البيانات الافتراضية
        setRecommendedProducts([...Array(4)].map((_, i) => ({
          id: i + 1,
          name: `Premium Product ${i + 1}`,
          price: 299 + (i * 200),
          category: ['Living Room', 'Bedroom', 'Office', 'Dining'][i],
          imageUrl: getFallbackImage(i),
          arEnabled: true,
          fallbackImage: getFallbackImage(i)
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, []);

  // دالة لمعالجة أخطاء الصور
  const handleImageError = (e, productId, fallbackImage) => {
    console.warn(`Failed to load image for product ${productId}`);
    e.target.onerror = null; // منع loop لا نهائي
    e.target.src = fallbackImage;
  };

  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-[var(--charcoal)] mb-8">You May Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 animate-pulse rounded-xl h-64"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="recommended-products" className="mt-16">
      <h2 className="text-3xl font-bold text-[var(--charcoal)] mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product, index) => {
          // تحديد رابط الصورة
          const imageSrc = product.imageUrl?.startsWith('http') 
            ? product.imageUrl 
            : product.imageUrl 
              ? `${API_BASE_URL}${product.imageUrl}`
              : product.fallbackImage || getFallbackImage(index);

          return (
            <div 
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden bg-[var(--soft-gray)]">
                <img 
                  src={imageSrc}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => handleImageError(e, product.id, product.fallbackImage || getFallbackImage(index))}
                />
                {product.arEnabled && (
                  <span className="absolute top-3 right-3 bg-[var(--luxury-gold)] text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                    <FontAwesomeIcon icon={faCube} className="mr-1 text-xs" />
                    AR Ready
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-[var(--charcoal)] mb-2 truncate">{product.name}</h3>
                {product.category && (
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-[var(--charcoal)]">
                    ${product.price.toLocaleString()}
                  </span>
                  <button 
                    onClick={() => alert(`Added ${product.name} to cart`)}
                    className="text-[var(--luxury-gold)] hover:text-[var(--luxury-copper)] transition-colors hover:scale-110"
                    aria-label="Add to cart"
                  >
                    <FontAwesomeIcon icon={faPlusCircle} className="text-2xl" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecommendedProducts;