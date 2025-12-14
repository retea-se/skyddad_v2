# Safe SCP wrapper with timeout
# Usage: .\Scripts\safe-scp.ps1 -Source "local-file" -Destination "remote-path"
# Example: .\Scripts\safe-scp.ps1 -Source ".htaccess" -Destination "~/public_html/retea/skyddad/.htaccess"

param(
    [Parameter(Mandatory=$true)]
    [string]$Source,

    [Parameter(Mandatory=$true)]
    [string]$Destination,

    [int]$TimeoutSeconds = 60,

    [string]$SshKey = "$env:USERPROFILE\.ssh\id_rsa_pollify",

    [string]$SshHost = "mackaneu@omega.hostup.se",

    [string]$ScpExe = "C:\Windows\System32\OpenSSH\scp.exe"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $Source)) {
    Write-Host "❌ Source file not found: $Source" -ForegroundColor Red
    exit 1
}

Write-Host "📤 Copying file with $TimeoutSeconds second timeout..." -ForegroundColor Cyan
Write-Host "Source: $Source" -ForegroundColor Gray
Write-Host "Destination: ${SshHost}:${Destination}" -ForegroundColor Gray
Write-Host ""

$job = Start-Job -ScriptBlock {
    param($scpExe, $sshKey, $sshHost, $src, $dst)
    & $scpExe -i $sshKey -o ConnectTimeout=10 -o ServerAliveInterval=5 -o ServerAliveCountMax=2 "$src" "${sshHost}:${dst}" 2>&1
} -ArgumentList $ScpExe, $SshKey, $SshHost, $Source, $Destination

try {
    if (Wait-Job $job -Timeout $TimeoutSeconds) {
        $output = Receive-Job $job
        Remove-Job $job -Force
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ File copied successfully" -ForegroundColor Green
            $output
            exit 0
        } else {
            Write-Host "❌ SCP failed with exit code $LASTEXITCODE" -ForegroundColor Red
            $output
            exit 1
        }
    } else {
        Stop-Job $job -ErrorAction SilentlyContinue
        Remove-Job $job -Force -ErrorAction SilentlyContinue
        Write-Host "❌ SCP timed out after $TimeoutSeconds seconds" -ForegroundColor Red
        exit 1
    }
} catch {
    Stop-Job $job -ErrorAction SilentlyContinue
    Remove-Job $job -Force -ErrorAction SilentlyContinue
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}

