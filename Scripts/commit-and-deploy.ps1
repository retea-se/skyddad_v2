# Commit och deploy säkerhetsförbättringar
# Detta script hjälper dig att commita och deploya ändringarna

Write-Host "🚀 Commit och Deployment Guide" -ForegroundColor Cyan
Write-Host ""

# Steg 1: Commit
Write-Host "1️⃣ Commita ändringarna:" -ForegroundColor Yellow
Write-Host "   git add -A" -ForegroundColor Gray
Write-Host "   git commit -m `"Säkerhetsförbättringar: GCM-kryptering, MySQL session store, förbättrad admin-API`"" -ForegroundColor Gray
Write-Host ""
Write-Host "   Detaljerad commit message:" -ForegroundColor Gray
Write-Host "   - Bytte från AES-256-CBC till AES-256-GCM (AEAD) för autentiserad kryptering" -ForegroundColor DarkGray
Write-Host "   - Tog bort query-param från admin-API, endast Authorization header" -ForegroundColor DarkGray
Write-Host "   - Tog bort debug-loggning i admin-API" -ForegroundColor DarkGray
Write-Host "   - Lade till konstanttidsjämförelse (timing-safe) i admin-API" -ForegroundColor DarkGray
Write-Host "   - Implementerade MySQL session store för produktion" -ForegroundColor DarkGray
Write-Host "   - SameSite=strict för sessions i produktion" -ForegroundColor DarkGray
Write-Host "   - Bakåtkompatibilitet för gamla CBC-krypterade secrets" -ForegroundColor DarkGray
Write-Host ""

# Steg 2: Push
Write-Host "2️⃣ Pusha till remote:" -ForegroundColor Yellow
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host ""

# Steg 3: Deploy via SSH
Write-Host "3️⃣ Deploya på servern (via SSH):" -ForegroundColor Yellow
Write-Host "   .\Scripts\safe-ssh.ps1 `"cd ~/skyddad-v2-app && git pull origin main && npm install --production && npm run build && touch tmp/restart.txt`"" -ForegroundColor Gray
Write-Host ""

# Steg 4: Testa
Write-Host "4️⃣ Testa deployment:" -ForegroundColor Yellow
Write-Host "   .\Scripts\test-deployment-simple.ps1" -ForegroundColor Gray
Write-Host ""

Write-Host "💡 Tips: Om git inte är i PATH, använd full path till git.exe" -ForegroundColor Cyan
Write-Host "   Exempel: `"C:\Program Files\Git\bin\git.exe`" add -A" -ForegroundColor DarkGray
Write-Host ""

# Fråga om användaren vill köra kommandona automatiskt (om git finns)
$gitPaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "git"
)

$gitExe = $null
foreach ($path in $gitPaths) {
    if ($path -eq "git") {
        $result = Get-Command git -ErrorAction SilentlyContinue
        if ($result) {
            $gitExe = "git"
            break
        }
    } else {
        if (Test-Path $path) {
            $gitExe = $path
            break
        }
    }
}

if ($gitExe) {
    Write-Host "✅ Git hittad: $gitExe" -ForegroundColor Green
    Write-Host ""
    $response = Read-Host "Vill du köra commit och push automatiskt? (j/n)"
    if ($response -eq "j" -or $response -eq "J" -or $response -eq "y" -or $response -eq "Y") {
        Write-Host ""
        Write-Host "Kör commit..." -ForegroundColor Yellow
        & $gitExe add -A
        $commitMsg = @"
Säkerhetsförbättringar: GCM-kryptering, MySQL session store, förbättrad admin-API

- Bytte från AES-256-CBC till AES-256-GCM (AEAD) för autentiserad kryptering
- Tog bort query-param från admin-API, endast Authorization header
- Tog bort debug-loggning i admin-API
- Lade till konstanttidsjämförelse (timing-safe) i admin-API
- Implementerade MySQL session store för produktion
- SameSite=strict för sessions i produktion
- Bakåtkompatibilitet för gamla CBC-krypterade secrets
- Uppdaterade tester för GCM-kryptering
- Uppdaterad SECURITY.md med nya säkerhetsåtgärder
"@
        & $gitExe commit -m $commitMsg
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Commit lyckades!" -ForegroundColor Green
            Write-Host ""
            $pushResponse = Read-Host "Vill du pusha till remote? (j/n)"
            if ($pushResponse -eq "j" -or $pushResponse -eq "J" -or $pushResponse -eq "y" -or $pushResponse -eq "Y") {
                Write-Host "Kör push..." -ForegroundColor Yellow
                & $gitExe push origin main
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ Push lyckades!" -ForegroundColor Green
                    Write-Host ""
                    Write-Host "Nu kan du deploya med:" -ForegroundColor Cyan
                    Write-Host "   .\Scripts\safe-ssh.ps1 `"cd ~/skyddad-v2-app && git pull origin main && npm install --production && npm run build && touch tmp/restart.txt`"" -ForegroundColor Gray
                } else {
                    Write-Host "❌ Push misslyckades" -ForegroundColor Red
                }
            }
        } else {
            Write-Host "❌ Commit misslyckades eller inga ändringar att commita" -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "⚠️  Git hittades inte automatiskt. Kör kommandona manuellt enligt instruktionerna ovan." -ForegroundColor Yellow
}

