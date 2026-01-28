# Sync WordPress Content (Pages & Posts) to local repository
# Uses WordPress REST API

. "$PSScriptRoot\..\.agent\config.ps1"

$contentDir = "$PSScriptRoot\..\content"
$pagesDir = "$contentDir\pages"
$postsDir = "$contentDir\posts"

# Create directories
New-Item -ItemType Directory -Path $pagesDir -Force | Out-Null
New-Item -ItemType Directory -Path $postsDir -Force | Out-Null

Write-Host "Syncing WordPress content..." -ForegroundColor Cyan

# Get auth header
$headers = Get-WPAuthHeader

# Sync Pages
Write-Host "`nDownloading pages..." -ForegroundColor Yellow
$pages = Invoke-RestMethod -Uri "$script:WP_API_URL/pages?per_page=100&status=publish,draft,private" -Headers $headers

foreach ($page in $pages) {
    $filename = "$($page.id)-$($page.slug).json"
    $pageData = @{
        id       = $page.id
        title    = $page.title.rendered
        slug     = $page.slug
        status   = $page.status
        date     = $page.date
        modified = $page.modified
        link     = $page.link
        content  = $page.content.rendered
        excerpt  = $page.excerpt.rendered
        template = $page.template
        parent   = $page.parent
    }
    $pageData | ConvertTo-Json -Depth 10 | Out-File -FilePath "$pagesDir\$filename" -Encoding UTF8
    Write-Host "  [PAGE] $($page.title.rendered)" -ForegroundColor Green
}
Write-Host "  Total: $($pages.Count) pages" -ForegroundColor Cyan

# Sync Posts
Write-Host "`nDownloading posts..." -ForegroundColor Yellow
$posts = Invoke-RestMethod -Uri "$script:WP_API_URL/posts?per_page=100&status=publish,draft,private" -Headers $headers

foreach ($post in $posts) {
    $filename = "$($post.id)-$($post.slug).json"
    $postData = @{
        id         = $post.id
        title      = $post.title.rendered
        slug       = $post.slug
        status     = $post.status
        date       = $post.date
        modified   = $post.modified
        link       = $post.link
        content    = $post.content.rendered
        excerpt    = $post.excerpt.rendered
        categories = $post.categories
        tags       = $post.tags
    }
    $postData | ConvertTo-Json -Depth 10 | Out-File -FilePath "$postsDir\$filename" -Encoding UTF8
    Write-Host "  [POST] $($post.title.rendered)" -ForegroundColor Green
}
Write-Host "  Total: $($posts.Count) posts" -ForegroundColor Cyan

Write-Host "`nContent sync complete!" -ForegroundColor Green
