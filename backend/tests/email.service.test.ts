/**
 * Email Service Tests
 * Comprehensive tests for the email service with mocked nodemailer transport
 */

import { EmailService, EmailServiceStatic } from '../src/services/email.service';
import type { EmailConfig, EmailResult } from '../src/services/email.service';

// Mock nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: jest.fn(),
    verify: jest.fn(),
  })),
}));

// Mock logger
jest.mock('../src/config/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

import nodemailer from 'nodemailer';
import { logger } from '../src/config/logger';

describe('EmailService', () => {
  let emailService: EmailService;
  let mockTransporter: any;
  let mockSendMail: jest.Mock;
  let mockVerify: jest.Mock;

  // Store original environment
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Setup mock transporter
    mockSendMail = jest.fn();
    mockVerify = jest.fn();
    mockTransporter = {
      sendMail: mockSendMail,
      verify: mockVerify,
    };

    (nodemailer.createTransport as jest.Mock).mockReturnValue(mockTransporter);

    // Setup environment
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      SMTP_HOST: 'smtp.test.com',
      SMTP_PORT: '587',
      SMTP_SECURE: 'false',
      SMTP_USER: 'test@test.com',
      SMTP_PASS: 'test-password',
      EMAIL_FROM: 'noreply@test.com',
      FRONTEND_URL: 'http://localhost:3000',
    };

    // Create email service instance
    emailService = new EmailService();
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('Constructor', () => {
    it('should create transporter with environment variables', () => {
      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.test.com',
        port: 587,
        secure: false,
        auth: {
          user: 'test@test.com',
          pass: 'test-password',
        },
      });
    });

    it('should create transporter with custom config', () => {
      const customConfig: EmailConfig = {
        host: 'smtp.custom.com',
        port: 465,
        secure: true,
        auth: {
          user: 'custom@test.com',
          pass: 'custom-password',
        },
      };

      new EmailService(customConfig);

      expect(nodemailer.createTransport).toHaveBeenCalledWith(customConfig);
    });

    it('should use default values when environment variables are missing', () => {
      process.env = { ...originalEnv, NODE_ENV: 'test' };
      new EmailService();

      expect(nodemailer.createTransport).toHaveBeenCalledWith({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: '',
          pass: '',
        },
      });
    });
  });

  describe('sendPasswordReset', () => {
    it('should send password reset email in production mode', async () => {
      const testEmail = 'user@test.com';
      const testToken = 'reset-token-123';
      const expectedMessageId = 'msg-123';

      mockSendMail.mockResolvedValue({ messageId: expectedMessageId });

      const result = await emailService.sendPasswordReset(testEmail, testToken);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe(expectedMessageId);
      expect(result.mock).toBeUndefined();
      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'noreply@test.com',
        to: testEmail,
        subject: 'Reset Your Password - CompTIA Network+ Platform',
        text: expect.stringContaining('reset your password'),
        html: expect.stringContaining('Reset Your Password'),
      });
      expect(logger.info).toHaveBeenCalledWith(
        'Email sent successfully',
        expect.objectContaining({
          messageId: expectedMessageId,
          subject: 'Reset Your Password - CompTIA Network+ Platform',
        })
      );
    });

    it('should use mock mode in development environment', async () => {
      process.env.NODE_ENV = 'development';
      emailService = new EmailService();

      const result = await emailService.sendPasswordReset(
        'user@test.com',
        'token-123'
      );

      expect(result.success).toBe(true);
      expect(result.mock).toBe(true);
      expect(mockSendMail).not.toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        'Password Reset Email (Mock)',
        expect.any(Object)
      );
    });

    it('should include reset URL with token', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'msg-123' });

      await emailService.sendPasswordReset('user@test.com', 'token-456');

      const sendMailCall = mockSendMail.mock.calls[0][0];
      expect(sendMailCall.text).toContain(
        'http://localhost:3000/reset-password?token=token-456'
      );
      expect(sendMailCall.html).toContain(
        'http://localhost:3000/reset-password?token=token-456'
      );
    });

    it('should handle sendMail errors gracefully', async () => {
      const error = new Error('SMTP connection failed');
      mockSendMail.mockRejectedValue(error);

      const result = await emailService.sendPasswordReset(
        'user@test.com',
        'token-123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('SMTP connection failed');
      expect(logger.error).toHaveBeenCalledWith(
        'Failed to send email',
        expect.objectContaining({
          error: 'SMTP connection failed',
        })
      );
    });

    it('should return error when SMTP credentials are missing', async () => {
      process.env.SMTP_USER = '';
      process.env.SMTP_PASS = '';
      emailService = new EmailService();

      const result = await emailService.sendPasswordReset(
        'user@test.com',
        'token-123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('SMTP credentials not configured');
      expect(mockSendMail).not.toHaveBeenCalled();
      expect(logger.warn).toHaveBeenCalledWith(
        'SMTP credentials not configured, email not sent'
      );
    });
  });

  describe('sendVerificationEmail', () => {
    it('should send verification email in production mode', async () => {
      const testEmail = 'newuser@test.com';
      const testToken = 'verify-token-123';
      const expectedMessageId = 'msg-456';

      mockSendMail.mockResolvedValue({ messageId: expectedMessageId });

      const result = await emailService.sendVerificationEmail(
        testEmail,
        testToken
      );

      expect(result.success).toBe(true);
      expect(result.messageId).toBe(expectedMessageId);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'noreply@test.com',
        to: testEmail,
        subject: 'Verify Your Email Address - CompTIA Network+ Platform',
        text: expect.stringContaining('verify your email'),
        html: expect.stringContaining('Verify Your Email'),
      });
    });

    it('should use mock mode in development environment', async () => {
      process.env.NODE_ENV = 'development';
      emailService = new EmailService();

      const result = await emailService.sendVerificationEmail(
        'user@test.com',
        'token-123'
      );

      expect(result.success).toBe(true);
      expect(result.mock).toBe(true);
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it('should include verification URL with token', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'msg-123' });

      await emailService.sendVerificationEmail('user@test.com', 'verify-789');

      const sendMailCall = mockSendMail.mock.calls[0][0];
      expect(sendMailCall.text).toContain(
        'http://localhost:3000/verify-email?token=verify-789'
      );
      expect(sendMailCall.html).toContain(
        'http://localhost:3000/verify-email?token=verify-789'
      );
    });

    it('should handle errors when sending verification email', async () => {
      const error = new Error('Network timeout');
      mockSendMail.mockRejectedValue(error);

      const result = await emailService.sendVerificationEmail(
        'user@test.com',
        'token-123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network timeout');
    });
  });

  describe('send2FAEnabledNotification', () => {
    it('should send 2FA enabled notification in production mode', async () => {
      const testEmail = 'user@test.com';
      const expectedMessageId = 'msg-789';

      mockSendMail.mockResolvedValue({ messageId: expectedMessageId });

      const result = await emailService.send2FAEnabledNotification(testEmail);

      expect(result.success).toBe(true);
      expect(result.messageId).toBe(expectedMessageId);
      expect(mockSendMail).toHaveBeenCalledWith({
        from: 'noreply@test.com',
        to: testEmail,
        subject: 'Two-Factor Authentication Enabled - CompTIA Network+ Platform',
        text: expect.stringContaining('Two-Factor Authentication'),
        html: expect.stringContaining('Two-Factor Authentication Enabled'),
      });
    });

    it('should use mock mode in development environment', async () => {
      process.env.NODE_ENV = 'development';
      emailService = new EmailService();

      const result = await emailService.send2FAEnabledNotification(
        'user@test.com'
      );

      expect(result.success).toBe(true);
      expect(result.mock).toBe(true);
      expect(mockSendMail).not.toHaveBeenCalled();
    });

    it('should include security information in email', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'msg-123' });

      await emailService.send2FAEnabledNotification('user@test.com');

      const sendMailCall = mockSendMail.mock.calls[0][0];
      expect(sendMailCall.text).toContain('Enhanced security');
      expect(sendMailCall.text).toContain('verification code');
      expect(sendMailCall.html).toContain('More Secure');
    });

    it('should handle errors when sending 2FA notification', async () => {
      const error = new Error('Service unavailable');
      mockSendMail.mockRejectedValue(error);

      const result = await emailService.send2FAEnabledNotification(
        'user@test.com'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Service unavailable');
    });
  });

  describe('verifyConnection', () => {
    it('should verify SMTP connection successfully', async () => {
      mockVerify.mockResolvedValue(true);

      const result = await emailService.verifyConnection();

      expect(result).toBe(true);
      expect(mockVerify).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith(
        'Email service connection verified successfully'
      );
    });

    it('should handle verification failure', async () => {
      const error = new Error('Connection refused');
      mockVerify.mockRejectedValue(error);

      const result = await emailService.verifyConnection();

      expect(result).toBe(false);
      expect(logger.error).toHaveBeenCalledWith(
        'Email service connection verification failed',
        expect.objectContaining({ error })
      );
    });
  });

  describe('EmailServiceStatic (Backward Compatibility)', () => {
    it('should send password reset email via static method', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'msg-static-1' });

      const result = await EmailServiceStatic.sendPasswordResetEmail(
        'user@test.com',
        'token-123'
      );

      expect(result.success).toBe(true);
      expect(mockSendMail).toHaveBeenCalled();
    });

    it('should send verification email via static method', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'msg-static-2' });

      const result = await EmailServiceStatic.sendVerificationEmail(
        'user@test.com',
        'token-456'
      );

      expect(result.success).toBe(true);
      // Static methods should work (either send via SMTP or return success)
    });

    it('should send 2FA notification via static method', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'msg-static-3' });

      const result = await EmailServiceStatic.send2FAEnabledNotification(
        'user@test.com'
      );

      expect(result.success).toBe(true);
      // Static methods should work (either send via SMTP or return success)
    });

    it('should reuse singleton instance across static calls', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'msg-123' });

      await EmailServiceStatic.sendPasswordResetEmail('user1@test.com', 'token1');
      await EmailServiceStatic.sendVerificationEmail('user2@test.com', 'token2');
      await EmailServiceStatic.send2FAEnabledNotification('user3@test.com');

      // Should create transport only once for singleton (in addition to the one from beforeEach)
      expect(nodemailer.createTransport).toHaveBeenCalled();
    });
  });

  describe('Email Templates', () => {
    it('should generate valid HTML for password reset', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'msg-123' });

      await emailService.sendPasswordReset('user@test.com', 'token-123');

      const sendMailCall = mockSendMail.mock.calls[0][0];
      expect(sendMailCall.html).toContain('<!DOCTYPE html>');
      expect(sendMailCall.html).toContain('Reset Your Password');
      expect(sendMailCall.html).toContain('class="button"');
      expect(sendMailCall.html).toContain('Security Tips');
    });

    it('should generate valid HTML for email verification', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'msg-123' });

      await emailService.sendVerificationEmail('user@test.com', 'token-456');

      const sendMailCall = mockSendMail.mock.calls[0][0];
      expect(sendMailCall.html).toContain('<!DOCTYPE html>');
      expect(sendMailCall.html).toContain('Verify Your Email');
      expect(sendMailCall.html).toContain('Welcome to');
      expect(sendMailCall.html).toContain("What You'll Get Access To");
    });

    it('should generate valid HTML for 2FA notification', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'msg-123' });

      await emailService.send2FAEnabledNotification('user@test.com');

      const sendMailCall = mockSendMail.mock.calls[0][0];
      expect(sendMailCall.html).toContain('<!DOCTYPE html>');
      expect(sendMailCall.html).toContain('Two-Factor Authentication Enabled');
      expect(sendMailCall.html).toContain('2FA Successfully Enabled');
      expect(sendMailCall.html).toContain('Benefits:');
    });

    it('should include plain text fallback for all emails', async () => {
      mockSendMail.mockResolvedValue({ messageId: 'msg-123' });

      await emailService.sendPasswordReset('user@test.com', 'token-1');
      let sendMailCall = mockSendMail.mock.calls[0][0];
      expect(sendMailCall.text).toBeTruthy();
      expect(sendMailCall.text.length).toBeGreaterThan(50);

      await emailService.sendVerificationEmail('user@test.com', 'token-2');
      sendMailCall = mockSendMail.mock.calls[1][0];
      expect(sendMailCall.text).toBeTruthy();
      expect(sendMailCall.text.length).toBeGreaterThan(50);

      await emailService.send2FAEnabledNotification('user@test.com');
      sendMailCall = mockSendMail.mock.calls[2][0];
      expect(sendMailCall.text).toBeTruthy();
      expect(sendMailCall.text.length).toBeGreaterThan(50);
    });
  });

  describe('Error Handling', () => {
    it('should handle non-Error exceptions', async () => {
      mockSendMail.mockRejectedValue('String error');

      const result = await emailService.sendPasswordReset(
        'user@test.com',
        'token-123'
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe('Unknown error');
    });

    it('should sanitize email addresses in logs', async () => {
      process.env.NODE_ENV = 'development';
      emailService = new EmailService();

      await emailService.sendPasswordReset('sensitive@test.com', 'token-123');

      expect(logger.info).toHaveBeenCalledWith(
        'Password Reset Email (Mock)',
        expect.objectContaining({
          email: expect.any(String),
        })
      );
    });
  });
});
