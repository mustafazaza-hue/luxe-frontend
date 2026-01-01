'use client';

const OrderSummary = ({
  subtotal,
  shipping,
  discount,
  tax,
  total,
  couponCode,
  setCouponCode,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  shippingInfo,
  setShippingInfo,
  onCheckout
}) => {
  const handleShippingSubmit = (e) => {
    e.preventDefault();
    // محاكاة حساب الشحن (لا يوجد endpoint في الـ API الحالي)
    alert('Shipping calculated (Demo mode)');
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
      <h2 className="text-2xl font-bold text-charcoal mb-6">Order Summary</h2>
      
      {/* Coupon Section */}
      <div className="mb-6">
        <label className="text-sm font-medium text-charcoal mb-2 block">
          Discount Coupon
        </label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter coupon code"
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent focus:border-transparent"
          />
          <button 
            onClick={onApplyCoupon}
            className="bg-gold-accent hover:bg-opacity-90 text-white px-6 py-2 rounded-lg font-semibold transition-colors whitespace-nowrap"
          >
            Apply
          </button>
        </div>
        
        {/* Applied Coupon */}
        {appliedCoupon && (
          <div className="mt-3">
            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <i className="fa-solid fa-check-circle text-green-600"></i>
                <span className="text-sm font-medium text-green-700">
                  {appliedCoupon.code} Applied
                </span>
              </div>
              <button 
                onClick={onRemoveCoupon}
                className="text-red-500 hover:text-red-700"
                aria-label="Remove coupon"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Shipping Calculator */}
      <div className="mb-6 pb-6 border-b border-gray-200">
        <label className="text-sm font-medium text-charcoal mb-2 block">
          Calculate Shipping
        </label>
        
        <form onSubmit={handleShippingSubmit}>
          <select
            value={shippingInfo.country}
            onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent focus:border-transparent mb-3"
          >
            <option value="">Select Country</option>
            <option value="US">United States</option>
            <option value="UK">United Kingdom</option>
            <option value="CA">Canada</option>
            <option value="AU">Australia</option>
          </select>
          
          <input
            type="text"
            value={shippingInfo.zipCode}
            onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
            placeholder="Enter ZIP Code"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-accent focus:border-transparent"
          />
          
          <button 
            type="submit"
            className="w-full mt-3 border-2 border-gold-accent text-gold-accent hover:bg-gold-accent hover:text-white px-4 py-2 rounded-lg font-semibold transition-all"
          >
            <i className="fa-solid fa-calculator mr-2"></i>Calculate
          </button>
        </form>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span className="font-medium">${subtotal.toLocaleString()}</span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className={`font-medium ${shipping === 0 ? 'text-gold-accent' : ''}`}>
            {shipping === 0 ? 'Free' : `$${shipping}`}
          </span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Discount</span>
            <span className="font-medium text-green-600">
              -${discount.toLocaleString()}
            </span>
          </div>
        )}
        
        <div className="flex justify-between text-gray-600">
          <span>Tax (Estimated)</span>
          <span className="font-medium">${tax.toLocaleString()}</span>
        </div>
      </div>

      {/* Total Section */}
      <div className="pt-6 border-t-2 border-gray-200 mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-charcoal">Total</span>
          <span className="text-3xl font-bold text-charcoal">
            ${total.toLocaleString()}
          </span>
        </div>
        <p className="text-xs text-gray-500 text-right">
          Including all taxes and fees
        </p>
      </div>

      {/* Checkout Button */}
      <button 
        onClick={onCheckout}
        className="w-full bg-gold-accent hover:bg-opacity-90 text-white py-4 rounded-lg font-bold text-lg transition-all transform hover:scale-105 mb-3 shadow-lg hover:shadow-xl"
      >
        Proceed to Checkout
      </button>

      {/* Payment Methods */}
      <div className="flex items-center justify-center space-x-3 pt-4 border-t border-gray-200">
        <span className="text-xs text-gray-500">We Accept:</span>
        <i className="fa-brands fa-cc-visa text-2xl text-gray-600"></i>
        <i className="fa-brands fa-cc-mastercard text-2xl text-gray-600"></i>
        <i className="fa-brands fa-cc-amex text-2xl text-gray-600"></i>
        <i className="fa-brands fa-cc-paypal text-2xl text-gray-600"></i>
      </div>

      {/* Security Badge */}
      <div className="flex items-center justify-center space-x-2 mt-4 text-gray-500">
        <i className="fa-solid fa-lock"></i>
        <span className="text-xs">Secure Checkout</span>
      </div>
    </div>
  );
};

export default OrderSummary;