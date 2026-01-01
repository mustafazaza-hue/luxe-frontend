'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faCamera, 
  faThLarge, 
  faList, 
  faChevronLeft, 
  faChevronRight, 
  faCube, 
  faStar,
  faStarHalfAlt,
  faHeart as faHeartSolid,
  faTimes,
  faFilter,
  faSort
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline, faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import ARViewer from '@/components/ARViewer';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5186';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop&auto=format'
];

const getAuthHeaders = () => {
  if (typeof window === 'undefined') {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }
  
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

const getFallbackImage = (productId) => {
  const index = (productId - 1) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
};

const buildProductImageUrl = (imagePath, productId) => {
  if (!imagePath || imagePath === '') {
    return getFallbackImage(productId);
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  return getFallbackImage(productId);
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(6);
  const [favorites, setFavorites] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showARViewer, setShowARViewer] = useState(false);

  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: '', max: '' },
    materials: [],
    features: ['arEnabled'],
    rating: null
  });

  const searchSuggestions = [
    'modern sofa',
    'dining table',
    'office chair',
    'bedroom set',
    'coffee table',
    'bookshelf',
    'accent chair',
    'dining chairs'
  ];

  useEffect(() => {
    const fetchAREnabledProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/api/Products/ar-enabled`, {
          headers: getAuthHeaders()
        });

        if (response.data && Array.isArray(response.data)) {
          const products = response.data.map(product => ({
            id: product.id || product.productId || Math.floor(Math.random() * 1000),
            name: product.name || 'Unnamed Product',
            description: product.description || product.desc || 'Premium furniture piece',
            price: product.price || 0,
            imageUrl: product.imageUrl || product.img || product.displayImage,
            arEnabled: product.arEnabled !== false,
            rating: product.rating || 4.5,
            reviewCount: product.reviewCount || Math.floor(Math.random() * 30) + 10,
            material: product.material || 'Various',
            category: product.category || 'Living Room',
            arGlb: product.arGlb,
            arUsdz: product.arUsdz
          }));
          
          setSearchResults(products);
          setFilteredResults(products);
        } else {
          const demoProducts = getDemoProducts();
          setSearchResults(demoProducts);
          setFilteredResults(demoProducts);
        }
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Unable to load products. Showing demo products.');
        const demoProducts = getDemoProducts();
        setSearchResults(demoProducts);
        setFilteredResults(demoProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchAREnabledProducts();
  }, []);

  const getDemoProducts = () => {
    return [
      {
        id: 1,
        name: "Milano Luxury Sofa",
        description: "Premium Italian leather with oak frame",
        price: 2499,
        imageUrl: "/images/products/milano-luxury-italian-sofa-suites-rosa-800x500.jpg",
        arEnabled: true,
        rating: 5,
        reviewCount: 24,
        material: "Leather",
        category: "Living Room",
        arGlb: "/ar-models/glb/low_poly__sofa.glb",
        arUsdz: "/ar-models/usdz/Low_Poly__Sofa.usdz"
      },
      {
        id: 2,
        name: "Velvet Accent Chair",
        description: "Luxury velvet accent chair",
        price: 749,
        imageUrl: "/images/products/velvet.jpg",
        arEnabled: true,
        rating: 4,
        reviewCount: 18,
        material: "Velvet",
        category: "Living Room",
        arGlb: "/ar-models/glb/low_poly__sofa.glb",
        arUsdz: "/ar-models/usdz/Low_Poly__Sofa.usdz"
      },
      {
        id: 3,
        name: "Marble Coffee Table",
        description: "Elegant marble coffee table",
        price: 1299,
        imageUrl: "/images/products/marable.jpg",
        arEnabled: true,
        rating: 4.5,
        reviewCount: 31,
        material: "Marble",
        category: "Living Room",
        arGlb: "/ar-models/glb/low_poly__sofa.glb",
        arUsdz: "/ar-models/usdz/Low_Poly__Sofa.usdz"
      },
      {
        id: 4,
        name: "Modern TV Stand",
        description: "Contemporary TV stand with storage",
        price: 899,
        imageUrl: "/images/products/tv stand.jpg",
        arEnabled: true,
        rating: 4,
        reviewCount: 15,
        material: "Wood & Metal",
        category: "Living Room",
        arGlb: "/ar-models/glb/low_poly__sofa.glb",
        arUsdz: "/ar-models/usdz/Low_Poly__Sofa.usdz"
      },
      {
        id: 5,
        name: "King Size Platform Bed",
        description: "Modern king size platform bed",
        price: 1899,
        imageUrl: "/images/products/king size.jpg",
        arEnabled: true,
        rating: 5,
        reviewCount: 42,
        material: "Wood",
        category: "Bedroom",
        arGlb: "/ar-models/glb/low_poly__sofa.glb",
        arUsdz: "/ar-models/usdz/Low_Poly__Sofa.usdz"
      },
      {
        id: 6,
        name: "Dresser with Mirror",
        description: "Elegant dresser with built-in mirror",
        price: 1199,
        imageUrl: "/images/products/dresser.jpg",
        arEnabled: true,
        rating: 4,
        reviewCount: 27,
        material: "Wood",
        category: "Bedroom",
        arGlb: "/ar-models/glb/low_poly__sofa.glb",
        arUsdz: "/ar-models/usdz/Low_Poly__Sofa.usdz"
      },
    ].map(product => ({
      ...product,
      imageUrl: buildProductImageUrl(product.imageUrl, product.id)
    }));
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/Products/search`, {
        params: { query: searchQuery },
        headers: getAuthHeaders()
      });

      if (response.data && Array.isArray(response.data)) {
        const processedProducts = response.data.map(product => ({
          id: product.id || product.productId || Math.floor(Math.random() * 1000),
          name: product.name || 'Unnamed Product',
          description: product.description || product.desc || 'Premium furniture piece',
          price: product.price || 0,
          imageUrl: buildProductImageUrl(product.imageUrl || product.img || product.displayImage, product.id),
          arEnabled: product.arEnabled !== false,
          rating: product.rating || 4.5,
          reviewCount: product.reviewCount || Math.floor(Math.random() * 30) + 10,
          material: product.material || 'Various',
          category: product.category || 'Living Room'
        }));
        
        setSearchResults(processedProducts);
        setFilteredResults(processedProducts);
        setCurrentPage(1);
        setImageErrors({});
      }
    } catch (err) {
      console.error('Error searching products:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
      setShowSuggestions(false);
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => {
      const newFilters = { ...prev };
      
      switch (filterType) {
        case 'category':
          newFilters.categories = newFilters.categories.includes(value)
            ? newFilters.categories.filter(c => c !== value)
            : [...newFilters.categories, value];
          break;
        case 'material':
          newFilters.materials = newFilters.materials.includes(value)
            ? newFilters.materials.filter(m => m !== value)
            : [...newFilters.materials, value];
          break;
        case 'feature':
          newFilters.features = newFilters.features.includes(value)
            ? newFilters.features.filter(f => f !== value)
            : [...newFilters.features, value];
          break;
        case 'rating':
          newFilters.rating = value === newFilters.rating ? null : value;
          break;
        case 'priceMin':
          newFilters.priceRange.min = value;
          break;
        case 'priceMax':
          newFilters.priceRange.max = value;
          break;
      }
      
      return newFilters;
    });
  };

  useEffect(() => {
    let filtered = [...searchResults];

    if (filters.categories.length > 0) {
      filtered = filtered.filter(product => 
        filters.categories.includes(product.category)
      );
    }

    if (filters.materials.length > 0) {
      filtered = filtered.filter(product =>
        filters.materials.some(material => 
          product.material.toLowerCase().includes(material.toLowerCase())
        )
      );
    }

    if (filters.priceRange.min) {
      filtered = filtered.filter(product => 
        product.price >= parseInt(filters.priceRange.min) || 0
      );
    }
    if (filters.priceRange.max) {
      filtered = filtered.filter(product => 
        product.price <= parseInt(filters.priceRange.max) || Infinity
      );
    }

    if (filters.rating) {
      filtered = filtered.filter(product => 
        product.rating >= parseInt(filters.rating)
      );
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }

    setFilteredResults(filtered);
    setCurrentPage(1);
  }, [filters, sortBy, searchResults]);

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: '', max: '' },
      materials: [],
      features: ['arEnabled'],
      rating: null
    });
  };

  const handleImageSearch = () => {
    alert('Image search feature coming soon!');
  };

  const handleToggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleImageError = (e, productId) => {
    if (imageErrors[productId]) return;
    
    setImageErrors(prev => ({ ...prev, [productId]: true }));
    const fallbackImage = getFallbackImage(productId);
    e.target.src = fallbackImage;
    e.target.onerror = null;
  };

  const handleARPreview = (product) => {
    setSelectedProduct(product);
    setShowARViewer(true);
  };

  const handleAddToCart = (product) => {
    alert(`Added ${product.name} to cart!`);
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredResults.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredResults.length / productsPerPage);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-[var(--luxury-gold)] text-sm" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-[var(--luxury-gold)] text-sm" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStarOutline} className="text-[var(--luxury-gold)] text-sm" />);
    }
    
    return stars;
  };

  return (
    <div className="min-h-screen bg-[var(--soft-gray)] font-['Inter',_sans-serif]">
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          {error && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faTimes} className="text-yellow-600 mr-3" />
                <span className="text-yellow-700">{error}</span>
              </div>
            </div>
          )}

          {/* Search Hero Section */}
          <section className="mb-8">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[var(--charcoal)] mb-4">
                Find Your Perfect Furniture
              </h1>
              <p className="text-xl text-[var(--gray-dark)]">
                Search through our premium collection with advanced filters and AR preview
              </p>
            </div>
            
            {/* Advanced Search Bar */}
            <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Search for furniture..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-4 border border-[var(--gray-medium)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] text-lg bg-gray-50/30 transition-all"
                  />
                  <FontAwesomeIcon 
                    icon={faSearch} 
                    className="absolute left-4 top-5 text-[var(--gray-dark)] text-lg" 
                  />
                  
                  {/* Search Suggestions */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-[var(--gray-medium)] rounded-xl shadow-lg mt-2 z-20">
                      <div className="p-4">
                        <div className="space-y-2">
                          {searchSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="flex items-center space-x-3 p-3 hover:bg-[var(--soft-gray)] rounded-lg cursor-pointer transition-colors"
                            >
                              <FontAwesomeIcon icon={faSearch} className="text-[var(--gray-dark)]" />
                              <span className="text-[var(--charcoal)]">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-3">
                  <button
                    onClick={handleImageSearch}
                    className="bg-[var(--soft-gray)] hover:bg-[var(--warm-beige)] text-[var(--charcoal)] px-6 py-4 rounded-xl font-semibold transition-all flex items-center space-x-2 border border-[var(--gray-medium)]"
                  >
                    <FontAwesomeIcon icon={faCamera} />
                    <span>Image Search</span>
                  </button>
                  <button
                    onClick={handleSearch}
                    disabled={loading}
                    className="bg-[var(--luxury-gold)] hover:bg-[var(--luxury-gold-dark)] text-white px-8 py-4 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 shadow-lg shadow-[var(--luxury-gold)]/20"
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Mobile Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden mb-6 w-full bg-white border border-[var(--gray-medium)] rounded-xl p-4 flex items-center justify-between hover:bg-[var(--soft-gray)] transition-colors"
          >
            <span className="font-semibold text-[var(--charcoal)] flex items-center gap-2">
              <FontAwesomeIcon icon={faFilter} />
              Filters & Sort
            </span>
            <FontAwesomeIcon icon={faSort} className="text-[var(--gray-dark)]" />
          </button>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className={`lg:w-80 bg-white rounded-2xl shadow-sm p-6 h-fit lg:sticky lg:top-28 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[var(--charcoal)]">Filters</h3>
                <button
                  onClick={handleClearFilters}
                  className="text-[var(--luxury-gold)] hover:text-[var(--luxury-gold-dark)] font-semibold transition-colors"
                >
                  Clear All
                </button>
              </div>
              
              <div className="space-y-6">
                {/* Category Filter */}
                <div>
                  <h4 className="font-semibold text-[var(--charcoal)] mb-3">Category</h4>
                  <div className="space-y-2">
                    {['Living Room', 'Bedroom', 'Dining Room', 'Office'].map((category) => (
                      <label key={category} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.categories.includes(category)}
                          onChange={() => handleFilterChange('category', category)}
                          className="w-5 h-5 rounded text-[var(--luxury-gold)] focus:ring-[var(--luxury-gold)]"
                        />
                        <span className="text-[var(--gray-dark)]">{category} (125)</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Price Range Filter */}
                <div>
                  <h4 className="font-semibold text-[var(--charcoal)] mb-3">Price Range</h4>
                  <div className="space-y-3">
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        placeholder="Min"
                        value={filters.priceRange.min}
                        onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--gray-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] bg-gray-50/30 transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={filters.priceRange.max}
                        onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                        className="w-full px-3 py-2 border border-[var(--gray-medium)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] bg-gray-50/30 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'Under $500', value: '500' },
                        { label: '$500 - $1,000', value: '1000' },
                        { label: '$1,000 - $2,500', value: '2500' },
                        { label: 'Over $2,500', value: '2501' }
                      ].map((priceOption) => (
                        <label key={priceOption.value} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="price"
                            checked={filters.priceRange.max === priceOption.value}
                            onChange={() => handleFilterChange('priceMax', priceOption.value)}
                            className="w-5 h-5 text-[var(--luxury-gold)] focus:ring-[var(--luxury-gold)]"
                          />
                          <span className="text-[var(--gray-dark)]">{priceOption.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Material Filter */}
                <div>
                  <h4 className="font-semibold text-[var(--charcoal)] mb-3">Material</h4>
                  <div className="space-y-2">
                    {['Leather', 'Wood', 'Metal', 'Fabric'].map((material) => (
                      <label key={material} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.materials.includes(material)}
                          onChange={() => handleFilterChange('material', material)}
                          className="w-5 h-5 rounded text-[var(--luxury-gold)] focus:ring-[var(--luxury-gold)]"
                        />
                        <span className="text-[var(--gray-dark)]">{material}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Features Filter */}
                <div>
                  <h4 className="font-semibold text-[var(--charcoal)] mb-3">Features</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.features.includes('arEnabled')}
                        onChange={() => handleFilterChange('feature', 'arEnabled')}
                        className="w-5 h-5 rounded text-[var(--luxury-gold)] focus:ring-[var(--luxury-gold)]"
                      />
                      <span className="text-[var(--gray-dark)]">AR Ready</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.features.includes('freeShipping')}
                        onChange={() => handleFilterChange('feature', 'freeShipping')}
                        className="w-5 h-5 rounded text-[var(--luxury-gold)] focus:ring-[var(--luxury-gold)]"
                      />
                      <span className="text-[var(--gray-dark)]">Free Shipping</span>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.features.includes('onSale')}
                        onChange={() => handleFilterChange('feature', 'onSale')}
                        className="w-5 h-5 rounded text-[var(--luxury-gold)] focus:ring-[var(--luxury-gold)]"
                      />
                      <span className="text-[var(--gray-dark)]">On Sale</span>
                    </label>
                  </div>
                </div>
                
                {/* Rating Filter */}
                <div>
                  <h4 className="font-semibold text-[var(--charcoal)] mb-3">Rating</h4>
                  <div className="space-y-2">
                    {[5, 4, 3].map((rating) => (
                      <label key={rating} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="rating"
                          checked={filters.rating === rating.toString()}
                          onChange={() => handleFilterChange('rating', rating.toString())}
                          className="w-5 h-5 text-[var(--luxury-gold)] focus:ring-[var(--luxury-gold)]"
                        />
                        <div className="flex text-[var(--luxury-gold)]">
                          {renderStars(rating)}
                        </div>
                        <span className="text-[var(--gray-dark)]">& Up</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Search Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex flex-col md:flex-row justify-between items-center mb-6">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold text-[var(--charcoal)]">Search Results</h2>
                  <p className="text-[var(--gray-dark)]">{filteredResults.length} products found</p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-[var(--gray-dark)]">Sort by:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border border-[var(--gray-medium)] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] bg-gray-50/30 transition-all"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="newest">Newest First</option>
                      <option value="rating">Rating</option>
                    </select>
                  </div>
                  
                  <div className="flex border border-[var(--gray-medium)] rounded-lg">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-3 ${viewMode === 'grid' ? 'bg-[var(--luxury-gold)] text-white' : 'text-[var(--gray-dark)] hover:text-[var(--charcoal)] hover:bg-[var(--soft-gray)]'} rounded-l-lg transition-all`}
                    >
                      <FontAwesomeIcon icon={faThLarge} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-3 ${viewMode === 'list' ? 'bg-[var(--luxury-gold)] text-white' : 'text-[var(--gray-dark)] hover:text-[var(--charcoal)] hover:bg-[var(--soft-gray)]'} rounded-r-lg transition-all`}
                    >
                      <FontAwesomeIcon icon={faList} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--luxury-gold)] mx-auto mb-4"></div>
                  <p className="text-[var(--gray-dark)]">Loading products...</p>
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="text-center py-12">
                  <FontAwesomeIcon icon={faSearch} className="text-4xl text-[var(--gray-medium)] mb-4" />
                  <h3 className="text-xl font-semibold text-[var(--charcoal)] mb-2">No products found</h3>
                  <p className="text-[var(--gray-dark)] mb-6">Try adjusting your filters or search term</p>
                  <button
                    onClick={handleClearFilters}
                    className="bg-[var(--luxury-gold)] hover:bg-[var(--luxury-gold-dark)] text-white px-6 py-3 rounded-xl font-medium transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-[var(--luxury-gold)]/20"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <>
                  <div className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                      : 'grid-cols-1'
                  }`}>
                    {currentProducts.map((product) => (
                      <div
                        key={product.id}
                        className={`group bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-all ${
                          viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                        }`}
                      >
                        <div className={`relative ${viewMode === 'list' ? 'md:w-64 h-64' : 'h-64'}`}>
                          <img
                            src={buildProductImageUrl(product.imageUrl, product.id)}
                            alt={product.name}
                            className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                              viewMode === 'list' ? 'md:rounded-l-2xl rounded-t-2xl md:rounded-tr-none' : ''
                            }`}
                            onError={(e) => handleImageError(e, product.id)}
                          />
                          {product.arEnabled && (
                            <div className="absolute top-4 right-4">
                              <span className="bg-[var(--luxury-gold)] text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                                AR Ready
                              </span>
                            </div>
                          )}
                          <button
                            onClick={() => handleToggleFavorite(product.id)}
                            className="absolute top-4 left-4 bg-white/80 hover:bg-white rounded-full p-3 transition-all shadow-sm hover:shadow-md"
                          >
                            <FontAwesomeIcon
                              icon={favorites.includes(product.id) ? faHeartSolid : faHeartOutline}
                              className={favorites.includes(product.id) ? "text-red-500" : "text-[var(--charcoal)]"}
                            />
                          </button>
                        </div>
                        
                        <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                          <h3 className="text-xl font-semibold text-[var(--charcoal)] mb-2">
                            {product.name}
                          </h3>
                          <p className="text-[var(--gray-dark)] mb-4">{product.description}</p>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-2xl font-bold text-[var(--charcoal)]">
                              ${product.price.toLocaleString()}
                            </span>
                            <div className="flex items-center space-x-1">
                              <div className="flex">
                                {renderStars(product.rating)}
                              </div>
                              <span className="text-[var(--gray-dark)] text-sm">({product.reviewCount})</span>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleAddToCart(product)}
                              className="flex-1 bg-[var(--luxury-gold)] hover:bg-[var(--luxury-gold-dark)] text-white py-3 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-[var(--luxury-gold)]/20"
                            >
                              Add to Cart
                            </button>
                            {product.arEnabled && (
                              <button 
                                onClick={() => handleARPreview(product)}
                                className="px-4 border-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)] hover:bg-[var(--luxury-gold)] hover:text-white rounded-xl transition-all flex items-center justify-center"
                              >
                                <FontAwesomeIcon icon={faCube} />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center space-x-2 mt-12">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-[var(--gray-medium)] rounded-lg hover:bg-[var(--soft-gray)] transition-colors disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faChevronLeft} />
                      </button>
                      
                      {Array.from({ length: Math.min(4, totalPages) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 4) {
                          pageNum = i + 1;
                        } else if (currentPage <= 2) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 1) {
                          pageNum = totalPages - 3 + i;
                        } else {
                          pageNum = currentPage - 1 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 rounded-lg transition-all ${
                              currentPage === pageNum
                                ? 'bg-[var(--luxury-gold)] text-white shadow-md'
                                : 'border border-[var(--gray-medium)] hover:bg-[var(--soft-gray)]'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {totalPages > 4 && currentPage < totalPages - 2 && (
                        <span className="px-2 text-[var(--gray-dark)]">...</span>
                      )}
                      
                      {totalPages > 4 && currentPage < totalPages - 1 && (
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className={`px-4 py-2 rounded-lg transition-all ${
                            currentPage === totalPages
                              ? 'bg-[var(--luxury-gold)] text-white shadow-md'
                              : 'border border-[var(--gray-medium)] hover:bg-[var(--soft-gray)]'
                          }`}
                        >
                          {totalPages}
                        </button>
                      )}
                      
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-[var(--gray-medium)] rounded-lg hover:bg-[var(--soft-gray)] transition-colors disabled:opacity-50"
                      >
                        <FontAwesomeIcon icon={faChevronRight} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* AR Viewer */}
      {showARViewer && selectedProduct && (
        <ARViewer
          product={selectedProduct}
          isOpen={showARViewer}
          onClose={() => setShowARViewer(false)}
        />
      )}
    </div>
  );
}