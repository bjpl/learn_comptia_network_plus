/**
 * Email Service
 * Handles all email-related functionality including password resets
 */

import { logger } from '../config/logger';
import { sanitizeEmail } from '../utils/sanitizer';

export interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
}

export class EmailService {
  /**
   * Send password reset email
   * @param email User's email address
   * @param token Password reset token
   * @returns Promise with success status
   */
  static async sendPasswordResetEmail(
    email: string,
    token: string
  ): Promise<{ success: boolean; mock?: boolean }> {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    // In development, just log the reset URL
    if (process.env.NODE_ENV === 'development') {
      logger.info('Password Reset Email', {
        email: sanitizeEmail(email),
        resetUrl,
        message: 'This is a mock email. In production, this would be sent via email service.',
      });
      console.log('\n==============================================');
      console.log('PASSWORD RESET EMAIL (DEVELOPMENT MODE)');
      console.log('==============================================');
      console.log(`To: ${sanitizeEmail(email)}`);
      console.log(`Subject: Reset Your Password`);
      console.log(`\nReset URL: ${resetUrl}`);
      console.log('==============================================\n');

      return { success: true, mock: true };
    }

    // TODO: Implement real email sending in production
    // Example integrations:
    // - SendGrid
    // - AWS SES
    // - Mailgun
    // - Postmark

    const emailContent = {
      to: email,
      subject: 'Reset Your Password',
      text: `
Hello,

You requested to reset your password. Please click the link below to reset your password:

${resetUrl}

This link will expire in 1 hour.

If you did not request this, please ignore this email.

Best regards,
CompTIA Network+ Learning Platform
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .button { display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Reset Your Password</h2>
    <p>Hello,</p>
    <p>You requested to reset your password. Click the button below to reset your password:</p>
    <p style="margin: 30px 0;">
      <a href="${resetUrl}" class="button">Reset Password</a>
    </p>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #007bff;">${resetUrl}</p>
    <p><strong>This link will expire in 1 hour.</strong></p>
    <p>If you did not request this, please ignore this email.</p>
    <div class="footer">
      <p>Best regards,<br>CompTIA Network+ Learning Platform</p>
    </div>
  </div>
</body>
</html>
      `,
    };

    try {
      // TODO: Replace with actual email service implementation
      logger.info('Email would be sent in production', emailContent);

      // Example SendGrid implementation:
      // const sgMail = require('@sendgrid/mail');
      // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      // await sgMail.send(emailContent);

      return { success: true };
    } catch (error) {
      logger.error('Error sending password reset email:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  /**
   * Send email verification email
   * @param email User's email address
   * @param token Verification token
   */
  static async sendVerificationEmail(
    email: string,
    token: string
  ): Promise<{ success: boolean; mock?: boolean }> {
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

    if (process.env.NODE_ENV === 'development') {
      logger.info('Verification Email', { email: sanitizeEmail(email), verifyUrl });
      console.log('\n==============================================');
      console.log('EMAIL VERIFICATION (DEVELOPMENT MODE)');
      console.log('==============================================');
      console.log(`To: ${sanitizeEmail(email)}`);
      console.log(`Verification URL: ${verifyUrl}`);
      console.log('==============================================\n');

      return { success: true, mock: true };
    }

    // TODO: Implement real email sending
    return { success: true };
  }

  /**
   * Send generic email
   * @param options Email options
   */
  static async sendEmail(options: EmailOptions): Promise<{ success: boolean }> {
    if (process.env.NODE_ENV === 'development') {
      logger.info('Email (Development)', options);
      return { success: true };
    }

    // TODO: Implement real email sending
    return { success: true };
  }
}

export default EmailService;
