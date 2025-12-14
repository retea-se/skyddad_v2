# Safe SSH wrapper with timeout
# Usage: .\Scripts\safe-ssh.ps1 "command to run"
# Example: .\Scripts\safe-ssh.ps1 "ls -la"

param(
    [Parameter(Mandatory=$true)]
    [string]$Command,

    [int]$TimeoutSeconds = 30,

    [string]$SshKey = "$env:USERPROFILE\.ssh\id_rsa_pollify",

    [string]$SshHost = "mackaneu@omega.hostup.se",

    [string]$SshExe = "C:\Windows\System32\OpenSSH\ssh.exe"
)

$ErrorActionPreference = "Stop"

Write-Host "Running SSH command with $TimeoutSeconds second timeout..." -ForegroundColor Cyan
Write-Host "Command: $Command" -ForegroundColor Gray
Write-Host ""

$job = Start-Job -ScriptBlock {
    param($sshExe, $sshKey, $sshHost, $cmd)
    & $sshExe -i $sshKey -o ConnectTimeout=10 -o ServerAliveInterval=5 -o ServerAliveCountMax=2 $sshHost $cmd 2>&1
} -ArgumentList $SshExe, $SshKey, $SshHost, $Command

try {
    if (Wait-Job $job -Timeout $TimeoutSeconds) {
        $output = Receive-Job $job
        Remove-Job $job -Force
        $output
        exit 0
    } else {
        Stop-Job $job -ErrorAction SilentlyContinue
        Remove-Job $job -Force -ErrorAction SilentlyContinue
        Write-Host "ERROR: Command timed out after $TimeoutSeconds seconds" -ForegroundColor Red
        exit 1
    }
} catch {
    Stop-Job $job -ErrorAction SilentlyContinue
    Remove-Job $job -Force -ErrorAction SilentlyContinue
    Write-Host "ERROR: $_" -ForegroundColor Red
    exit 1
}

