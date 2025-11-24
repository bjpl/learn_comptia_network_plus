# CI/CD Pipeline Documentation

## Overview

The CompTIA Network+ Learning Platform uses GitHub Actions for continuous integration and continuous deployment. This document details the CI/CD pipeline architecture, workflows, and best practices.

## Pipeline Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Pull Request                          │
└────────────────┬────────────────────────────────────────┘
                 │
    ┌────────────▼────────────┐
    │  Backend CI Workflow    │
    ├─────────────────────────┤
    │ • Lint & Type Check     │
    │ • Unit Tests            │
    │ • Integration Tests     │
    │ • Security Scan         │
    │ • Docker Build          │
    └────────────┬────────────┘
                 │
    ┌────────────▼────────────┐
    │   Test Matrix          │
    ├─────────────────────────┤
    │ • Multi-platform        │
    │ • Multi-version         │
    │ • Accessibility         │
    │ • Performance           │
    └────────────┬────────────┘
                 │
         Merge to develop
                 │
    ┌────────────▼────────────┐
    │  Deploy to Staging      │
    ├─────────────────────────┤
    │ • Build Docker Image    │
    │ • Push to Registry      │
    │ • Deploy to ECS         │
    │ • Run Migrations        │
    │ • Health Checks         │
    └────────────┬────────────┘
                 │
          Merge to main
                 │
    ┌────────────▼────────────┐
    │  Deploy to Production   │
    ├─────────────────────────┤
    │ • Create Backup         │
    │ • Blue/Green Deploy     │
    │ • Run Migrations        │
    │ • Smoke Tests           │
    │ • Monitor Metrics       │
    │ • Rollback on Failure   │
    └─────────────────────────┘
```

## Workflows

### 1. Backend CI (`backend-ci.yml`)

**Trigger**: PR to main/develop or push to backend/

**Jobs**:

#### Lint and Type Check

- Runs ESLint
- Runs Prettier format check
- Runs TypeScript type checking
- Fails fast to catch code quality issues

#### Test

- Matrix: Node 18, 20
- Services: PostgreSQL, Redis
- Runs unit tests
- Runs integration tests
- Uploads coverage to Codecov

#### Security

- npm audit for vulnerabilities
- Snyk security scanning
- Threshold: High severity

#### Docker Build

- Builds Docker image (no push)
- Runs Trivy vulnerability scanner
- Uploads results to GitHub Security

### 2. Backend CD (`backend-cd.yml`)

**Trigger**: Push to main/develop or manual dispatch

**Jobs**:

#### Build and Push

- Builds multi-platform Docker images (amd64, arm64)
- Tags with branch, SHA, and semantic version
- Pushes to GitHub Container Registry
- Uses build cache for faster builds

#### Deploy to Staging

- **Condition**: develop branch
- Updates ECS service
- Runs database migrations
- Health check verification
- Slack notification

#### Deploy to Production

- **Condition**: main branch
- Creates database backup
- Blue/Green deployment via AWS CodeDeploy
- Runs migrations
- Comprehensive health checks
- Smoke tests
- Error rate monitoring
- Auto-rollback on failure
- Creates release tag

### 3. Test Matrix (`test-matrix.yml`)

**Trigger**: PR, daily schedule, or manual

**Jobs**:

#### Test Matrix

- **OS**: Ubuntu, Windows, macOS
- **Node**: 18, 20
- Tests across all combinations
- Coverage only on Ubuntu + Node 20

#### Accessibility Tests

- Playwright-based accessibility tests
- axe-core integration
- WCAG 2.1 compliance checks

#### Performance Tests

- Lighthouse CI integration
- Performance budgets
- Core Web Vitals monitoring

#### Docker Compose Test

- End-to-end integration testing
- Full stack deployment verification
- Service health validation

## Environment Configuration

### GitHub Secrets

#### Required Secrets

**AWS Staging**:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`

**AWS Production**:

- `AWS_ACCESS_KEY_ID_PROD`
- `AWS_SECRET_ACCESS_KEY_PROD`

**Security**:

- `SNYK_TOKEN` - Snyk API token
- `CODECOV_TOKEN` - Codecov upload token

**Notifications**:

- `SLACK_WEBHOOK` - Slack webhook URL

### GitHub Environments

#### Staging Environment

- **Protection**: None (auto-deploy)
- **URL**: https://staging-api.comptianetwork.com
- **Secrets**: Staging-specific configuration

#### Production Environment

- **Protection**: Required reviewers
- **URL**: https://api.comptianetwork.com
- **Secrets**: Production configuration

## Deployment Process

### Staging Deployment

1. **Trigger**: Merge to `develop`
2. **Build**: Docker image created and pushed
3. **Deploy**: ECS service updated
4. **Migrate**: Database migrations run
5. **Verify**: Health checks pass
6. **Notify**: Slack notification sent

### Production Deployment

1. **Trigger**: Merge to `main` (requires approval)
2. **Backup**: Database backup created
3. **Build**: Production Docker image
4. **Deploy**: Blue/Green deployment
   - New tasks started (Green)
   - Health checks verify Green
   - Traffic shifted to Green
   - Old tasks terminated (Blue)
5. **Migrate**: Database migrations run
6. **Test**: Smoke tests execute
7. **Monitor**: Error rates checked
8. **Verify**: All health checks pass
9. **Tag**: Release tag created
10. **Notify**: Slack notification with status

### Rollback Process

**Automatic Rollback Triggers**:

- Health checks fail
- Error rate exceeds threshold (>10 errors)
- Smoke tests fail

**Rollback Steps**:

1. Identify previous task definition
2. Update ECS service to previous version
3. Force new deployment
4. Verify health
5. Notify team

**Manual Rollback**:

```bash
# Via GitHub Actions
gh workflow run backend-cd.yml \
  -f environment=production \
  -f version=previous

# Via AWS CLI
aws ecs update-service \
  --cluster comptia-production \
  --service backend-service \
  --task-definition comptia-backend:42 \
  --force-new-deployment
```

## Monitoring & Observability

### Health Checks

**Application Health** (`/health`):

- Returns 200 OK if healthy
- Checked every 30 seconds

**Readiness Check** (`/api/v1/health/readiness`):

- Database connectivity
- Redis connectivity
- External service availability

### Metrics Monitoring

**CloudWatch Metrics**:

- `HTTPCode_Target_5XX_Count` - Server errors
- `TargetResponseTime` - Response latency
- `RequestCount` - Traffic volume
- `HealthyHostCount` - Available instances

**Alert Thresholds**:

- Error rate > 1% (5 min window)
- Response time > 2s (p95)
- Healthy hosts < 2

### Log Aggregation

**Log Locations**:

- CloudWatch Logs: `/aws/ecs/comptia-backend`
- Container logs: `docker-compose logs`
- Application logs: `/app/logs/app.log`

**Log Levels**:

- Production: `warn` and above
- Staging: `info` and above
- Development: `debug` and above

## Performance Optimization

### Build Optimization

**Docker Build Cache**:

- GitHub Actions cache enabled
- Layer caching optimized
- Multi-stage builds minimize image size

**Parallel Execution**:

- Test jobs run in parallel
- Matrix builds for multiple platforms
- Independent workflow jobs

### Deployment Optimization

**ECS Configuration**:

- Rolling update strategy
- Minimum healthy percent: 50%
- Maximum percent: 200%
- Deployment parallelism: 1

**Database Migrations**:

- Zero-downtime migrations
- Backward compatible changes
- Rollback procedures documented

## Security Best Practices

### Code Security

**Static Analysis**:

- ESLint security rules
- Snyk vulnerability scanning
- npm audit in CI

**Secrets Management**:

- GitHub Secrets for sensitive data
- AWS Secrets Manager in production
- Environment-specific secrets

### Image Security

**Container Scanning**:

- Trivy vulnerability scanner
- Critical/High severity blocking
- SARIF upload to GitHub Security

**Base Images**:

- Alpine Linux (minimal)
- Official Node.js images
- Regular updates

### Runtime Security

**Container Hardening**:

- Non-root user (nodejs:nodejs)
- Read-only filesystem where possible
- Limited capabilities

**Network Security**:

- Private VPC subnets
- Security groups restricted
- TLS/SSL enforcement

## Troubleshooting CI/CD

### Common Issues

#### Build Failures

**Lint Errors**:

```bash
# Run locally
npm run lint:check

# Auto-fix
npm run lint
```

**Test Failures**:

```bash
# Run tests locally
npm run test

# With coverage
npm run test:coverage

# Specific test
npm run test -- tests/auth.test.ts
```

**Docker Build Failures**:

```bash
# Build locally
docker build -t comptia-backend:test .

# Check logs
docker-compose logs backend

# Validate Dockerfile
docker build --no-cache .
```

#### Deployment Failures

**Health Check Failures**:

```bash
# Check ECS tasks
aws ecs describe-tasks --cluster comptia-production --tasks <task-id>

# Check logs
aws logs tail /aws/ecs/comptia-backend --follow

# Test health endpoint
curl https://api.yourdomain.com/health
```

**Migration Failures**:

```bash
# Check migration status
docker-compose exec postgres psql -U postgres -d comptia_network -c \
  "SELECT * FROM schema_migrations;"

# Rollback migration
npm run db:migrate:rollback

# Retry migration
npm run db:migrate
```

### Debug Mode

**Enable Debug Logs**:

```yaml
# In workflow file
- name: Deploy
  env:
    ACTIONS_STEP_DEBUG: true
    ACTIONS_RUNNER_DEBUG: true
```

**View Detailed Logs**:

```bash
# GitHub Actions logs
gh run view <run-id> --log

# ECS task logs
aws logs get-log-events \
  --log-group-name /aws/ecs/comptia-backend \
  --log-stream-name ecs/backend/<task-id>
```

## Best Practices

### Branch Strategy

**Branch Protection**:

- Require PR reviews (2 approvers for main)
- Require status checks to pass
- Require up-to-date branches
- No force pushes

**Workflow**:

```
feature/* -> develop -> staging
develop -> main -> production
```

### Versioning

**Semantic Versioning**:

- MAJOR: Breaking changes
- MINOR: New features
- PATCH: Bug fixes

**Tagging**:

```bash
# Create tag
git tag -a v1.2.3 -m "Release v1.2.3"

# Push tag
git push origin v1.2.3

# CI automatically deploys tagged releases
```

### Testing Strategy

**Test Pyramid**:

- 70% Unit tests (fast, isolated)
- 20% Integration tests (API, database)
- 10% E2E tests (full user flows)

**Coverage Requirements**:

- Minimum: 80% overall
- Statements: 80%
- Branches: 75%
- Functions: 80%
- Lines: 80%

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Semantic Versioning](https://semver.org/)
