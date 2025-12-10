import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, Shirt, Image, Menu, X, Search, ShoppingCart, User, Heart, Sparkles, Download, RotateCcw } from 'lucide-react';
import {Link} from "react-router-dom"
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

export default function FitRoomSelector() {
  const [clothesImage, setClothesImage] = useState(null);
  const [modelImage, setModelImage] = useState(null);
  const [modelPreview, setModelPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  const showToast = (message, icon) => {
    setToast({ message, icon });
    setTimeout(() => setToast(null), 3000);
  };

  // Load clothes image from localStorage on mount
  useEffect(() => {
    const loadClothesFromStorage = () => {
      try {
        const clothesData = localStorage.getItem('tryOnImage');
        if (clothesData) {
          setClothesImage(clothesData);
        }
      } catch (err) {
        console.error('Error loading clothes from localStorage:', err);
      }
    };
    loadClothesFromStorage();
  }, []);

  // Handle model image upload
  const handleModelUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setModelImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setModelPreview(reader.result);
      };
      reader.readAsDataURL(file);
      showToast(
        "Model image uploaded!",
        <CheckCircle size={20} className="text-green-600" />
      );
    }
  };

  // Submit to FitRoom API
  const handleSubmit = async () => {
    if (!clothesImage) {
      setError('No clothes image found in storage');
      showToast(
        "No clothes image found!",
        <AlertCircle size={20} className="text-red-600" />
      );
      return;
    }
    if (!modelImage) {
      setError('Please upload a model image');
      showToast(
        "Please upload a model image!",
        <AlertCircle size={20} className="text-red-600" />
      );
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setResultImage(null);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 6000);

    try {


      const formData = new FormData();
 
      
      // Convert base64 clothes image to blob
      const clothesBlob = await fetch(clothesImage).then(r => r.blob());
      formData.append('clothes', clothesBlob, 'clothes.jpg');
      formData.append('model', modelImage);

      const response = await fetch('https://kenzy-api.usif.space/try_on', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      clearInterval(progressInterval);
      setProgress(100);

      if (response.ok) {
        setResult(data);
        // Set result image using result_url from API response
        if (data.result_url) {
          setResultImage(data.result_url);
        } else if (data.result?.result_path) {
          setResultImage(`https://kenzy-api.usif.space${data.result.result_path}`);
        }
        showToast(
          "Vems result generated!",
          <CheckCircle size={20} className="text-green-600" />
        );
      } else {
        setError(data.detail || 'Failed to process images');
        showToast(
          data.detail || "Failed to process images!",
          <X size={20} className="text-red-600" />
        );
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError(err.message || 'An error occurred');
      showToast(
        "An error occurred!",
        <X size={20} className="text-red-600" />
      );
    } finally {
      setTimeout(() => setLoading(false), 500);
    }
  };

  // Reset and try another
  const handleTryAnother = () => {
    setResult(null);
    setResultImage(null);
    setModelImage(null);
    setModelPreview(null);
    setError(null);
    setProgress(0);
  };

  // Download result
  const handleDownload = async () => {
    if (!resultImage) return;
    
    try {
      const response = await fetch(resultImage);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vems-result-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      showToast(
        "Result downloaded!",
        <CheckCircle size={20} className="text-green-600" />
      );
    } catch (err) {
      showToast(
        "Failed to download!",
        <AlertCircle size={20} className="text-red-600" />
      );
    }
  };

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

          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }

          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }

          .animate-scale-in {
            animation: scale-in 0.5s ease-out;
          }

          .animate-shimmer {
            background-size: 200% 100%;
            animation: shimmer 2s linear infinite;
          }
        `}
      </style>

      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20"></div>
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 sm:w-80 sm:h-80 bg-blue-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-32 h-32 sm:w-64 sm:h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Loading Progress Overlay */}
      {loading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-xl rounded-3xl p-8 sm:p-12 border border-purple-500/30 shadow-2xl max-w-md w-full mx-4">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Generating Your AI Try-On</h3>
              <p className="text-gray-300 text-sm">⏳ Please wait while our AI creates magic...</p>
            </div>
            
            {/* Progress Bar */}
            <div className="relative">
              <div className="h-3 bg-gray-700/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out animate-shimmer"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="mt-3 text-center">
                <span className="text-white font-semibold text-lg">{progress}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
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
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white">VEMS</span>
          </div>
          
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
            <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a>
          </nav>

          <div className="hidden sm:flex items-center space-x-2 lg:space-x-4">
            <Link to="/search">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors bg-white/10 backdrop-blur-sm border border-white/20">
              <Search className="w-5 h-5 text-gray-400" />
            </button>
            </Link>
            <Link to="/cart">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors relative bg-white/10 backdrop-blur-sm border border-white/20">
              <ShoppingCart className="w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
            </button>
            </Link>
            <Link to="/profile">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors bg-white/10 backdrop-blur-sm border border-white/20">
              <User className="w-5 h-5" />
            </button>
            </Link>
             <Link to="/heart">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors relative bg-white/10 backdrop-blur-sm border border-white/20">
              <Heart className="w-5 h-5 text-gray-400" />
            </button>
            </Link>
          </div>

          <div className="flex sm:hidden items-center space-x-3">
            <Link to="/search">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors bg-white/10 backdrop-blur-sm border border-white/20">
              <Search className="w-5 h-5 text-gray-400" />
              
            </button>
</Link>
            <Link to="/cart">
            <button className="p-2 hover:bg-gray-800 rounded-full transition-colors relative bg-white/10 backdrop-blur-sm border border-white/20">
              <ShoppingCart className="w-5 h-5 text-gray-400" />
            </button>
            </Link>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden relative top-full left-0 right-0 bg-black border-b border-gray-800 z-[100]">
            <nav className="flex flex-col p-4 space-y-4">
              <a href="/" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact Us</a>

              
              <div className="flex items-center space-x-4 pt-4 border-t border-gray-800">
                   <Link to="/profile">
                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors bg-white/10 backdrop-blur-sm border border-white/20">
                  <User className="w-5 h-5" />
                </button>
                </Link>
                <Link to="/heart">
                <button className="p-2 hover:bg-gray-800 rounded-full transition-colors relative bg-white/10 backdrop-blur-sm border border-white/20">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 lg:py-12">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="text-purple-400 font-semibold text-xs sm:text-sm uppercase tracking-wider mb-2">
            Virtual Try-On
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent leading-tight">
            Vems AI
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto">
            Upload your model image and let AI show you how the clothes look on you
          </p>
        </div>

        {/* Image Selection Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
          {/* Show result if available, otherwise show upload sections */}
          {result && resultImage ? (
            /* Result Display */
            <div className="lg:col-span-2">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border-2 border-green-500/30 p-6 sm:p-8 hover:border-green-400/50 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-xl text-green-300">Your AI Try-On Result</h3>
                </div>
                
                <div className="max-w-2xl mx-auto">
                  <div className="relative aspect-square bg-gradient-to-br from-gray-800/40 to-gray-700/60 rounded-xl overflow-hidden group mb-6">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <img
                      src={resultImage}
                      alt="Try-on Result"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button
                      onClick={handleDownload}
                      className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 transform hover:scale-105 transition-all shadow-lg shadow-green-500/25 flex items-center justify-center gap-3"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Result</span>
                    </button>
                    
                    <button
                      onClick={handleTryAnother}
                      className="w-full py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transform hover:scale-105 transition-all shadow-lg shadow-purple-500/25 flex items-center justify-center gap-3"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Try Another</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Clothes Image (from localStorage) */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border-2 border-purple-500/30 p-6 sm:p-8 hover:border-purple-400/50 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                    <Shirt className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-xl text-purple-300">Clothes Image</h3>
                </div>
                
                {clothesImage ? (
                  <div className="relative aspect-square bg-gradient-to-br from-gray-800/40 to-gray-700/60 rounded-xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <img
                      src={clothesImage}
                      alt="Clothes"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                ) : (
                  <div className="aspect-square bg-gray-800/40 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-600">
                    <div className="text-center text-gray-500">
                      <AlertCircle className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">No Clothes Image</p>
                      <p className="text-sm">Save an image with key "clothes" in localStorage</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Model Image (user upload) */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl border-2 border-blue-500/30 p-6 sm:p-8 hover:border-blue-400/50 transition-all">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <Image className="w-5 h-5" />
                  </div>
                  <h3 className="font-semibold text-xl text-blue-300">Model Image</h3>
                </div>

                {modelPreview ? (
                  <div className="relative aspect-square bg-gradient-to-br from-gray-800/40 to-gray-700/60 rounded-xl overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                    <img
                      src={modelPreview}
                      alt="Model"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <button
                      onClick={() => {
                        setModelImage(null);
                        setModelPreview(null);
                      }}
                      className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="aspect-square bg-gray-800/40 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-800/60 transition-all border-2 border-dashed border-gray-600 hover:border-blue-400/50 group">
                    <Upload className="w-16 h-16 text-gray-400 group-hover:text-blue-400 mb-4 transition-colors" />
                    <p className="text-lg font-medium text-gray-300 group-hover:text-white mb-2 transition-colors">Upload Model Image</p>
                    <p className="text-sm text-gray-500">Click to browse or drag and drop</p>
                    <p className="text-xs text-gray-600 mt-2">PNG, JPG up to 10MB</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleModelUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border-2 border-red-500/30 text-red-400 px-6 py-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Result Message */}
        {result && (
          <div className="mb-6 bg-green-500/10 border-2 border-green-500/30 text-green-400 px-6 py-4 rounded-xl backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-lg mb-2">✅ {result.message}</p>
                {result.new_points && (
                  <p className="text-sm text-gray-300">Your new points: <span className="font-bold text-blue-400">{result.new_points}</span></p>
                )}
                {result.result?.result_path && (
                  <p className="text-sm text-gray-300 mt-1">Result saved at: <span className="font-mono text-xs">{result.result.result_path}</span></p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Submit Button - Only show when no result */}
        {!result && (
          <button
            onClick={handleSubmit}
            disabled={!clothesImage || !modelImage || loading}
            className={`w-full py-4 sm:py-5 rounded-xl font-semibold text-white transition-all text-base sm:text-lg flex items-center justify-center gap-3 ${
              !clothesImage || !modelImage || loading
                ? 'bg-gray-700 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 transform hover:scale-105 shadow-lg shadow-purple-500/25'
            }`}
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processing Your Virtual Try-On...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Vems Result</span>
              </>
            )}
          </button>
        )}

        {/* Info Note */}
        <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-blue-300 mb-2">How it works</h4>
              <ul className="text-sm text-gray-300 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>The clothes image is automatically loaded from your browser storage (localStorage key: "tryOnImage")</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Upload a clear, full-body photo as your model image for best results</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-400 mt-1">•</span>
                  <span>Our AI will generate a realistic visualization of how the clothes look on your model</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}