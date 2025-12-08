/**
 * Email Service
 * Production-ready email service using nodemailer with SMTP
 * Handles password resets, email verification, and 2FA notifications
 */

import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { logger } from '../config/logger';
import { sanitizeEmail } from '../utils/sanitizer';

/**
 * Email Configuration Interface
 */
export interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

/**
 * Email Options Interface
 */
export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

/**
 * Email Send Result Interface
 */
export interface EmailResult {
  success: boolean;
  mock?: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Email Service Class
 * Handles all email-related functionality including password resets,
 * email verification, and 2FA notifications
 */
export class EmailService {
  private transporter: Transporter;
  private readonly fromAddress: string;
  private readonly isDevelopment: boolean;

  /**
   * Initialize Email Service
   * @param config Optional custom email configuration
   */
  constructor(config?: EmailConfig) {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.fromAddress = process.env.EMAIL_FROM || 'noreply@comptia-network.com';

    // Create transporter with provided config or environment variables
    this.transporter = nodemailer.createTransport(
      config || {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: process.env.SMTP_SECURE === 'true' || false,
        auth: {
          user: process.env.SMTP_USER || '',
          pass: process.env.SMTP_PASS || '',
        },
      }
    );
  }

  /**
   * Send password reset email
   * @param email User's email address
   * @param token Password reset token
   * @returns Promise with email send result
   */
  async sendPasswordReset(email: string, token: string): Promise<EmailResult> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;
    const sanitizedEmail = sanitizeEmail(email);

    // In development mode, log to console instead of sending
    if (this.isDevelopment) {
      logger.info('Password Reset Email (Mock)', { email: sanitizedEmail, resetUrl });
      console.log('\n==============================================');
      console.log('PASSWORD RESET EMAIL (DEVELOPMENT MODE)');
      console.log('==============================================');
      console.log(`To: ${sanitizedEmail}`);
      console.log(`Subject: Reset Your Password`);
      console.log(`\nReset URL: ${resetUrl}`);
      console.log(`\nThis link will expire in 1 hour.`);
      console.log('==============================================\n');

      return { success: true, mock: true };
    }

    const emailOptions: EmailOptions = {
      to: email,
      subject: 'Reset Your Password - CompTIA Network+ Platform',
      text: this.getPasswordResetTextTemplate(resetUrl),
      html: this.getPasswordResetHtmlTemplate(resetUrl),
    };

    return this.sendEmail(emailOptions);
  }

  /**
   * Send email verification email
   * @param email User's email address
   * @param token Email verification token
   * @returns Promise with email send result
   */
  async sendVerificationEmail(email: string, token: string): Promise<EmailResult> {
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
    const sanitizedEmail = sanitizeEmail(email);

    // In development mode, log to console instead of sending
    if (this.isDevelopment) {
      logger.info('Email Verification (Mock)', { email: sanitizedEmail, verifyUrl });
      console.log('\n==============================================');
      console.log('EMAIL VERIFICATION (DEVELOPMENT MODE)');
      console.log('==============================================');
      console.log(`To: ${sanitizedEmail}`);
      console.log(`Subject: Verify Your Email Address`);
      console.log(`\nVerification URL: ${verifyUrl}`);
      console.log(`\nThis link will expire in 24 hours.`);
      console.log('==============================================\n');

      return { success: true, mock: true };
    }

    const emailOptions: EmailOptions = {
      to: email,
      subject: 'Verify Your Email Address - CompTIA Network+ Platform',
      text: this.getVerificationTextTemplate(verifyUrl),
      html: this.getVerificationHtmlTemplate(verifyUrl),
    };

    return this.sendEmail(emailOptions);
  }

  /**
   * Send 2FA enabled notification email
   * @param email User's email address
   * @returns Promise with email send result
   */
  async send2FAEnabledNotification(email: string): Promise<EmailResult> {
    const sanitizedEmail = sanitizeEmail(email);

    // In development mode, log to console instead of sending
    if (this.isDevelopment) {
      logger.info('2FA Enabled Notification (Mock)', { email: sanitizedEmail });
      console.log('\n==============================================');
      console.log('2FA ENABLED NOTIFICATION (DEVELOPMENT MODE)');
      console.log('==============================================');
      console.log(`To: ${sanitizedEmail}`);
      console.log(`Subject: Two-Factor Authentication Enabled`);
      console.log(`\nYour account security has been enhanced with 2FA.`);
      console.log('==============================================\n');

      return { success: true, mock: true };
    }

    const emailOptions: EmailOptions = {
      to: email,
      subject: 'Two-Factor Authentication Enabled - CompTIA Network+ Platform',
      text: this.get2FAEnabledTextTemplate(),
      html: this.get2FAEnabledHtmlTemplate(),
    };

    return this.sendEmail(emailOptions);
  }

  /**
   * Send generic email
   * @param options Email options (to, subject, text, html)
   * @returns Promise with email send result
   */
  private async sendEmail(options: EmailOptions): Promise<EmailResult> {
    try {
      // Validate email configuration
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        logger.warn('SMTP credentials not configured, email not sent');
        return {
          success: false,
          error: 'SMTP credentials not configured',
        };
      }

      // Send email
      const info = await this.transporter.sendMail({
        from: this.fromAddress,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
      });

      logger.info('Email sent successfully', {
        messageId: info.messageId,
        to: sanitizeEmail(options.to),
        subject: options.subject,
      });

      return {
        success: true,
        messageId: info.messageId,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      logger.error('Failed to send email', {
        error: errorMessage,
        to: sanitizeEmail(options.to),
        subject: options.subject,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Verify email configuration
   * @returns Promise with verification result
   */
  async verifyConnection(): Promise<boolean> {
    try {
      await this.transporter.verify();
      logger.info('Email service connection verified successfully');
      return true;
    } catch (error) {
      logger.error('Email service connection verification failed', { error });
      return false;
    }
  }

  // ===================================================================
  // EMAIL TEMPLATES - PASSWORD RESET
  // ===================================================================

  /**
   * Get password reset plain text template
   */
  private getPasswordResetTextTemplate(resetUrl: string): string {
    return `
Hello,

You requested to reset your password for your CompTIA Network+ Learning Platform account.

Click the link below to reset your password:
${resetUrl}

This link will expire in 1 hour for security reasons.

If you did not request this password reset, please ignore this email. Your password will remain unchanged.

For security:
- Never share your password with anyone
- Use a strong, unique password
- Enable two-factor authentication for added security

If you have any questions or concerns, please contact our support team.

Best regards,
CompTIA Network+ Learning Platform Team
    `.trim();
  }

  /**
   * Get password reset HTML template
   */
  private getPasswordResetHtmlTemplate(resetUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #007bff;
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 40px;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #007bff;
      color: white !important;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      margin: 20px 0;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #0056b3;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .url-fallback {
      word-break: break-all;
      color: #007bff;
      font-size: 14px;
      background-color: #f8f9fa;
      padding: 10px;
      border-radius: 4px;
      margin: 15px 0;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 12px 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .security-tips {
      background-color: #e7f3ff;
      border-left: 4px solid #007bff;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .security-tips h3 {
      margin-top: 0;
      color: #007bff;
      font-size: 16px;
    }
    .security-tips ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 13px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Reset Your Password</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p>You requested to reset your password for your CompTIA Network+ Learning Platform account.</p>

      <div class="button-container">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>

      <p>Or copy and paste this link into your browser:</p>
      <div class="url-fallback">${resetUrl}</div>

      <div class="warning">
        <strong>⏱️ This link will expire in 1 hour</strong> for security reasons.
      </div>

      <p>If you did not request this password reset, please ignore this email. Your password will remain unchanged.</p>

      <div class="security-tips">
        <h3>🛡️ Security Tips:</h3>
        <ul>
          <li>Never share your password with anyone</li>
          <li>Use a strong, unique password</li>
          <li>Enable two-factor authentication for added security</li>
        </ul>
      </div>

      <div class="footer">
        <p>Best regards,<br><strong>CompTIA Network+ Learning Platform Team</strong></p>
        <p style="margin-top: 15px; font-size: 12px;">
          If you have any questions, please contact our support team.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  // ===================================================================
  // EMAIL TEMPLATES - EMAIL VERIFICATION
  // ===================================================================

  /**
   * Get email verification plain text template
   */
  private getVerificationTextTemplate(verifyUrl: string): string {
    return `
Hello,

Welcome to the CompTIA Network+ Learning Platform!

To complete your registration and activate your account, please verify your email address by clicking the link below:
${verifyUrl}

This link will expire in 24 hours.

If you did not create an account, please ignore this email.

After verification, you'll have access to:
- Comprehensive Network+ study materials
- Interactive practice exams
- Progress tracking and analytics
- Community support and resources

Best regards,
CompTIA Network+ Learning Platform Team
    `.trim();
  }

  /**
   * Get email verification HTML template
   */
  private getVerificationHtmlTemplate(verifyUrl: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #28a745;
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 40px;
    }
    .button {
      display: inline-block;
      padding: 14px 28px;
      background-color: #28a745;
      color: white !important;
      text-decoration: none;
      border-radius: 5px;
      font-weight: 600;
      margin: 20px 0;
      transition: background-color 0.3s;
    }
    .button:hover {
      background-color: #218838;
    }
    .button-container {
      text-align: center;
      margin: 30px 0;
    }
    .url-fallback {
      word-break: break-all;
      color: #28a745;
      font-size: 14px;
      background-color: #f8f9fa;
      padding: 10px;
      border-radius: 4px;
      margin: 15px 0;
    }
    .features {
      background-color: #f8f9fa;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .features h3 {
      margin-top: 0;
      color: #28a745;
      font-size: 16px;
    }
    .features ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .features li {
      margin: 8px 0;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 13px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✉️ Verify Your Email</h1>
    </div>
    <div class="content">
      <p>Hello,</p>
      <p><strong>Welcome to the CompTIA Network+ Learning Platform!</strong></p>
      <p>To complete your registration and activate your account, please verify your email address:</p>

      <div class="button-container">
        <a href="${verifyUrl}" class="button">Verify Email Address</a>
      </div>

      <p>Or copy and paste this link into your browser:</p>
      <div class="url-fallback">${verifyUrl}</div>

      <p style="color: #666; font-size: 14px;">
        <strong>Note:</strong> This link will expire in 24 hours.
      </p>

      <div class="features">
        <h3>🚀 What You'll Get Access To:</h3>
        <ul>
          <li>📚 Comprehensive Network+ study materials</li>
          <li>✅ Interactive practice exams and quizzes</li>
          <li>📊 Progress tracking and performance analytics</li>
          <li>👥 Community support and resources</li>
        </ul>
      </div>

      <p>If you did not create an account, please ignore this email.</p>

      <div class="footer">
        <p>Best regards,<br><strong>CompTIA Network+ Learning Platform Team</strong></p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  // ===================================================================
  // EMAIL TEMPLATES - 2FA ENABLED NOTIFICATION
  // ===================================================================

  /**
   * Get 2FA enabled notification plain text template
   */
  private get2FAEnabledTextTemplate(): string {
    return `
Hello,

This email confirms that Two-Factor Authentication (2FA) has been successfully enabled on your CompTIA Network+ Learning Platform account.

Your account is now more secure! Each time you sign in, you'll need to:
1. Enter your password
2. Enter a verification code from your authenticator app

What this means for you:
- Enhanced security for your account
- Protection against unauthorized access
- Peace of mind knowing your data is secure

If you did not enable 2FA on your account, please contact our support team immediately as your account may be compromised.

To disable 2FA, log into your account and visit the Security Settings page.

Best regards,
CompTIA Network+ Learning Platform Team
    `.trim();
  }

  /**
   * Get 2FA enabled notification HTML template
   */
  private get2FAEnabledHtmlTemplate(): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Two-Factor Authentication Enabled</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #17a2b8;
      color: white;
      padding: 30px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px 40px;
    }
    .success-badge {
      background-color: #d4edda;
      border: 1px solid #c3e6cb;
      color: #155724;
      padding: 15px;
      border-radius: 5px;
      margin: 20px 0;
      text-align: center;
      font-weight: 600;
    }
    .info-box {
      background-color: #e7f3ff;
      border-left: 4px solid #17a2b8;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .info-box h3 {
      margin-top: 0;
      color: #17a2b8;
      font-size: 16px;
    }
    .info-box ol, .info-box ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .info-box li {
      margin: 8px 0;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .footer {
      margin-top: 30px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 13px;
      color: #666;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Two-Factor Authentication Enabled</h1>
    </div>
    <div class="content">
      <p>Hello,</p>

      <div class="success-badge">
        ✅ 2FA Successfully Enabled!
      </div>

      <p>This email confirms that <strong>Two-Factor Authentication (2FA)</strong> has been successfully enabled on your CompTIA Network+ Learning Platform account.</p>

      <div class="info-box">
        <h3>🛡️ Your Account Is Now More Secure!</h3>
        <p>Each time you sign in, you'll need to:</p>
        <ol>
          <li>Enter your password</li>
          <li>Enter a verification code from your authenticator app</li>
        </ol>
      </div>

      <div class="info-box">
        <h3>✨ Benefits:</h3>
        <ul>
          <li>Enhanced security for your account</li>
          <li>Protection against unauthorized access</li>
          <li>Peace of mind knowing your data is secure</li>
        </ul>
      </div>

      <div class="warning">
        <strong>⚠️ Important:</strong> If you did not enable 2FA on your account, please contact our support team immediately as your account may be compromised.
      </div>

      <p style="font-size: 14px; color: #666;">
        To disable 2FA, log into your account and visit the Security Settings page.
      </p>

      <div class="footer">
        <p>Best regards,<br><strong>CompTIA Network+ Learning Platform Team</strong></p>
      </div>
    </div>
  </div>
</body>
</html>
    `.trim();
  }
}

/**
 * Static methods for backward compatibility
 * These maintain the existing API while using the new implementation
 */
export class EmailServiceStatic {
  private static instance: EmailService | null = null;

  private static getInstance(): EmailService {
    if (!this.instance) {
      this.instance = new EmailService();
    }
    return this.instance;
  }

  static async sendPasswordResetEmail(
    email: string,
    token: string
  ): Promise<EmailResult> {
    return this.getInstance().sendPasswordReset(email, token);
  }

  static async sendVerificationEmail(
    email: string,
    token: string
  ): Promise<EmailResult> {
    return this.getInstance().sendVerificationEmail(email, token);
  }

  static async send2FAEnabledNotification(email: string): Promise<EmailResult> {
    return this.getInstance().send2FAEnabledNotification(email);
  }
}

// Default export for backward compatibility
export default EmailServiceStatic;
