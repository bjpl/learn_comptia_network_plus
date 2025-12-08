import bcrypt from 'bcrypt';

/**
 * Production-ready password security utilities using bcrypt
 * with 12 rounds for optimal security-performance balance
 */

// Use 12 rounds for production security (2^12 = 4096 iterations)
// Cost factor of 12 takes ~250ms on modern hardware
const SALT_ROUNDS = 12;

export interface PasswordStrengthResult {
  valid: boolean;
  score: number; // 0-100
  feedback: string[];
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
}

/**
 * Hash a password using bcrypt with 12 rounds
 * @param password - Plain text password to hash
 * @returns Promise resolving to bcrypt hash
 */
export async function hashPassword(password: string): Promise<string> {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a bcrypt hash
 * @param password - Plain text password to verify
 * @param hash - Bcrypt hash to compare against
 * @returns Promise resolving to true if password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string');
  }

  if (!hash || typeof hash !== 'string') {
    throw new Error('Hash must be a non-empty string');
  }

  return bcrypt.compare(password, hash);
}

/**
 * Validate password strength with detailed feedback
 * @param password - Password to validate
 * @returns Detailed strength analysis
 */
export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  // Check minimum length (8+ characters)
  const hasMinLength = password.length >= 8;
  if (!hasMinLength) {
    feedback.push('Password must be at least 8 characters long');
  } else {
    score += 20;
    // Bonus points for longer passwords
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;
  }

  // Check for uppercase letters
  const hasUppercase = /[A-Z]/.test(password);
  if (!hasUppercase) {
    feedback.push('Password must contain at least one uppercase letter');
  } else {
    score += 15;
  }

  // Check for lowercase letters
  const hasLowercase = /[a-z]/.test(password);
  if (!hasLowercase) {
    feedback.push('Password must contain at least one lowercase letter');
  } else {
    score += 15;
  }

  // Check for numbers
  const hasNumber = /\d/.test(password);
  if (!hasNumber) {
    feedback.push('Password must contain at least one number');
  } else {
    score += 15;
  }

  // Check for special characters
  const hasSpecialChar = /[@$!%*?&]/.test(password);
  if (!hasSpecialChar) {
    feedback.push('Password must contain at least one special character (@$!%*?&)');
  } else {
    score += 15;
  }

  // Additional security checks
  const hasMultipleNumbers = (password.match(/\d/g) || []).length >= 2;
  if (hasMultipleNumbers) {
    score += 5;
  }

  const hasMultipleSpecialChars = (password.match(/[@$!%*?&]/g) || []).length >= 2;
  if (hasMultipleSpecialChars) {
    score += 5;
  }

  // Check for common patterns (reduce score)
  const commonPatterns = [
    /password/i,
    /123456/,
    /qwerty/i,
    /admin/i,
    /letmein/i,
    /welcome/i,
    /abc123/i,
  ];

  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      score -= 20;
      feedback.push('Password contains common patterns or dictionary words');
      break;
    }
  }

  // Check for sequential characters (reduce score)
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password) ||
      /(?:012|123|234|345|456|567|678|789)/.test(password)) {
    score -= 10;
    feedback.push('Avoid sequential characters or numbers');
  }

  // Check for repeated characters (reduce score)
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    feedback.push('Avoid repeated characters');
  }

  // Ensure score is within 0-100 range
  score = Math.max(0, Math.min(100, score));

  const requirements = {
    minLength: hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  };

  const valid = Object.values(requirements).every(req => req === true);

  if (valid && feedback.length === 0) {
    if (score >= 90) {
      feedback.push('Excellent password strength!');
    } else if (score >= 70) {
      feedback.push('Good password strength');
    } else {
      feedback.push('Password meets minimum requirements');
    }
  }

  return {
    valid,
    score,
    feedback,
    requirements,
  };
}

/**
 * Generate a secure random password
 * @param length - Password length (minimum 12)
 * @returns Randomly generated password
 */
export function generateSecurePassword(length: number = 16): string {
  if (length < 12) {
    throw new Error('Password length must be at least 12 characters');
  }

  const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowercase = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specialChars = '@$!%*?&';
  const allChars = uppercase + lowercase + numbers + specialChars;

  // Ensure at least one character from each category
  let password = '';
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specialChars[Math.floor(Math.random() * specialChars.length)];

  // Fill remaining length with random characters
  for (let i = password.length; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  // Shuffle the password
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

/**
 * Check if a password hash needs to be upgraded (rehashed)
 * This is useful when you increase SALT_ROUNDS over time
 * @param hash - Bcrypt hash to check
 * @returns True if hash uses fewer than current SALT_ROUNDS
 */
export async function needsRehash(hash: string): Promise<boolean> {
  try {
    // Extract cost factor from hash (format: $2b$10$...)
    const match = hash.match(/^\$2[aby]\$(\d+)\$/);
    if (!match) return true;

    const hashRounds = parseInt(match[1], 10);
    return hashRounds < SALT_ROUNDS;
  } catch {
    return true;
  }
}

export default {
  hashPassword,
  verifyPassword,
  validatePasswordStrength,
  generateSecurePassword,
  needsRehash,
  SALT_ROUNDS,
};
