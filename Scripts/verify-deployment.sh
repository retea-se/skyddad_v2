#!/bin/bash
# Verify deployment is working
# Run: bash Scripts/verify-deployment.sh

set -e

echo "🔍 Verifying deployment..."
echo ""

# Test 1: Healthcheck
echo "1️⃣ Testing healthcheck..."
HEALTH=$(curl -s -w "\n%{http_code}" https://retea.se/skyddad/healthz 2>&1)
HEALTH_BODY=$(echo "$HEALTH" | head -n -1)
HEALTH_CODE=$(echo "$HEALTH" | tail -n 1)

if [ "$HEALTH_CODE" = "200" ]; then
    echo "✅ Healthcheck OK (HTTP $HEALTH_CODE)"
    echo "$HEALTH_BODY" | head -c 200
    echo ""
else
    echo "❌ Healthcheck FAILED (HTTP $HEALTH_CODE)"
    echo "Response: $HEALTH_BODY"
fi
echo ""

# Test 2: Main page
echo "2️⃣ Testing main page..."
MAIN=$(curl -s -w "\n%{http_code}" https://retea.se/skyddad/ 2>&1)
MAIN_BODY=$(echo "$MAIN" | head -n -1)
MAIN_CODE=$(echo "$MAIN" | tail -n 1)

if [ "$MAIN_CODE" = "200" ]; then
    echo "✅ Main page OK (HTTP $MAIN_CODE)"
    if echo "$MAIN_BODY" | grep -q "Skyddad\|skyddad"; then
        echo "✅ Page content looks correct"
    fi
else
    echo "❌ Main page FAILED (HTTP $MAIN_CODE)"
    echo "Response: $MAIN_BODY" | head -c 200
fi
echo ""

echo "✨ Verification complete!"
