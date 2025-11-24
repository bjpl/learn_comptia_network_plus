# Deployment Guide: Vercel + Railway

**Recommended for:** Quick deployment, MVP, small to medium traffic, beginners

**Estimated Time:** 15-30 minutes
**Cost:** $5-15/month (free tier available)
**Difficulty:** Easy ⭐

## Overview

This guide deploys:

- **Frontend** → Vercel (React SPA with CDN)
- **Backend + Database** → Railway (Node.js API + PostgreSQL)

### Why This Stack?

**Pros:**

- Fastest deployment method
- Automatic SSL certificates
- Zero-config deployments
- Git-based auto-deployments
- Global CDN included
- Free tier available
- Excellent documentation

**Cons:**

- More expensive at scale ($50+/month for high traffic)
- Limited backend customization
- Platform vendor lock-in
- Limited control over infrastructure

## Prerequisites

- Git repository (GitHub, GitLab, or Bitbucket)
- Credit card (for Railway, free tier available)
- Domain name (optional)

## Part 1: Railway Setup (Backend + Database)

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project"
3. Sign in with GitHub
4. Grant repository access

### Step 2: Deploy PostgreSQL Database

1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Wait for database to initialize (1-2 minutes)
4. Click on PostgreSQL service
5. Go to "Variables" tab
6. Copy the `DATABASE_URL` (format: `postgresql://user:pass@host:port/db`)

**Note the connection details:**

```
DATABASE_URL=postgresql://postgres:xxxxx@containers-us-west-1.railway.app:5432/railway
```

### Step 3: Deploy Backend Application

**Option A: Deploy from GitHub (Recommended)**

1. In Railway dashboard, click "New Service"
2. Select "GitHub Repo"
3. Choose your repository
4. Set **Root Directory**: `backend`
5. Railway auto-detects Node.js

**Option B: Deploy from CLI**

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
cd backend
railway link

# Deploy
railway up
```

### Step 4: Configure Environment Variables

In Railway backend service → Variables tab, add:

```env
NODE_ENV=production
PORT=3001

# Database (use Railway's DATABASE_URL)
DATABASE_URL=${{Postgres.DATABASE_URL}}
DB_SSL=true

# Generate these secrets (see below)
JWT_SECRET=your-generated-secret-here
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_SECRET=your-generated-refresh-secret
SESSION_SECRET=your-generated-session-secret

# CORS (will update after Vercel deployment)
CORS_ORIGIN=https://your-app.vercel.app
CORS_CREDENTIALS=true

# Rate Limiting
API_RATE_LIMIT=100
API_RATE_WINDOW=15

# Logging
LOG_LEVEL=info

# Security
BCRYPT_ROUNDS=12
```

**Generate secrets:**

```bash
# Run this locally
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
node -e "console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
```

### Step 5: Run Database Migrations

**Option A: Using Railway CLI**

```bash
# Connect to Railway
railway link

# Run migrations
railway run npm run migrate

# Or run seed data (optional)
railway run npm run seed
```

**Option B: Using Railway Shell**

1. In Railway dashboard → Backend service
2. Click "Shell" tab
3. Run commands:

```bash
npm run migrate
npm run seed  # optional
```

### Step 6: Get Backend URL

1. Go to Railway backend service
2. Click "Settings" tab
3. Under "Domains", click "Generate Domain"
4. Copy the URL (e.g., `backend-production-xxxx.railway.app`)
5. Note this URL for Vercel configuration

**Test backend:**

```bash
curl https://backend-production-xxxx.railway.app/health

# Expected response:
# {"status":"ok","timestamp":"...","uptime":123}
```

## Part 2: Vercel Setup (Frontend)

### Step 1: Create Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Grant repository access

### Step 2: Import Project

1. Click "Add New" → "Project"
2. Import your Git repository
3. Vercel auto-detects Vite configuration

### Step 3: Configure Build Settings

**Framework Preset:** Vite
**Root Directory:** `./` (project root)
**Build Command:** `npm run build`
**Output Directory:** `dist`
**Install Command:** `npm install`

### Step 4: Add Environment Variables

In Vercel project settings → Environment Variables:

```env
VITE_API_URL=https://backend-production-xxxx.railway.app
VITE_USE_MOCK_API=false
VITE_ENV=production
```

Replace `backend-production-xxxx.railway.app` with your Railway backend URL from Part 1, Step 6.

### Step 5: Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Copy deployment URL (e.g., `your-app.vercel.app`)

### Step 6: Update CORS in Railway

1. Go back to Railway → Backend service
2. Update environment variable:

```env
CORS_ORIGIN=https://your-app.vercel.app
```

3. Railway auto-redeploys (1-2 minutes)

### Step 7: Test Application

1. Visit `https://your-app.vercel.app`
2. Create test account
3. Login
4. Navigate through application

## Part 3: Custom Domain (Optional)

### Add Domain to Vercel

1. Go to Vercel project → Settings → Domains
2. Add your domain: `yourdomain.com`
3. Add `www.yourdomain.com` (optional)

### Configure DNS

Add these records at your DNS provider:

**Option A: Using Vercel DNS (Recommended)**

```
A     @      76.76.21.21
CNAME www    cname.vercel-dns.com
```

**Option B: Using Cloudflare**

```
CNAME @      cname.vercel-dns.com
CNAME www    cname.vercel-dns.com
```

### Update Backend CORS

In Railway backend environment variables:

```env
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com
```

### SSL Certificate

Vercel automatically provisions SSL certificates (1-2 minutes).

## Part 4: Database Backups

Railway provides automatic backups, but set up additional backups:

### Option 1: Railway CLI Backup

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link
railway login
railway link

# Create backup script
cat > backup-railway.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y-%m-%d-%H%M%S)
railway run pg_dump -Fc > "backups/railway-backup-$DATE.dump"
echo "Backup created: railway-backup-$DATE.dump"
EOF

chmod +x backup-railway.sh

# Run backup
./backup-railway.sh
```

### Option 2: Scheduled GitHub Action

Create `.github/workflows/backup-db.yml`:

```yaml
name: Database Backup

on:
  schedule:
    - cron: '0 2 * * *' # Daily at 2 AM UTC
  workflow_dispatch: # Manual trigger

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Install Railway CLI
        run: npm install -g @railway/cli

      - name: Backup Database
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
        run: |
          railway run pg_dump -Fc > backup.dump

      - name: Upload to S3
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
        run: |
          aws s3 cp backup.dump s3://your-bucket/backups/$(date +%Y-%m-%d).dump
```

## Part 5: Monitoring

### Railway Monitoring

1. Railway dashboard → Backend service
2. Click "Metrics" tab
3. View CPU, Memory, Network usage

### Vercel Analytics (Optional)

1. Vercel project → Analytics tab
2. Enable "Web Analytics" (free tier: 100k events/month)
3. Add to frontend:

```bash
npm install @vercel/analytics
```

```typescript
// src/main.tsx
import { Analytics } from '@vercel/analytics/react';

<App />
<Analytics />
```

### External Monitoring

**Uptime monitoring:**

1. Sign up at [uptimerobot.com](https://uptimerobot.com) (free)
2. Add monitors:
   - Frontend: `https://your-app.vercel.app`
   - Backend Health: `https://backend-xxx.railway.app/health`

## Part 6: CI/CD Setup

Both Vercel and Railway automatically deploy on git push:

### Git Workflow

```bash
# Make changes
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel: Deploys frontend automatically (2-3 min)
# Railway: Deploys backend automatically (3-5 min)
```

### Preview Deployments

**Vercel:**

- Automatically creates preview for each PR
- Unique URL: `your-app-git-branch-user.vercel.app`

**Railway:**

- Create PR environments:
  1. Railway dashboard → Settings
  2. Enable "PR Environments"
  3. Railway creates temporary environment for each PR

## Troubleshooting

### Backend Deployment Fails

**Check logs:**

1. Railway dashboard → Backend service
2. Click "Deployments" tab
3. Click failed deployment
4. View build logs

**Common issues:**

- Missing build script: Add `"build": "tsc"` to `backend/package.json`
- Wrong root directory: Set to `backend` in Railway settings
- Missing dependencies: Ensure `package.json` is complete

### Database Connection Errors

**Verify DATABASE_URL:**

1. Railway → PostgreSQL service → Variables
2. Copy `DATABASE_URL`
3. Paste into backend environment variables as `${{Postgres.DATABASE_URL}}`

**Enable SSL:**

```env
DB_SSL=true
```

### CORS Errors

**Update backend CORS_ORIGIN:**

```env
# In Railway backend variables
CORS_ORIGIN=https://your-app.vercel.app,https://yourdomain.com
```

**Verify in backend logs:**

```bash
railway logs
# Look for CORS errors
```

### Frontend Build Fails

**Check Vercel build logs:**

1. Vercel dashboard → Project → Deployments
2. Click failed deployment
3. View build logs

**Common issues:**

- Missing environment variables: Check `VITE_API_URL`
- TypeScript errors: Run `npm run typecheck` locally
- Dependency issues: Delete `node_modules` and `package-lock.json`, reinstall

### Slow Performance

**Enable Railway's caching:**

1. Add Redis to Railway:
   - New Service → Provision Redis
   - Copy `REDIS_URL`
   - Add to backend variables

**Enable Vercel Edge caching:**

```typescript
// Add to vite.config.ts
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
        },
      },
    },
  },
};
```

## Cost Optimization

### Railway Pricing

**Hobby Plan (Default):**

- $5/month credit (500 hours)
- Postgres: $5-10/month
- Backend: $0-5/month (depends on usage)

**Pro Plan:**

- $20/month credit (1000 hours)
- Better performance
- Priority support

**Optimize costs:**

```bash
# Railway dashboard → Settings → Sleep Mode
# Enable "Sleep after 1 hour of inactivity" (not recommended for production)

# Better: Optimize resource usage
# Set resource limits in railway.json:
{
  "deploy": {
    "numReplicas": 1,
    "restartPolicyType": "ON_FAILURE",
    "healthcheckPath": "/health"
  }
}
```

### Vercel Pricing

**Hobby Plan (Free):**

- 100GB bandwidth/month
- 100 deployments/day
- Suitable for low-medium traffic

**Pro Plan ($20/month):**

- 1TB bandwidth
- Unlimited deployments
- Better performance
- Analytics included

**Upgrade triggers:**

- > 100GB bandwidth/month
- > 100 deployments/day
- Need commercial license

## Scaling

### Scale Backend (Railway)

**Horizontal scaling:**

1. Railway → Backend service → Settings
2. Increase "Replicas" (Pro plan required)

**Vertical scaling:**

1. Railway auto-scales based on usage
2. Upgrade to Pro plan for more resources

### Scale Database (Railway)

**Railway Postgres limitations:**

- Single instance (no replicas)
- Max 8GB RAM, 32GB storage on Hobby
- Max 32GB RAM, 256GB storage on Pro

**For larger scale, migrate to:**

- Railway Pro with larger instance
- External managed database (AWS RDS, DigitalOcean Managed Postgres)

### Scale Frontend (Vercel)

Vercel auto-scales globally. No configuration needed.

## Security Best Practices

1. **Enable environment variable encryption** (enabled by default)
2. **Use Railway's variable references** for database connection
3. **Rotate secrets regularly:**

   ```bash
   # Generate new secrets
   node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

   # Update in Railway and Vercel
   ```

4. **Enable Vercel's security headers:**
   ```javascript
   // vercel.json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           { "key": "X-Frame-Options", "value": "DENY" },
           { "key": "X-Content-Type-Options", "value": "nosniff" },
           { "key": "X-XSS-Protection", "value": "1; mode=block" }
         ]
       }
     ]
   }
   ```

## Next Steps

1. Set up monitoring (Uptime Robot)
2. Configure custom domain
3. Enable analytics (Vercel Analytics)
4. Set up database backups
5. Add error tracking (Sentry)
6. Configure CI/CD for testing
7. Set up staging environment

## Additional Resources

- [Railway Documentation](https://docs.railway.app)
- [Vercel Documentation](https://vercel.com/docs)
- [Railway CLI Reference](https://docs.railway.app/develop/cli)
- [Vercel CLI Reference](https://vercel.com/docs/cli)

---

**Deployment Status:** Production Ready ✅
**Last Updated:** 2025-10-29
