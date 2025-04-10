import React from 'react';
import { cn } from '@/lib/utils';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  zIndex?: number;
}

export function Window({ children, title, className, zIndex }: WindowProps) {
  return (
    <div 
      className={cn(
        'bg-gray-200 border-2 border-white border-r-gray-600 border-b-gray-600 shadow-xl relative',
        className
      )}
      style={{ zIndex }}
    >
      {/* Title bar - always on top */}
      <div className="bg-gradient-to-r from-neon-blue to-neon-purple px-2 py-1 relative z-[2]">
        <span className="font-vt323 text-white">{title}</span>
      </div>
      {/* Content area - below title bar */}
      <div className="p-4 relative z-[1]">
        {children}
      </div>
    </div>
  );
} 