# Deployment Guide: DigitalOcean

**Recommended for:** Budget-conscious teams, medium traffic, simplicity

**Estimated Time:** 1-2 hours
**Cost:** $27-78/month
**Difficulty:** Medium ⭐⭐

## Overview

This guide deploys on DigitalOcean using:
- **Full Stack** → Droplet (Ubuntu 22.04)
- **Database** → Managed PostgreSQL Database
- **CDN** → DigitalOcean Spaces + CDN (optional)
- **Load Balancer** → DigitalOcean Load Balancer (optional)

### Why DigitalOcean?

**Pros:**
- Simple, predictable pricing
- User-friendly interface
- Good documentation
- Managed database included
- Built-in monitoring
- Reasonable cost

**Cons:**
- Fewer regions than AWS
- Less feature-rich
- Manual scaling required
- Smaller ecosystem

## Prerequisites

- DigitalOcean account
- Domain name
- SSH key
- Basic Linux knowledge

## Part 1: Initial Setup

### Step 1: Create DigitalOcean Account

1. Go to [digitalocean.com](https://digitalocean.com)
2. Sign up and verify email
3. Add payment method
4. (Optional) Use referral link for $200 credit

### Step 2: Add SSH Key

```bash
# Generate SSH key (if you don't have one)
ssh-keygen -t ed25519 -C "your_email@example.com"

# Copy public key
cat ~/.ssh/id_ed25519.pub
```

In DigitalOcean:
1. Click "Settings" → "Security" → "SSH Keys"
2. Click "Add SSH Key"
3. Paste public key
4. Name it (e.g., "deployment-key")

### Step 3: Install doctl (DigitalOcean CLI)

**macOS:**
```bash
brew install doctl
```

**Linux:**
```bash
cd ~
wget https://github.com/digitalocean/doctl/releases/download/v1.98.1/doctl-1.98.1-linux-amd64.tar.gz
tar xf doctl-1.98.1-linux-amd64.tar.gz
sudo mv doctl /usr/local/bin
```

**Windows:**
Download from [GitHub releases](https://github.com/digitalocean/doctl/releases)

**Authenticate:**
```bash
# Create API token in DigitalOcean → API → Generate New Token
doctl auth init

# Verify
doctl account get
```

## Part 2: Create Managed Database

### Step 1: Create PostgreSQL Database

**Via Web Interface:**
1. DigitalOcean Dashboard → Databases → Create Database
2. Choose PostgreSQL 14
3. Select plan:
   - **Basic** ($15/month): 1GB RAM, 10GB storage, 25 connections
   - **Standard** ($30/month): 2GB RAM, 25GB storage, 60 connections
4. Choose datacenter (same as your Droplet region)
5. Name: `comptia-network-db`
6. Click "Create Database Cluster"

**Via CLI:**
```bash
# Create database
doctl databases create comptia-network-db \
  --engine pg \
  --version 14 \
  --size db-s-1vcpu-1gb \
  --region nyc1 \
  --num-nodes 1

# Get database ID
DB_ID=$(doctl databases list --format ID --no-header)

# Get connection details
doctl databases connection $DB_ID --format Host,Port,User,Password,Database
```

### Step 2: Configure Database

1. Wait 5-10 minutes for provisioning
2. Note connection details:
   - **Host**: `db-postgresql-nyc1-xxxxx.ondigitalocean.com`
   - **Port**: 25060
   - **Username**: `doadmin`
   - **Password**: (auto-generated)
   - **Database**: `defaultdb`

3. Create production database:

```bash
# Connect via command line
PGPASSWORD=your-password psql -h db-host -U doadmin -p 25060 -d defaultdb

# Create database
CREATE DATABASE comptia_network_prod;

# Create user
CREATE USER comptia_admin WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE comptia_network_prod TO comptia_admin;

# Exit
\q
```

### Step 3: Trusted Sources

Add your Droplet's IP to trusted sources (you'll get this IP after creating the Droplet).

## Part 3: Create Droplet

### Step 1: Create Droplet

**Via Web Interface:**
1. Dashboard → Droplets → Create Droplet
2. Choose Ubuntu 22.04 LTS
3. Select plan:
   - **Basic** ($12/month): 2GB RAM, 1 vCPU, 50GB SSD
   - **Regular** ($24/month): 4GB RAM, 2 vCPU, 80GB SSD
   - **Recommended** ($48/month): 8GB RAM, 4 vCPU, 160GB SSD
4. Choose same datacenter as database
5. Authentication: Select your SSH key
6. Hostname: `comptia-network-prod`
7. Enable monitoring (free)
8. Click "Create Droplet"

**Via CLI:**
```bash
# Create Droplet
doctl compute droplet create comptia-network-prod \
  --size s-2vcpu-4gb \
  --image ubuntu-22-04-x64 \
  --region nyc1 \
  --ssh-keys YOUR_SSH_KEY_ID \
  --enable-monitoring \
  --wait

# Get Droplet IP
DROPLET_IP=$(doctl compute droplet list --format PublicIPv4 --no-header)
echo "Droplet IP: $DROPLET_IP"
```

### Step 2: Add Droplet IP to Database Trusted Sources

1. DigitalOcean → Databases → comptia-network-db
2. Settings → Trusted Sources
3. Add: `$DROPLET_IP`
4. Click "Save"

## Part 4: Server Setup

### Step 1: Connect to Droplet

```bash
ssh root@$DROPLET_IP
```

### Step 2: Initial Server Setup

```bash
# Update system
apt update && apt upgrade -y

# Install essential packages
apt install -y curl wget git build-essential nginx certbot python3-certbot-nginx

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Verify installations
node --version  # Should show v18.x
npm --version   # Should show 9.x
nginx -v        # Should show nginx 1.18+

# Install PostgreSQL client
apt install -y postgresql-client

# Install PM2 (process manager)
npm install -g pm2

# Create non-root user
adduser comptia
usermod -aG sudo comptia

# Setup SSH for new user
mkdir -p /home/comptia/.ssh
cp /root/.ssh/authorized_keys /home/comptia/.ssh/
chown -R comptia:comptia /home/comptia/.ssh
chmod 700 /home/comptia/.ssh
chmod 600 /home/comptia/.ssh/authorized_keys
```

### Step 3: Configure Firewall

```bash
# Enable UFW firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

# Verify
ufw status
```

## Part 5: Deploy Backend

### Step 1: Clone Repository

```bash
# Switch to comptia user
su - comptia

# Create project directory
mkdir -p /home/comptia/apps
cd /home/comptia/apps

# Clone repository
git clone https://github.com/yourusername/comptia-network.git
cd comptia-network
```

### Step 2: Configure Backend

```bash
cd backend

# Install dependencies
npm install --production

# Create .env.production
cat > .env.production << EOF
NODE_ENV=production
PORT=3001

# Database (use DigitalOcean database credentials)
DATABASE_URL=postgresql://comptia_admin:PASSWORD@db-host:25060/comptia_network_prod?sslmode=require
DB_HOST=db-postgresql-nyc1-xxxxx.ondigitalocean.com
DB_PORT=25060
DB_NAME=comptia_network_prod
DB_USER=comptia_admin
DB_PASSWORD=your-secure-password
DB_SSL=true

# Generate these secrets
JWT_SECRET=$(openssl rand -base64 32)
REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=1h

# CORS
CORS_ORIGIN=https://yourdomain.com
CORS_CREDENTIALS=true

# Rate Limiting
API_RATE_LIMIT=100
API_RATE_WINDOW=15

# Logging
LOG_LEVEL=info
LOG_FILE=/home/comptia/apps/comptia-network/backend/logs/production.log

# Security
BCRYPT_ROUNDS=12
EOF

# Create logs directory
mkdir -p logs

# Build backend
npm run build
```

### Step 3: Run Database Migrations

```bash
# Run migrations
npm run migrate

# (Optional) Seed data
npm run seed
```

### Step 4: Start Backend with PM2

```bash
# Start application
pm2 start dist/server.js --name comptia-backend

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup systemd -u comptia --hp /home/comptia
# Copy and run the command PM2 outputs

# Verify
pm2 status
pm2 logs comptia-backend
```

## Part 6: Deploy Frontend

### Step 1: Build Frontend

```bash
# Navigate to project root
cd /home/comptia/apps/comptia-network

# Create .env.production
cat > .env.production << EOF
VITE_API_URL=https://api.yourdomain.com
VITE_USE_MOCK_API=false
VITE_ENV=production
EOF

# Install dependencies
npm install

# Build
npm run build

# Move build to web root
sudo mkdir -p /var/www/comptia-network
sudo cp -r dist/* /var/www/comptia-network/
sudo chown -R www-data:www-data /var/www/comptia-network
```

## Part 7: Configure Nginx

### Step 1: Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/comptia-network
```

Add this configuration:

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

# Upstream backend
upstream backend {
    server localhost:3001;
    keepalive 32;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

# Frontend (HTTPS)
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL configuration (will be configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Root directory
    root /var/www/comptia-network;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_comp_level 6;

    # Frontend routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public";
    }

    # Static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend API (HTTPS)
server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    # SSL configuration
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # API endpoints
    location / {
        limit_req zone=api_limit burst=20 nodelay;

        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Login endpoint (stricter rate limit)
    location /api/auth/login {
        limit_req zone=login_limit burst=3 nodelay;
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check
    location /health {
        access_log off;
        proxy_pass http://backend;
    }
}
```

### Step 2: Enable Site

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/comptia-network /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Part 8: SSL Certificate (Let's Encrypt)

```bash
# Obtain certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Follow prompts:
# - Enter email
# - Agree to terms
# - Choose redirect HTTP to HTTPS

# Verify auto-renewal
sudo certbot renew --dry-run

# Certificate auto-renews via cron
sudo systemctl status certbot.timer
```

## Part 9: Configure DNS

Add these records at your domain registrar:

```
Type    Name    Value                   TTL
A       @       YOUR_DROPLET_IP         3600
A       www     YOUR_DROPLET_IP         3600
A       api     YOUR_DROPLET_IP         3600
```

Wait 5-60 minutes for DNS propagation.

## Part 10: Verify Deployment

```bash
# Check backend health
curl https://api.yourdomain.com/health

# Check frontend
curl -I https://yourdomain.com

# Check PM2 status
pm2 status

# Check Nginx status
sudo systemctl status nginx

# Check logs
pm2 logs comptia-backend
sudo tail -f /var/log/nginx/access.log
```

## Part 11: Automated Backups

### Database Backups

```bash
# Create backup script
mkdir -p /home/comptia/backups
nano /home/comptia/backups/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d-%H%M%S)
BACKUP_DIR="/home/comptia/backups/database"
mkdir -p $BACKUP_DIR

# Backup database
PGPASSWORD=your-password pg_dump \
  -h db-postgresql-nyc1-xxxxx.ondigitalocean.com \
  -U comptia_admin \
  -p 25060 \
  -d comptia_network_prod \
  -F c \
  -f "$BACKUP_DIR/backup-$DATE.dump"

# Keep only last 7 days
find $BACKUP_DIR -name "backup-*.dump" -mtime +7 -delete

echo "Backup completed: backup-$DATE.dump"
```

```bash
# Make executable
chmod +x /home/comptia/backups/backup-db.sh

# Test backup
/home/comptia/backups/backup-db.sh

# Schedule daily backups (cron)
crontab -e

# Add this line (daily at 2 AM)
0 2 * * * /home/comptia/backups/backup-db.sh >> /home/comptia/backups/backup.log 2>&1
```

### Application Files Backup

```bash
# Create backup script
nano /home/comptia/backups/backup-app.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/home/comptia/backups/app"
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf "$BACKUP_DIR/app-$DATE.tar.gz" \
  /home/comptia/apps/comptia-network \
  /var/www/comptia-network \
  /etc/nginx/sites-available/comptia-network

# Keep only last 14 days
find $BACKUP_DIR -name "app-*.tar.gz" -mtime +14 -delete

echo "Application backup completed: app-$DATE.tar.gz"
```

```bash
chmod +x /home/comptia/backups/backup-app.sh

# Add to cron (weekly on Sundays at 3 AM)
crontab -e
0 3 * * 0 /home/comptia/backups/backup-app.sh >> /home/comptia/backups/backup.log 2>&1
```

## Part 12: Monitoring

### Setup Monitoring

DigitalOcean provides built-in monitoring:

1. Dashboard → Droplet → Monitoring tab
2. View CPU, Memory, Disk, Bandwidth

### Install Additional Monitoring

```bash
# Install DigitalOcean monitoring agent
curl -sSL https://repos.insights.digitalocean.com/install.sh | sudo bash

# Verify
sudo systemctl status do-agent
```

### Setup Log Rotation

```bash
# Create logrotate config
sudo nano /etc/logrotate.d/comptia-network
```

```
/home/comptia/apps/comptia-network/backend/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 comptia comptia
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
```

## Part 13: CI/CD Setup

### GitHub Actions Deployment

Create `.github/workflows/deploy-digitalocean.yml`:

```yaml
name: Deploy to DigitalOcean

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Droplet
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.DROPLET_IP }}
          username: comptia
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /home/comptia/apps/comptia-network
            git pull origin main

            # Backend
            cd backend
            npm install --production
            npm run build
            pm2 reload comptia-backend

            # Frontend
            cd ..
            npm install
            npm run build
            sudo rm -rf /var/www/comptia-network/*
            sudo cp -r dist/* /var/www/comptia-network/
            sudo chown -R www-data:www-data /var/www/comptia-network

            # Reload Nginx
            sudo systemctl reload nginx
```

**Setup secrets in GitHub:**
- `DROPLET_IP`: Your Droplet's IP address
- `SSH_PRIVATE_KEY`: Your private SSH key

## Part 14: Scaling

### Vertical Scaling (Resize Droplet)

**Via Web Interface:**
1. Dashboard → Droplet → Resize
2. Choose larger plan
3. Click "Resize Droplet"
4. Droplet will be powered off and resized (5-10 minutes)

**Via CLI:**
```bash
# Power off Droplet
doctl compute droplet-action power-off DROPLET_ID

# Resize
doctl compute droplet-action resize DROPLET_ID --size s-4vcpu-8gb

# Power on
doctl compute droplet-action power-on DROPLET_ID
```

### Horizontal Scaling (Multiple Droplets)

1. Create additional Droplets following Part 3
2. Deploy application to each Droplet
3. Create Load Balancer:

```bash
# Create Load Balancer
doctl compute load-balancer create \
  --name comptia-network-lb \
  --region nyc1 \
  --forwarding-rules "entry_protocol:https,entry_port:443,target_protocol:http,target_port:80,tls_passthrough:false" \
  --health-check "protocol:http,port:80,path:/health,check_interval_seconds:10" \
  --droplet-ids DROPLET_ID_1,DROPLET_ID_2

# Update DNS to point to Load Balancer IP
```

## Troubleshooting

### Backend Not Starting

```bash
# Check PM2 logs
pm2 logs comptia-backend

# Check for port conflicts
sudo netstat -tulpn | grep 3001

# Restart backend
pm2 restart comptia-backend
```

### Database Connection Errors

```bash
# Test database connection
PGPASSWORD=your-password psql \
  -h db-host \
  -U comptia_admin \
  -p 25060 \
  -d comptia_network_prod

# Check trusted sources in DigitalOcean dashboard
# Ensure Droplet IP is whitelisted
```

### Nginx Errors

```bash
# Check Nginx error log
sudo tail -f /var/log/nginx/error.log

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew manually
sudo certbot renew --force-renewal

# Check auto-renewal timer
sudo systemctl status certbot.timer
```

## Cost Breakdown

**Configuration:** Basic ($12 Droplet + $15 Database)
- Droplet (2GB RAM): $12/month
- Managed PostgreSQL: $15/month
- Bandwidth: 2TB included (free)
- Backups: $1.20/month (20% of Droplet cost)
- **Total: ~$28/month**

**Configuration:** Recommended ($48 Droplet + $30 Database)
- Droplet (8GB RAM): $48/month
- Managed PostgreSQL: $30/month
- Load Balancer: $12/month (optional)
- Backups: $9.60/month
- **Total: ~$90/month** (with LB)

## Performance Optimization

1. **Enable DigitalOcean CDN** (Spaces CDN):
   - Upload static assets to Spaces
   - Enable CDN ($5/month)
   - Update frontend to use CDN URLs

2. **Add Redis cache**:
   - Install Redis on Droplet: `sudo apt install redis-server`
   - Or use managed Redis ($15/month)

3. **Optimize PostgreSQL**:
   - Upgrade to larger database plan
   - Enable connection pooling

4. **Enable HTTP/2 and Brotli compression** in Nginx

## Security Best Practices

1. **Keep system updated**:
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Disable root SSH**:
   ```bash
   sudo nano /etc/ssh/sshd_config
   # Set: PermitRootLogin no
   sudo systemctl reload sshd
   ```

3. **Enable automatic security updates**:
   ```bash
   sudo apt install unattended-upgrades
   sudo dpkg-reconfigure -plow unattended-upgrades
   ```

4. **Install fail2ban**:
   ```bash
   sudo apt install fail2ban
   sudo systemctl enable fail2ban
   ```

5. **Regular backups**: Ensure automated backups are running

---

**Deployment Status:** Production Ready ✅
**Last Updated:** 2025-10-29
