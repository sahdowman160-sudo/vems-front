import React, { useState } from 'react';
import { Search, X, Loader, Heart, Eye, Plus, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import POP from "../addC/add";

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(false);
  const [favorites, setFavorites] = useState(new Set());
  const [popData, setPopData] = useState(null);
  const [pop, setpop] = useState(true);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const response = await fetch('https://vems-api.yousseif.me/psearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: query })
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch results');
      }

      const data = await response.json();
      
      // Parse products with HTML entity decoding and truncation handling
      const parsed = data.map((p) => {
        try {
          let images = [];
          
          if (Array.isArray(p.images)) {
            images = p.images;
          } else if (p.image && typeof p.image === 'string') {
            // First, decode HTML entities
            let imageStr = p.image
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&#39;/g, "'")
              .trim();
            
            // Check if it starts with [ but doesn't end with ] (truncated)
            if (imageStr.startsWith('[') && !imageStr.endsWith(']')) {
              console.warn("Truncated image data detected for product:", p.name);
              // Try to extract any complete URLs from the truncated string
              const urlMatches = imageStr.match(/https?:\/\/[^\s",\]]+/g);
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
            // Decode HTML entities first
            let decoded = p.image
              .replace(/&quot;/g, '"')
              .replace(/&amp;/g, '&')
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&#39;/g, "'");
            
            const urlMatch = decoded.match(/https?:\/\/[^\s",\]]+/);
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
      
      setResults(Array.isArray(parsed) ? parsed : []);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setSearched(false);
    setError(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handltokenH = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("https://vems-api.yousseif.me/extrct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({"token_user": window.localStorage.getItem("token")}),
      });

      const result = await response.json();
      if (result.status === "success") {
        navigate("/Heart")
      } else {
        navigate("/login")
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
        const pop = await fetch("https://vems-api.yousseif.me/select", {
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

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Animated background elements */}
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

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white/70 text-sm font-medium">
              <div className="w-2 h-2 bg-white/60 rounded-full mr-2"></div>
              Kenzy
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 bg-clip-text mb-4">
            Search
          </h1>
          <p className="text-white/60 text-lg">Find products across our catalog</p>
        </div>

        {/* Search Bar */}
        <div className="mb-12">
          <div className="relative group max-w-4xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl overflow-hidden transition-all duration-300 group-hover:bg-white/15 group-hover:border-white/30">
              <Search className="absolute left-6 w-5 h-5 text-white/40" />
              
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for products..."
                className="w-full pl-16 pr-16 py-5 bg-transparent text-white placeholder-white/40 outline-none text-lg"
              />
              
              {query && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-20 p-2 text-white/40 hover:text-white/80 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
              
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="absolute right-3 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Search'}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
              <p className="text-white/60">Searching products...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 text-center">
            <p className="text-red-400 font-medium">Error: {error}</p>
          </div>
        )}

        {!loading && searched && !error && results.length === 0 && (
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-white/60 text-lg mb-2">No products found</p>
            <p className="text-white/40 text-sm">Try searching with different keywords</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <p className="text-white/60 mb-6 text-center">Found {results.length} result{results.length !== 1 ? 's' : ''}</p>
            
            {/* POP Modal */}
            <div className={pop ? "hidden" : "fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"}>
              {popData && <POP data={popData[0]} onClose={() => setpop(true)} />}
            </div>

            {/* Product Grid - Same as main page */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
              {results.map((product) => (
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
                              console.error(`Image failed to load for ${product.name}`, product.image);
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

                        {/* Overlay Actions */}

                      </div>

                      {/* Product Info */}
                      <div className="p-4 sm:p-6">
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

                        <button 
                          id={product.id} 
                          onClick={handltokenC} 
                          className="w-full mt-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-full font-medium text-sm transition-all duration-300 hover:scale-105 active:scale-95"
                        >
                          Add to Cart
                        </button>
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
              ))}
            </div>
          </>
        )}

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white/40 rounded-full animate-pulse"
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 500}ms`,
                animationDuration: `${2000 + i * 300}ms`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-16 pb-8">
        <p className="text-white/40 text-sm text-center">
          ©2025 Kenzy • Built by{' '}
          <span className="text-white/60 hover:text-white/80 transition-colors cursor-pointer">
            Galaxy-Station
          </span>
        </p>
      </div>
    </div>
  );
}
