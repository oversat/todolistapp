import React from 'react';
import { cn } from '@/lib/utils';

interface DialogProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
}

interface DialogButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Dialog({ title, isOpen, onClose, children, className }: DialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={cn(
        "w-full max-w-md bg-black border-2 border-blue-500",
        className
      )}>
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4">
          <h2 className="text-white font-vt323 text-2xl">{title}</h2>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export function DialogButton({ children, onClick, variant = 'primary', disabled }: DialogButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-6 py-2 font-vt323 text-lg transition-colors",
        variant === 'primary' && "bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50",
        variant === 'secondary' && "bg-gray-200 text-black hover:bg-gray-300"
      )}
    >
      {children}
    </button>
  );
} 