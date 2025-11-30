# Deployment Checklist - Skyddad v2

Checklista innan production deployment.

## Pre-Deployment

### Code Quality
- [x] All tests passing
- [x] Linting passes without errors
- [x] TypeScript compiles without errors
- [x] No console errors in production build
- [x] Code review completed

### Security
- [x] All secrets in environment variables (not in code)
- [x] .env files in .gitignore
- [x] CSRF protection enabled
- [x] Rate limiting configured
- [x] Secure headers configured (Helmet)
- [x] Input validation on all endpoints
- [x] SQL injection protection (parameterized queries)
- [x] XSS protection (Handlebars auto-escaping)

### Database
- [x] Migrations tested
- [x] Backup strategy in place
- [x] Database credentials secure
- [x] Indexes created for performance

### Configuration
- [x] Environment variables documented
- [x] Feature flags configured
- [x] Sentry DSN configured (if enabled)
- [x] Admin API key configured (if enabled)

### Documentation
- [x] README updated
- [x] Setup guide complete
- [x] Security documentation complete
- [x] GDPR documentation complete
- [x] API documentation complete

## Deployment Steps

1. **Database Setup**
   - Create database `skyddad_v2_db`
   - Create user and grant permissions
   - Run migrations: `npm run migrate`

2. **Environment Configuration**
   - Copy `.env.example` to `.env.production`
   - Set all required environment variables
   - Generate encryption keys (32 bytes hex)
   - Generate session secrets (min 32 chars)
   - Set Sentry DSN (if enabled)

3. **Build Application**
   ```bash
   npm ci
   npm run build
   ```

4. **Deploy Files**
   - Upload `dist/` folder
   - Upload `views/` folder
   - Upload `public/` folder
   - Upload `locales/` folder
   - Upload `migrations/` folder
   - Upload `config/` folder (if needed)
   - Upload `package.json` and `package-lock.json`

5. **Install Dependencies**
   ```bash
   npm ci --production
   ```

6. **Setup .htaccess**
   - Create minimal `.htaccess` (no routing conflicts)
   - Configure Passenger (if used)
   - Test that routing works

7. **Setup Cron Jobs**
   - Configure cleanup cron: `0 * * * * node scripts/cleanup-cron.js`
   - Test cron job manually first

8. **Verify**
   - Test health endpoint: `/healthz`
   - Test main flow: create → view → delete
   - Test error pages: 404, 500
   - Test rate limiting
   - Test PIN protection
   - Verify Sentry (if enabled)
   - Check logs for errors

## Post-Deployment

- [ ] Monitor error logs (Sentry)
- [ ] Verify cleanup cron runs
- [ ] Test all critical user flows
- [ ] Monitor performance metrics
- [ ] Verify GDPR compliance
- [ ] Update documentation if needed

## Rollback Plan

If deployment fails:
1. Revert to previous version
2. Restore database backup if needed
3. Check error logs
4. Fix issues before retry

