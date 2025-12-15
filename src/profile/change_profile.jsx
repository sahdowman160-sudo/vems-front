import React, { useState } from 'react';
import { ArrowLeft, Key, Eye, EyeOff, Lock, AlertCircle, CheckCircle } from 'lucide-react';

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return {
      minLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber
    };
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: '' }));
    setMessage({ type: '', text: '' });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async () => {
    setErrors({});
    setMessage({ type: '', text: '' });

    // Validation
    const newErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const validation = validatePassword(formData.newPassword);
      if (!validation.isValid) {
        newErrors.newPassword = 'Password does not meet requirements';
      }
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      const response = await fetch('https://vems-api.yousseif.me/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${window.localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
        //   token: window.localStorage.getItem("token")
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: data.message || 'Password changed successfully!' });
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          window.location.href = '/profile';
        }, 2000);
      } else {
        setMessage({ type: 'error', text: data.detail || 'Failed to change password' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const passwordValidation = validatePassword(formData.newPassword);

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900"></div>
      <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.5) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between p-8">
        <button 
          onClick={() => window.location.href = '/profile'}
          className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
        </button>
        <div className="flex items-center space-x-4">
         
                    <img src="https://i.ibb.co/QvKdRXDr/Whats-App-Image-2025-12-15-at-10-32-04-e58c092b.jpg"alt="" className="w-[66px] h-[43px]  bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center" />
          
          <h1 className="text-2xl font-bold text-white">Kenzy</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-8 py-8 sm:py-12 pb-20">
        <div className="text-center mb-12">
          <div className="inline-block p-4 bg-blue-500/20 rounded-full mb-4">
            <Key className="w-12 h-12 text-blue-400" />
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">Change Password</h2>
          <p className="text-slate-400 text-base sm:text-lg">Update your account password</p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-500/10 border-green-500/50 text-green-400' 
              : 'bg-red-500/10 border-red-500/50 text-red-400'
          } flex items-center space-x-3`}>
            {message.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
          </div>
        )}

        {/* Password Form */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8">
          <div className="space-y-6">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Current Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) => handleInputChange('currentPassword', e.target.value)}
                  className={`w-full bg-slate-700/50 border ${
                    errors.currentPassword ? 'border-red-500' : 'border-slate-600/50'
                  } rounded-lg pl-12 pr-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="mt-2 text-sm text-red-400">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Key className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPasswords.new ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange('newPassword', e.target.value)}
                  className={`w-full bg-slate-700/50 border ${
                    errors.newPassword ? 'border-red-500' : 'border-slate-600/50'
                  } rounded-lg pl-12 pr-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.newPassword && (
                <p className="mt-2 text-sm text-red-400">{errors.newPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            {formData.newPassword && (
              <div className="bg-slate-700/30 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-slate-300 mb-3">Password must contain:</p>
                <div className="space-y-2">
                  <div className={`flex items-center space-x-2 text-sm ${
                    passwordValidation.minLength ? 'text-green-400' : 'text-slate-400'
                  }`}>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      passwordValidation.minLength ? 'bg-green-500 border-green-500' : 'border-slate-500'
                    } flex items-center justify-center`}>
                      {passwordValidation.minLength && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${
                    passwordValidation.hasUpperCase ? 'text-green-400' : 'text-slate-400'
                  }`}>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      passwordValidation.hasUpperCase ? 'bg-green-500 border-green-500' : 'border-slate-500'
                    } flex items-center justify-center`}>
                      {passwordValidation.hasUpperCase && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${
                    passwordValidation.hasLowerCase ? 'text-green-400' : 'text-slate-400'
                  }`}>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      passwordValidation.hasLowerCase ? 'bg-green-500 border-green-500' : 'border-slate-500'
                    } flex items-center justify-center`}>
                      {passwordValidation.hasLowerCase && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 text-sm ${
                    passwordValidation.hasNumber ? 'text-green-400' : 'text-slate-400'
                  }`}>
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      passwordValidation.hasNumber ? 'bg-green-500 border-green-500' : 'border-slate-500'
                    } flex items-center justify-center`}>
                      {passwordValidation.hasNumber && <CheckCircle className="w-3 h-3" />}
                    </div>
                    <span>One number</span>
                  </div>
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPasswords.confirm ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className={`w-full bg-slate-700/50 border ${
                    errors.confirmPassword ? 'border-red-500' : 'border-slate-600/50'
                  } rounded-lg pl-12 pr-12 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-300"
                >
                  {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Updating...</span>
                </>
              ) : (
                <>
                  <Key className="w-5 h-5" />
                  <span>Update Password</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
