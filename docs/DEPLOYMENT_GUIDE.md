# CompTIA Network+ Learning Platform - Deployment Guide

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Platform-Specific Guides](#platform-specific-guides)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [SSL/TLS Configuration](#ssltls-configuration)
7. [Post-Deployment](#post-deployment)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

## Overview

This guide covers deploying the CompTIA Network+ Learning Platform to various hosting platforms. The application consists of:

- **Frontend**: React + Vite (Static site)
- **Backend**: Node.js + Express API
- **Database**: PostgreSQL 14+
- **Cache**: Redis (optional but recommended)
- **CDN**: Recommended for static assets

### Architecture

```
┌─────────────────┐
│   CDN/CloudFlare│ ← Static Assets (JS, CSS, Images)
└────────┬────────┘
         │
┌────────▼────────┐
│  Load Balancer  │ ← SSL Termination
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│ Web  │  │ Web  │ ← React SPA (Port 80/443)
└───┬──┘  └──┬───┘
    │        │
    └────┬───┘
         │
┌────────▼────────┐
│   API Gateway   │ ← Rate Limiting, Auth
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│ API  │  │ API  │ ← Node.js Backend (Port 3001)
└──┬───┘  └───┬──┘
   │          │
   └────┬─────┘
        │
    ┌───┴────┬────────┐
    │        │        │
┌───▼──┐ ┌──▼───┐ ┌──▼────┐
│ PG   │ │Redis │ │ S3/   │
│ SQL  │ │Cache │ │ Storage│
└──────┘ └──────┘ └───────┘
```

### Technology Stack

**Frontend:**
- React 18.3+
- TypeScript 5.7+
- Vite 6.0+ (Build tool)
- Material-UI 5.18+
- React Router 6.28+

**Backend:**
- Node.js 18+
- Express 4.18+
- PostgreSQL 14+
- Redis 7+ (optional)
- JWT authentication

## Prerequisites

### Local Development
- Node.js 18+ and npm 9+
- PostgreSQL 14+ or Docker
- Git
- Text editor (VS Code recommended)

### Production Requirements
- **Domain name** with DNS access
- **SSL certificate** (Let's Encrypt free or purchased)
- **Hosting account** on chosen platform
- **Email service** (optional: SendGrid, AWS SES, or SMTP)
- **Minimum Resources**:
  - 2GB RAM (4GB recommended)
  - 2 CPU cores (4 recommended)
  - 20GB storage (50GB recommended)
  - 100GB bandwidth/month

### Cost Estimates (Monthly)

| Platform | Tier | Frontend | Backend | Database | Total |
|----------|------|----------|---------|----------|-------|
| **Vercel + Railway** | Hobby | $0 | $5-10 | $5 | $5-15 |
| **Vercel + Railway** | Pro | $20 | $20 | $15 | $55 |
| **DigitalOcean** | Basic | - | $12 | $15 | $27 |
| **DigitalOcean** | Production | - | $48 | $30 | $78 |
| **AWS** | Small | $5 | $30 | $25 | $60 |
| **AWS** | Medium | $15 | $100 | $75 | $190 |
| **Self-Hosted** | VPS | - | $5-20 | - | $5-20 |

## Platform-Specific Guides

### Quick Comparison

| Platform | Difficulty | Cost/Month | Scalability | Best For |
|----------|-----------|------------|-------------|----------|
| [Vercel + Railway](./deployment/VERCEL_RAILWAY.md) | Easy | $5-15 | Good | Quick start, MVP |
| [DigitalOcean](./deployment/DIGITALOCEAN.md) | Medium | $27-78 | Good | Budget conscious |
| [AWS](./deployment/AWS.md) | Hard | $60-200+ | Excellent | Enterprise |
| [Self-Hosted](./deployment/SELF_HOSTED.md) | Medium | $5-20 | Limited | Full control |
| [Docker Compose](./deployment/DOCKER_COMPOSE.md) | Medium | Variable | Good | Containers |

### 1. Vercel + Railway (Recommended for Beginners)

**Best for:** Quick deployment, prototypes, small to medium traffic

**Pros:**
- Easiest setup (15 minutes)
- Automatic SSL
- Global CDN included
- Zero-config deployments
- Free tier available

**Cons:**
- Limited backend customization
- Higher cost at scale
- Platform lock-in

**[Full Guide →](./deployment/VERCEL_RAILWAY.md)**

### 2. AWS (Enterprise Grade)

**Best for:** Large scale applications, enterprise requirements

**Pros:**
- Highly scalable
- Full control
- Extensive services
- Industry standard

**Cons:**
- Complex setup
- Steeper learning curve
- Can be expensive
- Requires AWS knowledge

**[Full Guide →](./deployment/AWS.md)**

### 3. DigitalOcean (Budget-Friendly)

**Best for:** Cost-conscious teams, medium traffic

**Pros:**
- Predictable pricing
- Simple interface
- Good documentation
- Managed databases

**Cons:**
- Less features than AWS
- Limited regions
- Manual scaling

**[Full Guide →](./deployment/DIGITALOCEAN.md)**

### 4. Self-Hosted (Maximum Control)

**Best for:** Experienced teams, specific requirements

**Pros:**
- Complete control
- Lowest cost (if you have servers)
- No platform limitations
- Custom configurations

**Cons:**
- Most complex
- You handle everything
- Security responsibility
- Maintenance overhead

**[Full Guide →](./deployment/SELF_HOSTED.md)**

### 5. Docker Compose (Portable Deployment)

**Best for:** Containerized environments, reproducible deployments

**Pros:**
- Consistent across environments
- Easy to replicate
- Good for CI/CD
- Portable

**Cons:**
- Requires Docker knowledge
- Need orchestration for scale
- Extra layer of complexity

**[Full Guide →](./deployment/DOCKER_COMPOSE.md)**

## Environment Configuration

### Frontend Environment Variables

Create `.env.production` in the root directory:

```env
# API Configuration
VITE_API_URL=https://api.yourdomain.com
VITE_USE_MOCK_API=false

# Environment
VITE_ENV=production

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx

# Optional: Features
VITE_ENABLE_PWA=true
VITE_ENABLE_OFFLINE_MODE=true
```

### Backend Environment Variables

Copy `backend/.env.production.template` to `backend/.env.production`:

```env
# Core Configuration
NODE_ENV=production
PORT=3001

# Database (PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/database
DB_HOST=your-postgres-host
DB_PORT=5432
DB_NAME=comptia_network_prod
DB_USER=comptia_admin
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
DB_POOL_MIN=5
DB_POOL_MAX=20
DB_SSL=true

# Redis Cache (Optional but recommended)
REDIS_HOST=your-redis-host
REDIS_PORT=6379
REDIS_PASSWORD=CHANGE_ME_REDIS_PASSWORD
REDIS_DB=0
REDIS_TTL=3600

# Security - Generate strong secrets!
JWT_SECRET=CHANGE_ME_256BIT_SECRET
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d
SESSION_SECRET=CHANGE_ME_SESSION_SECRET
REFRESH_TOKEN_SECRET=CHANGE_ME_REFRESH_SECRET

# CORS
CORS_ORIGIN=https://yourdomain.com
CORS_CREDENTIALS=true

# Rate Limiting
API_RATE_LIMIT=100
API_RATE_WINDOW=15

# Logging
LOG_LEVEL=warn
LOG_FILE=logs/production.log

# Security
BCRYPT_ROUNDS=12

# Monitoring (Optional)
SENTRY_DSN=https://xxx@sentry.io/project
NEW_RELIC_LICENSE_KEY=your-key-here
```

### Generate Strong Secrets

**Option 1: Using OpenSSL**
```bash
# Generate JWT secret
openssl rand -base64 32

# Generate session secret
openssl rand -base64 32

# Generate refresh token secret
openssl rand -base64 32
```

**Option 2: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 3: Using provided script**
```bash
cd backend
chmod +x scripts/generate-secrets.sh
./scripts/generate-secrets.sh
```

## Database Setup

### PostgreSQL Installation

**Ubuntu/Debian:**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS:**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Windows:**
Download from [postgresql.org](https://www.postgresql.org/download/windows/)

### Database Creation

```bash
# Connect to PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE comptia_network_prod;
CREATE USER comptia_admin WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE comptia_network_prod TO comptia_admin;

# Exit
\q
```

### Connection String Formats

**Standard format:**
```
postgresql://username:password@hostname:5432/database
```

**With SSL:**
```
postgresql://username:password@hostname:5432/database?sslmode=require
```

**Connection pooling:**
```
postgresql://username:password@hostname:5432/database?pool_size=20&pool_timeout=10
```

### Run Database Migrations

```bash
cd backend

# Set environment
export NODE_ENV=production

# Run migrations
npm run migrate

# Or use script
./scripts/migrate.sh
```

### Seed Initial Data (Optional)

```bash
# Seed demo content and test accounts
./database/scripts/seed.sh

# Or using npm
npm run seed
```

### Database Backups

**Automated backup script** (see `backend/database/scripts/backup.sh`):

```bash
# Manual backup
./database/scripts/backup.sh

# Schedule daily backups (cron)
crontab -e

# Add this line for daily 2 AM backups
0 2 * * * /path/to/backend/database/scripts/backup.sh
```

**Backup to remote storage:**
```bash
# After backup, sync to S3
aws s3 sync ./backups/ s3://your-bucket/db-backups/

# Or to DigitalOcean Spaces
s3cmd sync ./backups/ s3://your-space/db-backups/
```

## SSL/TLS Configuration

### Option 1: Let's Encrypt (Free, Automated)

**Recommended for self-hosted and DigitalOcean deployments.**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate (Nginx)
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Obtain certificate (standalone)
sudo certbot certonly --standalone -d yourdomain.com

# Auto-renewal (already configured)
sudo certbot renew --dry-run
```

### Option 2: Cloudflare (Free, Easy)

**Recommended for all deployments for additional DDoS protection.**

1. **Sign up** at [cloudflare.com](https://cloudflare.com)
2. **Add your domain**
3. **Update nameservers** at your registrar
4. **SSL/TLS settings:**
   - Encryption mode: "Full (strict)"
   - Always Use HTTPS: ON
   - Automatic HTTPS Rewrites: ON
   - Minimum TLS Version: 1.2

### Option 3: Purchased Certificate

**For enterprise requirements or specific compliance needs.**

```bash
# Place certificate files
/etc/ssl/certs/yourdomain.com.crt
/etc/ssl/private/yourdomain.com.key
/etc/ssl/certs/ca-bundle.crt

# Set permissions
sudo chmod 600 /etc/ssl/private/yourdomain.com.key
sudo chmod 644 /etc/ssl/certs/yourdomain.com.crt
```

**Nginx configuration:**
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/ssl/certs/yourdomain.com.crt;
    ssl_certificate_key /etc/ssl/private/yourdomain.com.key;
    ssl_trusted_certificate /etc/ssl/certs/ca-bundle.crt;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256';
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;
}
```

## Post-Deployment

### 1. Health Check Verification

```bash
# Check backend health
curl https://api.yourdomain.com/health

# Expected response:
# {"status":"ok","timestamp":"2025-10-29T...","uptime":123}

# Check frontend
curl -I https://yourdomain.com

# Expected: HTTP 200 OK
```

### 2. Create Admin Account

```bash
# Using backend CLI
cd backend
npm run create-admin

# Or via API
curl -X POST https://api.yourdomain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@yourdomain.com",
    "password": "SecurePassword123!",
    "username": "admin",
    "role": "admin"
  }'
```

### 3. Configure DNS

**A Records:**
```
A     @              YOUR_SERVER_IP
A     www            YOUR_SERVER_IP
A     api            YOUR_SERVER_IP
```

**CNAME (if using CDN):**
```
CNAME www            yourdomain.com
CNAME api            yourdomain.com
```

### 4. Enable HTTPS Redirect

Ensure all HTTP traffic redirects to HTTPS (should be automatic with most setups).

### 5. Test Application Flow

1. Visit https://yourdomain.com
2. Register new account
3. Login
4. Navigate through courses
5. Take practice test
6. Check progress tracking
7. Logout and login again

### 6. Performance Optimization

**Enable CDN caching:**
```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

**Enable compression:**
```nginx
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml;
gzip_comp_level 6;
```

**Enable HTTP/2:**
```nginx
listen 443 ssl http2;
```

## Monitoring & Maintenance

### Application Monitoring

**Option 1: Built-in Health Endpoint**
```bash
# Monitor health
watch -n 30 'curl -s https://api.yourdomain.com/health | jq'
```

**Option 2: Uptime Robot (Free)**
1. Sign up at [uptimerobot.com](https://uptimerobot.com)
2. Add HTTP monitor for https://yourdomain.com
3. Add HTTP monitor for https://api.yourdomain.com/health
4. Configure alerts (email, SMS, Slack)

**Option 3: Sentry (Error Tracking)**
```bash
# Install Sentry
npm install @sentry/node @sentry/react

# Configure in backend and frontend
# See .env.production for SENTRY_DSN
```

### Log Management

**View logs:**
```bash
# Backend logs
tail -f backend/logs/production.log

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

**Log rotation:**
```bash
# Configure logrotate
sudo nano /etc/logrotate.d/comptia-network

# Add:
/var/www/comptia-network/backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

### Database Maintenance

**Weekly maintenance script:**
```bash
#!/bin/bash
# /etc/cron.weekly/db-maintenance

# Vacuum analyze
psql -U comptia_admin -d comptia_network_prod -c "VACUUM ANALYZE;"

# Reindex
psql -U comptia_admin -d comptia_network_prod -c "REINDEX DATABASE comptia_network_prod;"

# Check bloat
psql -U comptia_admin -d comptia_network_prod -c "SELECT * FROM pg_stat_user_tables;"
```

### Security Updates

```bash
# Ubuntu/Debian
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y

# Check for security updates
sudo unattended-upgrades -d

# Enable automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### Backup Verification

```bash
# Test restore process monthly
./backend/database/scripts/restore.sh ./backups/latest.sql

# Verify restored data
psql -U comptia_admin -d comptia_network_test -c "SELECT COUNT(*) FROM users;"
```

## Troubleshooting

### Application Won't Start

**Check logs:**
```bash
# Backend logs
cd backend && npm run start

# Check for errors in output
```

**Common issues:**
- Database connection failed: Verify DATABASE_URL
- Port already in use: Change PORT in .env
- Missing dependencies: Run `npm install`
- Permission denied: Check file permissions

### Database Connection Errors

```bash
# Test connection
psql -h DB_HOST -U DB_USER -d DB_NAME

# Check PostgreSQL status
sudo systemctl status postgresql

# Restart PostgreSQL
sudo systemctl restart postgresql

# Check firewall
sudo ufw status
sudo ufw allow 5432/tcp
```

### SSL Certificate Issues

```bash
# Test SSL
openssl s_client -connect yourdomain.com:443

# Check certificate expiry
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates

# Renew Let's Encrypt
sudo certbot renew --force-renewal
```

### High Memory Usage

```bash
# Check memory
free -h

# Check processes
top
htop

# Find memory hogs
ps aux --sort=-%mem | head

# Restart backend
pm2 restart all

# Or with systemd
sudo systemctl restart comptia-backend
```

### Slow Performance

**Database queries:**
```sql
-- Find slow queries
SELECT pid, now() - pg_stat_activity.query_start AS duration, query
FROM pg_stat_activity
WHERE state = 'active' AND now() - pg_stat_activity.query_start > interval '5 seconds';

-- Add indexes if needed
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_progress_user_id ON user_progress(user_id);
```

**Enable Redis caching:**
```env
# In .env.production
REDIS_ENABLED=true
CACHE_TTL=3600
```

### Frontend Not Loading

1. Check build output: `npm run build`
2. Verify API URL in `.env.production`
3. Check CORS settings in backend
4. Clear browser cache
5. Check CDN/CloudFlare cache
6. Verify Nginx serving correct directory

### API Errors

**Enable debug logging:**
```env
# In backend/.env.production
LOG_LEVEL=debug
NODE_ENV=development
```

**Check API responses:**
```bash
# Test auth
curl -X POST https://api.yourdomain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'

# Test with verbose
curl -v https://api.yourdomain.com/api/courses
```

### Rollback Deployment

**Git rollback:**
```bash
# Find previous commit
git log --oneline

# Revert to previous version
git revert HEAD
git push origin main

# Or reset (destructive)
git reset --hard COMMIT_HASH
git push -f origin main
```

**Docker rollback:**
```bash
# List images
docker images

# Use previous image
docker-compose down
docker-compose up -d --no-build
```

**Database rollback:**
```bash
# Restore from backup
./backend/database/scripts/restore.sh ./backups/backup-2025-10-28.sql
```

## Getting Help

### Documentation
- [Frontend README](../README.md)
- [Backend README](../backend/README.md)
- [API Documentation](../backend/API.md)

### Support Channels
- GitHub Issues: [Report bugs or request features]
- Email: support@yourdomain.com
- Documentation: https://docs.yourdomain.com

### Common Resources
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [React Documentation](https://react.dev/)

---

## Quick Reference

### Essential Commands

```bash
# Build
npm run build                    # Frontend
cd backend && npm run build      # Backend

# Deploy
./scripts/deploy.sh production   # Full deployment

# Database
./backend/database/scripts/backup.sh    # Backup
./backend/database/scripts/migrate.sh   # Migrate

# Monitoring
pm2 status                       # Process status
pm2 logs                        # View logs
docker-compose ps               # Container status

# Maintenance
npm run test                    # Run tests
npm run lint                    # Check code quality
```

### Port Reference

| Service | Port | Protocol |
|---------|------|----------|
| Frontend | 80, 443 | HTTP/HTTPS |
| Backend API | 3001 | HTTP |
| PostgreSQL | 5432 | TCP |
| Redis | 6379 | TCP |

### File Locations

```
/var/www/comptia-network/          # Application root
/var/www/comptia-network/dist/     # Frontend build
/var/log/nginx/                    # Nginx logs
/var/log/postgresql/               # Database logs
/etc/nginx/sites-available/        # Nginx configs
/etc/ssl/                          # SSL certificates
```

---

**Last Updated:** 2025-10-29
**Version:** 1.0.0
