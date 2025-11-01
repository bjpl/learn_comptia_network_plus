# Quick Start: Production Deployment

**CompTIA Network+ Learning Platform**

This is your express guide to deploying to production. For detailed information, refer to the comprehensive guides.

---

## Prerequisites (5 minutes)

```bash
# Verify you have:
node --version  # 18.x+
npm --version   # 9.x+
git --version   # Any recent version

# Install required CLIs
npm i -g @railway/cli  # or vercel, etc.
npm i -g @github/cli   # for GitHub Secrets
```

---

## Step 1: Generate Secrets (2 minutes)

```bash
cd backend/scripts
./generate-secrets.sh > secrets-$(date +%Y%m%d).txt
cat secrets-$(date +%Y%m%d).txt
```

**Save these secrets immediately to your password manager!**

---

## Step 2: Configure Environment (5 minutes)

```bash
# Copy template
cp backend/.env.production.template backend/.env.production

# Edit and replace ALL [GENERATED] values with secrets from Step 1
nano backend/.env.production

# Verify (should show all checkmarks)
./backend/scripts/verify-secrets.sh
```

---

## Step 3: GitHub Secrets (3 minutes)

```bash
# Login to GitHub
gh auth login

# Set secrets (paste when prompted)
gh secret set JWT_SECRET
gh secret set REFRESH_TOKEN_SECRET
gh secret set DATABASE_URL
gh secret set SESSION_SECRET
gh secret set COOKIE_SECRET
gh secret set ENCRYPTION_KEY
gh secret set CSRF_SECRET
```

**Or bulk import:**
```bash
# Create temp file
cat > /tmp/secrets.env <<EOF
JWT_SECRET=your_value
REFRESH_TOKEN_SECRET=your_value
DATABASE_URL=your_value
# ... etc
EOF

# Import all
while IFS='=' read -r key value; do
    echo "$value" | gh secret set "$key"
done < /tmp/secrets.env

# Securely delete
shred -vfz -n 10 /tmp/secrets.env
```

---

## Step 4: Deploy to Railway (10 minutes)

```bash
# Login
railway login

# Create project (or link existing)
railway init

# Add PostgreSQL
railway add postgresql

# Set environment variables from file
railway variables set < backend/.env.production

# Deploy
railway up

# Watch logs
railway logs
```

---

## Step 5: Configure Domain (5 minutes)

**In Railway Dashboard:**
1. Settings → Domains → Custom Domain
2. Enter: api.yourdomain.com
3. Add CNAME to your DNS:
   - Type: CNAME
   - Name: api
   - Value: [railway-provided].railway.app

**Wait 5-60 minutes for DNS propagation**

---

## Step 6: Verify Deployment (5 minutes)

```bash
# Wait for deployment to finish, then test:

# Health check
curl https://api.yourdomain.com/health

# Expected: {"status":"ok","database":"connected","timestamp":"..."}

# If that works, test registration
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "username": "testuser"
  }'

# Expected: {"success":true,"user":{...},"token":"..."}
```

---

## Step 7: Complete Checklist (30 minutes)

Open and complete: `docs/PRE_PRODUCTION_CHECKLIST.md`

**Critical sections:**
- [ ] Secrets & Configuration (should be done)
- [ ] Security Hardening
- [ ] Database Security
- [ ] Monitoring & Logging

**Get sign-offs from:**
- Backend Developer
- DevOps Engineer
- Security Lead

---

## Step 8: Monitor (2 hours)

```bash
# Watch logs continuously
railway logs --follow

# Check every 15 minutes:
# - Error rates (should be near 0%)
# - Response times (should be < 200ms)
# - Database connections (should be stable)
```

---

## Common Issues

### "Cannot connect to database"

```bash
# Check DATABASE_URL is set
railway variables | grep DATABASE_URL

# Test connection
railway run psql $DATABASE_URL -c "SELECT 1;"
```

### "Invalid JWT secret"

```bash
# Verify JWT_SECRET is set correctly
railway variables | grep JWT_SECRET

# Should be 32+ characters
# If not, regenerate and update
```

### "CORS error"

```bash
# Check CORS_ORIGIN matches your frontend URL
railway variables | grep CORS_ORIGIN

# Should be: https://yourdomain.com (no trailing slash)
```

### "502 Bad Gateway"

```bash
# Check application is running
railway logs | tail -20

# Check PORT is set correctly
railway variables | grep PORT

# Railway automatically sets PORT, don't override
```

---

## Emergency Rollback

```bash
# Rollback to previous deployment
railway rollback

# Or redeploy specific version
git checkout production
git reset --hard <good-commit-hash>
git push --force
```

---

## Post-Deployment Checklist

**Immediate (First 2 hours):**
- [ ] Health check returns 200 OK
- [ ] Can register new user
- [ ] Can login
- [ ] No errors in logs
- [ ] Response times acceptable

**Next 24 hours:**
- [ ] Monitor error rates
- [ ] Check database performance
- [ ] Verify backups running
- [ ] Test all critical user flows

**Next 7 days:**
- [ ] Review all monitoring dashboards
- [ ] Analyze user feedback
- [ ] Optimize slow queries
- [ ] Document any issues

---

## Quick Reference Commands

```bash
# Generate secrets
./backend/scripts/generate-secrets.sh > secrets.txt

# Verify secrets
./backend/scripts/verify-secrets.sh

# Rotate secret
./backend/scripts/rotate-secrets.sh

# Deploy to Railway
railway up

# View logs
railway logs

# View variables
railway variables

# Set variable
railway variables set KEY=value

# Rollback
railway rollback

# Database backup
railway run pg_dump $DATABASE_URL > backup.sql

# Database restore
railway run psql $DATABASE_URL < backup.sql
```

---

## Need Help?

**Quick fixes:**
- Check `docs/SECRETS_USAGE_GUIDE.md` - Step-by-step guide
- Check `docs/DEPLOYMENT_GUIDE.md` - Platform-specific details
- Check `docs/SECRETS_MANAGEMENT.md` - Troubleshooting

**Emergency:**
- Run: `./backend/scripts/verify-secrets.sh`
- Check: `railway logs --filter error`
- Review: `docs/PRE_PRODUCTION_CHECKLIST.md`

**Team support:**
- DevOps team for infrastructure issues
- Backend team for application issues
- Security team for secret compromises

---

## Success Indicators

**You're ready to go live when:**
- [ ] All secrets generated and verified
- [ ] Health endpoint returns 200 OK
- [ ] All critical APIs working
- [ ] No errors in logs
- [ ] Response times < 200ms
- [ ] Database connected and backed up
- [ ] SSL certificate valid
- [ ] DNS configured correctly
- [ ] Monitoring configured
- [ ] Team trained on procedures

---

## Total Time: ~45 minutes to production

**Breakdown:**
- Prerequisites: 5 min
- Generate secrets: 2 min
- Configure environment: 5 min
- GitHub secrets: 3 min
- Deploy to Railway: 10 min
- Configure domain: 5 min
- Verify deployment: 5 min
- Complete critical checklist items: 30 min
- **Monitor: 2 hours (required)**

---

**Quick Start Version:** 1.0
**Last Updated:** 2024-01-15
**For Detailed Guide:** See `SECRETS_USAGE_GUIDE.md`
