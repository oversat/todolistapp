import React from 'react';
import { useSettings } from '@/hooks/useSettings';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { settings } = useSettings();

  return (
    <div className={`min-h-screen ${settings.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 