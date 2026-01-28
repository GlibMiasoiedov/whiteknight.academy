# Deploy rook-child theme to WordPress server via FTP

. "$PSScriptRoot\..\.agent\config.ps1"

$themeDir = "$PSScriptRoot\..\themes\rook-child"
$remotePath = "/wp-content/themes/rook-child/"

Write-Host "Deploying rook-child theme to server..." -ForegroundColor Cyan

function Upload-FtpFile {
    param (
        [string]$LocalPath,
        [string]$RemotePath
    )
    $url = "$script:FTP_HOST$RemotePath"
    & curl.exe -s -T $LocalPath $url --user "${script:FTP_USER}:${script:FTP_PASS}" --ftp-create-dirs
}

function Upload-FtpDirectory {
    param (
        [string]$LocalDir,
        [string]$RemoteDir
    )
    
    Get-ChildItem -Path $LocalDir -Recurse | ForEach-Object {
        $relativePath = $_.FullName.Substring($LocalDir.Length).Replace("\", "/")
        $remoteFilePath = "$RemoteDir$relativePath"
        
        if (-not $_.PSIsContainer) {
            Write-Host "  [UPLOAD] $relativePath" -ForegroundColor Green
            Upload-FtpFile -LocalPath $_.FullName -RemotePath $remoteFilePath
        }
    }
}

Upload-FtpDirectory -LocalDir $themeDir -RemoteDir $remotePath

Write-Host "`nDeploy complete!" -ForegroundColor Green
