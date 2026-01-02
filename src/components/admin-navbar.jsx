'use client';

import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBell,
  faChevronDown,
  faTachometerAlt,
  faBox,
  faShoppingCart,
  faUsers,
  faCube,
  faChartBar,
  faPlus,
  faUser,
  faCog,
  faSignOutAlt,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminNavbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [notificationCount] = useState(5);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const profileDropdownRef = useRef(null);

  // تحديد التب النشط بناءً على المسار الحالي
  useEffect(() => {
    if (pathname.includes('/dashboard')) {
      setActiveTab('dashboard');
    } else if (pathname.includes('/products') || pathname.includes('/addproduct')) {
      setActiveTab('products');
    } else if (pathname.includes('/orders')) {
      setActiveTab('orders');
    } else if (pathname.includes('/customers')) {
      setActiveTab('customers');
    } else if (pathname.includes('/ar-settings')) {
      setActiveTab('ar-settings');
    } else if (pathname.includes('/analytics')) {
      setActiveTab('analytics');
    }
  }, [pathname]);

  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: faTachometerAlt, 
      href: '/dashboard',
      exact: true
    },
    { 
      id: 'products', 
      label: 'Products', 
      icon: faBox,
      href: '/addproduct' // ⭐ تغيير مباشر إلى addproduct
    },
    { 
      id: 'orders', 
      label: 'Orders', 
      icon: faShoppingCart, 
      href: '/orders',
      badge: 12
    },
    { 
      id: 'customers', 
      label: 'Customers', 
      icon: faUsers, 
      href: '/customers'
    },
    { 
      id: 'ar-settings', 
      label: 'AR Settings', 
      icon: faCube, 
      href: '/ar-settings'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: faChartBar, 
      href: '/analytics'
    }
  ];

  // إغلاق dropdown عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNavigation = (item) => {
    if (item.href) {
      setActiveTab(item.id);
      router.push(item.href);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    router.push('/admin/login');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo and Navigation */}
          <div className="flex items-center space-x-8">
            {/* Logo */}
            <Link 
              href="/dashboard" 
              className="flex items-center space-x-2"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-[var(--luxury-gold)] to-[var(--luxury-copper)] rounded-lg flex items-center justify-center">
                <FontAwesomeIcon icon={faHome} className="text-white text-lg" />
              </div>
              <div className="hidden md:block">
                <div className="text-xl font-bold text-[var(--charcoal)] leading-tight">
                  Luxe<span className="text-[var(--luxury-gold)]">Space</span>
                </div>
                <div className="text-xs text-gray-500 -mt-1">Admin Panel</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 font-medium transition-all rounded-lg relative ${
                    activeTab === item.id
                      ? 'text-[var(--luxury-gold)] bg-[var(--luxury-gold)]/10'
                      : 'text-[var(--charcoal)] hover:text-[var(--luxury-gold)] hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="text-sm" />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Section - Notifications, Profile */}
          <div className="flex items-center space-x-4">
            {/* Mobile Add Product Button */}
            <button
              onClick={() => {
                setActiveTab('products');
                router.push('/addproduct');
              }}
              className="md:hidden flex items-center justify-center w-10 h-10 bg-[var(--luxury-gold)] text-white rounded-lg hover:bg-[var(--luxury-copper)] transition-colors"
              title="Add Product"
            >
              <FontAwesomeIcon icon={faPlus} />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] transition-colors relative p-2">
                <FontAwesomeIcon icon={faBell} className="text-xl" />
                {notificationCount > 0 && (
                  <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>
            
            {/* User Profile */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-3 p-1 rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <div className="relative">
                  <img 
                    src="https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-3.jpg" 
                    alt="Admin" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-[var(--luxury-gold)] transition-colors"
                  />
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-sm font-semibold text-[var(--charcoal)]">John Admin</p>
                  <p className="text-xs text-gray-500">Administrator</p>
                </div>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`text-gray-400 transition-transform duration-200 ${showProfileDropdown ? 'rotate-180' : ''}`}
                />
              </button>
              
              {/* Profile Dropdown */}
              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 animate-fadeIn">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="font-semibold text-[var(--charcoal)]">John Admin</p>
                    <p className="text-sm text-gray-500">admin@luxespace.com</p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      href="/profile"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center px-4 py-3 text-[var(--charcoal)] hover:bg-[var(--soft-gray)] transition-colors"
                    >
                      <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-400" />
                      <span>My Profile</span>
                    </Link>
                    
                    <Link
                      href="/settings"
                      onClick={() => setShowProfileDropdown(false)}
                      className="flex items-center px-4 py-3 text-[var(--charcoal)] hover:bg-[var(--soft-gray)] transition-colors"
                    >
                      <FontAwesomeIcon icon={faCog} className="mr-3 text-gray-400" />
                      <span>Account Settings</span>
                    </Link>
                    
                    <div className="border-t border-gray-200 my-1"></div>
                    
                    <a
                    href='/adminlogin'
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} className="mr-3" />
                      <span>Logout</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide flex-1">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm ${
                    activeTab === item.id
                      ? 'bg-[var(--luxury-gold)] text-white'
                      : 'bg-gray-100 text-[var(--charcoal)] hover:bg-gray-200'
                  }`}
                >
                  <FontAwesomeIcon icon={item.icon} className="text-xs" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Add Product Button for Desktop */}
      <button
        onClick={() => {
          setActiveTab('products');
          router.push('/addproduct');
        }}
        className="hidden md:fixed md:flex md:items-center md:space-x-3 md:bg-gradient-to-r md:from-[var(--luxury-gold)] md:to-[var(--luxury-copper)] md:text-white md:px-6 md:py-4 md:rounded-full md:shadow-lg md:hover:shadow-xl md:hover:scale-105 md:transition-all md:duration-300 md:z-40 md:bottom-8 md:right-8"
        title="Add New Product"
      >
        <FontAwesomeIcon icon={faPlus} className="text-lg" />
        <span className="font-semibold">Add Product</span>
      </button>

      {/* Global Styles for Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </header>
  );
}