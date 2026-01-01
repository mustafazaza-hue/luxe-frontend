"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCube,
  faStar as faStarSolid,
  faHeart as faHeartSolid,
  faArrowRight,
  faMobileAlt,
  faRuler,
  faPaperPlane,
  faChevronDown,
  faUser,
  faSignOutAlt,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarRegular,
  faHeart as faHeartOutline,
} from "@fortawesome/free-regular-svg-icons";
import {
  faFacebook,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { categoriesApi } from "@/api/categories";
import { productsApi } from "@/api/products";
import Link from "next/link";
import { useRouter } from "next/navigation";

// استيراد المكونات
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

export default function HomePage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState({ categories: true, products: true });
  const [favorites, setFavorites] = useState([]);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesData, productsData] = await Promise.all([
        categoriesApi.getCategories(),
        productsApi.getFeaturedProducts(),
      ]);
      console.log("Categories data:", categoriesData);
      console.log("Products data:", productsData);
      setCategories(categoriesData);
      setFeaturedProducts(productsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading({ categories: false, products: false });
    }
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const renderStars = (rating = 5) => (
    <div className="flex">
      {[...Array(5)].map((_, i) => (
        <FontAwesomeIcon
          key={i}
          icon={i < rating ? faStarSolid : faStarRegular}
          className="text-[var(--luxury-gold)] text-sm"
        />
      ))}
    </div>
  );

  const getFallbackImage = (categoryName) => {
    const fallbacks = {
      "Living Room":
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop",
      Bedroom:
        "https://images.unsplash.com/photo-1540932239986-310128078ceb?w=600&h=400&fit=crop",
      "Dining Room":
        "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop",
      Office:
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&h=400&fit=crop",
      Outdoor:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop",
    };
    return (
      fallbacks[categoryName] ||
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop"
    );
  };

  const formatPrice = (price) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen bg-[var(--soft-gray)] flex flex-col">
      {/* ✅ إضافة Navbar في Home فقط */}
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-[var(--warm-beige)] to-[var(--soft-gray)] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--charcoal)] leading-tight">
              Experience Luxury
              <span className="text-[var(--luxury-gold)] block">in AR</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Discover premium furniture collections and visualize them in your
              space with cutting-edge Augmented Reality technology.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/categories" 
                className="bg-[var(--luxury-gold)] hover:bg-opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 text-center"
              >
                Shop Collection
              </Link>
              <button className="border-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)] hover:bg-[var(--luxury-gold)] hover:text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center space-x-2 transition-all">
                <FontAwesomeIcon icon={faCube} />
                <span>Try AR Experience</span>
              </button>
            </div>
          </div>
          <div className="hidden lg:block w-full lg:w-1/2 relative mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[var(--warm-beige)] z-10"></div>
            <img
              className="w-full h-auto max-h-96 object-cover rounded-lg shadow-2xl relative z-20"
              src="https://storage.googleapis.com/uxpilot-auth.appspot.com/21e3d8f47f-71203a4ae33e867a18ea.png"
              alt="Luxury furniture in living room"
            />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[var(--charcoal)] mb-6 text-center">
            Shop by Category
          </h2>
          {loading.categories ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-64 bg-gray-200 rounded-xl"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <Link 
                  key={cat.id} 
                  href="/categories"
                  className="group cursor-pointer relative overflow-hidden rounded-xl h-64 block"
                >
                  <img
                    src={cat.displayImage}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = getFallbackImage(cat.name);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-40 group-hover:opacity-30 transition-opacity"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-semibold">{cat.name}</h3>
                    <p className="text-sm opacity-90">
                      {cat.productCount} Products
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-[var(--charcoal)] mb-2">
                Featured Products
              </h2>
              <p className="text-gray-600">
                Handpicked premium furniture with AR experience
              </p>
            </div>
            <Link 
              href="/categories" 
              className="text-[var(--luxury-gold)] hover:text-[var(--luxury-copper)] font-semibold flex items-center space-x-2"
            >
              <span>View All</span>
              <FontAwesomeIcon icon={faArrowRight} />
            </Link>
          </div>
          {loading.products ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-64 bg-gray-200 rounded-xl"
                ></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((prod) => (
                <Link 
                  key={prod.id} 
                  href={`/product/${prod.id}`}
                  className="group bg-[var(--soft-gray)] rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow block"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={prod.displayImage || "/placeholder-furniture.svg"}
                      alt={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop";
                      }}
                    />
                    {prod.arEnabled && (
                      <div className="absolute top-4 right-4 bg-[var(--luxury-gold)] text-white px-3 py-1 rounded-full text-sm font-semibold">
                        AR Ready
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(prod.id);
                      }}
                      className="absolute top-4 left-4 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all z-10"
                    >
                      <FontAwesomeIcon
                        icon={
                          favorites.includes(prod.id)
                            ? faHeartSolid
                            : faHeartOutline
                        }
                        className={
                          favorites.includes(prod.id)
                            ? "text-red-500"
                            : "text-[var(--charcoal)]"
                        }
                      />
                    </button>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[var(--charcoal)] mb-2">
                      {prod.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{prod.material}</p>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-[var(--charcoal)]">
                        {formatPrice(prod.price)}
                      </span>
                      <div className="flex items-center space-x-1">
                        {renderStars()}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          // يمكنك إضافة منطق Add to Cart هنا
                        }}
                        className="flex-1 bg-[var(--luxury-gold)] text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
                      >
                        Add to Cart
                      </button>
                      {prod.arEnabled && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            // يمكنك إضافة منطق AR هنا
                          }}
                          className="px-4 border-2 border-[var(--luxury-gold)] text-[var(--luxury-gold)] hover:bg-[var(--luxury-gold)] hover:text-white rounded-lg transition-all"
                        >
                          <FontAwesomeIcon icon={faCube} />
                        </button>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Inspiration Section */}
      <section className="py-16 bg-[var(--soft-gray)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[var(--charcoal)] mb-4">
              Get Inspired
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover beautiful interior designs and get ideas for your own space
            </p>
          </div>
          <Link 
            href="/inspiration"
            className="block group"
          >
            <div className="relative h-96 rounded-xl overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?w=1200&h-600&fit=crop"
                alt="Interior Design Inspiration"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                <div className="p-8 text-white">
                  <h3 className="text-2xl font-bold mb-2">Modern Living Room Ideas</h3>
                  <p className="opacity-90">Explore 50+ stunning designs</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* AR Experience Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[var(--charcoal)] mb-4">
                Try Before You Buy with AR
              </h2>
              <p className="text-gray-600 mb-6">
                Visualize furniture in your own space using our augmented reality technology. 
                See how each piece fits and matches your decor before making a purchase.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--luxury-gold)] bg-opacity-10 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faMobileAlt} className="text-[var(--luxury-gold)]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--charcoal)]">Mobile Compatible</h4>
                    <p className="text-sm text-gray-600">Works on iOS and Android</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-[var(--luxury-gold)] bg-opacity-10 rounded-full flex items-center justify-center">
                    <FontAwesomeIcon icon={faRuler} className="text-[var(--luxury-gold)]" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-[var(--charcoal)]">Accurate Measurements</h4>
                    <p className="text-sm text-gray-600">Real-scale 3D models</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://storage.googleapis.com/uxpilot-auth.appspot.com/8880e2e1d1-317a18c368035e64e681.png"
                  alt="AR Experience Preview"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ✅ إضافة Footer في Home فقط */}
      <Footer />
    </div>
  );
}