# Deploy ändrade filer via SCP
# Detta script kopierar de ändrade filerna till servern

$ErrorActionPreference = "Stop"

Write-Host "🚀 Deployar filer till produktion..." -ForegroundColor Cyan
Write-Host ""

$filesToDeploy = @(
    "src/middleware/authAdmin.ts",
    "src/middleware/session.ts",
    "src/services/encryption.ts",
    "tests/unit/encryption.test.ts",
    "docs/SECURITY.md",
    "package.json",
    "package-lock.json"
)

$serverPath = "mackaneu@omega.hostup.se:~/skyddad-v2-app/"

Write-Host "Filer som ska deployas:" -ForegroundColor Yellow
foreach ($file in $filesToDeploy) {
    Write-Host "  - $file" -ForegroundColor Gray
}
Write-Host ""

foreach ($file in $filesToDeploy) {
    if (Test-Path $file) {
        Write-Host "Kopierar $file..." -ForegroundColor Yellow
        $remotePath = $serverPath + (Split-Path $file -Parent).Replace("\", "/")

        # Använd safe-scp för att kopiera filen
        & .\Scripts\safe-scp.ps1 -Source $file -Destination $remotePath

        if ($LASTEXITCODE -eq 0) {
            Write-Host "  ✅ $file kopierad" -ForegroundColor Green
        } else {
            Write-Host "  ❌ $file misslyckades" -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "  ⚠️  $file finns inte" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "✅ Alla filer kopierade!" -ForegroundColor Green
Write-Host ""
Write-Host "Nästa steg: Bygg och starta om på servern" -ForegroundColor Cyan
Write-Host "  .\Scripts\safe-ssh.ps1 `"cd ~/skyddad-v2-app && npm install --production && npm run build && touch tmp/restart.txt`""

