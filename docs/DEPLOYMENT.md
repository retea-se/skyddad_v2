# Deployment Guide

Instructions for deploying to different environments.

## 🌍 Environments

| Environment | URL | Branch | Purpose |
|-------------|-----|--------|---------|
| Development | `http://localhost:3000` | any | Local development |
| Staging | `https://staging.example.com` | `develop` | Pre-production testing |
| Production | `https://example.com` | `main` | Live system |

## 🚀 Deployment Process

### Prerequisites

**Before deploying:**
- [ ] All tests pass (`npm test`)
- [ ] Code reviewed and approved
- [ ] CHANGELOG.md updated
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Security scan passed

### Staging Deployment

**Automatic (via CI/CD):**
```bash
# Push to develop branch
git push origin develop

# GitHub Actions automatically:
# 1. Runs tests
# 2. Builds application
# 3. Deploys to staging
# 4. Runs smoke tests
```

**Manual (if needed):**
```bash
# Build application
npm run build

# Deploy to staging
npm run deploy:staging

# Verify deployment
npm run test:e2e -- --env=staging
```

### Production Deployment

**Process:**
1. **Create release PR** (develop → main)
2. **Review and approve** (requires 2 approvals)
3. **Merge to main**
4. **Tag release** (`v1.2.3`)
5. **CI/CD deploys automatically**

```bash
# After merging to main
git checkout main
git pull origin main

# Tag release
git tag -a v1.2.3 -m "Release v1.2.3"
git push origin v1.2.3

# CI/CD will:
# 1. Build production bundle
# 2. Run full test suite
# 3. Create backup
# 4. Deploy to production
# 5. Run smoke tests
# 6. Notify team
```

## 🔧 Configuration

### Environment Variables

**Required for all environments:**
```bash
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://...
API_URL=https://api.example.com
```

**Production-specific:**
```bash
SESSION_SECRET=[secure-random-secret]
JWT_SECRET=[secure-random-secret]
SENTRY_DSN=[error-tracking]
ANALYTICS_ID=[google-analytics]
```

**Setting variables:**
- **Staging/Production:** Set in hosting platform (Vercel/Heroku/AWS)
- **Local:** Use `.env` file (never commit!)

### Database Migrations

**Before deploying:**
```bash
# Check pending migrations
npm run migrate:status

# Run migrations (dry-run first)
npm run migrate:dry-run

# Apply migrations
npm run migrate
```

**Rolling back:**
```bash
# Rollback last migration
npm run migrate:rollback

# Rollback to specific version
npm run migrate:rollback -- --to=20240115
```

## 🔄 CI/CD Pipeline

**GitHub Actions workflow:**

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - Checkout code
      - Install dependencies
      - Run linter
      - Run tests
      - Run security scan

  build:
    needs: test
    steps:
      - Build application
      - Upload artifacts

  deploy:
    needs: build
    steps:
      - Download artifacts
      - Deploy to environment
      - Run smoke tests
      - Notify team
```

## 📊 Health Checks

**After deployment, verify:**

```bash
# API health check
curl https://api.example.com/health

# Expected response:
{
  "status": "healthy",
  "version": "1.2.3",
  "uptime": 123456
}

# Database connection
curl https://api.example.com/health/db

# Cache connection
curl https://api.example.com/health/cache
```

## 🚨 Rollback Procedure

**If deployment fails:**

```bash
# Automatic rollback (in CI/CD)
# Triggers if smoke tests fail

# Manual rollback
git revert HEAD
git push origin main

# Or revert to specific version
git reset --hard v1.2.2
git push origin main --force  # ⚠️ Use with caution!

# Rollback database if needed
npm run migrate:rollback
```

## 📝 Post-Deployment Checklist

- [ ] Verify deployment successful (CI/CD green)
- [ ] Check error logs (Sentry/CloudWatch)
- [ ] Verify health endpoints respond
- [ ] Test critical user flows (login, checkout, etc)
- [ ] Monitor performance metrics (Datadog/New Relic)
- [ ] Notify team in Slack (#deployments)
- [ ] Update deployment log

## 🔗 Related Resources

- **Hosting Platform:** [Vercel/Heroku/AWS Console]
- **CI/CD:** [GitHub Actions dashboard]
- **Monitoring:** [Datadog/New Relic dashboard]
- **Error Tracking:** [Sentry dashboard]
