#!/bin/bash
# Setup Passenger configuration for Skyddad v2
# Run this on omega.hostup.se

set -e

echo "🔧 Setting up Passenger configuration..."
echo ""

# Find Node.js path
NODE_PATH=$(which node || echo "/usr/bin/node")
if [ -f "$HOME/.nvm/nvm.sh" ]; then
    source "$HOME/.nvm/nvm.sh"
    NODE_PATH=$(which node)
fi

echo "Node.js path: $NODE_PATH"
echo ""

# Create skyddad directory in public_html/retea
mkdir -p ~/public_html/retea/skyddad

# Create .htaccess
cat > ~/public_html/retea/skyddad/.htaccess << EOF
# Passenger configuration for Skyddad v2
PassengerEnabled On
PassengerAppRoot $HOME/skyddad-v2-app
PassengerAppType node
PassengerStartupFile dist/server.js
PassengerNodejs $NODE_PATH

# Security headers (if not already in root .htaccess)
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
</IfModule>

# Disable directory listing
Options -Indexes
EOF

echo "✅ .htaccess created at ~/public_html/retea/skyddad/.htaccess"
echo ""
echo "⚠️  IMPORTANT: Update PassengerNodejs path if needed:"
echo "   Current: $NODE_PATH"
echo ""
echo "Next: Test deployment with: curl https://retea.se/skyddad/healthz"




