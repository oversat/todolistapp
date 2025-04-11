'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/auth/AuthForm';
import { supabase } from '@/lib/supabase';
import { Window } from '@/components/ui/Window';

export default function LoginPage() {
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    let mounted = true;
    
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          return;
        }
        
        if (mounted && data.session) {
          router.push('/');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      }
    };
    
    // Set up auth state change listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        if (event === 'SIGNED_IN' && session) {
          router.push('/');
        } else if (event === 'SIGNED_OUT') {
          // Clear any cached data
          localStorage.removeItem('supabase.auth.token');
        }
      }
    });

    // Then check session
    checkSession();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-blue bg-grid-pattern">
      <Window title="Welcome to TodoMagatchi" className="max-w-md w-full">
        <div className="p-6">
          <div className="mb-6 text-center">
            <h1 className="text-4xl font-vt323 text-[#33ff33] animate-pulse mb-2">TODOMAGATCHI</h1>
            <p className="text-md font-vt323">Your Y2K virtual pet task manager</p>
          </div>
          <AuthForm />
        </div>
      </Window>
    </div>
  );
}