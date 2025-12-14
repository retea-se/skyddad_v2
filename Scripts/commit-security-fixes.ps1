# Commit säkerhetsförbättringar
$ErrorActionPreference = "Stop"

Write-Host "Committing säkerhetsförbättringar..." -ForegroundColor Cyan
Write-Host ""

# Find git executable
$gitPath = $null
$possiblePaths = @(
    "C:\Program Files\Git\bin\git.exe",
    "C:\Program Files (x86)\Git\bin\git.exe",
    "$env:ProgramFiles\Git\bin\git.exe",
    "$env:ProgramFiles(x86)\Git\bin\git.exe",
    "git"  # Try if it's in PATH
)

foreach ($path in $possiblePaths) {
    try {
        if ($path -eq "git") {
            $result = Get-Command git -ErrorAction SilentlyContinue
            if ($result) {
                $gitPath = "git"
                break
            }
        } else {
            if (Test-Path $path) {
                $gitPath = $path
                break
            }
        }
    } catch {
        continue
    }
}

if (-not $gitPath) {
    Write-Host "ERROR: Git not found. Please install Git or add it to PATH." -ForegroundColor Red
    Write-Host ""
    Write-Host "You can manually commit with:" -ForegroundColor Yellow
    Write-Host "  git add -A" -ForegroundColor Gray
    Write-Host "  git commit -m 'Säkerhetsförbättringar: GCM-kryptering, MySQL session store, förbättrad admin-API'" -ForegroundColor Gray
    Write-Host "  git push origin main" -ForegroundColor Gray
    exit 1
}

Write-Host "Using git: $gitPath" -ForegroundColor Gray
Write-Host ""

# Check status
Write-Host "1. Checking git status..." -ForegroundColor Yellow
& $gitPath status --short

# Add all changes
Write-Host ""
Write-Host "2. Adding all changes..." -ForegroundColor Yellow
& $gitPath add -A

# Commit
Write-Host ""
Write-Host "3. Committing changes..." -ForegroundColor Yellow
$commitMessage = @"
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

& $gitPath commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Commit successful!" -ForegroundColor Green
} else {
    Write-Host "  Commit failed or no changes to commit" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Commit completed! Next step: Push to remote and deploy" -ForegroundColor Green

