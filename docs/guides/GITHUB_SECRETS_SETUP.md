# GitHub Secrets Configuration Guide

## Overview

GitHub Secrets are encrypted environment variables used in CI/CD workflows. This guide covers setting up all required secrets for the CompTIA Network+ platform.

## Required Secrets for CI/CD

### 🔐 Authentication Secrets

| Secret Name            | Description                    | Example     |
| ---------------------- | ------------------------------ | ----------- |
| `JWT_SECRET`           | JWT signing key (32+ chars)    | `abc123...` |
| `REFRESH_TOKEN_SECRET` | Refresh token signing key      | `xyz789...` |
| `SESSION_SECRET`       | Session signing key (64 chars) | `def456...` |
| `COOKIE_SECRET`        | Cookie signing key             | `ghi789...` |

### 🗄️ Database Secrets

| Secret Name    | Description                       | Example                               |
| -------------- | --------------------------------- | ------------------------------------- |
| `DATABASE_URL` | Full PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `DB_PASSWORD`  | Database password only            | `secure_password`                     |

### 🚀 Deployment Secrets

| Secret Name       | Description                    | Example                           |
| ----------------- | ------------------------------ | --------------------------------- |
| `DOCKER_USERNAME` | Docker Hub username            | `yourcompany`                     |
| `DOCKER_PASSWORD` | Docker Hub access token        | `dckr_pat_...`                    |
| `DEPLOY_KEY`      | SSH private key for deployment | `-----BEGIN RSA PRIVATE KEY-----` |
| `DEPLOY_HOST`     | Deployment server hostname     | `deploy.yourdomain.com`           |
| `DEPLOY_USER`     | Deployment server username     | `deployer`                        |

### ☁️ Cloud Provider Secrets (Optional)

| Secret Name             | Description           | Example                |
| ----------------------- | --------------------- | ---------------------- |
| `AWS_ACCESS_KEY_ID`     | AWS access key        | `AKIA...`              |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key        | `wJal...`              |
| `S3_BUCKET_NAME`        | S3 bucket for storage | `comptia-network-prod` |

### 📊 Monitoring Secrets (Optional)

| Secret Name         | Description               | Example                     |
| ------------------- | ------------------------- | --------------------------- |
| `SENTRY_DSN`        | Sentry error tracking DSN | `https://...@sentry.io/...` |
| `SENTRY_AUTH_TOKEN` | Sentry deployment token   | `sntrys_...`                |
| `CODECOV_TOKEN`     | Code coverage reporting   | `abc123...`                 |

### 📧 Email Service Secrets (Optional)

| Secret Name        | Description           | Example            |
| ------------------ | --------------------- | ------------------ |
| `SENDGRID_API_KEY` | SendGrid API key      | `SG.abc...`        |
| `SMTP_PASSWORD`    | SMTP service password | `secure_smtp_pass` |

## How to Add Secrets to GitHub

### Method 1: Using GitHub Web Interface

1. **Navigate to Repository Settings**
   - Go to your repository on GitHub
   - Click **Settings** tab
   - Click **Secrets and variables** → **Actions**

2. **Add New Secret**
   - Click **New repository secret**
   - Enter secret name (e.g., `JWT_SECRET`)
   - Paste the secret value
   - Click **Add secret**

3. **Verify Secret Added**
   - Secret will appear in the list (value is hidden)
   - You can update but never view the value again

### Method 2: Using GitHub CLI

```bash
# Install GitHub CLI if needed
# Windows: winget install GitHub.cli
# macOS: brew install gh
# Linux: See https://cli.github.com/

# Authenticate
gh auth login

# Add a secret
gh secret set JWT_SECRET < secret-value.txt

# Or interactively
gh secret set JWT_SECRET
# (paste value and press Enter, then Ctrl+D)

# Add multiple secrets from file
cat secrets.env | gh secret set -R owner/repo
```

### Method 3: Bulk Import Script

Create a script to import all secrets:

```bash
#!/bin/bash
# File: scripts/import-github-secrets.sh

# Read from generated secrets file
SECRETS_FILE="$1"

if [ ! -f "$SECRETS_FILE" ]; then
    echo "Usage: ./import-github-secrets.sh <secrets-file>"
    exit 1
fi

echo "Importing secrets to GitHub..."

# Parse and import each secret
while IFS='=' read -r key value; do
    # Skip empty lines and comments
    [[ -z "$key" || "$key" =~ ^# ]] && continue

    echo "Setting $key..."
    echo "$value" | gh secret set "$key"
done < "$SECRETS_FILE"

echo "✅ All secrets imported successfully!"
```

Usage:

```bash
chmod +x scripts/import-github-secrets.sh
./scripts/import-github-secrets.sh secrets-production.txt
```

## Environment-Specific Secrets

### Staging Environment

Create environment-specific secrets with prefixes:

```
STAGING_JWT_SECRET
STAGING_DATABASE_URL
STAGING_API_KEY
```

Then use in workflows:

```yaml
- name: Deploy to Staging
  env:
    JWT_SECRET: ${{ secrets.STAGING_JWT_SECRET }}
```

### Production Environment

Use GitHub Environments for additional protection:

1. **Create Environment**
   - Go to Settings → Environments
   - Click **New environment**
   - Name it "production"

2. **Add Protection Rules**
   - Require reviewers (1-6 people)
   - Add deployment branch rules
   - Set wait timer if needed

3. **Add Environment Secrets**
   - These override repository secrets
   - Only available when deploying to that environment

## Using Secrets in GitHub Actions

### Example Workflow

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: production

    steps:
      - uses: actions/checkout@v3

      - name: Deploy Application
        env:
          # Authentication
          JWT_SECRET: ${{ secrets.JWT_SECRET }}
          REFRESH_TOKEN_SECRET: ${{ secrets.REFRESH_TOKEN_SECRET }}

          # Database
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

          # Deployment
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
          DEPLOY_HOST: ${{ secrets.DEPLOY_HOST }}

        run: |
          ./scripts/deploy.sh
```

## Security Best Practices

### 1. Secret Generation

- Use cryptographically secure random generation
- Minimum 32 characters for most secrets
- Use different secrets for each environment

### 2. Secret Management

- Never log secret values
- Don't echo secrets in workflows
- Use secret scanning tools
- Rotate secrets regularly (every 90 days)

### 3. Access Control

- Limit repository access
- Use environment protection rules
- Enable audit logging
- Review access logs regularly

### 4. Monitoring

- Enable GitHub secret scanning
- Set up alerts for exposed secrets
- Monitor Actions workflow logs
- Use Dependabot for dependency updates

## Troubleshooting

### Secret Not Available in Workflow

**Problem:** Secret shows as empty in workflow

**Solutions:**

1. Check secret name matches exactly (case-sensitive)
2. Verify secret exists in correct scope (repo/environment)
3. Check workflow has permission to access environment
4. Ensure secret value doesn't start with space

### Failed to Set Secret

**Problem:** `gh secret set` fails

**Solutions:**

```bash
# Ensure you're authenticated
gh auth status

# Check repository access
gh repo view

# Verify you have admin access
gh api /repos/owner/repo | jq .permissions
```

### Secret Rotation Without Downtime

**Strategy:**

1. Add new secret with temporary name (`JWT_SECRET_NEW`)
2. Update workflow to use both secrets
3. Deploy and verify
4. After grace period, remove old secret
5. Rename new secret to original name

## Secret Rotation Schedule

Create a rotation schedule:

| Secret       | Rotation Period | Last Rotated | Next Rotation |
| ------------ | --------------- | ------------ | ------------- |
| JWT_SECRET   | 90 days         | 2024-01-15   | 2024-04-15    |
| DATABASE_URL | 180 days        | 2024-01-01   | 2024-07-01    |
| API_KEY      | 90 days         | 2024-01-20   | 2024-04-20    |
| DEPLOY_KEY   | 365 days        | 2024-01-01   | 2025-01-01    |

## Audit Checklist

- [ ] All required secrets are set
- [ ] Secrets are unique per environment
- [ ] Production uses GitHub Environments
- [ ] Secret scanning is enabled
- [ ] Rotation schedule is documented
- [ ] Team members trained on secret management
- [ ] Backup of secrets stored in password manager
- [ ] CI/CD workflows tested with secrets
- [ ] No secrets in code or logs
- [ ] Access audit completed

## Emergency Procedures

### If Secret is Compromised

1. **Immediate Actions**

   ```bash
   # Generate new secret
   NEW_SECRET=$(openssl rand -base64 32)

   # Update in GitHub
   echo "$NEW_SECRET" | gh secret set JWT_SECRET

   # Trigger deployment
   gh workflow run deploy.yml
   ```

2. **Notification**
   - Notify security team
   - Document incident
   - Review access logs
   - Investigate breach source

3. **Post-Incident**
   - Rotate all related secrets
   - Update security procedures
   - Conduct team training
   - Implement additional monitoring

## Additional Resources

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [GitHub CLI Secrets](https://cli.github.com/manual/gh_secret)
- [Security Hardening Guide](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [Secret Scanning](https://docs.github.com/en/code-security/secret-scanning/about-secret-scanning)

---

**Last Updated:** 2024-01-15
**Version:** 1.0
**Owner:** DevOps Team
