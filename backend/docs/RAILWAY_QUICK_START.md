# 🚂 Railway Deployment - Quick Start

**Your secrets are ready! Let's deploy in 5 minutes.**

---

## 🎯 What You Need

✅ Railway Account: https://railway.app/  
✅ Your Secrets: `backend/.secrets.txt`  
✅ GitHub Repo: `bjpl/learn_comptia_network_plus`

---

## 📝 Step-by-Step (5 Minutes)

### 1️⃣ Create Project (1 min)

1. Go to: https://railway.app/dashboard
2. Click: **"New Project"**
3. Select: **"Deploy from GitHub repo"**
4. Choose: `bjpl/learn_comptia_network_plus`

---

### 2️⃣ Add Database (30 sec)

1. Click: **"+ New"**
2. Select: **"Database" → "PostgreSQL"**
3. Wait for green checkmark ✅

---

### 3️⃣ Configure Backend (2 min)

**A. Set Root Directory:**

1. Click your backend service
2. Settings → Service Settings
3. Root Directory: `backend`
4. Click "Update"

**B. Add Environment Variables:**
Click "Variables" tab → Add these **9 variables**:

```
NODE_ENV=production
PORT=3001
JWT_SECRET=wbxwMztxj35aJ9vvQ87AELgwavm4j9COqPVir4RFhTA=
REFRESH_TOKEN_SECRET=QFnIRXCi9D3qCz+MsswqUyKoaL0ttsgkcv6Rh4UEEg8=
SESSION_SECRET=ZXrpMfsvGSlZYrrrm0qaJJ0n5PIZWodkuXJkY5dWDP0=
CORS_ORIGIN=https://bjpl.github.io
```

**For Database Variables** (use References):

- Click "+ New Variable" → "Add Reference"
- Select PostgreSQL service
- Add: `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`
- Map to: `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

---

### 4️⃣ Deploy (30 sec)

1. Click "Deployments" tab
2. Railway auto-deploys!
3. Watch build logs
4. Wait for ✅ "Deploy successful"

---

### 5️⃣ Get Your URL (30 sec)

1. Settings → Domains
2. Click "Generate Domain"
3. Copy URL: `https://xxx.up.railway.app`

---

### 6️⃣ Update Frontend (30 sec)

**Edit `.env` in project root:**

```bash
VITE_API_URL=https://your-backend.up.railway.app/api
VITE_USE_MOCK_API=false
```

**Deploy to GitHub Pages:**

```bash
npm run deploy
```

---

## ✅ Test It Works

**1. Test Backend:**

```
https://your-backend.up.railway.app/api/health
```

Should return:

```json
{ "success": true, "message": "API is running" }
```

**2. Test Frontend:**

```
https://bjpl.github.io/learn_comptia_network_plus/
```

Try registering an account!

---

## 🔐 Your Secrets (Copy These to Railway)

```
JWT_SECRET=wbxwMztxj35aJ9vvQ87AELgwavm4j9COqPVir4RFhTA=
REFRESH_TOKEN_SECRET=QFnIRXCi9D3qCz+MsswqUyKoaL0ttsgkcv6Rh4UEEg8=
SESSION_SECRET=ZXrpMfsvGSlZYrrrm0qaJJ0n5PIZWodkuXJkY5dWDP0=
```

---

## 📚 Full Guide

Need more details? See: `docs/RAILWAY_DEPLOYMENT_GUIDE.md`

---

## 🆘 Quick Troubleshooting

| Problem        | Solution                                  |
| -------------- | ----------------------------------------- |
| Build fails    | Check Root Directory = `backend`          |
| Database error | Add DB references from PostgreSQL service |
| CORS error     | Set `CORS_ORIGIN=https://bjpl.github.io`  |
| JWT error      | Verify all 3 secrets are in Variables     |

---

**You're ready to deploy! 🚀**
