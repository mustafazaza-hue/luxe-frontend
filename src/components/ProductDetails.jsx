const ProductDetails = ({
  product,
  selectedColor,
  setSelectedColor,
  selectedSize,
  setSelectedSize,
  quantity,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onViewInAR,
}) => {
  const colors = product.colors || [
    { name: "Beige", value: "beige", class: "bg-amber-100" },
    { name: "Charcoal", value: "charcoal", class: "bg-gray-900" },
    { name: "Espresso", value: "espresso", class: "bg-amber-900" },
  ];

  const sizes = product.sizes || ["3-Seater", "2-Seater", "Loveseat"];

  return (
    <div className="space-y-8">
      {/* Product Header */}
      <div>
        <h1 className="text-4xl font-bold text-[var(--charcoal)] mb-4">
          {product.name}
        </h1>
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center space-x-1">
            <div className="flex text-[var(--luxury-gold)]">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="fa-solid fa-star"></i>
              ))}
            </div>
            <span className="text-gray-600">({product.reviews} reviews)</span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              product.inStock
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <div className="flex items-baseline space-x-4 mb-6">
          <span className="text-4xl font-bold text-[var(--charcoal)]">
            ${product.price.toLocaleString()}
          </span>
          <span className="text-xl text-gray-500 line-through">
            ${product.originalPrice.toLocaleString()}
          </span>
          <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
            {product.discount}% OFF
          </span>
        </div>
      </div>

      {/* Product Options */}
      <div className="space-y-6">
        {/* Color Selection */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--charcoal)] mb-3">
            Color
          </h3>
          <div className="flex space-x-3">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => setSelectedColor(color.value)}
                className={`w-12 h-12 rounded-full ${
                  color.class
                } border-2 transition-all relative group ${
                  selectedColor === color.value
                    ? "border-[var(--luxury-gold)] scale-110 shadow-md"
                    : "border-gray-200 hover:border-[var(--luxury-gold)]"
                }`}
                title={color.name}
              >
                <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 group-hover:text-[var(--luxury-gold)] whitespace-nowrap">
                  {color.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Size Selection */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--charcoal)] mb-3">
            Size
          </h3>
          <div className="flex space-x-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() =>
                  setSelectedSize(size.toLowerCase().replace("-", ""))
                }
                className={`px-4 py-2 border-2 rounded-lg font-medium transition-all ${
                  selectedSize === size.toLowerCase().replace("-", "")
                    ? "border-[var(--luxury-gold)] bg-[var(--luxury-gold)] text-white shadow-md"
                    : "border-gray-200 text-[var(--charcoal)] hover:border-[var(--luxury-gold)] hover:shadow-sm"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div>
          <h3 className="text-lg font-semibold text-[var(--charcoal)] mb-3">
            Quantity
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => onQuantityChange("decrement")}
                className="p-3 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                disabled={quantity <= 1}
              >
                <i className="fa-solid fa-minus text-sm"></i>
              </button>
              <span className="px-6 py-3 font-medium text-lg min-w-[60px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => onQuantityChange("increment")}
                className="p-3 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                disabled={quantity >= product.stockCount}
              >
                <i className="fa-solid fa-plus text-sm"></i>
              </button>
            </div>
            <span className="text-gray-600">
              Only {product.stockCount} left in stock
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          <button
            onClick={onAddToCart}
            className="flex-1 bg-[var(--luxury-gold)] hover:bg-opacity-90 text-white py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
          >
            <i className="fa-solid fa-cart-plus mr-2"></i>
            Add to Cart
          </button>
          <button
            onClick={onBuyNow}
            className="flex-1 bg-[var(--charcoal)] hover:bg-opacity-90 text-white py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl active:scale-95"
          >
            <i className="fa-solid fa-bolt mr-2"></i>
            Buy Now
          </button>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={onViewInAR}
            className="flex-1 border-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)] hover:bg-[var(--luxury-gold)] hover:text-white py-3 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 group shadow-md hover:shadow-lg"
          >
            <i className="fa-solid fa-vr-cardboard group-hover:rotate-12 transition-transform"></i>
            <span>View in AR Room</span>
          </button>
          <button className="px-6 border-2 border-gray-200 text-[var(--charcoal)] hover:border-[var(--luxury-gold)] hover:text-[var(--luxury-gold)] py-3 rounded-lg transition-all shadow-md hover:shadow-lg hover:scale-105">
            <i className="fa-regular fa-heart text-xl"></i>
          </button>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-white rounded-lg p-6 space-y-4 shadow-sm border border-gray-100">
        <div className="flex items-center space-x-3">
          <i className="fa-solid fa-truck text-[var(--luxury-gold)] text-lg"></i>
          <div>
            <span className="text-[var(--charcoal)] font-medium">
              Free shipping
            </span>
            <p className="text-gray-500 text-sm">On orders over $1,500</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <i className="fa-solid fa-undo text-[var(--luxury-gold)] text-lg"></i>
          <div>
            <span className="text-[var(--charcoal)] font-medium">
              30-day returns
            </span>
            <p className="text-gray-500 text-sm">No questions asked</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <i className="fa-solid fa-shield-alt text-[var(--luxury-gold)] text-lg"></i>
          <div>
            <span className="text-[var(--charcoal)] font-medium">
              2-year warranty
            </span>
            <p className="text-gray-500 text-sm">Full coverage included</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
