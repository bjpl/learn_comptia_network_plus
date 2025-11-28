# Credentials Quick Reference

**Quick guide for developers working with environment variables and secrets.**

## File Safety Status

### SAFE to commit (tracked by git)

- `.env.example` - Template with placeholder values only
- `.env.test` - Test environment (weak credentials by design)
- `.env.*.template` - Templates with placeholders

### NEVER commit (excluded by .gitignore)

- `.env` - Local development secrets
- `.env.local` - Local overrides
- `.env.development` - Development secrets
- `.env.production` - Production secrets
- `.env.staging` - Staging secrets
- Any files matching: `*.pem`, `*.key`, `credentials.json`, `secrets.json`

## Quick Secret Generation

```bash
# Generate 32-character secret (for JWT, cookies, etc.)
openssl rand -base64 32

# Generate 64-character secret (for sessions, encryption)
openssl rand -base64 64

# Generate UUID
node -e "console.log(require('crypto').randomUUID())"
```

## Setup New Environment

1. Copy the example file:

   ```bash
   cp backend/.env.example backend/.env
   ```

2. Generate secrets:

   ```bash
   echo "JWT_SECRET=$(openssl rand -base64 32)" >> backend/.env
   echo "REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)" >> backend/.env
   echo "SESSION_SECRET=$(openssl rand -base64 64)" >> backend/.env
   ```

3. Edit `backend/.env` and fill in:
   - Database credentials
   - CORS origin (frontend URL)
   - Email configuration (if needed)

4. Verify environment:
   ```bash
   cd backend
   npm run validate-env  # If validation script exists
   ```

## Common Issues

### "Missing required environment variable"

**Solution**: Check `backend/.env` file exists and contains all required variables from `.env.example`

### "JWT_SECRET must be at least 32 characters"

**Solution**: Regenerate secret with `openssl rand -base64 32`

### ".env file is tracked by git"

**Solution**:

```bash
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Remove .env from tracking"
```

## Production Deployment

1. **NEVER** copy secrets from development to production
2. Generate unique production secrets
3. Use secret management service (AWS Secrets Manager, etc.)
4. Verify secrets in deployment pipeline, not in code

## Security Checklist

Before deploying:

- [ ] All secrets generated with cryptographically secure random generator
- [ ] No placeholder values like `[GENERATED]` remain
- [ ] JWT_SECRET and REFRESH_TOKEN_SECRET are different
- [ ] Database password is strong (16+ chars, mixed case, numbers, symbols)
- [ ] CORS_ORIGIN matches production frontend domain
- [ ] Environment is set to `production`
- [ ] Secrets are stored in secure vault, not in code

## Emergency: Leaked Credentials

If credentials are accidentally committed:

1. **Immediately** rotate all exposed secrets
2. Remove from git history:
   ```bash
   git filter-branch --force --index-filter \
     'git rm --cached --ignore-unmatch path/to/.env' \
     --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (coordinate with team):
   ```bash
   git push origin --force --all
   ```
4. Notify security team/management
5. Check logs for unauthorized access

## Resources

- Full documentation: `docs/security/SECRETS_REQUIRED.md`
- Security audit: `docs/security/SECURITY_AUDIT_CREDENTIALS.md`
- Production setup: `docs/deployment/PRODUCTION_SECRETS_SETUP_GUIDE.md`
