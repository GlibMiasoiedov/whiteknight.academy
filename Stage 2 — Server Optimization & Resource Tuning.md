# Stage 2 — Server Optimization & Resource Tuning

**Prerequisite:** Stage 1 completed (singlefile plugin removed, separate chunks, gzip + cache in `.htaccess`)  
**Current state after Stage 1 (estimated):** Performance ~65–75 · FCP ~3–5s · LCP ~4–6s  
**Goal after Stage 2:** Performance 80+ · FCP <2.5s · LCP <3.5s

---

## What Stage 2 covers

Stage 1 removed the architectural blocker (singlefile plugin) and enabled parallel loading, caching, and code-splitting. Stage 2 focuses on **eliminating every unnecessary millisecond** in the critical rendering path — the sequence from "browser receives HTML" to "user sees the first screen."

---

## Fix 2.1 — Preload critical font files in `index.html`

**Problem:** After removing the singlefile plugin, `@fontsource` fonts are now proper `.woff2` files in `dist/assets/`. However, the browser discovers them late:

```
HTML downloaded
  → JS bundle downloaded
    → React renders
      → CSS parsed (font-face declarations found)
        → Font files start downloading ← TOO LATE
```

The user sees either invisible text (FOIT) or a flash of fallback font (FOUT) for 1–2 seconds.

**Action:**

1. Run `npm run build` and check `dist/assets/` for the font filenames. You will see files like:
```
manrope-latin-400-normal-[hash].woff2
manrope-latin-600-normal-[hash].woff2
unbounded-latin-700-normal-[hash].woff2
unbounded-latin-800-normal-[hash].woff2
```

2. Identify the **two most critical** fonts — the ones used above the fold:
   - **Unbounded 700 or 800** — used for the hero heading ("Turn Your Games Into a Clear Improvement Plan")
   - **Manrope 400** — used for body text in the hero section

3. In `index.html`, add preload hints for these two files. Use the **hashed filenames** from your build output:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>White Knight Analytics</title>

  <!-- Preload critical fonts (update filenames after each build) -->
  <link rel="preload" href="/assets/unbounded-latin-700-normal-XXXXXX.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="/assets/manrope-latin-400-normal-XXXXXX.woff2" as="font" type="font/woff2" crossorigin>
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

**Important:** The `crossorigin` attribute is mandatory for font preloads — without it, the browser downloads the font twice.

**Automation note:** Since Vite changes the hash on every build, you have two options for keeping the preload links current:

- **Manual:** Update the filenames in `index.html` after each build (acceptable if you deploy infrequently).
- **Scripted:** Add a post-build script that reads `dist/assets/`, finds the font files, and injects preload tags into `dist/index.html`. Add this to `package.json`:

```json
{
  "scripts": {
    "build": "tsc -b && vite build && node scripts/inject-preloads.js"
  }
}
```

Create `scripts/inject-preloads.js`:

```js
import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const assetsDir = join(process.cwd(), 'dist', 'assets');
const htmlPath = join(process.cwd(), 'dist', 'index.html');

const files = readdirSync(assetsDir);

// Find the critical font files
const criticalFonts = [
  files.find(f => f.includes('unbounded') && f.includes('700') && f.endsWith('.woff2')),
  files.find(f => f.includes('manrope') && f.includes('400') && f.endsWith('.woff2')),
].filter(Boolean);

// Build preload tags
const preloadTags = criticalFonts
  .map(f => `  <link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin>`)
  .join('\n');

// Inject into HTML
let html = readFileSync(htmlPath, 'utf-8');
html = html.replace('</head>', `${preloadTags}\n</head>`);
writeFileSync(htmlPath, html);

console.log(`Injected preload tags for: ${criticalFonts.join(', ')}`);
```

**Verification:**
- DevTools → Network → reload → font files should start downloading within the first 100ms (before JS bundle finishes)
- Waterfall chart: font requests appear at the top, not at the bottom
- Text on hero section appears faster — no visible flash of unstyled text

---

## Fix 2.2 — Add resource hints for external domains

**Problem:** The landing page connects to external domains (Stripe CDN, possibly Google Analytics). Each new domain requires DNS lookup + TCP connection + TLS handshake = ~200–400ms on mobile.

**Action:**

Add DNS prefetch and preconnect hints in `index.html` `<head>`:

```html
<!-- Stripe — used on /checkout and pricing section -->
<link rel="dns-prefetch" href="https://js.stripe.com">
<link rel="dns-prefetch" href="https://api.stripe.com">

<!-- If you use Google Analytics or any other third-party -->
<link rel="dns-prefetch" href="https://www.googletagmanager.com">
```

**Why `dns-prefetch` and not `preconnect` for Stripe:** The landing page lazy-loads Stripe (after Stage 1 Fix 1.3). Using `preconnect` would open a full TCP+TLS connection that might go unused if the user never scrolls to pricing. `dns-prefetch` only resolves the domain name (~50ms), which is cheap and still saves time when Stripe eventually loads.

**Verification:**
- DevTools → Network → when Stripe eventually loads (on scroll to pricing), the DNS step should show 0ms (already resolved)

---

## Fix 2.3 — Optimize images and SVGs

**Problem:** From the screenshots, the landing page has:
- A large radial/pie chart graphic (the colorful "See Your Game / Spot Your Leaks" visualization)
- Possible background gradients or decorative images
- Social media icons (Instagram, YouTube, Facebook, TikTok) in the footer
- App Store / Google Play badge images

**Action:**

### For the radial chart / pie chart:

If it is rendered as an `<svg>` in JSX (inline SVG) — this is already optimal. No changes needed.

If it is an `<img>` referencing a `.png` or `.jpg` file:

1. Convert to WebP using [squoosh.app](https://squoosh.app) — target quality 80, effort 6
2. Add explicit dimensions and lazy loading:

```tsx
<img
  src="/assets/chart.webp"
  alt="Chess performance radar chart showing scores across 6 categories"
  width={600}
  height={500}
  loading="lazy"
  decoding="async"
/>
```

### For all images below the fold:

Add `loading="lazy"` and `decoding="async"` to every `<img>` tag that is not visible on the first screen:

```tsx
// Below-fold image — lazy load
<img src="..." alt="..." width={...} height={...} loading="lazy" decoding="async" />

// Above-fold image (hero) — do NOT lazy load, add fetchpriority instead
<img src="..." alt="..." width={...} height={...} fetchPriority="high" />
```

### For SVG icons (Lucide):

Lucide-react icons are already tree-shaken by Vite — only imported icons end up in the bundle. No changes needed here.

### For social media icons in footer:

If they are SVGs — no changes needed.  
If they are PNG/JPG images — convert to inline SVG or use Lucide equivalents.

### For the App Store / Google Play badges:

These are below the fold. Add `loading="lazy"` and convert to WebP if they are PNG.

**Explicit width/height on every image is mandatory** — this prevents CLS (Cumulative Layout Shift). The current CLS is 0.064 — adding dimensions will bring it to 0 or near-0.

**Verification:**
- DevTools → Network → filter "Img" → below-fold images should show "(lazy)" status and not load until scrolled
- Run PageSpeed → CLS should drop to <0.05
- No image should exceed 100 KB in transfer size

---

## Fix 2.4 — Optimize `deploy.js` for multi-file deployment

**Problem:** After removing `vite-plugin-singlefile`, the build output changes from one HTML file to a `dist/` folder with multiple files and subdirectories (`assets/`, `index.html`, `.htaccess`). The deploy script must handle this correctly.

**Action:**

Verify that `deploy.js` recursively uploads the entire `dist/` directory. If it was written for single-file deployment, it needs updating:

```js
import { Client } from 'basic-ftp';
import { readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

const REMOTE_ROOT = '/public_html'; // Subdomain document root
const LOCAL_DIR = './dist';

async function deploy() {
  const client = new Client();
  client.ftp.verbose = true;

  try {
    await client.access({
      host: process.env.FTP_HOST,
      user: process.env.FTP_USER,
      password: process.env.FTP_PASS,
      secure: false,
    });

    console.log('Connected. Uploading dist/ to server...');

    // Upload entire dist/ directory recursively
    await client.ensureDir(REMOTE_ROOT);
    await client.clearWorkingDir(); // Remove old files
    await client.uploadFromDir(LOCAL_DIR, REMOTE_ROOT);

    console.log('Deploy complete.');
  } catch (err) {
    console.error('Deploy failed:', err);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
```

**Critical:** Make sure `.htaccess` is included in the upload. FTP clients sometimes skip dotfiles. If `basic-ftp` skips `.htaccess`:

1. Place your `.htaccess` in the `public/` folder of the Vite project (Vite copies `public/` contents to `dist/` root on build).
2. Verify it appears in `dist/` after `npm run build`.

**Verification:**
- After deploy, visit `analytics.whiteknight.academy/some-random-path` — it should load the SPA (not 404). This confirms `.htaccess` rewrite rules are working.
- Check that `dist/assets/` files are accessible: visit `analytics.whiteknight.academy/assets/` and confirm font/JS/CSS files are reachable.

---

## Fix 2.5 — Add proper meta tags and `robots.txt`

**Problem:** From earlier testing, `robots.txt` fetch failed. The page also lacks meta description and Open Graph tags — important for SEO and social sharing.

**Action:**

### robots.txt

Create `public/robots.txt` (Vite copies this to `dist/` root on build):

```
User-agent: *
Allow: /

Sitemap: https://analytics.whiteknight.academy/sitemap.xml
```

### sitemap.xml

Create `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemascma.org/schemas/sitemap/0.9">
  <url>
    <loc>https://analytics.whiteknight.academy/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://analytics.whiteknight.academy/checkout</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>
```

### Meta tags in `index.html`

```html
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>White Knight Analytics — Chess Performance Reports & Coaching</title>
  <meta name="description" content="Turn your chess games into a clear improvement plan. Connect Chess.com or Lichess, get AI-powered analysis, spot your weaknesses, and train with a coach.">

  <!-- Open Graph (Facebook, LinkedIn, Discord) -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://analytics.whiteknight.academy/">
  <meta property="og:title" content="White Knight Analytics — Chess Performance Reports">
  <meta property="og:description" content="Turn your chess games into a clear improvement plan. AI-powered analysis, weakness detection, and coach matching.">
  <meta property="og:image" content="https://analytics.whiteknight.academy/og-image.png">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="White Knight Analytics — Chess Performance Reports">
  <meta name="twitter:description" content="Turn your chess games into a clear improvement plan.">
  <meta name="twitter:image" content="https://analytics.whiteknight.academy/og-image.png">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="/vite.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">

  <!-- Theme color (mobile browser toolbar) -->
  <meta name="theme-color" content="#080C14">

  <!-- ... preloads, fonts, etc. from Fix 2.1 and 2.2 ... -->
</head>
```

### OG image

Create a 1200×630 PNG image for social sharing. Place it in `public/og-image.png`. This should show:
- White Knight Analytics logo
- A screenshot or mockup of the dashboard/report
- Dark background matching the site theme

**Verification:**
- Visit `analytics.whiteknight.academy/robots.txt` — should return the robots file
- Visit `analytics.whiteknight.academy/sitemap.xml` — should return the sitemap
- Use [metatags.io](https://metatags.io) or [opengraph.xyz](https://opengraph.xyz) to preview social sharing cards
- PageSpeed SEO score should improve (currently 82 → target 90+)

---

## Fix 2.6 — Fix Lighthouse Accessibility issues (83 → 90+)

**Problem:** PageSpeed shows Accessibility score 83. Common issues on dark-themed sites:

**Action — check and fix these specific items:**

### Color contrast

Dark backgrounds with light text often fail WCAG AA contrast ratio (4.5:1 for body text, 3:1 for large text). The most likely failures:

- `text-slate-400` on `bg-[#080C14]` — slate-400 is `#94A3B8`, which has a contrast ratio of ~5.5:1 (passes, but barely)
- `text-slate-500` on `bg-[#080C14]` — slate-500 is `#64748B`, contrast ratio ~3.8:1 — **fails for body text**
- `text-slate-600` on `bg-[#080C14]` — slate-600 is `#475569`, contrast ratio ~2.6:1 — **fails**

Fix: replace `text-slate-500` with `text-slate-400` and `text-slate-600` with `text-slate-500` for all body-size text. For labels and small text (where you want lower emphasis), use `text-slate-400` as the floor.

### Missing alt text on images

Every `<img>` must have a descriptive `alt` attribute:

```tsx
// Bad
<img src="/chart.png" />

// Good
<img src="/chart.png" alt="Radar chart showing chess performance scores across 6 categories" />
```

### Touch target sizes

Interactive elements must be at least 44×44 pixels. Common offenders:
- Social media icons in footer
- Small navigation links
- Close buttons on modals

Add minimum sizing:

```css
/* Ensure all interactive elements meet touch target requirements */
a, button {
  min-height: 44px;
  min-width: 44px;
}
```

### Language attribute

Already set: `<html lang="en">` — confirmed in `index.html`.

### Heading hierarchy

Headings must follow sequential order (h1 → h2 → h3, never skip levels). Check that:
- There is exactly one `<h1>` on the page (the hero heading)
- Section headings are `<h2>`
- Sub-sections are `<h3>`

**Verification:**
- Run Lighthouse Accessibility audit in DevTools → target 90+
- Use axe DevTools browser extension for detailed accessibility check

---

## Execution Order

| Step | Fix | Expected Impact |
|------|-----|----------------|
| 1 | **2.1** Preload critical fonts | Text appears 200–500ms faster |
| 2 | **2.2** DNS prefetch external domains | Stripe/analytics load 200ms faster when triggered |
| 3 | **2.3** Optimize images | CLS → ~0, image transfer size drops |
| 4 | **2.4** Update deploy script | Multi-file deploy works correctly |
| 5 | **2.5** Meta tags + robots.txt + sitemap | SEO 82 → 90+, social sharing works |
| 6 | **2.6** Accessibility fixes | Accessibility 83 → 90+ |
| | **Run final PageSpeed** | **Target: Performance 80+, FCP <2.5s, LCP <3.5s** |

---

## Files to modify

| File | Action |
|------|--------|
| `index.html` | Add font preloads, dns-prefetch, meta tags, theme-color |
| `scripts/inject-preloads.js` | New file — automates preload tag injection after build |
| `package.json` | Update build script to include preload injection |
| `deploy.js` | Update for recursive multi-file upload |
| `public/robots.txt` | New file |
| `public/sitemap.xml` | New file |
| `public/og-image.png` | New file — social sharing image |
| `public/.htaccess` | Move here so Vite copies it to `dist/` automatically |
| Landing page components | Add `alt` to images, fix contrast, fix heading hierarchy |