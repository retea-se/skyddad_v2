# Changelog

All notable changes to Skyddad v2 will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-01-XX

### Added
- Complete project setup with TypeScript, ESLint, Prettier
- Core functionality: create, view, and manage one-time secrets
- AES-256-CBC encryption for secrets
- Optional PIN protection with bcrypt hashing
- Two-language support (Swedish/English) with i18n
- GDPR-compliant logging and data handling
- Cookie consent banner
- Privacy policy page
- FAQ page with SEO-optimized structured data
- Admin API endpoints with authentication
- Sentry error tracking integration
- Health check and metrics endpoints
- Automated cleanup cron jobs
- Comprehensive testing (unit + integration)
- CI/CD pipeline with GitHub Actions
- Pre-commit hooks with Husky
- CSRF protection and session management
- Rate limiting on all endpoints
- SEO optimization (meta tags, sitemap, robots.txt)
- Lighthouse CI configuration
- Complete documentation (SECURITY.md, DATABASE.md, GDPR.md, etc.)

### Security
- AES-256-CBC encryption for all secrets
- bcrypt hashing for PINs (cost factor 12)
- HMAC token validation for links
- CSRF protection on all forms
- Rate limiting (10 secrets/hour, 20 views/hour)
- PIN brute-force protection (max 5 attempts)
- Secure headers (Helmet)
- Input validation and sanitization
- SQL injection protection (parameterized queries)
- XSS protection (Handlebars auto-escaping)

### Changed
- Copy review: All user-facing texts improved for non-technical users
- Privacy policy texts simplified (removed technical jargon)
- Error messages made more helpful and user-friendly

### Documentation
- Complete setup guide (docs/SETUP.md)
- Security documentation (docs/SECURITY.md)
- Database documentation (docs/DATABASE.md)
- GDPR compliance documentation (docs/GDPR.md)
- Copy review documentation (docs/COPY_REVIEW.md)
- Project plan with status (docs/PLAN.md)

