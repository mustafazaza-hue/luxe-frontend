'use client';

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  const getImageUrl = (path) => {
    if (!path) return 'https://via.placeholder.com/150x150?text=No+Image';
    if (path.startsWith('http')) return path;
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5186'}${path}`;
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-6">
        {/* Product Image */}
        <div className="w-32 h-32 flex-shrink-0 bg-soft-gray rounded-lg overflow-hidden">
          <img 
            src={getImageUrl(item.imageUrl)} 
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/150x150?text=No+Image';
            }}
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl font-semibold text-charcoal mb-1 hover:text-gold-accent cursor-pointer">
                {item.name}
              </h3>
              <p className="text-gray-500 text-sm mb-3">{item.description}</p>
              
              {/* Features and Options */}
              <div className="flex items-center space-x-3">
                {item.features?.includes('AR Ready') && (
                  <span className="text-xs bg-gold-accent bg-opacity-10 text-gold-accent px-2 py-1 rounded">
                    AR Ready
                  </span>
                )}
                {item.color && (
                  <span className="text-xs text-gray-500">Color: {item.color}</span>
                )}
                {item.size && (
                  <span className="text-xs text-gray-500">Size: {item.size}</span>
                )}
              </div>
            </div>

            {/* Remove Button */}
            <button 
              onClick={() => onRemove(item.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-2"
              aria-label="Remove item"
            >
              <i className="fa-solid fa-trash text-lg"></i>
            </button>
          </div>

          {/* Quantity and Price */}
          <div className="flex justify-between items-end mt-6">
            {/* Quantity Controls */}
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                aria-label="Decrease quantity"
              >
                <i className="fa-solid fa-minus text-sm text-gray-600"></i>
              </button>
              
              <span className="text-lg font-medium text-charcoal w-8 text-center">
                {item.quantity}
              </span>
              
              <button 
                onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center"
                aria-label="Increase quantity"
              >
                <i className="fa-solid fa-plus text-sm text-gray-600"></i>
              </button>
            </div>

            {/* Price */}
            <div className="text-right">
              <div className="text-2xl font-bold text-charcoal">
                ${(item.price * item.quantity).toLocaleString()}
              </div>
              {item.quantity > 1 && (
                <div className="text-sm text-gray-500">
                  ${item.price.toLocaleString()} each
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;