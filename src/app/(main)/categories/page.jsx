"use client";
import React, { useState, useEffect } from 'react';
import apiClient from '@/api/apiClient';
import ProductCard from '@/components/prodcutCard';
import Link from 'next/link';


const CategoriesPage = () => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // جلب جميع المنتجات من الـ API
        const data = await apiClient.get('/Products/ar-enabled');
        
        // تصنيف المنتجات برمجياً بناءً على حقل الـ category
        const grouped = data.reduce((acc, product) => {
          const cat = product.category || 'Other';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(product);
          return acc;
        }, {});
        
        setGroupedProducts(grouped);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      
      <main id="main-content" className="flex-grow bg-[var(--soft-gray)] font-['Inter',_sans-serif]">
        {/* Page Header */}
        <section id="page-header" className="bg-gradient-to-r from-[var(--warm-beige)] to-[var(--soft-gray)] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-5xl font-black text-[var(--charcoal)] mb-6">Furniture Collections</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore our premium AR-enabled furniture, organized by room for your convenience.
              </p>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section id="filters-section" className="bg-white py-6 sticky top-20 z-40 border-b shadow-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center space-x-8">
                {['Material', 'Color', 'Price Range'].map((filter) => (
                  <div key={filter} className="flex items-center space-x-3">
                    <label className="text-sm font-bold text-[var(--charcoal)] uppercase tracking-wider">{filter}:</label>
                    <select className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] bg-gray-50/50 text-sm font-medium">
                      <option>All {filter}s</option>
                    </select>
                  </div>
                ))}
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-bold text-[var(--charcoal)] uppercase tracking-wider">Sort by:</label>
                  <select className="border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] bg-gray-50/50 text-sm font-medium">
                    <option>Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Categories Sections */}
        {loading ? (
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 animate-pulse h-96 rounded-2xl"></div>
              ))}
            </div>
          </div>
        ) : (
          Object.keys(groupedProducts).map((categoryName) => (
            <section key={categoryName} className="py-16 border-b border-gray-100 last:border-0">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-black text-[var(--charcoal)] mb-2">{categoryName}</h2>
                    <p className="text-gray-500 font-medium">
                      {groupedProducts[categoryName].length} products available in this collection
                    </p>
                  </div>
                  <Link 
                    href={`/categories?cat=${encodeURIComponent(categoryName.toLowerCase())}`}
                    className="text-[var(--luxury-gold)] font-bold flex items-center space-x-2 hover:underline group"
                  >
                    <span>View All {categoryName}</span>
                    <i className="fa-solid fa-arrow-right-long group-hover:translate-x-2 transition-transform"></i>
                  </Link>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {groupedProducts[categoryName].map((product) => (
                    <Link 
                      key={product.id} 
                      href={`/product/${product.id}`}
                      className="block"
                    >
                      <ProductCard product={product} />
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))
        )}
      </main>
      
    </div>
  );
};

export default CategoriesPage;