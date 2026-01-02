"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCouch,
  faUserShield,
  faKey,
  faEye,
  faEyeSlash,
  faMobileAlt,
  faChartLine,
  faCube,
  faUsers,
  faChartBar,
  faBoxes,
  faShoppingCart,
  faServer,
  faInfoCircle,
  faSignInAlt,
  faSpinner,
  faExclamationCircle,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import { authApi } from "@/api/auth"; // استيراد من الملف الصحيح

export default function AdminLogin() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactor, setTwoFactor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [requires2FA, setRequires2FA] = useState(false);
  const [formData, setFormData] = useState({
    email: "admin@luxury.com",
    password: "admin123",
    rememberDevice: false,
  });

  // التحقق إذا كان المستخدم مسجل دخول بالفعل
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== 'undefined') {
        try {
          // تحقق من localStorage أولاً
          let token = localStorage.getItem('token');
          let userType = localStorage.getItem('userType');
          
          // إذا لم يكن هناك توكن في localStorage، تحقق من sessionStorage
          if (!token) {
            token = sessionStorage.getItem('token');
            userType = sessionStorage.getItem('userType');
          }
          
          if (token && userType === 'admin') {
            router.push("/dashboard");
          }
        } catch (err) {
          console.log("Error checking auth:", err);
        }
      }
    };

    // تأخير لضمان تحميل window object
    const timer = setTimeout(checkAuth, 200);
    return () => clearTimeout(timer);
  }, [router]);

  const handlePasswordToggle = () => setShowPassword(!showPassword);

  const handleTwoFactorChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    if (value.length <= 6) {
      setTwoFactor(value);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      if (requires2FA && twoFactor) {
        // التحقق من 2FA
        await handle2FALogin();
      } else {
        // تسجيل الدخول العادي
        await handleRegularLogin();
      }
    } catch (error) {
      console.error("Login error:", error);
      handleLoginError(error);
    } finally {
      setLoading(false);
    }
  };

  // وظيفة مساعدة لمعالجة استجابة تسجيل الدخول
  const handleLoginResponse = (data) => {
    console.log("Processing login response:", data);
    
    // حالة 2FA - تدعم عدة تسميات مختلفة
    if (data.requires2fa === true || data.requiresTwoFactor === true || data.requires2FA === true) {
      setRequires2FA(true);
      setSuccess("تم إرسال رمز التحقق الثنائي إلى بريدك الإلكتروني");
      return '2FA_REQUIRED';
    }
    
    // حالة تسجيل الدخول الناجح مع توكن
    if (data.token || data.accessToken) {
      const token = data.token || data.accessToken;
      const userData = JSON.stringify(data.user || data);
      
      // حفظ البيانات في أماكن متعددة للتأمين
      try {
        localStorage.setItem("token", token);
        localStorage.setItem("user", userData);
        localStorage.setItem("userType", "admin");
        
        // حفظ في sessionStorage أيضاً
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", userData);
        sessionStorage.setItem("userType", "admin");
        
        // حفظ في متغير مؤقت أيضاً
        if (typeof window !== 'undefined') {
          window.__AUTH_TOKEN = token;
        }
      } catch (storageError) {
        console.log("Storage error:", storageError);
      }
      
      handleSuccessfulLogin(data);
      return 'SUCCESS';
    }
    
    // حالة تسجيل الدخول الناجح بدون توكن (تطوير/اختبار)
    if (data.email || data.id) {
      const token = data.token || `demo-${Date.now()}`;
      const userData = JSON.stringify(data);
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", userData);
      localStorage.setItem("userType", "admin");
      
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("user", userData);
      sessionStorage.setItem("userType", "admin");
      
      handleSuccessfulLogin(data);
      return 'SUCCESS_DEMO';
    }
    
    // حالة الرد الفارغ أو غير المعروف
    return 'UNKNOWN';
  };

  const handleRegularLogin = async () => {
    try {
      // استخدام authApi من الملف المنفصل
      const response = await authApi.adminLogin(formData.email, formData.password);
      console.log("Auth admin login response via authApi:", response);

      const result = handleLoginResponse(response);
      
      if (result === 'UNKNOWN') {
        // إذا لم يتم التعرف على الاستجابة، حاول مع AdminUsers
        console.log("Unknown response format, trying AdminUsers...");
        await tryAdminUsersLogin();
      }
    } catch (error) {
      console.error("Auth admin login error:", error);
      
      // إذا كان هناك خطأ 400 أو خطأ في الشبكة، حاول مع AdminUsers
      if (error.response?.status === 400 || error.message?.includes("Failed to fetch") || error.message?.includes("Network")) {
        console.log("Trying AdminUsers endpoint...");
        await tryAdminUsersLogin();
        return;
      }
      
      throw error;
    }
  };

  const tryAdminUsersLogin = async () => {
    try {
      const response = await authApi.adminUsersLogin(formData.email, formData.password);
      console.log("AdminUsers login response:", response);

      if (response.id || response.email) {
        // حفظ بيانات المستخدم
        const token = response.token || `demo-${Date.now()}`;
        const userData = JSON.stringify(response);
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", userData);
        localStorage.setItem("userType", "admin");
        
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", userData);
        sessionStorage.setItem("userType", "admin");
        
        handleSuccessfulLogin(response);
      } else {
        throw new Error("Invalid response from AdminUsers endpoint");
      }
    } catch (error) {
      console.error("AdminUsers login error:", error);
      throw new Error("فشل تسجيل الدخول. يرجى التحقق من بيانات الاعتماد");
    }
  };

  const handle2FALogin = async () => {
    try {
      const response = await authApi.verify2FA(formData.email, twoFactor);
      console.log("2FA verification response:", response);

      if (response.token) {
        const token = response.token;
        const userData = JSON.stringify(response.user || response);
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", userData);
        localStorage.setItem("userType", "admin");
        
        sessionStorage.setItem("token", token);
        sessionStorage.setItem("user", userData);
        sessionStorage.setItem("userType", "admin");
        
        handleSuccessfulLogin(response);
      } else {
        throw new Error("Invalid verification response");
      }
    } catch (error) {
      console.error("2FA login error:", error);
      throw error;
    }
  };

  const handleSuccessfulLogin = (data) => {
    setSuccess("تم تسجيل الدخول بنجاح! يتم توجيهك...");
    
    // تحديد التأخير بناءً على البيئة
    const isVercel = typeof window !== 'undefined' && 
                    (window.location.hostname.includes('vercel.app') || 
                     window.location.hostname.includes('.vercel'));
    
    const delay = isVercel ? 2500 : 1500;
    
    setTimeout(() => {
      // تحقق مرة أخرى قبل التوجيه
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      if (token) {
        // استخدم window.location.href للتأكد من التوجيه
        window.location.href = "/dashboard";
      } else {
        // إعادة المحاولة
        const newToken = data.token || data.accessToken || `demo-${Date.now()}`;
        localStorage.setItem("token", newToken);
        sessionStorage.setItem("token", newToken);
        window.location.href = "/dashboard";
      }
    }, delay);
  };

  const handleLoginError = (error) => {
    console.log("Login error details:", error);
    
    if (error.message?.includes("فشل تسجيل الدخول")) {
      setError(error.message);
    } else if (error.response?.status === 400) {
      setError("بيانات الاعتماد غير صحيحة. يرجى التحقق من البريد الإلكتروني وكلمة المرور");
    } else if (error.response?.status === 401) {
      setError("غير مصرح. يرجى التحقق من صلاحياتك");
    } else if (error.response?.status === 404) {
      setError("الخادم غير متوفر. الرجاء التحقق من اتصال الشبكة");
    } else if (error.response?.status === 429) {
      setError("لقد تجاوزت عدد محاولات تسجيل الدخول. يرجى المحاولة بعد دقيقة");
    } else if (error.message?.includes("Failed to fetch") || error.message?.includes("Network Error")) {
      setError("تعذر الاتصال بالخادم. الرجاء التحقق من اتصال الإنترنت وتأكد من تشغيل الخادم");
    } else if (error.message?.includes("Invalid response from server")) {
      setError("استجابة غير متوقعة من الخادم. يرجى المحاولة مرة أخرى");
    } else if (error.message) {
      setError(error.message);
    } else {
      setError("حدث خطأ في الخادم. يرجى المحاولة مرة أخرى لاحقاً");
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("الرجاء إدخال البريد الإلكتروني أولاً");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      // يمكنك إضافة دالة forgotPassword في authApi.js
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5186"}/api/Auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset link");
      }

      setSuccess("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني");
    } catch (error) {
      setError("فشل إرسال رابط إعادة التعيين. يرجى المحاولة مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setFormData({
      email: "admin@luxury.com",
      password: "admin123",
      rememberDevice: true,
    });
    setError("");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[var(--warm-beige)] via-white to-[var(--soft-gray)]">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--charcoal)] via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 bg-black bg-opacity-30"></div>

        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--luxury-gold)] rounded-3xl mb-6">
              <FontAwesomeIcon icon={faCouch} className="text-white text-3xl" />
            </div>
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Admin <br />
              <span className="text-[var(--luxury-gold)]">Dashboard</span>
              <br />
              Control Center
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Manage your luxury furniture store with powerful analytics, AR
              content management, and comprehensive business insights.
            </p>
          </div>

          <div className="space-y-6 mb-8">
            {/* Analytics */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-[var(--luxury-gold)] bg-opacity-20 border border-[var(--luxury-gold)] rounded-2xl flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="text-[var(--luxury-gold)] text-xl"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Advanced Analytics</h3>
                <p className="text-gray-300">
                  Real-time sales & performance tracking
                </p>
              </div>
            </div>

            {/* AR Content */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-[var(--luxury-copper)] bg-opacity-20 border border-[var(--luxury-copper)] rounded-2xl flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faCube}
                  className="text-[var(--luxury-copper)] text-xl"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AR Content Management</h3>
                <p className="text-gray-300">
                  Upload & manage 3D models seamlessly
                </p>
              </div>
            </div>

            {/* Customer Insights */}
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-green-500 bg-opacity-20 border border-green-500 rounded-2xl flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUsers}
                  className="text-green-500 text-xl"
                />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Customer Insights</h3>
                <p className="text-gray-300">
                  Comprehensive user behavior analysis
                </p>
              </div>
            </div>
          </div>

          {/* Secure Access */}
          <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 border border-white border-opacity-20">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[var(--luxury-gold)] rounded-full flex items-center justify-center">
                <FontAwesomeIcon
                  icon={faUserShield}
                  className="text-white text-lg"
                />
              </div>
              <div>
                <h4 className="font-semibold">Secure Access</h4>
                <p className="text-gray-300 text-sm">
                  Multi-factor authentication & role-based permissions
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 right-0 w-full h-80 overflow-hidden opacity-20">
          <img
            className="w-full h-full object-cover"
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/d6cd5db4a5-de30b821cbdd297f606a.png"
            alt="luxury furniture"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[var(--luxury-gold)] to-[var(--luxury-copper)] rounded-3xl mb-6 shadow-xl">
              <FontAwesomeIcon icon={faCouch} className="text-white text-3xl" />
            </div>
            <h2 className="text-3xl font-bold text-[var(--charcoal)] mb-2">
              LuxeSpace Admin
            </h2>
            <p className="text-gray-600">Premium Furniture Management Portal</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-600 font-medium">
                System Online
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-2xl">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  className="text-red-500"
                />
                <div>
                  <p className="text-red-800 font-medium text-sm">Error</p>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-2xl">
              <div className="flex items-center space-x-3">
                <FontAwesomeIcon
                  icon={faCheckCircle}
                  className="text-green-500"
                />
                <div>
                  <p className="text-green-800 font-medium text-sm">Success</p>
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              </div>
            </div>
          )}

          {/* Login Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-2">
                {requires2FA ? "Two-Factor Authentication" : "Administrator Access"}
              </h3>
              <p className="text-gray-600">
                {requires2FA ? "Enter your verification code" : "Sign in to manage your store"}
              </p>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              {!requires2FA ? (
                <>
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--charcoal)]">
                      Admin Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FontAwesomeIcon
                          icon={faUserShield}
                          className="text-gray-400"
                        />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent transition-all duration-200 bg-gray-50"
                        placeholder="admin@luxespace.com"
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-[var(--charcoal)]">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FontAwesomeIcon icon={faKey} className="text-gray-400" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent transition-all duration-200 bg-gray-50"
                        placeholder="Enter admin password"
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        onClick={handlePasswordToggle}
                        disabled={loading}
                      >
                        <FontAwesomeIcon
                          icon={showPassword ? faEyeSlash : faEye}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* Two-Factor Authentication */
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--charcoal)]">
                    Two-Factor Authentication
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FontAwesomeIcon
                        icon={faMobileAlt}
                        className="text-gray-400"
                      />
                    </div>
                    <input
                      type="text"
                      maxLength={6}
                      value={twoFactor}
                      onChange={handleTwoFactorChange}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent transition-all duration-200 bg-gray-50"
                      placeholder="Enter 6-digit code"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>
              )}

              {!requires2FA && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-session"
                      name="rememberDevice"
                      type="checkbox"
                      checked={formData.rememberDevice}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-[var(--luxury-gold)] focus:ring-[var(--luxury-gold)] border-gray-300 rounded"
                      disabled={loading}
                    />
                    <label
                      htmlFor="remember-session"
                      className="ml-2 block text-sm text-gray-600"
                    >
                      Remember this device
                    </label>
                  </div>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-sm text-[var(--luxury-gold)] hover:text-[var(--luxury-copper)] transition-colors font-medium"
                    disabled={loading}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[var(--luxury-gold)] to-[var(--luxury-copper)] text-white font-semibold py-4 px-6 rounded-2xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    <span>
                      {requires2FA ? "Verifying..." : "Authenticating..."}
                    </span>
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faSignInAlt} />
                    <span>
                      {requires2FA ? "Verify & Continue" : "Access Dashboard"}
                    </span>
                  </>
                )}
              </button>

              {!requires2FA && (
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  className="w-full mt-2 py-3 px-6 border border-gray-300 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                  disabled={loading}
                >
                  Use Demo Credentials
                </button>
              )}

              {requires2FA && (
                <button
                  type="button"
                  onClick={() => {
                    setRequires2FA(false);
                    setTwoFactor("");
                    setError("");
                  }}
                  className="w-full mt-2 py-3 px-6 border border-gray-300 rounded-2xl text-gray-600 hover:bg-gray-50 transition-colors text-sm font-medium"
                  disabled={loading}
                >
                  Back to Login
                </button>
              )}
            </form>

            {/* Debug Info */}
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-xs text-gray-600 mb-1">
                <strong>Debug Info:</strong> Using authApi with Axios
              </p>
              <p className="text-xs text-gray-500">
                API URL: {process.env.NEXT_PUBLIC_API_URL || "http://localhost:5186"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                2FA Mode: {requires2FA ? "Active" : "Inactive"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Storage: localStorage + sessionStorage
              </p>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
              <div className="flex items-start space-x-3">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-blue-500 mt-1"
                />
                <div>
                  <h4 className="text-sm font-medium text-blue-800">
                    Security Notice
                  </h4>
                  <p className="text-xs text-blue-600 mt-1">
                    All admin activities are logged and monitored. Ensure you're
                    on a secure network.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[var(--luxury-gold)] bg-opacity-10 rounded-xl flex items-center justify-center mb-3">
                <FontAwesomeIcon
                  icon={faChartBar}
                  className="text-[var(--luxury-gold)]"
                />
              </div>
              <h4 className="font-semibold text-sm text-[var(--charcoal)] mb-1">
                Analytics
              </h4>
              <p className="text-xs text-gray-600">Real-time insights</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-[var(--luxury-copper)] bg-opacity-10 rounded-xl flex items-center justify-center mb-3">
                <FontAwesomeIcon
                  icon={faBoxes}
                  className="text-[var(--luxury-copper)]"
                />
              </div>
              <h4 className="font-semibold text-sm text-[var(--charcoal)] mb-1">
                Inventory
              </h4>
              <p className="text-xs text-gray-600">Stock management</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-xl flex items-center justify-center mb-3">
                <FontAwesomeIcon
                  icon={faShoppingCart}
                  className="text-green-500"
                />
              </div>
              <h4 className="font-semibold text-sm text-[var(--charcoal)] mb-1">
                Orders
              </h4>
              <p className="text-xs text-gray-600">Order processing</p>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="w-12 h-12 bg-purple-500 bg-opacity-10 rounded-xl flex items-center justify-center mb-3">
                <FontAwesomeIcon icon={faCube} className="text-purple-500" />
              </div>
              <h4 className="font-semibold text-sm text-[var(--charcoal)] mb-1">
                AR Models
              </h4>
              <p className="text-xs text-gray-600">3D content</p>
            </div>
          </div>

          {/* System Status */}
          <div className="mt-6 text-center">
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
              <FontAwesomeIcon icon={faServer} />
              <span>API Base URL: {process.env.NEXT_PUBLIC_API_URL || "http://localhost:5186"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 