'use client';

import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSearch, 
  faHeart, 
  faShoppingCart, 
  faUser, 
  faMapMarkerAlt, 
  faCreditCard, 
  faBox, 
  faBell, 
  faCog, 
  faEdit, 
  faEllipsisV, 
  faStar, 
  faPaperPlane,
  faChevronRight,
  faHome,
  faEnvelope,
  faPhone,
  faCalendar,
  faCheckCircle,
  faTruck,
  faShippingFast
} from '@fortawesome/free-solid-svg-icons';
import { 
  faHeart as faHeartRegular, 
  faUser as faUserRegular 
} from '@fortawesome/free-regular-svg-icons';
import { 
  faFacebook, 
  faInstagram, 
  faTwitter,
  faCcVisa,
  faCcMastercard
} from '@fortawesome/free-brands-svg-icons';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5186';

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

export default function MyAccountPage() {
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthday: '',
    profileImage: '',
    memberStatus: 'Gold',
    totalOrders: 0,
    totalSpent: 0,
    wishlistItems: 0
  });

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: 'Home Address',
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      isDefault: true,
      type: 'home'
    },
    {
      id: 2,
      title: 'Office Address',
      address: '456 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      country: 'United States',
      isDefault: false,
      type: 'work'
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      type: 'visa',
      lastFour: '4532',
      expiry: '12/25',
      isDefault: true
    },
    {
      id: 2,
      type: 'mastercard',
      lastFour: '8901',
      expiry: '08/26',
      isDefault: false
    }
  ]);

  const [recentOrders, setRecentOrders] = useState([
    {
      id: 'LF-2024-0089',
      items: 'Milano Luxury Sofa + Coffee Table Set',
      date: 'Dec 5, 2024',
      expectedDelivery: 'Dec 18, 2024',
      status: 'in-transit',
      statusText: 'In Transit',
      amount: 3298.00,
      progress: 75
    },
    {
      id: 'LF-2024-0076',
      items: 'Executive Office Chair',
      date: 'Nov 28, 2024',
      deliveredDate: 'Dec 3, 2024',
      status: 'delivered',
      statusText: 'Delivered',
      amount: 899.00
    },
    {
      id: 'LF-2024-0065',
      items: 'Walnut Dining Table + 4 Chairs',
      date: 'Nov 15, 2024',
      deliveredDate: 'Nov 22, 2024',
      status: 'delivered',
      statusText: 'Delivered',
      amount: 2299.00
    }
  ]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');

  // جلب بيانات المستخدم من الـ API
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        
        const response = await axios.get(`${API_BASE_URL}/api/Auth/profile`, {
          headers: getAuthHeaders()
        });

        if (response.data && response.data.success) {
          const user = response.data.data;
          setUserData({
            firstName: user.firstName || 'Sarah',
            lastName: user.lastName || 'Johnson',
            email: user.email || 'sarah.johnson@email.com',
            phone: user.phone || '+1 (555) 123-4567',
            birthday: user.birthday || 'March 15, 1990',
            profileImage: user.profileImage || 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg',
            memberStatus: user.memberStatus || 'Gold',
            totalOrders: user.totalOrders || 12,
            totalSpent: user.totalSpent || 8247,
            wishlistItems: user.wishlistItems || 5
          });
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load profile data. Using demo data instead.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // معالجة تحديث المعلومات الشخصية
  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(`${API_BASE_URL}/api/Auth/profile`, userData, {
        headers: getAuthHeaders()
      });

      if (response.data.success) {
        alert('Profile updated successfully!');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  // إضافة عنوان جديد
  const handleAddAddress = () => {
    const newAddress = {
      id: addresses.length + 1,
      title: 'New Address',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      isDefault: false,
      type: 'other'
    };
    setAddresses([...addresses, newAddress]);
  };

  // إضافة بطاقة دفع جديدة
  const handleAddPaymentMethod = () => {
    const newPaymentMethod = {
      id: paymentMethods.length + 1,
      type: 'visa',
      lastFour: '0000',
      expiry: 'MM/YY',
      isDefault: false
    };
    setPaymentMethods([...paymentMethods, newPaymentMethod]);
  };

  // معالجة تغيير العنوان الافتراضي
  const handleSetDefaultAddress = (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId
    }));
    setAddresses(updatedAddresses);
  };

  // معالجة تغيير طريقة الدفع الافتراضية
  const handleSetDefaultPayment = (paymentId) => {
    const updatedPayments = paymentMethods.map(payment => ({
      ...payment,
      isDefault: payment.id === paymentId
    }));
    setPaymentMethods(updatedPayments);
  };

  // حساب الإحصائيات
  const calculateStats = () => {
    return {
      totalOrders: recentOrders.length,
      totalSpent: recentOrders.reduce((sum, order) => sum + order.amount, 0),
      wishlistItems: userData.wishlistItems,
      memberStatus: userData.memberStatus
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--soft-gray)]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="mb-8">
            <nav className="text-sm text-gray-500 mb-4">
              <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
            </nav>
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6 h-96 animate-pulse">
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                  </div>
                </div>
                <div className="space-y-4">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="h-10 bg-gray-300 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-3 space-y-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-sm p-6 h-64 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--soft-gray)]">
      
      <main className="py-8">
        <div className="max-w-7xl mx-auto px-6">
          {error && (
            <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-center">
                <FontAwesomeIcon icon={faCheckCircle} className="text-yellow-600 mr-3" />
                <span className="text-yellow-700">{error}</span>
              </div>
            </div>
          )}

          <div className="mb-8">
            <nav className="text-sm text-gray-500 mb-4">
              <a href="/" className="hover:text-[var(--luxury-gold)]">Home</a> 
              <span className="mx-2">/</span>
              <span className="text-[var(--charcoal)] font-medium">My Account</span>
            </nav>
            <h1 className="text-3xl font-bold text-[var(--charcoal)]">My Account</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <aside className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-100">
                  <img 
                    src={userData.profileImage} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-[var(--luxury-gold)]"
                  />
                  <div>
                    <h3 className="font-semibold text-[var(--charcoal)]">
                      {userData.firstName} {userData.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">Premium Member</p>
                    <div className="flex items-center mt-1">
                      <FontAwesomeIcon icon={faStar} className="text-[var(--luxury-gold)] text-xs" />
                      <span className="text-xs text-gray-500 ml-1">{userData.memberStatus} Status</span>
                    </div>
                  </div>
                </div>

                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeTab === 'personal' 
                        ? 'bg-[var(--luxury-gold)] bg-opacity-10 text-[var(--luxury-gold)] font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faUser} className="w-5" />
                    <span>Personal Information</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeTab === 'addresses'
                        ? 'bg-[var(--luxury-gold)] bg-opacity-10 text-[var(--luxury-gold)] font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faMapMarkerAlt} className="w-5" />
                    <span>Addresses</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('payment')}
                    className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeTab === 'payment'
                        ? 'bg-[var(--luxury-gold)] bg-opacity-10 text-[var(--luxury-gold)] font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faCreditCard} className="w-5" />
                    <span>Payment Methods</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeTab === 'orders'
                        ? 'bg-[var(--luxury-gold)] bg-opacity-10 text-[var(--luxury-gold)] font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faBox} className="w-5" />
                    <span>Order History</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('wishlist')}
                    className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeTab === 'wishlist'
                        ? 'bg-[var(--luxury-gold)] bg-opacity-10 text-[var(--luxury-gold)] font-medium' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <FontAwesomeIcon icon={faHeartRegular} className="w-5" />
                    <span>Wishlist ({userData.wishlistItems})</span>
                  </button>
                </nav>
              </div>
            </aside>

            <div className="lg:col-span-3">
              {activeTab === 'personal' && (
                <>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-[var(--charcoal)]">Personal Information</h2>
                        <button 
                          onClick={handleUpdateProfile}
                          className="text-[var(--luxury-gold)] hover:text-[var(--warm-copper)] transition-colors"
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                      </div>
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="text-sm font-medium text-gray-500 block mb-2">First Name</label>
                            <input
                              type="text"
                              value={userData.firstName}
                              onChange={(e) => setUserData({...userData, firstName: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-gray-500 block mb-2">Last Name</label>
                            <input
                              type="text"
                              value={userData.lastName}
                              onChange={(e) => setUserData({...userData, lastName: e.target.value})}
                              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 block mb-2">Email</label>
                          <input
                            type="email"
                            value={userData.email}
                            onChange={(e) => setUserData({...userData, email: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 block mb-2">Phone</label>
                          <input
                            type="tel"
                            value={userData.phone}
                            onChange={(e) => setUserData({...userData, phone: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-500 block mb-2">Birthday</label>
                          <input
                            type="text"
                            value={userData.birthday}
                            onChange={(e) => setUserData({...userData, birthday: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h2 className="text-xl font-semibold text-[var(--charcoal)] mb-6">Account Overview</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-[var(--soft-gray)] rounded-lg">
                          <div className="text-2xl font-bold text-[var(--luxury-gold)]">{stats.totalOrders}</div>
                          <div className="text-sm text-gray-600">Total Orders</div>
                        </div>
                        <div className="text-center p-4 bg-[var(--soft-gray)] rounded-lg">
                          <div className="text-2xl font-bold text-[var(--luxury-gold)]">
                            ${stats.totalSpent.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Total Spent</div>
                        </div>
                        <div className="text-center p-4 bg-[var(--soft-gray)] rounded-lg">
                          <div className="text-2xl font-bold text-[var(--luxury-gold)]">{stats.wishlistItems}</div>
                          <div className="text-sm text-gray-600">Wishlist Items</div>
                        </div>
                        <div className="text-center p-4 bg-[var(--soft-gray)] rounded-lg">
                          <div className="text-2xl font-bold text-[var(--luxury-gold)]">{stats.memberStatus}</div>
                          <div className="text-sm text-gray-600">Member Status</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'addresses' && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[var(--charcoal)]">Addresses</h2>
                    <button 
                      onClick={handleAddAddress}
                      className="bg-[var(--luxury-gold)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--warm-copper)] transition-colors"
                    >
                      Add New Address
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <button
                            onClick={() => handleSetDefaultAddress(address.id)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              address.isDefault
                                ? 'bg-[var(--luxury-gold)] text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {address.isDefault ? 'Default' : 'Set as Default'}
                          </button>
                          <button className="text-gray-400 hover:text-[var(--charcoal)]">
                            <FontAwesomeIcon icon={faEllipsisV} />
                          </button>
                        </div>
                        <h4 className="font-medium text-[var(--charcoal)] mb-2">{address.title}</h4>
                        <p className="text-gray-600 text-sm">
                          {address.address}<br/>
                          {address.city}, {address.state} {address.zipCode}<br/>
                          {address.country}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'payment' && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[var(--charcoal)]">Payment Methods</h2>
                    <button 
                      onClick={handleAddPaymentMethod}
                      className="bg-[var(--luxury-gold)] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[var(--warm-copper)] transition-colors"
                    >
                      Add New Card
                    </button>
                  </div>
                  <div className="space-y-4">
                    {paymentMethods.map((payment) => (
                      <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-4">
                            {payment.type === 'visa' ? (
                              <div className="w-12 h-8 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                VISA
                              </div>
                            ) : (
                              <div className="w-12 h-8 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                                MC
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-[var(--charcoal)]">
                                •••• •••• •••• {payment.lastFour}
                              </p>
                              <p className="text-sm text-gray-500">Expires {payment.expiry}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleSetDefaultPayment(payment.id)}
                              className={`px-3 py-1 rounded text-xs font-medium ${
                                payment.isDefault
                                  ? 'bg-[var(--luxury-gold)] text-white'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                            >
                              {payment.isDefault ? 'Default' : 'Set Default'}
                            </button>
                            <button className="text-gray-400 hover:text-[var(--charcoal)]">
                              <FontAwesomeIcon icon={faEllipsisV} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[var(--charcoal)]">Recent Orders</h2>
                    <a href="/orders" className="text-[var(--luxury-gold)] hover:text-[var(--warm-copper)] font-medium">
                      View All Orders
                    </a>
                  </div>

                  <div className="space-y-6">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-[var(--charcoal)]">{order.id}</h4>
                            <p className="text-sm text-gray-600">{order.items}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            order.status === 'delivered' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.statusText}
                          </span>
                        </div>
                        
                        {order.status === 'in-transit' && (
                          <div className="mb-4">
                            <div className="flex justify-between items-center text-sm text-gray-600 mb-2">
                              <span>Ordered: {order.date}</span>
                              <span>Expected: {order.expectedDelivery}</span>
                            </div>
                            <div className="relative h-2 bg-gray-200 rounded-full">
                              <div 
                                className="absolute top-0 left-0 h-full bg-[var(--luxury-gold)] rounded-full"
                                style={{ width: `${order.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                              <span className="text-xs text-gray-500">Order Placed</span>
                              <span className="text-xs text-gray-500">In Production</span>
                              <span className="text-xs text-gray-500">Shipped</span>
                              <span className="text-xs text-gray-500">Delivered</span>
                            </div>
                          </div>
                        )}

                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faCalendar} className="mr-2" />
                            <span>
                              {order.status === 'delivered' 
                                ? `Delivered: ${order.deliveredDate}`
                                : `Ordered: ${order.date}`
                              }
                            </span>
                          </div>
                          <div className="font-semibold text-[var(--charcoal)]">
                            ${order.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'wishlist' && (
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-[var(--charcoal)]">My Wishlist</h2>
                    <span className="text-gray-600">{userData.wishlistItems} items</span>
                  </div>
                  <div className="text-center py-12">
                    <FontAwesomeIcon icon={faHeartRegular} className="text-4xl text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-[var(--charcoal)] mb-2">Your wishlist is empty</h3>
                    <p className="text-gray-600 mb-6">Save items you love to your wishlist.</p>
                    <a 
                      href="/products"
                      className="inline-block bg-[var(--luxury-gold)] text-white px-6 py-3 rounded-lg font-medium hover:bg-[var(--warm-copper)] transition-colors"
                    >
                      Browse Products
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

function Header({ userData }) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <div className="text-2xl font-bold text-[var(--charcoal)]">
              Luxe<span className="text-[var(--luxury-gold)]">Furniture</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] transition-colors font-medium">
                Home
              </a>
              <a href="/categories" className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] transition-colors font-medium">
                Categories
              </a>
              <a href="/new-arrivals" className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] transition-colors font-medium">
                New Arrivals
              </a>
              <a href="/inspiration" className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] transition-colors font-medium">
                Inspiration
              </a>
              <a href="/about" className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] transition-colors font-medium">
                About
              </a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative hidden lg:block">
              <input 
                type="text" 
                placeholder="Search furniture..." 
                className="w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent"
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-3 text-gray-400" 
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] transition-colors">
                <FontAwesomeIcon icon={faHeartRegular} className="text-xl" />
              </button>
              <a 
                href="/cart" 
                className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] transition-colors relative"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-[var(--luxury-gold)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </a>
              <a 
                href="/my-account" 
                className="text-[var(--luxury-gold)] transition-colors"
              >
                <FontAwesomeIcon icon={faUser} className="text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-[var(--charcoal)] text-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="text-2xl font-bold mb-4">
              Luxe<span className="text-[var(--luxury-gold)]">Furniture</span>
            </div>
            <p className="text-gray-300 mb-4">
              Premium furniture with cutting-edge AR technology for the modern home.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-[var(--luxury-gold)] transition-colors">
                <FontAwesomeIcon icon={faFacebook} className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[var(--luxury-gold)] transition-colors">
                <FontAwesomeIcon icon={faInstagram} className="text-xl" />
              </a>
              <a href="#" className="text-gray-300 hover:text-[var(--luxury-gold)] transition-colors">
                <FontAwesomeIcon icon={faTwitter} className="text-xl" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[var(--luxury-gold)] transition-colors">Living Room</a></li>
              <li><a href="#" className="hover:text-[var(--luxury-gold)] transition-colors">Bedroom</a></li>
              <li><a href="#" className="hover:text-[var(--luxury-gold)] transition-colors">Dining Room</a></li>
              <li><a href="#" className="hover:text-[var(--luxury-gold)] transition-colors">Office</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-[var(--luxury-gold)] transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-[var(--luxury-gold)] transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-[var(--luxury-gold)] transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-[var(--luxury-gold)] transition-colors">Returns</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-300 mb-4">Subscribe for exclusive offers and AR updates</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-l-xl focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]"
              />
              <button className="bg-[var(--luxury-gold)] hover:bg-[var(--warm-copper)] px-6 py-3 rounded-r-xl transition-colors">
                <FontAwesomeIcon icon={faPaperPlane} />
              </button>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 text-center text-gray-300">
          <p>&copy; 2024 LuxeFurniture. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}