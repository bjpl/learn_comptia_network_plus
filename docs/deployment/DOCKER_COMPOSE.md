# Deployment Guide: Docker Compose

**Recommended for:** Containerized environments, reproducible deployments, development/production parity

**Estimated Time:** 30-60 minutes
**Cost:** Variable (depends on hosting)
**Difficulty:** Medium ⭐⭐

## Overview

Deploy using Docker Compose for:
- **Consistent environments** across dev, staging, production
- **Easy scaling** with Docker Swarm or Kubernetes
- **Portable deployments** across any Docker-compatible host
- **Isolated services** with container networking

### Architecture

```
┌──────────────────┐
│   Nginx Proxy    │ ← Port 80/443
│  (SSL, routing)  │
└────────┬─────────┘
         │
    ┌────┴────┐
    │         │
┌───▼────┐ ┌─▼────────┐
│Frontend│ │  Backend │ ← Container replicas
│ (Nginx)│ │ (Node.js)│
└────────┘ └─────┬────┘
                 │
          ┌──────┴─────┬──────────┐
          │            │          │
     ┌────▼───┐  ┌─────▼────┐ ┌──▼──────┐
     │Postgres│  │  Redis   │ │ Volumes │
     └────────┘  └──────────┘ └─────────┘
```

## Prerequisites

- Docker 20.10+ installed
- Docker Compose v2.0+ installed
- Domain name (for production)
- 2GB RAM minimum (4GB recommended)

## Part 1: Install Docker

### Ubuntu/Debian

```bash
# Update packages
sudo apt update

# Install dependencies
sudo apt install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Verify installation
docker --version
docker compose version

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Test Docker
docker run hello-world
```

### macOS

```bash
# Install Docker Desktop
brew install --cask docker

# Or download from https://www.docker.com/products/docker-desktop/

# Verify
docker --version
docker compose version
```

### Windows

Download Docker Desktop from [docker.com](https://www.docker.com/products/docker-desktop/)

## Part 2: Project Structure

Your project should have this structure:

```
comptia-network/
├── docker-compose.yml
├── docker-compose.prod.yml
├── docker-compose.dev.yml
├── .env.production
├── frontend/
│   ├── Dockerfile
│   └── nginx.conf
├── backend/
│   ├── Dockerfile
│   ├── Dockerfile.prod
│   └── .env.production
└── nginx/
    └── nginx.conf
```

## Part 3: Docker Configuration Files

### Step 1: Backend Dockerfile

Create `backend/Dockerfile.prod`:

```dockerfile
# Multi-stage build for production
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 nodejs && \
    adduser -u 1001 -G nodejs -s /bin/sh -D nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start application
CMD ["node", "dist/server.js"]
```

### Step 2: Frontend Dockerfile

Create `frontend/Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Build application
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

# Production stage
FROM nginx:alpine

# Copy custom nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

# Create health endpoint
RUN echo "OK" > /usr/share/nginx/html/health

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### Step 3: Frontend Nginx Configuration

Create `frontend/nginx.conf`:

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;

    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript application/json application/javascript application/xml+rss application/rss+xml font/truetype font/opentype application/vnd.ms-fontobject image/svg+xml;

    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        # Security headers
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # SPA routing
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

        # Health check
        location /health {
            access_log off;
            return 200 "OK\n";
            add_header Content-Type text/plain;
        }
    }
}
```

### Step 4: Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:14-alpine
    restart: always
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres-data:/var/lib/postgresql/data
      - ./backend/database/init:/docker-entrypoint-initdb.d:ro
    networks:
      - backend-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${DB_USER} -d ${DB_NAME}"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "5"

  redis:
    image: redis:7-alpine
    restart: always
    command: >
      redis-server
      --appendonly yes
      --requirepass ${REDIS_PASSWORD}
      --maxmemory 512mb
      --maxmemory-policy allkeys-lru
    volumes:
      - redis-data:/data
    networks:
      - backend-network
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "${REDIS_PASSWORD}", "ping"]
      interval: 30s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.prod
      args:
        NODE_ENV: production
    restart: always
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      NODE_ENV: production
      PORT: 3001
      DB_HOST: postgres
      DB_PORT: 5432
      DB_NAME: ${DB_NAME}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_SSL: "false"
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: ${REDIS_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
      REFRESH_TOKEN_SECRET: ${REFRESH_TOKEN_SECRET}
      SESSION_SECRET: ${SESSION_SECRET}
      JWT_EXPIRES_IN: ${JWT_EXPIRES_IN:-1h}
      CORS_ORIGIN: ${CORS_ORIGIN}
      API_RATE_LIMIT: ${API_RATE_LIMIT:-100}
      LOG_LEVEL: ${LOG_LEVEL:-info}
    volumes:
      - backend-logs:/app/logs
    networks:
      - backend-network
      - frontend-network
    deploy:
      replicas: ${BACKEND_REPLICAS:-2}
      resources:
        limits:
          cpus: '1'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "10"

  frontend:
    build:
      context: .
      dockerfile: frontend/Dockerfile
      args:
        VITE_API_URL: ${VITE_API_URL}
    restart: always
    depends_on:
      - backend
    networks:
      - frontend-network
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

  nginx:
    image: nginx:alpine
    restart: always
    depends_on:
      - frontend
      - backend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - nginx-cache:/var/cache/nginx
    networks:
      - frontend-network
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost/health"]
      interval: 30s
      timeout: 5s
      retries: 3
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "10"

volumes:
  postgres-data:
    driver: local
  redis-data:
    driver: local
  backend-logs:
    driver: local
  nginx-cache:
    driver: local

networks:
  backend-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.20.0.0/16
  frontend-network:
    driver: bridge
    ipam:
      config:
        - subnet: 172.21.0.0/16
```

### Step 5: Environment Configuration

Create `.env.production`:

```env
# Application
PROJECT_NAME=comptia-network
ENVIRONMENT=production
DOMAIN=yourdomain.com

# Database
DB_NAME=comptia_network_prod
DB_USER=comptia_admin
DB_PASSWORD=CHANGE_ME_STRONG_PASSWORD

# Redis
REDIS_PASSWORD=CHANGE_ME_REDIS_PASSWORD

# Backend
JWT_SECRET=CHANGE_ME_JWT_SECRET
REFRESH_TOKEN_SECRET=CHANGE_ME_REFRESH_SECRET
SESSION_SECRET=CHANGE_ME_SESSION_SECRET
JWT_EXPIRES_IN=1h

# CORS
CORS_ORIGIN=https://yourdomain.com

# Rate Limiting
API_RATE_LIMIT=100

# Logging
LOG_LEVEL=info

# Scaling
BACKEND_REPLICAS=2

# Frontend
VITE_API_URL=https://api.yourdomain.com
```

### Step 6: Nginx Proxy Configuration

Create `nginx/nginx.conf`:

```nginx
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 2048;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

    # Upstream services
    upstream frontend {
        least_conn;
        server frontend:80 max_fails=3 fail_timeout=30s;
    }

    upstream backend {
        least_conn;
        server backend:3001 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name _;
        return 301 https://$host$request_uri;
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        # SSL Configuration
        ssl_certificate /etc/nginx/ssl/fullchain.pem;
        ssl_certificate_key /etc/nginx/ssl/privkey.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security Headers
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
        add_header X-Frame-Options "DENY" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;

        # Gzip
        gzip on;
        gzip_vary on;
        gzip_proxied any;
        gzip_comp_level 6;
        gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # Backend API
        location /api {
            limit_req zone=api_limit burst=20 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "OK\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## Part 4: Deployment

### Step 1: Generate Secrets

```bash
# Generate strong secrets
cat > .env.production << EOF
# Database
DB_NAME=comptia_network_prod
DB_USER=comptia_admin
DB_PASSWORD=$(openssl rand -base64 32 | tr -d "/@'\"")

# Redis
REDIS_PASSWORD=$(openssl rand -base64 32 | tr -d "/@'\"")

# JWT
JWT_SECRET=$(openssl rand -base64 32)
REFRESH_TOKEN_SECRET=$(openssl rand -base64 32)
SESSION_SECRET=$(openssl rand -base64 32)
JWT_EXPIRES_IN=1h

# CORS
CORS_ORIGIN=https://yourdomain.com

# API
API_RATE_LIMIT=100
LOG_LEVEL=info
BACKEND_REPLICAS=2

# Frontend
VITE_API_URL=https://api.yourdomain.com
DOMAIN=yourdomain.com
EOF
```

### Step 2: Build Images

```bash
# Build all services
docker compose -f docker-compose.prod.yml build

# Or build individually
docker compose -f docker-compose.prod.yml build backend
docker compose -f docker-compose.prod.yml build frontend
```

### Step 3: Deploy

```bash
# Start all services
docker compose -f docker-compose.prod.yml up -d

# View logs
docker compose -f docker-compose.prod.yml logs -f

# Check status
docker compose -f docker-compose.prod.yml ps
```

### Step 4: Run Database Migrations

```bash
# Run migrations in backend container
docker compose -f docker-compose.prod.yml exec backend npm run migrate

# Or run manually
docker compose -f docker-compose.prod.yml exec backend sh
npm run migrate
exit
```

### Step 5: Verify Deployment

```bash
# Check all services are healthy
docker compose -f docker-compose.prod.yml ps

# Test backend health
curl http://localhost/api/health

# Test frontend
curl -I http://localhost
```

## Part 5: SSL Certificate

### Option 1: Using Certbot in Container

```bash
# Run Certbot container
docker run -it --rm \
  -v $(pwd)/nginx/ssl:/etc/letsencrypt \
  -v $(pwd)/.well-known:/var/www/html/.well-known \
  certbot/certbot certonly \
  --webroot \
  --webroot-path=/var/www/html \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email \
  -d yourdomain.com \
  -d www.yourdomain.com

# Copy certificates
cp nginx/ssl/live/yourdomain.com/fullchain.pem nginx/ssl/
cp nginx/ssl/live/yourdomain.com/privkey.pem nginx/ssl/

# Restart nginx
docker compose -f docker-compose.prod.yml restart nginx
```

### Option 2: Using Let's Encrypt on Host

```bash
# Install Certbot on host
sudo apt install certbot

# Obtain certificate
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# Copy certificates to project
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem nginx/ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem nginx/ssl/
sudo chown $USER:$USER nginx/ssl/*.pem

# Restart nginx
docker compose -f docker-compose.prod.yml restart nginx
```

## Part 6: Monitoring

### View Logs

```bash
# All services
docker compose -f docker-compose.prod.yml logs -f

# Specific service
docker compose -f docker-compose.prod.yml logs -f backend

# Last 100 lines
docker compose -f docker-compose.prod.yml logs --tail=100
```

### Container Stats

```bash
# Real-time stats
docker stats

# Or with compose
docker compose -f docker-compose.prod.yml stats
```

### Health Checks

```bash
# Check health status
docker compose -f docker-compose.prod.yml ps

# Inspect health
docker inspect --format='{{json .State.Health}}' <container_id> | jq
```

## Part 7: Backups

### Database Backup Script

Create `scripts/backup-docker.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d-%H%M%S)
BACKUP_DIR="./backups/database"
mkdir -p $BACKUP_DIR

# Backup PostgreSQL
docker compose -f docker-compose.prod.yml exec -T postgres pg_dump \
  -U comptia_admin \
  -d comptia_network_prod \
  -F c \
  > "$BACKUP_DIR/backup-$DATE.dump"

echo "Backup created: backup-$DATE.dump"

# Compress old backups
find "$BACKUP_DIR" -name "backup-*.dump" -mtime +1 -exec gzip {} \;

# Delete old backups
find "$BACKUP_DIR" -name "backup-*.dump.gz" -mtime +30 -delete
```

```bash
chmod +x scripts/backup-docker.sh

# Schedule with cron
crontab -e
0 2 * * * /path/to/scripts/backup-docker.sh
```

### Volume Backup

```bash
# Backup all volumes
docker run --rm \
  -v comptia-network_postgres-data:/data \
  -v $(pwd)/backups/volumes:/backup \
  alpine tar czf /backup/postgres-data-$(date +%Y%m%d).tar.gz -C /data .

# Restore volume
docker run --rm \
  -v comptia-network_postgres-data:/data \
  -v $(pwd)/backups/volumes:/backup \
  alpine tar xzf /backup/postgres-data-20251029.tar.gz -C /data
```

## Part 8: Scaling

### Scale Services

```bash
# Scale backend
docker compose -f docker-compose.prod.yml up -d --scale backend=4

# Scale frontend
docker compose -f docker-compose.prod.yml up -d --scale frontend=3
```

### Docker Swarm (Production)

```bash
# Initialize Swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.prod.yml comptia-network

# Scale services
docker service scale comptia-network_backend=4

# View services
docker service ls

# View service logs
docker service logs -f comptia-network_backend
```

## Part 9: CI/CD

### GitHub Actions

Create `.github/workflows/deploy-docker.yml`:

```yaml
name: Build and Deploy Docker

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Build images
        run: docker compose -f docker-compose.prod.yml build

      - name: Login to Registry
        run: echo "${{ secrets.REGISTRY_PASSWORD }}" | docker login -u "${{ secrets.REGISTRY_USERNAME }}" --password-stdin

      - name: Push images
        run: |
          docker tag comptia-network-backend:latest registry.yourdomain.com/backend:latest
          docker tag comptia-network-frontend:latest registry.yourdomain.com/frontend:latest
          docker push registry.yourdomain.com/backend:latest
          docker push registry.yourdomain.com/frontend:latest

      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/comptia-network
            docker compose -f docker-compose.prod.yml pull
            docker compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Containers Not Starting

```bash
# View logs
docker compose -f docker-compose.prod.yml logs

# Check specific container
docker logs <container_name>

# Inspect container
docker inspect <container_name>
```

### Database Connection Issues

```bash
# Check database is running
docker compose -f docker-compose.prod.yml ps postgres

# Connect to database
docker compose -f docker-compose.prod.yml exec postgres psql -U comptia_admin -d comptia_network_prod

# Check network
docker network inspect comptia-network_backend-network
```

### High Memory Usage

```bash
# Check container resource usage
docker stats

# Set memory limits in docker-compose.prod.yml:
# deploy:
#   resources:
#     limits:
#       memory: 512M
```

### Restart Services

```bash
# Restart all
docker compose -f docker-compose.prod.yml restart

# Restart specific service
docker compose -f docker-compose.prod.yml restart backend

# Recreate containers
docker compose -f docker-compose.prod.yml up -d --force-recreate
```

## Security Best Practices

1. **Use non-root users** in Dockerfiles
2. **Scan images** for vulnerabilities:
   ```bash
   docker scan comptia-network-backend
   ```
3. **Use secrets management**:
   ```yaml
   # docker-compose.prod.yml
   secrets:
     db_password:
       file: ./secrets/db_password.txt
   services:
     backend:
       secrets:
         - db_password
   ```
4. **Enable Docker security scanning**
5. **Keep images updated**
6. **Use minimal base images** (alpine)

## Performance Optimization

1. **Multi-stage builds** (already implemented)
2. **Layer caching** - order COPY commands efficiently
3. **Use .dockerignore**:
   ```
   node_modules
   npm-debug.log
   .git
   .env*
   dist
   ```
4. **Enable BuildKit**:
   ```bash
   DOCKER_BUILDKIT=1 docker compose build
   ```

---

**Deployment Status:** Production Ready ✅
**Last Updated:** 2025-10-29
