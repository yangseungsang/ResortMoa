
import React, { useState, useRef } from 'react';
import { ImageWithFallback } from './ImageWithFallback';

interface GalleryCarouselProps {
  images?: string[];
  showTitle?: boolean;
  heightClass?: string;
  className?: string;
  overlayDots?: boolean;
  children?: React.ReactNode;
}

export const GalleryCarousel = ({ 
  images, 
  showTitle = true, 
  heightClass = "h-48", 
  className = "mb-6",
  overlayDots = false,
  children
}: GalleryCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Drag State
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const MAX_DOTS = 5;

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent drag (e.g. MobileBottomSheet)
    if (!containerRef.current) return;
    setIsDown(true);
    setStartX(e.pageX - containerRef.current.offsetLeft);
    setScrollLeft(containerRef.current.scrollLeft);
  };
  
  const handleMouseLeave = () => {
    setIsDown(false);
  };
  
  const handleMouseUp = () => {
    setIsDown(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDown || !containerRef.current) return;
    e.preventDefault();
    e.stopPropagation(); // Prevent parent drag
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX); // Scroll speed multiplier removed (1:1)
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  // Stop touch propagation to prevent moving the MobileBottomSheet while swiping images
  const handleTouch = (e: React.TouchEvent) => {
      e.stopPropagation();
  };

  const renderIndicators = (isOverlay: boolean) => {
      if (!images || images.length <= 1) return null;

      if (images.length <= MAX_DOTS) {
         return (
            <div className={`flex justify-center space-x-1.5 ${
                isOverlay 
                ? 'absolute bottom-4 left-0 right-0 z-10' 
                : 'mt-3'
            }`}>
              {images.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${
                        idx === activeIndex 
                          ? (isOverlay ? 'w-4 bg-white' : 'w-4 bg-teal-600')
                          : (isOverlay ? 'w-1.5 bg-white/60' : 'w-1.5 bg-slate-300')
                    }`}
                  />
              ))}
            </div>
         );
      } else {
         return (
            <div className={`pointer-events-none ${
                 isOverlay 
                 ? 'absolute bottom-4 right-4 z-10' 
                 : 'flex justify-center mt-3'
            }`}>
                <div className={`${
                    isOverlay
                    ? 'bg-black/60 text-white backdrop-blur-sm'
                    : 'bg-slate-100 text-slate-600'
                } text-[10px] px-2.5 py-1 rounded-full font-bold shadow-sm`}>
                    {activeIndex + 1} / {images.length}
                </div>
            </div>
         );
      }
  };

  if (!images || images.length === 0) return null;

  return (
    <div className={`${className} select-none relative`}>
       {showTitle && <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Gallery</h3>}
       <div className="relative group">
          
          {/* Image Container (Clipped & Rounded) */}
          <div className="relative rounded-xl overflow-hidden shadow-sm bg-slate-100">
              <div 
                 ref={containerRef}
                 onScroll={handleScroll}
                 onMouseDown={handleMouseDown}
                 onMouseLeave={handleMouseLeave}
                 onMouseUp={handleMouseUp}
                 onMouseMove={handleMouseMove}
                 onTouchStart={handleTouch} // Block touch start propagation
                 onTouchMove={handleTouch}  // Block touch move propagation
                 className={`flex overflow-x-auto [&::-webkit-scrollbar]:hidden ${
                    isDown ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory'
                 }`}
                 style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                 {images.map((img, idx) => (
                    <div 
                        key={idx} 
                        className="w-full flex-shrink-0 snap-center snap-always"
                    >
                       <ImageWithFallback 
                          src={img} 
                          draggable={false}
                          alt={`Gallery ${idx + 1}`} 
                          className={`w-full ${heightClass} object-cover bg-slate-50 pointer-events-none`}
                        />
                    </div>
                 ))}
              </div>
              
              {/* Overlay Content (e.g., Title Text) */}
              {children}

              {/* Internal Indicators (if overlayDots is true) */}
              {overlayDots && renderIndicators(true)}
          </div>
          
          {/* External Indicators (if overlayDots is false) */}
          {!overlayDots && renderIndicators(false)}
       </div>
    </div>
  );
};
