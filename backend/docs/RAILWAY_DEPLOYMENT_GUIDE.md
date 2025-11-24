# Railway Deployment Guide

**Deploy Your CompTIA Network+ Backend to Railway**

---

## 🚂 Overview

This guide will help you deploy your backend to Railway with PostgreSQL database.

**What You'll Get:**

- ✅ Backend API hosted on Railway
- ✅ PostgreSQL database (managed by Railway)
- ✅ Automatic HTTPS
- ✅ Environment variables securely configured
- ✅ Connected to your GitHub Pages frontend

**Estimated Time:** 15 minutes

---

## 📋 Prerequisites

- ✅ Railway account (you have this!)
- ✅ GitHub repository: `bjpl/learn_comptia_network_plus`
- ✅ Generated secrets (we have these!)

---

## 🚀 STEP 1: Create New Project on Railway

1. **Go to:** https://railway.app/dashboard

2. **Click:** "New Project"

3. **Select:** "Deploy from GitHub repo"

4. **Choose:** `bjpl/learn_comptia_network_plus`

5. **Railway will detect your repository** and start setting up

---

## 🗄️ STEP 2: Add PostgreSQL Database

1. **In your Railway project, click:** "+ New"

2. **Select:** "Database" → "Add PostgreSQL"

3. **Railway will provision a PostgreSQL database** (takes ~30 seconds)

4. **Once created, click on the PostgreSQL service**

5. **Go to "Variables" tab** - you'll see connection details:
   - `DATABASE_URL` - This is auto-generated
   - `PGHOST`
   - `PGPORT`
   - `PGUSER`
   - `PGPASSWORD`
   - `PGDATABASE`

6. **Copy these values** - you'll need them in Step 3

---

## ⚙️ STEP 3: Configure Backend Service

### A. Set Root Directory

1. **Click on your backend service** (the one connected to GitHub)

2. **Go to "Settings" tab**

3. **Scroll to "Service Settings"**

4. **Set Root Directory:** `backend`

5. **Click "Update"**

### B. Add Environment Variables

1. **Go to "Variables" tab** in your backend service

2. **Click "New Variable"** and add **ALL** of these:

```bash
# Node Environment
NODE_ENV=production
PORT=3001

# Database (Railway provides these - use the "Reference" feature)
# Click "+ New Variable" → "Add Reference" → Select PostgreSQL → DATABASE_URL
# Or manually copy from PostgreSQL service Variables tab

# Your Generated Secrets (from backend/.secrets.txt)
JWT_SECRET=wbxwMztxj35aJ9vvQ87AELgwavm4j9COqPVir4RFhTA=
REFRESH_TOKEN_SECRET=QFnIRXCi9D3qCz+MsswqUyKoaL0ttsgkcv6Rh4UEEg8=
SESSION_SECRET=ZXrpMfsvGSlZYrrrm0qaJJ0n5PIZWodkuXJkY5dWDP0=

# CORS - Allow your GitHub Pages frontend
CORS_ORIGIN=https://bjpl.github.io

# Database Connection (Reference from PostgreSQL service)
# Use the format: postgresql://user:password@host:port/database
# Railway will auto-fill these from the database service
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_NAME=${PGDATABASE}
DB_USER=${PGUSER}
DB_PASSWORD=${PGPASSWORD}

# Optional - Logging
LOG_LEVEL=info
```

### **IMPORTANT: Database Variables**

Railway has a cool feature - you can **reference variables from other services**:

1. For `DB_HOST`, `DB_PORT`, etc., click "+ New Variable"
2. Choose "Add Reference"
3. Select your PostgreSQL service
4. Pick the corresponding variable (PGHOST, PGPORT, etc.)

This automatically syncs them!

**OR** just use the `DATABASE_URL` that Railway provides:

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### C. Configure Build Settings

Railway should auto-detect these, but verify:

1. **Build Command:** `npm install && npm run build`
2. **Start Command:** `npm start`

If not set, add them in Settings → Deploy.

---

## 🔧 STEP 4: Add Health Check Endpoint

Railway uses health checks to ensure your service is running. Add this to your backend:

**File:** `backend/src/routes/index.ts`

Add this route (if not already present):

```typescript
// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});
```

---

## 🚀 STEP 5: Deploy!

1. **Railway will automatically deploy** when you push to GitHub

2. **Manual Deploy (first time):**
   - Click "Deployments" tab
   - Click "Deploy"
   - Watch the build logs

3. **Monitor the deployment:**
   - You'll see build logs in real-time
   - Look for: "✅ Build successful"
   - Then: "✅ Deployment successful"

4. **Get your backend URL:**
   - Go to "Settings" tab
   - Under "Domains", click "Generate Domain"
   - Railway will give you a URL like: `https://comptia-network-backend.up.railway.app`
   - **Copy this URL!**

---

## 🔗 STEP 6: Connect Frontend to Backend

Now update your GitHub Pages frontend to use the Railway backend:

### A. Update Environment Variables

**File:** `.env` (in project root)

```bash
# Update these values:
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_USE_MOCK_API=false
VITE_ENV=production
```

**Replace** `https://your-backend.up.railway.app` with your actual Railway URL!

### B. Update CORS in Backend

Make sure your Railway backend allows your GitHub Pages frontend:

**Backend Environment Variable on Railway:**

```bash
CORS_ORIGIN=https://bjpl.github.io
```

Already added in Step 3! ✅

### C. Redeploy Frontend

```bash
# Build and deploy to GitHub Pages
npm run deploy
```

---

## ✅ STEP 7: Test Your Deployment

### A. Test Backend Health Check

Open in browser:

```
https://your-backend.up.railway.app/api/health
```

**Expected Response:**

```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2025-11-14T...",
  "environment": "production"
}
```

### B. Test Database Connection

Check Railway logs:

1. Click on your backend service
2. Go to "Deployments" tab
3. Click on latest deployment
4. Check logs for:
   - ✅ "Database connected successfully"
   - ✅ "Server is running on port 3001"

### C. Test Full Integration

1. **Open your GitHub Pages site:**

   ```
   https://bjpl.github.io/learn_comptia_network_plus/
   ```

2. **Test Registration/Login:**
   - Try creating an account
   - Check browser Network tab (F12) for API calls
   - Should see requests to your Railway backend

---

## 🔒 Security Verification

Before going live, verify:

- [ ] `JWT_SECRET` is set in Railway Variables
- [ ] `REFRESH_TOKEN_SECRET` is set and different from JWT_SECRET
- [ ] `SESSION_SECRET` is set
- [ ] `NODE_ENV=production` is set
- [ ] `CORS_ORIGIN` matches your GitHub Pages URL exactly
- [ ] Database credentials are from Railway PostgreSQL service
- [ ] HTTPS is enabled (Railway provides this automatically)
- [ ] Secrets are NOT in your code (check git history)

---

## 📊 Monitoring Your Deployment

### Railway Dashboard

**Usage Metrics:**

- CPU usage
- Memory usage
- Network traffic
- Request counts

**Logs:**

- Real-time application logs
- Build logs
- Deployment history

**Database:**

- Connection stats
- Query performance
- Database size

### Set Up Alerts

1. Go to Project Settings
2. Add notification webhook (optional)
3. Configure deployment notifications

---

## 🔄 Continuous Deployment

Railway automatically deploys when you push to GitHub:

```bash
# Make changes to your backend
git add .
git commit -m "Update backend API"
git push origin main

# Railway automatically:
# 1. Detects the push
# 2. Builds your backend
# 3. Runs tests (if configured)
# 4. Deploys to production
# 5. Runs health checks
```

---

## 🆘 Troubleshooting

### "Build Failed"

**Check:**

- Build logs in Railway dashboard
- `package.json` has correct scripts
- All dependencies are in `package.json`
- TypeScript compiles successfully locally

**Solution:**

```bash
# Test build locally first:
cd backend
npm install
npm run build
npm start
```

### "Database Connection Failed"

**Check:**

- PostgreSQL service is running (green dot)
- Database variables are referenced correctly
- `DB_PASSWORD` is set
- Railway's internal network is used (not public IP)

**Solution:**
Use Railway's service reference:

```bash
DATABASE_URL=${{Postgres.DATABASE_URL}}
```

### "CORS Error in Browser"

**Check:**

- `CORS_ORIGIN` in Railway = exact GitHub Pages URL
- Include `https://` and no trailing slash
- Backend is allowing credentials

**Solution:**

```bash
# Railway environment variable:
CORS_ORIGIN=https://bjpl.github.io
```

### "JWT_SECRET Required" Error

**Check:**

- All 3 secrets are in Railway Variables tab
- No typos in variable names
- Values are not empty

**Solution:**
Re-add the secrets from `backend/.secrets.txt`

---

## 💰 Railway Free Tier Limits

Railway offers a generous free tier:

- ✅ $5/month free credit
- ✅ Unlimited projects
- ✅ 500 hours execution time/month
- ✅ 1GB database storage
- ✅ Automatic sleep after inactivity

**Perfect for development and small projects!**

---

## 🎯 Your Configuration Summary

| Item               | Value                                              |
| ------------------ | -------------------------------------------------- |
| **Frontend**       | https://bjpl.github.io/learn_comptia_network_plus/ |
| **Backend**        | https://your-app.up.railway.app                    |
| **Database**       | Railway PostgreSQL (managed)                       |
| **Repository**     | github.com/bjpl/learn_comptia_network_plus         |
| **Root Directory** | `backend`                                          |
| **Build Command**  | `npm install && npm run build`                     |
| **Start Command**  | `npm start`                                        |

---

## 📞 Next Steps After Deployment

1. ✅ Test all authentication flows
2. ✅ Verify database persistence
3. ✅ Check all API endpoints
4. ✅ Monitor Railway dashboard for errors
5. ✅ Set up custom domain (optional)
6. ✅ Configure backup strategy for database
7. ✅ Enable Railway metrics

---

## 🔐 Secrets Reference

Your generated secrets (saved in `backend/.secrets.txt`):

```
JWT_SECRET=wbxwMztxj35aJ9vvQ87AELgwavm4j9COqPVir4RFhTA=
REFRESH_TOKEN_SECRET=QFnIRXCi9D3qCz+MsswqUyKoaL0ttsgkcv6Rh4UEEg8=
SESSION_SECRET=ZXrpMfsvGSlZYrrrm0qaJJ0n5PIZWodkuXJkY5dWDP0=
```

**Remember:** Delete `backend/.secrets.txt` after copying to Railway!

---

## 🎉 Deployment Complete!

Your CompTIA Network+ Learning Platform is now fully deployed:

- ✅ Frontend on GitHub Pages
- ✅ Backend on Railway
- ✅ Database on Railway PostgreSQL
- ✅ Secured with proper secrets
- ✅ Automatic deployments enabled

**Ready to help students learn networking! 🚀**

---

**Need Help?**

- Railway Docs: https://docs.railway.app/
- Railway Discord: https://discord.gg/railway
- Check deployment logs in Railway dashboard
