---
description: Deploy theme changes to WordPress server via FTP
---

# Deploy Theme to Server

This workflow uploads local theme changes to the WordPress server.

## Steps

// turbo-all

1. **Deploy rook-child theme to server**
   ```powershell
   cd C:\Users\glibm\Desktop\whiteknight.academy
   powershell -ExecutionPolicy Bypass -File scripts\deploy-theme.ps1
   ```

2. **Commit and push to GitHub**
   ```powershell
   git add .
   git commit -m "Deploy theme changes"
   git push
   ```

3. **Verify on live site**
   - Visit https://whiteknight.academy to verify changes
