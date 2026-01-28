---
description: Sync WordPress content (pages, posts) from server to local repository
---

# Sync Content from WordPress

This workflow downloads pages and posts from WordPress REST API and saves them locally.

## Steps

1. **Run sync-content.ps1 script**
   ```powershell
   cd C:\Users\glibm\Desktop\whiteknight.academy
   powershell -ExecutionPolicy Bypass -File scripts\sync-content.ps1
   ```

2. **Review downloaded content**
   - Pages saved to: `content/pages/`
   - Posts saved to: `content/posts/`

3. **Commit changes to Git**
   ```powershell
   git add content/
   git commit -m "Sync content from WordPress"
   git push
   ```
