# Deploy modernized layout files to server
$ErrorActionPreference = "Stop"

Write-Host "Deploying modernized layout..." -ForegroundColor Cyan
Write-Host ""

# Read files
$cssContent = Get-Content "public/css/main.css" -Raw -Encoding UTF8
$jsContent = Get-Content "public/js/theme-toggle.js" -Raw -Encoding UTF8
$layoutContent = Get-Content "views/layouts/main.hbs" -Raw -Encoding UTF8

# Encode to base64
$cssB64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($cssContent))
$jsB64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($jsContent))
$layoutB64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($layoutContent))

# Create command to copy files
$deployCommand = @"
cd ~/skyddad-v2-app && \
mkdir -p public/css public/js views/layouts && \
echo '$cssB64' | base64 -d > public/css/main.css && \
echo '$jsB64' | base64 -d > public/js/theme-toggle.js && \
echo '$layoutB64' | base64 -d > views/layouts/main.hbs && \
chmod 644 public/css/main.css public/js/theme-toggle.js views/layouts/main.hbs && \
ls -lh public/css/main.css public/js/theme-toggle.js views/layouts/main.hbs && \
echo 'Files deployed successfully'
"@

Write-Host "Copying files to server..." -ForegroundColor Yellow
$result = & .\Scripts\safe-ssh.ps1 -Command $deployCommand -TimeoutSeconds 60
Write-Host $result

Write-Host ""
Write-Host "Waiting 5 seconds for Passenger to reload..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Verifying deployment..." -ForegroundColor Yellow

# Test main page
try {
    $response = Invoke-WebRequest -Uri "https://retea.se/skyddad/" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "  OK - Main page (HTTP 200)" -ForegroundColor Green

        # Check for Inter font
        if ($response.Content -match 'fonts.googleapis.com.*Inter') {
            Write-Host "  OK - Inter font loaded" -ForegroundColor Green
        } else {
            Write-Host "  WARNING - Inter font not found in HTML" -ForegroundColor Yellow
        }

        # Check for updated CSS
        if ($response.Content -match 'main.css') {
            Write-Host "  OK - CSS file referenced" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "  FAILED - Main page: $($_.Exception.Message)" -ForegroundColor Red
}

# Test CSS file
try {
    $cssResponse = Invoke-WebRequest -Uri "https://retea.se/skyddad/css/main.css" -UseBasicParsing -TimeoutSec 10
    if ($cssResponse.StatusCode -eq 200) {
        Write-Host "  OK - CSS file accessible (HTTP 200)" -ForegroundColor Green
        if ($cssResponse.Content -match '--font-primary.*Inter') {
            Write-Host "  OK - Inter font in CSS" -ForegroundColor Green
        }
        if ($cssResponse.Content -match '#0F1419') {
            Write-Host "  OK - Gråsvart dark theme color found" -ForegroundColor Green
        }
    }
} catch {
    Write-Host "  FAILED - CSS file: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "Deployment complete!" -ForegroundColor Green

