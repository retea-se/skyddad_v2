# Deploy säkerhetsförbättringar till produktion
$ErrorActionPreference = "Stop"

Write-Host "🚀 Deploying säkerhetsförbättringar till produktion..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Commit changes (if not already committed)
Write-Host "1️⃣ Checking git status..." -ForegroundColor Yellow
$gitStatus = & git status --porcelain 2>$null

if ($gitStatus) {
    Write-Host "   Uncommitted changes found. Committing..." -ForegroundColor Yellow
    & .\Scripts\commit-security-fixes.ps1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Commit failed" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ No uncommitted changes" -ForegroundColor Green
}

Write-Host ""

# Step 2: Push to remote
Write-Host "2️⃣ Pushing to remote..." -ForegroundColor Yellow
& git push origin main
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Push failed" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Pushed to remote" -ForegroundColor Green
Write-Host ""

# Step 3: Deploy on server via SSH
Write-Host "3️⃣ Deploying on server..." -ForegroundColor Yellow
Write-Host "   (This may take a minute...)" -ForegroundColor Gray

$deployCommand = @"
cd ~/skyddad-v2-app && git pull origin main && npm install --production && npm run build
"@

$output = & .\Scripts\safe-ssh.ps1 -Command $deployCommand -TimeoutSeconds 120

if ($LASTEXITCODE -eq 0) {
    Write-Host $output
    Write-Host "✅ Deployment successful" -ForegroundColor Green
} else {
    Write-Host "❌ Deployment failed" -ForegroundColor Red
    Write-Host $output
    exit 1
}

Write-Host ""

# Step 4: Restart Passenger (if needed)
Write-Host "4️⃣ Touching tmp/restart.txt to restart Passenger..." -ForegroundColor Yellow
$restartCommand = "cd ~/skyddad-v2-app && touch tmp/restart.txt"
$restartOutput = & .\Scripts\safe-ssh.ps1 -Command $restartCommand -TimeoutSeconds 10
Write-Host "✅ Passenger restart triggered" -ForegroundColor Green
Write-Host ""

# Step 5: Test deployment
Write-Host "5️⃣ Testing deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 5  # Wait for Passenger to restart

& .\Scripts\test-deployment-simple.ps1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✨ Deployment complete and verified!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Deployment may have issues. Check logs:" -ForegroundColor Yellow
    Write-Host "   ssh mackaneu@omega.hostup.se 'tail -f ~/logs/passenger.log'" -ForegroundColor Gray
    exit 1
}

