#!/bin/bash
# Deployment script for Skyddad v2
# Run this on omega.hostup.se

set -e  # Exit on error

echo "🚀 Starting Skyddad v2 deployment..."
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Are you in the project root?${NC}"
    exit 1
fi

# Step 1: Install dependencies
echo -e "${YELLOW}1️⃣ Installing dependencies...${NC}"
npm install --production
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 2: Build project
echo -e "${YELLOW}2️⃣ Building project...${NC}"
npm run build
echo -e "${GREEN}✅ Project built${NC}"
echo ""

# Step 3: Check .env.production exists
if [ ! -f ".env.production" ]; then
    echo -e "${RED}❌ Error: .env.production not found!${NC}"
    echo -e "${YELLOW}💡 Create .env.production with database credentials${NC}"
    exit 1
fi
echo -e "${GREEN}✅ .env.production found${NC}"
echo ""

# Step 4: Run migrations
echo -e "${YELLOW}3️⃣ Running database migrations...${NC}"
npm run migrate
echo -e "${GREEN}✅ Migrations completed${NC}"
echo ""

# Step 5: Verify build
if [ ! -d "dist" ] || [ ! -f "dist/server.js" ]; then
    echo -e "${RED}❌ Error: Build failed - dist/server.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build verified${NC}"
echo ""

echo -e "${GREEN}✅ Deployment preparation complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Configure Passenger in .htaccess"
echo "  2. Create symlink: ln -s ~/skyddad-v2-app/public ~/public_html/retea/skyddad"
echo "  3. Test: curl https://retea.se/skyddad/healthz"




