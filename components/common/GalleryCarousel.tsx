
import React, { useState, useRef } from 'react';
import { ImageWithFallback } from './ImageWithFallback';

interface GalleryCarouselProps {
  images?: string[];
  showTitle?: boolean;
  heightClass?: string;
}

export const GalleryCarousel = ({ images, showTitle = true, heightClass = "h-48" }: GalleryCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Drag State
  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, clientWidth } = containerRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveIndex(index);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
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
    const x = e.pageX - containerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    containerRef.current.scrollLeft = scrollLeft - walk;
  };

  if (!images || images.length === 0) return null;

  return (
    <div className="mb-6 select-none">
       {showTitle && <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Gallery</h3>}
       <div className="relative group">
          <div 
             ref={containerRef}
             onScroll={handleScroll}
             onMouseDown={handleMouseDown}
             onMouseLeave={handleMouseLeave}
             onMouseUp={handleMouseUp}
             onMouseMove={handleMouseMove}
             className={`flex overflow-x-auto rounded-xl [&::-webkit-scrollbar]:hidden ${
                isDown ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-mandatory'
             }`}
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
             {images.map((img, idx) => (
                <div 
                    key={idx} 
                    className="w-full flex-shrink-0 snap-center"
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
          {/* Dot Indicators */}
          {images.length > 1 && (
            <div className="flex justify-center mt-3 space-x-1.5">
              {images.map((_, idx) => (
                  <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeIndex ? 'w-4 bg-teal-600' : 'w-1.5 bg-slate-300'
                    }`}
                  />
              ))}
            </div>
          )}
       </div>
    </div>
  );
};
