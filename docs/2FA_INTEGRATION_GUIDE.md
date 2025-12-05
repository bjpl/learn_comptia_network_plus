# 2FA Integration Guide

## Quick Start

### 1. Import Dependencies

```typescript
import { setupTwoFactor, validateTwoFactorCode } from '@/utils/security';
import { TwoFactorSetup } from '@/components/auth/TwoFactorSetup';
import { TwoFactorVerification } from '@/components/auth/TwoFactorVerification';
```

### 2. Enable 2FA for a User

```typescript
// In user profile settings
const [show2FASetup, setShow2FASetup] = useState(false);

const handleEnable2FA = () => {
  setShow2FASetup(true);
};

return (
  <>
    <button onClick={handleEnable2FA}>
      Enable Two-Factor Authentication
    </button>

    {show2FASetup && (
      <TwoFactorSetup
        userEmail={user.email}
        isEnabled={user.twoFactorEnabled}
        onClose={() => setShow2FASetup(false)}
        onComplete={(enabled) => {
          updateUser({ twoFactorEnabled: enabled });
          setShow2FASetup(false);
        }}
      />
    )}
  </>
);
```

### 3. Verify at Login

```typescript
// In login flow
const [needsTwoFactor, setNeedsTwoFactor] = useState(false);
const [userSecret, setUserSecret] = useState('');
const [backupCodes, setBackupCodes] = useState([]);

const handleLogin = async (email: string, password: string) => {
  const user = await verifyCredentials(email, password);

  if (user.twoFactorEnabled) {
    // User has 2FA enabled
    setUserSecret(user.twoFactorSecret);
    setBackupCodes(user.backupCodes);
    setNeedsTwoFactor(true);
  } else {
    // Direct login
    loginUser(user);
  }
};

const handleTwoFactorVerified = (remainingBackupCodes?: string[]) => {
  if (remainingBackupCodes) {
    // Backup code was used, update stored codes
    updateUserBackupCodes(user.id, remainingBackupCodes);
  }
  loginUser(user);
};

return needsTwoFactor ? (
  <TwoFactorVerification
    secret={userSecret}
    backupCodes={backupCodes}
    onVerified={handleTwoFactorVerified}
    onCancel={() => setNeedsTwoFactor(false)}
    email={user.email}
  />
) : (
  <LoginForm onSubmit={handleLogin} />
);
```

## Component API Reference

### TwoFactorSetup

Multi-step modal for 2FA enrollment.

**Props:**

```typescript
interface TwoFactorSetupProps {
  userEmail: string; // User's email address
  isEnabled: boolean; // Current 2FA status
  onClose: () => void; // Called when modal closes
  onComplete: (enabled: boolean) => void; // Called when setup completes
}
```

**Steps:**

1. **QR Code** - Display QR code and secret for scanning
2. **Backup Codes** - Show backup codes with copy/download
3. **Verification** - Verify TOTP code from authenticator
4. **Success** - Confirmation screen

**Usage:**

```typescript
<TwoFactorSetup
  userEmail="user@example.com"
  isEnabled={false}
  onClose={() => setShowModal(false)}
  onComplete={(enabled) => {
    updateUserSettings({ twoFactorEnabled: enabled });
    setShowModal(false);
  }}
/>
```

### TwoFactorVerification

Login-time 2FA code verification.

**Props:**

```typescript
interface TwoFactorVerificationProps {
  secret: string; // User's TOTP secret
  backupCodes: string[]; // User's backup codes
  onVerified: (remainingBackupCodes?: string[]) => void; // Called on success
  onCancel: () => void; // Called when cancelled
  email: string; // User's email for display
}
```

**Modes:**

- **TOTP Mode** - 6-digit authenticator code
- **Backup Mode** - Single-use backup code

**Usage:**

```typescript
<TwoFactorVerification
  secret={user.twoFactorSecret}
  backupCodes={user.backupCodes}
  onVerified={(remainingCodes) => {
    if (remainingCodes) {
      updateBackupCodes(user.id, remainingCodes);
    }
    loginUser(user);
  }}
  onCancel={() => returnToLogin()}
  email={user.email}
/>
```

## Utility API Reference

### setupTwoFactor(email: string)

Generate complete 2FA setup data.

**Returns:**

```typescript
Promise<{
  secret: string; // Base32-encoded TOTP secret
  qrCodeUrl: string; // Data URL for QR code image
  backupCodes: string[]; // 10 backup codes
}>;
```

**Example:**

```typescript
const setupData = await setupTwoFactor('user@example.com');

// Store secret encrypted
await encryptAndStore(userId, setupData.secret);

// Store backup codes hashed
await hashAndStore(userId, setupData.backupCodes);

// Display to user
showQRCode(setupData.qrCodeUrl);
showBackupCodes(setupData.backupCodes);
```

### validateTwoFactorCode(code: string, secret: string)

Verify a TOTP code.

**Returns:** `boolean`

**Example:**

```typescript
const secret = await getDecryptedSecret(userId);
const isValid = validateTwoFactorCode(userInput, secret);

if (isValid) {
  grantAccess();
} else {
  rejectLogin('Invalid code');
}
```

### validateBackupCode(code: string, storedCodes: string[])

Verify and consume a backup code.

**Returns:**

```typescript
{
  isValid: boolean;
  remainingCodes: string[];  // Codes with used one removed
}
```

**Example:**

```typescript
const backupCodes = await getBackupCodes(userId);
const result = validateBackupCode(userInput, backupCodes);

if (result.isValid) {
  await updateBackupCodes(userId, result.remainingCodes);
  grantAccess();

  if (result.remainingCodes.length < 3) {
    warnLowBackupCodes(result.remainingCodes.length);
  }
}
```

## Database Schema Recommendations

### Users Table

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,

  -- 2FA fields
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  two_factor_secret TEXT,  -- Encrypted TOTP secret
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Backup Codes Table

```sql
CREATE TABLE backup_codes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code_hash VARCHAR(255) NOT NULL,  -- SHA-256 hash
  used BOOLEAN DEFAULT FALSE,
  used_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for fast lookups
CREATE INDEX idx_backup_codes_user ON backup_codes(user_id);
CREATE INDEX idx_backup_codes_unused ON backup_codes(user_id, used) WHERE NOT used;
```

### 2FA Events Log

```sql
CREATE TABLE two_factor_events (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_type VARCHAR(50) NOT NULL,  -- 'setup', 'verify', 'backup_used', 'disabled'
  success BOOLEAN NOT NULL,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Index for security audits
CREATE INDEX idx_2fa_events_user ON two_factor_events(user_id, created_at DESC);
```

## Server-Side Implementation Example

### Express.js API Endpoints

```typescript
// Enable 2FA
app.post('/api/user/2fa/setup', authenticateUser, async (req, res) => {
  const user = req.user;

  // Generate 2FA data
  const setupData = await setupTwoFactor(user.email);

  // Encrypt secret before storing
  const encryptedSecret = await encrypt(setupData.secret, process.env.ENCRYPTION_KEY);

  // Hash backup codes before storing
  const hashedCodes = await Promise.all(setupData.backupCodes.map((code) => bcrypt.hash(code, 10)));

  // Store in database transaction
  await db.transaction(async (trx) => {
    await trx('users').where({ id: user.id }).update({
      two_factor_secret: encryptedSecret,
      updated_at: new Date(),
    });

    await trx('backup_codes').insert(
      hashedCodes.map((hash) => ({
        user_id: user.id,
        code_hash: hash,
      }))
    );
  });

  // Return QR code and backup codes (plain text)
  // WARNING: Only send these once, user must save them
  res.json({
    qrCodeUrl: setupData.qrCodeUrl,
    backupCodes: setupData.backupCodes,
    secret: setupData.secret, // For manual entry
  });
});

// Verify and enable 2FA
app.post('/api/user/2fa/verify-setup', authenticateUser, async (req, res) => {
  const { code } = req.body;
  const user = req.user;

  // Get stored secret
  const encryptedSecret = await db('users').where({ id: user.id }).first('two_factor_secret');

  const secret = await decrypt(encryptedSecret.two_factor_secret);

  // Verify code
  if (validateTwoFactorCode(code, secret)) {
    await db('users').where({ id: user.id }).update({ two_factor_enabled: true });

    await logEvent(user.id, 'setup', true, req);

    res.json({ success: true });
  } else {
    await logEvent(user.id, 'setup', false, req);
    res.status(400).json({ error: 'Invalid code' });
  }
});

// Login with 2FA
app.post('/api/auth/login', async (req, res) => {
  const { email, password, twoFactorCode } = req.body;

  // Verify password
  const user = await verifyPassword(email, password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check if 2FA enabled
  if (user.two_factor_enabled) {
    if (!twoFactorCode) {
      return res.json({
        requiresTwoFactor: true,
        userId: user.id, // For session
      });
    }

    // Verify 2FA code
    const secret = await decrypt(user.two_factor_secret);
    const isValid = validateTwoFactorCode(twoFactorCode, secret);

    if (!isValid) {
      await logEvent(user.id, 'verify', false, req);
      return res.status(401).json({ error: 'Invalid 2FA code' });
    }

    await logEvent(user.id, 'verify', true, req);
  }

  // Generate session token
  const token = await generateToken(user);
  res.json({ token, user });
});

// Verify backup code
app.post('/api/auth/backup-code', async (req, res) => {
  const { userId, code } = req.body;

  // Get unused backup codes
  const backupCodes = await db('backup_codes')
    .where({ user_id: userId, used: false })
    .select('id', 'code_hash');

  // Check each code
  for (const storedCode of backupCodes) {
    const isMatch = await bcrypt.compare(code, storedCode.code_hash);

    if (isMatch) {
      // Mark as used
      await db('backup_codes').where({ id: storedCode.id }).update({
        used: true,
        used_at: new Date(),
      });

      await logEvent(userId, 'backup_used', true, req);

      // Get user
      const user = await db('users').where({ id: userId }).first();
      const token = await generateToken(user);

      // Check remaining codes
      const remaining = await db('backup_codes')
        .where({ user_id: userId, used: false })
        .count('* as count');

      return res.json({
        token,
        user,
        backupCodesRemaining: remaining[0].count,
      });
    }
  }

  await logEvent(userId, 'backup_used', false, req);
  res.status(401).json({ error: 'Invalid backup code' });
});
```

## Security Best Practices

### 1. Encryption

```typescript
// Use strong encryption for secrets
import crypto from 'crypto';

const algorithm = 'aes-256-gcm';
const key = process.env.ENCRYPTION_KEY; // 32 bytes

function encrypt(text: string, key: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key, 'hex'), iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const authTag = cipher.getAuthTag();

  return iv.toString('hex') + ':' + authTag.toString('hex') + ':' + encrypted;
}

function decrypt(encryptedData: string, key: string): string {
  const parts = encryptedData.split(':');
  const iv = Buffer.from(parts[0], 'hex');
  const authTag = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];

  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key, 'hex'), iv);
  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}
```

### 2. Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const twoFactorLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many 2FA attempts, please try again later',
  standardHeaders: true,
  legacyHeaders: false,
});

app.post('/api/auth/verify-2fa', twoFactorLimiter, async (req, res) => {
  // Verification logic
});
```

### 3. Account Lockout

```typescript
async function checkAndLockAccount(userId: string): Promise<boolean> {
  const failedAttempts = await db('two_factor_events')
    .where({
      user_id: userId,
      event_type: 'verify',
      success: false,
    })
    .where('created_at', '>', new Date(Date.now() - 15 * 60 * 1000))
    .count('* as count');

  if (failedAttempts[0].count >= 5) {
    await db('users')
      .where({ id: userId })
      .update({
        locked_until: new Date(Date.now() + 30 * 60 * 1000),
      });

    await sendSecurityAlert(userId, 'Account locked due to failed 2FA attempts');
    return true;
  }

  return false;
}
```

## Testing

Run all 2FA tests:

```bash
npm test -- tests/unit/utils/totp.test.ts
npm test -- tests/unit/components/auth/TwoFactorSetup.test.tsx
```

Test with real authenticator apps:

1. Run development server
2. Enable 2FA on test account
3. Scan QR code with authenticator app
4. Verify codes work
5. Test backup codes
6. Test time sync edge cases

## Troubleshooting

### Time Sync Issues

```typescript
// Increase window tolerance if needed
import { authenticator } from 'otplib';

authenticator.options = {
  window: 2, // ±60 seconds (2 * 30s)
};
```

### QR Code Display Issues

```typescript
// Ensure proper styling
.qr-code {
  width: 200px;
  height: 200px;
  image-rendering: pixelated;  // Crisp edges
}
```

### Browser Compatibility

```typescript
// Check for Web Crypto API
if (!window.crypto || !window.crypto.getRandomValues) {
  throw new Error('Your browser does not support required security features');
}
```

## Migration Guide

### Existing Users

```typescript
// Add 2FA to existing user accounts
async function migrate2FA() {
  const users = await db('users').whereNull('two_factor_secret');

  for (const user of users) {
    await db('users').where({ id: user.id }).update({
      two_factor_enabled: false,
      two_factor_secret: null,
    });
  }

  console.log(`Migrated ${users.length} users`);
}
```

## Support & Resources

- [Full Implementation Docs](./2FA_IMPLEMENTATION.md)
- [TOTP Utils API](../src/utils/totp.ts)
- [Security Utils API](../src/utils/security.ts)
- [Component Examples](../src/components/auth/)

## License

MIT
