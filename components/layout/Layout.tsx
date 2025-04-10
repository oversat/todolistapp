import React from 'react';
// layout component
interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-dark-blue bg-grid-pattern">
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
} 