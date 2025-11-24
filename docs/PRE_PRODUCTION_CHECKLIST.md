# Pre-Production Security Checklist

**Project:** CompTIA Network+ Learning Platform
**Environment:** [ ] Staging [ ] Production
**Date:** \***\*\_\_\_\*\***
**Completed By:** \***\*\_\_\_\*\***

---

## 🔐 Secrets & Configuration Management

### Secret Generation

- [ ] All secrets generated using cryptographically secure methods (`openssl rand`)
- [ ] Secrets are minimum 32 characters (JWT, API keys)
- [ ] Secrets are minimum 64 characters (Session, Encryption)
- [ ] Unique secrets generated for each environment (dev, staging, prod)
- [ ] Secrets stored in secure password manager (1Password, LastPass, etc.)
- [ ] Physical copy of secrets stored in secure location
- [ ] Secrets file securely deleted after transfer (`shred -vfz -n 10`)

### Environment Configuration

- [ ] `.env.production` configured with all required variables
- [ ] `.env.staging` configured with different secrets
- [ ] `.env.example` updated but contains no real secrets
- [ ] `.env*` files added to `.gitignore`
- [ ] `.gitignore` verified to exclude all sensitive files
- [ ] Environment variables validated before deployment

### Repository Security

- [ ] No hardcoded secrets in codebase (grep for sensitive patterns)
- [ ] No secrets in git history (`git log -p` review)
- [ ] No secrets in comments or documentation
- [ ] `.env` files never committed to version control
- [ ] GitHub secret scanning enabled
- [ ] Pre-commit hooks prevent secret commits

### Hosting Platform

- [ ] All secrets configured in hosting platform (Vercel/Railway/etc.)
- [ ] Environment variables match `.env.production` template
- [ ] Secret values verified (no copy-paste errors)
- [ ] Backup of environment variables exported
- [ ] Access to hosting platform restricted to authorized personnel

### CI/CD Secrets

- [ ] GitHub Secrets configured for all required variables
- [ ] GitHub Environments set up for staging and production
- [ ] Environment protection rules enabled (reviewers, branch rules)
- [ ] Workflow permissions minimized (read-only where possible)
- [ ] Deployment keys rotated and secured

---

## 🛡️ Security Hardening

### HTTPS/TLS Configuration

- [ ] Valid SSL/TLS certificate from trusted CA (Let's Encrypt, etc.)
- [ ] Certificate not self-signed or expired
- [ ] Certificate covers all domains (www, api, admin)
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] TLS 1.2+ enforced, older versions disabled
- [ ] Strong cipher suites configured
- [ ] HSTS header enabled (`Strict-Transport-Security`)
- [ ] SSL Labs test grade A or higher

### Security Headers

- [ ] Content-Security-Policy (CSP) configured
- [ ] X-Frame-Options set to DENY or SAMEORIGIN
- [ ] X-Content-Type-Options set to nosniff
- [ ] X-XSS-Protection enabled
- [ ] Referrer-Policy configured
- [ ] Permissions-Policy configured
- [ ] Helmet.js middleware enabled (Node.js)
- [ ] Security headers verified with securityheaders.com

### CORS Configuration

- [ ] CORS origins whitelist configured (no wildcards in production)
- [ ] Credentials allowed only for trusted origins
- [ ] Preflight requests handled correctly
- [ ] CORS headers tested with different origins
- [ ] OPTIONS requests return correct headers

### Rate Limiting

- [ ] Rate limiting enabled on all API endpoints
- [ ] Login endpoints have stricter limits (5 attempts per 15 min)
- [ ] Registration endpoints rate limited
- [ ] API endpoints limited appropriately (100 req/15 min)
- [ ] Rate limit headers sent to clients
- [ ] Rate limiting tested and validated
- [ ] IP-based and user-based rate limiting implemented

### Input Validation & Sanitization

- [ ] All user inputs validated on server side
- [ ] SQL injection prevention verified (parameterized queries)
- [ ] XSS prevention tested (output encoding)
- [ ] CSRF protection enabled and tested
- [ ] File upload validation (type, size, content)
- [ ] Request body size limits enforced
- [ ] Path traversal prevention verified
- [ ] Command injection prevention verified

---

## 🗄️ Database Security

### Access Control

- [ ] Database SSL/TLS encryption enabled
- [ ] Strong database password set (32+ characters)
- [ ] Database user has minimal required permissions (principle of least privilege)
- [ ] Root/admin database access disabled for application
- [ ] Separate database users for different environments
- [ ] Database connection string uses SSL parameters
- [ ] Connection pooling configured (min: 2, max: 10)
- [ ] Connection timeout configured

### Backup & Recovery

- [ ] Automated database backups configured (daily minimum)
- [ ] Backup encryption enabled
- [ ] Backups stored in separate location from primary database
- [ ] Point-in-time recovery (PITR) enabled
- [ ] Backup retention policy configured (30 days minimum)
- [ ] Backup restoration tested successfully
- [ ] Recovery Time Objective (RTO) documented
- [ ] Recovery Point Objective (RPO) documented

### Database Security

- [ ] Database firewall rules configured (whitelist application IPs only)
- [ ] Database port not exposed to public internet
- [ ] Prepared statements used for all queries
- [ ] ORM/query builder escapes inputs properly
- [ ] Database audit logging enabled
- [ ] Sensitive data encrypted at rest
- [ ] PII data identified and protected
- [ ] Database version up to date with security patches

---

## 🔑 Authentication & Authorization

### JWT Configuration

- [ ] JWT secret is strong and unique (32+ characters)
- [ ] Access token expiration appropriate (15 minutes recommended)
- [ ] Refresh token expiration appropriate (7 days recommended)
- [ ] Refresh token rotation implemented
- [ ] JWT algorithm is secure (HS256 or RS256)
- [ ] JWT claims validated on every request
- [ ] Token expiration enforced
- [ ] Invalid tokens rejected properly

### Password Security

- [ ] Bcrypt rounds set to 12 or higher
- [ ] Minimum password length enforced (8+ characters)
- [ ] Password complexity requirements enforced
- [ ] Common passwords rejected (use password dictionary)
- [ ] Password reset flow secure (token-based, time-limited)
- [ ] Old passwords cannot be reused (history of 5+)
- [ ] Passwords never logged or displayed
- [ ] Password hashing tested and verified

### Account Security

- [ ] Account lockout after failed login attempts (5 attempts)
- [ ] Lockout duration configured (30 minutes)
- [ ] Session timeout configured (24 hours max)
- [ ] Logout functionality completely clears session
- [ ] Token blacklisting implemented for logout
- [ ] Concurrent session handling defined
- [ ] "Remember me" functionality secure (if implemented)

### Authorization

- [ ] Role-based access control (RBAC) implemented
- [ ] User permissions verified on every protected route
- [ ] Admin routes protected with admin role check
- [ ] Object-level permissions enforced
- [ ] Horizontal privilege escalation prevented
- [ ] Vertical privilege escalation prevented
- [ ] Authorization tested for all user roles

---

## 📊 Monitoring & Logging

### Application Logging

- [ ] Application logging configured (Winston, Pino, etc.)
- [ ] Log level appropriate for environment (info for production)
- [ ] Sensitive data excluded from logs (passwords, tokens, etc.)
- [ ] Structured logging implemented (JSON format)
- [ ] Log rotation configured (max size: 10MB, max files: 5)
- [ ] Logs stored securely (encrypted if containing sensitive info)
- [ ] Log retention policy defined (30-90 days)

### Error Tracking

- [ ] Error tracking service configured (Sentry, Rollbar, etc.)
- [ ] Error tracking tested with sample errors
- [ ] Source maps uploaded for better stack traces
- [ ] Error notifications configured for critical issues
- [ ] PII excluded from error reports
- [ ] Error sampling rate configured (10% for performance)
- [ ] Error grouping and deduplication working

### Security Event Logging

- [ ] Failed login attempts logged
- [ ] Successful login events logged
- [ ] Password changes logged
- [ ] Permission changes logged
- [ ] Account creation/deletion logged
- [ ] Admin actions logged
- [ ] Suspicious activities logged (brute force, etc.)

### Monitoring & Alerts

- [ ] Application performance monitoring (APM) configured
- [ ] Uptime monitoring configured (Pingdom, UptimeRobot, etc.)
- [ ] Health check endpoint implemented (`/health`)
- [ ] Health checks run every 30 seconds
- [ ] Alerts configured for critical events (downtime, errors)
- [ ] Alert notifications sent to appropriate channels (Slack, email)
- [ ] Dashboard created for monitoring key metrics
- [ ] Response time monitoring enabled

---

## 🚀 Deployment & Infrastructure

### Docker Security

- [ ] Docker images scanned for vulnerabilities (Trivy, Snyk)
- [ ] Base images from official sources only
- [ ] Images use specific version tags (not `latest`)
- [ ] Non-root user configured in Dockerfile
- [ ] Minimal image size (multi-stage builds)
- [ ] `.dockerignore` excludes sensitive files
- [ ] Container resource limits configured (CPU, memory)
- [ ] Security context configured for containers

### Dependency Security

- [ ] `npm audit` run with no high/critical vulnerabilities
- [ ] Dependencies up to date with security patches
- [ ] Automated dependency updates configured (Dependabot)
- [ ] License compliance verified
- [ ] Unused dependencies removed
- [ ] Lock file committed (`package-lock.json`)
- [ ] Private packages properly authenticated

### CI/CD Pipeline

- [ ] CI/CD pipeline tested end-to-end
- [ ] Pipeline runs automated tests before deployment
- [ ] Pipeline runs security scans
- [ ] Pipeline validates environment variables
- [ ] Deployment requires manual approval for production
- [ ] Rollback procedure documented and tested
- [ ] Pipeline logs reviewed for sensitive data exposure

### Deployment Strategy

- [ ] Staging environment mirrors production configuration
- [ ] Zero-downtime deployment strategy implemented
- [ ] Database migrations tested in staging
- [ ] Database migrations have rollback scripts
- [ ] Health checks verify successful deployment
- [ ] Gradual rollout strategy defined (canary/blue-green)
- [ ] Rollback tested and documented

---

## 🧪 Testing & Validation

### Security Testing

- [ ] All security tests passing
- [ ] Penetration testing completed
- [ ] OWASP ZAP scan performed (grade B or higher)
- [ ] SQL injection tests passed
- [ ] XSS tests passed
- [ ] CSRF tests passed
- [ ] Rate limiting tests passed
- [ ] Authentication bypass tests passed

### Functional Testing

- [ ] All unit tests passing (80%+ coverage)
- [ ] All integration tests passing
- [ ] All E2E tests passing
- [ ] Load testing completed (can handle expected traffic)
- [ ] Stress testing completed (failure points identified)
- [ ] API endpoints tested with Postman/Insomnia
- [ ] Browser compatibility tested (Chrome, Firefox, Safari, Edge)

### Performance Testing

- [ ] Page load time under 3 seconds
- [ ] API response time under 200ms for most endpoints
- [ ] Database query performance optimized (no N+1 queries)
- [ ] Caching implemented for frequently accessed data
- [ ] CDN configured for static assets
- [ ] Compression enabled (Gzip/Brotli)
- [ ] Images optimized and properly sized

---

## 📚 Documentation

### Technical Documentation

- [ ] Deployment guide complete and tested
- [ ] Environment setup guide documented
- [ ] API documentation up to date (Swagger/OpenAPI)
- [ ] Database schema documented
- [ ] Architecture diagrams created
- [ ] Troubleshooting guide created
- [ ] Runbook created for common operations

### Security Documentation

- [ ] Security policies documented
- [ ] Incident response plan created
- [ ] Disaster recovery plan created
- [ ] Data retention policy documented
- [ ] Privacy policy reviewed by legal
- [ ] Terms of service reviewed by legal
- [ ] GDPR compliance verified (if applicable)

### Operational Documentation

- [ ] Monitoring runbook created
- [ ] Alert response procedures documented
- [ ] Escalation procedures defined
- [ ] On-call schedule defined
- [ ] Backup restoration procedures tested
- [ ] Secret rotation procedures documented

---

## ✅ Final Pre-Deployment Checks

### Environment Verification

- [ ] All environment variables set correctly
- [ ] All secrets verified working (test API calls)
- [ ] Database connection successful
- [ ] Redis connection successful (if using)
- [ ] Email service working (send test email)
- [ ] File storage working (upload test file)
- [ ] External API integrations working

### Infrastructure

- [ ] DNS records configured correctly (A, AAAA, CNAME)
- [ ] SSL certificate valid and not expiring within 30 days
- [ ] Load balancer configured (if using)
- [ ] Auto-scaling configured (if using)
- [ ] CDN configured and tested (if using)
- [ ] Firewall rules configured
- [ ] DDoS protection enabled (Cloudflare, AWS Shield, etc.)
- [ ] Geographic routing configured (if needed)

### Health & Status

- [ ] `/health` endpoint returns 200 OK
- [ ] `/health` includes all service dependencies
- [ ] Database migrations applied successfully
- [ ] Database seeding completed (if needed)
- [ ] Application starts without errors
- [ ] All services responding to requests
- [ ] No errors in application logs
- [ ] No errors in system logs

### Team Readiness

- [ ] Deployment team briefed on launch plan
- [ ] Support team trained on application
- [ ] On-call schedule activated
- [ ] Communication plan ready (status page, email, etc.)
- [ ] Rollback plan reviewed with team
- [ ] Post-deployment checklist prepared
- [ ] Monitoring dashboard shared with team

---

## 🎯 Go-Live Criteria

All items below must be checked before going live:

- [ ] 100% of security items completed
- [ ] 100% of critical path tests passing
- [ ] Staging environment tested successfully for 48+ hours
- [ ] All stakeholders approve go-live
- [ ] Maintenance window scheduled and communicated
- [ ] Backup taken immediately before deployment
- [ ] Rollback plan tested and ready
- [ ] Monitoring active and alerts configured
- [ ] Team available for 2 hours post-deployment
- [ ] Status page ready to communicate with users

---

## 📝 Sign-Off

### Checklist Completion

| Role              | Name             | Signature        | Date             |
| ----------------- | ---------------- | ---------------- | ---------------- |
| Backend Developer | \***\*\_\_\*\*** | \***\*\_\_\*\*** | \***\*\_\_\*\*** |
| DevOps Engineer   | \***\*\_\_\*\*** | \***\*\_\_\*\*** | \***\*\_\_\*\*** |
| Security Lead     | \***\*\_\_\*\*** | \***\*\_\_\*\*** | \***\*\_\_\*\*** |
| QA Engineer       | \***\*\_\_\*\*** | \***\*\_\_\*\*** | \***\*\_\_\*\*** |
| Product Owner     | \***\*\_\_\*\*** | \***\*\_\_\*\*** | \***\*\_\_\*\*** |

### Deployment Approval

**Environment:** [ ] Staging [ ] Production
**Approved By:** \***\*\_\_\*\***
**Date:** \***\*\_\_\*\***
**Deployment Window:** \***\*\_\_\*\*** to \***\*\_\_\*\***

### Post-Deployment Verification

- [ ] Deployment successful (no errors)
- [ ] All services healthy
- [ ] No critical errors in logs
- [ ] User testing completed
- [ ] Performance metrics acceptable
- [ ] Monitoring confirmed working

**Verified By:** \***\*\_\_\*\***
**Date:** \***\*\_\_\*\***
**Time:** \***\*\_\_\*\***

---

## 🔄 Post-Deployment

### Immediate Actions (First 2 Hours)

- [ ] Monitor error rates
- [ ] Monitor response times
- [ ] Check all critical user flows
- [ ] Verify database connections stable
- [ ] Check for memory leaks
- [ ] Review application logs

### 24-Hour Actions

- [ ] Review all monitoring dashboards
- [ ] Analyze error reports
- [ ] Check user feedback
- [ ] Verify backup completed
- [ ] Review performance metrics
- [ ] Document any issues encountered

### 7-Day Actions

- [ ] Security scan of production environment
- [ ] Performance optimization review
- [ ] Cost analysis
- [ ] User analytics review
- [ ] Team retrospective
- [ ] Update documentation with lessons learned

---

**Checklist Version:** 1.0
**Last Updated:** 2024-01-15
**Next Review:** 2024-04-15
