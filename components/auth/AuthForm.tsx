'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/elements/input';
import { Label } from '@/components/elements/label';
import { Card } from '@/components/layout/card';
import { useToast } from '@/hooks/use-toast';
import { signIn, signUp, resendVerificationEmail, signInAsGuest } from '@/lib/auth';
import { validateEmail, validatePassword, validateUsername } from '@/lib/validation';

export function AuthForm() {
  const { toast } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateForm() {
    const newErrors: Record<string, string> = {};

    // Allow empty form for guest login (we'll handle this in handleSubmit)
    if (!isSignUp && formData.email === '' && formData.password === '') {
      return true;
    }

    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.valid) {
      newErrors.email = emailValidation.message!;
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message!;
    }

    if (isSignUp) {
      const usernameValidation = validateUsername(formData.username);
      if (!usernameValidation.valid) {
        newErrors.username = usernameValidation.message!;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // If both email and password are empty in login mode, treat as guest login
    if (!isSignUp && formData.email === '' && formData.password === '') {
      handleGuestSignIn();
      return;
    }
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(
          formData.email,
          formData.password,
          formData.username
        );
        if (error) throw error;
        setVerificationSent(true);
        toast({
          title: 'Account created!',
          description: 'Please check your email to verify your account.',
        });
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast({
          title: 'Welcome back!',
          description: 'Successfully logged in.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleResendVerification() {
    setLoading(true);
    try {
      const { error } = await resendVerificationEmail(formData.email);
      if (error) throw error;
      toast({
        title: 'Verification email sent',
        description: 'Please check your email for the verification link.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to resend verification email',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleGuestSignIn() {
    console.log('Starting guest sign in process...');
    setLoading(true);
    try {
      console.log('Calling signInAsGuest...');
      const { error } = await signInAsGuest();
      if (error) {
        console.error('Guest sign in error:', error);
        throw error;
      }
      console.log('Guest sign in successful');
      toast({
        title: 'Welcome Guest!',
        description: 'You can now start using the app with a guest account.',
      });
    } catch (error) {
      console.error('Guest sign in caught error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  if (verificationSent) {
    return (
      <Card className="max-w-md mx-auto mt-20 p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Verify Your Email</h1>
        <p className="text-center mb-4">
          We've sent a verification email to {formData.email}. Please check your inbox and click the verification link.
        </p>
        <div className="space-y-4">
          <Button
            className="w-full"
            onClick={handleResendVerification}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          <button
            type="button"
            onClick={() => {
              setVerificationSent(false);
              setIsSignUp(false);
            }}
            className="w-full text-sm text-muted-foreground hover:text-foreground"
          >
            Back to Sign In
          </button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {isSignUp ? 'Create Account' : 'Welcome Back'}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              className={errors.username ? 'border-destructive' : ''}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username}</p>
            )}
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={errors.email ? 'border-destructive' : ''}
            placeholder={!isSignUp ? 'Leave empty for guest login' : 'Enter your email'}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={errors.password ? 'border-destructive' : ''}
            placeholder={!isSignUp ? 'Leave empty for guest login' : 'Enter your password'}
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </div>
        <Button className="w-full" disabled={loading}>
          {loading
            ? 'Loading...'
            : isSignUp
            ? 'Create Account'
            : 'Sign In'}
        </Button>
      </form>
      <div className="mt-4 space-y-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGuestSignIn}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Continue as Guest'}
        </Button>
        <button
          type="button"
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full text-sm text-muted-foreground hover:text-foreground"
        >
          {isSignUp
            ? 'Already have an account? Sign in'
            : "Don't have an account? Sign up"}
        </button>
      </div>
    </Card>
  );
} 