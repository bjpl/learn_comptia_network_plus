# Deployment Guide - CompTIA Network+ Learning Platform Backend

## Table of Contents
1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Development Deployment](#development-deployment)
4. [Production Deployment](#production-deployment)
5. [Database Management](#database-management)
6. [Monitoring](#monitoring)
7. [Rollback Procedures](#rollback-procedures)
8. [Troubleshooting](#troubleshooting)

## Overview

This guide covers deploying the CompTIA Network+ Learning Platform backend using Docker and Docker Compose. The platform uses:
- Node.js 20 (Backend API)
- PostgreSQL 16 (Database)
- Redis 7 (Caching/Sessions)
- Nginx (Reverse Proxy)

## Prerequisites

### Required Software
- Docker Engine 24.0+
- Docker Compose 2.20+
- Git
- OpenSSL (for SSL certificates)

### Required Credentials
- Database credentials
- JWT secret keys
- API keys (if using external services)
- SSL certificates (production)

## Development Deployment

### 1. Clone Repository
```bash
git clone https://github.com/your-org/comptia-network-plus.git
cd comptia-network-plus/backend
```

### 2. Configure Environment
```bash
# Copy example environment file
cp .env.example .env

# Edit environment variables
nano .env
```

Required environment variables:
```bash
NODE_ENV=development
DB_PASSWORD=strong_password_here
REDIS_PASSWORD=strong_redis_password
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
```

### 3. Start Development Environment
```bash
# Option 1: Use convenience script
chmod +x scripts/start-dev.sh
./scripts/start-dev.sh

# Option 2: Manual docker-compose
docker-compose up -d postgres redis
docker-compose --profile dev up backend-dev
```

### 4. Verify Deployment
```bash
# Check service status
docker-compose ps

# Check logs
docker-compose logs -f backend-dev

# Test API endpoint
curl http://localhost:3000/health
```

## Production Deployment

### 1. Prepare Environment

#### Create Production Environment File
```bash
cp .env.production.template .env.production
nano .env.production
```

#### Generate Secure Secrets
```bash
# Generate JWT secret
openssl rand -base64 64

# Generate session secret
openssl rand -base64 32
```

### 2. SSL Certificate Setup

#### Option A: Let's Encrypt (Recommended)
```bash
# Install certbot
sudo apt-get install certbot

# Generate certificate
sudo certbot certonly --standalone -d api.yourdomai.com

# Copy certificates
sudo cp /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem backend/config/ssl/cert.pem
sudo cp /etc/letsencrypt/live/api.yourdomain.com/privkey.pem backend/config/ssl/key.pem
```

#### Option B: Self-Signed (Testing)
```bash
mkdir -p config/ssl
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout config/ssl/key.pem \
  -out config/ssl/cert.pem
```

### 3. Build Production Images
```bash
chmod +x scripts/build-prod.sh
./scripts/build-prod.sh
```

### 4. Deploy to Production
```bash
# Load environment
export $(cat .env.production | grep -v '^#' | xargs)

# Start services with production config
docker-compose -f docker-compose.prod.yml up -d

# Check deployment
docker-compose -f docker-compose.prod.yml ps
```

### 5. Run Database Migrations
```bash
./scripts/run-migrations.sh
```

### 6. Verify Production Deployment
```bash
# Health check
curl -k https://api.yourdomain.com/health

# Check logs
docker-compose -f docker-compose.prod.yml logs -f backend

# Monitor resources
docker stats
```

## Database Management

### Create Backup
```bash
./scripts/backup-db.sh
```

Backups are stored in `./backups/` with timestamp:
```
comptia_network_backup_20241029_143022.sql.gz
```

### Restore Database
```bash
# List available backups
ls -lh backups/

# Restore specific backup
./scripts/restore-db.sh comptia_network_backup_20241029_143022.sql.gz
```

### Manual Database Operations

#### Connect to Database
```bash
docker-compose exec postgres psql -U postgres -d comptia_network
```

#### Export Schema Only
```bash
docker-compose exec -T postgres pg_dump \
  -U postgres -d comptia_network \
  --schema-only > schema.sql
```

#### Import Data
```bash
docker-compose exec -T postgres psql \
  -U postgres -d comptia_network < data.sql
```

## Monitoring

### Health Checks
```bash
# Application health
curl https://api.yourdomain.com/health

# Service readiness
curl https://api.yourdomain.com/api/v1/health/readiness

# Database connection
docker-compose exec postgres pg_isready
```

### Log Monitoring
```bash
# Real-time logs
docker-compose logs -f backend

# Last 100 lines
docker-compose logs --tail=100 backend

# Logs since 1 hour ago
docker-compose logs --since 1h backend

# Application logs (inside container)
docker-compose exec backend tail -f logs/app.log
```

### Resource Monitoring
```bash
# Container stats
docker stats

# Disk usage
docker system df

# Detailed container info
docker-compose ps
docker inspect comptia-backend
```

### Database Monitoring
```bash
# Active connections
docker-compose exec postgres psql -U postgres -c \
  "SELECT count(*) FROM pg_stat_activity;"

# Database size
docker-compose exec postgres psql -U postgres -c \
  "SELECT pg_size_pretty(pg_database_size('comptia_network'));"

# Slow queries
docker-compose exec postgres psql -U postgres -c \
  "SELECT query, calls, total_time, mean_time
   FROM pg_stat_statements
   ORDER BY mean_time DESC
   LIMIT 10;"
```

## Rollback Procedures

### Application Rollback

#### Option 1: Previous Docker Image
```bash
# List available images
docker images | grep comptia-backend

# Stop current deployment
docker-compose down

# Deploy previous version
docker tag comptia-backend:v1.0.0 comptia-backend:latest
docker-compose up -d
```

#### Option 2: Git Rollback
```bash
# Find previous commit
git log --oneline

# Checkout previous version
git checkout <commit-hash>

# Rebuild and deploy
./scripts/build-prod.sh
docker-compose -f docker-compose.prod.yml up -d
```

### Database Rollback
```bash
# Restore from backup
./scripts/restore-db.sh comptia_network_backup_YYYYMMDD_HHMMSS.sql.gz

# Verify restoration
docker-compose exec postgres psql -U postgres -d comptia_network -c \
  "SELECT COUNT(*) FROM users;"
```

## Troubleshooting

### Common Issues

#### 1. Container Won't Start
```bash
# Check logs
docker-compose logs backend

# Check configuration
docker-compose config

# Verify environment variables
docker-compose exec backend env | grep DB_
```

#### 2. Database Connection Failed
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres pg_isready

# Check network
docker network ls
docker network inspect backend_backend-network
```

#### 3. High Memory Usage
```bash
# Check container stats
docker stats comptia-backend

# Inspect logs for memory leaks
docker-compose logs backend | grep -i "memory\|heap"

# Restart service
docker-compose restart backend
```

#### 4. Slow Performance
```bash
# Check database performance
docker-compose exec postgres psql -U postgres -c \
  "SELECT * FROM pg_stat_activity WHERE state = 'active';"

# Check Redis cache
docker-compose exec redis redis-cli INFO stats

# Analyze nginx logs
docker-compose exec nginx cat /var/log/nginx/access.log | \
  awk '{print $9}' | sort | uniq -c | sort -rn
```

#### 5. SSL Certificate Issues
```bash
# Verify certificate
openssl x509 -in config/ssl/cert.pem -text -noout

# Check certificate expiry
openssl x509 -in config/ssl/cert.pem -noout -dates

# Test SSL connection
openssl s_client -connect api.yourdomain.com:443
```

### Emergency Procedures

#### Complete System Restart
```bash
# Stop all services
docker-compose down

# Remove volumes (CAUTION: Data loss!)
docker-compose down -v

# Start fresh
docker-compose up -d
./scripts/run-migrations.sh
```

#### Data Recovery
```bash
# List backups
ls -lh backups/

# Restore latest backup
LATEST_BACKUP=$(ls -t backups/comptia_network_backup_*.sql.gz | head -1)
./scripts/restore-db.sh $(basename $LATEST_BACKUP)
```

## Performance Optimization

### Database Optimization
```sql
-- Analyze tables
ANALYZE;

-- Vacuum database
VACUUM FULL;

-- Update statistics
VACUUM ANALYZE;
```

### Cache Optimization
```bash
# Clear Redis cache
docker-compose exec redis redis-cli FLUSHALL

# Monitor cache hit rate
docker-compose exec redis redis-cli INFO stats | grep hit
```

### Container Optimization
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove build cache
docker builder prune
```

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files
2. **Secrets Management**: Use Docker secrets in production
3. **SSL/TLS**: Always use HTTPS in production
4. **Database**: Use strong passwords, enable SSL
5. **Updates**: Regular security updates
6. **Monitoring**: Enable intrusion detection
7. **Backups**: Automated daily backups
8. **Access Control**: Limit SSH and database access

## Support

For issues and questions:
- GitHub Issues: https://github.com/your-org/comptia-network-plus/issues
- Documentation: https://docs.yourdomain.com
- Email: support@yourdomain.com
