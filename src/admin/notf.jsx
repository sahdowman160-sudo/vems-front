import React, { useState , useEffect} from 'react';
import { Bell, Send, AlertCircle, Info, CheckCircle, AlertTriangle } from 'lucide-react';
import { IoIosArrowBack } from 'react-icons/io';
import { Link , useNavigate} from "react-router-dom";
export default function InsertNotificationPage() {
  const [formData, setFormData] = useState({
    type: 'info',
    title: '',
    message: ''
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
        const response = await fetch("https://vems-api.yousseif.me/extrct_super", {
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









  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const notificationTypes = [
    { value: 'success', label: 'Success', icon: CheckCircle, color: 'green' },
    { value: 'warning', label: 'Warning', icon: AlertTriangle, color: 'yellow' },
    { value: 'info', label: 'Info', icon: Info, color: 'blue' },
    { value: 'error', label: 'Error', icon: AlertCircle, color: 'red' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    if (formData.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }
    if (formData.message.length > 500) {
      newErrors.message = 'Message must be less than 500 characters';
    }
    return newErrors;
  };

  const handleSubmit = async () => {
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await fetch('https://vems-api.yousseif.me/insert_notfiction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.title,
          message: formData.message
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }

      const data = await response.json();
      console.log('Response from server:', data);
      
      setSuccessMessage('Notification sent successfully!');
      
      setFormData({
        type: 'info',
        title: '',
        message: ''
      });

      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error sending notification:', error);
      setErrors({ submit: 'Failed to send notification. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      success: 'green',
      warning: 'yellow',
      info: 'blue',
      error: 'red'
    };
    return colors[type] || 'blue';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-ping delay-300"></div>
        <div className="absolute bottom-32 left-1/3 w-1 h-1 bg-cyan-400 rounded-full animate-ping delay-700"></div>
        <div className="absolute top-60 left-1/2 w-1 h-1 bg-blue-300 rounded-full animate-ping delay-1000"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-purple-300 rounded-full animate-ping delay-1500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-8">
        <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 p-[9px] rounded-[35px]">
          <button className="text-white text-lg font-semibold mr-4">
            <IoIosArrowBack className="text-2xl cursor-pointer" />
          </button>
          <span className="text-xl font-bold text-white">GO BACK</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center">
            <Bell className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">VEMS</h1>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Header Card */}
          <div className="mb-6 p-6 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
            <div className="flex items-center space-x-3 mb-2">
              <div className="relative">
                <Send className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Create Notification</h1>
                <p className="text-slate-400 text-sm">Send a new notification to users</p>
              </div>
            </div>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 rounded-2xl bg-green-500/20 backdrop-blur-xl border border-green-400/50 shadow-xl animate-pulse">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="text-green-400 font-medium">{successMessage}</p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-4 p-4 rounded-2xl bg-red-500/20 backdrop-blur-xl border border-red-400/50 shadow-xl">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <p className="text-red-400 font-medium">{errors.submit}</p>
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="p-6 rounded-2xl bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 shadow-2xl">
            <div className="space-y-5">
              {/* Notification Type */}
              <div>
                <label className="block text-white font-medium mb-3">
                  Notification Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {notificationTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                        className={`p-3 rounded-xl border transition-all duration-200 ${
                          formData.type === type.value
                            ? `bg-${type.color}-500/20 border-${type.color}-400/50 ring-1 ring-${type.color}-400/20`
                            : 'bg-slate-800/20 border-slate-700/30 hover:bg-slate-800/40'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mx-auto mb-1 ${
                          formData.type === type.value ? `text-${type.color}-400` : 'text-slate-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          formData.type === type.value ? `text-${type.color}-400` : 'text-slate-400'
                        }`}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter notification title"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border ${
                    errors.title ? 'border-red-400/50' : 'border-slate-700/50'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 transition-all duration-200`}
                />
                {errors.title && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.title}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Message Input */}
              <div>
                <label className="block text-white font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Enter notification message"
                  rows="4"
                  className={`w-full px-4 py-3 rounded-xl bg-slate-800/50 backdrop-blur-sm border ${
                    errors.message ? 'border-red-400/50' : 'border-slate-700/50'
                  } text-white placeholder-slate-500 focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20 transition-all duration-200 resize-none`}
                />
                {errors.message && (
                  <p className="mt-2 text-sm text-red-400 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {formData.message.length}/500 characters
                </p>
              </div>

              {/* Preview */}
              {(formData.title || formData.message) && (
                <div className="mt-6">
                  <label className="block text-white font-medium mb-2">
                    Preview
                  </label>
                  <div className={`p-4 rounded-xl backdrop-blur-xl border shadow-lg bg-slate-800/40 border-slate-600/50 ring-1 ring-${getTypeColor(formData.type)}-400/20`}>
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-2 h-2 bg-${getTypeColor(formData.type)}-400 rounded-full`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white">
                          {formData.title || 'Notification Title'}
                        </h3>
                        <p className="text-sm mt-1 text-slate-400">
                          {formData.message || 'Notification message will appear here...'}
                        </p>
                        <p className="text-xs text-slate-600 mt-2">
                          Just now
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 font-medium transition-all duration-200 border border-blue-400/30 flex items-center justify-center space-x-2 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Notification</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
