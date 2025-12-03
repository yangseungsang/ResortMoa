
import React, { useState, useEffect, useRef } from 'react';

interface MobileBottomSheetProps {
  children: React.ReactNode;
  isVisible: boolean;
  onClose: () => void;
}

// Snap Points Configuration
const SNAP_TOP = 100;
const SNAP_MIDDLE = 60; // "Middle"
const BACKDROP_THRESHOLD = 30; // Show backdrop when above this height
const CLOSE_THRESHOLD = 15; // Drag below this to close

export const MobileBottomSheet: React.FC<MobileBottomSheetProps> = ({ children, isVisible, onClose }) => {
  const [height, setHeight] = useState(SNAP_MIDDLE);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Ref to track the actual scrollable element dynamically
  const activeScrollRef = useRef<HTMLElement | null>(null);
  
  // Refs for drag calculation
  const startY = useRef<number>(0);
  const startHeight = useRef<number>(0);
  const isAtTop = useRef<boolean>(true); // Track logic for desktop/mouse events
  
  // Ref to track current height for event listeners
  const heightRef = useRef(height);
  useEffect(() => { heightRef.current = height; }, [height]);

  useEffect(() => {
    if (isVisible) {
      setHeight(SNAP_MIDDLE); // Default to Middle position on open
    }
  }, [isVisible]);

  const isExpanded = height >= (SNAP_TOP - 2);
  const isMaximized = height >= 100;

  // --- Touch Handlers (Mobile) ---
  const handleTouchStart = (e: React.TouchEvent) => {
    // 1. Find the actual scrollable parent under the finger
    // This solves the issue where nested components (like ResortDetailPanel) handle the scroll,
    // leaving contentRef.scrollTop always at 0.
    let target = e.target as HTMLElement;
    let scrollParent: HTMLElement | null = null;

    // Traverse up until we hit the sheet container or find a scrollable element
    while (target && target !== sheetRef.current) {
        const style = window.getComputedStyle(target);
        const overflowY = style.overflowY;
        // Check if element is scrollable AND has content larger than itself
        const isScrollable = (overflowY === 'auto' || overflowY === 'scroll') && target.scrollHeight > target.clientHeight;
        
        if (isScrollable) {
            scrollParent = target;
            break;
        }
        target = target.parentElement as HTMLElement;
    }
    
    activeScrollRef.current = scrollParent;

    setIsDragging(true);
    startY.current = e.touches[0].clientY;
    startHeight.current = sheetRef.current ? sheetRef.current.clientHeight : 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = startY.current - currentY; // Positive = Drag Up, Negative = Drag Down

    // Smart Drag Logic for Touch
    if (isExpanded) {
        // 1. Dragging UP (Scrolling content down)
        // If we found a valid scroll container, let native scroll handle it.
        // Even if we didn't find one, we usually don't want to drag the sheet up past 100%.
        if (deltaY > 0) {
             return; 
        }

        // 2. Dragging DOWN (Scrolling content up)
        // CRITICAL: Check the dynamically detected scroll parent, not just contentRef
        if (deltaY < 0) {
            if (activeScrollRef.current && activeScrollRef.current.scrollTop > 0) {
                return; // Content is not at top, allow content scroll
            }
        }
    }

    // Otherwise, resize the sheet
    const windowHeight = window.innerHeight;
    const newHeightPx = startHeight.current + deltaY;
    const newHeightPercent = (newHeightPx / windowHeight) * 100;

    if (newHeightPercent > 10 && newHeightPercent <= 100) {
        setHeight(newHeightPercent);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    snapToPosition(height);
    activeScrollRef.current = null; // Reset
  };

  // --- Mouse Handlers (Desktop Testing) ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if (contentRef.current && isExpanded) {
        isAtTop.current = contentRef.current.scrollTop <= 0;
    } else {
        isAtTop.current = true;
    }
    
    setIsDragging(true);
    startY.current = e.clientY;
    startHeight.current = sheetRef.current ? sheetRef.current.clientHeight : 0;
    
    document.addEventListener('mousemove', handleGlobalMouseMove);
    document.addEventListener('mouseup', handleGlobalMouseUp);
  };

  const handleGlobalMouseMove = useRef((e: MouseEvent) => {
    const currentY = e.clientY;
    const deltaY = startY.current - currentY;
    
    const isExpandedRef = heightRef.current >= (SNAP_TOP - 2);

    if (isExpandedRef && deltaY > 0) return;
    if (isExpandedRef && deltaY < 0) {
        if (!isAtTop.current || (contentRef.current && contentRef.current.scrollTop > 0)) {
             return;
        }
    }

    const windowHeight = window.innerHeight;
    const newHeightPx = startHeight.current + deltaY;
    const newHeightPercent = (newHeightPx / windowHeight) * 100;

    if (newHeightPercent > 10 && newHeightPercent <= 100) {
        setHeight(newHeightPercent);
    }
  }).current;

  const handleGlobalMouseUp = useRef(() => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleGlobalMouseMove);
    document.removeEventListener('mouseup', handleGlobalMouseUp);
    snapToPosition(heightRef.current);
  }).current;

  // 2-Stage Snap Logic (Middle / Top)
  const snapToPosition = (currentHeight: number) => {
    if (currentHeight < CLOSE_THRESHOLD) {
      onClose();
      return;
    }
    
    // Calculate distances to snap points
    const distTop = Math.abs(currentHeight - SNAP_TOP);
    const distMiddle = Math.abs(currentHeight - SNAP_MIDDLE);
    
    // Determine closest snap point
    if (distTop < distMiddle) {
        setHeight(SNAP_TOP);
    } else {
        setHeight(SNAP_MIDDLE);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[500] pointer-events-none md:hidden flex flex-col justify-end">
      {/* Backdrop */}
      <div 
         className={`
            absolute inset-0 bg-black/30 transition-opacity duration-300
            ${height > BACKDROP_THRESHOLD ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
         `}
         onClick={onClose}
      />

      {/* Sheet Container */}
      <div
        ref={sheetRef}
        className={`
            w-full bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.15)] relative flex flex-col pointer-events-auto
            ${isMaximized ? 'rounded-none' : 'rounded-t-2xl'}
        `}
        style={{ 
            height: `${height}%`,
            transition: isDragging ? 'none' : 'height 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' 
        }}
        // Handlers attached to the container to allow dragging anywhere
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
      >
        {/* Drag Handle Visual */}
        <div 
            className={`
                w-full flex items-center justify-center flex-shrink-0 cursor-grab active:cursor-grabbing bg-slate-50 border-b border-slate-100 
                transition-all duration-300 ease-in-out overflow-hidden
                ${isMaximized ? 'h-0 opacity-0 border-none' : 'h-8 opacity-100 rounded-t-2xl'}
            `}
        >
            <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Content */}
        <div 
            ref={contentRef}
            className={`
                flex-1 overflow-y-auto bg-white
                ${isExpanded ? 'overflow-y-auto' : 'overflow-hidden'}
            `}
        >
            {children}
        </div>
      </div>
    </div>
  );
};
