#!/bin/bash
# Setup script for cleanup cron job
# Adds hourly cleanup job to crontab

set -e

echo "⏰ Setting up cleanup cron job..."
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

# Step 1: Find Node.js path
echo -e "${YELLOW}1️⃣ Finding Node.js path...${NC}"
NODE_PATH=$(which node || echo "/usr/bin/node")
if [ ! -f "$NODE_PATH" ]; then
    echo -e "${RED}❌ Error: Node.js not found. Please install Node.js first.${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Found Node.js at: $NODE_PATH${NC}"
echo ""

# Step 2: Create logs directory
echo -e "${YELLOW}2️⃣ Creating logs directory...${NC}"
LOGS_DIR="$HOME/skyddad-v2-app/logs"
mkdir -p "$LOGS_DIR"
echo -e "${GREEN}✅ Logs directory created: $LOGS_DIR${NC}"
echo ""

# Step 3: Check if cron job already exists
echo -e "${YELLOW}3️⃣ Checking existing crontab...${NC}"
CRON_CMD="0 * * * * cd $HOME/skyddad-v2-app && $NODE_PATH scripts/cleanup-cron.js >> logs/cleanup.log 2>&1"

if crontab -l 2>/dev/null | grep -q "cleanup-cron.js"; then
    echo -e "${YELLOW}⚠️  Cleanup cron job already exists. Updating...${NC}"
    # Remove old cron job
    crontab -l 2>/dev/null | grep -v "cleanup-cron.js" | crontab -
fi

# Step 4: Add cron job
echo -e "${YELLOW}4️⃣ Adding cleanup cron job...${NC}"
(crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
echo -e "${GREEN}✅ Cleanup cron job added${NC}"
echo ""

# Step 5: Verify cron job
echo -e "${YELLOW}5️⃣ Verifying cron job...${NC}"
if crontab -l | grep -q "cleanup-cron.js"; then
    echo -e "${GREEN}✅ Cron job verified${NC}"
    echo "Cron job:"
    crontab -l | grep "cleanup-cron.js"
else
    echo -e "${RED}❌ Error: Cron job not found after adding${NC}"
    exit 1
fi
echo ""

echo -e "${GREEN}✨ Cleanup cron job setup complete!${NC}"
echo ""
echo "The cleanup job will run every hour at :00"
echo "Logs will be written to: $LOGS_DIR/cleanup.log"
echo ""
echo "To test manually:"
echo "  cd $HOME/skyddad-v2-app"
echo "  $NODE_PATH scripts/cleanup-cron.js"
echo ""
echo "To view logs:"
echo "  tail -f $LOGS_DIR/cleanup.log"




