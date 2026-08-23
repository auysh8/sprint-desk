import React from 'react';
import { cn } from '../../utils/cn';

export interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  textClassName?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className,
  textClassName,
}) => {
  const iconSizes = {
    sm: 'h-7 w-7 rounded-lg',
    md: 'h-8 w-8 rounded-xl',
    lg: 'h-10 w-10 rounded-2xl',
  };

  const textSizes = {
    sm: 'text-sm font-bold',
    md: 'text-sm font-bold tracking-tight',
    lg: 'text-xl font-bold tracking-tight',
  };

  return (
    <div className={cn('flex items-center gap-2.5 select-none', className)}>
      <div
        className={cn(
          'relative flex items-center justify-center bg-white shadow-md shadow-white/10 text-black shrink-0',
          iconSizes[size]
        )}
      >
        {/* Bespoke Agile Sprint Velocity Mark */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-[55%] w-[55%] text-black"
        >
          <rect x="3" y="3" width="7" height="9" rx="1.5" fill="currentColor" fillOpacity="0.25" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" fill="currentColor" />
          <rect x="14" y="12" width="7" height="9" rx="1.5" fill="currentColor" fillOpacity="0.25" />
          <rect x="3" y="16" width="7" height="5" rx="1.5" fill="currentColor" />
        </svg>
      </div>

      {showText && (
        <span className={cn('text-white font-extrabold truncate', textSizes[size], textClassName)}>
          SprintDesk
        </span>
      )}
    </div>
  );
};
