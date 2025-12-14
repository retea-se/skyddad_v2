#!/bin/bash
# Complete setup script for Skyddad v2
# Runs all setup steps in sequence

set -e

echo "🚀 Starting complete Skyddad v2 setup..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Check if we're on the server
if [ ! -d "$HOME/skyddad-v2-app" ]; then
    echo -e "${RED}❌ Error: This script must be run on the server (omega.hostup.se)${NC}"
    echo "Expected directory: ~/skyddad-v2-app"
    exit 1
fi

cd "$HOME/skyddad-v2-app"

# Step 1: Setup admin-proxy
echo -e "${YELLOW}1️⃣ Setting up admin-proxy...${NC}"
if [ -f "Scripts/setup-admin-proxy.sh" ]; then
    bash Scripts/setup-admin-proxy.sh
    echo ""
else
    echo -e "${RED}❌ Error: Scripts/setup-admin-proxy.sh not found${NC}"
    exit 1
fi

# Step 2: Setup cleanup cron
echo -e "${YELLOW}2️⃣ Setting up cleanup cron...${NC}"
if [ -f "Scripts/setup-cleanup-cron.sh" ]; then
    bash Scripts/setup-cleanup-cron.sh
    echo ""
else
    echo -e "${RED}❌ Error: Scripts/setup-cleanup-cron.sh not found${NC}"
    exit 1
fi

# Step 3: Verify setup
echo -e "${YELLOW}3️⃣ Verifying setup...${NC}"

# Check routing configuration (root .htaccess must have /skyddad/ as exception)
echo -e "${YELLOW}   Checking routing configuration...${NC}"
if grep -q "RewriteCond.*skyddad" "$HOME/public_html/.htaccess" 2>/dev/null; then
    echo -e "${GREEN}✅ Root .htaccess has /skyddad/ exception${NC}"
else
    echo -e "${RED}⚠️  WARNING: Root .htaccess may not have /skyddad/ exception!${NC}"
    echo -e "${YELLOW}   Please verify: cat ~/public_html/.htaccess | grep skyddad${NC}"
    echo -e "${YELLOW}   See docs/ROUTING.md for details${NC}"
fi

# Check admin-proxy config
if grep -q "SKYDDAD_API_KEY" "$HOME/public_html/retea/api/config.php" 2>/dev/null; then
    echo -e "${GREEN}✅ Admin-proxy config found${NC}"
else
    echo -e "${YELLOW}⚠️  Admin-proxy config not found (may need manual setup)${NC}"
fi

# Check cron job
if crontab -l 2>/dev/null | grep -q "cleanup-cron.js"; then
    echo -e "${GREEN}✅ Cleanup cron job found${NC}"
else
    echo -e "${YELLOW}⚠️  Cleanup cron job not found${NC}"
fi

# Check logs directory
if [ -d "logs" ]; then
    echo -e "${GREEN}✅ Logs directory exists${NC}"
else
    echo -e "${YELLOW}⚠️  Logs directory not found${NC}"
fi

echo ""
echo -e "${GREEN}✨ Setup complete!${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Routing configuration${NC}"
echo "   Make sure root .htaccess (~/public_html/.htaccess) has /skyddad/ as exception."
echo "   See docs/ROUTING.md for details. This script does NOT modify root .htaccess."
echo ""
echo "Next steps:"
echo "  1. Verify routing: cat ~/public_html/.htaccess | grep skyddad"
echo "  2. Test deployment: curl https://retea.se/skyddad/healthz"
echo "  3. Test admin API: curl -H 'X-API-Key: ...' https://retea.se/skyddad/admin/api/stats/summary"
echo "  4. Monitor cleanup logs: tail -f logs/cleanup.log"

