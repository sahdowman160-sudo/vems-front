import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoIosArrowBack, IoIosSearch, IoIosHeart, IoIosClose } from 'react-icons/io';
import { Heart, Eye, Plus, Star, Sparkles } from 'lucide-react';

const AddInspoPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

  // Fetch liked products
  useEffect(() => {
    const fetchLikedProducts = async () => {
      setLoading(true);
      try {
        const token = window.localStorage.getItem("token");
        
        const response = await fetch('http://127.0.0.1:8000/like', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token_user: token }),
        });

        const data = await response.json();
        
        if (data && Array.isArray(data)) {
          const parsed = data.map((p) => {
            try {
              let images = [];
              
              // Check if images field exists and is an array
              if (Array.isArray(p.images)) {
                images = p.images;
              } 
              // Try to parse the image field if it exists
              else if (p.image && typeof p.image === 'string') {
                // Clean up the string
                let imageStr = p.image.trim();
                
                // Check if it starts with [ but doesn't end with ] (truncated)
                if (imageStr.startsWith('[') && !imageStr.endsWith(']')) {
                  console.warn("Truncated image data detected for product:", p.name);
                  // Try to extract any complete URLs from the truncated string
                  const urlMatches = imageStr.match(/https?:\/\/[^\s",]*/g);
                  if (urlMatches && urlMatches.length > 0) {
                    images = urlMatches;
                  }
                } else {
                  // Normal case - try to parse JSON
                  imageStr = imageStr.replace(/\\_/g, "").replace(/\\/g, "");
                  images = JSON.parse(imageStr);
                }
              }
              
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
              console.error("Error parsing image for product:", p.name, error, "Raw image data:", p.image);
              // Fallback: try to extract any URL from the string
              let fallbackImage = "";
              if (p.image && typeof p.image === 'string') {
                const urlMatch = p.image.match(/https?:\/\/[^\s",]*/);
                if (urlMatch) {
                  fallbackImage = urlMatch[0];
                }
              }
              return { 
                ...p, 
                image: fallbackImage,
                allImages: fallbackImage ? [fallbackImage] : [],
                rating: p.rating || "0",
                reviews: p.reviews || "0",
                price: parseFloat(p.price) || 0,
                originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null
              };
            }
          });
          setProducts(parsed);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching liked products:', error);
        setLoading(false);
      }
    };

    fetchLikedProducts();
  }, []);

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

  const handleDeleteLike = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const token = window.localStorage.getItem("token");
      
      const response = await fetch('http://127.0.0.1:8000/delete_like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: productId,
          token_user: token 
        }),
      });

      if (response.ok) {
        // Remove the product from the list
        setProducts((prevProducts) => 
          prevProducts.filter((product) => product.id !== productId)
        );
      }
    } catch (error) {
      console.error('Error deleting like:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans p-4 relative">
      {/* Background Blur Effect */}
      <div className="absolute inset-0">
        {/* Stars */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-32 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-40 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-60 right-60 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
        
        {/* Moving squares */}
        <div className="absolute top-32 right-40 w-8 h-8 bg-gradient-to-br from-blue-300 to-purple-300 opacity-80 animate-pulse transform rotate-45 hover:rotate-0 transition-transform duration-1000">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-300 animate-spin" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}></div>
        </div>
        <div className="absolute bottom-32 left-32 w-6 h-6 bg-gradient-to-br from-purple-300 to-pink-300 opacity-60 animate-pulse transform rotate-45 hover:rotate-0 transition-transform duration-1000" style={{animationDelay: '0.5s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-pink-300 animate-spin" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', animationDelay: '0.5s'}}></div>
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Curved light streaks */}
        <div className="absolute top-1/2 left-0 w-96 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rotate-12 opacity-60 blur-sm"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-1 bg-gradient-to-l from-transparent via-blue-400 to-transparent -rotate-12 opacity-60 blur-sm"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 lg:p-8">
        <Link to="/" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 shadow-lg">
          <IoIosArrowBack className="text-xl sm:text-2xl text-white" />
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Kenzy</h1>
        </div>
      </div>

      {/* Subtitle */}
      <p className="relative z-10 text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-4 sm:px-0">Your favorite products</p>

      {/* Loading State */}
      {loading ? (
        <div className="relative z-10 text-center py-16">
          <div className="inline-block w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-white/60 mt-4">Loading your favorites...</p>
        </div>
      ) : (
        <>
          {/* Products Grid - Same style as main.jsx */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-0">
            {products.length > 0 ? (
              products.map((product) => (
                <Link
                  key={product.id}
                  onClick={() => window.localStorage.setItem("product", product.id)}
                  to="/details_proudact"
                >
                  <div className="group relative">
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105">
                      {/* Product Image */}
                      <div className="relative overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="w-full h-48 sm:h-64 bg-white/10 flex items-center justify-center">
                            <span className="text-white/40">No Image</span>
                          </div>
                        )}

                        {/* Delete Like Button */}
                        <button
                          onClick={(e) => handleDeleteLike(e, product.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/80 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-red-600 transition-all z-10 shadow-lg"
                        >
                          <IoIosClose className="text-2xl" />
                        </button> 
                      </div>

                      {/* Product Info */}
                      <div className="p-4 sm:p-6">
                        {/* Full info for medium and larger screens */}
                        <div className="hidden sm:block">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-white/60 font-medium tracking-wide">
                              {product.category}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs sm:text-sm text-white/80 font-medium">
                                {product.rating}
                              </span>
                            </div>
                          </div>

                          <h3 className="font-bold text-white text-lg sm:text-xl mb-3">
                            {product.name}
                          </h3>

                          <p className="text-xs text-white/50 mb-3">
                            ({product.reviews} reviews)
                          </p>

                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <span className="text-xl sm:text-2xl font-bold text-white">
                              ${product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm sm:text-base text-white/40 line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Simplified info for small screens - only image, prices, and add to cart */}
                        <div className="sm:hidden">
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="text-lg font-bold text-white">
                              ${product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-white/40 line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95">
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* Floating particles */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse"
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
                <Heart className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/60 text-lg">No favorite products yet</p>
                <p className="text-white/40 text-sm mt-2">Start adding products to your favorites!</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Floating Action Button */}
      {products.length > 0 && (
        <div className="sticky bottom-4 sm:bottom-6 z-20 flex justify-center w-full mt-4 mb-4 px-4 sm:px-0">
          <div className="flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 shadow-lg">
            <div className="p-2 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full mr-3">
              <IoIosHeart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            </div>
            <span className="text-xs sm:text-sm font-medium">{products.length} Favorite{products.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full absolute left-0 bg-gradient-to-b from-gray-900 from-20% to-black to-80% text-white py-12 px-4 md:px-8 lg:px-16 min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
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

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="md:col-span-1 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-2xl font-bold">Kenzy</span>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Streamline your business's financial operations with our intuitive, scalable SaaS platform.
              </p>
              <p className="text-gray-500 text-sm">&copy; 2025 Kenzy. All rights reserved.</p>
            </div>

            <div className="lg:col-span-1 flex justify-center items-center">
              <ul className='flex gap-[22px] justify-center text-[25px]'>
                <li className="mb-2 text-gray-300 font-semibold"><i className="fa-brands fa-facebook-f"></i></li>
                <li className="mb-2 text-gray-300 font-semibold"><i className="fa-brands fa-instagram"></i></li>
                <li className="mb-2 text-gray-300 font-semibold"><i className="fa-brands fa-tiktok"></i></li>
                <li className="mb-2 text-gray-300 font-semibold"><i className="fa-brands fa-x-twitter"></i></li>
              </ul>
            </div>

            <div className='flex justify-center items-center'>
              <p className='text-gray-500 text-sm'>
                MADE BY <span className='font-semibold text-white'>Galaxy-Station</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AddInspoPage;
              // Try to parse the image field if it exists
              else if (p.image && typeof p.image === 'string') {
                // Clean up the string
                let imageStr = p.image.trim();
                
                // Check if it starts with [ but doesn't end with ] (truncated)
                if (imageStr.startsWith('[') && !imageStr.endsWith(']')) {
                  console.warn("Truncated image data detected for product:", p.name);
                  // Try to extract any complete URLs from the truncated string
                  const urlMatches = imageStr.match(/https?:\/\/[^\s",]*/g);
                  if (urlMatches && urlMatches.length > 0) {
                    images = urlMatches;
                  }
                } else {
                  // Normal case - try to parse JSON
                  imageStr = imageStr.replace(/\\_/g, "").replace(/\\/g, "");
                  images = JSON.parse(imageStr);
                }
              }
              
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
              console.error("Error parsing image for product:", p.name, error, "Raw image data:", p.image);
              // Fallback: try to extract any URL from the string
              let fallbackImage = "";
              if (p.image && typeof p.image === 'string') {
                const urlMatch = p.image.match(/https?:\/\/[^\s",]*/);
                if (urlMatch) {
                  fallbackImage = urlMatch[0];
                }
              }
              return { 
                ...p, 
                image: fallbackImage,
                allImages: fallbackImage ? [fallbackImage] : [],
                rating: p.rating || "0",
                reviews: p.reviews || "0",
                price: parseFloat(p.price) || 0,
                originalPrice: p.originalPrice ? parseFloat(p.originalPrice) : null
              };
            }
          });
          setProducts(parsed);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching liked products:', error);
        setLoading(false);
      }
    };

    fetchLikedProducts();
  }, []);

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

  const handleDeleteLike = async (e, productId) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const token = window.localStorage.getItem("token");
      
      const response = await fetch('https://kenzy-api.usif.space/delete_like', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id: productId,
          token_user: token 
        }),
      });

      if (response.ok) {
        // Remove the product from the list
        setProducts((prevProducts) => 
          prevProducts.filter((product) => product.id !== productId)
        );
      }
    } catch (error) {
      console.error('Error deleting like:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans p-4 relative">
      {/* Background Blur Effect */}
      <div className="absolute inset-0">
        {/* Stars */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-32 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-40 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-60 right-60 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
        
        {/* Moving squares */}
        <div className="absolute top-32 right-40 w-8 h-8 bg-gradient-to-br from-blue-300 to-purple-300 opacity-80 animate-pulse transform rotate-45 hover:rotate-0 transition-transform duration-1000">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-300 animate-spin" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}></div>
        </div>
        <div className="absolute bottom-32 left-32 w-6 h-6 bg-gradient-to-br from-purple-300 to-pink-300 opacity-60 animate-pulse transform rotate-45 hover:rotate-0 transition-transform duration-1000" style={{animationDelay: '0.5s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-pink-300 animate-spin" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', animationDelay: '0.5s'}}></div>
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Curved light streaks */}
        <div className="absolute top-1/2 left-0 w-96 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rotate-12 opacity-60 blur-sm"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-1 bg-gradient-to-l from-transparent via-blue-400 to-transparent -rotate-12 opacity-60 blur-sm"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-4 sm:p-6 lg:p-8">
        <Link to="/" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-300 shadow-lg">
          <IoIosArrowBack className="text-xl sm:text-2xl text-white" />
        </Link>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">VEMS</h1>
        </div>
      </div>

      {/* Subtitle */}
      <p className="relative z-10 text-sm sm:text-base text-gray-400 mb-4 sm:mb-6 px-4 sm:px-0">Your favorite products</p>

      {/* Loading State */}
      {loading ? (
        <div className="relative z-10 text-center py-16">
          <div className="inline-block w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          <p className="text-white/60 mt-4">Loading your favorites...</p>
        </div>
      ) : (
        <>
          {/* Products Grid - Same style as main.jsx */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 px-4 sm:px-0">
            {products.length > 0 ? (
              products.map((product) => (
                <Link
                  key={product.id}
                  onClick={() => window.localStorage.setItem("product", product.id)}
                  to="/details_proudact"
                >
                  <div className="group relative">
                    <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-500 hover:scale-105">
                      {/* Product Image */}
                      <div className="relative overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-48 sm:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/300x400?text=No+Image";
                            }}
                          />
                        ) : (
                          <div className="w-full h-48 sm:h-64 bg-white/10 flex items-center justify-center">
                            <span className="text-white/40">No Image</span>
                          </div>
                        )}

                        {/* Delete Like Button */}
                        <button
                          onClick={(e) => handleDeleteLike(e, product.id)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-500/80 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-red-600 transition-all z-10 shadow-lg"
                        >
                          <IoIosClose className="text-2xl" />
                        </button> 
                      </div>

                      {/* Product Info */}
                      <div className="p-4 sm:p-6">
                        {/* Full info for medium and larger screens */}
                        <div className="hidden sm:block">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-white/60 font-medium tracking-wide">
                              {product.category}
                            </span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-xs sm:text-sm text-white/80 font-medium">
                                {product.rating}
                              </span>
                            </div>
                          </div>

                          <h3 className="font-bold text-white text-lg sm:text-xl mb-3">
                            {product.name}
                          </h3>

                          <p className="text-xs text-white/50 mb-3">
                            ({product.reviews} reviews)
                          </p>

                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <span className="text-xl sm:text-2xl font-bold text-white">
                              ${product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm sm:text-base text-white/40 line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Simplified info for small screens - only image, prices, and add to cart */}
                        <div className="sm:hidden">
                          <div className="flex items-center space-x-2 mb-4">
                            <span className="text-lg font-bold text-white">
                              ${product.price}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-white/40 line-through">
                                ${product.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>

                        <button className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95">
                          Add to Cart
                        </button>
                      </div>
                    </div>

                    {/* Floating particles */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-white/60 rounded-full animate-pulse"
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
                <Heart className="w-16 h-16 mx-auto mb-4 text-white/20" />
                <p className="text-white/60 text-lg">No favorite products yet</p>
                <p className="text-white/40 text-sm mt-2">Start adding products to your favorites!</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Floating Action Button */}
      {products.length > 0 && (
        <div className="sticky bottom-4 sm:bottom-6 z-20 flex justify-center w-full mt-4 mb-4 px-4 sm:px-0">
          <div className="flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-black/70 backdrop-blur-xl border border-white/20 shadow-lg">
            <div className="p-2 bg-gradient-to-br from-red-500/20 to-pink-500/20 rounded-full mr-3">
              <IoIosHeart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
            </div>
            <span className="text-xs sm:text-sm font-medium">{products.length} Favorite{products.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full absolute left-0 bg-gradient-to-b from-gray-900 from-20% to-black to-80% text-white py-12 px-4 md:px-8 lg:px-16 min-h-[400px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          
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

        <div className="container mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="md:col-span-1 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span className="text-2xl font-bold">VEMS</span>
              </div>
              <p className="text-gray-300 text-sm mb-4">
                Streamline your business's financial operations with our intuitive, scalable SaaS platform.
              </p>
              <p className="text-gray-500 text-sm">&copy; 2025 VEMS. All rights reserved.</p>
            </div>

            <div className="lg:col-span-1 flex justify-center items-center">
              <ul className='flex gap-[22px] justify-center text-[25px]'>
                <li className="mb-2 text-gray-300 font-semibold"><i className="fa-brands fa-facebook-f"></i></li>
                <li className="mb-2 text-gray-300 font-semibold"><i className="fa-brands fa-instagram"></i></li>
                <li className="mb-2 text-gray-300 font-semibold"><i className="fa-brands fa-tiktok"></i></li>
                <li className="mb-2 text-gray-300 font-semibold"><i className="fa-brands fa-x-twitter"></i></li>
              </ul>
            </div>

            <div className='flex justify-center items-center'>
              <p className='text-gray-500 text-sm'>
                MADE BY <span className='font-semibold text-white'>SHADOW</span>
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AddInspoPage;
