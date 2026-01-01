'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faHeart, 
  faShoppingCart, 
  faUser, 
  faChevronRight, 
  faTimes, 
  faThLarge, 
  faList, 
  faCube, 
  faStar,
  faStarHalfAlt,
  faShareAlt,
  faPlus,
  faTrashAlt,
  faShoppingBag
} from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartOutline, faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
import { 
  faFacebook, 
  faInstagram, 
  faTwitter 
} from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5186';

// روابط صور بديلة صالحة
const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1517705008128-361805f42e86?w=400&h=300&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format'
];

const getAuthHeaders = () => {
  if (typeof window === 'undefined') {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }
  
  const token = localStorage.getItem('authToken');
  const userId = localStorage.getItem('userId');
  
  const headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// دالة للحصول على رابط صورة بديل آمن
const getFallbackImage = (productId) => {
  const index = (productId - 1) % FALLBACK_IMAGES.length;
  return FALLBACK_IMAGES[index];
};

// دالة لبناء رابط صورة المنتج
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

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('newest');
  const [summary, setSummary] = useState({
    itemCount: 0,
    totalValue: 0
  });
  const [suggestions, setSuggestions] = useState([]);
  const [imageErrors, setImageErrors] = useState({});
  const [removingItem, setRemovingItem] = useState(null);
  const [movingToCart, setMovingToCart] = useState(null);

  // Fetch wishlist data from API
  useEffect(() => {
    const fetchWishlistData = async () => {
      try {
        setLoading(true);
        
        // جلب بيانات المفضلة
        const wishlistResponse = await axios.get(`${API_BASE_URL}/api/Wishlist`, {
          params: {
            sortBy: sortBy,
            page: 1,
            pageSize: 20
          },
          headers: getAuthHeaders()
        });

        if (wishlistResponse.data && Array.isArray(wishlistResponse.data)) {
          const items = wishlistResponse.data.map(item => ({
            id: item.id,
            productId: item.productId,
            name: item.productName || `Product ${item.productId}`,
            description: item.productDescription || 'Premium furniture piece',
            price: item.productPrice || 0,
            imageUrl: item.productImage || '',
            arEnabled: item.arEnabled !== false,
            rating: item.productRating || 4.5,
            reviewCount: item.reviewCount || Math.floor(Math.random() * 30) + 10,
            material: item.material || 'Various',
            category: item.category || 'Living Room',
            quantity: item.quantity || 1,
            notes: item.notes || '',
            addedDate: item.addedDate || new Date().toISOString()
          }));
          
          setWishlistItems(items);
          
          // حساب الإجماليات
          const itemCount = items.length;
          const totalValue = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          setSummary({ itemCount, totalValue });
        } else {
          // Fallback to demo data
          const demoItems = getDemoWishlistItems();
          setWishlistItems(demoItems);
          const itemCount = demoItems.length;
          const totalValue = demoItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          setSummary({ itemCount, totalValue });
        }

        // جلب الاقتراحات
        try {
          const suggestionsResponse = await axios.get(`${API_BASE_URL}/api/Wishlist/Suggestions`, {
            headers: getAuthHeaders()
          });
          
          if (suggestionsResponse.data && Array.isArray(suggestionsResponse.data)) {
            setSuggestions(suggestionsResponse.data.slice(0, 4));
          }
        } catch (suggestionsError) {
          console.error('Error fetching suggestions:', suggestionsError);
          // استخدام بيانات تجريبية للاقتراحات
          setSuggestions(getDemoSuggestions());
        }

      } catch (err) {
        console.error('Error fetching wishlist:', err);
        setError('Unable to load wishlist. Showing demo data.');
        // Fallback to demo data
        const demoItems = getDemoWishlistItems();
        setWishlistItems(demoItems);
        const itemCount = demoItems.length;
        const totalValue = demoItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        setSummary({ itemCount, totalValue });
        setSuggestions(getDemoSuggestions());
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistData();
  }, [sortBy]);

  // Get demo wishlist items
  const getDemoWishlistItems = () => {
    return [
      {
        id: 1,
        productId: 101,
        name: "Milano Luxury Sofa",
        description: "Premium Italian leather with oak frame",
        price: 2499,
        imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/bbfc080f99-41ba783de350f8fb9121.png",
        arEnabled: true,
        rating: 5,
        reviewCount: 24,
        material: "Leather",
        category: "Living Room",
        quantity: 1,
        notes: "For living room",
        addedDate: "2024-01-15T10:30:00Z"
      },
      {
        id: 2,
        productId: 102,
        name: "Walnut Dining Table",
        description: "Solid walnut with steel legs",
        price: 1899,
        imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/1b8c72839f-95f52729a353837d3098.png",
        arEnabled: true,
        rating: 4,
        reviewCount: 18,
        material: "Wood",
        category: "Dining Room",
        quantity: 1,
        notes: "For dining area",
        addedDate: "2024-01-10T14:20:00Z"
      },
      {
        id: 3,
        productId: 103,
        name: "Executive Office Chair",
        description: "Genuine leather with ergonomic design",
        price: 899,
        imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/80381d916d-05c76f11166bb41384d0.png",
        arEnabled: true,
        rating: 5,
        reviewCount: 31,
        material: "Leather",
        category: "Office",
        quantity: 1,
        notes: "For home office",
        addedDate: "2024-01-05T09:15:00Z"
      },
      {
        id: 4,
        productId: 104,
        name: "Modern Oak Dresser",
        description: "White oak with soft-close drawers",
        price: 1299,
        imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/ad2c053e90-34027dd63adc35d269d4.png",
        arEnabled: true,
        rating: 4,
        reviewCount: 16,
        material: "Wood",
        category: "Bedroom",
        quantity: 1,
        notes: "",
        addedDate: "2024-01-02T16:45:00Z"
      },
      {
        id: 5,
        productId: 105,
        name: "Marble Coffee Table",
        description: "Carrara marble with gold legs",
        price: 899,
        imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/792327eb9d-dcc36036a99944896ed2.png",
        arEnabled: true,
        rating: 5,
        reviewCount: 22,
        material: "Marble & Metal",
        category: "Living Room",
        quantity: 1,
        notes: "For center table",
        addedDate: "2023-12-28T11:10:00Z"
      },
      {
        id: 6,
        productId: 106,
        name: "Walnut Bookshelf",
        description: "5-tier solid walnut construction",
        price: 699,
        imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/e315188b3c-ac7acb748742dd31db8e.png",
        arEnabled: true,
        rating: 4,
        reviewCount: 14,
        material: "Wood",
        category: "Living Room",
        quantity: 1,
        notes: "For books collection",
        addedDate: "2023-12-25T13:30:00Z"
      },
      {
        id: 7,
        productId: 107,
        name: "Oak Nightstand",
        description: "2-drawer with wireless charging",
        price: 449,
        imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/41a694fb7e-1b9123451aedc1f4ba76.png",
        arEnabled: true,
        rating: 5,
        reviewCount: 19,
        material: "Wood",
        category: "Bedroom",
        quantity: 1,
        notes: "",
        addedDate: "2023-12-20T15:20:00Z"
      },
      {
        id: 8,
        productId: 108,
        name: "Velvet Accent Chair",
        description: "Emerald velvet with brass legs",
        price: 749,
        imageUrl: "https://storage.googleapis.com/uxpilot-auth.appspot.com/9e40f89f9d-78cfe151d44e0e6128c2.png",
        arEnabled: true,
        rating: 4,
        reviewCount: 27,
        material: "Velvet & Metal",
        category: "Living Room",
        quantity: 1,
        notes: "Accent piece",
        addedDate: "2023-12-15T10:45:00Z"
      }
    ].map(item => ({
      ...item,
      imageUrl: buildProductImageUrl(item.imageUrl, item.id)
    }));
  };

  // Get demo suggestions
  const getDemoSuggestions = () => {
    return [
      {
        id: 201,
        name: "Designer Armchair",
        price: 599,
        imageUrl: buildProductImageUrl("https://storage.googleapis.com/uxpilot-auth.appspot.com/bbfc080f99-41ba783de350f8fb9121.png", 201),
        rating: 4.5
      },
      {
        id: 202,
        name: "Modern Side Table",
        price: 349,
        imageUrl: buildProductImageUrl("https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&auto=format", 202),
        rating: 4
      },
      {
        id: 203,
        name: "Leather Recliner",
        price: 1299,
        imageUrl: buildProductImageUrl("https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop&auto=format", 203),
        rating: 4.8
      },
      {
        id: 204,
        name: "Glass Display Cabinet",
        price: 899,
        imageUrl: buildProductImageUrl("https://images.unsplash.com/photo-1503602642458-232111445657?w=400&h=300&fit=crop&auto=format", 204),
        rating: 4.3
      }
    ];
  };

  // Handle remove item from wishlist
  const handleRemoveItem = async (itemId) => {
    if (!confirm('Are you sure you want to remove this item from your wishlist?')) {
      return;
    }

    try {
      setRemovingItem(itemId);
      await axios.delete(`${API_BASE_URL}/api/Wishlist/${itemId}`, {
        headers: getAuthHeaders()
      });

      // تحديث الواجهة
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      setSummary(prev => ({
        itemCount: prev.itemCount - 1,
        totalValue: prev.totalValue - (wishlistItems.find(item => item.id === itemId)?.price || 0)
      }));

    } catch (err) {
      console.error('Error removing item from wishlist:', err);
      alert('Failed to remove item. Please try again.');
    } finally {
      setRemovingItem(null);
    }
  };

  // Handle move item to cart
  const handleMoveToCart = async (itemId) => {
    try {
      setMovingToCart(itemId);
      await axios.post(`${API_BASE_URL}/api/Wishlist/MoveToCart/${itemId}`, {}, {
        headers: getAuthHeaders()
      });

      // إزالة العنصر من المفضلة بعد نقله للسلة
      setWishlistItems(prev => prev.filter(item => item.id !== itemId));
      setSummary(prev => ({
        itemCount: prev.itemCount - 1,
        totalValue: prev.totalValue - (wishlistItems.find(item => item.id === itemId)?.price || 0)
      }));

      alert('Item moved to cart successfully!');

    } catch (err) {
      console.error('Error moving item to cart:', err);
      alert('Failed to move item to cart. Please try again.');
    } finally {
      setMovingToCart(null);
    }
  };

  // Handle move all to cart
  const handleMoveAllToCart = async () => {
    if (wishlistItems.length === 0) {
      alert('Your wishlist is empty!');
      return;
    }

    if (!confirm(`Move all ${wishlistItems.length} items to cart?`)) {
      return;
    }

    try {
      // يمكنك هنا إضافة منطق لنقل جميع العناصر مرة واحدة
      // أو استخدام حلقة لنقل كل عنصر على حدة
      alert(`${wishlistItems.length} items moved to cart!`);
      setWishlistItems([]);
      setSummary({ itemCount: 0, totalValue: 0 });

    } catch (err) {
      console.error('Error moving all items to cart:', err);
      alert('Failed to move items to cart. Please try again.');
    }
  };

  // Handle clear wishlist
  const handleClearWishlist = async () => {
    if (wishlistItems.length === 0) {
      alert('Your wishlist is already empty!');
      return;
    }

    if (!confirm('Are you sure you want to clear your entire wishlist?')) {
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/api/Wishlist/Clear`, {}, {
        headers: getAuthHeaders()
      });

      setWishlistItems([]);
      setSummary({ itemCount: 0, totalValue: 0 });
      alert('Wishlist cleared successfully!');

    } catch (err) {
      console.error('Error clearing wishlist:', err);
      alert('Failed to clear wishlist. Please try again.');
    }
  };

  // Handle share wishlist
  const handleShareWishlist = () => {
    if (wishlistItems.length === 0) {
      alert('Your wishlist is empty!');
      return;
    }

    const wishlistText = `My Furniture Wishlist:\n\n${wishlistItems.map((item, index) => 
      `${index + 1}. ${item.name} - $${item.price}`
    ).join('\n')}\n\nTotal: $${summary.totalValue.toLocaleString()}`;

    if (navigator.share) {
      navigator.share({
        title: 'My Furniture Wishlist',
        text: wishlistText,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(wishlistText)
        .then(() => alert('Wishlist copied to clipboard!'))
        .catch(() => alert('Failed to copy wishlist. Please try again.'));
    }
  };

  // Handle image load error
  const handleImageError = (e, itemId) => {
    if (imageErrors[itemId]) return;
    
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
    const fallbackImage = getFallbackImage(itemId);
    e.target.src = fallbackImage;
    e.target.onerror = null;
  };

  // Render star rating
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-[var(--luxury-gold)] text-xs" />);
    }
    
    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-[var(--luxury-gold)] text-xs" />);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStarOutline} className="text-[var(--luxury-gold)] text-xs" />);
    }
    
    return stars;
  };

  // Handle sort change
  const handleSortChange = (value) => {
    setSortBy(value);
  };

  // Handle AR preview
  const handleARPreview = (productName) => {
    alert(`Opening ${productName} in AR mode!`);
    // هنا يمكنك إضافة منطق فتح AR
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--soft-gray)]">
        <div className="animate-pulse">
          <section className="bg-white py-4">
            <div className="max-w-7xl mx-auto px-6">
              <div className="h-4 bg-gray-200 rounded w-48"></div>
            </div>
          </section>

          <section className="py-8">
            <div className="max-w-7xl mx-auto px-6">
              <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
          </section>

          <section className="pb-16">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="h-64 bg-gray-300"></div>
                    <div className="p-5 space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--soft-gray)]">
      
      <main id="main-content">
        {/* Breadcrumb */}
        <section className="bg-white py-4">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex items-center space-x-2 text-sm">
              <a href="/" className="text-gray-500 hover:text-[var(--luxury-gold)] transition-colors">
                Home
              </a>
              <FontAwesomeIcon icon={faChevronRight} className="text-gray-400 text-xs" />
              <span className="text-[var(--charcoal)] font-medium">Wishlist</span>
            </nav>
          </div>
        </section>

        {/* Wishlist Header */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-3xl font-bold text-[var(--charcoal)] mb-2">My Wishlist</h1>
                <p className="text-gray-600">
                  {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'} saved for later
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleShareWishlist}
                  disabled={wishlistItems.length === 0}
                  className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] transition-colors flex items-center space-x-2 disabled:opacity-50"
                >
                  <FontAwesomeIcon icon={faShareAlt} />
                  <span>Share Wishlist</span>
                </button>
                <button
                  onClick={handleMoveAllToCart}
                  disabled={wishlistItems.length === 0}
                  className="bg-[var(--luxury-gold)] hover:bg-[var(--warm-copper)] text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50"
                >
                  Add All to Cart
                </button>
                {wishlistItems.length > 0 && (
                  <button
                    onClick={handleClearWishlist}
                    className="text-red-600 hover:text-red-800 font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                    <span>Clear All</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Wishlist Filters */}
        <section className="pb-6">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]"
                >
                  <option value="newest">Date Added</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 font-medium">View:</span>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'bg-[var(--luxury-gold)] text-white' 
                      : 'text-gray-400 hover:text-[var(--luxury-gold)]'
                  }`}
                >
                  <FontAwesomeIcon icon={faThLarge} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-[var(--luxury-gold)] text-white' 
                      : 'text-gray-400 hover:text-[var(--luxury-gold)]'
                  }`}
                >
                  <FontAwesomeIcon icon={faList} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Error Message */}
        {error && (
          <div className="max-w-7xl mx-auto px-6 mb-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faTimes} className="text-yellow-600 mr-3" />
                <span className="text-yellow-700">{error}</span>
              </div>
            </div>
          </div>
        )}

        {/* Wishlist Products */}
        <section className="pb-16">
          <div className="max-w-7xl mx-auto px-6">
            {wishlistItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl">
                <FontAwesomeIcon icon={faHeartOutline} className="text-6xl text-gray-300 mb-6" />
                <h2 className="text-2xl font-semibold text-[var(--charcoal)] mb-3">Your wishlist is empty</h2>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Save items you love to your wishlist. Review them anytime and easily move them to your cart.
                </p>
                <a
                  href="/products"
                  className="inline-block bg-[var(--luxury-gold)] hover:bg-[var(--warm-copper)] text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Browse Products
                </a>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {wishlistItems.map((item) => (
                  <div
                    key={item.id}
                    className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all ${
                      viewMode === 'list' ? 'flex flex-col md:flex-row' : ''
                    }`}
                  >
                    <div className={`relative ${viewMode === 'list' ? 'md:w-64 h-64' : 'h-64'}`}>
                      <img
                        src={buildProductImageUrl(item.imageUrl, item.id)}
                        alt={item.name}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                          viewMode === 'list' ? 'md:rounded-l-xl rounded-t-xl md:rounded-tr-none' : ''
                        }`}
                        onError={(e) => handleImageError(e, item.id)}
                      />
                      {item.arEnabled && (
                        <div className="absolute top-3 left-3">
                          <span className="bg-[var(--luxury-gold)] text-white px-3 py-1 rounded-full text-xs font-semibold">
                            AR Ready
                          </span>
                        </div>
                      )}
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingItem === item.id}
                        className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors disabled:opacity-50"
                        title="Remove from wishlist"
                      >
                        {removingItem === item.id ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          <FontAwesomeIcon icon={faTimes} className="text-sm" />
                        )}
                      </button>
                    </div>
                    
                    <div className={`p-5 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                      <h3 className="text-lg font-semibold text-[var(--charcoal)] mb-1">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-3">{item.description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xl font-bold text-[var(--charcoal)]">
                          ${item.price.toLocaleString()}
                        </span>
                        <div className="flex items-center space-x-1">
                          <div className="flex">
                            {renderStars(item.rating)}
                          </div>
                          <span className="text-gray-400 text-xs">({item.reviewCount})</span>
                        </div>
                      </div>
                      
                      {item.notes && (
                        <div className="mb-3 p-2 bg-[var(--soft-gray)] rounded text-sm text-gray-600">
                          <span className="font-medium">Note:</span> {item.notes}
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <button
                          onClick={() => handleMoveToCart(item.id)}
                          disabled={movingToCart === item.id}
                          className="w-full bg-[var(--luxury-gold)] hover:bg-[var(--warm-copper)] text-white py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                        >
                          {movingToCart === item.id ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                              <span>Moving...</span>
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faShoppingCart} />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>
                        
                        {item.arEnabled && (
                          <button
                            onClick={() => handleARPreview(item.name)}
                            className="w-full border border-[var(--luxury-gold)] text-[var(--luxury-gold)] hover:bg-[var(--luxury-gold)] hover:text-white py-2 rounded-lg font-medium transition-all flex items-center justify-center space-x-2"
                          >
                            <FontAwesomeIcon icon={faCube} />
                            <span>View in AR</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Wishlist Summary */}
        {wishlistItems.length > 0 && (
          <section className="py-8 bg-white">
            <div className="max-w-7xl mx-auto px-6">
              <div className="bg-[var(--warm-beige)] rounded-xl p-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--charcoal)] mb-1">
                      Wishlist Summary
                    </h3>
                    <p className="text-gray-600">
                      {summary.itemCount} items • Total value: ${summary.totalValue.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="/products"
                      className="bg-white hover:bg-gray-50 text-[var(--charcoal)] px-6 py-3 rounded-lg font-semibold border border-gray-200 transition-colors"
                    >
                      Continue Shopping
                    </a>
                    <button
                      onClick={handleMoveAllToCart}
                      className="bg-[var(--luxury-gold)] hover:bg-[var(--warm-copper)] text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                    >
                      <FontAwesomeIcon icon={faShoppingBag} />
                      <span>Move All to Cart</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Recommendations */}
        {suggestions.length > 0 && (
          <section className="py-12 bg-[var(--soft-gray)]">
            <div className="max-w-7xl mx-auto px-6">
              <h2 className="text-2xl font-bold text-[var(--charcoal)] mb-6">You May Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {suggestions.map((product) => (
                  <div key={product.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={buildProductImageUrl(product.imageUrl, product.id)}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => handleImageError(e, product.id)}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-[var(--charcoal)] mb-1">{product.name}</h3>
                      <p className="text-[var(--luxury-gold)] font-bold">
                        ${product.price?.toLocaleString() || '0'}
                      </p>
                      <div className="flex items-center mt-2">
                        <div className="flex text-[var(--luxury-gold)]">
                          {renderStars(product.rating || 4)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

    </div>
  );
}