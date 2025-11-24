# Deployment Guide: Self-Hosted Server

**Recommended for:** Maximum control, custom requirements, experienced teams

**Estimated Time:** 2-3 hours
**Cost:** $5-20/month (VPS) or $0 (own hardware)
**Difficulty:** Medium-Hard ⭐⭐⭐

## Overview

Deploy on your own server or VPS using:

- **Server**: Ubuntu 22.04 LTS (or any Linux distribution)
- **Web Server**: Nginx
- **Process Manager**: PM2
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+ (optional)
- **SSL**: Let's Encrypt

### Why Self-Hosted?

**Pros:**

- Complete control over infrastructure
- Lowest cost (if you have hardware)
- No platform limitations
- Custom configurations
- Data ownership

**Cons:**

- You're responsible for everything
- Requires Linux/server knowledge
- Manual scaling
- Security is your responsibility
- Maintenance overhead

## Prerequisites

- Linux server (Ubuntu 22.04 LTS recommended) or VPS provider:
  - [Hetzner](https://hetzner.com) (€4-20/month)
  - [Vultr](https://vultr.com) ($5-20/month)
  - [Linode](https://linode.com) ($5-20/month)
  - [Contabo](https://contabo.com) (€5-15/month)
- Root/sudo access
- Domain name
- Basic Linux knowledge

## Part 1: Server Selection

### Option A: Own Hardware

**Minimum specifications:**

- 2GB RAM (4GB recommended)
- 2 CPU cores
- 20GB SSD storage
- Static IP address or dynamic DNS
- Port forwarding configured (80, 443)

### Option B: VPS Provider

**Recommended providers:**

| Provider      | Cost/Month | RAM | CPU | Storage | Bandwidth |
| ------------- | ---------- | --- | --- | ------- | --------- |
| Hetzner CX21  | €4.90      | 4GB | 2   | 40GB    | 20TB      |
| Vultr         | $6.00      | 2GB | 1   | 55GB    | 2TB       |
| Linode        | $5.00      | 1GB | 1   | 25GB    | 1TB       |
| Contabo VPS S | €4.99      | 8GB | 4   | 200GB   | 32TB      |

**Create VPS:**

```bash
# Example: Hetzner Cloud CLI
hcloud server create --name comptia-network-prod \
  --type cx21 \
  --image ubuntu-22.04 \
  --ssh-key my-key \
  --location nbg1

# Get server IP
hcloud server ip comptia-network-prod
```

## Part 2: Initial Server Setup

### Step 1: Connect to Server

```bash
ssh root@YOUR_SERVER_IP
```

### Step 2: Update System

```bash
# Update package lists
apt update

# Upgrade packages
apt upgrade -y

# Install essential packages
apt install -y curl wget git build-essential ufw fail2ban
```

### Step 3: Create Non-Root User

```bash
# Create user
adduser comptia

# Add to sudo group
usermod -aG sudo comptia

# Setup SSH for new user
mkdir -p /home/comptia/.ssh
cp /root/.ssh/authorized_keys /home/comptia/.ssh/
chown -R comptia:comptia /home/comptia/.ssh
chmod 700 /home/comptia/.ssh
chmod 600 /home/comptia/.ssh/authorized_keys

# Test login (from local machine)
# ssh comptia@YOUR_SERVER_IP
```

### Step 4: Configure Firewall

```bash
# Allow SSH
ufw allow OpenSSH

# Allow HTTP and HTTPS
ufw allow 'Nginx Full'

# Enable firewall
ufw enable

# Verify
ufw status verbose
```

### Step 5: Disable Root SSH Login

```bash
# Edit SSH config
nano /etc/ssh/sshd_config

# Find and change these lines:
# PermitRootLogin no
# PasswordAuthentication no

# Restart SSH
systemctl restart sshd
```

## Part 3: Install Software Stack

### Step 1: Install Node.js

```bash
# Add NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify
node --version  # Should show v18.x
npm --version   # Should show 9.x
```

### Step 2: Install PostgreSQL

```bash
# Install PostgreSQL 14
sudo apt install -y postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify
sudo systemctl status postgresql
```

### Step 3: Install Redis (Optional but Recommended)

```bash
# Install Redis
sudo apt install -y redis-server

# Configure Redis
sudo nano /etc/redis/redis.conf

# Change these settings:
# supervised systemd
# bind 127.0.0.1
# requirepass YOUR_REDIS_PASSWORD

# Restart Redis
sudo systemctl restart redis
sudo systemctl enable redis

# Test connection
redis-cli
# AUTH YOUR_REDIS_PASSWORD
# PING  # Should return PONG
# EXIT
```

### Step 4: Install Nginx

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify
sudo systemctl status nginx
curl http://localhost  # Should show Nginx welcome page
```

### Step 5: Install PM2 (Process Manager)

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify
pm2 --version
```

### Step 6: Install Certbot (SSL)

```bash
# Install Certbot and Nginx plugin
sudo apt install -y certbot python3-certbot-nginx

# Verify
certbot --version
```

## Part 4: Database Setup

### Step 1: Configure PostgreSQL

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE comptia_network_prod;

# Create user with strong password
CREATE USER comptia_admin WITH ENCRYPTED PASSWORD 'CHANGE_ME_STRONG_PASSWORD';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE comptia_network_prod TO comptia_admin;

# Exit
\q
```

### Step 2: Configure PostgreSQL for Remote Connections (Optional)

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf

# Find and uncomment:
# listen_addresses = 'localhost'  # For local only
# Or for remote (not recommended without proper security):
# listen_addresses = '*'

# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Add line for your application:
# local   all   comptia_admin   md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Step 3: Test Database Connection

```bash
# Test connection
psql -U comptia_admin -d comptia_network_prod -h localhost

# Should prompt for password and connect
# \q to exit
```

## Part 5: Deploy Application

### Step 1: Clone Repository

```bash
# Switch to comptia user
su - comptia

# Create apps directory
mkdir -p ~/apps
cd ~/apps

# Clone repository (replace with your repo)
git clone https://github.com/yourusername/comptia-network.git
cd comptia-network
```

### Step 2: Configure Backend

```bash
cd backend

# Install dependencies
npm install --production

# Create .env.production
cat > .env.production << 'EOF'
NODE_ENV=production
PORT=3001

# Database
DATABASE_URL=postgresql://comptia_admin:PASSWORD@localhost:5432/comptia_network_prod
DB_HOST=localhost
DB_PORT=5432
DB_NAME=comptia_network_prod
DB_USER=comptia_admin
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD
DB_SSL=false

# Redis (if installed)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=YOUR_REDIS_PASSWORD
REDIS_ENABLED=true

# Security - Generate these!
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

# Replace placeholders with actual values
nano .env.production

# Create logs directory
mkdir -p logs

# Build backend
npm run build
```

### Step 3: Run Migrations

```bash
# Run database migrations
npm run migrate

# Verify
psql -U comptia_admin -d comptia_network_prod -h localhost -c "\dt"

# (Optional) Seed demo data
npm run seed
```

### Step 4: Start Backend with PM2

```bash
# Start application
pm2 start dist/server.js --name comptia-backend --env production

# Save PM2 process list
pm2 save

# Configure PM2 to start on system boot
pm2 startup systemd -u comptia --hp /home/comptia
# Copy and run the command that PM2 outputs

# Verify
pm2 status
pm2 logs comptia-backend --lines 50
```

### Step 5: Test Backend

```bash
# Test health endpoint
curl http://localhost:3001/health

# Should return: {"status":"ok",...}
```

## Part 6: Deploy Frontend

### Step 1: Build Frontend

```bash
# Navigate to project root
cd ~/apps/comptia-network

# Create .env.production
cat > .env.production << 'EOF'
VITE_API_URL=https://api.yourdomain.com
VITE_USE_MOCK_API=false
VITE_ENV=production
EOF

# Install dependencies
npm install

# Build frontend
npm run build

# Verify build
ls -la dist/
```

### Step 2: Copy to Web Root

```bash
# Create web root directory
sudo mkdir -p /var/www/comptia-network

# Copy built files
sudo cp -r dist/* /var/www/comptia-network/

# Set permissions
sudo chown -R www-data:www-data /var/www/comptia-network
sudo chmod -R 755 /var/www/comptia-network
```

## Part 7: Configure Nginx

### Step 1: Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/comptia-network
```

Add this configuration (see complete file in repository: `docs/deployment/nginx.conf.example`):

```nginx
# Rate limiting
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

# Upstream backend
upstream backend {
    server localhost:3001;
    keepalive 32;
}

# Redirect HTTP to HTTPS (will be configured after SSL)
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com api.yourdomain.com;

    # Temporarily serve site for SSL certificate verification
    root /var/www/comptia-network;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}

# Will add HTTPS configuration after obtaining SSL certificate
```

### Step 2: Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/comptia-network /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 3: Verify

```bash
# Test site (should show your app)
curl http://YOUR_SERVER_IP
```

## Part 8: Configure DNS

Add these records at your domain registrar:

```
Type    Name    Value                   TTL
A       @       YOUR_SERVER_IP          3600
A       www     YOUR_SERVER_IP          3600
A       api     YOUR_SERVER_IP          3600
```

Wait 5-60 minutes for DNS propagation.

**Verify DNS:**

```bash
# Check DNS resolution
dig yourdomain.com +short
dig www.yourdomain.com +short
dig api.yourdomain.com +short

# Should all show YOUR_SERVER_IP
```

## Part 9: SSL Certificate (Let's Encrypt)

### Step 1: Obtain Certificate

```bash
# Obtain and install certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Follow prompts:
# 1. Enter email address
# 2. Agree to Terms of Service
# 3. Choose whether to share email with EFF
# 4. Select: Redirect HTTP to HTTPS (option 2)

# Certbot will automatically:
# - Obtain certificate
# - Update Nginx configuration
# - Set up auto-renewal
```

### Step 2: Update Nginx Configuration for API

```bash
sudo nano /etc/nginx/sites-available/comptia-network
```

Add after the HTTP server block:

```nginx
# Frontend (HTTPS)
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL configuration (managed by Certbot)
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Root directory
    root /var/www/comptia-network;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_comp_level 6;
    gzip_min_length 1000;

    # Frontend routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, immutable";
    }

    # Static assets (long cache)
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
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # API proxy
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

    # Health check (no rate limit)
    location /health {
        access_log off;
        proxy_pass http://backend;
    }
}
```

```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Step 3: Verify SSL

```bash
# Test HTTPS
curl -I https://yourdomain.com
curl https://api.yourdomain.com/health

# Check SSL certificate
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Step 4: Test Auto-Renewal

```bash
# Dry run renewal
sudo certbot renew --dry-run

# Check renewal timer
sudo systemctl status certbot.timer

# Certificates auto-renew every 60 days
```

## Part 10: Automated Backups

### Database Backup Script

```bash
# Create backup directory
mkdir -p ~/backups/database

# Create backup script
nano ~/backups/backup-db.sh
```

```bash
#!/bin/bash
# Database backup script

DATE=$(date +%Y-%m-%d-%H%M%S)
BACKUP_DIR="/home/comptia/backups/database"
DB_NAME="comptia_network_prod"
DB_USER="comptia_admin"
LOG_FILE="/home/comptia/backups/backup.log"

# Backup database
echo "$(date): Starting backup..." >> "$LOG_FILE"

pg_dump -U "$DB_USER" -d "$DB_NAME" -F c -f "$BACKUP_DIR/backup-$DATE.dump"

if [ $? -eq 0 ]; then
    echo "$(date): Backup successful: backup-$DATE.dump" >> "$LOG_FILE"
else
    echo "$(date): Backup FAILED!" >> "$LOG_FILE"
    exit 1
fi

# Compress old backups (older than 1 day)
find "$BACKUP_DIR" -name "backup-*.dump" -type f -mtime +1 -exec gzip {} \;

# Delete backups older than 30 days
find "$BACKUP_DIR" -name "backup-*.dump.gz" -type f -mtime +30 -delete

echo "$(date): Backup cleanup completed" >> "$LOG_FILE"
```

```bash
# Make executable
chmod +x ~/backups/backup-db.sh

# Test backup
~/backups/backup-db.sh

# Schedule with cron
crontab -e

# Add line: Daily backup at 2 AM
0 2 * * * /home/comptia/backups/backup-db.sh
```

### Application Backup Script

```bash
nano ~/backups/backup-app.sh
```

```bash
#!/bin/bash
# Application files backup

DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/home/comptia/backups/app"
LOG_FILE="/home/comptia/backups/backup.log"

mkdir -p "$BACKUP_DIR"

echo "$(date): Starting application backup..." >> "$LOG_FILE"

# Backup application directory and configs
tar -czf "$BACKUP_DIR/app-$DATE.tar.gz" \
    /home/comptia/apps/comptia-network \
    /var/www/comptia-network \
    /etc/nginx/sites-available/comptia-network \
    /home/comptia/.pm2 2>/dev/null

if [ $? -eq 0 ]; then
    echo "$(date): Application backup successful: app-$DATE.tar.gz" >> "$LOG_FILE"
else
    echo "$(date): Application backup FAILED!" >> "$LOG_FILE"
fi

# Delete backups older than 14 days
find "$BACKUP_DIR" -name "app-*.tar.gz" -type f -mtime +14 -delete

echo "$(date): Application backup cleanup completed" >> "$LOG_FILE"
```

```bash
chmod +x ~/backups/backup-app.sh

# Add to cron: Weekly on Sundays at 3 AM
crontab -e
0 3 * * 0 /home/comptia/backups/backup-app.sh
```

### Backup to Remote Storage (Optional)

```bash
# Install rclone for cloud storage sync
curl https://rclone.org/install.sh | sudo bash

# Configure rclone (interactive)
rclone config
# Follow prompts to add remote storage (S3, Google Drive, etc.)

# Add to backup scripts:
# rclone sync ~/backups remote:comptia-backups
```

## Part 11: Monitoring

### System Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Real-time monitoring
htop           # CPU, memory, processes
iotop          # Disk I/O
nethogs        # Network usage
```

### Application Monitoring

```bash
# PM2 monitoring
pm2 monit      # Real-time monitoring
pm2 status     # Process status
pm2 logs       # View logs

# Install PM2 log rotation
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Log Management

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

/var/log/nginx/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        systemctl reload nginx
    endscript
}
```

### Uptime Monitoring

Use external service:

- [UptimeRobot](https://uptimerobot.com) (Free)
- [Pingdom](https://pingdom.com)
- [StatusCake](https://statuscake.com)

Monitor:

- `https://yourdomain.com`
- `https://api.yourdomain.com/health`

## Part 12: Security Hardening

### Install Fail2Ban

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Create local config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local

# Configure SSH protection:
# [sshd]
# enabled = true
# port = ssh
# logpath = /var/log/auth.log
# maxretry = 3
# bantime = 3600

# Add Nginx protection
sudo nano /etc/fail2ban/jail.d/nginx.conf
```

```ini
[nginx-http-auth]
enabled = true
filter = nginx-http-auth
port = http,https
logpath = /var/log/nginx/error.log

[nginx-limit-req]
enabled = true
filter = nginx-limit-req
port = http,https
logpath = /var/log/nginx/error.log

[nginx-botsearch]
enabled = true
filter = nginx-botsearch
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 2
```

```bash
# Restart Fail2Ban
sudo systemctl restart fail2ban

# Check status
sudo fail2ban-client status
```

### Enable Automatic Security Updates

```bash
# Install unattended-upgrades
sudo apt install -y unattended-upgrades

# Configure
sudo dpkg-reconfigure -plow unattended-upgrades

# Enable automatic updates
sudo systemctl enable unattended-upgrades
sudo systemctl start unattended-upgrades
```

### Secure PostgreSQL

```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Ensure only local connections:
# local   all   all   peer
# host    all   all   127.0.0.1/32   md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Additional Security

```bash
# Disable unused services
sudo systemctl disable bluetooth
sudo systemctl disable cups

# Regular security audits
sudo apt install -y lynis
sudo lynis audit system

# Check open ports
sudo netstat -tulpn
sudo ss -tulpn
```

## Part 13: Performance Optimization

### Nginx Optimization

```bash
sudo nano /etc/nginx/nginx.conf
```

Optimize these settings:

```nginx
# Increase worker processes
worker_processes auto;

# Increase worker connections
events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

# Enable caching
http {
    # Enable caching
    proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=app_cache:10m max_size=1g inactive=60m use_temp_path=off;

    # Gzip settings
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    # File descriptor cache
    open_file_cache max=10000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;

    # Buffer sizes
    client_body_buffer_size 128k;
    client_max_body_size 10m;
    client_header_buffer_size 1k;
    large_client_header_buffers 4 4k;
    output_buffers 1 32k;
    postpone_output 1460;
}
```

### PostgreSQL Optimization

```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

Optimize for your RAM (example for 4GB RAM):

```conf
# Memory settings (for 4GB RAM)
shared_buffers = 1GB
effective_cache_size = 3GB
maintenance_work_mem = 256MB
work_mem = 5MB

# Checkpoint settings
checkpoint_completion_target = 0.9
wal_buffers = 16MB
max_wal_size = 2GB
min_wal_size = 1GB

# Query planner
random_page_cost = 1.1
effective_io_concurrency = 200

# Logging
log_min_duration_statement = 1000
```

```bash
sudo systemctl restart postgresql
```

### PM2 Cluster Mode

```bash
# Use cluster mode for better performance
pm2 delete comptia-backend
pm2 start dist/server.js --name comptia-backend -i max --env production
pm2 save
```

## Part 14: Updates and Maintenance

### Regular Update Script

```bash
nano ~/maintenance/system-update.sh
```

```bash
#!/bin/bash
# System maintenance script

LOG_FILE="/home/comptia/maintenance/update.log"

echo "$(date): Starting system maintenance..." >> "$LOG_FILE"

# Update package lists
sudo apt update >> "$LOG_FILE" 2>&1

# Upgrade packages
sudo apt upgrade -y >> "$LOG_FILE" 2>&1

# Clean up
sudo apt autoremove -y >> "$LOG_FILE" 2>&1
sudo apt autoclean >> "$LOG_FILE" 2>&1

# Restart services if needed
sudo systemctl restart nginx >> "$LOG_FILE" 2>&1
pm2 reload all >> "$LOG_FILE" 2>&1

echo "$(date): System maintenance completed" >> "$LOG_FILE"
```

### Application Update Script

```bash
nano ~/maintenance/app-update.sh
```

```bash
#!/bin/bash
# Application update script

cd /home/comptia/apps/comptia-network

# Pull latest code
git pull origin main

# Update backend
cd backend
npm install --production
npm run build
pm2 reload comptia-backend

# Update frontend
cd ..
npm install
npm run build
sudo rm -rf /var/www/comptia-network/*
sudo cp -r dist/* /var/www/comptia-network/
sudo chown -R www-data:www-data /var/www/comptia-network

# Reload Nginx
sudo systemctl reload nginx

echo "Application updated successfully"
```

## Troubleshooting

### Application Not Starting

```bash
# Check PM2 status
pm2 status
pm2 logs comptia-backend --lines 100

# Check if port is in use
sudo netstat -tulpn | grep 3001

# Restart application
pm2 restart comptia-backend
```

### Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connections
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity;"

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### Nginx Issues

```bash
# Check Nginx status
sudo systemctl status nginx

# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

### High Memory Usage

```bash
# Check memory
free -h

# Find memory-intensive processes
ps aux --sort=-%mem | head -20

# Restart services
pm2 reload all
sudo systemctl restart nginx
```

### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Test renewal
sudo certbot renew --dry-run

# Force renewal
sudo certbot renew --force-renewal
```

## Cost Analysis

**VPS Options:**

- **Budget**: Contabo VPS S (€4.99/month) - 8GB RAM, 4 cores
- **Recommended**: Hetzner CX21 (€4.90/month) - 4GB RAM, 2 cores
- **Performance**: Hetzner CX41 (€15.90/month) - 16GB RAM, 4 cores

**Additional Costs:**

- Domain: $10-15/year
- Backup storage (optional): $5-10/month
- Monitoring (optional): Free - $20/month

**Total: $5-30/month depending on requirements**

---

**Deployment Status:** Production Ready ✅
**Last Updated:** 2025-10-29
