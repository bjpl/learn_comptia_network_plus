# Docker Guide - CompTIA Network+ Backend

## Overview

This guide covers Docker-specific operations for the CompTIA Network+ Learning Platform backend.

## Docker Architecture

### Container Structure
```
┌─────────────────────────────────────────┐
│            Nginx (Reverse Proxy)        │
│              Port 80/443                │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│          Backend API (Node.js)          │
│              Port 3000                  │
└─────┬──────────────────────────┬────────┘
      │                          │
┌─────▼────────┐        ┌────────▼─────────┐
│  PostgreSQL  │        │      Redis       │
│   Port 5432  │        │    Port 6379     │
└──────────────┘        └──────────────────┘
```

## Docker Commands Reference

### Basic Operations

#### Start Services
```bash
# Development (with hot reload)
docker-compose up -d

# Development with profile
docker-compose --profile dev up -d

# Production
docker-compose -f docker-compose.prod.yml up -d

# Start specific service
docker-compose up -d postgres

# Start with build
docker-compose up -d --build
```

#### Stop Services
```bash
# Stop all
docker-compose down

# Stop and remove volumes (⚠️ DATA LOSS)
docker-compose down -v

# Stop specific service
docker-compose stop backend
```

#### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend

# Restart with new image
docker-compose up -d --force-recreate backend
```

### Viewing Logs

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs backend

# Follow logs
docker-compose logs -f backend

# Last N lines
docker-compose logs --tail=100 backend

# Since timestamp
docker-compose logs --since 2024-10-29T10:00:00 backend

# Multiple services
docker-compose logs backend postgres
```

### Inspecting Containers

```bash
# List running containers
docker-compose ps

# Detailed container info
docker inspect comptia-backend

# Container resource usage
docker stats comptia-backend

# Container processes
docker-compose top backend

# Container environment
docker-compose exec backend env
```

### Executing Commands

```bash
# Open shell in container
docker-compose exec backend sh

# Run command
docker-compose exec backend npm run test

# Run as root
docker-compose exec -u root backend sh

# Run in new container
docker-compose run --rm backend npm run build
```

## Development Workflow

### Hot Reload Development

```bash
# Start dev environment
docker-compose --profile dev up backend-dev

# Watch logs
docker-compose logs -f backend-dev

# Code changes are automatically reflected
```

### Running Tests

```bash
# Unit tests
docker-compose exec backend npm run test

# Integration tests
docker-compose exec backend npm run test:integration

# With coverage
docker-compose exec backend npm run test:coverage

# In separate container
docker-compose run --rm backend npm run test
```

### Database Operations

```bash
# Run migrations
docker-compose exec backend npm run db:migrate

# Access PostgreSQL
docker-compose exec postgres psql -U postgres -d comptia_network

# Create backup
docker-compose exec postgres pg_dump -U postgres comptia_network > backup.sql

# Restore backup
docker-compose exec -T postgres psql -U postgres comptia_network < backup.sql
```

### Debugging

```bash
# Start with debugger
docker-compose up -d backend
docker-compose exec backend node --inspect=0.0.0.0:9229 dist/index.js

# Attach to running process
docker-compose exec backend kill -USR1 1

# View debug logs
docker-compose logs -f backend | grep -i error
```

## Image Management

### Building Images

```bash
# Build all images
docker-compose build

# Build specific service
docker-compose build backend

# Build with no cache
docker-compose build --no-cache backend

# Production build
docker-compose -f docker-compose.prod.yml build
```

### Tagging Images

```bash
# Tag image
docker tag comptia-backend:latest comptia-backend:v1.0.0

# Tag for registry
docker tag comptia-backend:latest registry.example.com/comptia-backend:latest
```

### Pushing Images

```bash
# Login to registry
docker login registry.example.com

# Push image
docker push registry.example.com/comptia-backend:latest

# Push all tags
docker push registry.example.com/comptia-backend --all-tags
```

### Cleaning Up

```bash
# Remove unused images
docker image prune

# Remove all unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# Complete cleanup
docker system prune -a --volumes
```

## Volume Management

### Inspecting Volumes

```bash
# List volumes
docker volume ls

# Inspect volume
docker volume inspect comptia_postgres_data

# Show volume location
docker volume inspect comptia_postgres_data -f '{{ .Mountpoint }}'
```

### Backing Up Volumes

```bash
# Create backup of PostgreSQL volume
docker run --rm \
  -v comptia_postgres_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/postgres-data.tar.gz -C /data .

# Restore volume
docker run --rm \
  -v comptia_postgres_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar xzf /backup/postgres-data.tar.gz -C /data
```

## Network Management

### Inspecting Networks

```bash
# List networks
docker network ls

# Inspect network
docker network inspect backend_backend-network

# View connected containers
docker network inspect backend_backend-network -f '{{range .Containers}}{{.Name}} {{end}}'
```

### Network Troubleshooting

```bash
# Test connectivity between containers
docker-compose exec backend ping postgres

# Check DNS resolution
docker-compose exec backend nslookup postgres

# View network ports
docker-compose exec backend netstat -tuln
```

## Multi-Stage Build Optimization

### Build Stages

Our Dockerfile uses three stages:
1. **dependencies**: Production dependencies only
2. **builder**: Build TypeScript code
3. **production**: Final minimal image

### Build Specific Stage

```bash
# Build dependencies stage only
docker build --target dependencies -t comptia-backend:deps .

# Build builder stage
docker build --target builder -t comptia-backend:builder .

# Build production stage (default)
docker build --target production -t comptia-backend:prod .
```

### Build Arguments

```bash
# Set build arguments
docker build --build-arg NODE_ENV=production .

# Multiple arguments
docker build \
  --build-arg NODE_ENV=production \
  --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
  .
```

## Health Checks

### Container Health

```bash
# View health status
docker inspect --format='{{.State.Health.Status}}' comptia-backend

# Health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' comptia-backend

# Wait for healthy
docker-compose up -d backend
until [ "$(docker inspect --format='{{.State.Health.Status}}' comptia-backend)" == "healthy" ]; do
  sleep 2
done
```

## Resource Limits

### View Current Limits

```bash
# Container resource usage
docker stats comptia-backend --no-stream

# Detailed resource info
docker inspect comptia-backend -f '{{.HostConfig.Memory}} {{.HostConfig.CpuShares}}'
```

### Set Runtime Limits

```bash
# Start with memory limit
docker run -d --memory="512m" comptia-backend

# CPU limit
docker run -d --cpus="1.5" comptia-backend

# Combined limits
docker run -d \
  --memory="512m" \
  --cpus="1.5" \
  --memory-swap="1g" \
  comptia-backend
```

## Security Best Practices

### Scanning Images

```bash
# Scan with Trivy
docker run --rm \
  -v /var/run/docker.sock:/var/run/docker.sock \
  aquasec/trivy image comptia-backend:latest

# Scan with Snyk
snyk container test comptia-backend:latest

# Docker's built-in scan
docker scan comptia-backend:latest
```

### Security Hardening

```bash
# Run as non-root (already in Dockerfile)
USER nodejs

# Read-only root filesystem
docker run -d --read-only comptia-backend

# Drop capabilities
docker run -d --cap-drop=ALL comptia-backend

# Use secrets (production)
docker secret create db_password db_password.txt
docker service create \
  --secret db_password \
  comptia-backend
```

## Troubleshooting Guide

### Container Won't Start

```bash
# Check logs
docker-compose logs backend

# Validate compose file
docker-compose config

# Check for port conflicts
docker-compose ps
netstat -tuln | grep 3000

# Verify image
docker images | grep comptia-backend
```

### Performance Issues

```bash
# Monitor resources
docker stats

# Check container overhead
docker system df

# Analyze image layers
docker history comptia-backend:latest

# Profile application
docker-compose exec backend node --prof dist/index.js
```

### Network Issues

```bash
# Test connectivity
docker-compose exec backend wget -O- http://postgres:5432

# Check network
docker network inspect backend_backend-network

# Verify DNS
docker-compose exec backend cat /etc/resolv.conf

# Check firewall
docker-compose exec backend iptables -L
```

## CI/CD Integration

### GitHub Actions

```yaml
# Example workflow step
- name: Build Docker image
  run: docker build -t comptia-backend:${{ github.sha }} .

- name: Test image
  run: |
    docker run -d --name test comptia-backend:${{ github.sha }}
    docker exec test npm run test
    docker stop test
```

### GitLab CI

```yaml
# Example .gitlab-ci.yml
build:
  image: docker:latest
  services:
    - docker:dind
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
```

## Advanced Topics

### Docker Compose Override

```bash
# Create override file
cat > docker-compose.override.yml <<EOF
version: '3.8'
services:
  backend:
    environment:
      - DEBUG=true
EOF

# Automatically merged with docker-compose.yml
docker-compose up -d
```

### Custom Networks

```bash
# Create custom network
docker network create --driver bridge comptia-custom

# Use in compose
docker-compose --network comptia-custom up -d
```

### Multi-Container Logging

```bash
# Aggregate logs
docker-compose logs -f | grep -i error

# Export logs
docker-compose logs > logs.txt

# Send to logging service
docker-compose logs -f | nc logserver.example.com 514
```

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Security Guide](https://docs.docker.com/engine/security/)
