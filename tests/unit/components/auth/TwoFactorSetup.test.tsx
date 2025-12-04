/**
 * TwoFactorSetup Component Tests
 * Tests multi-step 2FA setup flow, QR code display, backup codes, and verification
 */

import { describe, it, expect, beforeEach, vi, type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TwoFactorSetup } from '../../../../src/components/auth/TwoFactorSetup';
import { setupTwoFactor, validateTwoFactorCode } from '../../../../src/utils/security';

// Mock the security utilities
vi.mock('../../../../src/utils/security', () => ({
  setupTwoFactor: vi.fn(),
  validateTwoFactorCode: vi.fn(),
}));

const mockedSetupTwoFactor = setupTwoFactor as Mock;
const mockedValidateTwoFactorCode = validateTwoFactorCode as Mock;

// Mock clipboard API
const mockClipboardWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockClipboardWriteText,
  },
});

// Mock URL.createObjectURL and URL.revokeObjectURL
const mockCreateObjectURL = vi.fn(() => 'blob:test-url');
const mockRevokeObjectURL = vi.fn();
URL.createObjectURL = mockCreateObjectURL;
URL.revokeObjectURL = mockRevokeObjectURL;

// ============================================
// Mock Data
// ============================================

const mockSetupData = {
  secret: 'ABCDEFGHIJKLMNOP',
  qrCodeUrl: 'data:image/png;base64,mockQRCode',
  backupCodes: [
    'ABC123',
    'DEF456',
    'GHI789',
    'JKL012',
    'MNO345',
    'PQR678',
    'STU901',
    'VWX234',
  ],
};

// ============================================
// Test Setup
// ============================================

const defaultProps = {
  userEmail: 'test@example.com',
  isEnabled: false,
  onClose: vi.fn(),
  onComplete: vi.fn(),
};

const setupMocks = () => {
  mockedSetupTwoFactor.mockReturnValue(mockSetupData);
  mockedValidateTwoFactorCode.mockReturnValue(false);
  mockClipboardWriteText.mockResolvedValue(undefined);
};

const renderTwoFactorSetup = (props = {}) => {
  return render(<TwoFactorSetup {...defaultProps} {...props} />);
};

// ============================================
// Tests
// ============================================

describe('TwoFactorSetup Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupMocks();
    localStorage.clear();
  });

  describe('Initial Rendering - Setup Flow', () => {
    it('should render modal with close button', () => {
      renderTwoFactorSetup();

      expect(screen.getByRole('button', { name: /close modal/i })).toBeInTheDocument();
    });

    it('should call setupTwoFactor on mount when not enabled', () => {
      renderTwoFactorSetup();

      expect(mockedSetupTwoFactor).toHaveBeenCalledWith('test@example.com');
    });

    it('should start on QR code step when 2FA not enabled', () => {
      renderTwoFactorSetup();

      expect(screen.getByRole('heading', { name: /scan qr code/i })).toBeInTheDocument();
    });

    it('should show step indicator on QR code step', () => {
      const { container } = renderTwoFactorSetup();

      const steps = container.querySelectorAll('.step');
      expect(steps).toHaveLength(4);
      expect(steps[0]).toHaveClass('active');
    });
  });

  describe('QR Code Step', () => {
    it('should display QR code image', () => {
      renderTwoFactorSetup();

      const qrImage = screen.getByAltText('2FA QR Code');
      expect(qrImage).toBeInTheDocument();
      expect(qrImage).toHaveAttribute('src', mockSetupData.qrCodeUrl);
    });

    it('should display secret key', () => {
      renderTwoFactorSetup();

      expect(screen.getByText(mockSetupData.secret)).toBeInTheDocument();
    });

    it('should have copy key button', () => {
      renderTwoFactorSetup();

      expect(screen.getByRole('button', { name: /copy key/i })).toBeInTheDocument();
    });

    it('should copy secret to clipboard when clicking copy', async () => {
      renderTwoFactorSetup();

      const copyButton = screen.getByRole('button', { name: /copy key/i });
      await userEvent.click(copyButton);

      expect(mockClipboardWriteText).toHaveBeenCalledWith(mockSetupData.secret);
    });

    it('should have cancel and next buttons', () => {
      renderTwoFactorSetup();

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should call onClose when clicking cancel', async () => {
      const onClose = vi.fn();
      renderTwoFactorSetup({ onClose });

      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onClose).toHaveBeenCalled();
    });

    it('should navigate to backup codes step when clicking next', async () => {
      renderTwoFactorSetup();

      await userEvent.click(screen.getByRole('button', { name: /next/i }));

      expect(screen.getByRole('heading', { name: /save backup codes/i })).toBeInTheDocument();
    });
  });

  describe('Backup Codes Step', () => {
    const navigateToBackupCodes = async () => {
      renderTwoFactorSetup();
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
    };

    it('should display all backup codes', async () => {
      await navigateToBackupCodes();

      for (const code of mockSetupData.backupCodes) {
        expect(screen.getByText(code)).toBeInTheDocument();
      }
    });

    it('should show warning about storing codes safely', async () => {
      await navigateToBackupCodes();

      expect(screen.getByText(/store these backup codes in a safe place/i)).toBeInTheDocument();
    });

    it('should have copy all button', async () => {
      await navigateToBackupCodes();

      expect(screen.getByRole('button', { name: /copy all/i })).toBeInTheDocument();
    });

    it('should copy all codes to clipboard when clicking copy all', async () => {
      await navigateToBackupCodes();

      await userEvent.click(screen.getByRole('button', { name: /copy all/i }));

      expect(mockClipboardWriteText).toHaveBeenCalledWith(mockSetupData.backupCodes.join('\n'));
    });

    it('should show "Copied!" after copying', async () => {
      await navigateToBackupCodes();

      await userEvent.click(screen.getByRole('button', { name: /copy all/i }));

      expect(screen.getByRole('button', { name: /copied!/i })).toBeInTheDocument();
    });

    it('should have download button', async () => {
      await navigateToBackupCodes();

      expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
    });

    it('should trigger download when clicking download', async () => {
      const mockClick = vi.fn();
      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        const element = originalCreateElement(tagName);
        if (tagName === 'a') {
          element.click = mockClick;
        }
        return element;
      });

      await navigateToBackupCodes();

      await userEvent.click(screen.getByRole('button', { name: /download/i }));

      expect(mockCreateObjectURL).toHaveBeenCalled();
      expect(mockClick).toHaveBeenCalled();
      expect(mockRevokeObjectURL).toHaveBeenCalled();

      vi.restoreAllMocks();
    });

    it('should have back and next buttons', async () => {
      await navigateToBackupCodes();

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
    });

    it('should navigate back to QR code step when clicking back', async () => {
      await navigateToBackupCodes();

      await userEvent.click(screen.getByRole('button', { name: /back/i }));

      expect(screen.getByRole('heading', { name: /scan qr code/i })).toBeInTheDocument();
    });

    it('should navigate to verify step when clicking next', async () => {
      await navigateToBackupCodes();

      await userEvent.click(screen.getByRole('button', { name: /next/i }));

      expect(screen.getByRole('heading', { name: /verify setup/i })).toBeInTheDocument();
    });

    it('should update step indicator', async () => {
      const { container } = renderTwoFactorSetup();
      await userEvent.click(screen.getByRole('button', { name: /next/i }));

      const steps = container.querySelectorAll('.step');
      expect(steps[0]).toHaveClass('completed');
      expect(steps[1]).toHaveClass('active');
    });
  });

  describe('Verify Step', () => {
    const navigateToVerify = async () => {
      renderTwoFactorSetup();
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
    };

    it('should show verification input', async () => {
      await navigateToVerify();

      expect(screen.getByLabelText(/verification code/i)).toBeInTheDocument();
    });

    it('should have input with correct attributes', async () => {
      await navigateToVerify();

      const input = screen.getByLabelText(/verification code/i);
      expect(input).toHaveAttribute('inputMode', 'numeric');
      expect(input).toHaveAttribute('maxLength', '6');
      expect(input).toHaveAttribute('placeholder', '000000');
    });

    it('should only allow numeric input', async () => {
      await navigateToVerify();

      const input = screen.getByLabelText(/verification code/i);
      await userEvent.type(input, 'abc123def456');

      expect(input).toHaveValue('123456');
    });

    it('should have verify button disabled when code is incomplete', async () => {
      await navigateToVerify();

      const input = screen.getByLabelText(/verification code/i);
      await userEvent.type(input, '123');

      expect(screen.getByRole('button', { name: /verify/i })).toBeDisabled();
    });

    it('should enable verify button when 6 digits entered', async () => {
      await navigateToVerify();

      const input = screen.getByLabelText(/verification code/i);
      await userEvent.type(input, '123456');

      expect(screen.getByRole('button', { name: /verify/i })).not.toBeDisabled();
    });

    it('should show error for invalid code', async () => {
      mockedValidateTwoFactorCode.mockReturnValue(false);
      await navigateToVerify();

      const input = screen.getByLabelText(/verification code/i);
      await userEvent.type(input, '123456');
      await userEvent.click(screen.getByRole('button', { name: /verify/i }));

      expect(screen.getByText(/invalid verification code/i)).toBeInTheDocument();
    });

    it('should add error class to input on error', async () => {
      mockedValidateTwoFactorCode.mockReturnValue(false);
      await navigateToVerify();

      const input = screen.getByLabelText(/verification code/i);
      await userEvent.type(input, '123456');
      await userEvent.click(screen.getByRole('button', { name: /verify/i }));

      expect(input).toHaveClass('error');
    });

    it('should set aria-invalid on input when error', async () => {
      mockedValidateTwoFactorCode.mockReturnValue(false);
      await navigateToVerify();

      const input = screen.getByLabelText(/verification code/i);
      await userEvent.type(input, '123456');
      await userEvent.click(screen.getByRole('button', { name: /verify/i }));

      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('should clear error when typing', async () => {
      mockedValidateTwoFactorCode.mockReturnValue(false);
      await navigateToVerify();

      const input = screen.getByLabelText(/verification code/i);
      await userEvent.type(input, '123456');
      await userEvent.click(screen.getByRole('button', { name: /verify/i }));

      expect(screen.getByText(/invalid verification code/i)).toBeInTheDocument();

      await userEvent.clear(input);
      await userEvent.type(input, '1');

      expect(screen.queryByText(/invalid verification code/i)).not.toBeInTheDocument();
    });

    it('should navigate to success step on valid code', async () => {
      mockedValidateTwoFactorCode.mockReturnValue(true);
      await navigateToVerify();

      const input = screen.getByLabelText(/verification code/i);
      await userEvent.type(input, '123456');
      await userEvent.click(screen.getByRole('button', { name: /verify/i }));

      expect(screen.getByRole('heading', { name: /two-factor authentication enabled/i })).toBeInTheDocument();
    });

    it('should store 2FA status in localStorage on success', async () => {
      mockedValidateTwoFactorCode.mockReturnValue(true);
      await navigateToVerify();

      const input = screen.getByLabelText(/verification code/i);
      await userEvent.type(input, '123456');
      await userEvent.click(screen.getByRole('button', { name: /verify/i }));

      const storedStatus = JSON.parse(localStorage.getItem('twoFactorStatus') || '{}');
      expect(storedStatus.enabled).toBe(true);
      expect(storedStatus.backupCodesRemaining).toBe(mockSetupData.backupCodes.length);
    });

    it('should have back button', async () => {
      await navigateToVerify();

      expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();
    });

    it('should navigate back to backup codes when clicking back', async () => {
      await navigateToVerify();

      await userEvent.click(screen.getByRole('button', { name: /back/i }));

      expect(screen.getByRole('heading', { name: /save backup codes/i })).toBeInTheDocument();
    });
  });

  describe('Success Step', () => {
    const navigateToSuccess = async () => {
      mockedValidateTwoFactorCode.mockReturnValue(true);
      renderTwoFactorSetup();
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
      const input = screen.getByLabelText(/verification code/i);
      await userEvent.type(input, '123456');
      await userEvent.click(screen.getByRole('button', { name: /verify/i }));
    };

    it('should show success message', async () => {
      await navigateToSuccess();

      expect(screen.getByRole('heading', { name: /two-factor authentication enabled/i })).toBeInTheDocument();
    });

    it('should show success icon', async () => {
      await navigateToSuccess();

      expect(screen.getByText('✓')).toBeInTheDocument();
    });

    it('should show all steps as completed', async () => {
      const { container } = renderTwoFactorSetup();
      mockedValidateTwoFactorCode.mockReturnValue(true);
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
      const input = screen.getByLabelText(/verification code/i);
      await userEvent.type(input, '123456');
      await userEvent.click(screen.getByRole('button', { name: /verify/i }));

      const steps = container.querySelectorAll('.step');
      steps.forEach((step) => {
        expect(step).toHaveClass('completed');
      });
    });

    it('should have done button', async () => {
      await navigateToSuccess();

      expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
    });

    it('should call onComplete with true when clicking done', async () => {
      const onComplete = vi.fn();
      mockedValidateTwoFactorCode.mockReturnValue(true);
      render(<TwoFactorSetup {...defaultProps} onComplete={onComplete} />);
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
      const input = screen.getByLabelText(/verification code/i);
      await userEvent.type(input, '123456');
      await userEvent.click(screen.getByRole('button', { name: /verify/i }));

      await userEvent.click(screen.getByRole('button', { name: /done/i }));

      expect(onComplete).toHaveBeenCalledWith(true);
    });
  });

  describe('Disable Step', () => {
    it('should start on disable step when 2FA is enabled', () => {
      renderTwoFactorSetup({ isEnabled: true });

      expect(screen.getByRole('heading', { name: /disable two-factor authentication/i })).toBeInTheDocument();
    });

    it('should not call setupTwoFactor when already enabled', () => {
      renderTwoFactorSetup({ isEnabled: true });

      expect(mockedSetupTwoFactor).not.toHaveBeenCalled();
    });

    it('should show warning about reduced security', () => {
      renderTwoFactorSetup({ isEnabled: true });

      expect(screen.getByText(/make your account less secure/i)).toBeInTheDocument();
    });

    it('should have cancel and disable buttons', () => {
      renderTwoFactorSetup({ isEnabled: true });

      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /disable 2fa/i })).toBeInTheDocument();
    });

    it('should call onClose when clicking cancel', async () => {
      const onClose = vi.fn();
      renderTwoFactorSetup({ isEnabled: true, onClose });

      await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

      expect(onClose).toHaveBeenCalled();
    });

    it('should remove localStorage status and call onComplete when disabling', async () => {
      localStorage.setItem('twoFactorStatus', JSON.stringify({ enabled: true }));
      const onComplete = vi.fn();
      renderTwoFactorSetup({ isEnabled: true, onComplete });

      await userEvent.click(screen.getByRole('button', { name: /disable 2fa/i }));

      expect(localStorage.getItem('twoFactorStatus')).toBeNull();
      expect(onComplete).toHaveBeenCalledWith(false);
    });
  });

  describe('Modal Behavior', () => {
    it('should call onClose when clicking overlay', () => {
      const onClose = vi.fn();
      const { container } = renderTwoFactorSetup({ onClose });

      const overlay = container.querySelector('.modal-overlay');
      fireEvent.click(overlay!);

      expect(onClose).toHaveBeenCalled();
    });

    it('should not call onClose when clicking modal content', () => {
      const onClose = vi.fn();
      const { container } = renderTwoFactorSetup({ onClose });

      const modalContent = container.querySelector('.modal-content');
      fireEvent.click(modalContent!);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('should call onClose when clicking close button', async () => {
      const onClose = vi.fn();
      renderTwoFactorSetup({ onClose });

      await userEvent.click(screen.getByRole('button', { name: /close modal/i }));

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('CSS Classes', () => {
    it('should have twofa-modal class on content', () => {
      const { container } = renderTwoFactorSetup();
      expect(container.querySelector('.twofa-modal')).toBeInTheDocument();
    });

    it('should have twofa-step class on step content', () => {
      const { container } = renderTwoFactorSetup();
      expect(container.querySelector('.twofa-step')).toBeInTheDocument();
    });

    it('should have step-indicator class', () => {
      const { container } = renderTwoFactorSetup();
      expect(container.querySelector('.step-indicator')).toBeInTheDocument();
    });

    it('should have qr-code-container class', () => {
      const { container } = renderTwoFactorSetup();
      expect(container.querySelector('.qr-code-container')).toBeInTheDocument();
    });

    it('should have secret-key class', () => {
      const { container } = renderTwoFactorSetup();
      expect(container.querySelector('.secret-key')).toBeInTheDocument();
    });

    it('should have backup-codes class on backup step', async () => {
      const { container } = renderTwoFactorSetup();
      await userEvent.click(screen.getByRole('button', { name: /next/i }));

      expect(container.querySelector('.backup-codes')).toBeInTheDocument();
    });

    it('should have verification-input class on verify step', async () => {
      const { container } = renderTwoFactorSetup();
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
      await userEvent.click(screen.getByRole('button', { name: /next/i }));

      expect(container.querySelector('.verification-input')).toBeInTheDocument();
    });

    it('should have success-icon class on success step', async () => {
      mockedValidateTwoFactorCode.mockReturnValue(true);
      const { container } = renderTwoFactorSetup();
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
      await userEvent.click(screen.getByRole('button', { name: /next/i }));
      const input = screen.getByLabelText(/verification code/i);
      await userEvent.type(input, '123456');
      await userEvent.click(screen.getByRole('button', { name: /verify/i }));

      expect(container.querySelector('.success-icon')).toBeInTheDocument();
    });
  });
});
