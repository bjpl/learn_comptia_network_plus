# Comprehensive Secrets Management Usage Guide

**CompTIA Network+ Learning Platform - Production Deployment**

## Quick Start

This guide walks you through the complete process of generating, storing, and deploying production secrets.

---

## Step 1: Generate Production Secrets

### For Production Environment

```bash
# Navigate to backend scripts directory
cd backend/scripts

# Generate secrets and save to dated file
./generate-secrets.sh > secrets-production-$(date +%Y%m%d).txt

# Review the generated secrets
cat secrets-production-$(date +%Y%m%d).txt
```

**Output will look like:**

```
===================================
Production Secrets Generator
===================================

⚠️  CRITICAL: Save these secrets securely!
⚠️  Never commit these to version control!
⚠️  Each environment needs unique secrets!

🔐 JWT Secrets
==============
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
REFRESH_TOKEN_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4

🗄️  Database Credentials
=======================
DB_USER=comptia_admin_9a8b7c6d
DB_PASSWORD=1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
DB_NAME=comptia_network_e4f5g6h7

... (and so on)
```

### For Staging Environment

```bash
# Generate different secrets for staging
./generate-secrets.sh > secrets-staging-$(date +%Y%m%d).txt
```

---

## Step 2: Store Secrets Securely

### Option A: Password Manager (Recommended)

**Using 1Password:**

1. Open 1Password
2. Create new Vault: "CompTIA Network+ Platform"
3. Create item: "Production Secrets"
4. Add each secret as a separate field
5. Tag with "production", "backend", "critical"

**Using LastPass:**

1. Open LastPass
2. Add → Secure Note
3. Name: "CompTIA Network+ - Production"
4. Paste secrets or add as custom fields
5. Add to "Shared-DevOps" folder

**Using Bitwarden:**

1. Open Bitwarden
2. New Item → Secure Note
3. Name: "CompTIA Production Secrets"
4. Add as custom fields
5. Share with DevOps team

### Option B: Physical Secure Storage

```bash
# Print secrets to secure printer
./generate-secrets.sh | lpr -P secure-printer

# Store printed copy in safe
# Label: "CompTIA Network+ Production Secrets - $(date +%Y-%m-%d)"
```

---

## Step 3: Configure Environment Files

### Create .env.production

```bash
# Copy template
cp backend/.env.production.template backend/.env.production

# Open in secure editor
nano backend/.env.production

# Replace ALL [GENERATED] values with actual secrets from Step 1
# Replace ALL <get-from-service> values with actual API keys
```

**Important**: This file contains real secrets - NEVER commit it!

### Update .gitignore

```bash
# Ensure .env files are ignored
echo ".env*" >> .gitignore
echo "!.env.example" >> .gitignore
echo "!.env*.template" >> .gitignore

# Verify
git status # Should not show .env.production
```

---

## Step 4: Configure GitHub Secrets

### Method 1: GitHub Web Interface

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret:

**Required Secrets:**

```
JWT_SECRET=<from generate-secrets.sh>
REFRESH_TOKEN_SECRET=<from generate-secrets.sh>
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
SESSION_SECRET=<from generate-secrets.sh>
COOKIE_SECRET=<from generate-secrets.sh>
ENCRYPTION_KEY=<from generate-secrets.sh>
CSRF_SECRET=<from generate-secrets.sh>
API_KEY=<from generate-secrets.sh>
```

### Method 2: GitHub CLI (Faster)

```bash
# Install GitHub CLI if not already installed
# Windows: winget install GitHub.cli
# macOS: brew install gh
# Linux: apt install gh

# Authenticate
gh auth login

# Set secrets from file
# First, create a secrets.env file with KEY=VALUE format
cat > secrets.env <<EOF
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
REFRESH_TOKEN_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
SESSION_SECRET=1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
COOKIE_SECRET=fedcba0987654321fedcba0987654321
ENCRYPTION_KEY=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef
CSRF_SECRET=abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890
EOF

# Import all secrets
while IFS='=' read -r key value; do
    echo "Setting $key..."
    echo "$value" | gh secret set "$key"
done < secrets.env

# Securely delete the file
shred -vfz -n 10 secrets.env
```

---

## Step 5: Configure Hosting Platform

### Vercel

**Using Vercel Dashboard:**

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each secret with scope: Production

**Using Vercel CLI:**

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Add secrets
vercel env add JWT_SECRET production
# Paste value when prompted

# Or from file
cat secrets.env | while IFS='=' read -r key value; do
    echo "$value" | vercel env add "$key" production
done
```

### Railway

**Using Railway Dashboard:**

1. Go to https://railway.app/dashboard
2. Select your project
3. Click Variables tab
4. Add RAW Editor mode
5. Paste all secrets

**Using Railway CLI:**

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link to project
railway link

# Add variables
railway variables set JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
# Repeat for all secrets
```

### Heroku

```bash
# Install Heroku CLI
# Windows: winget install Heroku.HerokuCLI
# macOS: brew tap heroku/brew && brew install heroku

# Login
heroku login

# Set config vars
heroku config:set \
  JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6 \
  REFRESH_TOKEN_SECRET=z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4 \
  DATABASE_URL=postgresql://user:pass@host:5432/db \
  -a your-app-name
```

### AWS (if using EC2, ECS, etc.)

**Using AWS Systems Manager Parameter Store:**

```bash
# Install AWS CLI
# Windows: winget install Amazon.AWSCLI
# macOS: brew install awscli

# Configure
aws configure

# Store secrets
aws ssm put-parameter \
    --name "/comptia-network/production/JWT_SECRET" \
    --value "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6" \
    --type "SecureString" \
    --description "JWT signing secret for production"

# Repeat for all secrets
```

---

## Step 6: Verify Secrets Configuration

### Run Verification Script

```bash
# Navigate to backend directory
cd backend

# Ensure .env file exists with your secrets
cp .env.production .env

# Run verification
./scripts/verify-secrets.sh
```

**Expected Output:**

```
🔍 Secrets Verification Script
==============================

Environment: production

📋 Checking Required Secrets
============================

🔐 JWT Configuration:
✓ JWT_SECRET is set
✓ REFRESH_TOKEN_SECRET is set

🗄️  Database Configuration:
✓ DATABASE_URL is set
✓ DB_PASSWORD is set

... (all checks pass)

==============================
📊 Verification Summary
==============================
Total Checks: 15
Passed: 15
Failed: 0
Warnings: 0

✅ All secrets verified successfully!
```

### Manual Verification

```bash
# Test database connection
psql $DATABASE_URL -c "SELECT 1;"

# Test JWT generation (in Node.js console)
node -e "
const jwt = require('jsonwebtoken');
const token = jwt.sign({test: true}, process.env.JWT_SECRET);
console.log('Token:', token);
console.log('Verified:', jwt.verify(token, process.env.JWT_SECRET));
"
```

---

## Step 7: Complete Pre-Production Checklist

Open and complete: `docs/PRE_PRODUCTION_CHECKLIST.md`

**Key Sections:**

- [ ] Secrets & Configuration (should be 100% complete now)
- [ ] Security Hardening
- [ ] Database Security
- [ ] Authentication & Authorization
- [ ] Monitoring & Logging
- [ ] Deployment & Infrastructure
- [ ] Testing & Validation

**Sign-off required from:**

- Backend Developer
- DevOps Engineer
- Security Lead
- QA Engineer
- Product Owner

---

## Step 8: Test Deployment to Staging

```bash
# Deploy to staging first
git checkout staging
git merge main

# Push to trigger deployment
git push origin staging

# Monitor deployment
# Vercel: https://vercel.com/deployments
# Railway: railway logs
# Heroku: heroku logs --tail -a app-name-staging

# Verify all services working
curl https://staging-api.yourdomain.com/health
```

---

## Step 9: Production Deployment

### Pre-Deployment

```bash
# 1. Create deployment branch
git checkout -b production-deploy-$(date +%Y%m%d)

# 2. Final verification
./backend/scripts/verify-secrets.sh

# 3. Run all tests
npm test

# 4. Create backup
# (Database backup should be automatic, verify)

# 5. Notify team
# Send message to #deployments Slack channel
```

### Deploy

```bash
# 6. Merge to production branch
git checkout production
git merge production-deploy-$(date +%Y%m%d)

# 7. Tag release
git tag -a v1.0.0 -m "Production release 1.0.0"

# 8. Push
git push origin production
git push origin v1.0.0

# 9. Monitor deployment
# Watch CI/CD pipeline
# Check logs for errors
# Monitor error tracking (Sentry)
```

### Post-Deployment

```bash
# 10. Verify production
curl https://api.yourdomain.com/health

# 11. Test critical paths
# - User registration
# - User login
# - Quiz taking
# - Study session

# 12. Monitor for 2 hours
# - Check error rates
# - Check response times
# - Check database connections
# - Review logs

# 13. Document deployment
# Update deployment log
# Note any issues encountered
# Document resolutions
```

---

## Step 10: Secret Rotation Schedule

### Set Up Rotation Reminders

```bash
# Create calendar events for secret rotation
# Or use task management system

# Rotation Schedule:
# - JWT secrets: Every 90 days
# - Database password: Every 180 days
# - Session secrets: Every 90 days
# - API keys: Per service requirements
```

### First Rotation (90 days after deployment)

```bash
# Run rotation script
./backend/scripts/rotate-secrets.sh

# Follow prompts for zero-downtime rotation
# Document rotation in change log
```

---

## Troubleshooting

### "Secret not found" error

**Problem:** Application can't find environment variable

**Solution:**

```bash
# 1. Verify secret is set
echo $JWT_SECRET  # Should not be empty

# 2. Check .env file
cat .env | grep JWT_SECRET

# 3. Restart application
npm restart

# 4. Check hosting platform configuration
vercel env ls
# or
railway variables
```

### "Invalid token" errors after deployment

**Problem:** JWT secret changed but old tokens still in use

**Solution:**

```bash
# This is expected behavior
# Users need to log in again
# Or implement token migration strategy (see docs/SECRETS_MANAGEMENT.md)
```

### Database connection fails

**Problem:** DATABASE_URL incorrect or database not accessible

**Solution:**

```bash
# 1. Verify DATABASE_URL format
echo $DATABASE_URL
# Should be: postgresql://user:password@host:5432/database?sslmode=require

# 2. Test connection directly
psql $DATABASE_URL -c "SELECT 1;"

# 3. Check database firewall rules
# Ensure your server's IP is whitelisted

# 4. Verify SSL is enabled
# DATABASE_URL should include ?sslmode=require
```

### Secrets exposed in logs

**Problem:** Secret values appearing in application logs

**Solution:**

```bash
# 1. Immediately rotate affected secret
./backend/scripts/rotate-secrets.sh

# 2. Review logging code
grep -r "console.log.*process.env" .

# 3. Ensure logger redacts secrets
# (Should be configured in logger setup)

# 4. Enable secret scanning
gh secret scanning enable
```

---

## Emergency Procedures

### Secret Compromised

**Immediate Actions:**

```bash
# 1. Generate new secret
NEW_SECRET=$(openssl rand -base64 32 | tr -d "=+/" | cut -c1-32)

# 2. Update in all locations
# - Password manager
# - GitHub Secrets
# - Hosting platform
# - .env.production

# 3. Deploy immediately
git commit -m "Emergency: Rotate compromised secret"
git push

# 4. Invalidate old sessions/tokens
# (Application-specific)

# 5. Notify team and stakeholders

# 6. Document incident
# Use template in docs/SECRETS_MANAGEMENT.md
```

---

## Maintenance Checklist

### Weekly

- [ ] Review error logs for secret-related errors
- [ ] Verify monitoring alerts working
- [ ] Check database connection pool health

### Monthly

- [ ] Review access logs
- [ ] Verify backups completing successfully
- [ ] Check for dependency security updates
- [ ] Test secret rotation procedure in staging

### Quarterly

- [ ] Rotate JWT and session secrets
- [ ] Review and update security policies
- [ ] Conduct team training on secret management
- [ ] Audit secret access (who has access to what)

### Annually

- [ ] Rotate all secrets
- [ ] Conduct security audit
- [ ] Review and update disaster recovery plan
- [ ] Update documentation

---

## Additional Resources

### Documentation

- **Secrets Management Guide**: `docs/SECRETS_MANAGEMENT.md`
- **GitHub Secrets Setup**: `docs/GITHUB_SECRETS_SETUP.md`
- **Pre-Production Checklist**: `docs/PRE_PRODUCTION_CHECKLIST.md`

### Scripts

- **Generate Secrets**: `backend/scripts/generate-secrets.sh`
- **Rotate Secrets**: `backend/scripts/rotate-secrets.sh`
- **Verify Secrets**: `backend/scripts/verify-secrets.sh`

### External Links

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_CheatSheet.html)
- [12-Factor App: Config](https://12factor.net/config)
- [GitHub Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

---

## Support

**Questions or Issues?**

1. Check troubleshooting section above
2. Review full documentation in `docs/SECRETS_MANAGEMENT.md`
3. Contact DevOps team
4. For emergencies, use security incident response procedure

---

**Document Version:** 1.0
**Last Updated:** 2024-01-15
**Prepared By:** DevOps Team
