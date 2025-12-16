import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  ShoppingCart,
  User,
  Search,
  Menu,
  Star,
  X,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import img from "./logo.jpg";
import POP from "../addC/add";

export default function MobileOptimizedProductsPage() {
  const [activeTab, setActiveTab] = useState("ALL");
  const navigate = useNavigate();
  const [popData, setPopData] = useState(null);
  const [pop, setpop] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const sliderRef = useRef(null);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth > 640);

  // Fetch products and parse images
  useEffect(() => {
    setLoading(true);
    fetch('https://kenzy-api.usif.space/product')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then((data) => {
        console.log("Raw data from backend:", data);
        
        const parsed = data.map((p) => {
          try {
            let images = [];
            
            // Check if images field exists and is an array
            if (Array.isArray(p.images)) {
              images = p.images;
            } 
            // Try parsing the image field
            else if (p.image) {
              console.log(`Processing image for ${p.name}:`, p.image);
              
              // Try to fix truncated JSON by adding closing bracket if needed
              let imageStr = p.image.trim();
              
              // If string starts with [ but doesn't end with ], try to fix it
              if (imageStr.startsWith('[') && !imageStr.endsWith(']')) {
                console.warn(`Truncated image data detected for ${p.name}`);
                // Try to extract valid URLs before truncation
                const urlMatches = imageStr.match(/https:\/\/[^\s"]+/g);
                if (urlMatches && urlMatches.length > 0) {
                  images = urlMatches;
                  console.log(`Extracted URLs:`, images);
                }
              } else {
                // Normal parsing
                imageStr = imageStr
                  .replace(/\\_/g, "") // Remove escaped underscores
                  .replace(/\\/g, ""); // Remove backslashes
                
                images = JSON.parse(imageStr);
              }
            }
            
            // Validate image URLs
            images = images.filter(url => {
              if (typeof url === 'string' && url.startsWith('http')) {
                return true;
              }
              console.warn(`Invalid URL filtered out:`, url);
              return false;
            });
            
            console.log(`Final images for ${p.name}:`, images);
            
            return {
              ...p,
              image: Array.isArray(images) && images.length > 0 ? images[0] : "",
              allImages: images,
              rating: p.rating || "0",
              reviews: p.reviews || "0",
              price: parseFloat(p.price) || 0,
              originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null
            };
          } catch (error) {
            console.error("Error parsing image for product:", p.name, error);
            console.error("Original image string:", p.image);
            return { 
              ...p, 
              image: "",
              allImages: [],
              rating: p.rating || "0",
              reviews: p.reviews || "0",
              price: parseFloat(p.price) || 0,
              originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null
            };
          }
        });
        
        console.log("Parsed products:", parsed);
        setProducts(parsed);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      });
  }, []);

  const handltokenC = async (e) => {
    e.preventDefault();
    console.log(e.target.id);

    try {
      const response = await fetch("https://kenzy-api.usif.space/extrct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token_user: window.localStorage.getItem("token"),
        }),
      });

      const result = await response.json();

      if (result.status === "success") {
        const pop = await fetch("https://kenzy-api.usif.space/select", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: e.target.id }),
        });

        const popResult = await pop.json();
        console.log("Data from backend:", popResult);

        // Store data first
        setPopData(popResult);
        // Then open modal
        setpop(false);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handltokenH = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://kenzy-api.usif.space/extrct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ "token_user": window.localStorage.getItem("token") }),
      });

      const result = await response.json();
      if (result.status === "success") {
        navigate("/Heart");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const slides = [
    {
      title: "Try ON ",
      description: "You Can Try Clothis Now With Our Ai",
    },
    {
      title: "Types Clothes",
      description: "All Types Of Clothes Men Woman Kids",
    },
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Touch handlers for swipe navigation
  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(id)) {
        newFavorites.delete(id);
      } else {
        newFavorites.add(id);
      }
      return newFavorites;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth > 640);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const tabs = ["ALL", "Men", "Woman", "Kides"];

  const filteredProducts =
    activeTab === "ALL"
      ? products
      : products.filter((product) => product.category === activeTab);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 h-32 sm:w-80 sm:h-80 bg-gradient-to-l from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-full blur-3xl animate-pulse delay-2000"></div>

        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-500/20 to-transparent transform -rotate-12 animate-pulse delay-500"></div>
        </div>

        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-6 sm:grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white/10 h-full"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile-Optimized Header */}
      <header className="relative z-50 backdrop-blur-sm bg-white/5 border-b border-white/10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="">
            <div className="w-8 text-white h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                         <div className="flex items-center space-x-4">
          <img src="https://i.ibb.co/QvKdRXDr/Whats-App-Image-2025-12-15-at-10-32-04-e58c092b.jpg"alt="" className="w-[66px] h-[43px]  bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center" />
            </div>
            </div>
              </div>
              <span className="font-bold text-lg sm:text-2xl text-white">
                Kenzy
              </span>
            </div>

            <nav className="hidden lg:flex items-center space-x-8">
              <Link
                to="/"
                className="block text-white/80 hover:text-white transition-colors py-2"
              >
                Home
              </Link>
              <Link
                to="/Contact"
                className="block text-white/80 hover:text-white transition-colors py-2"
              >
                Contact Us
              </Link>
            </nav>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all">
                <Link to="/search">
                  <Search className="w-5 h-5 text-gray-400" />
                </Link>
              </button>

              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all relative">
                <Link to="/cart">
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>

              </button>

              <button className="hidden sm:flex w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all">
                <Link to="/profile">
                  <User className="w-5 h-5" />
                </Link>
              </button>

              <button className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 transition-all relative">
                <Link to="/heart" className="">
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                </Link>

              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex items-center justify-center bg-black/20 backdrop-blur-lg rounded-[33px] mt-[231px]">
            <nav className="bg-black/95 border border-white/10 rounded-2xl px-8 py-6 space-y-4 text-center w-[90%] max-w-sm shadow-[0_0_3px_0_white]">
              <Link
                to="/"
                className="block text-white/80 hover:text-white transition-colors py-1.5"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/Contact"
                className="block text-white/80 hover:text-white transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact Us
              </Link>

              <div className="border-t border-white/10 pt-3">
                <Link
                  to="/profile"
                  className="block text-white/80 hover:text-white transition-colors py-1.5"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 sm:py-12 max-w-7xl mx-auto">
        {/* Hero Section with Touch Swipe */}
        <div className="mb-8 sm:mb-16">
          <div
            className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl sm:rounded-3xl overflow-hidden"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            ref={sliderRef}
          >
            <div className="relative h-64 sm:h-96 flex items-center justify-center">
              <div className="text-center z-10 px-4 transition-all duration-700 ease-in-out">
                <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4 tracking-wide">
                  {slides[currentSlide].title}
                </h3>
                <p className="text-sm sm:text-xl text-white/70 mb-6 sm:mb-8 max-w-2xl mx-auto transition-all duration-700 ease-in-out">
                  {slides[currentSlide].description}
                </p>
              </div>

              <div className="absolute inset-0">
                <div
                  className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-64 sm:h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse transition-all duration-1000"
                  style={{
                    transform: `translateX(${currentSlide * 20}px) translateY(${currentSlide * 10}px)`,
                  }}
                />
                <div
                  className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-48 sm:h-48 bg-gradient-to-l from-blue-500/10 to-cyan-500/10 rounded-full blur-2xl animate-pulse delay-1000 transition-all duration-1000"
                  style={{
                    transform: `translateX(${-currentSlide * 15}px) translateY(${-currentSlide * 12}px)`,
                  }}
                />
              </div>

              <div className="absolute bottom-8 sm:bottom-16 left-1/2 transform -translate-x-1/2 w-32 sm:w-64 h-1 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-300 ease-linear"
                  style={{
                    width: `${((currentSlide + 1) / slides.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <div className="absolute bottom-4 sm:bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 sm:space-x-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full border-2 transition-all duration-300 ${
                    i === currentSlide
                      ? "bg-white border-white scale-125"
                      : "bg-white/20 border-white/40 hover:bg-white/40 hover:scale-110"
                  }`}
                />
              ))}
            </div>

            {isLargeScreen && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-3 sm:left-6 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={nextSlide}
                  className="absolute right-3 sm:right-6 top-1/2 transform -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/20 hover:scale-110 transition-all duration-300"
                >
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </>
            )}

            <div className="absolute top-4 right-4 text-white/40 text-xs">
              <span className="hidden sm:inline">Auto-slide: 5s</span>
              <span className="sm:hidden">Swipe</span>
            </div>
          </div>
        </div>

        {/* Category Section */}
        <div className="mb-8 sm:mb-12">
          <div className="flex items-center justify-center mb-4 sm:hidden">
            <h2 className="text-white text-lg font-semibold">Categories</h2>
          </div>

          <div className="flex justify-center">
            <div className="flex space-x-1 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full p-1">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-medium text-xs sm:text-sm transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-white/20 text-white shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            <p className="text-white/60 mt-4">Loading products...</p>
          </div>
        ) : (
          <>
            <div className={pop ? "hidden" : "fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"}>
              {popData && <POP data={popData[0]} onClose={() => setpop(true)} />}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Link
                    key={product.id}
                    onClick={() => window.localStorage.setItem("product", product.id)}
                    to="/details_proudact"
                  >
                    <div className="group relative">
                      <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105">
                        {/* Product Image */}
                        <div className="relative w-full h-64 sm:h-80 overflow-hidden">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"


                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
                              }}
                            />
                          ) : (
                            <div className="w-full h-48 sm:h-64 bg-white/10 flex items-center justify-center">
                              <span className="text-white/40">No Image</span>
                            </div>
                          )}

                          {/* Discount Badge */}
                          {product.originalPrice && product.originalPrice > product.price && (
                            <div className="absolute top-[5px] right-3 w-[55px] h-[37px] sm:w-[55px] sm:h-[37px] rounded-[14px] bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white">
                              <span className="text-white font-bold text-sm sm:text-base">
                                -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="p-3 sm:p-6">
                          {/* Mobile: Only show prices and button */}
                          <div className="sm:hidden">
                            <h3 className="font-bold text-white text-sm mb-2 truncate">
                              {product.name}
                            </h3>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-lg font-bold text-white">
                                ${product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-sm text-white/40 line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>
                            <button
                              id={product.id}
                              onClick={(e) => {
                                e.preventDefault();
                                handltokenC(e);
                              }}
                              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2.5 rounded-full font-medium text-xs transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                              Add to Cart
                            </button>
                          </div>

                          {/* Desktop: Show all details */}
                          <div className="hidden sm:block">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs text-white/60 font-medium tracking-wide">
                                {product.category}
                              </span>
                              <div className="flex items-center space-x-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm text-white/80 font-medium">
                                  {product.rating}
                                </span>
                              </div>
                            </div>

                            <h3 className="font-bold text-white text-xl mb-3">
                              {product.name}
                            </h3>

                            <p className="text-xs text-white/50 mb-3">
                              ({product.reviews} reviews)
                            </p>

                            <div className="flex items-center space-x-3">
                              <span className="text-2xl font-bold text-white">
                                ${product.price}
                              </span>
                              {product.originalPrice && (
                                <span className="text-base text-white/40 line-through">
                                  ${product.originalPrice}
                                </span>
                              )}
                            </div>

                            <button
                              id={product.id}
                              onClick={(e) => {
                                e.preventDefault();
                                handltokenC(e);
                              }}
                              className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                            >
                              Add to Cart
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Floating particles */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className={`absolute w-1 h-1 bg-white/60 rounded-full animate-pulse`}
                            style={{
                              left: `${10 + i * 30}%`,
                              top: `${20 + (i % 2) * 60}%`,
                              animationDelay: `${i * 300}ms`,
                              animationDuration: `${1500 + i * 200}ms`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <p className="text-white/60 text-lg">No products found in this category</p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={`absolute w-1 h-1 bg-white/30 rounded-full animate-pulse`}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
              animationDelay: `${i * 600}ms`,
              animationDuration: `${2000 + i * 400}ms`,
            }}
          />
        ))}
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 from-20% to-black to-80% text-white z-0 py-8 sm:py-12 px-4 md:px-8 lg:px-16 min-h-[400px] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 animate-pulse"></div>
            <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transform -rotate-12 animate-pulse delay-500"></div>
          </div>

          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border-r border-white/10 h-full"></div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 z-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(31, 41, 55, 0.5) 0%, transparent 50%, rgba(0, 0, 0, 0.5) 70%)",
            top: "-50%",
          }}
        ></div>

        <div className="container mx-auto relative z-10">
          {/* Responsive Grid: 1 col mobile, 2 cols tablet, 4 cols desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Company Info Column */}
            <div className="text-center sm:text-left lg:col-span-1">
              <div className="flex items-center justify-center sm:justify-start mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full mr-2 flex items-center justify-center text-xl font-bold overflow-hidden">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
          <img src="https://i.ibb.co/QvKdRXDr/Whats-App-Image-2025-12-15-at-10-32-04-e58c092b.jpg"alt="" className="w-[66px] h-[43px]  bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center" />
            </div>
                </div>
                <span className="text-xl sm:text-2xl font-bold">Kenzy</span>
              </div>
              <p className="text-gray-300 text-sm mb-4 max-w-xs mx-auto sm:mx-0">
                Streamline your business's financial operations with our
                intuitive, scalable SaaS platform.
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                &copy; 2025 Kenzy. All rights reserved.
              </p>
            </div>

            {/* Quick Links - Hidden on mobile */}
            <div className="hidden sm:block lg:col-span-1">
              <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm block">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/Contact" className="text-gray-300 hover:text-white transition-colors text-sm block">
                    Contact
                  </Link>
                </li>

              </ul>
            </div>

            {/* Social Media Column */}
        

            {/* Credits Column */}
            <div className="text-center sm:text-left lg:col-span-1">
              <h3 className="text-white font-semibold text-lg mb-4">Credits</h3>
              <p className="text-gray-400 text-sm">
                MADE BY <span className="font-semibold text-white">Galaxy-Station</span>
              </p>
            </div>
          </div>

          {/* Mobile-only Quick Links at Bottom */}
          <div className="sm:hidden mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/Contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
