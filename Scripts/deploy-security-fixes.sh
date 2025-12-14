#!/bin/bash
# Deploy säkerhetsförbättringar till produktion
# Kör detta på omega.hostup.se

set -e

echo "🚀 Deployar säkerhetsförbättringar..."
echo ""

cd ~/skyddad-v2-app

# Pull latest changes
echo "1️⃣ Pullar senaste ändringar..."
git pull origin main
echo "✅ Pull klar"
echo ""

# Install dependencies
echo "2️⃣ Installerar dependencies..."
npm install --production
echo "✅ Dependencies installerade"
echo ""

# Build
echo "3️⃣ Bygger projekt..."
npm run build
echo "✅ Build klar"
echo ""

# Restart Passenger
echo "4️⃣ Startar om Passenger..."
touch tmp/restart.txt
echo "✅ Passenger restart triggad"
echo ""

# Wait a bit for restart
echo "5️⃣ Väntar på att Passenger startar om..."
sleep 5

# Verify deployment
echo "6️⃣ Verifierar deployment..."
if curl -s -f https://retea.se/skyddad/healthz > /dev/null; then
    echo "✅ Healthcheck OK"
else
    echo "⚠️  Healthcheck misslyckades, men deployment kan fortfarande vara OK"
fi

echo ""
echo "✨ Deployment klar!"
echo ""
echo "Testa frontend med:"
echo "   curl https://retea.se/skyddad/"
echo ""

