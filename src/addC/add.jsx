import React, { useState } from "react";
import { X, ShoppingCart, Plus, Minus, Star, Check, MapPin, Phone, CreditCard } from "lucide-react";
import {useNavigate} from "react-router-dom"
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

// Checkout Form Component
  
const CheckoutForm = ({ data, quantity, size, totalPrice, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    location: "",
    phone1: "",
    phone2: "",
    way_payment: "الدفع عند الاستلام"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.location || !formData.phone1) {
      onSuccess("Please fill in all required fields!", <X size={20} className="text-red-600" />);
      return;
    }

    setIsSubmitting(true);

    try {
      const token = window.localStorage.getItem("token");
      const payload = {
        id_product: data.id.toString(),
        loction: formData.location, // Note: Backend expects 'loction' (typo in API)
        phone1: formData.phone1,
        phone2: formData.phone2 || formData.phone1,
        price: totalPrice.toString(),
        quantity: quantity.toString(),
        size: size,
        stute: "pending",
        time: new Date().toISOString(),
        token_user: token,
        way_payment: formData.way_payment
      };

      const response = await fetch("http://127.0.0.1:8000/Bay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onSuccess("Order placed successfully!", <Check size={20} className="text-green-600" />);
        setTimeout(() => onClose(), 1500);
      } else {
        throw new Error("Purchase failed");
      }
    } catch (error) {
      console.error("Error processing purchase:", error);
      onSuccess("Failed to complete purchase!", <X size={20} className="text-red-600" />);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
        >
          <X size={20} className="text-white" />
        </button>

        <h2 className="text-2xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
          Complete Your Order
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Location */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-purple-300 mb-2">
              <MapPin size={16} />
              Delivery Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              placeholder="e.g., Cairo, Giza, Egypt"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>

          {/* Phone 1 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-purple-300 mb-2">
              <Phone size={16} />
              Phone Number *
            </label>
            <input
              type="tel"
              required
              value={formData.phone1}
              onChange={(e) => setFormData({...formData, phone1: e.target.value})}
              placeholder="+201234567890"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>

          {/* Phone 2 */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-2">
              <Phone size={16} />
              Alternative Phone (Optional)
            </label>
            <input
              type="tel"
              value={formData.phone2}
              onChange={(e) => setFormData({...formData, phone2: e.target.value})}
              placeholder="+201234567890"
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-all"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-purple-300 mb-2">
              <CreditCard size={16} />
              Payment Method
            </label>
            <select
              value={formData.way_payment}
              onChange={(e) => setFormData({...formData, way_payment: e.target.value})}
              className="w-full bg-white/5 border border-white/20 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none transition-all"
            >
              <option value="الدفع عند الاستلام" className="text-black">الدفع عند الاستلام (Cash on Delivery)</option>
              <option value="الدفع بواسطة المحفظة" className="text-black"> الدفع بواسطة المحفظة (Credit Card)</option>
            </select>
          </div>

          {/* Order Summary */}
          <div className="bg-white/5 border border-purple-500/30 rounded-lg p-4 space-y-2">
            <h3 className="text-sm font-semibold text-purple-300 mb-2">Order Summary</h3>
            <div className="flex justify-between text-sm text-gray-300">
              <span>Product:</span>
              <span className="font-semibold">{data.name}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-300">
              <span>Size:</span>
              <span className="font-semibold">{size}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-300">
              <span>Quantity:</span>
              <span className="font-semibold">{quantity}</span>
            </div>
            <div className="border-t border-white/20 pt-2 mt-2"></div>
            <div className="flex justify-between text-lg font-bold text-purple-400">
              <span>Total:</span>
              <span>${totalPrice}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-600 disabled:to-gray-500 text-white font-bold py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg disabled:scale-100"
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

const ProductBox = ({ data, onClose }) => {
  if (!data) return null;

  // Convert images from JSON to array
  let images = [];
  try {
    images = Array.isArray(data.image)
      ? data.image
      : JSON.parse(data.image || "[]");
  } catch {
    images = [];
  }

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [quantity, setQuantity] = useState(1);
  const [size, setSize] = useState("M");
  const [mode, setMode] = useState("size");
  const [toast, setToast] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);

  const totalPrice = (data.price * quantity ).toFixed(2);

  const showToast = (message, icon) => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async () => {
    const token = window.localStorage.getItem("token");
    
    if (!token) {
      showToast(
        "Please login to add items to cart!",
        <X size={20} className="text-red-600" />
      );
      return;
    }

    try {
      const check = {
        id: data.id,
        token_user: token
      };
   
      const response = await fetch("http://127.0.0.1:8000/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(check),
      });

      const result = await response.json();

      if (result.add === "found") {
        showToast(
          "This Product is Already in Cart!",
          <Check size={20} className="text-orange-600" />
        );
      } else {
        const payload = {
          id: data.id,
          name: data.name,
          price: totalPrice,
          size,
          quantity,
          token_user: token
        };

        await fetch("http://127.0.0.1:8000/insert_cart", {
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
  };

  const handleBuyNow = async () => {
    const token = window.localStorage.getItem("token");
    
    if (!token) {
      showToast(
        "Please login to proceed!",
        <X size={20} className="text-red-600" />
      );
      return;
    }

    try {
      // Verify token validity
      const tokenResponse = await fetch("http://127.0.0.1:8000/extrct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token_user: token,
        }),
      });

      const tokenResult = await tokenResponse.json();
      
      if (tokenResult.status === "success") {
        // Show checkout form
        setShowCheckout(true);
      } else {
        showToast(
          "Please login again!",
          <X size={20} className="text-red-600" />
        );
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      showToast(
        "Failed to verify authentication!",
        <X size={20} className="text-red-600" />
      );
    }
  };

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-[9999] p-2 sm:p-4">
        {/* Backdrop with blur */}
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        ></div>

        {/* Modal Container */}
        <div className="relative w-full max-w-[95vw] sm:max-w-4xl max-h-[95vh] sm:max-h-[85vh] overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 sm:w-48 sm:h-48 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-28 h-28 sm:w-40 sm:h-40 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>

          {/* Main Content */}
          <div className="relative bg-black/40 backdrop-blur-xl border border-white/20 text-white rounded-xl sm:rounded-2xl shadow-2xl overflow-y-auto max-h-[95vh] sm:max-h-[85vh] scrollbar-hide">
            
            {/* Grid Layout: Image Left, Content Right */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4">
              
              {/* LEFT SIDE - Product Images */}
              <div className="p-2 sm:p-4">
                <div className="relative">
                  {/* Main Image */}
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gradient-to-br from-gray-800/40 to-gray-700/60 border border-purple-500/30 mb-1.5 sm:mb-2 group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <img
                      src={selectedImage || "https://via.placeholder.com/400x400?text=No+Image"}
                      alt={data.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Thumbnail Images */}
                  {images.length > 1 && (
                    <div className="flex gap-1.5 sm:gap-2 justify-center overflow-x-auto pb-1">
                      {images.slice(0, 4).map((img, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedImage(img)}
                          className={`flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all ${
                            selectedImage === img
                              ? "border-purple-400 shadow-lg shadow-purple-400/50 scale-110"
                              : "border-white/20 hover:border-purple-400/50"
                          }`}
                        >
                          <img
                            src={img}
                            alt={`${data.name}-${i}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT SIDE - Product Info & Actions */}
              <div className="p-2 sm:p-4 relative">
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-1 right-1 sm:top-2 sm:right-2 z-10 p-1 sm:p-1.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-all duration-300 group"
                >
                  <X size={16} className="sm:hidden text-white group-hover:rotate-90 transition-transform duration-300" />
                  <X size={20} className="hidden sm:block text-white group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Product Info */}
                <div className="mb-2 sm:mb-3">
                  {/* Category Badge */}
                  {data.category && (
                    <div className="inline-block px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-[10px] sm:text-xs font-semibold uppercase mb-1 sm:mb-2">
                      {data.category}
                    </div>
                  )}

                  {/* Product Name */}
                  <h2 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent pr-6 sm:pr-8">
                    {data.name}
                  </h2>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-1 sm:mb-2">
                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-purple-400">
                      ${totalPrice}
                    </span>
                    {data.originalPrice && (
                      <span className="text-sm sm:text-base md:text-lg text-gray-400 line-through">
                        ${data.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Rating */}
                  {data.rating && (
                    <div className="flex items-center gap-2 mb-1 sm:mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={`sm:w-3.5 sm:h-3.5 ${i < Math.floor(data.rating) ? "fill-current" : ""}`}
                          />
                        ))}
                      </div>
                      <span className="text-gray-400 text-[10px] sm:text-xs">({data.rating})</span>
                    </div>
                  )}

                  {/* Description */}
                  {data.caption && (
                    <p className="text-gray-300 text-[10px] sm:text-xs leading-relaxed mb-2 sm:mb-3 bg-white/5 border border-white/10 rounded-lg p-1.5 sm:p-2 line-clamp-3">
                      {data.caption}
                    </p>
                  )}
                </div>

                {/* Mode Switch (Size/Weight) */}
                <div className="mb-2 sm:mb-3">
                  <div className="inline-flex rounded-lg bg-white/5 border border-white/10 p-0.5">
                    <button
                      onClick={() => setMode("size")}
                      className={`px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-md text-[10px] sm:text-xs md:text-sm font-medium transition-all ${
                        mode === "size"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Size
                    </button>
                    <button
                      onClick={() => setMode("weight")}
                      className={`px-3 sm:px-4 md:px-6 py-1 sm:py-1.5 md:py-2 rounded-md text-[10px] sm:text-xs md:text-sm font-medium transition-all ${
                        mode === "weight"
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      Weight
                    </button>
                  </div>
                </div>

                {/* Size / Weight Selection */}
                <div className="mb-2 sm:mb-3">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-purple-300 mb-1.5 sm:mb-2">
                    Select {mode === "size" ? "Size" : "Weight"}
                  </h3>
                  {mode === "size" ? (
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                      {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSize(s)}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border-2 text-[10px] sm:text-xs font-medium transition-all ${
                            size === s
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 border-transparent text-white shadow-lg shadow-purple-500/25"
                              : "border-white/20 hover:border-purple-400/50 hover:bg-white/5"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                      {[60, 70, 80, 90, 100].map((w) => (
                        <button
                          key={w}
                          onClick={() => setSize(w + "kg")}
                          className={`px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border-2 text-[10px] sm:text-xs font-medium transition-all ${
                            size === w + "kg"
                              ? "bg-gradient-to-r from-purple-600 to-blue-600 border-transparent text-white shadow-lg shadow-purple-500/25"
                              : "border-white/20 hover:border-purple-400/50 hover:bg-white/5"
                          }`}
                        >
                          {w}kg
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="mb-2 sm:mb-3">
                  <h3 className="text-[10px] sm:text-xs font-semibold text-purple-300 mb-1.5 sm:mb-2">Quantity</h3>
                  <div className="flex items-center gap-2 sm:gap-3 bg-white/5 border border-white/10 rounded-lg p-1.5 sm:p-2 w-fit">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="p-1 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Minus size={14} className="sm:w-4 sm:h-4" />
                    </button>
                    <span className="w-8 sm:w-12 text-center font-medium text-sm sm:text-lg">{quantity}</span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="p-1 sm:p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Plus size={14} className="sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-1.5 sm:space-y-2">
                  <button
                    onClick={handleAddToCart}
                    className="w-full bg-white/5 border-2 border-purple-500/50 hover:border-purple-500 hover:bg-purple-500/10 text-white font-semibold py-2 sm:py-2.5 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group text-xs sm:text-sm"
                  >
                    <ShoppingCart size={16} className="sm:w-4.5 sm:h-4.5 group-hover:scale-110 transition-transform" />
                    <span>Add to Cart - ${totalPrice}</span>
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-bold py-2 sm:py-2.5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg shadow-purple-500/25 text-xs sm:text-sm"
                  >
                    BUY IT NOW - ${totalPrice}
                  </button>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Form Modal */}
      {showCheckout && (
        <CheckoutForm
          data={data}
          quantity={quantity}
          size={size}
          totalPrice={data.price * quantity + 60}
          onClose={() => setShowCheckout(false)}
          onSuccess={showToast}
        />
      )}

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          icon={toast.icon}
          onClose={() => setToast(null)}
        />
      )}

      <style>{`
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

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
};

export default ProductBox;