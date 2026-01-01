"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation"; // أضف هذا
import { authApi } from "@/api/auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCouch, faCube, faDashboard, faEnvelope, faEye, faEyeSlash, faHeadset, faLock, faShieldAlt, faShippingFast, faStar } from "@fortawesome/free-solid-svg-icons";
import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";
import Link from "next/link"; // أضف هذا

export default function LoginPage() {
  const router = useRouter(); // أضف هذا
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAdminLogin, setIsAdminLogin] = useState(false); // حالة للتحويل بين customer/admin

  // ✅ Validation schema مع regex فقط - بدون تغيير أي شيء آخر
  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is required")
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please enter a valid email address"
      ),

    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain: 8+ chars, uppercase, lowercase, number, special character"
      ),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset // أضف هذا لتخليص النموذج بعد التسجيل
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let res;
      
      if (isAdminLogin) {
        // تسجيل دخول كـ admin
        res = await authApi.adminLogin(data.email, data.password);
        
        // تخزين البيانات
        localStorage.setItem("token", res.token || "");
        localStorage.setItem("user", JSON.stringify(res.user || { email: data.email }));
        localStorage.setItem("userType", "admin");
        
        Swal.fire({
          icon: "success",
          title: "Admin Logged in!",
          text: `Welcome back, ${data.email}!`,
        }).then(() => {
          // التوجيه إلى صفحة الـ dashboard
          router.push("/dashboard");
        });
      } else {
        // تسجيل دخول كـ customer
        res = await authApi.customerLogin(data.email, data.password);
        
        // تخزين البيانات
        localStorage.setItem("token", res.token || "");
        localStorage.setItem("user", JSON.stringify(res.user || { email: data.email }));
        localStorage.setItem("userType", "customer");
        
        Swal.fire({
          icon: "success",
          title: "Logged in!",
          text: `Welcome back, ${data.email}!`,
        }).then(() => {
          // التوجيه إلى الصفحة الرئيسية
          router.push("/");
        });
      }
      
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (error.response?.data) {
        const respData = error.response.data;
        if (respData.message) errorMessage = respData.message;
        else if (respData.error) errorMessage = respData.error;
      }
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
      reset(); // تخليص النموذج بعد المحاولة
    }
  };

  // دالة للتبديل بين customer و admin
  const toggleLoginType = () => {
    setIsAdminLogin(!isAdminLogin);
    reset(); // تخليص النموذج عند التبديل
  };

  // دالة للتحويل إلى صفحة التسجيل
  const goToSignup = () => {
    router.push("/signup");
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[var(--warm-beige)] via-white to-[var(--soft-gray)]">

      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--charcoal)] to-gray-800"></div>
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>

        <div className="relative z-10 flex flex-col justify-center items-start p-16 text-white">
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4 leading-tight">
              Experience<br />
              <span className="text-[var(--luxury-gold)]">Luxury</span><br />
              in AR
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Transform your space with our premium furniture collection.<br />
              See how each piece looks in your home before you buy.
            </p>
          </div>

          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--luxury-gold)]">
              <FontAwesomeIcon icon={faCube} className="text-white fa-2x" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AR Visualization</h3>
              <p className="text-gray-300">Try before you buy</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[var(--luxury-copper)]">
              <FontAwesomeIcon icon={faStar} className="text-white fa-2x" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Premium Quality</h3>
              <p className="text-gray-300">Handcrafted excellence</p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-64 overflow-hidden">
          <img
            className="w-full h-full object-cover opacity-30"
            src="https://storage.googleapis.com/uxpilot-auth.appspot.com/c0cf375c51-2be28da7be98502576e4.png"
            alt="luxury living room"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">

          {/* Logo Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-[var(--luxury-gold)]">
              <FontAwesomeIcon icon={faCouch} className="text-white fa-2x" />
            </div>
            <h2 className="text-3xl font-bold text-[var(--charcoal)] mb-2">LuxeSpace</h2>
            <p className="text-gray-600">Premium Furniture & AR Experience</p>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-2">
                {isAdminLogin ? "Admin Login" : "Welcome Back"}
              </h3>
              <p className="text-gray-600">
                {isAdminLogin ? "Sign in to admin dashboard" : "Sign in to your account"}
              </p>
              
              {/* زر التبديل بين customer و admin */}
              <Link
                type="button"
                href={"/adminlogin"}
                onClick={toggleLoginType}
                className="mt-4 flex items-center justify-center gap-2 text-sm text-[var(--luxury-gold)] hover:text-[var(--luxury-copper)] transition-colors"
              >
                <FontAwesomeIcon icon={faDashboard} className="text-sm" />
                <span>
                  {isAdminLogin ? "Switch to Customer Login" : "Switch to Admin Dashboard Login"}
                </span>
              </Link>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {/* Email Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--charcoal)]">
                  {isAdminLogin ? "Admin Email" : "Email Address"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400 fa-1/2x mr-3" />
                  </div>
                  <input
                    type="email"
                    placeholder={isAdminLogin ? "Enter admin email" : "Enter your email"}
                    className={`w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent transition-all duration-200 bg-gray-50 ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    {...register("email")}
                    disabled={loading}
                  />
                </div>
                {/* ✅ Error message under field */}
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 ml-1">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--charcoal)]">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400 fa-1/2x mr-3" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className={`w-full pl-12 pr-12 py-4 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent transition-all duration-200 bg-gray-50 ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    {...register("password")}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <FontAwesomeIcon
                      icon={showPassword ? faEyeSlash : faEye}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    />
                  </button>
                </div>
                {/* ✅ Error message under field */}
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 ml-1">{errors.password.message}</p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-gray-600 text-sm">
                  <input 
                    type="checkbox" 
                    className="h-4 w-4 rounded border-gray-300 text-[var(--luxury-gold)] focus:ring-[var(--luxury-gold)]" 
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-[var(--luxury-gold)] hover:text-[var(--luxury-copper)]">
                  Forgot password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 rounded-2xl text-white font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 bg-gradient-to-r from-[var(--luxury-gold)] to-[var(--luxury-copper)] disabled:opacity-50"
              >
                {loading ? (
                  isAdminLogin ? "Signing in as Admin..." : "Signing in..."
                ) : (
                  isAdminLogin ? "Sign In as Admin" : "Sign In"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="my-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login - تظهر فقط لـ customer */}
            {!isAdminLogin && (
              <div className="space-y-3">
                <button 
                  className="w-full flex items-center justify-center px-6 py-3 border border-gray-200 rounded-2xl text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faGoogle} className="text-red-500 fa-1/2x mr-3" />
                  Continue with Google
                </button>
                <button 
                  className="w-full flex items-center justify-center px-6 py-3 border border-gray-200 rounded-2xl text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faApple} className="fa-1/2x mr-3" />
                  Continue with Apple
                </button>
              </div>
            )}

            {/* Signup Link - تظهر فقط لـ customer */}
            {!isAdminLogin && (
              <p className="mt-8 text-center text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={goToSignup}
                  className="font-semibold text-[var(--luxury-gold)] hover:text-[var(--luxury-copper)] cursor-pointer"
                >
                  Sign up
                </button>
              </p>
            )}
          </div>

          {/* Features Section - تظهر فقط لـ customer */}
          {!isAdminLogin && (
            <div className="mt-8 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--luxury-gold)] bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <FontAwesomeIcon icon={faShieldAlt} className="text-white fa-2x" />
                </div>
                <p className="text-xs text-gray-600">Secure</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--luxury-gold)] bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <FontAwesomeIcon icon={faShippingFast} className="text-white fa-2x" />
                </div>
                <p className="text-xs text-gray-600">Fast Delivery</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[var(--luxury-gold)] bg-opacity-10 rounded-xl flex items-center justify-center mx-auto mb-2">
                  <FontAwesomeIcon icon={faHeadset} className="text-white fa-2x" />
                </div>
                <p className="text-xs text-gray-600">24/7 Support</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}