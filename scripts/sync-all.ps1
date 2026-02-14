# Master sync script

Write-Host "Starting full site synchronization..." -ForegroundColor Magenta

$scriptDir = $PSScriptRoot
$repoRoot = Resolve-Path "$scriptDir\.."

# 1. Sync Content
Write-Host "`n=== Syncing Content ===" -ForegroundColor Cyan
& "$scriptDir\sync-content.ps1"

# 2. Sync Theme (Rook Child)
Write-Host "`n=== Syncing Theme ===" -ForegroundColor Cyan
& "$scriptDir\sync-theme.ps1"

# 3. Sync MU Plugins
Write-Host "`n=== Syncing MU Plugins ===" -ForegroundColor Cyan
& "$scriptDir\sync-mu-plugins.ps1"

# 4. Sync Analytics
Write-Host "`n=== Syncing Analytics ===" -ForegroundColor Cyan
& "$scriptDir\download-analytics.ps1"

# 5. Git Sync
Write-Host "`n=== Git Sync ===" -ForegroundColor Cyan
Set-Location $repoRoot

git add .
git commit -m "Sync site content: $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push origin main

Write-Host "`nFull site synchronization complete!" -ForegroundColor Green
