import React from 'react';

interface BrandTextProps {
  children: React.ReactNode;
  className?: string;
}

export const BrandText: React.FC<BrandTextProps> = ({ children, className = '' }) => {
  if (typeof children !== 'string') {
    return <span className={className}>{children}</span>;
  }
  
  const formatted = children.toUpperCase().replace(/A/g, '\u039B');
  return (
    <span className={className}>
      <span className="sr-only">{children}</span>
      <span aria-hidden="true">{formatted}</span>
    </span>
  );
};
