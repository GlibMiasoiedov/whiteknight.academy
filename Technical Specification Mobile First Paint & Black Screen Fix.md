# Technical Specification: Mobile First Paint & Black Screen Fix

**Project:** analytics.whiteknight.academy  
**Repo:** https://github.com/GlibMiasoiedov/whiteknight.academy/tree/main/analytics-app  
**Priority:** High  
**Date:** February 17, 2026

---

## Problem Description

On mobile devices, `analytics.whiteknight.academy` shows a **completely black screen for several seconds** before any content appears. The site loads normally on desktop.

**WebPageTest results (Desktop, Los Angeles, Chrome v143, WiFi):**
- Start Render: 1.7s
- First Contentful Paint: 2.056s
- Largest Contentful Paint: 2.056s
- Total Blocking Time: 0.107s

On mobile the situation is significantly worse due to slower CPU and network.

**Root Cause:** The app is a React SPA (Vite build). The browser loads `index.html`, sees an empty `div#root`, and waits for the entire JS bundle to download, parse, and execute before rendering anything. On mobile CPUs this delay is noticeably longer — resulting in a black screen.

DNS, SSL, and server-side TTFB are ruled out — desktop results confirm the problem is purely client-side rendering delay.

---

## Step 1 — Audit (Check What Already Exists)

Before making any changes, verify the following in the codebase.

**1.1 Check `index.html`**

- Is there a `<style>` tag in `<head>` that sets `background-color` to match the app's dark background?
- Is there a visible loading element (spinner, skeleton) inside `<body>` before `<div id="root">`?
- Is there a `<link rel="modulepreload">` tag pointing to the main JS bundle?

**1.2 Check `main.jsx` / `main.tsx`**

- Is there code that removes or hides a loading element after React mounts (e.g., `document.getElementById('app-loader').remove()`)?

**1.3 Check `vite.config.js` / `vite.config.ts`**

- Is `build.modulePreload` explicitly set to `false`? (It should not be.)
- Is `build.rollupOptions.output.manualChunks` configured to split `react`, `react-dom`, and heavy deps like `@supabase/supabase-js` into separate chunks?

**1.4 Check routing (if React Router is used)**

- Are page-level components imported with `React.lazy()`?
- Is there a `<Suspense>` wrapper around `<Routes>`?

---

## Step 2 — Implement: Critical CSS + App Loader

**Only implement if the audit confirms these are missing.**

### 2.1 Update `index.html`

Add critical CSS in `<head>` and a loader element in `<body>` before `<div id="root">`. The goal is that the browser renders a dark background and a spinner immediately — with zero JS required.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>White Knight Analytics</title>

  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    html, body {
      background-color: #0a0a14; /* IMPORTANT: must match exact app background */
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      min-height: 100vh;
    }

    .app-loader {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: #0a0a14;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      z-index: 9999;
      transition: opacity 0.3s ease;
    }

    .app-loader.fade-out {
      opacity: 0;
      pointer-events: none;
    }

    .app-loader__logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: #a855f7;
      letter-spacing: -0.02em;
    }

    .app-loader__spinner {
      width: 32px;
      height: 32px;
      border: 3px solid rgba(168, 85, 247, 0.2);
      border-top-color: #a855f7;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="app-loader" id="app-loader">
    <div class="app-loader__logo">Knight Analytics</div>
    <div class="app-loader__spinner"></div>
  </div>

  <div id="root"></div>

  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### 2.2 Update `main.jsx` / `main.tsx`

Add code to remove the loader after React renders:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Remove the static loader after React takes over
const loader = document.getElementById('app-loader')
if (loader) {
  loader.classList.add('fade-out')
  setTimeout(() => loader.remove(), 300)
}
```

---

## Step 3 — Implement: Vite Bundle Splitting

**Only implement if `manualChunks` is not already configured.**

In `vite.config.js` / `vite.config.ts`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    modulePreload: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          supabase: ['@supabase/supabase-js'],
          // add other large deps if present, e.g.:
          // router: ['react-router-dom'],
        }
      }
    }
  }
})
```

---

## Step 4 — Implement: Lazy Loading for Routes

**Only implement if `React.lazy()` is not already used for page-level components.**

```jsx
import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

// Replace static imports:
// import Dashboard from './pages/Dashboard'

// With:
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Analysis  = lazy(() => import('./pages/Analysis'))
// repeat for all page-level components

function App() {
  return (
    // fallback={null} because #app-loader already covers initial load.
    // For subsequent navigations, consider a lightweight inline spinner.
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analysis" element={<Analysis />} />
        {/* all other routes */}
      </Routes>
    </Suspense>
  )
}

export default App
```

---

## Step 5 — Testing

### 5.1 Visual Test — Mobile Chrome

1. Open Chrome on a real Android or iOS device, OR use Chrome DevTools device emulation with CPU throttling set to **4x slowdown** and network set to **Fast 3G**.
2. Navigate to `https://analytics.whiteknight.academy/`.
3. **Pass:** Dark background and the spinner are visible within ~0.5s. No black screen.
4. **Pass:** Spinner fades out smoothly once the app fully renders.

### 5.2 WebPageTest

Run a new test at https://webpagetest.org:
- URL: `https://analytics.whiteknight.academy/`
- Location: **Frankfurt, Germany**
- Browser: **Chrome on Emulated Motorola G4** (Mobile)
- Connection: **4G**

| Metric | Current (Desktop/WiFi) | Target (Mobile/4G) |
|---|---|---|
| Start Render | 1.7s | < 2.0s |
| First Contentful Paint | 2.056s | < 2.5s |
| Largest Contentful Paint | 2.056s | < 3.0s |
| Total Blocking Time | 0.107s | < 300ms |

### 5.3 Check Bundle Output

After `npm run build`, inspect `dist/assets/`:
- **Pass:** Multiple `.js` chunk files are present (vendor, supabase, main, etc.)
- **Fail:** A single `index-XXXX.js` over **500 KB** — chunking is not working.

### 5.4 Verify Loader Is Removed From DOM

1. Open DevTools → Elements.
2. Load the page and let it fully render.
3. **Pass:** The `#app-loader` element is absent from the DOM.
4. **Fail:** `#app-loader` remains in the DOM after load.

### 5.5 Regression Check

- All routes navigate correctly.
- Supabase authentication and data loading work as before.
- No console errors related to `Suspense` or lazy loading.

---

## Notes for the Developer

- The `background-color` in the critical CSS must **exactly match** the app's actual background. Check Tailwind config or CSS variables before hardcoding the value.
- Do **not** add `@import` for Google Fonts or any external `<link>` inside the critical `<style>` block — this blocks rendering.
- If a layout component wraps all routes, place `<Suspense>` **inside** the layout component, not around it — otherwise the loader re-triggers on every navigation.