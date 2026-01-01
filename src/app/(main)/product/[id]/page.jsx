"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStar,
  faShoppingCart,
  faHeart as faHeartSolid,
  faCube,
  faTruck,
  faShieldAlt,
  faRedo,
  faShareAlt,
  faChevronLeft,
  faSpinner,
  faExclamationCircle,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartOutline, faStar as faStarOutline } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import ARViewer from "@/components/ARViewer";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5186";

const getAuthHeaders = () => {
  if (typeof window === "undefined") {
    return {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
  }

  const token = localStorage.getItem("token") || localStorage.getItem("authToken");
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const buildProductImageUrl = (imagePath, productId) => {
  if (!imagePath || imagePath === '' || imagePath === 'string') {
    const unsplashImages = [
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1540932239986-310128078ceb?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800&h=600&fit=crop'
    ];
    const index = (productId || 1) % unsplashImages.length;
    return unsplashImages[index];
  }
  
  if (imagePath.startsWith('http')) {
    return imagePath;
  }
  
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  return `${API_BASE_URL}/${imagePath}`;
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id;
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [arLoading, setArLoading] = useState(false);
  const [productImages, setProductImages] = useState([]);
  const [showARViewer, setShowARViewer] = useState(false);

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_BASE_URL}/api/Products/${productId}`, {
        headers: getAuthHeaders(),
      });

      console.log("Product API Response:", response.data);

      if (response.data) {
        const productData = response.data;
        
        const processedProduct = {
          id: productData.id || productId,
          name: productData.name || productData.productName || "Unnamed Product",
          description: productData.description || productData.desc || "Premium furniture piece with excellent craftsmanship.",
          price: productData.price || 0,
          originalPrice: productData.originalPrice || productData.price * 1.2,
          discount: productData.discount || Math.floor(Math.random() * 30),
          category: productData.category || "Living Room",
          rating: productData.rating || 4.5,
          reviewCount: productData.reviewCount || Math.floor(Math.random() * 100) + 10,
          inStock: productData.inStock !== false,
          stockCount: productData.stockCount || productData.quantity || Math.floor(Math.random() * 20) + 5,
          arEnabled: productData.arEnabled !== false,
          material: productData.material || "Premium Materials",
          dimensions: productData.dimensions || "Width: 200cm, Depth: 90cm, Height: 80cm",
          weight: productData.weight || "100kg",
          color: productData.color || "Various",
          features: productData.features || [
            "High-quality materials",
            "Expert craftsmanship",
            "Comfortable design",
            "Durable construction"
          ],
          careInstructions: productData.careInstructions || [
            "Clean with appropriate products",
            "Avoid direct sunlight",
            "Regular maintenance recommended"
          ],
          arGlb: productData.arGlb,
          arUsdz: productData.arUsdz
        };

        setProduct(processedProduct);
        
        const images = [];
        
        if (productData.imageUrl || productData.image || productData.mainImage) {
          const mainImage = buildProductImageUrl(
            productData.imageUrl || productData.image || productData.mainImage,
            processedProduct.id
          );
          images.push(mainImage);
        }
        
        if (productData.images && Array.isArray(productData.images)) {
          productData.images.forEach(img => {
            images.push(buildProductImageUrl(img, processedProduct.id));
          });
        }
        
        if (images.length === 0) {
          images.push(buildProductImageUrl("", processedProduct.id));
          images.push(buildProductImageUrl("", processedProduct.id + 1));
          images.push(buildProductImageUrl("", processedProduct.id + 2));
        }
        
        setProductImages(images);
        
      } else {
        throw new Error("No product data received");
      }
      
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Unable to load product details from API");
      
      setProduct(getDefaultProduct(productId));
      setProductImages([
        buildProductImageUrl("", productId),
        buildProductImageUrl("", productId + 1),
        buildProductImageUrl("", productId + 2)
      ]);
      
    } finally {
      setLoading(false);
    }
  };

  const getDefaultProduct = (id) => {
    const products = [
      {
        id: id,
        name: "Milano Luxury Sofa",
        description: "Premium Italian leather sofa with solid oak frame. Handcrafted by master artisans with over 50 years of experience.",
        price: 2499,
        originalPrice: 2999,
        discount: 17,
        category: "Living Room",
        rating: 4.8,
        reviewCount: 124,
        inStock: true,
        stockCount: 15,
        arEnabled: true,
        material: "Premium Italian Leather",
        dimensions: "Width: 220cm, Depth: 95cm, Height: 85cm",
        weight: "120kg",
        color: "Charcoal Brown",
        features: [
          "Premium Italian Leather",
          "Solid Oak Frame",
          "High-Density Foam",
          "Stainless Steel Legs",
          "Removable Cushion Covers",
          "5-Year Warranty"
        ],
        careInstructions: [
          "Clean with leather-specific products",
          "Avoid direct sunlight",
          "Professional cleaning recommended",
          "Regular conditioning maintains quality"
        ],
        arGlb: "/ar-models/glb/low_poly__sofa.glb",
        arUsdz: "/ar-models/usdz/Low_Poly__Sofa.usdz"
      },
      {
        id: id,
        name: "Executive Office Chair",
        description: "Ergonomic office chair with lumbar support and adjustable features for maximum comfort during long work hours.",
        price: 899,
        originalPrice: 1099,
        discount: 18,
        category: "Office",
        rating: 4.6,
        reviewCount: 89,
        inStock: true,
        stockCount: 25,
        arEnabled: true,
        material: "Mesh & Leather",
        dimensions: "Width: 65cm, Depth: 65cm, Height: 120-135cm",
        weight: "25kg",
        color: "Black",
        features: [
          "Ergonomic Design",
          "Lumbar Support",
          "Adjustable Height",
          "360° Rotation",
          "Breathable Mesh",
          "5-Year Warranty"
        ],
        careInstructions: [
          "Wipe with damp cloth",
          "Avoid harsh chemicals",
          "Regular tightening of screws",
          "Professional assembly recommended"
        ],
        arGlb: "/ar-models/glb/low_poly__sofa.glb",
        arUsdz: "/ar-models/usdz/Low_Poly__Sofa.usdz"
      },
      {
        id: id,
        name: "Modern Dining Table",
        description: "Contemporary dining table with tempered glass top and stainless steel base. Perfect for modern interiors.",
        price: 1599,
        originalPrice: 1899,
        discount: 16,
        category: "Dining Room",
        rating: 4.7,
        reviewCount: 67,
        inStock: true,
        stockCount: 8,
        arEnabled: true,
        material: "Tempered Glass & Stainless Steel",
        dimensions: "Width: 180cm, Depth: 90cm, Height: 75cm",
        weight: "80kg",
        color: "Clear Glass with Chrome Base",
        features: [
          "Tempered Safety Glass",
          "Stainless Steel Frame",
          "Scratch Resistant",
          "Easy to Clean",
          "Seats 6-8 People",
          "Modern Design"
        ],
        careInstructions: [
          "Clean with glass cleaner",
          "Avoid abrasive materials",
          "Use coasters for hot items",
          "Regular dusting"
        ],
        arGlb: "/ar-models/glb/low_poly__sofa.glb",
        arUsdz: "/ar-models/usdz/Low_Poly__Sofa.usdz"
      }
    ];
    
    const index = (parseInt(id) || 1) % products.length;
    return { ...products[index], id: id };
  };

  const handleAddToCart = () => {
    if (!product) return;
    alert(`Added ${quantity} ${product.name}(s) to cart! Total: $${(product.price * quantity).toLocaleString()}`);
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      alert(`${product.name} added to favorites!`);
    } else {
      alert(`${product.name} removed from favorites!`);
    }
  };

  const handleViewInAR = () => {
    setShowARViewer(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name || 'Product',
        text: `Check out this amazing ${product?.name || 'product'} on LuxeFurniture`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Product link copied to clipboard!");
    }
  };

  const handleBuyNow = () => {
    if (!product) return;
    alert(`Redirecting to checkout for ${product.name}...`);
  };

  const handleQuantityChange = (action) => {
    if (!product) return;
    if (action === "increment" && quantity < (product.stockCount || 10)) {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrement" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} className="text-[var(--luxury-gold)]" />);
    }

    if (hasHalfStar) {
      stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-[var(--luxury-gold)]" />);
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FontAwesomeIcon key={`empty-${i}`} icon={faStarOutline} className="text-[var(--luxury-gold)]" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--soft-gray)] flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--luxury-gold)] mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading product details...</p>
            <p className="text-gray-500 text-sm">Product ID: {productId}</p>
          </div>
        </main>
      </div>
    );
  }

  if (error && !product) {
    return (
      <div className="min-h-screen bg-[var(--soft-gray)] flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-8">
            <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 text-4xl mb-4" />
            <h2 className="text-2xl font-bold text-[var(--charcoal)] mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push("/categories")}
              className="bg-[var(--luxury-gold)] text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
            >
              Browse Products
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--soft-gray)] flex flex-col">
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
            <button
              onClick={() => router.back()}
              className="hover:text-[var(--luxury-gold)] transition-colors flex items-center space-x-1"
            >
              <FontAwesomeIcon icon={faChevronLeft} className="text-xs" />
              <span>Back</span>
            </button>
            <span className="mx-2">/</span>
            <button
              onClick={() => router.push("/")}
              className="hover:text-[var(--luxury-gold)] transition-colors"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <button
              onClick={() => router.push("/categories")}
              className="hover:text-[var(--luxury-gold)] transition-colors"
            >
              {product?.category || "Products"}
            </button>
            <span className="mx-2">/</span>
            <span className="text-[var(--charcoal)] font-medium">
              {product?.name || "Product"}
            </span>
          </div>

          {/* Product Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Product Images */}
            <div>
              <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
                <img
                  src={productImages[selectedImage]}
                  alt={product?.name || "Product"}
                  className="w-full h-96 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop";
                  }}
                />
              </div>
              
              {productImages.length > 1 && (
                <div className="flex space-x-4 overflow-x-auto pb-2">
                  {productImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-[var(--luxury-gold)]"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product?.name || "Product"} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&h=150&fit=crop";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-[var(--charcoal)] mb-2">
                  {product?.name || "Product Name"}
                </h1>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center space-x-1">
                    {renderStars(product?.rating || 4.5)}
                    <span className="text-gray-600 ml-2">
                      {product?.rating || 4.5} ({product?.reviewCount || 0} reviews)
                    </span>
                  </div>
                  {product?.arEnabled && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      AR Ready
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    product?.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {product?.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-4 mb-4">
                  <p className="text-4xl font-bold text-[var(--charcoal)]">
                    ${product?.price?.toLocaleString() || "0"}
                  </p>
                  {product?.originalPrice && product?.originalPrice > product?.price && (
                    <>
                      <p className="text-2xl text-gray-400 line-through">
                        ${product?.originalPrice?.toLocaleString()}
                      </p>
                      {product?.discount && (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Save {product.discount}%
                        </span>
                      )}
                    </>
                    )}
                </div>
                <p className="text-gray-600 mb-6">
                  {product?.description || "No description available."}
                </p>
              </div>

              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[var(--charcoal)] mb-2">Details</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><strong>Material:</strong> {product?.material || "Not specified"}</li>
                    <li><strong>Dimensions:</strong> {product?.dimensions || "Not specified"}</li>
                    <li><strong>Weight:</strong> {product?.weight || "Not specified"}</li>
                    <li><strong>Color:</strong> {product?.color || "Not specified"}</li>
                    <li><strong>Category:</strong> {product?.category || "Not specified"}</li>
                  </ul>
                </div>

                {product?.features && product.features.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-[var(--charcoal)] mb-2">Features</h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2 text-gray-600">
                          <div className="w-2 h-2 bg-[var(--luxury-gold)] rounded-full"></div>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Quantity Selector */}
              <div>
                <label className="block font-semibold text-[var(--charcoal)] mb-2">Quantity</label>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => handleQuantityChange("decrement")}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange("increment")}
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                      disabled={quantity >= (product?.stockCount || 10)}
                    >
                      +
                    </button>
                  </div>
                  <span className="text-gray-600">
                    {product?.stockCount || 0} available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 bg-[var(--luxury-gold)] hover:bg-opacity-90 text-white py-4 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-[var(--luxury-gold)]/20 flex items-center justify-center space-x-2"
                    disabled={!product?.inStock}
                  >
                    <FontAwesomeIcon icon={faShoppingCart} />
                    <span>Add to Cart</span>
                  </button>
                  
                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-[var(--charcoal)] hover:bg-opacity-90 text-white py-4 rounded-xl font-semibold transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg flex items-center justify-center"
                    disabled={!product?.inStock}
                  >
                    Buy Now
                  </button>
                </div>
                
                <div className="flex gap-4">
                  <button
                    onClick={handleToggleFavorite}
                    className="flex-1 border-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)] hover:bg-[var(--luxury-gold)] hover:text-white py-3 rounded-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <FontAwesomeIcon
                      icon={isFavorite ? faHeartSolid : faHeartOutline}
                      className={isFavorite ? "text-red-500" : ""}
                    />
                    <span>{isFavorite ? "Remove Favorite" : "Add to Favorite"}</span>
                  </button>
                  
                  <button
                    onClick={handleShare}
                    className="flex-1 border-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)] hover:bg-[var(--luxury-gold)] hover:text-white py-3 rounded-xl transition-all flex items-center justify-center space-x-2"
                  >
                    <FontAwesomeIcon icon={faShareAlt} />
                    <span>Share</span>
                  </button>
                </div>

                {product?.arEnabled && (
                  <button
                    onClick={handleViewInAR}
                    className="w-full border-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)] py-4 rounded-xl hover:bg-[var(--luxury-gold)] hover:text-white transition-all flex items-center justify-center space-x-2 font-medium"
                  >
                    <FontAwesomeIcon icon={faCube} />
                    <span>View in Augmented Reality</span>
                  </button>
                )}
              </div>

              {/* Product Benefits */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faTruck} className="text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--charcoal)]">Free Shipping</p>
                    <p className="text-sm text-gray-600">On orders over $500</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--charcoal)]">5-Year Warranty</p>
                    <p className="text-sm text-gray-600">Full coverage</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faRedo} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--charcoal)]">30-Day Returns</p>
                    <p className="text-sm text-gray-600">Easy returns</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Tabs */}
          <div className="bg-white rounded-2xl shadow-sm mb-16">
            <div className="border-b border-gray-200">
              <nav className="flex">
                <button
                  className="px-6 py-4 font-semibold border-b-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)]"
                >
                  Description
                </button>
                <button
                  className="px-6 py-4 font-semibold text-gray-600 hover:text-[var(--charcoal)]"
                >
                  Features
                </button>
                <button
                  className="px-6 py-4 font-semibold text-gray-600 hover:text-[var(--charcoal)]"
                >
                  Reviews ({product?.reviewCount || 0})
                </button>
              </nav>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                {product?.description || "No detailed description available."}
              </p>
              
              {product?.features && product.features.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-[var(--charcoal)] mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[var(--luxury-gold)] rounded-full mt-2"></div>
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {product?.careInstructions && product.careInstructions.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold text-[var(--charcoal)] mb-3">Care Instructions:</h4>
                  <ul className="space-y-2">
                    {product.careInstructions.map((instruction, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-[var(--luxury-gold)] rounded-full mt-2"></div>
                        <span className="text-gray-600">{instruction}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* AR Viewer */}
      {showARViewer && product && (
        <ARViewer
          product={product}
          isOpen={showARViewer}
          onClose={() => setShowARViewer(false)}
        />
      )}
    </div>
  );
}