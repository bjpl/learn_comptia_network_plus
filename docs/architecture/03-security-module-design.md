# Security Module Design

**CompTIA Network+ Learning Platform - Security Implementation Blueprint**

## Executive Summary

This document outlines the complete security architecture for the CompTIA Network+ Learning Platform, including password hashing, email service integration, TOTP 2FA implementation, and security best practices.

**Current State:**

- Basic bcrypt password hashing (10 rounds)
- JWT access + refresh tokens
- Mock email service (development only)
- No 2FA implementation
- Basic CSRF protection

**Target State:**

- Enhanced password security (bcrypt 12 rounds + complexity validation)
- Production email service (SendGrid integration)
- TOTP-based 2FA (RFC 6238 compliant)
- Rate limiting on auth endpoints
- Security headers middleware
- Audit logging
- Session management

---

## 1. Password Security Architecture

### Current Implementation Analysis

**File:** `backend/src/services/auth.service.ts`

**Current Password Hashing:**

```typescript
export class AuthService {
  private static SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
```

**Issues:**

1. **Salt rounds too low:** 10 rounds is minimum, industry standard is 12-14
2. **No password complexity validation:** Weak passwords allowed
3. **No password history:** Users can reuse old passwords
4. **No breach checking:** No integration with HaveIBeenPwned
5. **No adaptive security:** Same policy for all users

---

### Enhanced Password Module Design

**New Structure:**

```
backend/src/security/
├── password/
│   ├── password.service.ts          (200 lines) - Main password service
│   ├── password.validator.ts        (150 lines) - Complexity validation
│   ├── password.policy.ts           (100 lines) - Security policies
│   └── breach-checker.ts            (120 lines) - HaveIBeenPwned integration
├── types/
│   └── password.types.ts            (80 lines)  - Interfaces
└── __tests__/
    └── password.service.test.ts     (250 lines) - Comprehensive tests
```

---

#### 1.1 password.service.ts (200 lines)

**Responsibility:** Password hashing, verification, and management

**Interfaces:**

```typescript
interface PasswordHashOptions {
  saltRounds?: number; // Default: 12
  pepper?: string; // Server-side secret
  maxLength?: number; // Default: 128
}

interface PasswordVerificationResult {
  valid: boolean;
  rehashNeeded: boolean; // If using old salt rounds
  breached: boolean; // If found in breach database
}

interface PasswordStrength {
  score: number; // 0-4 (zxcvbn scale)
  feedback: string[];
  crackTimeSeconds: number;
  crackTimeDisplay: string;
}
```

**Implementation:**

```typescript
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import zxcvbn from 'zxcvbn';
import { PasswordPolicy } from './password.policy';
import { BreachChecker } from './breach-checker';

export class PasswordService {
  private static readonly CURRENT_SALT_ROUNDS = 12;
  private static readonly MIN_SALT_ROUNDS = 10;
  private static readonly PEPPER = process.env.PASSWORD_PEPPER || '';

  /**
   * Hash a password with bcrypt + optional pepper
   */
  static async hashPassword(password: string, options: PasswordHashOptions = {}): Promise<string> {
    const {
      saltRounds = this.CURRENT_SALT_ROUNDS,
      pepper = this.PEPPER,
      maxLength = 128,
    } = options;

    // Validate password length
    if (password.length > maxLength) {
      throw new Error(`Password exceeds maximum length of ${maxLength}`);
    }

    // Apply pepper before hashing (server-side secret)
    const pepperedPassword = this.applyPepper(password, pepper);

    // Hash with bcrypt
    const hash = await bcrypt.hash(pepperedPassword, saltRounds);

    return hash;
  }

  /**
   * Verify password and check if rehash needed
   */
  static async verifyPassword(password: string, hash: string): Promise<PasswordVerificationResult> {
    const pepperedPassword = this.applyPepper(password, this.PEPPER);

    // Verify against stored hash
    const valid = await bcrypt.compare(pepperedPassword, hash);

    // Check if rehash needed (salt rounds increased)
    const rehashNeeded = this.needsRehash(hash);

    // Check if password is in breach database (async, non-blocking)
    const breached = await BreachChecker.isPasswordBreached(password);

    return {
      valid,
      rehashNeeded,
      breached,
    };
  }

  /**
   * Check if hash needs to be updated (salt rounds changed)
   */
  private static needsRehash(hash: string): boolean {
    const saltRounds = bcrypt.getRounds(hash);
    return saltRounds < this.CURRENT_SALT_ROUNDS;
  }

  /**
   * Apply pepper (server-side secret) to password
   */
  private static applyPepper(password: string, pepper: string): string {
    if (!pepper) return password;

    // HMAC-SHA256 with pepper as key
    return crypto.createHmac('sha256', pepper).update(password).digest('hex');
  }

  /**
   * Calculate password strength using zxcvbn
   */
  static calculateStrength(password: string, userInputs: string[] = []): PasswordStrength {
    const result = zxcvbn(password, userInputs);

    return {
      score: result.score,
      feedback: [result.feedback.warning, ...result.feedback.suggestions].filter(Boolean),
      crackTimeSeconds: result.crack_times_seconds.offline_slow_hashing_1e4_per_second,
      crackTimeDisplay: result.crack_times_display.offline_slow_hashing_1e4_per_second,
    };
  }

  /**
   * Generate a random secure password
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    const values = crypto.randomBytes(length);
    const password = Array.from(values)
      .map((v) => charset[v % charset.length])
      .join('');

    return password;
  }
}
```

---

#### 1.2 password.validator.ts (150 lines)

**Responsibility:** Password complexity and policy validation

```typescript
import { PasswordPolicy } from './password.policy';

export interface PasswordValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  strength: number;
}

export class PasswordValidator {
  /**
   * Validate password against security policy
   */
  static validate(
    password: string,
    userInputs: string[] = [],
    policy: PasswordPolicy = PasswordPolicy.DEFAULT
  ): PasswordValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Length check
    if (password.length < policy.minLength) {
      errors.push(`Password must be at least ${policy.minLength} characters`);
    }

    if (password.length > policy.maxLength) {
      errors.push(`Password must not exceed ${policy.maxLength} characters`);
    }

    // Character class requirements
    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (policy.requireDigit && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (policy.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    // Check for common patterns
    if (this.hasCommonPatterns(password)) {
      warnings.push('Password contains common patterns (e.g., "12345", "qwerty")');
    }

    // Check for user input similarity
    const containsUserInput = userInputs.some((input) =>
      password.toLowerCase().includes(input.toLowerCase())
    );

    if (containsUserInput) {
      errors.push('Password must not contain your name, email, or username');
    }

    // Calculate strength
    const strength = PasswordService.calculateStrength(password, userInputs);

    if (strength.score < policy.minStrengthScore) {
      errors.push(`Password is too weak (score: ${strength.score}/${policy.minStrengthScore})`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      strength: strength.score,
    };
  }

  /**
   * Check for common password patterns
   */
  private static hasCommonPatterns(password: string): boolean {
    const commonPatterns = [
      /12345/,
      /qwerty/i,
      /password/i,
      /abc123/i,
      /(.)\1{2,}/, // Repeated characters (e.g., "aaa")
      /^[a-z]+$/, // Only lowercase
      /^[A-Z]+$/, // Only uppercase
      /^\d+$/, // Only digits
    ];

    return commonPatterns.some((pattern) => pattern.test(password));
  }
}
```

---

#### 1.3 password.policy.ts (100 lines)

**Responsibility:** Define password policies

```typescript
export interface PasswordPolicyConfig {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireDigit: boolean;
  requireSpecialChar: boolean;
  minStrengthScore: number; // 0-4 (zxcvbn)
  maxPasswordAge: number; // Days
  preventReuseCount: number; // Prevent reusing last N passwords
  accountLockoutThreshold: number; // Failed attempts before lockout
  accountLockoutDuration: number; // Minutes
}

export class PasswordPolicy {
  /**
   * Default policy for all users
   */
  static readonly DEFAULT: PasswordPolicyConfig = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireDigit: true,
    requireSpecialChar: true,
    minStrengthScore: 2, // Moderate strength
    maxPasswordAge: 90, // 90 days
    preventReuseCount: 5, // Last 5 passwords
    accountLockoutThreshold: 5, // 5 failed attempts
    accountLockoutDuration: 15, // 15 minutes
  };

  /**
   * Strict policy for admin accounts
   */
  static readonly ADMIN: PasswordPolicyConfig = {
    ...PasswordPolicy.DEFAULT,
    minLength: 12,
    minStrengthScore: 3, // Strong
    maxPasswordAge: 60, // 60 days
    preventReuseCount: 10, // Last 10 passwords
    accountLockoutThreshold: 3, // 3 failed attempts
  };

  /**
   * Relaxed policy for demo/testing
   */
  static readonly DEMO: PasswordPolicyConfig = {
    minLength: 6,
    maxLength: 128,
    requireUppercase: false,
    requireLowercase: true,
    requireDigit: true,
    requireSpecialChar: false,
    minStrengthScore: 1,
    maxPasswordAge: 365,
    preventReuseCount: 0,
    accountLockoutThreshold: 10,
    accountLockoutDuration: 5,
  };

  /**
   * Get policy for user role
   */
  static getPolicy(role: string): PasswordPolicyConfig {
    switch (role) {
      case 'admin':
        return PasswordPolicy.ADMIN;
      case 'demo':
        return PasswordPolicy.DEMO;
      default:
        return PasswordPolicy.DEFAULT;
    }
  }
}
```

---

#### 1.4 breach-checker.ts (120 lines)

**Responsibility:** Check passwords against HaveIBeenPwned database

```typescript
import crypto from 'crypto';
import axios from 'axios';

export class BreachChecker {
  private static readonly API_URL = 'https://api.pwnedpasswords.com/range/';
  private static readonly TIMEOUT = 3000; // 3 seconds

  /**
   * Check if password is in breach database (k-Anonymity model)
   * https://haveibeenpwned.com/API/v3#PwnedPasswords
   */
  static async isPasswordBreached(password: string): Promise<boolean> {
    try {
      // SHA-1 hash of password
      const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();

      // First 5 characters (k-Anonymity)
      const prefix = hash.substring(0, 5);
      const suffix = hash.substring(5);

      // Query API with prefix only
      const response = await axios.get(`${this.API_URL}${prefix}`, {
        timeout: this.TIMEOUT,
        headers: {
          'User-Agent': 'CompTIA-Network-Plus-Learning-Platform',
        },
      });

      // Check if full hash is in response
      const hashes = response.data.split('\n');
      const found = hashes.some((line: string) => {
        const [hashSuffix] = line.split(':');
        return hashSuffix === suffix;
      });

      return found;
    } catch (error) {
      // Fail open - don't block legitimate passwords due to API issues
      console.error('Breach check failed:', error);
      return false;
    }
  }

  /**
   * Get breach count for password (for reporting)
   */
  static async getBreachCount(password: string): Promise<number> {
    try {
      const hash = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
      const prefix = hash.substring(0, 5);
      const suffix = hash.substring(5);

      const response = await axios.get(`${this.API_URL}${prefix}`, {
        timeout: this.TIMEOUT,
      });

      const hashes = response.data.split('\n');
      const match = hashes.find((line: string) => {
        const [hashSuffix] = line.split(':');
        return hashSuffix === suffix;
      });

      if (!match) return 0;

      const [, count] = match.split(':');
      return parseInt(count, 10);
    } catch (error) {
      return 0;
    }
  }
}
```

---

## 2. Email Service Architecture

### Current Implementation Analysis

**File:** `backend/src/services/email.service.ts`

**Current Email Service:**

- Mock implementation (logs to console in development)
- No production email sending
- TODOs for SendGrid integration
- Basic email templates (HTML + plain text)

---

### Enhanced Email Module Design

**New Structure:**

```
backend/src/services/email/
├── email.service.ts             (250 lines) - Main email service
├── providers/
│   ├── sendgrid.provider.ts     (180 lines) - SendGrid integration
│   ├── ses.provider.ts          (180 lines) - AWS SES integration
│   └── smtp.provider.ts         (150 lines) - Generic SMTP
├── templates/
│   ├── password-reset.ts        (120 lines) - Password reset email
│   ├── email-verification.ts    (100 lines) - Email verification
│   ├── 2fa-enabled.ts           (80 lines)  - 2FA enabled notification
│   └── account-locked.ts        (80 lines)  - Account lockout notification
├── types/
│   └── email.types.ts           (60 lines)  - Interfaces
└── __tests__/
    └── email.service.test.ts    (200 lines) - Tests
```

---

#### 2.1 email.service.ts (250 lines)

**Responsibility:** Email orchestration and template rendering

```typescript
import { SendGridProvider } from './providers/sendgrid.provider';
import { SESProvider } from './providers/ses.provider';
import { SMTPProvider } from './providers/smtp.provider';
import { renderPasswordResetEmail } from './templates/password-reset';
import { renderEmailVerificationEmail } from './templates/email-verification';

export interface EmailProvider {
  send(options: EmailOptions): Promise<EmailResult>;
  verifyConnection(): Promise<boolean>;
}

export interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
  cc?: string[];
  bcc?: string[];
  replyTo?: string;
}

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
}

export class EmailService {
  private static provider: EmailProvider;
  private static readonly DEFAULT_FROM = process.env.EMAIL_FROM || 'noreply@comptia-network.test';

  /**
   * Initialize email provider based on configuration
   */
  static initialize() {
    const providerType = process.env.EMAIL_PROVIDER || 'mock';

    switch (providerType) {
      case 'sendgrid':
        this.provider = new SendGridProvider();
        break;
      case 'ses':
        this.provider = new SESProvider();
        break;
      case 'smtp':
        this.provider = new SMTPProvider();
        break;
      default:
        // Mock provider for development
        this.provider = {
          send: async (options) => {
            console.log('[MOCK EMAIL]', options);
            return { success: true, provider: 'mock' };
          },
          verifyConnection: async () => true,
        };
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(
    email: string,
    token: string,
    userName?: string
  ): Promise<EmailResult> {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    const { subject, text, html } = renderPasswordResetEmail({
      resetUrl,
      userName,
      expiresInMinutes: 60,
    });

    return this.send({
      to: email,
      subject,
      text,
      html,
    });
  }

  /**
   * Send email verification email
   */
  static async sendEmailVerificationEmail(
    email: string,
    token: string,
    userName?: string
  ): Promise<EmailResult> {
    const verifyUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    const { subject, text, html } = renderEmailVerificationEmail({
      verifyUrl,
      userName,
    });

    return this.send({
      to: email,
      subject,
      text,
      html,
    });
  }

  /**
   * Send 2FA enabled notification
   */
  static async send2FAEnabledEmail(email: string, userName?: string): Promise<EmailResult> {
    const { subject, text, html } = render2FAEnabledEmail({ userName });

    return this.send({
      to: email,
      subject,
      text,
      html,
    });
  }

  /**
   * Send account locked notification
   */
  static async sendAccountLockedEmail(
    email: string,
    userName?: string,
    unlockAt?: Date
  ): Promise<EmailResult> {
    const { subject, text, html } = renderAccountLockedEmail({
      userName,
      unlockAt,
    });

    return this.send({
      to: email,
      subject,
      text,
      html,
    });
  }

  /**
   * Generic email sender
   */
  private static async send(options: EmailOptions): Promise<EmailResult> {
    const emailOptions = {
      ...options,
      from: options.from || this.DEFAULT_FROM,
    };

    try {
      return await this.provider.send(emailOptions);
    } catch (error) {
      console.error('Email send failed:', error);
      return {
        success: false,
        error: error.message,
        provider: 'unknown',
      };
    }
  }
}

// Initialize on import
EmailService.initialize();
```

---

#### 2.2 sendgrid.provider.ts (180 lines)

**Responsibility:** SendGrid integration

```typescript
import sgMail from '@sendgrid/mail';
import type { EmailProvider, EmailOptions, EmailResult } from '../email.service';

export class SendGridProvider implements EmailProvider {
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.SENDGRID_API_KEY || '';

    if (!this.apiKey) {
      throw new Error('SENDGRID_API_KEY environment variable is required');
    }

    sgMail.setApiKey(this.apiKey);
  }

  async send(options: EmailOptions): Promise<EmailResult> {
    try {
      const msg = {
        to: options.to,
        from: options.from!,
        subject: options.subject,
        text: options.text,
        html: options.html,
        cc: options.cc,
        bcc: options.bcc,
        replyTo: options.replyTo,
        attachments: options.attachments,
      };

      const [response] = await sgMail.send(msg);

      return {
        success: true,
        messageId: response.headers['x-message-id'],
        provider: 'sendgrid',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        provider: 'sendgrid',
      };
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      // SendGrid doesn't have a ping endpoint, so we just verify API key format
      return this.apiKey.startsWith('SG.') && this.apiKey.length > 20;
    } catch {
      return false;
    }
  }
}
```

---

## 3. TOTP 2FA Architecture

### Design Overview

**TOTP (Time-based One-Time Password)** - RFC 6238 compliant

**Features:**

- QR code generation for easy setup
- Backup codes for account recovery
- Remember device option (30 days)
- SMS fallback (optional)
- Enforcement for admin accounts

---

### Module Structure

```
backend/src/security/2fa/
├── totp.service.ts              (250 lines) - TOTP generation/verification
├── backup-codes.service.ts      (150 lines) - Backup code management
├── device-trust.service.ts      (120 lines) - Trusted device management
├── types/
│   └── 2fa.types.ts             (70 lines)  - Interfaces
└── __tests__/
    ├── totp.service.test.ts     (200 lines)
    └── backup-codes.test.ts     (150 lines)
```

---

#### 3.1 totp.service.ts (250 lines)

**Responsibility:** TOTP generation and verification

```typescript
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import crypto from 'crypto';

export interface TOTPSecret {
  secret: string; // Base32 encoded secret
  qrCodeDataURL: string; // QR code data URL for display
  backupCodes: string[]; // One-time backup codes
}

export interface TOTPVerificationResult {
  valid: boolean;
  usedBackupCode: boolean;
  remainingBackupCodes: number;
}

export class TOTPService {
  private static readonly APP_NAME = 'CompTIA Network+';
  private static readonly WINDOW = 1; // Allow 1 step before/after (30 seconds each)

  /**
   * Generate TOTP secret and QR code for user setup
   */
  static async generateSecret(
    userEmail: string,
    issuer: string = this.APP_NAME
  ): Promise<TOTPSecret> {
    // Generate secret
    const secret = speakeasy.generateSecret({
      name: `${issuer} (${userEmail})`,
      issuer,
      length: 32,
    });

    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(secret.otpauth_url!);

    // Generate backup codes
    const backupCodes = this.generateBackupCodes(8);

    return {
      secret: secret.base32,
      qrCodeDataURL,
      backupCodes,
    };
  }

  /**
   * Verify TOTP token
   */
  static verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: this.WINDOW,
    });
  }

  /**
   * Generate backup codes
   */
  static generateBackupCodes(count: number = 8): string[] {
    const codes: string[] = [];

    for (let i = 0; i < count; i++) {
      const code = crypto.randomBytes(4).toString('hex').toUpperCase();
      codes.push(code);
    }

    return codes;
  }

  /**
   * Hash backup code for storage
   */
  static hashBackupCode(code: string): string {
    return crypto.createHash('sha256').update(code).digest('hex');
  }

  /**
   * Verify backup code
   */
  static verifyBackupCode(code: string, hashedCode: string): boolean {
    const inputHash = this.hashBackupCode(code);
    return inputHash === hashedCode;
  }
}
```

---

#### 3.2 Database Schema Updates

**New Tables:**

```sql
-- TOTP secrets table
CREATE TABLE user_totp (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  secret TEXT NOT NULL,
  enabled BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Backup codes table
CREATE TABLE user_backup_codes (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(code_hash)
);

-- Trusted devices table
CREATE TABLE trusted_devices (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  device_name TEXT,
  last_used_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, device_id)
);

-- Indexes
CREATE INDEX idx_user_totp_user_id ON user_totp(user_id);
CREATE INDEX idx_backup_codes_user_id ON user_backup_codes(user_id);
CREATE INDEX idx_backup_codes_used ON user_backup_codes(user_id, used);
CREATE INDEX idx_trusted_devices_user_id ON trusted_devices(user_id);
CREATE INDEX idx_trusted_devices_expires ON trusted_devices(expires_at);
```

---

#### 3.3 API Endpoints

**2FA Management Routes:**

```typescript
// POST /api/auth/2fa/setup
// Generate TOTP secret and QR code
router.post('/2fa/setup', authenticate, async (req, res) => {
  const userId = req.user.id;
  const userEmail = req.user.email;

  // Generate secret
  const { secret, qrCodeDataURL, backupCodes } = await TOTPService.generateSecret(userEmail);

  // Save to database (disabled until verified)
  await db.query(
    'INSERT INTO user_totp (user_id, secret, enabled) VALUES ($1, $2, $3) ON CONFLICT (user_id) DO UPDATE SET secret = $2',
    [userId, secret, false]
  );

  // Save backup codes
  for (const code of backupCodes) {
    const hashedCode = TOTPService.hashBackupCode(code);
    await db.query('INSERT INTO user_backup_codes (user_id, code_hash) VALUES ($1, $2)', [
      userId,
      hashedCode,
    ]);
  }

  res.json({
    qrCode: qrCodeDataURL,
    backupCodes,
    secret, // Show once for manual entry
  });
});

// POST /api/auth/2fa/verify
// Verify TOTP token and enable 2FA
router.post('/2fa/verify', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { token } = req.body;

  // Get user's TOTP secret
  const result = await db.query('SELECT secret FROM user_totp WHERE user_id = $1', [userId]);

  if (result.rows.length === 0) {
    return res.status(400).json({ error: 'TOTP not set up' });
  }

  const { secret } = result.rows[0];

  // Verify token
  const valid = TOTPService.verifyToken(secret, token);

  if (!valid) {
    return res.status(400).json({ error: 'Invalid token' });
  }

  // Enable 2FA
  await db.query('UPDATE user_totp SET enabled = TRUE, verified_at = NOW() WHERE user_id = $1', [
    userId,
  ]);

  // Send notification email
  await EmailService.send2FAEnabledEmail(req.user.email, req.user.name);

  res.json({ success: true, message: '2FA enabled successfully' });
});

// POST /api/auth/2fa/disable
// Disable 2FA (requires password confirmation)
router.post('/2fa/disable', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { password } = req.body;

  // Verify password
  const user = await UserModel.findById(userId);
  const passwordValid = await PasswordService.verifyPassword(password, user.password_hash);

  if (!passwordValid.valid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  // Disable 2FA
  await db.query('DELETE FROM user_totp WHERE user_id = $1', [userId]);
  await db.query('DELETE FROM user_backup_codes WHERE user_id = $1', [userId]);
  await db.query('DELETE FROM trusted_devices WHERE user_id = $1', [userId]);

  res.json({ success: true, message: '2FA disabled successfully' });
});

// POST /api/auth/login (with 2FA)
router.post('/login', async (req, res) => {
  const { email, password, token, rememberDevice } = req.body;

  // Verify credentials
  const user = await UserModel.findByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const passwordValid = await PasswordService.verifyPassword(password, user.password_hash);
  if (!passwordValid.valid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check if 2FA enabled
  const totp = await db.query('SELECT secret, enabled FROM user_totp WHERE user_id = $1', [
    user.id,
  ]);

  if (totp.rows.length > 0 && totp.rows[0].enabled) {
    // 2FA required
    if (!token) {
      return res.status(200).json({ requires2FA: true });
    }

    // Verify TOTP token
    const valid = TOTPService.verifyToken(totp.rows[0].secret, token);

    if (!valid) {
      // Try backup codes
      const backupValid = await verifyBackupCode(user.id, token);
      if (!backupValid) {
        return res.status(401).json({ error: 'Invalid 2FA token' });
      }
    }
  }

  // Generate tokens
  const accessToken = AuthService.generateAccessToken(user);
  const refreshToken = AuthService.generateRefreshToken(user);

  // Remember device if requested
  if (rememberDevice) {
    const deviceId = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

    await db.query(
      'INSERT INTO trusted_devices (user_id, device_id, device_name, expires_at) VALUES ($1, $2, $3, $4)',
      [user.id, deviceId, req.headers['user-agent'], expiresAt]
    );

    res.cookie('device_id', deviceId, {
      httpOnly: true,
      secure: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  res.json({
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
  });
});
```

---

## 4. Security Best Practices Implementation

### 4.1 Rate Limiting

**File:** `backend/src/middleware/rate-limit.middleware.ts` (enhanced)

```typescript
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

// Strict rate limiting for authentication endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many authentication attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  // Use Redis for distributed systems
  store: process.env.REDIS_URL
    ? new RedisStore({
        client: createClient({ url: process.env.REDIS_URL }),
        prefix: 'rate_limit:auth:',
      })
    : undefined,
});

// Moderate rate limiting for general API
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests. Please try again later.',
});

// Strict for password reset
export const passwordResetRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 attempts
  message: 'Too many password reset requests. Please try again later.',
});
```

---

### 4.2 Security Headers

**File:** `backend/src/middleware/security-headers.middleware.ts`

```typescript
import helmet from 'helmet';
import { Express } from 'express';

export function configureSecurityHeaders(app: Express) {
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'https:'],
          connectSrc: ["'self'"],
          fontSrc: ["'self'"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
        },
      },
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true,
      },
      referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
      noSniff: true,
      xssFilter: true,
      hidePoweredBy: true,
    })
  );
}
```

---

### 4.3 Audit Logging

**File:** `backend/src/utils/audit-logger.ts`

```typescript
import { logger } from '../config/logger';

export interface AuditLog {
  userId?: number;
  action: string;
  resource: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  timestamp: Date;
}

export class AuditLogger {
  static log(entry: AuditLog) {
    const logEntry = {
      ...entry,
      timestamp: entry.timestamp || new Date(),
      level: entry.success ? 'info' : 'warn',
    };

    logger.log(logEntry.level, 'Audit Log', logEntry);

    // Also save to database for compliance
    this.saveToDatabase(logEntry);
  }

  private static async saveToDatabase(entry: AuditLog) {
    // Implementation for database logging
    // Required for compliance and forensics
  }

  // Convenience methods
  static logLogin(userId: number, success: boolean, ip: string) {
    this.log({
      userId,
      action: 'login',
      resource: 'authentication',
      success,
      ipAddress: ip,
    });
  }

  static log2FASetup(userId: number, success: boolean) {
    this.log({
      userId,
      action: 'enable_2fa',
      resource: 'security',
      success,
    });
  }

  static logPasswordChange(userId: number, success: boolean) {
    this.log({
      userId,
      action: 'change_password',
      resource: 'security',
      success,
    });
  }
}
```

---

## 5. Testing Strategy

### Unit Tests

**Password Service Tests:**

```typescript
describe('PasswordService', () => {
  test('should hash password with bcrypt', async () => {
    const password = 'SecurePassword123!';
    const hash = await PasswordService.hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.startsWith('$2b$')).toBe(true);
  });

  test('should verify correct password', async () => {
    const password = 'SecurePassword123!';
    const hash = await PasswordService.hashPassword(password);
    const result = await PasswordService.verifyPassword(password, hash);

    expect(result.valid).toBe(true);
    expect(result.rehashNeeded).toBe(false);
  });

  test('should detect breached password', async () => {
    const password = 'password123'; // Known breached password
    const result = await PasswordService.verifyPassword(password, 'dummy_hash');

    expect(result.breached).toBe(true);
  });

  test('should calculate password strength', () => {
    const weak = PasswordService.calculateStrength('password');
    const strong = PasswordService.calculateStrength('Tr0ub4dor&3');

    expect(weak.score).toBeLessThan(strong.score);
    expect(strong.score).toBeGreaterThanOrEqual(3);
  });
});
```

**TOTP Tests:**

```typescript
describe('TOTPService', () => {
  test('should generate valid TOTP secret', async () => {
    const result = await TOTPService.generateSecret('test@example.com');

    expect(result.secret).toBeDefined();
    expect(result.qrCodeDataURL).toContain('data:image/png');
    expect(result.backupCodes).toHaveLength(8);
  });

  test('should verify valid TOTP token', () => {
    const secret = speakeasy.generateSecret().base32;
    const token = speakeasy.totp({ secret, encoding: 'base32' });

    const valid = TOTPService.verifyToken(secret, token);
    expect(valid).toBe(true);
  });

  test('should reject invalid TOTP token', () => {
    const secret = speakeasy.generateSecret().base32;
    const valid = TOTPService.verifyToken(secret, '000000');

    expect(valid).toBe(false);
  });
});
```

---

### Integration Tests

**2FA Flow Test:**

```typescript
describe('2FA Integration', () => {
  test('complete 2FA setup and login flow', async () => {
    // 1. Setup 2FA
    const setupResponse = await request(app)
      .post('/api/auth/2fa/setup')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(setupResponse.body.qrCode).toBeDefined();
    const secret = setupResponse.body.secret;

    // 2. Verify with TOTP token
    const token = speakeasy.totp({ secret, encoding: 'base32' });
    await request(app)
      .post('/api/auth/2fa/verify')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ token })
      .expect(200);

    // 3. Login requires 2FA
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password' })
      .expect(200);

    expect(loginResponse.body.requires2FA).toBe(true);

    // 4. Login with 2FA token
    const token2 = speakeasy.totp({ secret, encoding: 'base32' });
    const loginWith2FA = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password',
        token: token2,
      })
      .expect(200);

    expect(loginWith2FA.body.accessToken).toBeDefined();
  });
});
```

---

## 6. Deployment Checklist

### Environment Variables

```bash
# Password Security
PASSWORD_PEPPER=<random_64_char_string>

# Email Service (choose one)
EMAIL_PROVIDER=sendgrid
SENDGRID_API_KEY=<sendgrid_api_key>
EMAIL_FROM=noreply@your-domain.com

# or

EMAIL_PROVIDER=ses
AWS_ACCESS_KEY_ID=<aws_access_key>
AWS_SECRET_ACCESS_KEY=<aws_secret>
AWS_REGION=us-east-1

# Frontend URL
FRONTEND_URL=https://your-domain.com

# Redis (optional, for distributed rate limiting)
REDIS_URL=redis://localhost:6379
```

---

### Production Security Checklist

- [ ] Change `PASSWORD_PEPPER` to strong random value
- [ ] Increase bcrypt salt rounds to 12+
- [ ] Configure production email provider
- [ ] Enable HTTPS/TLS
- [ ] Configure security headers
- [ ] Enable rate limiting with Redis
- [ ] Set up audit logging
- [ ] Configure database backups
- [ ] Implement session cleanup cron job
- [ ] Test password breach checking
- [ ] Verify 2FA QR codes work with authenticator apps
- [ ] Test backup codes
- [ ] Configure monitoring and alerts
- [ ] Document password policy
- [ ] Create incident response plan

---

_Document Version: 1.0_
_Last Updated: 2025-12-04_
_Author: System Architecture Team_
