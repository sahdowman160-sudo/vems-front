import React, { useEffect, useState } from 'react';
import { Mail, Gift , Save, Shield, Bell, Key, Camera, Package, ArrowLeft, ChevronRight , Sparkles  } from 'lucide-react';
import {Link} from "react-router-dom"
export default function UserProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Kenzy User',
    email: window.localStorage.getItem("email"),

  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
  };


  useEffect(() => {
if(window.localStorage.getItem("token")){

}else{
  window.location.href="/login"
}
  }, []);

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
                <div className="p-2 rounded-full bg-white/10 backdrop-blur-sm">
                  <Link to="/">
                    <button className="p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all duration-200">
                      <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </button>
                  </Link>
                </div>
        <div className="flex items-center space-x-4">
                     <div className="w-8 text-white h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
          <img src="https://i.ibb.co/QvKdRXDr/Whats-App-Image-2025-12-15-at-10-32-04-e58c092b.jpg"alt="" className="w-[66px] h-[43px]  bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center" />
            </div>
          <h1 className="text-2xl font-bold text-white">Kenzy</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-12 pb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4">Profile</h2>
          <p className="text-slate-400 text-base sm:text-lg">Manage your account settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-xl sm:text-2xl font-bold text-white">          <img src={"https://i.ibb.co/QvKdRXDr/Whats-App-Image-2025-12-15-at-10-32-04-e58c092b.jpg"} alt="" className="w-[96px] h-[80px] sm:w-[96px]  sm:h-[96px] bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center" />
                </div>
                
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">{formData.name}</h3>
                <p className="text-slate-400 text-sm sm:text-base">{formData.email}</p>
              </div>
            </div>

          </div>

          {/* Email Section */}
          <div className="max-w-md">
            <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
            {isEditing ? (
              <input 
                type="email" 
                value={formData.email} 
                onChange={(e) => handleInputChange('email', e.target.value)} 
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            ) : (
              <div className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-white">{formData.email}</span>
              </div>
            )}
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Security Section */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-3 text-blue-400" /> Security
            </h3>
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                    <Key className="w-5 h-5 text-blue-400" />
                  </div>
                  <Link to="/change_password">
                  <div className="text-left">
                    <span className="text-white font-medium block">Change Password</span>
                    <span className="text-slate-400 text-sm">Update your password</span>
                  </div>
                  </Link>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Account Section */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center">
              <Bell className="w-5 h-5 mr-3 text-purple-400" /> Account
            </h3>
            <div className="space-y-3">
              <button 
                className="w-full flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Package className="w-5 h-5 text-purple-400" />
                  </div>
                   <Link to="/orders">
                  <div className="text-left">
                    <span className="text-white font-medium block">Your Orders</span>
                    <span className="text-slate-400 text-sm">View order history</span>
                  </div>
                  </Link>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
                            {/* <button 
                className="w-full flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center group-hover:bg-purple-500/30 transition-colors">
                    <Gift className="w-5 h-5 text-purple-400" />
                  </div>
                   <Link to="/Point">
                  <div className="text-left">
                    <span className="text-white font-medium block">Point</span>
                    <span className="text-slate-400 text-sm">View Point Payment</span>
                  </div>
                  </Link>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </button> */}
              
              <button 
                className="w-full flex items-center justify-between p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                    <Bell className="w-5 h-5 text-green-400" />
                  </div>
                    <Link to="/notice">
                  <div className="text-left">
                  
                    <span className="text-white font-medium block">Notifications</span>
                    <span className="text-slate-400 text-sm">Manage preferences</span>
                  </div>
                  </Link>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
