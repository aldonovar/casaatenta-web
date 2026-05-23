import React from 'react';

interface BrandTextProps {
  children: React.ReactNode;
  className?: string;
}

export const BrandText: React.FC<BrandTextProps> = ({ children, className = '' }) => {
  // Safe check if children is not a string (e.g. array, react element, etc.)
  if (typeof children !== 'string') {
    return <span className={className}>{children}</span>;
  }
  
  // Standardize headers and display texts to all uppercase and replace 'A' with 'Λ'
  const formatted = children.toUpperCase().replace(/A/g, 'Λ');
  return <span className={className}>{formatted}</span>;
};
