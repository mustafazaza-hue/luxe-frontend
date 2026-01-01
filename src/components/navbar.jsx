"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHeart, 
  faShoppingCart, 
  faUser, 
  faSearch,
  faChevronDown,
  faSignOutAlt,
  faCog
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const userDropdownRef = useRef(null);

  // التحقق من حالة المصادقة عند التحميل وعند تغيير المسار
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const user = localStorage.getItem("user");
        
        setIsAuthenticated(!!token);
        
        if (user) {
          try {
            setUserData(JSON.parse(user));
          } catch (error) {
            console.error("Error parsing user data:", error);
          }
        }
      }
      setIsLoading(false);
    };

    checkAuth();
    
    // الاستماع لتغييرات localStorage من علامات تبويب أخرى
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // إغلاق dropdown عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    try {
      // مسح البيانات من localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // تحديث الحالة المحلية
      setIsAuthenticated(false);
      setUserData(null);
      
      // إظهار رسالة النجاح
      toast.success("تم تسجيل الخروج بنجاح");
      
      // التوجيه إلى الصفحة الرئيسية
      router.push("/");
      
      // إغلاق dropdown
      setShowUserDropdown(false);
      
      // إعادة تحميل الصفحة لتحديث الحالة
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("حدث خطأ أثناء تسجيل الخروج");
    }
  };

  const handleLoginClick = () => {
    setShowUserDropdown(false);
    router.push("/login");
  };

  const handleSignupClick = () => {
    setShowUserDropdown(false);
    router.push("/signup");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-[var(--charcoal)]">
              Luxe<span className="text-[var(--luxury-gold)]">Furniture</span>
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link 
                href="/" 
                className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] font-medium transition-colors"
              >
                Home
              </Link>
              <Link 
                href="/categories" 
                className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] font-medium transition-colors"
              >
                Categories
              </Link>
              <Link 
                href="/search" 
                className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] font-medium transition-colors"
              >
                Search
              </Link>
              <Link 
                href="/inspiration" 
                className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] font-medium transition-colors"
              >
                Inspiration
              </Link>
              <Link 
                href="/about" 
                className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] font-medium transition-colors"
              >
                About
              </Link>
              {isAuthenticated && (
                <Link 
                  href="/dashboard" 
                  className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] font-medium transition-colors"
                >
                  Dashboard
                </Link>
              )}
            </nav>
          </div>

          <div className="flex items-center space-x-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:block relative">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search furniture..." 
                  className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent"
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-3 text-gray-400" 
                />
              </div>
            </form>

            {/* Mobile Search Button */}
            <Link 
              href="/search"
              className="lg:hidden text-[var(--charcoal)] hover:text-[var(--luxury-gold)] transition-colors"
            >
              <FontAwesomeIcon icon={faSearch} className="text-xl" />
            </Link>

            {/* Icons */}
            <div className="flex items-center space-x-4">
              <Link 
                href="/wishlist" 
                className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] transition-colors"
              >
                <FontAwesomeIcon icon={faHeart} className="text-xl" />
              </Link>
              <Link 
                href="/cart" 
                className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] transition-colors relative"
              >
                <FontAwesomeIcon icon={faShoppingCart} className="text-xl" />
                <span className="absolute -top-2 -right-2 bg-[var(--luxury-gold)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Link>

              {/* User Dropdown */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="text-[var(--charcoal)] hover:text-[var(--luxury-gold)] transition-colors flex items-center space-x-1"
                  disabled={isLoading}
                >
                  <FontAwesomeIcon icon={faUser} className="text-xl" />
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`text-xs transition-transform ${showUserDropdown ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown Menu */}
                {showUserDropdown && !isLoading && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    {isAuthenticated ? (
                      <>
                        {/* User Info */}
                        {userData && (
                          <div className="px-4 py-3 border-b border-gray-100">
                            <p className="font-medium text-[var(--charcoal)] truncate">
                              {userData.name || userData.email}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {userData.email}
                            </p>
                          </div>
                        )}
                        
                        <Link
                          href="/account"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center px-4 py-3 text-[var(--charcoal)] hover:bg-[var(--soft-gray)] transition-colors"
                        >
                          <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-400 w-4" />
                          <span>My Account</span>
                        </Link>
                        <Link
                          href="/dashboard"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center px-4 py-3 text-[var(--charcoal)] hover:bg-[var(--soft-gray)] transition-colors"
                        >
                          <FontAwesomeIcon icon={faCog} className="mr-3 text-gray-400 w-4" />
                          <span>Dashboard</span>
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center px-4 py-3 text-[var(--charcoal)] hover:bg-[var(--soft-gray)] transition-colors"
                        >
                          <FontAwesomeIcon icon={faShoppingCart} className="mr-3 text-gray-400 w-4" />
                          <span>My Orders</span>
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setShowUserDropdown(false)}
                          className="flex items-center px-4 py-3 text-[var(--charcoal)] hover:bg-[var(--soft-gray)] transition-colors"
                        >
                          <FontAwesomeIcon icon={faHeart} className="mr-3 text-gray-400 w-4" />
                          <span>Wishlist</span>
                        </Link>
                        
                        <div className="border-t border-gray-200 my-1"></div>
                        
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <FontAwesomeIcon icon={faSignOutAlt} className="mr-3 w-4" />
                          <span>Logout</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-[var(--charcoal)] font-medium">Welcome</p>
                          <p className="text-sm text-gray-500">Sign in to your account</p>
                        </div>
                        
                        <button
                          onClick={handleLoginClick}
                          className="flex items-center w-full px-4 py-3 text-left text-[var(--charcoal)] hover:bg-[var(--soft-gray)] transition-colors"
                        >
                          <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-400 w-4" />
                          <span>Login</span>
                        </button>
                        
                        <div className="border-t border-gray-200 my-1"></div>
                        
                        <p className="px-4 py-2 text-sm text-gray-500">New customer?</p>
                        
                        <button
                          onClick={handleSignupClick}
                          className="flex items-center w-full px-4 py-3 text-left text-[var(--charcoal)] hover:bg-[var(--soft-gray)] transition-colors"
                        >
                          <FontAwesomeIcon icon={faUser} className="mr-3 text-gray-400 w-4" />
                          <span>Create Account</span>
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* Loading State */}
                {isLoading && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                    <div className="px-4 py-3 text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[var(--luxury-gold)] mx-auto"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex space-x-1 overflow-x-auto scrollbar-hide flex-1">
              <Link
                href="/"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm bg-gray-100 text-[var(--charcoal)] hover:bg-gray-200"
              >
                <span className="font-medium">Home</span>
              </Link>
              <Link
                href="/categories"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm bg-gray-100 text-[var(--charcoal)] hover:bg-gray-200"
              >
                <span className="font-medium">Categories</span>
              </Link>
              <Link
                href="/search"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm bg-gray-100 text-[var(--charcoal)] hover:bg-gray-200"
              >
                <span className="font-medium">Search</span>
              </Link>
              <Link
                href="/inspiration"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm bg-gray-100 text-[var(--charcoal)] hover:bg-gray-200"
              >
                <span className="font-medium">Inspiration</span>
              </Link>
              <Link
                href="/about"
                className="flex items-center space-x-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm bg-gray-100 text-[var(--charcoal)] hover:bg-gray-200"
              >
                <span className="font-medium">About</span>
              </Link>
              {isAuthenticated && (
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg whitespace-nowrap transition-all text-sm bg-gray-100 text-[var(--charcoal)] hover:bg-gray-200"
                >
                  <span className="font-medium">Dashboard</span>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}