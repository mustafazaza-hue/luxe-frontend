"use client";
import React, { useState, useEffect } from "react";
import apiClient from "../../../api/apiClient"; // تم تعديل المسار ليشير إلى ملف apiClient المشترك
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const CheckoutMain = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  });

  // جلب بيانات السلة عند تحميل المكون
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await apiClient.get("/cart");
        setCart(data);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    try {
      const response = await apiClient.post("/checkout", {
        shippingInfo,
        paymentMethod: "credit-card", // يمكن تغييره بناءً على اختيار المستخدم
        cartItems: cart?.items ?? [],
      });
      if (response.success) {
        alert(`Order placed successfully! Order ID: ${response.orderId}`);
      }
    } catch (error) {
      alert("Failed to place order. Please try again.");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <main className="py-12 bg-[var(--soft-gray)] min-h-screen font-['Inter',_sans-serif]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-center space-x-4 mb-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--luxury-gold)] text-white rounded-full flex items-center justify-center">
              <FontAwesomeIcon icon={faCheck}></FontAwesomeIcon>
            </div>
            <span className="text-[var(--luxury-gold)] font-medium text-sm">
              Cart
            </span>
          </div>
          <div className="w-20 h-[2px] bg-[var(--luxury-gold)]"></div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--luxury-gold)] text-white rounded-full flex items-center justify-center font-bold text-sm">
              1
            </div>
            <span className="text-[var(--luxury-gold)] font-medium text-sm">
              Shipping
            </span>
          </div>
          <div className="w-20 h-[2px] bg-gray-300"></div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm">
              2
            </div>
            <span className="text-gray-500 font-medium text-sm">Payment</span>
          </div>
          <div className="w-20 h-[2px] bg-gray-300"></div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 text-gray-500 rounded-full flex items-center justify-center font-bold text-sm">
              3
            </div>
            <span className="text-gray-500 font-medium text-sm">Review</span>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Left Side (2/3) */}
          <div className="lg:col-span-2 space-y-10">
            {/* 1. Shipping Information */}
            <section className="bg-white rounded-2xl p-10 shadow-sm">
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-8 h-8 bg-[var(--luxury-gold)] text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <h2 className="text-2xl font-bold text-[var(--charcoal)]">
                  Shipping Information
                </h2>
              </div>

              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--charcoal)]">
                      First Name
                    </label>
                    <input
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="John"
                      className="w-full px-5 py-4 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--charcoal)]">
                      Last Name
                    </label>
                    <input
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="Doe"
                      className="w-full px-5 py-4 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--charcoal)]">
                    Email Address
                  </label>
                  <input
                    name="email"
                    value={shippingInfo.email}
                    onChange={handleInputChange}
                    type="email"
                    placeholder="john.doe@example.com"
                    className="w-full px-5 py-4 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--charcoal)]">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    value={shippingInfo.phone}
                    onChange={handleInputChange}
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="w-full px-5 py-4 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-[var(--charcoal)]">
                    Street Address
                  </label>
                  <input
                    name="address"
                    value={shippingInfo.address}
                    onChange={handleInputChange}
                    type="text"
                    placeholder="123 Main Street"
                    className="w-full px-5 py-4 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--charcoal)]">
                      City
                    </label>
                    <input
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="New York"
                      className="w-full px-5 py-4 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--charcoal)]">
                      State
                    </label>
                    <div className="relative">
                      <select
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleInputChange}
                        className="w-full px-5 py-4 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all appearance-none"
                      >
                        <option value="">Select State</option>
                        <option value="NY">New York</option>
                        <option value="CA">California</option>
                      </select>
                      <i className="fa-solid fa-chevron-down absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none"></i>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-[var(--charcoal)]">
                      ZIP Code
                    </label>
                    <input
                      name="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={handleInputChange}
                      type="text"
                      placeholder="10001"
                      className="w-full px-5 py-4 border border-gray-100 rounded-xl bg-gray-50/30 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]/20 focus:border-[var(--luxury-gold)] transition-all"
                    />
                  </div>
                </div>
              </form>
            </section>

            {/* 2. Payment Method */}
            <section className="bg-white rounded-2xl p-10 shadow-sm">
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <h2 className="text-2xl font-bold text-[var(--charcoal)]">
                  Payment Method
                </h2>
              </div>

              <div className="space-y-5">
                <div className="flex items-center justify-between p-6 border border-gray-100 rounded-2xl bg-gray-50/20">
                  <div className="flex items-center space-x-4">
                    <input
                      type="radio"
                      name="pay"
                      id="card"
                      className="w-5 h-5 text-[var(--luxury-gold)] focus:ring-[var(--luxury-gold)]"
                      defaultChecked
                    />
                    <div className="flex items-center space-x-3">
                      <i className="fa-solid fa-credit-card text-[var(--luxury-gold)] text-lg"></i>
                      <span className="font-bold text-[var(--charcoal)]">
                        Credit/Debit Card
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <i className="fa-brands fa-cc-visa text-2xl text-blue-800"></i>
                    <i className="fa-brands fa-cc-mastercard text-2xl text-red-500"></i>
                    <i className="fa-brands fa-cc-amex text-2xl text-blue-500"></i>
                  </div>
                </div>
                {/* ... باقي طرق الدفع ... */}
              </div>
            </section>

            {/* 3. Review Your Order */}
            <section className="bg-white rounded-2xl p-10 shadow-sm">
              <div className="flex items-center space-x-4 mb-10">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <h2 className="text-2xl font-bold text-[var(--charcoal)]">
                  Review Your Order
                </h2>
              </div>

              <div className="space-y-6">
                {(cart?.items ?? []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-6 bg-gray-50/30 rounded-2xl border border-gray-50"
                  >
                    <div className="flex items-center space-x-6">
                      <img
                        src={item.img}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl shadow-sm"
                      />
                      <div>
                        <h4 className="font-bold text-[var(--charcoal)] text-lg">
                          {item.name}
                        </h4>
                        <p className="text-sm text-gray-400 font-medium">
                          {item.desc}
                        </p>
                        <p className="text-sm text-gray-500 font-bold mt-1">
                          Qty: {item.qty}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-[var(--charcoal)] text-xl">
                      ${(item.price ?? 0).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Side (1/3) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-10 shadow-sm sticky top-10">
              <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-10">
                Order Summary
              </h3>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Subtotal ({cart?.items?.length ?? 0} items)</span>
                  <span className="text-[var(--charcoal)] font-bold">
                    ${(cart?.subtotal ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Shipping</span>
                  <span className="text-[var(--charcoal)] font-bold">
                    ${(cart?.shipping ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-500 font-medium">
                  <span>Tax</span>
                  <span className="text-[var(--charcoal)] font-bold">
                    ${(cart?.tax ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xl font-bold text-[var(--charcoal)]">
                    Total
                  </span>
                  <span className="text-2xl font-black text-[var(--luxury-gold)]">
                    ${(cart?.total ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={handlePlaceOrder}
                  className="w-full bg-[var(--luxury-gold)] hover:bg-[#c49b2d] text-white py-5 rounded-2xl font-bold text-lg shadow-lg shadow-[var(--luxury-gold)]/20 transition-all transform hover:-translate-y-1 active:scale-95"
                >
                  Place Order
                </button>
                <button className="w-full border-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)] hover:bg-[var(--luxury-gold)] hover:text-white py-4 rounded-2xl font-bold transition-all">
                  Continue Shopping
                </button>
              </div>
              {/* ... باقي تفاصيل الحماية والشحن ... */}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutMain;
