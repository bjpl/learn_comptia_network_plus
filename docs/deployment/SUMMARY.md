# Deployment Documentation Summary

This directory contains comprehensive deployment guides for the CompTIA Network+ Learning Platform across multiple hosting platforms.

## Available Guides

### 1. [Master Deployment Guide](../DEPLOYMENT_GUIDE.md)
**Start here!** Overview of all deployment options with:
- Architecture diagrams
- Prerequisites
- Environment configuration
- Database setup
- SSL/TLS configuration
- Post-deployment checklist
- Monitoring and maintenance
- Troubleshooting

### 2. Platform-Specific Guides

#### [Vercel + Railway](./VERCEL_RAILWAY.md) ⭐ **Recommended for Beginners**
- **Time:** 15-30 minutes
- **Cost:** $5-15/month
- **Difficulty:** Easy ⭐
- **Best for:** Quick deployment, MVP, small to medium traffic
- **Pros:** Fastest setup, automatic deployments, free tier
- **Cons:** Higher cost at scale, platform lock-in

#### [AWS](./AWS.md) ⭐ **Enterprise Grade**
- **Time:** 2-4 hours
- **Cost:** $60-200+/month
- **Difficulty:** Hard ⭐⭐⭐
- **Best for:** Large scale, enterprise requirements
- **Pros:** Highly scalable, full control, industry standard
- **Cons:** Complex setup, expensive, steep learning curve

#### [DigitalOcean](./DIGITALOCEAN.md) ⭐ **Budget Friendly**
- **Time:** 1-2 hours
- **Cost:** $27-78/month
- **Difficulty:** Medium ⭐⭐
- **Best for:** Cost-conscious teams, medium traffic
- **Pros:** Predictable pricing, simple interface, managed databases
- **Cons:** Less features than AWS, manual scaling

#### [Self-Hosted](./SELF_HOSTED.md) ⭐ **Maximum Control**
- **Time:** 2-3 hours
- **Cost:** $5-20/month (VPS) or $0 (own hardware)
- **Difficulty:** Medium-Hard ⭐⭐⭐
- **Best for:** Experienced teams, specific requirements
- **Pros:** Complete control, lowest cost, no limitations
- **Cons:** Most complex, you handle everything, maintenance overhead

#### [Docker Compose](./DOCKER_COMPOSE.md) ⭐ **Portable**
- **Time:** 30-60 minutes
- **Cost:** Variable (depends on hosting)
- **Difficulty:** Medium ⭐⭐
- **Best for:** Containerized environments, reproducible deployments
- **Pros:** Consistent environments, portable, good for CI/CD
- **Cons:** Requires Docker knowledge, extra layer

### 3. Supporting Resources

#### [Platform Comparison](./COMPARISON.md)
Detailed comparison of all deployment options:
- Cost analysis
- Feature comparison
- Performance benchmarks
- Scalability analysis
- Use case recommendations
- Decision flowchart

#### [Nginx Configuration](./nginx.conf.example)
Production-ready Nginx configuration with:
- SSL/TLS setup
- Rate limiting
- Security headers
- Gzip compression
- Static asset caching
- Proxy configuration

## Quick Start

### For Beginners
```bash
# 1. Choose Vercel + Railway
# 2. Follow the guide: docs/deployment/VERCEL_RAILWAY.md
# 3. Deploy in 15 minutes
```

### For Experienced Teams
```bash
# 1. Review comparison: docs/deployment/COMPARISON.md
# 2. Choose platform based on requirements
# 3. Follow platform-specific guide
# 4. Run pre-deployment checks:
chmod +x scripts/pre-deploy-check.sh
./scripts/pre-deploy-check.sh

# 5. Deploy:
chmod +x scripts/deploy.sh
./scripts/deploy.sh production
```

## Deployment Scripts

All scripts are located in `/scripts` directory:

### [`pre-deploy-check.sh`](../../scripts/pre-deploy-check.sh)
Pre-deployment checklist that verifies:
- Node.js and npm versions
- Git repository status
- Environment files
- Dependencies
- Configuration files
- Security settings

**Usage:**
```bash
chmod +x scripts/pre-deploy-check.sh
./scripts/pre-deploy-check.sh
```

### [`deploy.sh`](../../scripts/deploy.sh)
Automated deployment script that:
- Runs pre-deployment checks
- Executes tests
- Builds frontend and backend
- Runs database migrations
- Deploys application
- Verifies deployment

**Usage:**
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh production  # or staging
```

### [`rollback.sh`](../../scripts/rollback.sh)
Rollback script for reverting deployments:
- Git rollback
- Docker/PM2 rollback
- Database restoration
- Verification

**Usage:**
```bash
chmod +x scripts/rollback.sh
./scripts/rollback.sh -c abc123 -d backup-2025-10-29.dump
```

## Environment Configuration

### Frontend (`.env.production`)
```env
VITE_API_URL=https://api.yourdomain.com
VITE_USE_MOCK_API=false
VITE_ENV=production
```

### Backend (`backend/.env.production`)
Key variables to configure:
- `NODE_ENV=production`
- `PORT=3001`
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - Generate with `openssl rand -base64 32`
- `REFRESH_TOKEN_SECRET` - Generate unique secret
- `SESSION_SECRET` - Generate unique secret
- `CORS_ORIGIN` - Your frontend domain
- `REDIS_HOST` and `REDIS_PASSWORD` (if using Redis)

**Generate secrets:**
```bash
cd backend
chmod +x scripts/generate-secrets.sh
./scripts/generate-secrets.sh
```

## Database Setup

### PostgreSQL Installation
Varies by platform - see platform-specific guides.

### Run Migrations
```bash
cd backend
npm run migrate

# Or use script
./scripts/migrate.sh
```

### Seed Demo Data (Optional)
```bash
cd backend
npm run seed
```

## SSL/TLS Certificates

### Option 1: Let's Encrypt (Free)
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### Option 2: Cloudflare (Free + DDoS protection)
1. Add domain to Cloudflare
2. Update nameservers
3. Enable SSL mode: "Full (strict)"

### Option 3: Purchased Certificate
- Place certificate files in `/etc/ssl/`
- Configure in Nginx (see `nginx.conf.example`)

## Post-Deployment Checklist

- [ ] Backend health check returns 200: `curl https://api.yourdomain.com/health`
- [ ] Frontend loads: `curl https://yourdomain.com`
- [ ] Can register new account
- [ ] Can login
- [ ] Can navigate courses
- [ ] Practice tests work
- [ ] Progress tracking works
- [ ] SSL certificate valid
- [ ] DNS resolves correctly
- [ ] Monitoring set up
- [ ] Backups configured

## Monitoring

### Application Health
```bash
# Backend
curl https://api.yourdomain.com/health

# Frontend
curl https://yourdomain.com
```

### External Monitoring Services
- [UptimeRobot](https://uptimerobot.com) - Free tier available
- [Pingdom](https://pingdom.com) - Paid
- [StatusCake](https://statuscake.com) - Free tier available

### Log Management
```bash
# PM2 logs
pm2 logs comptia-backend

# Docker logs
docker compose logs -f

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Backup Strategy

### Database Backups
```bash
# Manual backup
./backend/database/scripts/backup.sh

# Automated (cron)
0 2 * * * /path/to/backend/database/scripts/backup.sh
```

### Application Backups
```bash
# Backup application files and configs
tar -czf backup-$(date +%Y%m%d).tar.gz \
  backend/ \
  dist/ \
  .env.production \
  docker-compose*.yml
```

### Off-site Backups
```bash
# Sync to cloud storage
aws s3 sync ./backups/ s3://your-bucket/backups/
# or
rclone sync ./backups/ remote:backups/
```

## Troubleshooting

### Common Issues

**Application won't start:**
- Check environment variables
- Verify database connection
- Check logs: `pm2 logs` or `docker logs`
- Ensure ports are not in use

**Database connection errors:**
- Verify DATABASE_URL is correct
- Check firewall rules
- Ensure PostgreSQL is running
- Test connection: `psql -h host -U user -d database`

**SSL certificate issues:**
- Verify DNS points to correct server
- Check certificate expiry: `certbot certificates`
- Test SSL: `openssl s_client -connect domain.com:443`

**High memory/CPU usage:**
- Check process usage: `htop` or `docker stats`
- Review application logs
- Consider scaling up resources
- Enable caching (Redis)

## Scaling Strategies

### Vertical Scaling (Increase Resources)
- Increase CPU/RAM on existing server
- Upgrade database instance
- Add Redis for caching

### Horizontal Scaling (Add Servers)
- Deploy multiple backend instances
- Add load balancer
- Use managed database with read replicas
- Implement CDN for static assets

### Cost Optimization
- Use CDN to reduce bandwidth
- Enable compression (gzip/brotli)
- Optimize images
- Implement caching strategy
- Use spot instances (AWS)
- Set up autoscaling

## Security Best Practices

1. **Keep software updated**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use strong secrets**
   ```bash
   openssl rand -base64 32
   ```

3. **Enable firewall**
   ```bash
   sudo ufw enable
   sudo ufw allow 80/tcp
   sudo ufw allow 443/tcp
   ```

4. **Regular backups**
   - Automated daily database backups
   - Weekly application backups
   - Off-site backup storage

5. **Monitor logs**
   - Set up log aggregation
   - Configure alerts for errors
   - Review access logs regularly

6. **SSL/TLS**
   - Use HTTPS everywhere
   - Enable HSTS header
   - Use TLS 1.2 or higher

7. **Rate limiting**
   - Configured in Nginx
   - Protects against abuse
   - See `nginx.conf.example`

## Getting Help

### Documentation
- [Frontend README](../../README.md)
- [Backend README](../../backend/README.md)
- [API Documentation](../../backend/API.md)

### Platform Documentation
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [AWS Docs](https://docs.aws.amazon.com)
- [DigitalOcean Docs](https://docs.digitalocean.com)
- [Docker Docs](https://docs.docker.com)

### Community
- GitHub Issues: Report bugs or request features
- Stack Overflow: Tag with `comptia-network` or platform name

## Changelog

### Version 1.0.0 (2025-10-29)
- Initial deployment documentation
- 5 platform-specific guides
- Nginx configuration example
- Automated deployment scripts
- Comparison and decision matrices
- Troubleshooting guides

---

## Quick Reference

### Essential Commands

```bash
# Pre-deployment check
./scripts/pre-deploy-check.sh

# Deploy
./scripts/deploy.sh production

# Rollback
./scripts/rollback.sh

# Database backup
./backend/database/scripts/backup.sh

# Health check
curl https://api.yourdomain.com/health

# View logs
pm2 logs comptia-backend
docker compose logs -f

# Restart services
pm2 restart all
docker compose restart
sudo systemctl restart nginx
```

### Port Reference

| Service | Port | Protocol |
|---------|------|----------|
| Frontend | 80, 443 | HTTP/HTTPS |
| Backend | 3001 | HTTP |
| PostgreSQL | 5432 | TCP |
| Redis | 6379 | TCP |

### File Locations

```
docs/
├── DEPLOYMENT_GUIDE.md          # Master guide
└── deployment/
    ├── VERCEL_RAILWAY.md         # Vercel + Railway guide
    ├── AWS.md                    # AWS guide
    ├── DIGITALOCEAN.md          # DigitalOcean guide
    ├── SELF_HOSTED.md           # Self-hosted guide
    ├── DOCKER_COMPOSE.md        # Docker Compose guide
    ├── COMPARISON.md            # Platform comparison
    ├── nginx.conf.example       # Nginx configuration
    └── SUMMARY.md               # This file

scripts/
├── deploy.sh                    # Automated deployment
├── pre-deploy-check.sh         # Pre-deployment checks
└── rollback.sh                 # Rollback script

backend/
├── .env.production.template     # Backend config template
├── scripts/
│   └── migrate.sh              # Database migrations
└── database/
    └── scripts/
        ├── backup.sh           # Database backup
        └── restore.sh          # Database restore
```

---

**Documentation Version:** 1.0.0
**Last Updated:** 2025-10-29
**Maintainer:** CompTIA Network+ Project Team
