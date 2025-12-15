import React, { useEffect, useState } from "react";
import { Star, Heart, ShoppingCart, Truck, Shield, Plus, Minus, Search, Bell,Sparkles, User, Menu, X, Check } from 'lucide-react';
import { Link , useNavigate } from "react-router-dom";
import img from "../main/logo.jpg";
import Footer from "../footer/footer";

// ✅ Helper function to safely parse product images
const parseProductImages = (imageData) => {
  if (!imageData) return [];
  
  if (Array.isArray(imageData)) {
    return imageData.filter(url => typeof url === 'string' && url.startsWith('http'));
  }
  
  try {
    if (typeof imageData === 'string') {
      let imageStr = imageData.trim();
      
      // Handle truncated JSON
      if (imageStr.startsWith('[') && !imageStr.endsWith(']')) {
        console.warn('Detected truncated image data, extracting URLs...');
        const urlMatches = imageStr.match(/https?:\/\/[^\s"',\]]+/g);
        
        if (urlMatches && urlMatches.length > 0) {
          return urlMatches.map(url => url.replace(/[,\]}\)"']+$/, ''));
        }
        return [];
      }
      
      // Normal parsing
      imageStr = imageStr.replace(/\\_/g, "").replace(/\\/g, "");
      const parsed = JSON.parse(imageStr);
      return Array.isArray(parsed) 
        ? parsed.filter(url => typeof url === 'string' && url.startsWith('http'))
        : [];
    }
  } catch (error) {
    console.error('Error parsing images:', error);
    if (typeof imageData === 'string') {
      const urlMatches = imageData.match(/https?:\/\/[^\s"',\]]+/g);
      if (urlMatches) {
        return urlMatches.map(url => url.replace(/[,\]}\)"']+$/, ''));
      }
    }
  }
  
  return [];
};

// Toast Notification Component
const Toast = ({ message, icon, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-[10000] animate-slide-in">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-2xl flex items-center gap-2 sm:gap-3 border border-green-400/30 min-w-[280px] sm:min-w-[320px]">
        <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white rounded-full flex items-center justify-center animate-scale-in">
            {icon}
          </div>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-xs sm:text-sm">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
        >
          <X size={16} className="sm:hidden" />
          <X size={18} className="hidden sm:block" />
        </button>
      </div>
    </div>
  );
};

const DetailsProduct = () => {
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [color, setcolor] = useState(false);
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [allProducts, setAllProducts] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [toast, setToast] = useState(null);
  const [sizeUnit, setSizeUnit] = useState('standard');
  const [likedProducts, setLikedProducts] = useState(new Set());

  const standardSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const kgSizes = ['50KG', '60KG', '70KG', '80KG', '90kg', '100kg'];

  const showToast = (message, icon) => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3000);
  };

  // Fetch liked products when component mounts and when product changes
  useEffect(() => {
    const fetchLikedProducts = async () => {
      try {
  
      } catch (error) {
        console.error("Error fetching liked products:", error);
      }
    };

    fetchLikedProducts();
  }, [product]);

  const handleAddToCart = async () => {
    if (window.localStorage.getItem("token")) {
      const totalPrice = product.price * quantity;
      const token = await fetch("https://kenzy-api.usif.space/ extrct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token_user: window.localStorage.getItem("token"),
        }),
      });

      const result = await token.json();
      if(result.status === "success"){
        const payload = {
          id: product.id,
          name: product.name,
          price: totalPrice,
          size: selectedSize,
          quantity,
          token_user: window.localStorage.getItem("token")
        };
        
        const check = {
          id: product.id,
          token_user: window.localStorage.getItem("token")
        };

        try {
          const response = await fetch("https://kenzy-api.usif.space/ check", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(check),
          });

          const result = await response.json();

          if (result.add === "found") {
            showToast(
              "This Product is Added!",
              <Check size={20} className="text-red-600" />
            );
          } else {
              await fetch("https://kenzy-api.usif.space/ insert_cart", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });

            showToast(
              "Added to cart successfully!",
              <Check size={20} className="text-green-600" />
            );
          }
        } catch (error) {
          console.error("Error adding to cart:", error);
          showToast(
            "Failed to add to cart!",
            <X size={20} className="text-red-600" />
          );
        }
      } else {
        navigate("/login")
      }
    } else {
      navigate("/login")
    }
  };

  const handleBuyNow = async () => {
    if (window.localStorage.getItem("token")) {
      const totalPrice = product.price * quantity;
      const token = await fetch("https://kenzy-api.usif.space/ extrct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token_user: window.localStorage.getItem("token"),
        }),
      });

      const result = await token.json();
      if(result.status === "success"){
        const buyNowData = {
          id: product.id,
          name: product.name,
          price: totalPrice,
          size: selectedSize,
          quantity,
          image: product.image && product.image[0],
          category: product.category,
          token_user: window.localStorage.getItem("token")
        };
        
        try {
          // Save to localStorage instead of sending to server
          window.localStorage.setItem("buyNowProduct", JSON.stringify(buyNowData));
          
          showToast(
            "Proceeding to checkout!",
            <Check size={20} className="text-green-600" />
          );
          
          // Navigate to checkout after a short delay
          setTimeout(() => {
            navigate("/checkout");
          }, 500);
        } catch (error) {
          console.error("Error processing buy now:", error);
          showToast(
            "Failed to process order!",
            <X size={20} className="text-red-600" />
          );
        }
      } else {
        navigate("/login")
      }
    } else {
      navigate("/login")
    }
  };

  const handleAddToWishlist = async () => {
    if (window.localStorage.getItem("token")) {
      const tokenCheck = await fetch("https://kenzy-api.usif.space/ extrct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token_user: window.localStorage.getItem("token"),
        }),
      });

      const tokenResult = await tokenCheck.json();
      
      if (tokenResult.status === "success") {
        const payload = {
          id: product.id,
          token_user: window.localStorage.getItem("token"),
        };

        try {
          if (isWishlisted) {
            // Delete like
            const response = await fetch("https://kenzy-api.usif.space/ delete_like", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            if (response.ok) {
              setcolor(false)
              setIsWishlisted(false);
              setLikedProducts(prev => {
                const newSet = new Set(prev);
                newSet.delete(product.id);
                return newSet;
              });
              showToast(
                "Removed from wishlist!",
                <Heart size={20} className="text-gray-600" />
              );
            }
          } else {
            // Add like
            const response = await fetch("https://kenzy-api.usif.space/ insert_like", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
            });

            if (response.ok) {
              setIsWishlisted(true);
              setcolor(true)
              setLikedProducts(prev => new Set([...prev, product.id]));
              showToast(
                "Added to wishlist!",
                <Heart size={20} className="text-pink-600" />
              );
            }
          }
        } catch (error) {
          console.error("Error updating wishlist:", error);
          showToast(
            "Failed to update wishlist!",
            <X size={20} className="text-red-600" />
          );
        }
      } else {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  };

  // Toggle like for related products
  const handleToggleRelatedProductLike = async (productId, e) => {
    e.stopPropagation();
    
    if (!window.localStorage.getItem("token")) {
      navigate("/login");
      return;
    }

    const tokenCheck = await fetch("https://kenzy-api.usif.space/ extrct", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token_user: window.localStorage.getItem("token"),
      }),
    });

    const tokenResult = await tokenCheck.json();
    
    if (tokenResult.status === "success") {
      const isLiked = likedProducts.has(productId);
      const payload = {
        id: productId,
        token_user: window.localStorage.getItem("token"),
      };

      try {
        if (isLiked) {
          // Delete like
          const response = await fetch("https://kenzy-api.usif.space/ delete_like", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            setcolor(false)
            setIsWishlisted(false)
            setLikedProducts(prev => {
              const newSet = new Set(prev);
              newSet.delete(productId);
              return newSet;
            });
            showToast(
              "Removed from wishlist!",
              <Heart size={20} className="text-gray-600" />
            );
          }
        } else {
          // Add like
          const response = await fetch("https://kenzy-api.usif.space/ insert_like", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            setcolor(true)
            setLikedProducts(prev => new Set([...prev, productId]));
            showToast(
              "Added to wishlist!",
              <Heart size={20} className="text-pink-600" />
            );
          }
        }
      } catch (error) {
        console.error("Error toggling like:", error);
        showToast(
          "Failed to update wishlist!",
          <X size={20} className="text-red-600" />
        );
      }
    } else {
      navigate("/login");
    }
  };

  // ✅ UPDATED: Fetch single product with new image parsing
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const id = localStorage.getItem("product");
        if (!id) {
          console.error("No product id found in localStorage");
          setLoading(false);
          return;
        }

        // Fetch single product
        const productResponse = await fetch("https://kenzy-api.usif.space/ select", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });

        let productData = await productResponse.json();

        if (Array.isArray(productData)) {
          productData = productData[0];
        }

        // Fetch liked products for this user
        const token = localStorage.getItem("token");
        if (token) {
          const likeResponse = await fetch("https://kenzy-api.usif.space/ show_like", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ id: productData.id, token_user: token }),
          });

          const likeData = await likeResponse.json();
          if (likeData.status == "already_liked") {
              setcolor(true)
              setIsWishlisted(true)
          }
        
          if (Array.isArray(likeData)) {
            const likedIds = new Set(likeData.map(item => item.id || item.product_id));
            setLikedProducts(likedIds);
          }
        }

        // ✅ USE NEW PARSING FUNCTION
        if (productData && productData.image) {
          console.log('Original image data:', productData.image);
          productData.image = parseProductImages(productData.image);
          console.log('Parsed images:', productData.image);
        }

        setProduct(productData);
        setMainImage(productData.image && productData.image[0]);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, []);

  // ✅ UPDATED: Fetch all products with new image parsing
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const response = await fetch("https://kenzy-api.usif.space/ product", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        let productsData = await response.json();
        
        console.log('Raw products data:', productsData);

        // ✅ USE NEW PARSING FUNCTION FOR ALL PRODUCTS
        if (Array.isArray(productsData)) {
          productsData = productsData.map(p => {
            if (p.image) {
              const originalImage = p.image;
              p.image = parseProductImages(p.image);
              console.log(`Product ${p.name}:`, {
                original: originalImage,
                parsed: p.image
              });
            }
            return p;
          });
        }

        setAllProducts(productsData);
      } catch (error) {
        console.error("Error fetching all products:", error);
      }
    };

    fetchAllProducts();
  }, []);

  // Filter related products by category
  useEffect(() => {
    if (product && allProducts.length > 0) {
      const related = allProducts
        .filter(p => p.category === product.category && p.id !== product.id)
        .slice(0, 4);
      setRelatedProducts(related);
    }
  }, [product, allProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 border-solid"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center text-white py-20 bg-black min-h-screen">
        <p>Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {toast && (
        <Toast
          message={toast.message}
          icon={toast.icon}
          onClose={() => setToast(null)}
        />
      )}

      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            height: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: linear-gradient(90deg, rgb(147, 51, 234), rgb(59, 130, 246));
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: linear-gradient(90deg, rgb(126, 34, 206), rgb(37, 99, 235));
          }

          @keyframes slide-in {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }

          @keyframes scale-in {
            0% {
              transform: scale(0);
            }
            50% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }

          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }

          .animate-scale-in {
            animation: scale-in 0.5s ease-out;
          }
        `}
      </style>
      
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 sm:w-64 sm:h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <header className="relative z-10 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <button 
            className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
          <img src="https://i.ibb.co/QvKdRXDr/Whats-App-Image-2025-12-15-at-10-32-04-e58c092b.jpg"alt="" className="w-[66px] h-[43px]  bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white">Kenzy</span>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
            <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link>
          </nav>

          <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors bg-white/10 backdrop-blur-sm border border-white/20">
              <Link to="/search">
                <Search className="w-5 h-5 text-gray-400" />
              </Link>
            </button>
            

            <Link to="/cart">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors relative bg-white/10 backdrop-blur-sm border border-white/20">
              <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            </button>
            </Link>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors bg-white/10 backdrop-blur-sm border border-white/20">
              <Link to="/profile">
                <User className="w-5 h-5" />
              </Link>
            </button>
            
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors relative bg-white/10 backdrop-blur-sm border border-white/20">
              <Link to="/heart">
                <Heart className="w-5 h-5 text-gray-400" />
              </Link>        
            </button>
          </div>

          <div className="flex sm:hidden items-center space-x-3">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors bg-white/10 backdrop-blur-sm border border-white/20">
              <Link to="/search">
                <Search className="w-5 h-5 text-gray-400" />
              </Link>
            </button>
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors relative bg-white/10 backdrop-blur-sm border border-white/20">
              <ShoppingCart className="w-5 h-5 text-gray-400" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center text-white">2</span>
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden relative top-full left-0 right-0 bg-black border-b border-gray-800 z-[100]">
            <nav className="flex flex-col p-4 space-y-4">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">Home</Link>
              <Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link>

              
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-800">

                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors bg-white/10 backdrop-blur-sm border border-white/20">
                  <Link to="/profile">
                    <User className="w-5 h-5" />
                  </Link>
                </button>
                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors relative bg-white/10 backdrop-blur-sm border border-white/20">
                  <Link to="/heart">
                    <Heart className="w-5 h-5 text-gray-400" />
                  </Link>
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-purple-500 rounded-full text-xs flex items-center justify-center text-white">3</span>
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          <div className="space-y-4 sm:space-y-6">
            <div className="aspect-square bg-gradient-to-br from-gray-800/40 to-gray-700/60 rounded-xl sm:rounded-2xl border-2 border-purple-500/30 overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <img
                src={mainImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </div>

            <div className="flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 custom-scrollbar">
              {product.image &&
                product.image.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setMainImage(img);
                      setSelectedImage(index);
                    }}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl border-2 transition-all overflow-hidden ${
                      selectedImage === index
                        ? 'border-blue-400 shadow-lg shadow-blue-400/25'
                        : 'border-white/20 hover:border-purple-400/50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
            </div>
          </div>

          <div className="space-y-6 lg:space-y-8 animate-fade-in">
            <div className="text-gray-400 text-xs sm:text-sm overflow-x-auto whitespace-nowrap">
              Home &gt; {product.category} &gt; {product.name}
            </div>

            <div>
              <div className="text-purple-400 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2">
                {product.category}
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
                {product.name}
              </h1>
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-400">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-400 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 sm:w-5 sm:h-5 ${i < Math.floor(product.rating) ? 'fill-current' : ''}`} />
                ))}
              </div>
              <span className="text-gray-300 text-sm sm:text-base">{product.rating} ({product.reviews} Reviews)</span>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
              <h3 className="font-semibold mb-3 text-purple-300 text-sm sm:text-base">Description</h3>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
                {product.caption}
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-purple-300 text-sm sm:text-base">Select Size</h3>
                
                <div className="flex items-center bg-white/5 rounded-lg p-1 border border-white/10">
                  <button
                    onClick={() => {
                      setSizeUnit('standard');
                      setSelectedSize('M');
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                      sizeUnit === 'standard'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Standard
                  </button>
                  <button
                    onClick={() => {
                      setSizeUnit('kg');
                      setSelectedSize('1kg');
                    }}
                    className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
                      sizeUnit === 'kg'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    KG
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {(sizeUnit === 'standard' ? standardSizes : kgSizes).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl border-2 font-medium transition-all text-sm sm:text-base ${
                      selectedSize === size
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-transparent text-white shadow-lg shadow-purple-500/25'
                        : 'border-white/20 hover:border-purple-400/50 hover:bg-white/5'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <span className="font-semibold text-purple-300 text-sm sm:text-base">Quantity:</span>
              <div className="flex items-center space-x-3 bg-white/5 rounded-lg p-2 border border-white/10 w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 sm:w-12 text-center font-medium text-sm sm:text-base">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex space-x-3 sm:space-x-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl flex items-center justify-center space-x-2 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25 text-sm sm:text-base"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Add to Cart</span>
                </button>
                <button
                  onClick={handleAddToWishlist}
                  className={`p-3 sm:p-4 rounded-xl border-2 transition-all ${
                    isWishlisted
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 border-red-600 text-white shadow-lg shadow-red-500/25'
                      : 'border-white/20 hover:border-pink-400/50 hover:bg-white/5'
                  } ${color ? "bg-gradient-to-r from-red-600 to-pink-600 border-red-600 text-white shadow-lg shadow-red-500/25":"border-white/20 hover:border-pink-400/50 hover:bg-white/5" }`}
                >
                  <Heart className={`w-5 h-5 sm:w-6 sm:h-6 ${isWishlisted ? 'fill-current' : ''}${color ? "fill-current":""}`} />
                </button>
              </div>
              <button 
                onClick={handleBuyNow}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl flex items-center justify-center space-x-2 transition-all transform hover:scale-105 shadow-lg shadow-purple-500/25 text-sm sm:text-base"
              >
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Buy Now</span>
              </button>
              <button 
                onClick={() => {
                  // Save first image to localStorage
                  if (product.image && product.image[0]) {
                    
                    localStorage.setItem("tryOnImage", product.image[product.image.length - 1]);
                    showToast(
                      "Image saved! Redirecting to Try On...",
                      <Check size={20} className="text-green-600" />
                    );
                    setTimeout(() => {
                      navigate("/try_on");
                    }, 500);
                  } else {
                    showToast(
                      "No image available for try on!",
                      <X size={20} className="text-red-600" />
                    );
                  }
                }}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-3 sm:py-4 px-6 sm:px-8 rounded-xl flex items-center justify-center space-x-2 transition-all transform hover:scale-105 shadow-lg shadow-indigo-500/25 text-sm sm:text-base"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Try On</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="flex items-center space-x-3 bg-white/5 p-3 sm:p-4 rounded-xl border border-white/10">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Free Shipping</div>
                  <div className="text-xs sm:text-sm text-gray-400">3-4 Working Days</div>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-white/5 p-3 sm:p-4 rounded-xl border border-white/10">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400 flex-shrink-0" />
                <div>
                  <div className="font-medium text-sm sm:text-base">Secure Payment</div>
                  <div className="text-xs sm:text-sm text-gray-400">100% Protected</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16 lg:mt-20">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct.id}
                  className="group bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden hover:border-purple-400/50 transition-all hover:shadow-lg hover:shadow-purple-500/20 cursor-pointer"
                  onClick={() => {
                    localStorage.setItem("product", relatedProduct.id);
                    window.location.reload();
                  }}
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={relatedProduct.image && relatedProduct.image[0]}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-3 sm:p-4">
                    <div className="text-purple-400 text-xs font-semibold uppercase mb-1">
                      {relatedProduct.category}
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                      {relatedProduct.name}
                    </h3>
                    
                    <div className="flex items-center space-x-1 mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(relatedProduct.rating || 0) ? 'fill-current' : ''
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-400">
                        ({relatedProduct.rating || 0})
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-lg sm:text-xl font-bold text-blue-400">
                        ${relatedProduct.price}
                      </span>
                      {relatedProduct.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ${relatedProduct.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default DetailsProduct;
