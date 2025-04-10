export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validatePassword(password: string): ValidationResult {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return {
      valid: false,
      message: `Password must be at least ${minLength} characters long`,
    };
  }

  if (!hasUpperCase) {
    return {
      valid: false,
      message: 'Password must contain at least one uppercase letter',
    };
  }

  if (!hasLowerCase) {
    return {
      valid: false,
      message: 'Password must contain at least one lowercase letter',
    };
  }

  if (!hasNumbers) {
    return {
      valid: false,
      message: 'Password must contain at least one number',
    };
  }

  if (!hasSpecialChar) {
    return {
      valid: false,
      message: 'Password must contain at least one special character',
    };
  }

  return { valid: true };
}

export function validateEmail(email: string): ValidationResult {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      message: 'Please enter a valid email address',
    };
  }
  return { valid: true };
}

export function validateUsername(username: string): ValidationResult {
  const minLength = 3;
  const maxLength = 20;
  const usernameRegex = /^[a-zA-Z0-9_]+$/;

  if (username.length < minLength) {
    return {
      valid: false,
      message: `Username must be at least ${minLength} characters long`,
    };
  }

  if (username.length > maxLength) {
    return {
      valid: false,
      message: `Username must be no more than ${maxLength} characters long`,
    };
  }

  if (!usernameRegex.test(username)) {
    return {
      valid: false,
      message: 'Username can only contain letters, numbers, and underscores',
    };
  }

  return { valid: true };
} 