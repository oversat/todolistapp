import { supabase } from '@/lib/supabase';
import { validateEmail, validatePassword, validateUsername } from '@/lib/validation';

export interface AuthError {
  message: string;
  code?: string;
}

// Guest account credentials
const GUEST_EMAIL = 'guest@chibitodo.com';
const GUEST_PASSWORD = 'Guest123!';

export async function signInAsGuest(): Promise<{ data: any; error: AuthError | null }> {
  try {
    console.log('Attempting guest login with credentials...');
    
    // First try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: GUEST_EMAIL,
      password: GUEST_PASSWORD,
    });

    if (signInError) {
      console.error('Guest login error:', signInError);
      
      // If the error is due to invalid credentials, try to create the account
      if (signInError.message.includes('Invalid login credentials')) {
        console.log('Guest account not found, attempting to create it...');
        
        // Try to create the guest account
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: GUEST_EMAIL,
          password: GUEST_PASSWORD,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            data: {
              is_guest: true
            }
          },
        });

        if (signUpError) {
          console.error('Failed to create guest account:', signUpError);
          throw signUpError;
        }

        // If account creation was successful, try to sign in again
        const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
          email: GUEST_EMAIL,
          password: GUEST_PASSWORD,
        });

        if (retryError) {
          console.error('Failed to sign in after creating guest account:', retryError);
          throw retryError;
        }

        // Ensure we have a profile for the guest user
        if (retryData.user) {
          await ensureGuestProfile(retryData.user.id);
        }

        return { data: retryData, error: null };
      }
      
      throw signInError;
    }

    // If successful, ensure we have a profile for the guest user
    if (signInData.user) {
      await ensureGuestProfile(signInData.user.id);
    }

    return { data: signInData, error: null };
  } catch (error) {
    console.error('Sign in as guest caught error:', error);
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'An error occurred during guest sign in',
        code: error instanceof Error ? error.name : undefined,
      },
    };
  }
}

async function ensureGuestProfile(userId: string) {
  try {
    // Check if user has a profile
    const { data: profileData, error: profileCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (profileCheckError && profileCheckError.code !== 'PGRST116') {
      console.error('Profile check error:', profileCheckError);
      return;
    }

    // If no profile exists, create one
    if (!profileData) {
      console.log('Creating guest profile...');
      const { error: createProfileError } = await supabase
        .from('users')
        .insert([{
          id: userId,
          username: 'Guest',
        }]);

      if (createProfileError) {
        console.error('Create guest profile error:', createProfileError);
        return;
      }

      console.log('Creating default chibi for guest...');
      // Create a default chibi for guest users
      const { error: createChibiError } = await supabase
        .from('chibis')
        .insert([{
          user_id: userId,
          name: 'Guest Chibi',
          type: 'fox',
          happiness: 70,
          energy: 80,
          last_fed: new Date().toISOString()
        }]);

      if (createChibiError) {
        console.error('Create guest chibi error:', createChibiError);
      }
    }
  } catch (error) {
    console.error('Error ensuring guest profile:', error);
  }
}

export async function signUp(
  email: string,
  password: string,
  username: string // Keep parameter for backward compatibility
): Promise<{ data: any; error: AuthError | null }> {
  try {
    // Validate inputs
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return { data: null, error: { message: emailValidation.message! } };
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { data: null, error: { message: passwordValidation.message! } };
    }

    // Generate a default username if none provided
    const defaultUsername = email.split('@')[0];
    
    // 1. Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (authError) throw authError;

    // 2. Create user profile with generated username
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            id: authData.user.id,
            username: defaultUsername,
          },
        ]);

      if (profileError) throw profileError;
    }

    return { data: authData, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'An error occurred during sign up',
        code: error instanceof Error ? error.name : undefined,
      },
    };
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<{ data: any; error: AuthError | null }> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    return {
      data: null,
      error: {
        message: error instanceof Error ? error.message : 'An error occurred during sign in',
        code: error instanceof Error ? error.name : undefined,
      },
    };
  }
}

export async function signOut(): Promise<{ error: AuthError | null }> {
  try {
    // Clear any cached data first
    localStorage.removeItem('supabase.auth.token');
    sessionStorage.removeItem('supabase.auth.token');
    
    const { error } = await supabase.auth.signOut();
    
    // Additional cleanup
    if (!error) {
      // Clear any remaining auth state
      await supabase.auth.getSession();
    }
    
    return { error: error ? { message: error.message } : null };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : 'An error occurred during sign out',
      },
    };
  }
}

export async function resendVerificationEmail(
  email: string
): Promise<{ error: AuthError | null }> {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    return { error: error ? { message: error.message } : null };
  } catch (error) {
    return {
      error: {
        message: error instanceof Error ? error.message : 'Failed to resend verification email',
      },
    };
  }
} 