#!/bin/bash
# Setup script for admin-proxy configuration
# Updates config.php and .htaccess with Skyddad API credentials

set -e

echo "🔧 Setting up admin-proxy configuration..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if we're on the server
if [ ! -d "$HOME/public_html/retea/api" ]; then
    echo -e "${RED}❌ Error: This script must be run on the server (omega.hostup.se)${NC}"
    echo "Expected directory: ~/public_html/retea/api"
    exit 1
fi

# Step 1: Get ADMIN_API_KEY from .env.production
echo -e "${YELLOW}1️⃣ Reading ADMIN_API_KEY from .env.production...${NC}"
if [ ! -f "$HOME/skyddad-v2-app/.env.production" ]; then
    echo -e "${RED}❌ Error: .env.production not found at ~/skyddad-v2-app/.env.production${NC}"
    exit 1
fi

ADMIN_API_KEY=$(grep "^ADMIN_API_KEY=" "$HOME/skyddad-v2-app/.env.production" | cut -d '=' -f2 | tr -d '"' | tr -d "'" || echo "")
if [ -z "$ADMIN_API_KEY" ]; then
    echo -e "${RED}❌ Error: ADMIN_API_KEY not found in .env.production${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Found ADMIN_API_KEY${NC}"
echo ""

# Step 2: Update config.php
echo -e "${YELLOW}2️⃣ Updating config.php...${NC}"
CONFIG_FILE="$HOME/public_html/retea/api/config.php"

if [ ! -f "$CONFIG_FILE" ]; then
    echo -e "${YELLOW}⚠️  config.php not found. Creating new file...${NC}"
    touch "$CONFIG_FILE"
fi

# Check if Skyddad config already exists
if grep -q "SKYDDAD_API_KEY" "$CONFIG_FILE"; then
    echo -e "${YELLOW}⚠️  Skyddad config already exists. Updating...${NC}"
    # Remove old config
    sed -i '/^\/\/ Skyddad API Configuration/,/^define.*SKYDDAD_API_BASE_URL.*$/d' "$CONFIG_FILE"
fi

# Add new config
cat >> "$CONFIG_FILE" << EOF

// Skyddad API Configuration
define('SKYDDAD_API_KEY', getenv('SKYDDAD_API_KEY') ?: '');
define('SKYDDAD_API_BASE_URL', getenv('SKYDDAD_API_BASE_URL') ?: 'https://retea.se/skyddad');
EOF

echo -e "${GREEN}✅ config.php updated${NC}"
echo ""

# Step 3: Update .htaccess with environment variables
echo -e "${YELLOW}3️⃣ Updating .htaccess with environment variables...${NC}"
HTACCESS_FILE="$HOME/public_html/retea/.htaccess"

# IMPORTANT: We only add environment variables, NO routing rules
# Root .htaccess (~/public_html/.htaccess) must have /skyddad/ as exception
# See docs/ROUTING.md for details - we NEVER modify root .htaccess

if [ ! -f "$HTACCESS_FILE" ]; then
    echo -e "${YELLOW}⚠️  .htaccess not found. Creating new file...${NC}"
    touch "$HTACCESS_FILE"
fi

# Check if Skyddad env vars already exist
if grep -q "SKYDDAD_API_KEY" "$HTACCESS_FILE"; then
    echo -e "${YELLOW}⚠️  Skyddad env vars already exist. Updating...${NC}"
    # Remove old env vars (only the ones we added, not any routing rules)
    sed -i '/^# Skyddad API Environment Variables/,/^<\/IfModule>$/d' "$HTACCESS_FILE"
    sed -i '/^SetEnv SKYDDAD_API_KEY/d' "$HTACCESS_FILE"
    sed -i '/^SetEnv SKYDDAD_API_BASE_URL/d' "$HTACCESS_FILE"
fi

# Add new env vars (ONLY environment variables, NO routing rules)
cat >> "$HTACCESS_FILE" << EOF

# Skyddad API Environment Variables
# NOTE: This only adds environment variables. Root .htaccess must have /skyddad/ as exception.
# See docs/ROUTING.md for routing configuration details.
<IfModule mod_env.c>
    SetEnv SKYDDAD_API_KEY "$ADMIN_API_KEY"
    SetEnv SKYDDAD_API_BASE_URL "https://retea.se/skyddad"
</IfModule>
EOF

echo -e "${GREEN}✅ .htaccess updated (environment variables only)${NC}"
echo ""

echo -e "${GREEN}✨ Admin-proxy configuration complete!${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Routing configuration${NC}"
echo "   Make sure root .htaccess (~/public_html/.htaccess) has /skyddad/ as exception."
echo "   See docs/ROUTING.md for details. This script does NOT modify root .htaccess."
echo ""
echo "Next steps:"
echo "  1. Verify root .htaccess has /skyddad/ exception: cat ~/public_html/.htaccess | grep skyddad"
echo "  2. Restart Passenger (if needed): touch ~/public_html/retea/skyddad/tmp/restart.txt"
echo "  3. Test admin API: curl -H 'X-API-Key: $ADMIN_API_KEY' https://retea.se/skyddad/admin/api/stats/summary"
echo "  4. Setup cleanup cron: ./Scripts/setup-cleanup-cron.sh"

