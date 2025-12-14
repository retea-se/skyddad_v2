# Commit and push changes to GitHub
$ErrorActionPreference = "Stop"

Write-Host "Committing changes to GitHub..." -ForegroundColor Cyan
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
    Write-Host "  git commit -m 'Modernisera layout med nordisk typografi och gråsvart dark theme'" -ForegroundColor Gray
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
Modernisera layout med nordisk typografi och gråsvart dark theme

- Lägg till Inter font från Google Fonts för modern nordisk typografi
- Uppdatera dark theme till gråsvart (#0F1419) för nordisk känsla
- Förbättra typografi med letter-spacing, line-heights och font weights
- Modernisera spacing, border-radius och skuggor
- Förbättra knappar med subtila hover-effekter och translateY
- Responsiv typografi med clamp() för skalbara rubriker
- Uppdatera theme-toggle.js med ny theme-color för dark mode
- Förbättra header med backdrop-filter och modernare styling
"@

& $gitPath commit -m $commitMessage

if ($LASTEXITCODE -eq 0) {
    Write-Host "  Commit successful!" -ForegroundColor Green
} else {
    Write-Host "  Commit failed or no changes to commit" -ForegroundColor Yellow
}

# Push
Write-Host ""
Write-Host "4. Pushing to GitHub..." -ForegroundColor Yellow
& $gitPath push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Successfully pushed to GitHub!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Push failed. Check your git configuration." -ForegroundColor Red
}

