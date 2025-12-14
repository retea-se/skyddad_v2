# Deploy modernized layout files to server (split into smaller commands)
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

# Create directories first
Write-Host "1. Creating directories..." -ForegroundColor Yellow
$mkdirCommand = "cd ~/skyddad-v2-app && mkdir -p public/css public/js views/layouts"
& .\Scripts\safe-ssh.ps1 -Command $mkdirCommand -TimeoutSeconds 30 | Out-Null

# Deploy CSS
Write-Host "2. Deploying CSS..." -ForegroundColor Yellow
$cssCommand = "cd ~/skyddad-v2-app && echo '$cssB64' | base64 -d > public/css/main.css && chmod 644 public/css/main.css && ls -lh public/css/main.css"
& .\Scripts\safe-ssh.ps1 -Command $cssCommand -TimeoutSeconds 60

# Deploy JS
Write-Host ""
Write-Host "3. Deploying JavaScript..." -ForegroundColor Yellow
$jsCommand = "cd ~/skyddad-v2-app && echo '$jsB64' | base64 -d > public/js/theme-toggle.js && chmod 644 public/js/theme-toggle.js && ls -lh public/js/theme-toggle.js"
& .\Scripts\safe-ssh.ps1 -Command $jsCommand -TimeoutSeconds 60

# Deploy layout
Write-Host ""
Write-Host "4. Deploying layout..." -ForegroundColor Yellow
$layoutCommand = "cd ~/skyddad-v2-app && echo '$layoutB64' | base64 -d > views/layouts/main.hbs && chmod 644 views/layouts/main.hbs && ls -lh views/layouts/main.hbs"
& .\Scripts\safe-ssh.ps1 -Command $layoutCommand -TimeoutSeconds 60

Write-Host ""
Write-Host "5. Waiting 5 seconds for Passenger to reload..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "6. Verifying deployment..." -ForegroundColor Yellow

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

