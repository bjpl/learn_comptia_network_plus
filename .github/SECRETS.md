# GitHub Secrets Configuration Guide

This document describes all secrets required for the CompTIA Network+ CI/CD pipeline.

## Required Secrets for CI/CD Pipeline

### CI Pipeline (Main Workflows)

#### Optional but Recommended

- **`SNYK_TOKEN`** - Snyk security scanning API token
  - Get from: https://snyk.io/account/
  - Used in: `.github/workflows/ci.yml`, `.github/workflows/backend-ci.yml`
  - Impact if missing: Security scans will be skipped (non-blocking)

- **`CODECOV_TOKEN`** - Codecov coverage upload token
  - Get from: https://codecov.io/ (after linking repository)
  - Used in: Coverage upload steps in all test workflows
  - Impact if missing: Coverage reports won't be uploaded (non-blocking)

#### Auto-Provided

- **`GITHUB_TOKEN`** - Automatically provided by GitHub Actions
  - No setup needed - available in all workflows
  - Used for: Repository operations, artifact uploads, API calls

### Deployment Workflows

#### GitHub Pages Deployment (Optional)

- **`GH_PAGES_TOKEN`** - Personal access token for GitHub Pages deployment
  - Only needed if using custom token instead of `GITHUB_TOKEN`
  - Permissions required: `repo` scope
  - Used in: `.github/workflows/deploy.yml`

### Backend Deployment (Production)

#### Docker Registry (If using Docker Hub)

- **`DOCKER_USERNAME`** - Docker Hub username
- **`DOCKER_PASSWORD`** - Docker Hub password or access token
  - Get from: https://hub.docker.com/settings/security
  - Used in: Backend deployment workflows

#### Application Secrets

- **`DATABASE_URL`** - Production database connection string
  - Format: `postgresql://user:password@host:port/database`
  - Example: `postgresql://postgres:securepass@db.example.com:5432/comptia_prod`

- **`JWT_SECRET`** - JWT signing secret (minimum 32 bytes)
  - Generate with: `openssl rand -base64 32`
  - Must be kept secret and never committed to repository

- **`SESSION_SECRET`** - Express session secret (minimum 32 bytes)
  - Generate with: `openssl rand -base64 32`

- **`REDIS_URL`** - Redis connection URL (if using Redis for sessions/caching)
  - Format: `redis://user:password@host:port`
  - Example: `redis://:password@redis.example.com:6379`

#### Error Tracking (Optional)

- **`SENTRY_DSN`** - Sentry error tracking DSN
  - Get from: Sentry project settings
  - Used for: Production error monitoring
  - Impact if missing: No error tracking (non-blocking)

## How to Add Secrets

### Via GitHub Web Interface

1. Go to your repository on GitHub
2. Click **Settings** > **Secrets and variables** > **Actions**
3. Click **New repository secret**
4. Enter the secret name (exactly as shown above)
5. Paste the secret value
6. Click **Add secret**

### Via GitHub CLI

```bash
# Install GitHub CLI if needed
# https://cli.github.com/

# Add a secret
gh secret set SNYK_TOKEN --body "your-token-here"

# Add a secret from file
gh secret set DATABASE_URL < database-url.txt

# Add a secret interactively (paste value when prompted)
gh secret set JWT_SECRET
```

## Generating Secure Secrets

### For JWT and Session Secrets

```bash
# Generate 32-byte (256-bit) secret
openssl rand -base64 32

# Generate 64-byte (512-bit) secret for extra security
openssl rand -base64 64

# Generate hex-encoded secret
openssl rand -hex 32
```

### For Development/Testing

For local development, create a `.env` file in the backend directory:

```bash
# backend/.env (DO NOT COMMIT THIS FILE)
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=comptia_network_dev
DB_USER=postgres
DB_PASSWORD=local_dev_password
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
```

**IMPORTANT**: Never commit `.env` files to the repository. Ensure `.env` is in your `.gitignore`.

## Secret Validation

The CI/CD pipeline will:

- ✅ Continue without optional secrets (Snyk, Codecov, Sentry)
- ✅ Use `GITHUB_TOKEN` automatically (no setup needed)
- ❌ Fail deployment if required production secrets are missing

## Security Best Practices

1. **Rotate secrets regularly** - Especially JWT and session secrets
2. **Use different secrets for each environment** - Dev, staging, production
3. **Never log secret values** - Even in debug mode
4. **Use least privilege** - Only grant necessary permissions to tokens
5. **Monitor secret usage** - Check GitHub Actions logs for unauthorized access attempts
6. **Revoke compromised secrets immediately** - And update all affected systems

## Troubleshooting

### Workflow fails with "Secret not found"

- Check secret name matches exactly (case-sensitive)
- Verify secret exists in repository settings
- Ensure you're looking at the correct repository (not a fork)

### Security scan steps are skipped

- This is expected if `SNYK_TOKEN` is not set
- Security scans are non-blocking and optional

### Coverage upload fails

- Non-blocking - workflow will continue
- Add `CODECOV_TOKEN` if you want coverage tracking

### Backend deployment fails

- Check all production secrets are set: `DATABASE_URL`, `JWT_SECRET`, etc.
- Verify connection strings are correct
- Test database connectivity from GitHub Actions runner

## References

- [GitHub Actions - Encrypted Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Snyk API Token](https://docs.snyk.io/snyk-api-info/authentication-for-api)
- [Codecov Tokens](https://docs.codecov.com/docs/quick-start#step-2-add-the-codecov-token-to-your-ci-environment)
- [Sentry DSN](https://docs.sentry.io/product/sentry-basics/dsn-explainer/)
