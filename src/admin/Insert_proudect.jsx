import React, { useState , useEffect } from 'react';
import { ArrowLeft, Upload, X, Image, DollarSign, Tag, FileText, Check, Layers, Star, MessageCircle } from 'lucide-react';
import { Link , useNavigate} from 'react-router-dom';

export default function InsertProduct() {
  const [formData, setFormData] = useState({
    name: '',
    caption: '',
    price: '',
    originalPrice: '',
    category: '',
    rating: '',
    reviews: ''
  });











const navigate = useNavigate();























  useEffect(() => {
    const checkToken = async () => {
      const token = window.localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://127.0.0.1:8000/extrct_super", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token_user: token,
          }),
        });

        const result = await response.json();
        
        if (result.status !== "success") {
          navigate("/login");
        }
        if (result.info == "admin" || result.info == "super" ) {
           
        }
        else{
navigate("/login");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate]);










  const [images, setImages] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files) => {
    const newImages = Array.from(files).map(file => ({
      id: Date.now() + Math.random(),
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const removeImage = (id) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id);
      if (imageToRemove) URL.revokeObjectURL(imageToRemove.preview);
      return prev.filter(img => img.id !== id);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("caption", formData.caption);
      data.append("price", formData.price);
      data.append("originalPrice", formData.originalPrice);
      data.append("category", formData.category);
      data.append("rating", formData.rating);
      data.append("reviews", formData.reviews);

      // ✅ إرسال جميع الصور
      images.forEach((img) => {
        data.append("images", img.file);
      });

      const response = await fetch("http://127.0.0.1:8000/insert_proudect", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errText}`);
      }

      const result = await response.json();
      console.log("Server Response:", result);

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          name: '',
          caption: '',
          price: '',
          originalPrice: '',
          category: '',
          rating: '',
          reviews: ''
        });
        setImages([]);
      }, 2000);
    } catch (error) {
      console.error("Error:", error);
      alert("حدث خطأ أثناء رفع المنتج!");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.name &&
    formData.caption &&
    formData.price &&
    formData.originalPrice &&
    formData.category &&
    formData.rating &&
    formData.reviews &&
    images.length > 0;

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* خلفية متحركة */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transform -rotate-12 animate-pulse"></div>
      </div>

      {/* الهيدر */}
      <header className="relative z-20 border-b border-white/10 bg-black/40 backdrop-blur-xl">
        <div className="px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin">
              <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                <ArrowLeft size={20} />
              </button>
            </Link>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">V</span>
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">VEMS</h1>
                <p className="text-white/50 text-xs">Insert Product</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500"></div>
            <span className="text-white text-sm font-medium hidden md:block">Admin</span>
          </div>
        </div>
      </header>

      {/* المحتوى */}
      <main className="relative z-10 p-4 md:p-8 max-w-4xl mx-auto">
        {showSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                <Check className="text-green-400" size={20} />
              </div>
              <div>
                <h3 className="text-white font-semibold">Product Added Successfully!</h3>
                <p className="text-white/60 text-sm">Your product has been saved to the database.</p>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 backdrop-blur-sm">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">Add New Product</h2>
          <p className="text-white/60">Fill in the details below to add a new product to your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* الاسم */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <Tag size={18} className="text-orange-400" />
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter product name..."
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
              required
            />
          </div>

          {/* الوصف */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <FileText size={18} className="text-orange-400" />
              Caption / Description
            </label>
            <textarea
              name="caption"
              value={formData.caption}
              onChange={handleInputChange}
              placeholder="Enter product description..."
              rows="4"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all resize-none"
              required
            />
          </div>

          {/* التصنيف */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <Layers size={18} className="text-orange-400" />
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
              required
            >
              <option value="" disabled>Select category...</option>
              <option value="Men">Men</option>
              <option value="Woman">Woman</option>
              <option value="kides">kides</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          {/* السعر الأصلي */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <DollarSign size={18} className="text-orange-400" />
              Original Price
            </label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleInputChange}
              placeholder="Enter original price..."
              step="0.01"
              min="0"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
              required
            />
          </div>

          {/* السعر */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <DollarSign size={18} className="text-orange-400" />
              Current Price
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/60 text-lg">$</span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                required
              />
            </div>
          </div>

          {/* التقييم */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <Star size={18} className="text-orange-400" />
              Rating
            </label>
            <input
              type="number"
              name="rating"
              value={formData.rating}
              onChange={handleInputChange}
              placeholder="0 - 5"
              step="0.1"
              min="0"
              max="5"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
              required
            />
          </div>

          {/* عدد المراجعات */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <MessageCircle size={18} className="text-orange-400" />
              Reviews
            </label>
            <input
              type="number"
              name="reviews"
              value={formData.reviews}
              onChange={handleInputChange}
              placeholder="Number of reviews"
              min="0"
              className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/40 outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
              required
            />
          </div>

          {/* الصور */}
          <div className="p-6 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <label className="flex items-center gap-2 text-white font-semibold mb-3">
              <Image size={18} className="text-orange-400" />
              Product Images
            </label>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
                dragActive 
                  ? 'border-orange-500 bg-orange-500/10' 
                  : 'border-white/20 bg-white/5 hover:border-white/40'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mb-4">
                  <Upload className="text-orange-400" size={28} />
                </div>
                <p className="text-white font-medium mb-1">Click to upload or drag and drop</p>
                <p className="text-white/40 text-sm">PNG, JPG, GIF up to 10MB</p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {images.map((image) => (
                  <div
                    key={image.id}
                    className="relative group rounded-lg overflow-hidden bg-white/5 border border-white/10 aspect-square"
                  >
                    <img
                      src={image.preview}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="p-2 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                      >
                        <X size={16} className="text-white" />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                      <p className="text-white text-xs truncate">{image.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* الزر */}
          <div className="flex gap-4">
            <Link to="/admin" className="flex-1">
              <button
                type="button"
                className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              disabled={!isFormValid || isLoading}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold transition-all ${
                isFormValid
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 shadow-lg shadow-orange-500/25'
                  : 'bg-white/5 border border-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              {isLoading ? 'Uploading...' : 'Add Product'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
