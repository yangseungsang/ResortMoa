
import React from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({ src, alt, className, fallbackText, ...props }) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    // Fallback SVG Placeholder
    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='%23cbd5e1' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'/%3E%3Cpolyline points='21 15 16 10 5 21'/%3E%3C/svg%3E";
    // Add classes to style the placeholder nicely (gray background, centered icon look)
    const existingClasses = className || "";
    e.currentTarget.className = `${existingClasses} bg-slate-100 p-4 opacity-70 object-contain`;
  };

  return (
    <img 
      src={src} 
      alt={alt} 
      className={className} 
      onError={handleImageError}
      {...props} 
    />
  );
};
