import React from 'react';
import { BrandText } from './BrandText';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false, light = true }) => {
  const strokeColor = light ? '#f5f5f3' : '#0d0d0d';
  const textColor = light ? 'text-brand-light' : 'text-brand-dark';

  return (
    <div className={`flex items-center space-x-3.5 select-none ${className}`}>
      {/* Sleek Chevron Power-ring SVG Icon */}
      <svg
        viewBox="0 0 100 100"
        className="h-9 w-9 md:h-11 md:w-11 object-contain"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Ring */}
        <circle
          cx="50"
          cy="50"
          r="44"
          stroke={strokeColor}
          strokeWidth="2.5"
          className="opacity-95 transition-opacity duration-300 group-hover:opacity-100"
        />
        {/* Inner Ring */}
        <circle
          cx="50"
          cy="50"
          r="36"
          stroke={strokeColor}
          strokeWidth="1.5"
          className="opacity-40 transition-opacity duration-300 group-hover:opacity-75"
        />
        {/* Chevron Up */}
        <path
          d="M34 52L50 36L66 52"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 ease-out group-hover:-translate-y-[2px]"
        />
        {/* Vertical Line */}
        <path
          d="M50 49V64"
          stroke={strokeColor}
          strokeWidth="3"
          strokeLinecap="round"
          className="transition-transform duration-300 ease-out group-hover:-translate-y-[1px]"
        />
      </svg>

      {!iconOnly && (
        <span
          className={`text-sm md:text-base tracking-[0.35em] font-sans font-light uppercase ${textColor}`}
        >
          <BrandText>CASA ATENTA</BrandText>
        </span>
      )}
    </div>
  );
};
