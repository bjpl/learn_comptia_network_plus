# Docker & CI/CD Quick Start Guide

## CompTIA Network+ Learning Platform

This guide provides quick commands to get started with Docker and CI/CD.

---

## Quick Start Commands

### Development Environment (Backend Only)

```bash
# Start development environment
cd backend
./scripts/docker-dev.sh

# Or manually
docker-compose up -d

# Access services
# Backend API: http://localhost:3001
# PostgreSQL: localhost:5432
# Redis: localhost:6379
# Adminer (DB UI): http://localhost:8080
```

### Production Environment (Full Stack)

```bash
# Build production images
cd backend
./scripts/docker-prod.sh

# Start full stack
cd ..
docker-compose up -d

# Access services
# Frontend: http://localhost:80
# Backend API: http://localhost:3001
```

### Common Operations

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart a service
docker-compose restart backend

# Remove everything (including volumes)
docker-compose down -v
```

---

## Database Operations

### Backup

```bash
cd backend
./scripts/backup-db.sh
```

Backup saved to: `backend/backups/comptia_network_YYYYMMDD_HHMMSS.sql.gz`

### Restore

```bash
cd backend
./scripts/restore-db.sh backups/comptia_network_20251029_120000.sql.gz
```

### Migrations

```bash
cd backend
./scripts/migrate.sh
```

---

## Testing Docker Setup

### Test Backend Build

```bash
cd backend
docker build -t comptia-backend:test .
docker run --rm -d --name test-backend -p 3002:3001 \
  -e NODE_ENV=production \
  -e DATABASE_URL=postgresql://admin:test@localhost:5432/test \
  -e JWT_SECRET=test_secret \
  comptia-backend:test

# Test health endpoint
curl http://localhost:3002/api/health

# Cleanup
docker stop test-backend
docker rm test-backend
```

### Test Frontend Build

```bash
docker build -t comptia-frontend:test .
docker run --rm -d --name test-frontend -p 8080:80 comptia-frontend:test

# Test frontend
curl http://localhost:8080/

# Cleanup
docker stop test-frontend
docker rm test-frontend
```

### Test Full Stack

```bash
# Start all services
docker-compose up -d

# Wait for health checks
sleep 30

# Test backend
curl http://localhost:3001/api/health

# Test frontend
curl http://localhost/

# Test database
docker-compose exec postgres pg_isready -U admin

# Test redis
docker-compose exec redis redis-cli ping

# Stop all services
docker-compose down
```

---

## CI/CD Workflows

### Workflows Overview

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Runs on: Push to main/develop, PRs
   - Tests: Frontend, Backend, Integration, Security
   - Duration: ~5-10 minutes

2. **CD Pipeline** (`.github/workflows/cd.yml`)
   - Runs on: Push to main, version tags
   - Deploys to: Staging, Production
   - Creates: Docker images, GitHub releases

3. **Docker Build** (`.github/workflows/docker-build.yml`)
   - Runs on: Dockerfile changes
   - Tests: Build, Security scan, Size report
   - Duration: ~3-5 minutes

### Trigger Manual Deployment

```bash
# Via GitHub CLI
gh workflow run cd.yml -f environment=production

# Via GitHub UI
# Actions → CD Pipeline → Run workflow → Select environment
```

### View Workflow Status

```bash
# List recent runs
gh run list

# View specific run
gh run view <run-id>

# View logs
gh run view <run-id> --log
```

---

## Environment Variables

### Required for Development

Create `backend/.env`:

```bash
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://admin:changeme@postgres:5432/comptia_network
REDIS_URL=redis://redis:6379
JWT_SECRET=dev_secret_change_in_production
JWT_EXPIRES_IN=7d
BCRYPT_ROUNDS=10
LOG_LEVEL=debug
```

### Required for Production

Create `.env` in root:

```bash
NODE_ENV=production
JWT_SECRET=<generate-with-openssl-rand>
POSTGRES_PASSWORD=<generate-with-openssl-rand>
REDIS_PASSWORD=<generate-with-openssl-rand>
```

Generate secure secrets:

```bash
openssl rand -base64 32
```

---

## GitHub Secrets Setup

Required secrets for CI/CD:

### Repository Secrets

```
JWT_SECRET - JWT signing secret
DATABASE_URL - Production database URL
POSTGRES_PASSWORD - Database password
REDIS_URL - Redis connection string
REDIS_PASSWORD - Redis password
```

### How to Add Secrets

1. Go to repository Settings → Secrets and variables → Actions
2. Click "New repository secret"
3. Add name and value
4. Click "Add secret"

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Check container status
docker-compose ps

# Verify environment
docker-compose config
```

### Port Already in Use

```bash
# Find process using port (Linux/Mac)
lsof -i :3001

# Find process using port (Windows)
netstat -ano | findstr :3001

# Kill process or use different port
docker-compose run -p 3002:3001 backend
```

### Database Connection Failed

```bash
# Check postgres is running
docker-compose ps postgres

# Test connection
docker-compose exec postgres pg_isready -U admin

# Check network
docker network inspect backend_backend-network
```

### Build Fails

```bash
# Clear Docker cache
docker builder prune

# Rebuild without cache
docker-compose build --no-cache

# Check disk space
docker system df
```

### Reset Everything

```bash
# Stop and remove everything
docker-compose down -v --rmi all

# Clean Docker system
docker system prune -a --volumes

# Start fresh
docker-compose up --build -d
```

---

## Monitoring

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend

# Last N lines
docker-compose logs --tail=100 backend

# Time-based
docker-compose logs --since=1h backend
```

### Resource Usage

```bash
# Container stats
docker stats

# Disk usage
docker system df

# Network info
docker network ls
```

### Health Checks

```bash
# Application health
curl http://localhost:3001/api/health

# Database health
docker-compose exec postgres pg_isready

# Redis health
docker-compose exec redis redis-cli ping
```

---

## Useful Commands

### Docker Compose

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View status
docker-compose ps

# View logs
docker-compose logs -f

# Restart service
docker-compose restart backend

# Rebuild service
docker-compose build backend

# Scale service
docker-compose up -d --scale backend=3

# Execute command in container
docker-compose exec backend npm run migrate
```

### Docker

```bash
# List containers
docker ps

# List images
docker images

# Remove container
docker rm <container-id>

# Remove image
docker rmi <image-id>

# Inspect container
docker inspect <container-id>

# View logs
docker logs -f <container-id>

# Execute command
docker exec -it <container-id> sh

# Copy files
docker cp <container-id>:/path/to/file ./local/path
```

### Cleanup

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Remove everything
docker system prune -a --volumes
```

---

## Performance Tips

1. **Use .dockerignore**
   - Excludes unnecessary files
   - Faster builds
   - Smaller images

2. **Layer Caching**
   - Order Dockerfile commands wisely
   - Copy package files first
   - Copy source code last

3. **Multi-stage Builds**
   - Reduces final image size
   - Removes build dependencies
   - Improves security

4. **Volume Mounts**
   - Fast development iteration
   - No rebuild needed
   - Hot-reload enabled

5. **Health Checks**
   - Automatic restarts
   - Service dependencies
   - Reliable deployments

---

## Security Checklist

- [ ] Never commit .env files
- [ ] Use strong passwords (min 32 characters)
- [ ] Rotate secrets regularly
- [ ] Run containers as non-root
- [ ] Keep images updated
- [ ] Scan for vulnerabilities
- [ ] Use HTTPS in production
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Backup database regularly

---

## Next Steps

1. **Local Development**
   - Start: `cd backend && ./scripts/docker-dev.sh`
   - Code: Edit files in `src/`
   - Test: `npm test`

2. **Production Deployment**
   - Build: `./scripts/docker-prod.sh`
   - Deploy: `docker-compose up -d`
   - Monitor: `docker-compose logs -f`

3. **CI/CD Setup**
   - Add GitHub secrets
   - Push to trigger workflows
   - Monitor in Actions tab

4. **Documentation**
   - Read: `backend/docs/DEPLOYMENT.md`
   - Read: `backend/docs/DOCKER.md`
   - Read: `docs/CICD.md`

---

## Support

- **Documentation:** `/docs` directory
- **Issues:** GitHub Issues
- **Logs:** `docker-compose logs -f`
- **Health:** `curl http://localhost:3001/api/health`

---

## Summary

**What's Included:**

- ✅ Multi-stage Docker builds
- ✅ Development & production configs
- ✅ Database backup/restore scripts
- ✅ CI/CD pipelines (GitHub Actions)
- ✅ Security scanning
- ✅ Health checks
- ✅ Comprehensive documentation

**Quick Commands:**

```bash
# Development
cd backend && ./scripts/docker-dev.sh

# Production
docker-compose up -d

# Backup
./scripts/backup-db.sh

# Restore
./scripts/restore-db.sh <backup-file>
```

**Access:**

- Frontend: http://localhost
- Backend: http://localhost:3001
- Database: localhost:5432
- Redis: localhost:6379
- Adminer: http://localhost:8080

Happy Coding! 🚀
