# CI/CD Pipeline Configuration

## Overview

Comprehensive CI/CD pipeline for the CompTIA Network+ Learning Application with automated testing, building, and deployment to GitHub Pages.

## GitHub Actions Workflows

### 1. CI Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main`
- Manual workflow dispatch

**Jobs:**
- **Lint and Format Check** - ESLint and Prettier validation
- **Type Check** - TypeScript type validation
- **Unit Tests** - Jest unit test execution with coverage
- **Integration Tests** - Integration test suite
- **E2E Tests** - Playwright end-to-end tests
- **Build Verification** - Production build validation
- **Security Scan** - npm audit and Snyk security scanning
- **CI Summary** - Overall status report

### 2. Deployment Pipeline (`.github/workflows/deploy.yml`)

**Triggers:**
- Push to `main` branch
- Manual workflow dispatch

**Jobs:**
- **Build** - Production build with asset optimization
  - Gzip compression for JS, CSS, and HTML
  - Asset optimization
  - Pages artifact preparation
- **Deploy** - Deployment to GitHub Pages
- **Post-Deploy** - Verification and Lighthouse audit

### 3. Deploy Preview (`.github/workflows/deploy-preview.yml`)

**Triggers:**
- Pull requests to `main`

**Features:**
- Builds preview version
- Uploads artifacts for testing
- Comments on PR with build status

### 4. CodeQL Analysis (`.github/workflows/codeql.yml`)

**Triggers:**
- Push to `main` or `develop`
- Pull requests to `main`
- Weekly schedule (Monday 6 AM UTC)

**Features:**
- Security vulnerability scanning
- Code quality analysis
- Extended security queries

### 5. Lighthouse Performance (`.github/workflows/lighthouse.yml`)

**Triggers:**
- Push to `main`
- Pull requests to `main`
- Weekly schedule (Sunday)

**Features:**
- Performance auditing
- Accessibility testing
- SEO analysis
- Best practices validation

## Dependabot Configuration

Automated dependency updates configured in `.github/dependabot.yml`:

- **NPM packages** - Weekly updates on Mondays
- **GitHub Actions** - Weekly updates on Mondays
- Automatic PR creation with labels and reviewers
- Major version updates ignored for critical packages

## Docker Configuration

### Production Dockerfile

Multi-stage build optimized for production:
1. **Dependencies** - Install production dependencies
2. **Builder** - Build the application
3. **Production** - Nginx server with optimized assets

**Features:**
- Alpine Linux for minimal image size
- Custom nginx configuration
- Health checks
- Gzip compression
- Security headers

### Development Dockerfile (Dockerfile.dev)

Optimized for development with hot reload:
- Playwright browser dependencies
- Volume mounting for live code updates
- Dev server on port 5173

### Docker Compose

Services available:
- **dev** - Development server with hot reload
- **prod** - Production preview on port 8080
- **test** - Test runner
- **e2e** - E2E testing with Playwright

**Usage:**
```bash
# Start development server
docker-compose up dev

# Start production preview
docker-compose up prod

# Run tests
docker-compose up test

# Run E2E tests
docker-compose up e2e
```

## Nginx Configuration

Custom `nginx.conf` with:
- Gzip compression
- Browser caching (1 year for static assets)
- Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- SPA routing support
- Health check endpoint at `/health`
- Hidden file protection

## Lighthouse CI

Configuration in `.lighthouserc.json`:
- 3 runs for consistency
- Minimum scores:
  - Performance: 90/100
  - Accessibility: 90/100
  - Best Practices: 90/100
  - SEO: 90/100
- Web Vitals thresholds:
  - FCP < 2000ms
  - LCP < 2500ms
  - CLS < 0.1
  - TBT < 300ms

## GitHub Pages Setup

### Repository Settings

1. Navigate to Settings → Pages
2. Set Source to "GitHub Actions"
3. Configure custom domain (optional)

### Required Permissions

The deploy workflow requires these permissions:
- `contents: read`
- `pages: write`
- `id-token: write`

### URL Structure

- **Production**: `https://{username}.github.io/{repo-name}/`
- **Custom Domain**: Configure CNAME in repository settings

## Security Features

### Secrets Required (Optional)

- `SNYK_TOKEN` - For Snyk security scanning (optional)
- Additional secrets for custom integrations

### Security Scanning

- **npm audit** - Runs on every CI build
- **Snyk** - Advanced vulnerability scanning (if token provided)
- **CodeQL** - GitHub native security analysis
- **Dependabot** - Automated dependency security updates

## Monitoring and Notifications

### Build Status

View workflow runs at:
```
https://github.com/{username}/{repo-name}/actions
```

### Artifacts

Build artifacts are stored for 7 days:
- Build outputs
- Test coverage reports
- Playwright test results
- Preview builds

### PR Comments

Automated comments on PRs for:
- Build completion status
- Lighthouse performance scores
- Test results

## Local Development with Docker

### Quick Start

```bash
# Development with hot reload
docker-compose up dev

# Access at http://localhost:5173
```

### Production Testing

```bash
# Build and run production image
docker-compose up prod

# Access at http://localhost:8080
```

### Testing

```bash
# Run all tests
docker-compose up test

# Run E2E tests
docker-compose up e2e
```

## Troubleshooting

### Build Failures

1. Check workflow logs in GitHub Actions
2. Verify all tests pass locally
3. Ensure dependencies are up to date
4. Check for TypeScript errors

### Deployment Issues

1. Verify GitHub Pages is enabled
2. Check permissions in workflow file
3. Ensure build completes successfully
4. Verify `dist/` directory exists after build

### Docker Issues

1. Rebuild images: `docker-compose build --no-cache`
2. Clean volumes: `docker-compose down -v`
3. Check logs: `docker-compose logs service-name`

## Performance Optimization

### Build Optimization

- Asset compression (Gzip)
- Code splitting
- Tree shaking
- Minification

### Caching Strategy

- npm dependencies cached in GitHub Actions
- Docker layer caching
- Browser caching via nginx headers

## Continuous Improvement

### Metrics Tracked

- Build times
- Test coverage
- Bundle sizes
- Lighthouse scores
- Security vulnerabilities

### Regular Maintenance

- Weekly Dependabot updates
- Weekly security scans
- Monthly performance audits

## Support

For issues or questions:
1. Check workflow logs in GitHub Actions
2. Review this documentation
3. Check repository issues
4. Create new issue with details
