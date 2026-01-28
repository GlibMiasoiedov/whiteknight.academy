# WordPress API Configuration
# This file contains credentials for WordPress REST API

$script:WP_API_URL = "https://whiteknight.academy/wp-json/wp/v2"
$script:WP_USERNAME = "g.miasoiedov@gmail.com"
$script:WP_APP_PASSWORD = "4vGF 3Enh aVNb P6QG No0S ocTO"

# FTP Configuration
$script:FTP_HOST = "ftp://45.84.204.95"
$script:FTP_USER = "u436888800.whiteknight.academy"
$script:FTP_PASS = "Warszawa2026!"

function Get-WPAuthHeader {
    $cred = [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${script:WP_USERNAME}:${script:WP_APP_PASSWORD}"))
    return @{Authorization = "Basic $cred" }
}

function Get-WPPages {
    param([int]$PerPage = 100)
    $headers = Get-WPAuthHeader
    return Invoke-RestMethod -Uri "$script:WP_API_URL/pages?per_page=$PerPage" -Headers $headers
}

function Get-WPPosts {
    param([int]$PerPage = 100)
    $headers = Get-WPAuthHeader
    return Invoke-RestMethod -Uri "$script:WP_API_URL/posts?per_page=$PerPage" -Headers $headers
}
