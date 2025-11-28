# Secrets Management Guide

**CompTIA Network+ Learning Platform**

## Table of Contents

1. [Overview](#overview)
2. [Secret Types](#secret-types)
3. [Generation](#generation)
4. [Storage](#storage)
5. [Rotation](#rotation)
6. [Deployment](#deployment)
7. [Emergency Procedures](#emergency-procedures)
8. [Best Practices](#best-practices)

---

## Overview

This guide covers the complete lifecycle of secrets management for the CompTIA Network+ platform, from generation through rotation and emergency response.

### Why Secrets Management Matters

- **Security**: Prevents unauthorized access to systems and data
- **Compliance**: Meets regulatory requirements (GDPR, HIPAA, etc.)
- **Auditability**: Tracks who accessed what and when
- **Recoverability**: Enables quick response to security incidents

### Scope

This guide covers:

- Application secrets (JWT, API keys, etc.)
- Database credentials
- Third-party service keys
- Encryption keys
- SSL/TLS certificates

---

## Secret Types

### 1. Authentication Secrets

**JWT Secrets**

- **Purpose**: Sign and verify JSON Web Tokens
- **Length**: 32+ characters
- **Rotation**: Every 90 days
- **Impact if compromised**: Unauthorized access to user accounts

```env
JWT_SECRET=abc123def456ghi789jkl012mno345pq
REFRESH_TOKEN_SECRET=xyz987wvu654tsr321qpo876nml543ij
```

**Session Secrets**

- **Purpose**: Sign session cookies
- **Length**: 64 characters (hex)
- **Rotation**: Every 90 days
- **Impact if compromised**: Session hijacking

```env
SESSION_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
COOKIE_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4
```

### 2. Database Credentials

**Connection Strings**

- **Purpose**: Connect to PostgreSQL database
- **Rotation**: Every 180 days
- **Impact if compromised**: Complete data breach

```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
DB_PASSWORD=secure_database_password_32chars
```

### 3. Encryption Keys

**Data Encryption**

- **Purpose**: Encrypt sensitive data at rest
- **Length**: 64 characters (hex)
- **Rotation**: Every 180 days (requires data re-encryption)
- **Impact if compromised**: Sensitive data exposure

```env
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
```

### 4. API Keys

**Third-Party Services**

- **Purpose**: Authenticate with external services
- **Rotation**: Per service requirements
- **Impact if compromised**: Service abuse, billing issues

```env
SENDGRID_API_KEY=SG.abc123...
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=wJal...
```

### 5. Security Tokens

**CSRF Protection**

- **Purpose**: Prevent cross-site request forgery
- **Length**: 64 characters (hex)
- **Rotation**: Every 90 days
- **Impact if compromised**: CSRF attacks

```env
CSRF_SECRET=fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210
```

---

## Generation

### Automatic Generation

Use the provided script for secure secret generation:

```bash
# Navigate to scripts directory
cd backend/scripts

# Make script executable
chmod +x generate-secrets.sh

# Generate secrets and save to file
./generate-secrets.sh > secrets-$(date +%Y%m%d).txt

# Review generated secrets
cat secrets-$(date +%Y%m%d).txt

# Copy to password manager, then securely delete
shred -vfz -n 10 secrets-$(date +%Y%m%d).txt
```

### Manual Generation

If you need to generate secrets manually:

```bash
# 32-character secret (base64)
openssl rand -base64 32 | tr -d "=+/" | cut -c1-32

# 64-character secret (hex)
openssl rand -hex 32

# UUID
uuidgen

# Strong password
openssl rand -base64 24 | tr -d "=+/"
```

### Generation Requirements

**Minimum Requirements:**

- Use cryptographically secure random number generator (CSRNG)
- Minimum 32 characters for most secrets
- Minimum 64 characters for encryption keys
- No predictable patterns or dictionary words
- Unique for each environment

**Do NOT use:**

- Weak generators (Math.random(), timestamp-based)
- Default or example secrets
- Secrets from tutorials or documentation
- Personal information (names, dates, etc.)
- Dictionary words or common phrases

---

## Storage

### Development Environment

**Local Development:**

```bash
# Create .env file (never commit)
cp .env.example .env

# Add to .gitignore
echo ".env*" >> .gitignore
echo "!.env.example" >> .gitignore
```

### Password Manager

**Recommended Services:**

- 1Password (Teams)
- LastPass (Enterprise)
- Bitwarden (Teams/Enterprise)
- HashiCorp Vault (Self-hosted)

**Storage Structure:**

```
CompTIA Network+ Platform/
├── Production/
│   ├── JWT Secrets
│   ├── Database Credentials
│   ├── API Keys
│   └── Encryption Keys
├── Staging/
│   └── [Same structure]
└── Development/
    └── [Same structure]
```

### GitHub Secrets

**Repository Secrets:**

```bash
# Add using GitHub CLI
gh secret set JWT_SECRET
# Paste value and press Ctrl+D

# Bulk import
gh secret set -R owner/repo < secrets.env
```

**Environment Secrets:**

```bash
# Set for specific environment
gh secret set JWT_SECRET --env production
```

### Hosting Platform

**Vercel:**

```bash
# Using Vercel CLI
vercel env add JWT_SECRET production

# Or via dashboard:
# Project Settings → Environment Variables
```

**Railway:**

```bash
# Using Railway CLI
railway variables set JWT_SECRET=xxx

# Or via dashboard:
# Project → Variables
```

**Heroku:**

```bash
# Using Heroku CLI
heroku config:set JWT_SECRET=xxx -a app-name
```

---

## Rotation

### Rotation Schedule

| Secret Type    | Rotation Period | Grace Period | Impact   |
| -------------- | --------------- | ------------ | -------- |
| JWT_SECRET     | 90 days         | 24 hours     | Medium   |
| DATABASE_URL   | 180 days        | None         | High     |
| SESSION_SECRET | 90 days         | None         | Medium   |
| ENCRYPTION_KEY | 180 days        | N/A          | Critical |
| API_KEY        | 90 days         | 30 days      | Low      |
| CSRF_SECRET    | 90 days         | 24 hours     | Low      |

### Zero-Downtime Rotation

**Step-by-Step Process:**

1. **Generate New Secret**

```bash
./backend/scripts/rotate-secrets.sh
# Choose the secret to rotate
```

2. **Add Temporary Secret**

```env
# Add alongside existing secret
JWT_SECRET=old_secret_value
JWT_SECRET_NEW=new_secret_value
```

3. **Update Code to Accept Both**

```javascript
// Example: Accept both old and new JWT secrets
const jwtSecrets = [process.env.JWT_SECRET, process.env.JWT_SECRET_NEW].filter(Boolean);

// Verify with either secret
const verified = jwtSecrets.some((secret) => {
  try {
    jwt.verify(token, secret);
    return true;
  } catch (err) {
    return false;
  }
});
```

4. **Deploy and Verify**

```bash
# Deploy to staging first
npm run deploy:staging

# Verify both secrets work
npm run test:secrets

# Deploy to production
npm run deploy:production
```

5. **Wait for Grace Period**

```bash
# Wait for all old tokens to expire
# JWT: 15 minutes
# Refresh tokens: 7 days
# Sessions: 24 hours
```

6. **Remove Old Secret**

```env
# Remove old secret, rename new
JWT_SECRET=new_secret_value
# JWT_SECRET_NEW removed
```

7. **Final Deployment**

```bash
# Deploy updated configuration
npm run deploy:production

# Verify only new secret works
npm run test:secrets
```

### Critical Secret Rotation

**For secrets requiring immediate rotation (compromised):**

```bash
# 1. Generate new secret immediately
NEW_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

# 2. Update all environments simultaneously
gh secret set JWT_SECRET <<< "$NEW_SECRET"
vercel env add JWT_SECRET production <<< "$NEW_SECRET"

# 3. Trigger immediate deployment
gh workflow run deploy.yml

# 4. Invalidate all existing tokens/sessions
# (Application-specific logic)
```

---

## Deployment

### Environment-Specific Configuration

**Development:**

```env
# .env.development (can use weak secrets)
JWT_SECRET=dev-secret-not-for-production
DATABASE_URL=postgresql://localhost:5432/comptia_dev
```

**Staging:**

```env
# .env.staging (production-like secrets)
JWT_SECRET=staging_abc123def456ghi789jkl012
DATABASE_URL=postgresql://staging-db:5432/comptia_staging
```

**Production:**

```env
# .env.production (strong, unique secrets)
JWT_SECRET=prod_xyz987wvu654tsr321qpo876nml543
DATABASE_URL=postgresql://prod-db:5432/comptia_prod
```

### Deployment Checklist

**Pre-Deployment:**

- [ ] All secrets generated using secure methods
- [ ] Secrets stored in password manager
- [ ] Secrets configured in hosting platform
- [ ] Secrets configured in GitHub (for CI/CD)
- [ ] `.env` files in `.gitignore`
- [ ] No secrets in code or comments

**During Deployment:**

- [ ] Verify environment variables loaded correctly
- [ ] Test database connection
- [ ] Test JWT signing/verification
- [ ] Test external service connections
- [ ] Check logs for secret-related errors

**Post-Deployment:**

- [ ] Verify all features working
- [ ] Check for secret leaks in logs
- [ ] Monitor error rates
- [ ] Test authentication flows
- [ ] Verify data encryption/decryption

---

## Emergency Procedures

### Secret Compromise Response

**Immediate Actions (First 15 Minutes):**

1. **Assess Impact**

```bash
# Determine which secret was compromised
# Check git history, logs, error reports

# Example: Check if secret in git history
git log -p --all | grep -i "jwt_secret"
```

2. **Rotate Compromised Secret**

```bash
# Generate new secret
NEW_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

# Update immediately
gh secret set JWT_SECRET <<< "$NEW_SECRET"
vercel env add JWT_SECRET production <<< "$NEW_SECRET"
```

3. **Invalidate Active Sessions**

```javascript
// Application code to invalidate all sessions
await db.sessions.deleteAll();
await redisClient.flushdb(); // If using Redis for sessions
```

4. **Deploy Emergency Fix**

```bash
# Trigger immediate deployment
gh workflow run deploy.yml --ref main

# Or manual deployment
npm run deploy:production
```

**Short-Term Actions (First Hour):**

5. **Notify Stakeholders**

```text
Subject: Security Incident - Secret Rotation

A potential secret compromise was detected at [TIME].
The following actions have been taken:
- Compromised secret rotated
- All active sessions invalidated
- Emergency deployment completed

Current status: [RESOLVED/MONITORING]
Impact: [DESCRIBE USER IMPACT]
```

6. **Monitor for Abuse**

```bash
# Check logs for suspicious activity
grep -i "unauthorized\|forbidden\|error" /var/log/app.log

# Monitor error tracking (Sentry, etc.)
# Check for spike in 401/403 errors
```

7. **Review Access Logs**

```bash
# Database access logs
psql -c "SELECT * FROM pg_stat_activity WHERE state = 'active';"

# Application access logs
awk '{print $1}' access.log | sort | uniq -c | sort -nr | head -20
```

**Long-Term Actions (First 24 Hours):**

8. **Root Cause Analysis**

- How was the secret compromised?
- What systems were affected?
- What data was potentially accessed?
- How can we prevent this in the future?

9. **Rotate All Related Secrets**

```bash
# If one secret compromised, rotate all secrets as precaution
./backend/scripts/rotate-secrets.sh
# Select option 8: All secrets
```

10. **Update Security Procedures**

- Enhance secret scanning
- Implement additional monitoring
- Update team training
- Review access controls

### Secret Exposure in Git

**If secret committed to git:**

```bash
# 1. Remove from latest commit (if just committed)
git reset HEAD~1
git add .gitignore
git commit -m "Add .env to gitignore"

# 2. Remove from git history (if already pushed)
# USE WITH CAUTION - rewrites history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push (requires team coordination)
git push origin --force --all

# 4. Notify team to re-clone repository
# 5. Rotate ALL secrets immediately
```

**Better Approach: Use BFG Repo-Cleaner**

```bash
# Install BFG
# brew install bfg  # macOS
# choco install bfg # Windows

# Clone fresh copy
git clone --mirror https://github.com/user/repo.git

# Remove secret file
bfg --delete-files .env repo.git

# Clean up
cd repo.git
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Push
git push
```

---

## Best Practices

### Development

1. **Use Environment Variables**

```javascript
// ✅ Good
const secret = process.env.JWT_SECRET;

// ❌ Bad
const secret = 'hardcoded-secret';
```

2. **Never Log Secrets**

```javascript
// ✅ Good
logger.info('User authenticated', { userId: user.id });

// ❌ Bad
logger.info('JWT token:', token);
```

3. **Validate Secret Format**

```javascript
// Check secret meets minimum requirements
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters');
}
```

### CI/CD

1. **Use GitHub Encrypted Secrets**

```yaml
# ✅ Good
env:
  JWT_SECRET: ${{ secrets.JWT_SECRET }}

# ❌ Bad
env:
  JWT_SECRET: "abc123"
```

2. **Mask Secrets in Logs**

```yaml
# Secrets are automatically masked in GitHub Actions
# But avoid echoing them
- name: Deploy
  run: |
    echo "Deploying..." # ✅ Good
    # echo "${{ secrets.JWT_SECRET }}" # ❌ Bad
```

3. **Limit Secret Scope**

```yaml
# Use environment-specific secrets
- name: Deploy to Production
  environment: production
  env:
    JWT_SECRET: ${{ secrets.PRODUCTION_JWT_SECRET }}
```

### Monitoring

1. **Enable Secret Scanning**

- GitHub secret scanning
- GitGuardian
- TruffleHog
- Pre-commit hooks

2. **Alert on Secret Access**

```javascript
// Log when secrets are accessed
logger.info('Secret accessed', {
  secret: 'JWT_SECRET',
  timestamp: new Date(),
  user: req.user?.id,
});
```

3. **Regular Audits**

```bash
# Monthly secret audit
# Check for:
# - Expired secrets
# - Weak secrets
# - Unused secrets
# - Secrets in wrong location
```

### Team Training

1. **Onboarding Checklist**

- [ ] Reviewed secrets management guide
- [ ] Installed password manager
- [ ] Configured git hooks to prevent commits
- [ ] Completed security training
- [ ] Practiced secret rotation procedure

2. **Regular Reminders**

- Weekly security tips
- Monthly secret rotation reviews
- Quarterly security training
- Annual security audit

---

## Tools & Resources

### Secret Generation

- `openssl` - Cryptographically secure random generation
- `uuidgen` - UUID generation
- `/dev/urandom` - Linux random number generator

### Secret Storage

- **1Password** - https://1password.com/teams
- **LastPass** - https://www.lastpass.com/products/enterprise
- **Bitwarden** - https://bitwarden.com/products/business
- **HashiCorp Vault** - https://www.vaultproject.io

### Secret Scanning

- **GitHub Secret Scanning** - Built-in to GitHub
- **GitGuardian** - https://www.gitguardian.com
- **TruffleHog** - https://github.com/trufflesecurity/trufflehog
- **detect-secrets** - https://github.com/Yelp/detect-secrets

### Pre-commit Hooks

```bash
# Install pre-commit
pip install pre-commit

# Create .pre-commit-config.yaml
cat > .pre-commit-config.yaml <<EOF
repos:
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.4.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
EOF

# Install hooks
pre-commit install
```

### Monitoring

- **Sentry** - Error tracking with secret redaction
- **DataDog** - Infrastructure monitoring
- **AWS CloudWatch** - AWS service monitoring
- **Prometheus** - Metrics collection

---

## Appendix

### Secret Strength Calculator

```javascript
// Calculate secret entropy
function calculateEntropy(secret) {
  const charsetSize = {
    lowercase: 26,
    uppercase: 26,
    numbers: 10,
    special: 32,
  };

  let charset = 0;
  if (/[a-z]/.test(secret)) charset += charsetSize.lowercase;
  if (/[A-Z]/.test(secret)) charset += charsetSize.uppercase;
  if (/[0-9]/.test(secret)) charset += charsetSize.numbers;
  if (/[^a-zA-Z0-9]/.test(secret)) charset += charsetSize.special;

  const entropy = secret.length * Math.log2(charset);
  return entropy;
}

// Minimum entropy recommendations:
// - Low security: 60 bits
// - Medium security: 80 bits
// - High security: 128 bits
// - Very high security: 256 bits
```

### Incident Response Template

```markdown
# Security Incident Report

**Date:** [YYYY-MM-DD]
**Incident ID:** [INC-XXXXX]
**Severity:** [Critical/High/Medium/Low]

## Summary

[Brief description of incident]

## Timeline

- [HH:MM] - Incident detected
- [HH:MM] - Secret rotated
- [HH:MM] - Systems secured
- [HH:MM] - Incident resolved

## Impact

- **Users Affected:** [Number]
- **Data Accessed:** [Description]
- **Downtime:** [Duration]

## Actions Taken

1. [Action 1]
2. [Action 2]
3. [Action 3]

## Root Cause

[Detailed analysis]

## Prevention Measures

1. [Measure 1]
2. [Measure 2]

## Follow-Up

- [ ] Update security procedures
- [ ] Team training scheduled
- [ ] Monitoring enhanced
```

---

**Document Version:** 1.0
**Last Updated:** 2024-01-15
**Next Review:** 2024-04-15
**Owner:** DevOps Team
