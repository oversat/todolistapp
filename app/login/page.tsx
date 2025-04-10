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
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.push('/');
      }
    };
    
    checkSession();
    
    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        router.push('/');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-blue bg-grid-pattern">
      <Window title="Welcome to Chibi Todo" className="max-w-md w-full">
        <div className="p-6">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold font-pressStart mb-2">CHIBI TODO</h1>
            <p className="text-md">Your Y2K-themed task management app</p>
          </div>
          <AuthForm />
        </div>
      </Window>
    </div>
  );
}