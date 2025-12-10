import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import imge from"./logo.jpg"
import {
  Sparkles
} from "lucide-react";
export default function VerificationCodePage() {

  const [verificationCode, setverificationCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let email = typeof window !== 'undefined' ? window.localStorage?.getItem("email") : null;
    
    try {
      const response = await fetch("https://kenzy-api.usif.space/verify", {
        method: "POST",
        body: JSON.stringify({ verificationCode, email }),
        headers: {
          "Content-Type": "application/json"
        }
      });
      const result = await response.json();
      if (result.status === "success") {
        window.location.href="/login"
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Timer countdown
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    // Check if code is complete
    setIsComplete(code.every(digit => digit !== ''));
  }, [code]);

  const handleInputChange = (index, value) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    if (newCode.length === 6) {
        setverificationCode(newCode.join(''));
    }
    // Auto-focus next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      // Focus previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newCode = [...code];
    
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }
    
    setCode(newCode);
    setverificationCode(newCode.join(''));
    
    // Focus next empty input or last input
    const nextEmptyIndex = newCode.findIndex(digit => digit === '');
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const resendCode = () => {
    setTimeLeft(60);
    setCode(['', '', '', '', '', '']);
    setverificationCode('');
    inputRefs.current[0]?.focus();
  };
if (window.localStorage.getItem("email") === "undefined" || window.localStorage.getItem("email") === null) {
    window.location.href = "/register"; // Redirect to register if no email is found
    return null;
  
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Stars */}
        <div className="absolute top-20 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-32 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 left-40 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
        <div className="absolute top-60 right-60 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-0.5 h-0.5 bg-white rounded-full animate-pulse"></div>
        
        {/* Moving squares that become stars */}
        <div 
          className="absolute top-32 right-40 w-8 h-8 bg-gradient-to-br from-blue-300 to-purple-300 opacity-80 animate-pulse transform rotate-45 hover:rotate-0 transition-transform duration-1000"
        >
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-300 to-purple-300 animate-spin" 
            style={{
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)'
            }}
          />
        </div>
        <div 
          className="absolute bottom-32 left-32 w-6 h-6 bg-gradient-to-br from-purple-300 to-pink-300 opacity-60 animate-pulse transform rotate-45 hover:rotate-0 transition-transform duration-1000" 
          style={{animationDelay: '0.5s'}}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-br from-purple-300 to-pink-300 animate-spin" 
            style={{
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', 
              animationDelay: '0.5s'
            }}
          />
        </div>
        
        {/* Additional moving squares */}
        <div 
          className="absolute top-20 left-1/4 w-4 h-4 bg-gradient-to-br from-cyan-300 to-blue-400 opacity-70 animate-bounce transform rotate-45 hover:rotate-0 transition-transform duration-1000" 
          style={{animationDelay: '1s'}}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-br from-cyan-300 to-blue-400 animate-spin" 
            style={{
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', 
              animationDelay: '1s'
            }}
          />
        </div>
        <div 
          className="absolute bottom-20 right-1/3 w-5 h-5 bg-gradient-to-br from-pink-300 to-purple-400 opacity-60 animate-bounce transform rotate-45 hover:rotate-0 transition-transform duration-1000" 
          style={{animationDelay: '1.5s'}}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-br from-pink-300 to-purple-400 animate-spin" 
            style={{
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', 
              animationDelay: '1.5s'
            }}
          />
        </div>
        <div 
          className="absolute top-1/2 right-20 w-6 h-6 bg-gradient-to-br from-indigo-300 to-purple-400 opacity-75 animate-bounce transform rotate-45 hover:rotate-0 transition-transform duration-1000" 
          style={{animationDelay: '2s'}}
        >
          <div 
            className="absolute inset-0 bg-gradient-to-br from-indigo-300 to-purple-400 animate-spin" 
            style={{
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', 
              animationDelay: '2s'
            }}
          />
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
          {/* Back button */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => window.history.back()} 
              className="text-white/70 hover:text-white transition-colors"
              disabled={isLoading}
            >
              <ArrowLeft size={24} />
            </button>
          </div>

          {/* Logo */}
        <div className="flex justify-center mb-6">
                  <div className="w-8 text-white h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div> 
        
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">Verification Code</h1>
            <p className="text-gray-300 text-sm">
              We've sent a verification code to
              <br />
              <span className="text-blue-400">
                {typeof window !== 'undefined' ? window.localStorage?.getItem("email") : "your email"}
              </span>
            </p>
          </div>

          {/* Code Input */}
          <div className="mb-8">
            <div className="flex justify-center gap-3 mb-4">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  disabled={isLoading}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={`w-12 h-14 text-center text-xl font-bold bg-white/10 border-2 rounded-xl text-white focus:outline-none transition-all duration-300 ${
                    digit !== '' 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-white/20 hover:border-white/40'
                  } focus:border-blue-500 focus:bg-blue-500/20 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              ))}
            </div>
            
            {/* Timer and Resend */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-gray-400 text-sm">
                  Resend code in {timeLeft}s
                </p>
              ) : (
                <button
                  onClick={resendCode}
                  disabled={isLoading}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>

          {/* Verify Button */}
          <div onSubmit={handleLogin}>
            <button
              onClick={handleLogin}
              disabled={!isComplete || isLoading}
              className={`w-full py-3 font-semibold rounded-xl transition-all duration-300 transform flex items-center justify-center ${
                isComplete && !isLoading
                  ? 'cursor-pointer bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 hover:scale-105 shadow-lg'
                  : 'bg-white/10 text-gray-400 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                'VERIFY'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
