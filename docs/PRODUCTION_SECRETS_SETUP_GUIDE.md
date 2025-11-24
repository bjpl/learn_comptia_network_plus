# Production Secrets Setup Guide

**Step-by-Step Instructions for Securing Your Application**

---

## 📋 Overview

You need to generate **3 critical secrets** for production:

1. **JWT_SECRET** - Encrypts access tokens
2. **REFRESH_TOKEN_SECRET** - Encrypts refresh tokens (MUST be different from JWT_SECRET)
3. **SESSION_SECRET** - Signs session cookies

Plus configure: 4. **DB_PASSWORD** - Your database password 5. **CORS_ORIGIN** - Your production frontend URL 6. **NODE_ENV** - Set to "production"

---

## 🔧 STEP 1: Generate Your Secrets Locally

### On Your Computer (Windows WSL / Linux / Mac):

Open your terminal and run these commands **one at a time**:

```bash
# Generate JWT_SECRET
echo "JWT_SECRET=$(openssl rand -base64 32)"

# Generate REFRESH_TOKEN_SECRET
echo "REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)"

# Generate SESSION_SECRET
echo "SESSION_SECRET=$(openssl rand -base64 32)"
```

### Example Output:

```
JWT_SECRET=X7k9mN2pQ5rT8vW1yZ4aC6eH9jL0oP3s
REFRESH_TOKEN_SECRET=B5nM8qT1wY4zC7fJ0lP3sV6xA9dG2hK5
SESSION_SECRET=E8rY1uI4oP7aS0dF3gH6jK9lZ2xC5vB8n
```

**⚠️ CRITICAL:** Save these somewhere secure! You'll need them in the next step.

**DO NOT:**

- ❌ Use the example values above
- ❌ Reuse secrets between JWT_SECRET and REFRESH_TOKEN_SECRET
- ❌ Commit these to git
- ❌ Share them publicly

**DO:**

- ✅ Save them in a password manager (1Password, LastPass, etc.)
- ✅ Generate new ones for each environment (staging, production)
- ✅ Keep them secret and secure

---

## 📝 STEP 2: Where to Put Your Secrets

### Option A: Using Vercel (Recommended for Frontend + Backend)

1. **Go to your Vercel Dashboard:**
   - Navigate to: https://vercel.com/dashboard
   - Select your project

2. **Add Environment Variables:**
   - Click "Settings" → "Environment Variables"
   - Add each variable:

   ```
   Name: JWT_SECRET
   Value: [paste your generated JWT_SECRET]
   Environment: Production
   ```

   ```
   Name: REFRESH_TOKEN_SECRET
   Value: [paste your generated REFRESH_TOKEN_SECRET]
   Environment: Production
   ```

   ```
   Name: SESSION_SECRET
   Value: [paste your generated SESSION_SECRET]
   Environment: Production
   ```

   ```
   Name: DB_PASSWORD
   Value: [your database password]
   Environment: Production
   ```

   ```
   Name: NODE_ENV
   Value: production
   Environment: Production
   ```

   ```
   Name: CORS_ORIGIN
   Value: https://your-domain.vercel.app
   Environment: Production
   ```

3. **Redeploy:**
   - After adding all variables, trigger a new deployment

---

### Option B: Using Railway

1. **Open Railway Dashboard:**
   - Go to: https://railway.app/dashboard
   - Select your project

2. **Add Variables:**
   - Click on your service → "Variables" tab
   - Click "New Variable" for each:

   ```
   JWT_SECRET=[your generated value]
   REFRESH_TOKEN_SECRET=[your generated value]
   SESSION_SECRET=[your generated value]
   DB_PASSWORD=[your database password]
   NODE_ENV=production
   CORS_ORIGIN=https://your-domain.up.railway.app
   ```

3. **Deploy:**
   - Railway will automatically redeploy

---

### Option C: Using AWS / DigitalOcean / VPS

Create a `.env.production` file **ONLY on your server** (never commit to git):

```bash
# SSH into your server
ssh user@your-server-ip

# Navigate to your app directory
cd /path/to/your/app/backend

# Create .env.production file
nano .env.production
```

Paste this content (replace with YOUR generated values):

```bash
# =================================
# PRODUCTION ENVIRONMENT VARIABLES
# =================================

NODE_ENV=production
PORT=3001

# Database
DB_HOST=your-database-host.com
DB_PORT=5432
DB_NAME=comptia_network_prod
DB_USER=your_db_user
DB_PASSWORD=YOUR_STRONG_DB_PASSWORD_HERE

# JWT Secrets (USE YOUR GENERATED VALUES!)
JWT_SECRET=YOUR_GENERATED_JWT_SECRET_HERE
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=YOUR_GENERATED_REFRESH_TOKEN_SECRET_HERE
REFRESH_TOKEN_EXPIRES_IN=7d

# Session
SESSION_SECRET=YOUR_GENERATED_SESSION_SECRET_HERE

# CORS
CORS_ORIGIN=https://your-production-domain.com

# Logging
LOG_LEVEL=info
LOG_DIR=/var/log/comptia-network
```

Save the file:

- Press `Ctrl+X`
- Press `Y` to confirm
- Press `Enter` to save

**Secure the file permissions:**

```bash
chmod 600 .env.production
```

---

### Option D: Using Docker / Docker Compose

Edit your `docker-compose.yml` or create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    environment:
      NODE_ENV: production
      PORT: 3001
      # Database
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: comptia_network_prod
      DB_USER: postgres
      DB_PASSWORD: ${DB_PASSWORD} # Set in .env file
      # JWT Secrets
      JWT_SECRET: ${JWT_SECRET}
      REFRESH_TOKEN_SECRET: ${REFRESH_TOKEN_SECRET}
      SESSION_SECRET: ${SESSION_SECRET}
      # CORS
      CORS_ORIGIN: https://your-domain.com
    env_file:
      - .env.production.secrets # Create this file
```

Create `.env.production.secrets` (gitignored):

```bash
DB_PASSWORD=your_db_password
JWT_SECRET=your_generated_jwt_secret
REFRESH_TOKEN_SECRET=your_generated_refresh_token_secret
SESSION_SECRET=your_generated_session_secret
```

---

## ✅ STEP 3: Verify Your Configuration

### Test That Secrets Are Set:

**For Vercel/Railway:**

- Check the "Environment Variables" section in your dashboard
- Ensure all 6 variables are present

**For VPS/Docker:**

```bash
# SSH into your server
ssh user@your-server

# Check that .env.production exists
ls -la backend/.env.production

# Verify it has correct permissions (should show -rw-------)
ls -l backend/.env.production

# OPTIONAL: Verify secrets are loaded (DO NOT share output!)
cd backend
node -e "require('dotenv').config({path: '.env.production'}); console.log('JWT_SECRET length:', process.env.JWT_SECRET?.length || 0)"
```

Expected output: `JWT_SECRET length: 44` (or similar - base64 encoded 32 bytes)

---

## 🧪 STEP 4: Test Your Application

### Start your backend in production mode:

**Local test:**

```bash
cd backend
NODE_ENV=production node dist/server.js
```

**You should see:**

```
✅ Database connected successfully
✅ Server is running on port 3001
```

**You should NOT see:**

```
❌ Error: JWT_SECRET environment variable is required
❌ Error: REFRESH_TOKEN_SECRET environment variable is required
❌ Error: DB_PASSWORD environment variable is required
```

If you see errors, your secrets are not configured correctly.

---

## 🔒 Security Checklist

Before going live, verify:

- [ ] **JWT_SECRET is set** and is NOT the default value
- [ ] **REFRESH_TOKEN_SECRET is set** and is DIFFERENT from JWT_SECRET
- [ ] **SESSION_SECRET is set** and is unique
- [ ] **DB_PASSWORD is strong** (20+ characters, mixed case, numbers, symbols)
- [ ] **NODE_ENV=production** is set
- [ ] **CORS_ORIGIN** is set to your actual production domain
- [ ] **Secrets are NOT committed to git** (check with `git log --all --full-history`)
- [ ] **Secrets are stored securely** (password manager or hosting platform's vault)
- [ ] **HTTPS is enabled** on your domain
- [ ] **Database uses SSL** (verify connection string includes `sslmode=require`)

---

## 📍 Quick Reference: What Goes Where

| Secret                 | File Location                             | Used For                            |
| ---------------------- | ----------------------------------------- | ----------------------------------- |
| `JWT_SECRET`           | Environment variable or `.env.production` | Signing access tokens (15min)       |
| `REFRESH_TOKEN_SECRET` | Environment variable or `.env.production` | Signing refresh tokens (7 days)     |
| `SESSION_SECRET`       | Environment variable or `.env.production` | Signing session cookies             |
| `DB_PASSWORD`          | Environment variable or `.env.production` | Database authentication             |
| `NODE_ENV`             | Environment variable or `.env.production` | Enables production optimizations    |
| `CORS_ORIGIN`          | Environment variable or `.env.production` | Restricts API access to your domain |

---

## 🆘 Troubleshooting

### "JWT_SECRET environment variable is required"

**Solution:** Your secret is not set. Go back to Step 2 and configure it.

### "JWT_SECRET and REFRESH_TOKEN_SECRET must be different"

**Solution:** You used the same secret twice. Generate a new REFRESH_TOKEN_SECRET.

### "Database connection failed"

**Solution:** Check your DB_PASSWORD and database host settings.

### "CORS error in browser"

**Solution:** Verify CORS_ORIGIN matches your frontend URL exactly (including https://)

---

## 🔄 Rotating Secrets (Advanced)

If you need to change secrets later:

1. Generate new secrets (same commands as Step 1)
2. Update environment variables in your hosting platform
3. Redeploy your application
4. **All existing tokens will be invalidated** (users will need to log in again)

---

## 📞 Need Help?

If you're stuck:

1. Check the security audit report: `docs/SECURITY_AUDIT_REPORT.md`
2. Verify `.gitignore` includes `.env` and `.env.production`
3. Test locally first before deploying to production
4. Check logs for specific error messages

**Remember:** Never share your actual secrets in issues, chat, or commits!

---

**Setup Complete! 🎉**
Your application is now secured with strong, unique secrets for production.
