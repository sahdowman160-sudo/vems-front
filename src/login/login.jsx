import React, { useState } from 'react';
import imge from"./logo.jpg"
import {
  Sparkles
} from "lucide-react";
import { Link } from 'react-router-dom';
export default function NixonSignup() {

const [email, setEmail] = useState("");
const [password, setPass] = useState("");
const [notfound, setNotFound] = useState(false);

const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("https://kenzy-api.usif.spaceseif.me/login", {
        
        method: "POST",
            headers: {
        "Content-Type": "application/json",  // هذا هو المهم جدًا
      },
        body: JSON.stringify({email , password}),
      });
          if (!response.ok) {
 if (response.status === 409) {
        alert("That email is already used.");
      }
}
      const result = await response.json();
      if (result.status === "success" && result.hi === "b") {
        window.localStorage.setItem("token", result.access_token); // تخزين البريد الإلكتروني
        window.location.href="/start"; // إعادة التوجيه إلى الصفحة الرئيسية
      }if (result.status === "success" && result.hi === "m") {
        window.localStorage.setItem("token", result.access_token); // تخزين البريد الإلكتروني
        window.location.href="/admin"; // إعادة التوجيه إلى الصفحة الرئيسية
      }
      if (result.status === "success" && result.hi === "s") {
        window.localStorage.setItem("token", result.access_token); // تخزين البريد الإلكتروني
        window.location.href="/super"; // إعادة التوجيه إلى الصفحة الرئيسية
      }
      else{
       setNotFound(true);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}

      <div className="absolute inset-0">
        {/* Stars */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-32 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-40 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-60 right-60 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
        
        {/* Moving squares that become stars */}
        <div className="absolute top-32 right-40 w-8 h-8 bg-gradient-to-br from-blue-300 to-purple-300 opacity-80 animate-pulse transform rotate-45 hover:rotate-0 transition-transform duration-1000">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-300 animate-spin" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'}}></div>
        </div>
        <div className="absolute bottom-32 left-32 w-6 h-6 bg-gradient-to-br from-purple-300 to-pink-300 opacity-60 animate-pulse transform rotate-45 hover:rotate-0 transition-transform duration-1000" style={{animationDelay: '0.5s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-purple-300 to-pink-300 animate-spin" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', animationDelay: '0.5s'}}></div>
        </div>
        
        {/* Additional moving squares */}
        <div className="absolute top-20 left-1/4 w-4 h-4 bg-gradient-to-br from-cyan-300 to-blue-400 opacity-70 animate-bounce transform rotate-45 hover:rotate-0 transition-transform duration-1000" style={{animationDelay: '1s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-blue-400 animate-spin" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', animationDelay: '1s'}}></div>
        </div>
        <div className="absolute bottom-20 right-1/3 w-5 h-5 bg-gradient-to-br from-pink-300 to-purple-400 opacity-60 animate-bounce transform rotate-45 hover:rotate-0 transition-transform duration-1000" style={{animationDelay: '1.5s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-400 animate-spin" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', animationDelay: '1.5s'}}></div>
        </div>
        <div className="absolute top-1/2 right-20 w-6 h-6 bg-gradient-to-br from-indigo-300 to-purple-400 opacity-75 animate-bounce transform rotate-45 hover:rotate-0 transition-transform duration-1000" style={{animationDelay: '2s'}}>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-300 to-purple-400 animate-spin" style={{clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', animationDelay: '2s'}}></div>
        </div>
        
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
        
        {/* Curved light streaks */}
        <div className="absolute top-1/2 left-0 w-96 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rotate-12 opacity-60 blur-sm"></div>
        <div className="absolute bottom-1/3 right-0 w-80 h-1 bg-gradient-to-l from-transparent via-blue-400 to-transparent -rotate-12 opacity-60 blur-sm"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-white/10 shadow-2xl">
          {/* Logo */}
           <div className="flex justify-center mb-6">
            <div className="w-8 text-white h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Welcome to <em>VEMS</em></h1>
            <p className="text-gray-300 text-sm">
          Please enter your email to continue
              
            </p>
          </div>

          {/* Form */}
          <div className="space-y-6">
            <div onSubmit={handleLogin}>
            {/* Email */}
            <input
              type="email"
              name="email"
              required
              disabled={isLoading}
              placeholder="emily@gmail.com"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <input
              type="password"
              name="pass"
              required
              disabled={isLoading}
              placeholder="Passwod"
              onChange={(e) => setPass(e.target.value)}
              className="w-full px-4 py-3 mt-[20px] bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {/* Sign up button */}
                 <p> <span className={`text-red-400 mt-3 ml-2 ${notfound ? "block" : "hidden"}`}>This email is not registered</span></p>
            <button
              onClick={handleLogin}
              disabled={isLoading}
              className="cursor-pointer w-full mt-5 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : (
                'Continue'
              )}
            </button>
            <br />
            <p> <span className='text-gray-400'>Don't have an account?</span> <Link to="/register" className="text-blue-500 hover:underline">Sign up</Link></p>
      </div>
          </div>
                    </div>
          </div>


      </div>
  );
}
