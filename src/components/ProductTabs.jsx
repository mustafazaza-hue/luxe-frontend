"use client";

const ProductTabs = ({
  activeTab,
  setActiveTab,
  description,
  features,
  careInstructions,
  reviews,
}) => {
  const tabs = [
    { id: "description", label: "Description", icon: "fa-file-lines" },
    { id: "specifications", label: "Specifications", icon: "fa-list-check" },
    { id: "dimensions", label: "Dimensions", icon: "fa-ruler-combined" },
    { id: "reviews", label: `Reviews (${reviews})`, icon: "fa-star" },
  ];

  const specifications = [
    { label: "Material", value: "Premium Italian Leather" },
    { label: "Frame", value: "Solid Oak Wood" },
    { label: "Cushion Filling", value: "High-Density Foam" },
    { label: "Weight Capacity", value: "1200 lbs" },
    { label: "Assembly", value: "Professional Assembly Required" },
    { label: "Origin", value: "Handcrafted in Italy" },
  ];

  const dimensions = [
    { label: "Width", value: '92"', description: "Overall sofa width" },
    { label: "Height", value: '34"', description: "Backrest height" },
    { label: "Depth", value: '38"', description: "Seat depth" },
    { label: "Seat Height", value: '18"', description: "From floor to seat" },
    { label: "Weight", value: "185 lbs", description: "Total product weight" },
  ];

  // بيانات المراجعات الافتراضية
  const reviewData = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      date: "2024-03-15",
      comment:
        "Absolutely stunning! The quality is exceptional and it looks even better in person.",
      verified: true,
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      date: "2024-03-10",
      comment:
        "Worth every penny. The AR feature helped me visualize it perfectly in my living room.",
      verified: true,
    },
    {
      id: 3,
      name: "Emma Williams",
      rating: 4,
      date: "2024-03-05",
      comment:
        "Beautiful sofa, very comfortable. Delivery was faster than expected.",
      verified: true,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[var(--charcoal)]">
              Product Description
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-semibold text-[var(--charcoal)] mb-4 flex items-center space-x-2">
                  <i className="fa-solid fa-star text-[var(--luxury-gold)]"></i>
                  <span>Key Features</span>
                </h4>
                <ul className="space-y-3">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <i className="fa-solid fa-check text-green-500 mt-1"></i>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-[var(--charcoal)] mb-4 flex items-center space-x-2">
                  <i className="fa-solid fa-shield-alt text-[var(--luxury-gold)]"></i>
                  <span>Care Instructions</span>
                </h4>
                <ul className="space-y-3">
                  {careInstructions.map((instruction, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <i className="fa-solid fa-circle-info text-blue-500 mt-1"></i>
                      <span className="text-gray-700">{instruction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      case "specifications":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[var(--charcoal)]">
              Technical Specifications
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {specifications.map((spec, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="text-sm text-gray-500 font-medium mb-1">
                    {spec.label}
                  </div>
                  <div className="text-lg font-semibold text-[var(--charcoal)]">
                    {spec.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[var(--warm-beige)] rounded-lg p-6">
              <h4 className="text-lg font-semibold text-[var(--charcoal)] mb-3">
                Quality Assurance
              </h4>
              <p className="text-gray-600">
                Each Milano sofa undergoes rigorous quality control checks to
                ensure it meets our high standards of craftsmanship and
                durability. The leather is ethically sourced and
                vegetable-tanned for a premium finish.
              </p>
            </div>
          </div>
        );

      case "dimensions":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[var(--charcoal)]">
              Product Dimensions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {dimensions.map((dimension, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
                >
                  <div className="text-2xl font-bold text-[var(--charcoal)] mb-2">
                    {dimension.value}
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-1">
                    {dimension.label}
                  </div>
                  <div className="text-sm text-gray-500">
                    {dimension.description}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-[var(--warm-beige)] to-[var(--soft-gray)] rounded-lg p-6">
              <div className="bg-gradient-to-r from-warm-beige to-soft-gray rounded-lg p-6">
                <div className="flex items-center space-x-4">
                  <i className="fa-solid fa-ruler text-3xl text-[var(--luxury-gold)]"></i>
                  <div>
                    <h4 className="text-lg font-semibold text-[var(--charcoal)] mb-1">
                      Measuring Your Space
                    </h4>
                    <p className="text-gray-600">
                      Use our AR feature to visualize this sofa in your room
                      with accurate dimensions. Ensure you have at least 36
                      inches of clearance around the sofa for comfortable
                      movement.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            ); case 'reviews': return (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-[var(--charcoal)] mb-2">
                Customer Reviews
              </h3>
              <div className="flex items-center space-x-6">
                <div className="text-5xl font-bold text-[var(--charcoal)]">
                  4.8
                </div>
                <div className="flex text-[var(--luxury-gold)] text-lg">
                  <div className="flex text-[var(--luxury-gold)] text-lg">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>
                  <div className="text-gray-500 mt-1">{reviews} reviews</div>
                </div>
                <div className="flex-1">
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center space-x-3">
                        <div className="text-sm text-gray-600 w-8">
                          {rating}
                        </div>
                        <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-[var(--luxury-gold)] h-full rounded-full"
                            style={{
                              width: `${
                                rating === 5 ? "85" : rating === 4 ? "10" : "5"
                              }%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-sm text-gray-500 w-8">
                          {rating === 5 ? "85%" : rating === 4 ? "10%" : "5%"}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {/* قائمة المراجعات */}
            <div className="space-y-6">
              {reviewData.map((review) => (
                <div
                  key={review.id}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-[var(--charcoal)]">
                          {review.name}
                        </h4>
                        {review.verified && (
                          <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded">
                            <i className="fa-solid fa-check mr-1"></i>Verified
                            Purchase
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="flex text-[var(--luxury-gold)]">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fa-solid ${
                                i < review.rating ? "fa-star" : "fa-star"
                              }`}
                            ></i>
                          ))}
                        </div>
                        <span className="text-gray-500 text-sm">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                  <div className="flex space-x-4 mt-4">
                    <button className="text-gray-500 hover:text-[var(--luxury-gold)] text-sm">
                      <i className="fa-solid fa-thumbs-up mr-1"></i>Helpful
                    </button>
                    <button className="text-gray-500 hover:text-[var(--luxury-gold)] text-sm">
                      <i className="fa-solid fa-flag mr-1"></i>Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {/* نموذج إضافة مراجعة */}
            <div className="bg-gradient-to-r from-[var(--warm-beige)] to-[var(--soft-gray)] rounded-lg p-6">
              <h4 className="text-xl font-semibold text-[var(--charcoal)] mb-4">
                Share Your Experience
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">
                    Your Rating
                  </label>
                  <div className="flex space-x-1 text-2xl text-gray-300">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        className="hover:text-[var(--luxury-gold)]"
                      >
                        <i className="fa-regular fa-star"></i>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 mb-2">
                    Your Review
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[var(--luxury-gold)]"
                    rows="4"
                    placeholder="Share your thoughts about this product..."
                  ></textarea>
                </div>
                <button className="bg-[var(--luxury-gold)] hover:bg-opacity-90 text-white px-6 py-3 rounded-lg font-semibold">
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      id="product-tabs"
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {/* ترويسة التبويبات */}
      <div className="border-b border-gray-200">
        <nav className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? "border-gold-accent text-gold-accent font-semibold bg-gradient-to-r from-gold-accent/5 to-transparent"
                  : "border-transparent text-gray-600 hover:text-gold-accent font-medium hover:bg-gray-50"
              }`}
            >
              <i
                className={`fa-solid ${tab.icon} ${
                  activeTab === tab.id ? "text-gold-accent" : "text-gray-400"
                }`}
              ></i>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* محتوى التبويب النشط */}
      <div className="p-8">{renderTabContent()}</div>
    </div>
  );
};

export default ProductTabs;
