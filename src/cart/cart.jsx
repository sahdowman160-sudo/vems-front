import { useState, useEffect } from 'react';
import { ArrowLeft, Minus, Plus, X } from 'lucide-react';
import { Link, useNavigate } from "react-router-dom";

export default function ShoppingCart() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cart items when component mounts
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No token found in localStorage");
          setLoading(false);
          return;
        }

        const response = await fetch("https://kenzy-api.usif.space/cart_user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token_user: token }),
        });

        const data = await response.json();
        console.log("Raw cart data from API:", data);
        
        // Process cart items from API response with improved image parsing
        if (Array.isArray(data)) {
          const processedItems = data.map(item => {
            let processedImage = "";
            
            console.log(`Processing item: ${item.name || 'Unknown'}`);
            console.log(`Raw image data:`, item.image);
            console.log(`Image type:`, typeof item.image);
            
            try {
              if (typeof item.image === 'string') {
                // First, decode HTML entities
                let imageStr = item.image
                  .replace(/&quot;/g, '"')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&#39;/g, "'")
                  .trim();
                
                console.log("After HTML decode:", imageStr);
                
                // Check if it's truncated JSON (starts with [ but doesn't end with ])
                if (imageStr.startsWith('[') && !imageStr.endsWith(']')) {
                  console.warn("Truncated image data detected for item:", item.name);
                  console.log("Truncated string:", imageStr);
                  
                  // Extract any complete URLs from the truncated string
                  const urlMatches = imageStr.match(/https?:\/\/[^\s",\]]+/g);
                  console.log("URL matches found:", urlMatches);
                  
                  if (urlMatches && urlMatches.length > 0) {
                    processedImage = urlMatches[0];
                    console.log("Using first URL:", processedImage);
                  }
                } else if (imageStr.startsWith('[') || imageStr.startsWith('{')) {
                  // Try to parse as JSON
                  console.log("Attempting to parse as JSON");
                  try {
                    const parsedImages = JSON.parse(imageStr);
                    if (Array.isArray(parsedImages)) {
                      processedImage = parsedImages.length > 0 ? parsedImages[0] : "";
                    } else if (typeof parsedImages === 'string') {
                      processedImage = parsedImages;
                    }
                    console.log("Parsed image:", processedImage);
                  } catch (parseError) {
                    console.error("JSON parse failed:", parseError);
                    // Try to extract URL even if parse fails
                    const urlMatch = imageStr.match(/https?:\/\/[^\s",\]]+/);
                    if (urlMatch) {
                      processedImage = urlMatch[0];
                      console.log("Extracted URL from failed parse:", processedImage);
                    }
                  }
                } else if (imageStr.startsWith('http')) {
                  // Direct URL string
                  processedImage = imageStr;
                  console.log("Direct URL:", processedImage);
                } else {
                  // Try to find any URL in the string
                  const urlMatch = imageStr.match(/https?:\/\/[^\s",\]]+/);
                  if (urlMatch) {
                    processedImage = urlMatch[0];
                    console.log("Found URL in string:", processedImage);
                  }
                }
              } else if (Array.isArray(item.image)) {
                // Already an array
                processedImage = item.image.length > 0 ? item.image[0] : "";
                console.log("Array image:", processedImage);
              }
            } catch (error) {
              console.error("Error parsing image for item:", item.name, error);
              console.log("Raw image data on error:", item.image);
              
              // Fallback: try to extract any URL from the string
              if (item.image && typeof item.image === 'string') {
                // Decode HTML entities first
                let decoded = item.image
                  .replace(/&quot;/g, '"')
                  .replace(/&amp;/g, '&')
                  .replace(/&lt;/g, '<')
                  .replace(/&gt;/g, '>')
                  .replace(/&#39;/g, "'");
                
                const urlMatch = decoded.match(/https?:\/\/[^\s",\]]+/);
                if (urlMatch) {
                  processedImage = urlMatch[0];
                  console.log("Fallback extracted URL:", processedImage);
                }
              }
            }
            
            console.log(`Final processed image for ${item.name}:`, processedImage);
            
            return {
              ...item,
              id: item.cart_id, // Use cart_id as id
              image: processedImage
            };
          });
          
          console.log("All processed items:", processedItems);
          setCartItems(processedItems);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error("Error fetching cart items:", error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // Fixed delete handler
  const handelDelete = async (cartId) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch("https://kenzy-api.usif.space/ Delet_cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token_user: token, id: cartId }),
      });

      const data = await response.json();
      console.log(data);

      setCartItems(prev => prev.filter(item => item.cart_id !== cartId));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const updateQuantity = (id, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  // NEW: Handle checkout - save cart items to localStorage
  const handleCheckout = () => {
    const token = localStorage.getItem("token");
    
    // Prepare cart data for checkout
    const checkoutData = {
      token_user: token,
      source: 'cart', // Identify this is from cart (multiple items)
      orderDetails: {
        items: cartItems.map(item => ({
          id: item.product_id || item.id,
          cart_id: item.cart_id,
          name: item.name,
          color: item.color || 'N/A',
          size: item.size || 'N/A',
          quantity: item.quantity,
          price:item.quantity * item.price,
          image: item.image
        }))
      }
    };
    
    console.log("Saving checkout data:", checkoutData);
    
    // Save to localStorage
    localStorage.setItem('buyNowProduct', JSON.stringify(checkoutData));
    
    // Navigate to payment page
    navigate('/checkout');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Loading screen
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-solid"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Flowing lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transform -rotate-12 animate-pulse delay-500"></div>
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white/10 h-full"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4 sm:p-6">
        <div className="w-full max-w-7xl">
          <div className="flex flex-col lg:flex-row bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            
            {/* Cart Section */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 bg-white/5">
              <div className="flex items-center gap-4 mb-6 lg:mb-8">
                <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                  <Link to="/">
                    <button className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200">
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                  </Link>
                </div>
                <h1 className="text-xl sm:text-2xl font-semibold text-white">Your Shopping Cart</h1>
              </div>

              {/* Empty Cart Message */}
              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-white/70 text-lg mb-4">Your cart is empty</p>
                  <Link to="/">
                    <button className="px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-300 hover:to-orange-400 transition-all duration-200">
                      Start Shopping
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  <div className="space-y-4 lg:space-y-6">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all duration-300">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-gradient-to-br from-white/20 to-white/5 flex items-center justify-center text-3xl sm:text-2xl border border-white/10 flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              className="w-full h-full object-cover rounded-xl"
                              onError={(e) => {
                                console.error(`Image failed to load for ${item.name}`);
                                console.error(`Failed URL:`, item.image);
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                const parent = e.target.parentElement;
                                parent.innerHTML = '<div class="text-2xl">🛍️</div>';
                              }}
                              onLoad={() => {
                                console.log(`Image loaded successfully for ${item.name}`);
                              }}
                            />
                          ) : (
                            <div className="text-2xl" title="No image available">🛍️</div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-white text-sm sm:text-base lg:text-lg truncate">{item.name}</h3>
                          {item.size && <p className="text-white/60 text-xs sm:text-sm">Size: {item.size}</p>}
                        </div>

                        <div className="flex items-center gap-2 sm:gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
                          >
                            <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </button>
                          <span className="w-6 sm:w-8 text-center text-white font-medium text-sm sm:text-base">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all duration-200"
                          >
                            <Plus className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                          </button>
                        </div>

                        <div className="text-right min-w-16 sm:min-w-20">
                          <p className="font-semibold text-white text-sm sm:text-base lg:text-lg">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>

                        <button
                          onClick={() => handelDelete(item.cart_id)}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-red-500/20 backdrop-blur-sm border border-red-400/30 flex items-center justify-center hover:bg-red-500/30 transition-all duration-200 flex-shrink-0"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-300" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-6 lg:mt-8 pt-6 border-t border-white/20 gap-4">
                    <Link to="/" className="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200">
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Shop</span>
                    </Link>
                    <div className="text-left sm:text-right w-full sm:w-auto">
                      <p className="text-white/70 text-sm">Subtotal</p>
                      <p className="text-xl sm:text-2xl font-bold text-white">${subtotal.toLocaleString()}</p>
                    </div>
                  </div>
                  
                </>
              )}
            </div>

            {/* Checkout Section */}
            <div className="w-full lg:w-96 bg-gray-900/50 backdrop-blur-xl border-t lg:border-t-0 lg:border-l border-white/10 flex items-end">
              {/* Checkout Button */}
              <div className="w-full p-4 sm:p-6 lg:p-8">
                <button 
                  onClick={handleCheckout}
                  className="w-full py-3 sm:py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold rounded-xl hover:from-yellow-300 hover:to-orange-400 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-sm sm:text-base"
                  disabled={cartItems.length === 0}
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
