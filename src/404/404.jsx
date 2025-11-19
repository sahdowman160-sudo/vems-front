import React from 'react';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Flowing lines */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 animate-pulse"></div>
          <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transform -rotate-12 animate-pulse delay-500"></div>
        </div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white/10 h-full"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Website label */}
        <div className="mb-8">
          <span className="inline-flex items-center px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-sm text-white/70 text-sm font-medium">
            <div className="w-2 h-2 bg-white/60 rounded-full mr-2"></div>
            VEMS
          </span>
        </div>

        {/* 404 Text with glassmorphism effect */}
        <div className="relative mb-8">
          <h1 className="text-[12rem] md:text-[16rem] font-black text-transparent bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600 bg-clip-text leading-none tracking-tight">
            404
          </h1>
          
          {/* Glowing overlay effect */}
          <div className="absolute inset-0 text-[12rem] md:text-[16rem] font-black text-transparent bg-gradient-to-br from-orange-400/30 to-red-500/30 bg-clip-text leading-none tracking-tight blur-sm">
            404
          </div>
        </div>

        {/* Page Not Found text */}
        <h2 className=" text-3xl md:text-4xl font-bold text-white mb-12 tracking-wide">
          Page Not Found!
        </h2>

        {/* Back Home button */}
        <button 
          onClick={() => window.history.back()}
          className="group cursor-pointer relative inline-flex items-center px-8 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg transition-all duration-300 hover:bg-white/20 hover:border-white/30 hover:scale-105 active:scale-95"
        >
          <span className="relative z-10">Back Home</span>
          
          {/* Button glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Animated border */}
          <div className="absolute inset-0 rounded-full border border-transparent bg-gradient-to-r from-orange-400/50 to-red-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm"></div>
        </button>

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`absolute w-1 h-1 bg-white/40 rounded-full animate-pulse`}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 2) * 40}%`,
                animationDelay: `${i * 500}ms`,
                animationDuration: `${2000 + i * 300}ms`
              }}
            ></div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-white/40 text-sm">
          ©2025 VEMS  • Built by{' '}
          <span className="text-white/60 hover:text-white/80 transition-colors cursor-pointer">
            SHADOW
          </span>
        </p>
      </div>
    </div>
  );
}