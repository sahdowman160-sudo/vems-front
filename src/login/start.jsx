import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Sparkles
} from "lucide-react";

const ChickidsLanding = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isRinging, setIsRinging] = useState(false);
  const [buttonPosition, setButtonPosition] = useState(4);
  const [showElements, setShowElements] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const buttonRef = useRef(null);
  const containerRef = useRef(null);
  const startXRef = useRef(0);
  const maxSlideRef = useRef(0);

  // حساب المسافة القصوى للسحب
  const calculateMaxSlide = useCallback(() => {
    if (containerRef.current && buttonRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      const buttonWidth = buttonRef.current.offsetWidth;
      maxSlideRef.current = containerWidth - buttonWidth - 8;
    }
  }, []);

  const completeSlide = useCallback(() => {
    setIsDragging(false);
    setButtonPosition(maxSlideRef.current);
    setIsUnlocked(true);
    
    setTimeout(() => {
      window.location.href = '/home'; // Redirect to the home page
      
      // Reset after success
      setTimeout(() => {
        setButtonPosition(4);
        setIsUnlocked(false);
        
        setTimeout(() => {
          setIsRinging(true);
        }, 500);
      }, 2000);
    }, 200);
  }, []);

  useEffect(() => {
    // Detect if device is mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024 || ('ontouchstart' in window));
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    setTimeout(() => setShowElements(true), 100);
    const ringTimer = setTimeout(() => setIsRinging(true), 2000);

    calculateMaxSlide();

    const handleResize = () => calculateMaxSlide();
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(ringTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('resize', checkMobile);
    };
  }, [calculateMaxSlide]);

  const startDrag = useCallback((e) => {
    if (!isMobile) return; // Only allow drag on mobile
    
    setIsDragging(true);
    setIsRinging(false);

    const clientX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
    startXRef.current = clientX - buttonPosition;

    e.preventDefault();
  }, [buttonPosition, isMobile]);

  const drag = useCallback((e) => {
    if (!isDragging || !containerRef.current) return;

    const clientX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
    const containerRect = containerRef.current.getBoundingClientRect();
    let newPosition = clientX - startXRef.current - containerRect.left;

    newPosition = Math.max(4, Math.min(newPosition, maxSlideRef.current));
    setButtonPosition(newPosition);

    if (newPosition >= maxSlideRef.current * 0.8) {
      completeSlide();
    }

    e.preventDefault();
  }, [isDragging, completeSlide]);

  const stopDrag = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    if (buttonPosition < maxSlideRef.current * 0.8) {
      setButtonPosition(4);
    }
  }, [isDragging, buttonPosition]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', drag);
      document.addEventListener('mouseup', stopDrag);
      document.addEventListener('touchmove', drag, { passive: false });
      document.addEventListener('touchend', stopDrag);
    }

    return () => {
      document.removeEventListener('mousemove', drag);
      document.removeEventListener('mouseup', stopDrag);
      document.removeEventListener('touchmove', drag);
      document.removeEventListener('touchend', stopDrag);
    };
  }, [isDragging, drag, stopDrag]);

  const handleDesktopClick = () => {
      window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white flex flex-col">
      
      {/* Header */}
      <header className="flex justify-between items-center p-6 md:p-8">
        <div className="text-2xl md:text-3xl font-black tracking-[4px]">
           VEMS
        </div>
        <div className="text-sm md:text-base text-gray-400">
          Premium  Fashion
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Hero Image Section */}
        <div className={`w-full max-w-md mb-12 transition-all duration-800 ${
          showElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="aspect-[3/4] rounded-3xl relative overflow-hidden shadow-2xl hover:scale-105 transition-transform duration-500 mx-auto"
               style={{ background: 'linear-gradient(45deg, #8B4513, #A0522D)' }}>
            <div className="w-full h-full flex flex-col items-center justify-center"
                 style={{ background: 'radial-gradient(circle at center, #D2B48F 30%, #8B7355 60%)' }}>
              <div className="relative mb-6">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-yellow-100 rounded-full shadow-lg relative">
                  <div className="absolute -top-8 -left-2 w-28 h-16 md:w-32 md:h-18 bg-yellow-800 rounded-t-full shadow-inner"></div>
                </div>
              </div>
              <div className="w-32 h-48 md:w-36 md:h-52 relative rounded-2xl overflow-hidden"
                   style={{ background: 'linear-gradient(45deg, #654321, #8B4513)' }}>
                <div className="w-full h-full opacity-60 rounded-2xl"
                     style={{
                       backgroundImage: `
                         linear-gradient(45deg, #333 25%, transparent 25%),
                         linear-gradient(-45deg, #333 25%, transparent 25%),
                         linear-gradient(45deg, transparent 75%, #333 75%),
                         linear-gradient(-45deg, transparent 75%, #333 75%)`,
                       backgroundSize: '15px 15px',
                       backgroundPosition: '0 0, 0 7.5px, 7.5px -7.5px, -7.5px 0px'
                     }}>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Text */}
        
        <div className={`text-center mb-16 max-w-2xl transition-all duration-800 delay-200 ${
          showElements ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6 uppercase tracking-wide text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text">
            Get Ready to Try Clothes
          </h1>
          <p className="text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-xl mx-auto">
            Discover Trendy Outfits, With AI
          </p>
        </div>

        {/* Normal Button for All Devices */}
        <div className={`w-full max-w-md transition-all duration-800 delay-400`}>
          <button
            onClick={handleDesktopClick}
            className="w-full h-16 md:h-18 rounded-full bg-gradient-to-br from-white to-gray-100 text-gray-800 font-bold text-xl md:text-2xl shadow-lg hover:scale-105 transition-all duration-300 uppercase tracking-wide"
          >
            GET STARTED
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 md:p-8 text-center">
        <div className="flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 VEMS . Premium fashion for your mind. Build by{' '}
            <span className="text-white hover:text-gray-300 transition-colors cursor-pointer">Galaxy-Station</span>
          </p>
          <div className="flex space-x-6 text-gray-400">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Collections</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(20px);
          }
        }
        .animate-pulse {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ChickidsLanding;
