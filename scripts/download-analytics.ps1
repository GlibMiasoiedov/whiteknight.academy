# Sync analytics subdomain files from server to local

. "$PSScriptRoot\..\.agent\config.ps1"

$localAnalyticsDir = "$PSScriptRoot\..\analytics"

function Download-FtpDirectory {
    param (
        [string]$FtpPath,
        [string]$LocalPath
    )
    
    if (!(Test-Path $LocalPath)) {
        New-Item -ItemType Directory -Path $LocalPath -Force | Out-Null
    }
    
    $listUrl = "$script:FTP_HOST$FtpPath"
    $output = & curl.exe -s -l $listUrl --user "${script:FTP_USER}:${script:FTP_PASS}"
    $items = $output -split "`r?`n" | Where-Object { $_ -and $_ -ne "." -and $_ -ne ".." }
    
    foreach ($item in $items) {
        $ftpItemPath = "$FtpPath$item"
        $localItemPath = Join-Path $LocalPath $item
        
        $testUrl = "$script:FTP_HOST$ftpItemPath/"
        $testOutput = & curl.exe -s -l $testUrl --user "${script:FTP_USER}:${script:FTP_PASS}" 2>&1
        
        if ($testOutput -and $testOutput -notmatch "curl:") {
            Write-Host "  [DIR] $item" -ForegroundColor Cyan
            Download-FtpDirectory -FtpPath "$ftpItemPath/" -LocalPath $localItemPath
        }
        else {
            Write-Host "  [FILE] $item" -ForegroundColor Green
            $fileUrl = "$script:FTP_HOST$ftpItemPath"
            & curl.exe -s -o $localItemPath $fileUrl --user "${script:FTP_USER}:${script:FTP_PASS}"
        }
    }
}

Write-Host "Syncing analytics subdomain from server..." -ForegroundColor Cyan
Download-FtpDirectory -FtpPath "/analytics/" -LocalPath $localAnalyticsDir

Write-Host "`nSync complete!" -ForegroundColor Green
