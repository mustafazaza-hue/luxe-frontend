'use client';

import { useState, useEffect } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5186';

const RecommendedProducts = () => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      try {
        // جلب المنتجات الجديدة (كمنتجات موصى بها)
        const response = await fetch(`${API_BASE_URL}/api/Products/new-arrivals`);
        
        if (response.ok) {
          const data = await response.json();
          // أخذ أول 4 منتجات فقط
          setRecommendedProducts(data.slice(0, 4));
        } else {
          // Fallback data
          setRecommendedProducts([
            {
              id: 101,
              name: 'Modern Coffee Table',
              price: 599,
              category: 'Living Room',
              imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/edfa987077-fa6718b21ab10a9ebbf8.png',
              arEnabled: true
            },
            {
              id: 102,
              name: 'Velvet Accent Chair',
              price: 749,
              category: 'Living Room',
              imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/35c4756062-06e8afe44947176f8e54.png',
              arEnabled: true
            },
            {
              id: 103,
              name: 'Oak Nightstand',
              price: 399,
              category: 'Bedroom',
              imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/0f5e2e93d2-d71955203a32352d63b2.png',
              arEnabled: true
            },
            {
              id: 104,
              name: 'Modern Bookshelf',
              price: 899,
              category: 'Office',
              imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/2d125078ec-da1c16d4acf53b196181.png',
              arEnabled: true
            }
          ]);
        }
      } catch (error) {
        console.error('Error fetching recommended products:', error);
        // استخدام البيانات الافتراضية
        setRecommendedProducts([...Array(4)].map((_, i) => ({
          id: i + 1,
          name: `Product ${i + 1}`,
          price: 299 + (i * 200),
          imageUrl: `https://via.placeholder.com/300x300?text=Product+${i + 1}`
        })));
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedProducts();
  }, []);

  if (loading) {
    return (
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-charcoal mb-8">You May Also Like</h2>
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
      <h2 className="text-3xl font-bold text-charcoal mb-8">You May Also Like</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommendedProducts.map((product) => (
          <div 
            key={product.id}
            className="group bg-white rounded-xl overflow-hidden hover:shadow-xl transition-shadow border border-gray-100"
          >
            <div className="relative h-48 overflow-hidden bg-soft-gray">
              <img 
                src={product.imageUrl?.startsWith('http') 
                  ? product.imageUrl 
                  : `${API_BASE_URL}${product.imageUrl}`}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=Product+Image';
                }}
              />
              {product.arEnabled && (
                <span className="absolute top-3 right-3 bg-gold-accent text-white px-2 py-1 rounded text-xs font-semibold">
                  AR Ready
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-charcoal mb-2 truncate">{product.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-charcoal">
                  ${product.price.toLocaleString()}
                </span>
                <button 
                  onClick={() => alert(`Added ${product.name} to cart`)}
                  className="text-gold-accent hover:text-copper transition-colors hover:scale-110"
                  aria-label="Add to cart"
                >
                  <i className="fa-solid fa-plus-circle text-2xl"></i>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;