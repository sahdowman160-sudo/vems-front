import React from 'react'
import img from "./logo.jpg"
import { Link } from "react-router-dom";

import {Sparkles} from "lucide-react"
export default function Footer() {
  return (
    <div>
  <footer className="bg-gradient-to-b from-gray-900 from-20% to-black to-80% text-white z-0 py-8 sm:py-12 px-4 md:px-8 lg:px-16 min-h-[400px] relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 sm:w-80 h-48 sm:h-80 bg-gradient-to-l from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent transform rotate-12 animate-pulse"></div>
            <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent transform -rotate-12 animate-pulse delay-500"></div>
          </div>

          <div className="absolute inset-0 opacity-5">
            <div className="grid grid-cols-12 h-full">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="border-r border-white/10 h-full"></div>
              ))}
            </div>
          </div>
        </div>

        <div
          className="absolute inset-0 z-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(31, 41, 55, 0.5) 0%, transparent 50%, rgba(0, 0, 0, 0.5) 70%)",
            top: "-50%",
          }}
        ></div>

        <div className="container mx-auto relative z-10">
          {/* Responsive Grid: 1 col mobile, 2 cols tablet, 4 cols desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            
            {/* Company Info Column */}
            <div className="text-center sm:text-left lg:col-span-1">
              <div className="flex items-center justify-center sm:justify-start mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full mr-2 flex items-center justify-center text-xl font-bold overflow-hidden">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
                </div>
                <span className="text-xl sm:text-2xl font-bold">VEMS</span>
              </div>
              <p className="text-gray-300 text-sm mb-4 max-w-xs mx-auto sm:mx-0">
                Streamline your business's financial operations with our
                intuitive, scalable SaaS platform.
              </p>
              <p className="text-gray-500 text-xs sm:text-sm">
                &copy; 2025 VEMS. All rights reserved.
              </p>
            </div>

            {/* Quick Links - Hidden on mobile */}
            <div className="hidden sm:block lg:col-span-1">
              <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-gray-300 hover:text-white transition-colors text-sm block">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/Contact" className="text-gray-300 hover:text-white transition-colors text-sm block">
                    Contact
                  </Link>
                </li>

              </ul>
            </div>

            {/* Social Media Column */}
        

            {/* Credits Column */}
            <div className="text-center sm:text-left lg:col-span-1">
              <h3 className="text-white font-semibold text-lg mb-4">Credits</h3>
              <p className="text-gray-400 text-sm">
                MADE BY <span className="font-semibold text-white">Galaxy-Station</span>
              </p>
            </div>
          </div>

          {/* Mobile-only Quick Links at Bottom */}
          <div className="sm:hidden mt-8 pt-6 border-t border-white/10">
            <div className="flex flex-wrap justify-center gap-3 text-sm">
              <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                Home
              </Link>
              <Link to="/Contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
