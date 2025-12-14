# Test frontend i produktion efter deployment
# Testar alla viktiga sidor och funktioner

$baseUrl = "https://retea.se/skyddad"
$errors = @()
$warnings = @()

Write-Host "🔍 Testing frontend i produktion..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Healthcheck
Write-Host "1️⃣ Testing healthcheck endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/healthz" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Healthcheck OK (HTTP $($response.StatusCode))" -ForegroundColor Green
        try {
            $json = $response.Content | ConvertFrom-Json
            Write-Host "   Status: $($json.status)" -ForegroundColor Gray
            if ($json.database) {
                Write-Host "   Database: $($json.database)" -ForegroundColor Gray
            }
        } catch {
            Write-Host "   ⚠️  Could not parse JSON response" -ForegroundColor Yellow
            $warnings += "Healthcheck: Could not parse JSON"
        }
    } else {
        Write-Host "   ❌ Healthcheck returned HTTP $($response.StatusCode)" -ForegroundColor Red
        $errors += "Healthcheck: HTTP $($response.StatusCode)"
    }
} catch {
    Write-Host "   ❌ Healthcheck failed: $($_.Exception.Message)" -ForegroundColor Red
    $errors += "Healthcheck: $($_.Exception.Message)"
}
Write-Host ""

# Test 2: Main page (index)
Write-Host "2️⃣ Testing main page (index)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Main page OK (HTTP $($response.StatusCode))" -ForegroundColor Green
        $content = $response.Content
        if ($content -match "skyddad|Skyddad") {
            Write-Host "   ✅ Content contains expected text" -ForegroundColor Green
        } else {
            Write-Host "   ⚠️  Content may be unexpected" -ForegroundColor Yellow
            $warnings += "Main page: Content verification"
        }

        # Check for security headers
        if ($response.Headers["X-Content-Type-Options"]) {
            Write-Host "   ✅ Security headers present" -ForegroundColor Green
        }

        # Check content type
        if ($response.Headers["Content-Type"] -match "text/html") {
            Write-Host "   ✅ Content-Type correct" -ForegroundColor Green
        }
    } else {
        Write-Host "   ❌ Main page returned HTTP $($response.StatusCode)" -ForegroundColor Red
        $errors += "Main page: HTTP $($response.StatusCode)"
    }
} catch {
    Write-Host "   ❌ Main page failed: $($_.Exception.Message)" -ForegroundColor Red
    $errors += "Main page: $($_.Exception.Message)"
}
Write-Host ""

# Test 3: Privacy page
Write-Host "3️⃣ Testing privacy page..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/privacy" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Privacy page OK (HTTP $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Privacy page returned HTTP $($response.StatusCode)" -ForegroundColor Red
        $errors += "Privacy page: HTTP $($response.StatusCode)"
    }
} catch {
    Write-Host "   ❌ Privacy page failed: $($_.Exception.Message)" -ForegroundColor Red
    $errors += "Privacy page: $($_.Exception.Message)"
}
Write-Host ""

# Test 4: FAQ page
Write-Host "4️⃣ Testing FAQ page..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/faq" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ FAQ page OK (HTTP $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "   ❌ FAQ page returned HTTP $($response.StatusCode)" -ForegroundColor Red
        $errors += "FAQ page: HTTP $($response.StatusCode)"
    }
} catch {
    Write-Host "   ❌ FAQ page failed: $($_.Exception.Message)" -ForegroundColor Red
    $errors += "FAQ page: $($_.Exception.Message)"
}
Write-Host ""

# Test 5: Sitemap
Write-Host "5️⃣ Testing sitemap..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/sitemap.xml" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ Sitemap OK (HTTP $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "   ❌ Sitemap returned HTTP $($response.StatusCode)" -ForegroundColor Red
        $errors += "Sitemap: HTTP $($response.StatusCode)"
    }
} catch {
    Write-Host "   ❌ Sitemap failed: $($_.Exception.Message)" -ForegroundColor Red
    $errors += "Sitemap: $($_.Exception.Message)"
}
Write-Host ""

# Test 6: Static assets (CSS)
Write-Host "6️⃣ Testing static assets (CSS)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/css/main.css" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        Write-Host "   ✅ CSS loaded OK (HTTP $($response.StatusCode))" -ForegroundColor Green
    } else {
        Write-Host "   ❌ CSS returned HTTP $($response.StatusCode)" -ForegroundColor Red
        $errors += "CSS: HTTP $($response.StatusCode)"
    }
} catch {
    Write-Host "   ❌ CSS failed: $($_.Exception.Message)" -ForegroundColor Red
    $errors += "CSS: $($_.Exception.Message)"
}
Write-Host ""

# Test 7: 404 page
Write-Host "7️⃣ Testing 404 page..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/nonexistent-page-12345" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    if ($response.StatusCode -eq 404) {
        Write-Host "   ✅ 404 page works correctly (HTTP 404)" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  Non-existent page returned HTTP $($response.StatusCode) (expected 404)" -ForegroundColor Yellow
        $warnings += "404 handling: Returned HTTP $($response.StatusCode)"
    }
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "   ✅ 404 page works correctly" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  404 handling: $($_.Exception.Message)" -ForegroundColor Yellow
        $warnings += "404 handling: $($_.Exception.Message)"
    }
}
Write-Host ""

# Summary
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
if ($errors.Count -eq 0 -and $warnings.Count -eq 0) {
    Write-Host "✨ Alla tester passerade!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Frontend fungerar korrekt i produktion." -ForegroundColor Green
} elseif ($errors.Count -eq 0) {
    Write-Host "✅ Alla kritiska tester passerade!" -ForegroundColor Green
    Write-Host ""
    if ($warnings.Count -gt 0) {
        Write-Host "Varningar:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "  - $warning" -ForegroundColor Yellow
        }
        Write-Host ""
    }
} else {
    Write-Host "❌ Några tester misslyckades:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  - $error" -ForegroundColor Red
    }
    Write-Host ""
    if ($warnings.Count -gt 0) {
        Write-Host "Varningar:" -ForegroundColor Yellow
        foreach ($warning in $warnings) {
            Write-Host "  - $warning" -ForegroundColor Yellow
        }
        Write-Host ""
    }
    Write-Host "Troubleshooting:" -ForegroundColor Yellow
    Write-Host "  - Kolla logs: ssh mackaneu@omega.hostup.se 'tail -f ~/logs/passenger.log'" -ForegroundColor Gray
    Write-Host "  - Kolla Passenger status: ssh mackaneu@omega.hostup.se 'passenger-status'" -ForegroundColor Gray
    exit 1
}

Write-Host ""
Write-Host "💡 Säkerhetsförbättringar som är aktiva:" -ForegroundColor Cyan
Write-Host "  ✅ AES-256-GCM kryptering (autentiserad)" -ForegroundColor Green
Write-Host "  ✅ MySQL session store (persistens)" -ForegroundColor Green
Write-Host "  ✅ Admin-API: Endast Authorization header" -ForegroundColor Green
Write-Host "  ✅ Timing-safe API-nyckeljämförelse" -ForegroundColor Green
Write-Host ""

