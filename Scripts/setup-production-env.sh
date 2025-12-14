#!/bin/bash
# Setup .env.production file
# Run this on omega.hostup.se after cloning the repo

set -e

echo "🔧 Setting up .env.production..."
echo ""

# Generate secrets
echo "Generating secrets..."
ENCRYPTION_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
CSRF_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ADMIN_API_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

# Create .env.production
cat > .env.production << EOF
# Production Environment Variables
NODE_ENV=production
PORT=3000

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=skyddad_user
DB_PASSWORD=Mb2HQE7pCrA7WUt2oZ
DB_NAME=skyddad_v2_db

# Encryption
ENCRYPTION_KEY=${ENCRYPTION_KEY}

# Session
SESSION_SECRET=${SESSION_SECRET}

# CSRF
CSRF_SECRET=${CSRF_SECRET}

# Admin API
ENABLE_ADMIN_API=true
ADMIN_API_KEY=${ADMIN_API_KEY}

# Sentry (configure if needed)
ENABLE_SENTRY=false
# SENTRY_DSN=
# SENTRY_ENVIRONMENT=production

# Features
ENABLE_METRICS=true
ENABLE_ANALYTICS=false
EOF

echo "✅ .env.production created"
echo ""
echo "⚠️  IMPORTANT: Save these secrets securely:"
echo "   ENCRYPTION_KEY: ${ENCRYPTION_KEY}"
echo "   SESSION_SECRET: ${SESSION_SECRET}"
echo "   CSRF_SECRET: ${CSRF_SECRET}"
echo "   ADMIN_API_KEY: ${ADMIN_API_KEY}"
echo ""
echo "Also update SKYDDAD_API_KEY in ~/public_html/retea/api/config.php"
echo "   SetEnv SKYDDAD_API_KEY \"${ADMIN_API_KEY}\""




