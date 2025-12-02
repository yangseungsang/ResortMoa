
import React from 'react';

export const BrandLogo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 40 40" 
    fill="none" 
    className={className}
  >
    {/* Background Shape */}
    <rect x="0" y="0" width="40" height="40" rx="10" fill="#0d9488" />
    
    {/* Stylized 'M' / Mountain Icon */}
    <path 
      d="M10 28V14L20 22L30 14V28" 
      stroke="white" 
      strokeWidth="4" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
    />
  </svg>
);
