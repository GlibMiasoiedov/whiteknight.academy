---
description: Sync theme files from WordPress server to local repository
---

# Sync Theme from Server

This workflow downloads theme files from the WordPress server if they were changed directly on the server.

## Steps

// turbo-all

1. **Download updated theme files from FTP**
   ```powershell
   cd C:\Users\glibm\Desktop\whiteknight.academy
   powershell -ExecutionPolicy Bypass -File scripts\sync-theme.ps1
   ```

2. **Review changes**
   ```powershell
   git status
   git diff
   ```

3. **Commit changes to Git**
   ```powershell
   git add themes/
   git commit -m "Sync theme from server"
   git push
   ```
