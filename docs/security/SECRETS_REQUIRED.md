# Required Environment Variables

This document lists all environment variables required for the CompTIA Network+ Learning Platform.

## Secret Generation

Generate secure secrets using:

```bash
# For 32-character secrets (256-bit)
openssl rand -base64 32

# For 64-character secrets (512-bit)
openssl rand -base64 64

# UUID format
node -e "console.log(require('crypto').randomUUID())"
```

## Backend Environment Variables

### Required for All Environments

#### Database Configuration

- `DATABASE_URL` - PostgreSQL connection string
  - Format: `postgresql://[user]:[password]@[host]:[port]/[database]`
  - Example: `postgresql://comptia_user:SecurePass123@localhost:5432/comptia_network_plus`

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_NAME` - Database name
- `DB_USER` - Database username
- `DB_PASSWORD` - Database password (REQUIRED: Strong password, min 16 characters)

#### JWT Authentication

- `JWT_SECRET` - JWT access token signing secret
  - **CRITICAL**: Min 32 characters, generate with `openssl rand -base64 32`
  - Must be unique per environment
  - NEVER reuse across environments

- `REFRESH_TOKEN_SECRET` - JWT refresh token signing secret
  - **CRITICAL**: Min 32 characters, must be different from JWT_SECRET
  - Generate with `openssl rand -base64 32`

#### Session Management

- `SESSION_SECRET` - Session encryption secret
  - **CRITICAL**: Min 32 characters, recommended 64 characters
  - Generate with `openssl rand -base64 64`

#### CORS Configuration

- `CORS_ORIGIN` - Allowed frontend origin
  - Development: `http://localhost:3000`
  - Production: `https://yourdomain.com`

### Required for Production Only

#### Security Enhancements

- `COOKIE_SECRET` - Cookie signing secret (min 32 chars)
- `CSRF_SECRET` - CSRF token secret (min 64 chars)
- `ENCRYPTION_KEY` - Data encryption key (min 64 chars)

#### Email Service (Choose One)

**Option 1: SendGrid**

- `SENDGRID_API_KEY` - SendGrid API key
- `FROM_EMAIL` - Sender email address
- `FROM_NAME` - Sender name

**Option 2: SMTP**

- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP port (typically 587 or 465)
- `SMTP_SECURE` - Use TLS (true/false)
- `SMTP_USER` - SMTP username
- `SMTP_PASSWORD` - SMTP password

#### Redis (Optional - Session Storage)

- `REDIS_URL` - Redis connection URL
  - Format: `redis://[host]:[port]`
  - TLS Format: `rediss://[host]:[port]`
- `REDIS_PASSWORD` - Redis password (if required)
- `REDIS_TLS` - Enable TLS (true/false)

### Optional Features

#### Monitoring & Error Tracking

- `SENTRY_DSN` - Sentry error tracking DSN
  - Get from: https://sentry.io
  - Example: `https://abc123@o123456.ingest.sentry.io/7890123`

- `SENTRY_ENVIRONMENT` - Environment name (development/staging/production)
- `SENTRY_TRACES_SAMPLE_RATE` - Performance monitoring sample rate (0.0 to 1.0)

#### Analytics

- `GOOGLE_ANALYTICS_ID` - Google Analytics tracking ID
  - Format: `G-XXXXXXXXXX` or `UA-XXXXXXXXX-X`

#### Cloud Storage (AWS S3)

- `AWS_REGION` - AWS region (e.g., us-east-1)
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `S3_BUCKET_NAME` - S3 bucket name
- `CLOUDFRONT_DOMAIN` - CloudFront CDN domain (optional)

#### Logging

- `LOG_LEVEL` - Logging verbosity
  - Options: `error`, `warn`, `info`, `debug`, `trace`
  - Development: `debug`
  - Production: `info` or `warn`

- `LOG_TO_FILE` - Enable file logging (true/false)
- `LOG_FILE_PATH` - Log file path (production)

## Frontend Environment Variables

### Required for All Environments

- `VITE_API_URL` - Backend API URL
  - Development: `http://localhost:3001/api`
  - Production: `https://api.yourdomain.com/api`

### Optional Features

- `VITE_USE_MOCK_API` - Use mock API instead of backend
  - Set to `true` for static deployments
  - Set to `false` when backend is available

- `VITE_SENTRY_DSN` - Sentry error tracking (frontend)
- `VITE_ANALYTICS_ID` - Google Analytics ID (frontend)

## Security Checklist

Before deploying to production, verify:

- [ ] All secrets generated with `openssl rand -base64` (min 32 chars)
- [ ] JWT_SECRET and REFRESH_TOKEN_SECRET are different
- [ ] SESSION_SECRET is at least 64 characters
- [ ] No placeholder values like `[GENERATED]` or `your-password-here`
- [ ] NODE_ENV set to `production`
- [ ] CORS_ORIGIN set to production domain
- [ ] HTTPS enabled (COOKIE_SECURE=true)
- [ ] Database uses strong password (min 16 chars, mixed case, numbers, symbols)
- [ ] Rate limiting configured appropriately
- [ ] Email service configured and tested
- [ ] Error tracking (Sentry) configured
- [ ] Backups configured and tested
- [ ] Secrets stored in secure vault (not in code)

## Environment-Specific Notes

### Development

- Can use weaker secrets for local testing
- Mock API can be enabled
- Verbose logging recommended
- Email can be disabled or use MailHog/MailCatcher

### Staging

- Should mirror production configuration
- Use separate database and secrets
- More verbose logging for debugging
- Can relax some security for testing

### Production

- **CRITICAL**: All secrets must be production-grade
- Enable all security features
- Minimal logging (info level)
- Enable monitoring and alerting
- Use managed database with automated backups
- Consider Redis for session storage at scale

## Secret Rotation

Secrets should be rotated periodically:

- **JWT Secrets**: Every 90 days or on suspected compromise
- **Database Passwords**: Every 90 days
- **API Keys**: Every 180 days or per provider recommendation
- **Session Secrets**: Every 180 days

## Incident Response

If credentials are compromised:

1. Immediately rotate all affected secrets
2. Revoke any exposed API keys
3. Check access logs for unauthorized access
4. Notify affected users if user data exposed
5. Update all deployment environments
6. Review and improve secret management practices

## Additional Resources

- [OWASP Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [12-Factor App Configuration](https://12factor.net/config)
