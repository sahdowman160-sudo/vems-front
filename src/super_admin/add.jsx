import React, { useState , useEffect } from 'react';
import { Mail, Lock, Shield, Check } from 'lucide-react';
import { Link , useNavigate} from "react-router-dom";
export default function SuperAdminRegister() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
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
        const response = await fetch("https://kenzy-api.usif.space/extrct_super", {
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
        if (result.info !== "super") {
           navigate("/login");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate]);













  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://kenzy-api.usif.space/register-super-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        // Store token if needed
        localStorage.setItem('token', data.token);
        // Redirect or show success message
        setTimeout(() => {
          window.location.href = '/Super';
        }, 2000);
      } else {
        setError(data.detail || 'حدث خطأ أثناء التسجيل');
      }
    } catch (err) {
      setError('فشل الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Success message */}
        <div className="relative z-10 text-center">
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-500/20 backdrop-blur-sm flex items-center justify-center border border-green-500/30">
              <Check className="w-10 h-10 text-green-400" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">تم التسجيل بنجاح!</h2>
          <p className="text-white/60">جاري تحويلك إلى لوحة التحكم...</p>
        </div>
      </div>
    );
  }
  useEffect(() => {
    const checkToken = async () => {
      const token = window.localStorage.getItem("token");
      
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("https://kenzy-api.usif.space/extrct_super", {
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
        if (result.info !== "super") {
           navigate("/login");
        }
      } catch (error) {
        console.error("Error checking token:", error);
        navigate("/login");
      }
    };

    checkToken();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transform -rotate-12 animate-pulse"></div>
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
      <div className="relative z-10 w-full max-w-md">
        {/* Website label */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white/70 text-sm font-medium">
            <div className="w-2 h-2 bg-white/60 rounded-full mr-2"></div>
            VEMS
          </span>
        </div>

        {/* Form card */}
        <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-8 shadow-2xl">
          {/* Glowing overlay effect */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/10 to-red-500/10 opacity-50"></div>
          
          <div className="relative">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-white/20 mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">Admin Registration</h2>
              <p className="text-white/60 text-sm">Create a new admin account</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 backdrop-blur-sm">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Form */}
            <div className="space-y-6">
              {/* Email input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                    placeholder="admin@vems.com"
                  />
                </div>
              </div>

              {/* Password input */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Role selector */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                    className={`p-4 rounded-lg border transition-all ${
                      formData.role === 'admin'
                        ? 'bg-orange-500/20 border-orange-500/50 text-white'
                        : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold">Admin</div>
                    <div className="text-xs mt-1 opacity-80">Standard access</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'super' })}
                    className={`p-4 rounded-lg border transition-all ${
                      formData.role === 'super'
                        ? 'bg-orange-500/20 border-orange-500/50 text-white'
                        : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <div className="font-semibold">Super Admin</div>
                    <div className="text-xs mt-1 opacity-80">Full access</div>
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={loading}
                className="group w-full relative px-8 py-4 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span className="relative z-10">
                  {loading ? 'جاري التسجيل...' : 'Create Account'}
                </span>
                
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-orange-400 to-red-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
              </button>
            </div>

            {/* Footer note */}
            <p className="text-center text-white/40 text-xs mt-6">
              Account will be activated immediately
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <button
            onClick={() => window.history.back()}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            ← Back to previous page
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-white/40 text-sm">
          ©2025 VEMS • Built by{' '}
          <span className="text-white/60 hover:text-white/80 transition-colors cursor-pointer">
            SHADOW
          </span>
        </p>
      </div>
    </div>
  );
}
