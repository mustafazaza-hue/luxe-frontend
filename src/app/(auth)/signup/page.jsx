"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/api/auth";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faPhone, faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().required("Phone is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], "Passwords must match")
    .required("Confirm password is required"),
  terms: yup.bool().oneOf([true], "You must accept terms"),
});

export default function SignupPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authApi.customerSignup(data);
      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Your account has been created successfully! Redirecting to login...",
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        router.push("/login");
      });
    } catch (error) {
      let errorMessage = "Something went wrong";
      if (error.response?.data) {
        const respData = error.response.data;
        if (respData.message) errorMessage = respData.message;
        else if (respData.error) errorMessage = respData.error;
      }

      Swal.fire({
        icon: "error",
        title: "Signup Failed",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
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
              Join the<br />
              <span className="text-[var(--luxury-gold)]">Future</span><br />
              of Shopping
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Create your account and unlock exclusive AR experiences. 
              Discover premium furniture like never before.
            </p>
          </div>
          {/* Icons blocks */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-[var(--luxury-gold)] rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">AR Experience</h3>
              <p className="text-gray-300">Visualize in your space</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 bg-[var(--luxury-copper)] rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faUser} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Exclusive Access</h3>
              <p className="text-gray-300">Premium member benefits</p>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-64 overflow-hidden">
          <img className="w-full h-full object-cover opacity-30" src="https://storage.googleapis.com/uxpilot-auth.appspot.com/96667aca44-d3fc42440bb4cb7c74b6.png" alt="elegant modern furniture" />
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[var(--luxury-gold)] rounded-2xl mb-6">
              <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
            </div>
            <h2 className="text-3xl font-bold text-[var(--charcoal)] mb-2">LuxeSpace</h2>
            <p className="text-gray-600">Premium Furniture & AR Experience</p>
          </div>

          {/* Signup Form */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* First & Last Name */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--charcoal)]">First Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                    </div>
                    <input type="text" {...register("firstName")} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent transition-all duration-200 bg-gray-50" placeholder="First name" />
                  </div>
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[var(--charcoal)]">Last Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                    </div>
                    <input type="text" {...register("lastName")} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent transition-all duration-200 bg-gray-50" placeholder="Last name" />
                  </div>
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--charcoal)]">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
                  </div>
                  <input type="email" {...register("email")} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent transition-all duration-200 bg-gray-50" placeholder="Enter your email" />
                </div>
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--charcoal)]">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
                  </div>
                  <input type="tel" {...register("phone")} className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent transition-all duration-200 bg-gray-50" placeholder="Phone number" />
                </div>
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--charcoal)]">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                  </div>
                  <input type={showPassword ? "text" : "password"} {...register("password")} className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent transition-all duration-200 bg-gray-50" placeholder="Create password" />
                  <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-gray-400" />
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[var(--charcoal)]">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faLock} className="text-gray-400" />
                  </div>
                  <input type={showConfirmPassword ? "text" : "password"} {...register("confirmPassword")} className="w-full pl-12 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--luxury-gold)] focus:border-transparent transition-all duration-200 bg-gray-50" placeholder="Confirm password" />
                  <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} className="text-gray-400" />
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              {/* Terms */}
              <div className="flex items-center space-x-2">
                <input type="checkbox" {...register("terms")} className="h-4 w-4 text-[var(--luxury-gold)] border-gray-300 rounded focus:ring-[var(--luxury-gold)]" />
                <label className="text-sm text-gray-600">
                  I agree to the <a href="#" className="text-[var(--luxury-gold)] hover:text-[var(--luxury-copper)] font-medium">Terms</a> & <a href="#" className="text-[var(--luxury-gold)] hover:text-[var(--luxury-copper)] font-medium">Privacy</a>
                </label>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-[var(--luxury-gold)] to-[var(--luxury-copper)] text-white font-semibold py-4 px-6 rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
