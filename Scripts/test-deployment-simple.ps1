# Simple deployment test script
# Tests if Skyddad v2 is accessible

$baseUrl = "https://retea.se/skyddad"
$errors = @()

Write-Host "🔍 Testing Skyddad v2 deployment..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Healthcheck
Write-Host "Testing healthcheck..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/healthz" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Healthcheck OK (HTTP $($response.StatusCode))" -ForegroundColor Green
        try {
            $json = $response.Content | ConvertFrom-Json
            Write-Host "   Status: $($json.status)" -ForegroundColor Gray
            Write-Host "   Database: $($json.database)" -ForegroundColor Gray
        } catch {
            Write-Host "   (Could not parse JSON)" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Healthcheck returned HTTP $($response.StatusCode)" -ForegroundColor Red
        $errors += "Healthcheck: HTTP $($response.StatusCode)"
    }
} catch {
    Write-Host "❌ Healthcheck failed: $($_.Exception.Message)" -ForegroundColor Red
    $errors += "Healthcheck: $($_.Exception.Message)"
}
Write-Host ""

# Test 2: Main page
Write-Host "Testing main page..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Main page OK (HTTP $($response.StatusCode))" -ForegroundColor Green
        if ($response.Content -match "skyddad|Skyddad") {
            Write-Host "   Content looks correct" -ForegroundColor Gray
        }
    } else {
        Write-Host "❌ Main page returned HTTP $($response.StatusCode)" -ForegroundColor Red
        $errors += "Main page: HTTP $($response.StatusCode)"
    }
} catch {
    Write-Host "❌ Main page failed: $($_.Exception.Message)" -ForegroundColor Red
    $errors += "Main page: $($_.Exception.Message)"
}
Write-Host ""

# Summary
if ($errors.Count -eq 0) {
    Write-Host "✨ All tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "  1. SSH to server and run: bash Scripts/setup-admin-proxy.sh"
    Write-Host "  2. SSH to server and run: bash Scripts/setup-cleanup-cron.sh"
    exit 0
} else {
    Write-Host "❌ Some tests failed:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  - Check if Passenger is running: ssh mackaneu@omega.hostup.se 'passenger-status'"
    Write-Host "  - Check logs: ssh mackaneu@omega.hostup.se 'tail -f ~/logs/passenger.log'"
    exit 1
}




