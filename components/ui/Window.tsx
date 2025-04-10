import React from 'react';
import { cn } from '@/lib/utils';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Window({ children, title, className }: WindowProps) {
  return (
    <div className={cn(
      'bg-gray-200 border-2 border-white border-r-gray-600 border-b-gray-600 shadow-xl',
      className
    )}>
      <div className="bg-gradient-to-r from-neon-blue to-neon-purple px-2 py-1">
        <span className="font-vt323 text-white">{title}</span>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
} 