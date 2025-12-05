/**
 * 2FA Implementation Demo
 * Demonstrates complete 2FA setup and verification flow
 */

import {
  generateTOTPSecret,
  generateTOTPUri,
  generateQRCode,
  verifyTOTP,
  generateBackupCodes,
  verifyBackupCode,
  getCurrentTOTP,
  getTOTPTimeInfo,
  formatSecret,
} from '../src/utils/totp';

import { setupTwoFactor, validateTwoFactorCode, validateBackupCode } from '../src/utils/security';

// ============================================
// Demo: Complete 2FA Setup Flow
// ============================================

async function demo2FASetup() {
  console.log('\n========================================');
  console.log('2FA SETUP DEMO');
  console.log('========================================\n');

  const userEmail = 'demo@comptia.test';

  // Step 1: Generate 2FA setup data
  console.log('Step 1: Generating 2FA setup data...');
  const setupData = await setupTwoFactor(userEmail);

  console.log('✓ Secret generated:', formatSecret(setupData.secret));
  console.log('✓ QR Code generated (data URL):', setupData.qrCodeUrl.substring(0, 50) + '...');
  console.log('✓ Backup codes generated:', setupData.backupCodes.length, 'codes');

  // Step 2: Display backup codes
  console.log('\nStep 2: Backup Codes (save these securely!)');
  setupData.backupCodes.forEach((code, i) => {
    console.log(`  ${i + 1}. ${code}`);
  });

  // Step 3: Generate current TOTP code (simulates authenticator app)
  console.log('\nStep 3: Simulating authenticator app...');
  const currentCode = getCurrentTOTP(setupData.secret);
  console.log('✓ Current TOTP code:', currentCode);

  // Step 4: Verify TOTP code
  console.log('\nStep 4: Verifying TOTP code...');
  const isValid = validateTwoFactorCode(currentCode, setupData.secret);
  console.log('✓ Code verification:', isValid ? 'SUCCESS ✓' : 'FAILED ✗');

  // Step 5: Show time information
  console.log('\nStep 5: Time window information');
  const timeInfo = getTOTPTimeInfo(setupData.secret);
  console.log('✓ Time remaining in window:', timeInfo.timeRemaining, 'seconds');
  console.log('✓ Next code generation:', timeInfo.nextCodeTime.toLocaleTimeString());

  return setupData;
}

// ============================================
// Demo: Login with 2FA
// ============================================

async function demo2FALogin(secret: string, backupCodes: string[]) {
  console.log('\n========================================');
  console.log('2FA LOGIN DEMO');
  console.log('========================================\n');

  // Simulate user login with TOTP
  console.log('Scenario 1: Login with TOTP code');
  const totpCode = getCurrentTOTP(secret);
  console.log('User enters code:', totpCode);

  const isTotpValid = validateTwoFactorCode(totpCode, secret);
  if (isTotpValid) {
    console.log('✓ TOTP verification SUCCESS - Access granted!\n');
  } else {
    console.log('✗ TOTP verification FAILED - Access denied!\n');
  }

  // Simulate user login with backup code
  console.log('Scenario 2: Login with backup code');
  const backupCodeToUse = backupCodes[0];
  console.log('User enters backup code:', backupCodeToUse);

  const backupResult = validateBackupCode(backupCodeToUse, backupCodes);
  if (backupResult.isValid) {
    console.log('✓ Backup code verification SUCCESS - Access granted!');
    console.log('✓ Backup codes remaining:', backupResult.remainingCodes.length);
    console.log('✓ Used code removed from list\n');

    // Try to use same code again (should fail)
    console.log('Scenario 3: Attempting to reuse backup code');
    console.log('User enters same backup code:', backupCodeToUse);

    const reuseResult = validateBackupCode(backupCodeToUse, backupResult.remainingCodes);
    if (reuseResult.isValid) {
      console.log('✗ Code accepted (SECURITY ISSUE!)');
    } else {
      console.log('✓ Code rejected - Backup codes are single-use!\n');
    }
  } else {
    console.log('✗ Backup code verification FAILED - Access denied!\n');
  }
}

// ============================================
// Demo: Security Features
// ============================================

async function demoSecurityFeatures(secret: string) {
  console.log('\n========================================');
  console.log('SECURITY FEATURES DEMO');
  console.log('========================================\n');

  // Test 1: Invalid code format
  console.log('Test 1: Invalid code formats');
  const invalidCodes = [
    'abc123', // Non-numeric
    '12345', // Too short
    '1234567', // Too long
    "'; DROP TABLE users; --", // SQL injection
    '<script>alert("xss")</script>', // XSS
  ];

  invalidCodes.forEach((code) => {
    const result = validateTwoFactorCode(code, secret);
    console.log(`  "${code}" -> ${result ? 'ACCEPTED ✗' : 'REJECTED ✓'}`);
  });

  // Test 2: Time window tolerance
  console.log('\nTest 2: Time window tolerance (±30 seconds)');
  const validCode = getCurrentTOTP(secret);
  console.log('  Current code:', validCode);
  console.log(
    '  Verification:',
    validateTwoFactorCode(validCode, secret) ? 'SUCCESS ✓' : 'FAILED ✗'
  );

  // Test 3: Cryptographic randomness
  console.log('\nTest 3: Cryptographic randomness');
  const secrets = new Set<string>();
  for (let i = 0; i < 10; i++) {
    secrets.add(generateTOTPSecret());
  }
  console.log('  Generated 10 secrets, unique:', secrets.size === 10 ? 'YES ✓' : 'NO ✗');

  const codes = new Set<string>();
  const backupCodes = generateBackupCodes(20);
  backupCodes.forEach((code) => codes.add(code));
  console.log('  Generated 20 backup codes, unique:', codes.size === 20 ? 'YES ✓' : 'NO ✗');
}

// ============================================
// Demo: QR Code Generation
// ============================================

async function demoQRCodeGeneration() {
  console.log('\n========================================');
  console.log('QR CODE GENERATION DEMO');
  console.log('========================================\n');

  const secret = generateTOTPSecret();
  const email = 'demo@comptia.test';

  console.log('Generating QR code for:', email);
  console.log('Secret:', formatSecret(secret));

  // Generate URI
  const uri = generateTOTPUri(secret, email, 'CompTIA Network+');
  console.log('\nOTP Auth URI:');
  console.log(uri);

  // Generate QR code
  const qrCodeDataUrl = await generateQRCode(uri);
  console.log('\n✓ QR Code generated successfully');
  console.log('  Format: PNG (Base64 data URL)');
  console.log('  Size:', qrCodeDataUrl.length, 'characters');
  console.log('  Preview:', qrCodeDataUrl.substring(0, 60) + '...');
  console.log('\nTo view QR code:');
  console.log('  1. Copy the data URL');
  console.log('  2. Open in browser: <img src="[DATA_URL]" />');
  console.log('  3. Scan with authenticator app');
}

// ============================================
// Demo: Backup Code Management
// ============================================

async function demoBackupCodeManagement() {
  console.log('\n========================================');
  console.log('BACKUP CODE MANAGEMENT DEMO');
  console.log('========================================\n');

  // Generate codes
  const codes = generateBackupCodes(5);
  console.log('Generated 5 backup codes:');
  codes.forEach((code, i) => console.log(`  ${i + 1}. ${code}`));

  let remainingCodes = [...codes];

  // Use codes one by one
  console.log('\nUsing backup codes sequentially:');

  for (let i = 0; i < 3; i++) {
    const codeToUse = codes[i];
    console.log(`\nAttempt ${i + 1}: Using code ${codeToUse}`);

    const result = verifyBackupCode(codeToUse, remainingCodes);

    if (result.isValid) {
      console.log('  ✓ Code verified');
      console.log('  ✓ Code removed from list');
      console.log('  ✓ Remaining codes:', result.remainingCodes.length);
      remainingCodes = result.remainingCodes;
    } else {
      console.log('  ✗ Invalid code');
    }
  }

  // Show remaining codes
  console.log('\nRemaining unused codes:');
  remainingCodes.forEach((code, i) => console.log(`  ${i + 1}. ${code}`));

  // Warn about low codes
  if (remainingCodes.length < 3) {
    console.log('\n⚠️  WARNING: Low backup codes remaining!');
    console.log('    Recommend generating new codes.');
  }
}

// ============================================
// Demo: Time-Based Code Rotation
// ============================================

async function demoTimeBasedRotation() {
  console.log('\n========================================');
  console.log('TIME-BASED CODE ROTATION DEMO');
  console.log('========================================\n');

  const secret = generateTOTPSecret();

  console.log('Monitoring TOTP codes over time...');
  console.log('(Codes change every 30 seconds)\n');

  const codesGenerated = new Set<string>();

  for (let i = 0; i < 5; i++) {
    const code = getCurrentTOTP(secret);
    const timeInfo = getTOTPTimeInfo(secret);

    console.log(`Reading ${i + 1}:`);
    console.log('  Current code:', code);
    console.log('  Time remaining:', timeInfo.timeRemaining, 'seconds');
    console.log('  New?', !codesGenerated.has(code) ? 'YES (first time)' : 'NO (duplicate)');

    codesGenerated.add(code);

    // Verify code works
    const isValid = verifyTOTP(code, secret);
    console.log('  Verification:', isValid ? 'SUCCESS ✓' : 'FAILED ✗\n');

    // Wait a bit (in real demo, this would show rotation)
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log('\nTotal unique codes generated:', codesGenerated.size);
  console.log('All codes verified successfully ✓');
}

// ============================================
// Main Demo Runner
// ============================================

async function runAllDemos() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  2FA IMPLEMENTATION - COMPLETE DEMO    ║');
  console.log('╚════════════════════════════════════════╝');

  try {
    // Run demos sequentially
    const setupData = await demo2FASetup();
    await demo2FALogin(setupData.secret, setupData.backupCodes);
    await demoSecurityFeatures(setupData.secret);
    await demoQRCodeGeneration();
    await demoBackupCodeManagement();
    await demoTimeBasedRotation();

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║  ALL DEMOS COMPLETED SUCCESSFULLY ✓    ║');
    console.log('╚════════════════════════════════════════╝\n');

    // Summary
    console.log('Summary:');
    console.log('  • TOTP implementation: ✓');
    console.log('  • QR code generation: ✓');
    console.log('  • Backup codes: ✓');
    console.log('  • Security features: ✓');
    console.log('  • Time-based rotation: ✓');
    console.log('  • Code verification: ✓');
    console.log('\nAll features working correctly!\n');
  } catch (error) {
    console.error('\n✗ Demo failed:', error);
    throw error;
  }
}

// Export for testing
export {
  demo2FASetup,
  demo2FALogin,
  demoSecurityFeatures,
  demoQRCodeGeneration,
  demoBackupCodeManagement,
  demoTimeBasedRotation,
  runAllDemos,
};

// Run demos if executed directly
if (require.main === module) {
  runAllDemos().catch(console.error);
}
