import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false, light = true }) => {
  const colorClass = light ? 'text-brand-light' : 'text-brand-dark';

  if (iconOnly) {
    return (
      <svg
        viewBox="0 0 760 760"
        className={`h-9 w-9 md:h-11 md:w-11 fill-none stroke-current transition-all duration-300 ${colorClass} ${className}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="CASA ATENTA"
      >
        <g strokeLinecap="round" strokeLinejoin="round">
          <circle cx="380" cy="380" r="165" strokeWidth="24" />
          <circle cx="380" cy="380" r="120" strokeWidth="7" />
          <path d="M 321 362 L 380 329 L 439 362" strokeWidth="15" />
          <path d="M 380 395 L 380 447" strokeWidth="15" />
        </g>
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 2400 760"
      className={`h-9 md:h-11 w-auto fill-none stroke-current transition-all duration-300 ${colorClass} ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="CASA ATENTA Logo"
    >
      <g strokeLinecap="round" strokeLinejoin="round">
        <g id="sensor-icon">
          <circle cx="280" cy="380" r="165" strokeWidth="24" />
          <circle cx="280" cy="380" r="120" strokeWidth="7" />
          <path d="M 221 362 L 280 329 L 339 362" strokeWidth="15" />
          <path d="M 280 395 L 280 447" strokeWidth="15" />
        </g>
        <g id="wordmark" strokeWidth="7.5">
          {/* C */}
          <path d="M 704.40 318.90 C 651.30 318.90 615.90 354.30 615.90 395.60 C 615.90 436.90 651.30 472.30 704.40 472.30" />
          {/* A (as a lambda/chevron wordmark) */}
          <path d="M 776.00 472.30 L 826.74 318.90 L 877.48 472.30" />
          {/* S */}
          <path d="M 1042.30 334.24 C 1015.16 315.36 963.24 316.54 957.34 357.84 C 951.44 395.60 1042.30 383.80 1038.76 429.82 C 1035.22 477.02 978.58 479.38 947.90 454.60" />
          {/* A */}
          <path d="M 1113.90 472.30 L 1164.64 318.90 L 1215.38 472.30" />
          {/* A */}
          <path d="M 1380.80 472.30 L 1431.54 318.90 L 1482.28 472.30" />
          {/* T */}
          <path d="M 1546.80 318.90 L 1658.90 318.90 M 1602.85 318.90 L 1602.85 472.30" />
          {/* E */}
          <path d="M 1815.46 318.90 L 1724.60 318.90 L 1724.60 472.30 L 1817.82 472.30 M 1724.60 395.60 L 1801.30 395.60" />
          {/* N */}
          <path d="M 1890.60 472.30 L 1890.60 318.90 L 1990.90 472.30 L 1990.90 318.90" />
          {/* T */}
          <path d="M 2056.60 318.90 L 2168.70 318.90 M 2112.65 318.90 L 2112.65 472.30" />
          {/* A */}
          <path d="M 2234.40 472.30 L 2285.14 318.90 L 2335.88 472.30" />
        </g>
      </g>
    </svg>
  );
};

