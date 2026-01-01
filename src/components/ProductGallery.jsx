'use client';

const ProductGallery = ({ mainImage, productName, onViewInAR }) => {
  return (
    <div className="space-y-4">
      {/* Main Image Only */}
      <div className="relative bg-white rounded-xl overflow-hidden shadow-lg">
        <div className="aspect-square relative">
          <img 
            className="w-full h-full object-cover" 
            src={mainImage} 
            alt={productName} 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/800x800?text=Luxe+Furniture';
            }}
          />
          <div className="absolute top-4 right-4">
            <span className="bg-gold-accent text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
              AR Ready
            </span>
          </div>
          <button className="absolute top-4 left-4 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all shadow-lg hover:scale-110">
            <i className="fa-regular fa-heart text-charcoal text-lg"></i>
          </button>
          <div className="absolute bottom-4 right-4 flex space-x-2">
            <button className="bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-3 transition-all shadow-lg hover:scale-110">
              <i className="fa-solid fa-expand text-charcoal"></i>
            </button>
            <button 
              onClick={onViewInAR}
              className="bg-gradient-to-r from-gold-accent to-amber-500 hover:opacity-90 text-white rounded-full p-3 transition-all shadow-lg hover:scale-110"
            >
              <i className="fa-solid fa-cube"></i>
            </button>
          </div>
        </div>
      </div>

      {/* AR Viewer Section */}
      <div className="ar-viewer rounded-xl p-6 text-center bg-gradient-to-r from-warm-beige/50 to-warm-beige">
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-8">
          <i className="fa-solid fa-vr-cardboard text-6xl text-gold-accent mb-4"></i>
          <h3 className="text-xl font-semibold text-charcoal mb-2">Experience in Augmented Reality</h3>
          <p className="text-gray-600 mb-4">
            See how this {productName} fits in your space before buying
          </p>
          <button 
            onClick={onViewInAR}
            className="bg-gradient-to-r from-gold-accent to-amber-500 hover:opacity-90 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <i className="fa-solid fa-cube mr-2"></i>
            Launch AR Room Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductGallery;