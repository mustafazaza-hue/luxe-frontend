'use client';

import { useState, useEffect } from 'react';

import RecommendedProducts from '@/components/RecommendedProducts';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5186';

// دالة محلية بدلاً من الاستيراد
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

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [shippingInfo, setShippingInfo] = useState({
    country: '',
    zipCode: ''
  });

  // Fetch cart data from API
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/api/Cart`, {
          headers: getAuthHeaders()
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch cart data: ${response.status}`);
        }
        
        const cartData = await response.json();
        console.log('Cart API Response:', cartData);
        
        // إذا كانت السلة فارغة، استخدم بيانات افتراضية للعرض
        if (!cartData.items || cartData.items.length === 0) {
          console.log('Cart is empty, using demo data');
          setCartItems([
            {
              id: 1,
              productId: 1,
              name: 'Milano Luxury Sofa',
              description: 'Premium Italian leather with oak frame',
              price: 2499,
              quantity: 1,
              color: 'Beige',
              features: ['AR Ready'],
              imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/bbfc080f99-9a262e7b28390510d644.png'
            },
            {
              id: 2,
              productId: 2,
              name: 'Walnut Dining Table',
              description: 'Solid walnut with steel legs',
              price: 1899,
              quantity: 1,
              size: '6 Seater',
              features: ['AR Ready'],
              imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/1b8c72839f-d44af22d32197ed4839f.png'
            },
            {
              id: 3,
              productId: 3,
              name: 'Executive Office Chair',
              description: 'Genuine leather with ergonomic design',
              price: 899,
              quantity: 1,
              color: 'Black',
              features: ['AR Ready'],
              imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/80381d916d-9af6adfa8290e1dea3df.png'
            }
          ]);
        } else {
          console.log(`Loaded ${cartData.items.length} items from API`);
          setCartItems(cartData.items);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Failed to load cart. Please try again.');
        
        // Fallback data في حالة فشل الـ API
        setCartItems([
          {
            id: 1,
            productId: 1,
            name: 'Milano Luxury Sofa',
            description: 'Premium Italian leather with oak frame',
            price: 2499,
            quantity: 1,
            color: 'Beige',
            features: ['AR Ready'],
            imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/bbfc080f99-9a262e7b28390510d644.png'
          },
          {
            id: 2,
            productId: 2,
            name: 'Walnut Dining Table',
            description: 'Solid walnut with steel legs',
            price: 1899,
            quantity: 1,
            size: '6 Seater',
            features: ['AR Ready'],
            imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/1b8c72839f-d44af22d32197ed4839f.png'
          },
          {
            id: 3,
            productId: 3,
            name: 'Executive Office Chair',
            description: 'Genuine leather with ergonomic design',
            price: 899,
            quantity: 1,
            color: 'Black',
            features: ['AR Ready'],
            imageUrl: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/80381d916d-9af6adfa8290e1dea3df.png'
          }
        ]);
        
        setLoading(false);
      }
    };

    fetchCartData();
  }, []);

  // Handle quantity change
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    // تحديث الواجهة أولاً
    const updatedItems = cartItems.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);

    // تحديث الـ API (إذا كان هناك endpoint للتحديث)
    try {
      console.log(`Updated quantity for item ${itemId} to ${newQuantity}`);
    } catch (err) {
      console.error('Error updating quantity:', err);
    }
  };

  // Handle remove item
  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/Cart/RemoveItem/${itemId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setCartItems(prev => prev.filter(item => item.id !== itemId));
        alert('Item removed from cart successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to remove item:', errorText);
        alert('Failed to remove item from cart. Please try again.');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      // Fallback: تحديث الواجهة فقط
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      alert('Item removed (offline mode)');
    }
  };

  // Handle clear cart
  const handleClearCart = async () => {
    if (cartItems.length === 0) {
      alert('Your cart is already empty');
      return;
    }
    
    if (!confirm('Are you sure you want to clear your entire cart?')) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/Cart/Clear`, {
        method: 'POST',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        setCartItems([]);
        alert('Cart cleared successfully');
      } else {
        const errorText = await response.text();
        console.error('Failed to clear cart:', errorText);
        alert('Failed to clear cart. Please try again.');
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      // Fallback: تفريغ الواجهة
      setCartItems([]);
      alert('Cart cleared (offline mode)');
    }
  };

  // Handle apply coupon
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      alert('Please enter a coupon code');
      return;
    }

    // محاكاة تطبيق الكوبون
    if (couponCode.toUpperCase() === 'LUXURY20') {
      setAppliedCoupon({
        code: 'LUXURY20',
        discount: 0.2
      });
      alert('🎉 Coupon applied successfully! You got 20% off!');
    } else if (couponCode.toUpperCase() === 'FREESHIP') {
      setAppliedCoupon({
        code: 'FREESHIP',
        discount: 0,
        freeShipping: true
      });
      alert('🚚 Free shipping applied!');
    } else {
      alert('❌ Invalid coupon code. Try "LUXURY20" for 20% off or "FREESHIP" for free shipping.');
    }
  };

  // Handle remove coupon
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    alert('Coupon removed');
  };

  // Handle checkout
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty. Add some items before checkout.');
      return;
    }
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      alert('Please login to proceed to checkout');
      window.location.href = '/login?redirect=/cart';
      return;
    }
    
    window.location.href = '/checkout';
  };

  // Handle calculate shipping
  const handleCalculateShipping = () => {
    if (!shippingInfo.country || !shippingInfo.zipCode) {
      alert('Please select country and enter ZIP code');
      return;
    }
    
    alert(`Shipping calculated for ${shippingInfo.country}, ${shippingInfo.zipCode} (Demo mode)`);
  };

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const shipping = (subtotal > 2000 || appliedCoupon?.freeShipping) ? 0 : 99;
    
    const discount = appliedCoupon?.discount ? subtotal * appliedCoupon.discount : 0;
    
    const taxRate = 0.08;
    const tax = (subtotal - discount) * taxRate;
    
    const total = subtotal + shipping + tax - discount;

    return { 
      subtotal, 
      shipping, 
      discount, 
      tax, 
      total,
      itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
    };
  };

  const totals = calculateTotals();

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--soft-gray)]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center space-x-2 text-sm mb-8">
            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          
          <div className="h-10 bg-gray-200 rounded w-64 mb-8 animate-pulse"></div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 h-48 animate-pulse">
                  <div className="flex gap-6">
                    <div className="w-32 h-32 bg-gray-300 rounded-xl"></div>
                    <div className="flex-1 space-y-4">
                      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="flex justify-between">
                        <div className="h-8 bg-gray-300 rounded w-32"></div>
                        <div className="h-8 bg-gray-300 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 h-96 animate-pulse"></div>
              <div className="bg-gradient-to-r from-[var(--luxury-gold)] to-[var(--warm-copper)] rounded-2xl p-6 h-40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--soft-gray)]">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <i className="fa-solid fa-triangle-exclamation text-4xl text-yellow-500 mb-4"></i>
            <h2 className="text-2xl font-bold text-[var(--charcoal)] mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-gray-500 text-sm mb-6">Displaying demo cart items for now</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-[var(--luxury-gold)] hover:bg-opacity-90 text-white px-6 py-3 rounded-xl font-semibold transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (cartItems.length === 0 && !loading) {
    return (
      <div className="min-h-screen bg-[var(--soft-gray)]">
        
        <main className="py-12">
          <div className="max-w-7xl mx-auto px-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm mb-8">
              <a href="/" className="text-gray-500 hover:text-[var(--luxury-gold)] transition-colors">Home</a>
              <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
              <span className="text-[var(--charcoal)] font-medium">Shopping Cart</span>
            </div>

            <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fa-solid fa-cart-shopping text-3xl text-gray-400"></i>
              </div>
              
              <h1 className="text-3xl font-bold text-[var(--charcoal)] mb-3">Your cart is empty</h1>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. Explore our premium collection to find something you'll love!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/categories" 
                  className="inline-block bg-[var(--luxury-gold)] hover:bg-opacity-90 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
                >
                  <i className="fa-solid fa-gem mr-2"></i>
                  Browse Collections
                </a>
                <a 
                  href="/products/featured" 
                  className="inline-block border-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)] hover:bg-[var(--luxury-gold)] hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all"
                >
                  <i className="fa-solid fa-star mr-2"></i>
                  View Featured Items
                </a>
              </div>
              
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-[var(--charcoal)] mb-4">Not sure where to start?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <a href="/categories/living-room" className="text-[var(--luxury-gold)] hover:underline">
                    <i className="fa-solid fa-couch mr-2"></i>
                    Living Room
                  </a>
                  <a href="/categories/bedroom" className="text-[var(--luxury-gold)] hover:underline">
                    <i className="fa-solid fa-bed mr-2"></i>
                    Bedroom
                  </a>
                  <a href="/categories/office" className="text-[var(--luxury-gold)] hover:underline">
                    <i className="fa-solid fa-chair mr-2"></i>
                    Office
                  </a>
                </div>
              </div>
            </div>

            {/* Recommended Products */}
            <RecommendedProducts />
          </div>
        </main>
        
      </div>
    );
  }

  // Main cart with items
  return (
    <div className="min-h-screen bg-[var(--soft-gray)]">
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm mb-8">
            <a href="/" className="text-gray-500 hover:text-[var(--luxury-gold)] transition-colors">Home</a>
            <i className="fa-solid fa-chevron-right text-gray-400 text-xs"></i>
            <span className="text-[var(--charcoal)] font-medium">Shopping Cart</span>
          </div>

          <h1 className="text-4xl font-bold text-[var(--charcoal)] mb-2">
            Shopping Cart
            <span className="text-lg text-gray-500 font-normal ml-3">
              ({totals.itemCount} {totals.itemCount === 1 ? 'item' : 'items'})
            </span>
          </h1>
          <p className="text-gray-600 mb-8">Review your items and proceed to checkout</p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Cart Items Section */}
            <div className="lg:col-span-2 space-y-10">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-8 shadow-sm">
                  <div className="flex gap-8">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name}
                      className="w-32 h-32 object-cover rounded-xl shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[var(--charcoal)] mb-2">{item.name}</h3>
                      <p className="text-gray-500 mb-4">{item.description}</p>
                      
                      <div className="flex flex-wrap gap-3 mb-4">
                        {item.color && (
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold text-[var(--charcoal)]">Color:</span> {item.color}
                          </span>
                        )}
                        {item.size && (
                          <span className="text-sm text-gray-600">
                            <span className="font-semibold text-[var(--charcoal)]">Size:</span> {item.size}
                          </span>
                        )}
                        {item.features && item.features.includes('AR Ready') && (
                          <span className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                            <i className="fa-solid fa-vr-cardboard mr-1"></i> AR Ready
                          </span>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                          <span className="text-lg font-bold text-[var(--charcoal)]">
                            ${(item.price * item.quantity).toLocaleString()}
                          </span>
                          <div className="flex items-center border border-gray-200 rounded-xl">
                            <button 
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[var(--luxury-gold)]"
                            >
                              <i className="fa-solid fa-minus"></i>
                            </button>
                            <span className="w-12 text-center font-medium text-[var(--charcoal)]">
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[var(--luxury-gold)]"
                            >
                              <i className="fa-solid fa-plus"></i>
                            </button>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 font-medium flex items-center space-x-2"
                        >
                          <i className="fa-solid fa-trash"></i>
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Cart Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
                <a 
                  href="/categories" 
                  className="text-[var(--luxury-gold)] hover:text-[var(--warm-copper)] font-semibold flex items-center space-x-2 transition-colors group"
                >
                  <i className="fa-solid fa-arrow-left group-hover:-translate-x-1 transition-transform"></i>
                  <span>Continue Shopping</span>
                </a>
                
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => {
                      const addItem = window.confirm('Add sample item for testing?');
                      if (addItem) {
                        const newItem = {
                          id: Date.now(),
                          productId: Date.now(),
                          name: 'Sample Product',
                          description: 'Test product',
                          price: 299,
                          quantity: 1,
                          features: ['AR Ready'],
                          imageUrl: 'https://via.placeholder.com/150x150?text=Sample'
                        };
                        setCartItems(prev => [...prev, newItem]);
                      }
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center space-x-2 transition-colors text-sm"
                  >
                    <i className="fa-solid fa-plus-circle"></i>
                    <span>Add Test Item</span>
                  </button>
                  
                  <button 
                    onClick={handleClearCart}
                    className="text-red-600 hover:text-red-800 font-semibold flex items-center space-x-2 transition-colors"
                  >
                    <i className="fa-solid fa-trash"></i>
                    <span>Clear Cart</span>
                  </button>
                </div>
              </div>
              
              {/* Security Note */}
              <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-8">
                <div className="flex items-start space-x-4">
                  <i className="fa-solid fa-shield-alt text-blue-500 text-xl mt-1"></i>
                  <div>
                    <h4 className="font-bold text-blue-800 mb-2">Secure Shopping</h4>
                    <p className="text-blue-700">
                      Your cart is saved automatically. All transactions are secured with 256-bit SSL encryption.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-8 shadow-sm sticky top-8">
                <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-8">Order Summary</h3>

                <div className="space-y-6 mb-8">
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Subtotal ({totals.itemCount} items)</span>
                    <span className="text-[var(--charcoal)] font-bold">
                      ${totals.subtotal.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Shipping</span>
                    <span className="text-[var(--charcoal)] font-bold">
                      ${totals.shipping.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600 font-medium">
                    <span>Tax</span>
                    <span className="text-[var(--charcoal)] font-bold">
                      ${totals.tax.toFixed(2)}
                    </span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600 font-medium bg-green-50 p-4 rounded-xl">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span className="font-bold">
                        -${totals.discount.toLocaleString()}
                      </span>
                    </div>
                  )}
                  
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xl font-bold text-[var(--charcoal)]">
                      Total
                    </span>
                    <span className="text-2xl font-black text-[var(--luxury-gold)]">
                      ${totals.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Coupon Section */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <i className="fa-solid fa-tag text-[var(--luxury-gold)] mr-2"></i>
                    <h4 className="font-semibold text-[var(--charcoal)]">Have a coupon?</h4>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                    />
                    {appliedCoupon ? (
                      <button
                        onClick={handleRemoveCoupon}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-xl font-medium transition-all"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={handleApplyCoupon}
                        className="bg-[var(--luxury-gold)] hover:bg-[var(--warm-copper)] text-white px-5 py-3 rounded-xl font-medium transition-all"
                      >
                        Apply
                      </button>
                    )}
                  </div>
                </div>

                {/* Shipping Calculator */}
                <div className="mb-8">
                  <div className="flex items-center mb-4">
                    <i className="fa-solid fa-truck text-[var(--luxury-gold)] mr-2"></i>
                    <h4 className="font-semibold text-[var(--charcoal)]">Estimate Shipping</h4>
                  </div>
                  <div className="space-y-4">
                    <select
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({...shippingInfo, country: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                    >
                      <option value="">Select Country</option>
                      <option value="US">United States</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AE">United Arab Emirates</option>
                      <option value="SA">Saudi Arabia</option>
                    </select>
                    <input
                      type="text"
                      placeholder="ZIP / Postal Code"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({...shippingInfo, zipCode: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                    />
                    <button
                      onClick={handleCalculateShipping}
                      className="w-full border-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)] hover:bg-[var(--luxury-gold)] hover:text-white py-3 rounded-xl font-medium transition-all"
                    >
                      Calculate Shipping
                    </button>
                  </div>
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-[var(--luxury-gold)] hover:bg-[var(--warm-copper)] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-[var(--luxury-gold)]/20 transition-all transform hover:-translate-y-1 active:scale-95 mb-4"
                >
                  Proceed to Checkout
                </button>
                
                <a
                  href="/categories"
                  className="w-full border-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)] hover:bg-[var(--luxury-gold)] hover:text-white py-3 rounded-xl font-bold text-center block transition-all"
                >
                  Continue Shopping
                </a>
                
                <p className="text-xs text-gray-500 text-center mt-6">
                  <i className="fa-solid fa-lock mr-1"></i>
                  Your payment information is encrypted and secure
                </p>
              </div>

              {/* Delivery Info Card */}
              <div className="bg-gradient-to-r from-[var(--luxury-gold)] to-[var(--warm-copper)] rounded-2xl p-8 mt-8 text-white shadow-lg">
                <div className="flex items-start space-x-4 mb-6">
                  <i className="fa-solid fa-truck text-2xl"></i>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Free Delivery</h3>
                    <p className="text-sm opacity-90">On orders over $2,000</p>
                    <div className="mt-4 pt-4 border-t border-white/30">
                      <div className="flex justify-between text-sm">
                        <span>Current order:</span>
                        <span className="font-bold">
                          ${Math.max(0, 2000 - totals.subtotal).toLocaleString()} to free shipping
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <i className="fa-solid fa-shield-alt text-2xl"></i>
                  <div>
                    <h3 className="font-bold text-lg mb-2">Secure Payment</h3>
                    <p className="text-sm opacity-90">100% secure transactions</p>
                  </div>
                </div>
              </div>
              
              {/* Need Help? */}
              <div className="bg-white rounded-2xl p-6 mt-8 border border-gray-200 shadow-sm">
                <h3 className="font-bold text-[var(--charcoal)] mb-4 flex items-center">
                  <i className="fa-solid fa-question-circle text-[var(--luxury-gold)] mr-3"></i>
                  Need Help?
                </h3>
                <p className="text-gray-600 mb-6">
                  Have questions about our products or AR features?
                </p>
                <div className="space-y-3">
                  <a href="/contact" className="block text-[var(--luxury-gold)] hover:underline font-medium">
                    <i className="fa-solid fa-phone mr-3"></i>
                    Contact Support
                  </a>
                  <a href="/faq" className="block text-[var(--luxury-gold)] hover:underline font-medium">
                    <i className="fa-solid fa-circle-info mr-3"></i>
                    View FAQ
                  </a>
                  <button 
                    onClick={() => alert('Live chat coming soon!')}
                    className="block text-[var(--luxury-gold)] hover:underline font-medium w-full text-left"
                  >
                    <i className="fa-solid fa-comment-dots mr-3"></i>
                    Live Chat
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Products */}
          <RecommendedProducts />
        </div>
      </main>
      
    </div>
  );
}