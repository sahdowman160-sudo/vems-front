import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, User, MessageSquare, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { IoIosArrowBack } from 'react-icons/io';
import img from "../main/logo.jpg"
import Footer from "../footer/footer"

// Toast Notification Component
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'from-green-500 to-emerald-600' : 'from-red-500 to-rose-600';
  const Icon = type === 'success' ? CheckCircle : XCircle;

  return (
    <div className="fixed top-8 right-8 z-50 animate-slide-in">
      <div className={`bg-gradient-to-r ${bgColor} text-white px-6 py-4 rounded-xl shadow-2xl flex items-center space-x-3 min-w-[320px] backdrop-blur-sm border border-white/20`}>
        <Icon className="w-6 h-6 flex-shrink-0" />
        <p className="flex-1 font-medium">{message}</p>
        <button 
          onClick={onClose}
          className="text-white/80 hover:text-white transition-colors"
        >
          <XCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000); // Auto dismiss after 5 seconds
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/send_email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showToast('Message sent successfully! We\'ll get back to you soon.', 'success');
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const err = await response.json();
        showToast(err.detail || 'Failed to send message. Please try again.', 'error');
      }
    } catch (error) {
      console.error("Error:", error);
      showToast('Network error. Please check your connection and try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Toast Notification */}
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-8">
        <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 p-[9px] rounded-[35px]">
          <Link to="/" className="text-white text-lg font-semibold mr-4">
            <IoIosArrowBack className="text-2xl cursor-pointer" />
          </Link>
          <Link to="/" className="text-xl font-bold text-white">GO BACK</Link>
        </div>
        <div className="flex items-center space-x-4">
          <img src={img} alt="" className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center" />
          <h1 className="text-2xl font-bold text-white">VEMS</h1>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Contact Form */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-white mb-4">
                CONTACT US
              </h1>
              <p className="text-gray-300 text-lg mb-8">
                Have a project in mind? Let's discuss your ideas and bring them to life.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Phone</p>
                  <p>+20 01115931662</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <p>jmh199635@gmail.com</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-gray-300">
                <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">Location</p>
                  <p>Egypt</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="space-y-6 bg-slate-800/50 p-8 rounded-2xl backdrop-blur-sm border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-6">Send a Message</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                />
              </div>
              
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  rows={4}
                  className="w-full bg-slate-700/50 border border-slate-600 rounded-lg px-12 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                ></textarea>
              </div>
              
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700"
              >
                {isLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Side - 3D Phone Illustration */}
          <div className="relative flex justify-center items-center">
            <div className="relative">
              {/* Glowing Background */}
              <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full scale-150"></div>
              
              {/* Phone Container */}
              <div className="relative z-10 transform rotate-12 hover:rotate-6 transition-transform duration-700">
                {/* Modern Phone */}
                <div className="w-64 h-96 bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl shadow-2xl border border-slate-600 relative overflow-hidden">
                  {/* Screen */}
                  <div className="m-4 h-80 bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl relative overflow-hidden">
                    {/* Screen Content */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20"></div>
                    
                    {/* Floating Elements */}
                    <div className="absolute top-8 left-8 w-12 h-12 bg-blue-400/30 rounded-full animate-pulse"></div>
                    <div className="absolute top-20 right-12 w-8 h-8 bg-purple-400/30 rounded-lg animate-bounce"></div>
                    <div className="absolute bottom-16 left-12 w-16 h-2 bg-blue-300/40 rounded-full"></div>
                    <div className="absolute bottom-12 right-8 w-10 h-10 bg-cyan-400/30 rounded-full animate-ping"></div>
                    
                    {/* Central Glow */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-xl"></div>
                  </div>
                  
                  {/* Phone Details */}
                  <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-slate-600 rounded-full"></div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-slate-600 rounded-full"></div>
                </div>

                {/* Classic Phone */}
                <div className="absolute -bottom-12 -right-16 w-32 h-20 transform rotate-45">
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl relative">
                    {/* Phone Base */}
                    <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl"></div>
                    
                    {/* Dial */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-blue-900 rounded-full">
                      <div className="absolute inset-1 bg-blue-300/50 rounded-full"></div>
                    </div>
                    
                    {/* Phone Details */}
                    <div className="absolute top-2 left-2 w-2 h-2 bg-blue-300/60 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 bg-blue-300/60 rounded-full animate-pulse delay-75"></div>
                  </div>
                </div>
              </div>

              {/* Floating Particles */}
              <div className="absolute top-20 -left-8 w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="absolute bottom-32 -right-12 w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
              <div className="absolute top-40 -right-4 w-1 h-1 bg-cyan-400 rounded-full animate-ping"></div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}