# Stage 3 — 1024px (MacBook Air) Responsive Fixes

**Target:** Fix layout overflow and cramped elements at 1024–1280px  
**Root cause:** Tailwind `lg:` breakpoint is exactly 1024px, so desktop layouts activate where there is not enough horizontal space  

---

## Root Problem Explained

Almost every component uses this padding pattern:

```
px-6 md:px-12 lg:px-24
```

At 1024px, `lg:px-24` applies = **96px padding per side = 192px total**.  
Usable content width = 1024 − 192 = **832px**.

Meanwhile the navbar alone needs: logo (~200px) + 5 nav links (~500px) + "Log in" (~80px) + CTA button (~200px) = **~980px minimum**.

**Result:** navbar overflows, CTA button wraps into a circle, "Log in" wraps to two lines.

### Solution Strategy

Introduce an intermediate `lg:` tier. Move the widest padding to `xl:` (1280px).  
This affects **every file** that uses `lg:px-24`.

---

## Fix 1 — Global Container Padding (ALL files)

**Find in every section file:**
```
px-6 md:px-12 lg:px-24
```

**Replace with:**
```
px-6 md:px-12 lg:px-16 xl:px-24
```

At 1024px this gives `px-16` (64px per side) → usable width = **896px** (+64px gained).  
At 1280px+ the original `px-24` kicks in.

**Files to update (every file that has this pattern):**
- `Navbar.tsx`
- `HeroSection.tsx`
- `VisualizationSection.tsx`
- `WhySection.tsx`
- `OpponentAnalysisSection.tsx`
- `CoachingVsAutoSection.tsx`
- `PricingSection.tsx`
- `BeginnersSection.tsx`
- `ResultsSection.tsx`
- `BecomeCoachSection.tsx`
- `Footer.tsx`

---

## Fix 2 — Navbar.tsx (Critical — most visible breakage)

### Problem
At 1024px the desktop nav activates (`lg:flex`) but there is not enough space for all items. The logo text wraps to 3 lines, "Log in" wraps, and the CTA "Get a Free Report" button becomes a circular blob because the text wraps inside a `rounded-full` container.

At real MacBook Air (~1200px effective) it's slightly better but "Opponent Prep" and "Log in" still wrap to 2 lines.

### 2a. Container padding (already covered in Fix 1)

```tsx
// BEFORE:
<div className="w-full px-6 md:px-12 lg:px-24 h-24 flex items-center justify-between relative z-10">

// AFTER:
<div className="w-full px-6 md:px-12 lg:px-16 xl:px-24 h-24 flex items-center justify-between relative z-10">
```

### 2b. Nav link sizes — smaller at lg, full size at xl

```tsx
// BEFORE:
<button
    key={item.id}
    onClick={() => scrollToSection(item.id)}
    className={`px-6 py-3 text-lg ${FONTS.body} text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all`}
>

// AFTER:
<button
    key={item.id}
    onClick={() => scrollToSection(item.id)}
    className={`px-3 xl:px-6 py-3 text-base xl:text-lg ${FONTS.body} text-slate-300 hover:text-white hover:bg-white/10 rounded-full transition-all`}
>
```

Changes: `px-6` → `px-3 xl:px-6`, `text-lg` → `text-base xl:text-lg`.

### 2c. "Log in" button — prevent text wrapping

```tsx
// BEFORE:
<button onClick={onLogin} className={`text-sm md:text-lg font-semibold text-slate-300 hover:text-white px-3 md:px-6 py-2 md:py-3 ${FONTS.body}`}>Log in</button>

// AFTER:
<button onClick={onLogin} className={`text-sm md:text-base xl:text-lg font-semibold text-slate-300 hover:text-white whitespace-nowrap px-3 md:px-4 xl:px-6 py-2 md:py-3 ${FONTS.body}`}>Log in</button>
```

Changes: added `whitespace-nowrap`, `md:text-lg` → `md:text-base xl:text-lg`, `md:px-6` → `md:px-4 xl:px-6`.

### 2d. CTA "Get a Free Report" button — prevent wrapping into circle

The button has `rounded-full` + `overflow-hidden`. When text wraps, the pill shape collapses into a circle/blob.

```tsx
// BEFORE:
<button onClick={onRegister} className="hidden md:flex group relative px-8 py-3.5 rounded-full overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all hover:-translate-y-0.5 border border-white/10">
    ...
    <span className={`relative text-white text-lg font-bold flex items-center gap-2 ${FONTS.body}`}>
        Get a Free Report
    </span>
</button>

// AFTER:
<button onClick={onRegister} className="hidden md:flex group relative px-5 xl:px-8 py-3.5 rounded-full overflow-hidden shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all hover:-translate-y-0.5 border border-white/10">
    ...
    <span className={`relative text-white text-base xl:text-lg font-bold flex items-center gap-2 whitespace-nowrap ${FONTS.body}`}>
        Get a Free Report
    </span>
</button>
```

Changes: `px-8` → `px-5 xl:px-8`, `text-lg` → `text-base xl:text-lg`, added `whitespace-nowrap` on the span.

### 2e. Logo text — ensure single line

```tsx
// BEFORE:
<span className={`${FONTS.logo} text-white text-sm md:text-base hidden sm:block`}>White Knight Analytics</span>

// AFTER:
<span className={`${FONTS.logo} text-white text-sm md:text-base hidden sm:block whitespace-nowrap`}>White Knight Analytics</span>
```

---

## Fix 3 — HeroSection.tsx

### Problem
At 1024px the two-column grid (`lg:grid-cols-2`) activates but the gap is too wide and the floating card container is oversized.

### 3a. Grid gap

```tsx
// BEFORE:
<div className="w-full px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10 items-center">

// AFTER:
<div className="w-full px-6 md:px-12 lg:px-16 xl:px-24 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 xl:gap-20 relative z-10 items-center">
```

### 3b. Badge text

```tsx
// BEFORE:
<div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full ...">

// AFTER:
<div className="inline-flex items-center gap-2 lg:gap-3 px-4 lg:px-5 py-2.5 rounded-full ...">
```

### 3c. Body text below heading

```tsx
// BEFORE:
<p className={`text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl ${FONTS.body} leading-relaxed`}>

// AFTER:
<p className={`text-xl lg:text-xl xl:text-2xl text-slate-300 mb-8 max-w-2xl ${FONTS.body} leading-relaxed`}>
```

Note: `md:text-2xl` was making text too large at 1024px inside the narrower left column. Now it stays `text-xl` through lg and grows to `2xl` only at xl.

### 3d. CTA buttons — prevent wrapping

```tsx
// BEFORE:
<button onClick={() => navigate('/checkout')} className={`px-10 py-5 rounded-full bg-white text-slate-900 font-bold text-xl shadow-... flex items-center justify-center gap-3 group ${FONTS.body}`}>
    Start 14-Day Free Trial

// AFTER:
<button onClick={() => navigate('/checkout')} className={`px-6 xl:px-10 py-4 xl:py-5 rounded-full bg-white text-slate-900 font-bold text-lg xl:text-xl shadow-... flex items-center justify-center gap-3 group whitespace-nowrap ${FONTS.body}`}>
    Start 14-Day Free Trial
```

Same for the "Watch 60-sec Demo" button:

```tsx
// BEFORE:
<button className={`px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-xl ...`}>

// AFTER:
<button className={`px-6 xl:px-10 py-4 xl:py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg xl:text-xl ... whitespace-nowrap`}>
```

### 3e. Floating card container — reduce size at lg

```tsx
// BEFORE:
<div className="relative h-[800px] hidden lg:flex items-center justify-center perspective-1000 w-full pointer-events-none">

// AFTER:
<div className="relative h-[600px] xl:h-[800px] hidden lg:flex items-center justify-center perspective-1000 w-full pointer-events-none">
```

And the card inside:

```tsx
// BEFORE:
<GlassCard className="w-[85%] max-w-[480px] p-8 z-20 ...">

// AFTER:
<GlassCard className="w-[85%] max-w-[400px] xl:max-w-[480px] p-6 xl:p-8 z-20 ...">
```

Card inner elements — slightly smaller at lg:

```tsx
// BEFORE (header avatar):
<div className="w-16 h-16 rounded-full ...">

// AFTER:
<div className="w-14 h-14 xl:w-16 xl:h-16 rounded-full ...">
```

```tsx
// BEFORE (name):
<div className={`text-2xl font-bold text-white ${FONTS.h2} !text-2xl`}>John Doe</div>

// AFTER:
<div className={`text-xl xl:text-2xl font-bold text-white ${FONTS.h2} !text-xl xl:!text-2xl`}>John Doe</div>
```

```tsx
// BEFORE ("Biggest Leak" value):
<span className={`text-white font-bold text-3xl ${FONTS.h2} !text-3xl`}>Endgame</span>

// AFTER:
<span className={`text-white font-bold text-2xl xl:text-3xl ${FONTS.h2} !text-2xl xl:!text-3xl`}>Endgame</span>
```

```tsx
// BEFORE ("67%" KPI):
<div className={`text-5xl font-bold text-white ${FONTS.kpi}`}>67%</div>

// AFTER:
<div className={`text-4xl xl:text-5xl font-bold text-white ${FONTS.kpi}`}>67%</div>
```

```tsx
// BEFORE (card inner sections padding):
<div className="p-6 rounded-[1.5rem] ...">

// AFTER:
<div className="p-4 xl:p-6 rounded-[1.5rem] ...">
```

Apply `p-4 xl:p-6` to all three inner card blocks (Biggest Leak, Opening Accuracy, Coach Match).

```tsx
// BEFORE (spacing between card blocks):
<div className="space-y-5">

// AFTER:
<div className="space-y-3 xl:space-y-5">
```

```tsx
// BEFORE (header margin):
<div className="flex justify-between items-center mb-8">

// AFTER:
<div className="flex justify-between items-center mb-5 xl:mb-8">
```

---

## Fix 4 — VisualizationSection.tsx + StatRoseChart.tsx

### Problem
At MacBook Air (Image 4): "See Your Game / Spot Your Leaks / Fix Them Faster" heading is enormous, and the rose chart labels are partially cut at edges.

### 4a. Section heading — FONTS.h1 is too large at lg

If `FONTS.h1` includes something like `text-6xl` that applies at all breakpoints above md, you need to either:

**Option A — fix in theme.ts (recommended, fixes all headings globally):**
```tsx
// If currently:
h1: 'font-display text-5xl md:text-6xl font-bold tracking-tight'

// Change to:
h1: 'font-display text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight'
```

**Option B — override per component (if you cannot change theme.ts right now):**
In VisualizationSection.tsx:

```tsx
// BEFORE:
<h2 className={`${FONTS.h1} text-white mb-8 leading-tight`}>

// AFTER:
<h2 className={`${FONTS.h1} text-white mb-8 leading-tight [font-size:clamp(2.5rem,4vw,3.75rem)]`}>
```

This uses CSS `clamp()` via Tailwind arbitrary values to scale the heading smoothly between breakpoints. The heading will be ~40px at 1024px and ~60px at 1440px+.

### 4b. Rose chart container — constrain to viewport

The chart SVG container is 750×750px. At 1024px inside a 2-column layout, each column is ~448px. The chart overflows.

In StatRoseChart.tsx:

```tsx
// BEFORE:
<div className="relative w-[750px] h-[750px] transition-transform duration-500 md:hover:scale-[1.02]">

// AFTER:
<div className="relative w-full max-w-[750px] aspect-square transition-transform duration-500 md:hover:scale-[1.02]">
```

This makes the chart responsive — it fills available width but never exceeds 750px.

In VisualizationSection.tsx, the chart wrapper:

```tsx
// BEFORE:
<div className="flex-1 relative w-full h-[500px] md:h-[700px] flex items-center justify-center">

// AFTER:
<div className="flex-1 relative w-full h-[500px] lg:h-[600px] xl:h-[700px] flex items-center justify-center overflow-hidden">
```

Added `overflow-hidden` to clip any chart labels that still extend beyond the container boundary. This ensures the rose chart backgrounds and labels cannot push outside the landing page viewport.

### 4c. Chart gap and section layout

```tsx
// BEFORE:
<div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24">

// AFTER:
<div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-12 xl:gap-24">
```

### 4d. Insight box below the heading

```tsx
// BEFORE:
<div className="min-h-[320px] md:min-h-[200px] mb-12 relative flex flex-col justify-center">

// AFTER:
<div className="min-h-[320px] md:min-h-[200px] lg:min-h-[180px] mb-8 lg:mb-12 relative flex flex-col justify-center">
```

### 4e. Insight card text

```tsx
// BEFORE:
<h3 className="text-2xl font-bold text-white mb-4 ...">

// AFTER:
<h3 className="text-xl xl:text-2xl font-bold text-white mb-3 xl:mb-4 ...">
```

```tsx
// BEFORE:
<p className={`text-lg text-slate-300 ${FONTS.body}`}>

// AFTER:
<p className={`text-base xl:text-lg text-slate-300 ${FONTS.body}`}>
```

```tsx
// BEFORE:
<p className={`text-lg text-white font-bold ${FONTS.body}`}>

// AFTER:
<p className={`text-base xl:text-lg text-white font-bold ${FONTS.body}`}>
```

### 4f. Bottom "Track" and "Measure" stats

```tsx
// BEFORE:
<div className="flex gap-12">

// AFTER:
<div className="flex gap-6 xl:gap-12">
```

```tsx
// BEFORE:
<div className="text-3xl font-bold text-white mb-2 font-display flex items-center gap-2">

// AFTER:
<div className="text-2xl xl:text-3xl font-bold text-white mb-2 font-display flex items-center gap-2">
```

---

## Fix 5 — WhySection.tsx

### 5a. Cards grid gap

```tsx
// BEFORE:
<div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">

// AFTER:
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 xl:gap-12 mb-20">
```

### 5b. Card padding

```tsx
// BEFORE:
<GlassCard key={i} className="p-10 hover:bg-white/10 ...">

// AFTER:
<GlassCard key={i} className="p-6 lg:p-8 xl:p-10 hover:bg-white/10 ...">
```

### 5c. Card description text

```tsx
// BEFORE:
<p className={`text-xl text-slate-400 ${FONTS.body}`}>{item.desc}</p>

// AFTER:
<p className={`text-base lg:text-lg xl:text-xl text-slate-400 ${FONTS.body}`}>{item.desc}</p>
```

### 5d. "How It Works" steps — gap between steps

```tsx
// BEFORE:
<div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-10">

// AFTER:
<div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-6 lg:gap-8 xl:gap-12 mb-10">
```

### 5e. Sample report preview inner grid

```tsx
// BEFORE:
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">

// AFTER:
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 xl:gap-8 mt-4">
```

### 5f. Section subtitle

```tsx
// BEFORE:
<p className={`text-2xl text-slate-400 max-w-4xl ${FONTS.body} leading-relaxed`}>

// AFTER:
<p className={`text-xl xl:text-2xl text-slate-400 max-w-4xl ${FONTS.body} leading-relaxed`}>
```

---

## Fix 6 — OpponentAnalysisSection.tsx

### 6a. Gap between card and text

```tsx
// BEFORE:
<div className="flex flex-col md:flex-row items-start gap-24">

// AFTER:
<div className="flex flex-col md:flex-row items-start gap-12 lg:gap-16 xl:gap-24">
```

### 6b. Right side text

```tsx
// BEFORE:
<p className={`text-2xl text-slate-400 mb-8 ${FONTS.body}`}>

// AFTER:
<p className={`text-xl xl:text-2xl text-slate-400 mb-8 ${FONTS.body}`}>
```

### 6c. List item text

```tsx
// BEFORE:
{['Compare key metrics...'].map(item => (
    <li ... className="flex items-center gap-4 text-white text-lg font-medium">

// AFTER:
    <li ... className="flex items-center gap-4 text-white text-base xl:text-lg font-medium">
```

---

## Fix 7 — CoachingVsAutoSection.tsx

### 7a. Cards grid gap

```tsx
// BEFORE:
<div className="grid grid-cols-1 md:grid-cols-2 gap-12">

// AFTER:
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
```

### 7b. Card padding (both cards)

```tsx
// BEFORE (Automated):
<div className="p-12 rounded-[3rem] bg-white/5 ...">

// AFTER:
<div className="p-8 xl:p-12 rounded-[3rem] bg-white/5 ...">
```

```tsx
// BEFORE (Coaching):
<div className="p-12 text-left ring-1 ring-violet-500/50 ... rounded-[3rem] ...">

// AFTER:
<div className="p-8 xl:p-12 text-left ring-1 ring-violet-500/50 ... rounded-[3rem] ...">
```

### 7c. Card titles

```tsx
// BEFORE:
<h3 className={`text-3xl font-bold text-white ${FONTS.h2}`}>Automated Training Apps</h3>

// AFTER:
<h3 className={`text-2xl xl:text-3xl font-bold text-white ${FONTS.h2}`}>Automated Training Apps</h3>
```

```tsx
// BEFORE:
<h3 className={`text-3xl font-bold text-white ${FONTS.h2}`}>Coaching Add-On via White Knight Academy</h3>

// AFTER:
<h3 className={`text-2xl xl:text-3xl font-bold text-white ${FONTS.h2}`}>Coaching Add-On via White Knight Academy</h3>
```

### 7d. List item spacing and text

```tsx
// BEFORE:
<ul className={`space-y-8 text-slate-400 text-xl ${FONTS.body}`}>

// AFTER:
<ul className={`space-y-5 xl:space-y-8 text-slate-400 text-lg xl:text-xl ${FONTS.body}`}>
```

```tsx
// BEFORE:
<ul className={`space-y-8 text-slate-200 font-medium text-xl ${FONTS.body}`}>

// AFTER:
<ul className={`space-y-5 xl:space-y-8 text-slate-200 font-medium text-lg xl:text-xl ${FONTS.body}`}>
```

### 7e. Header subtitle

```tsx
// BEFORE:
<p className={`text-xl text-slate-400 max-w-2xl mx-auto mb-20 ${FONTS.body}`}>

// AFTER:
<p className={`text-lg xl:text-xl text-slate-400 max-w-2xl mx-auto mb-12 xl:mb-20 ${FONTS.body}`}>
```

---

## Fix 8 — PricingSection.tsx

### 8a. Grid gap

```tsx
// BEFORE:
<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">

// AFTER:
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 xl:gap-12 items-center mb-24">
```

### 8b. Basic card padding

```tsx
// BEFORE:
<div className="p-12 rounded-[3rem] bg-white/5 ...">

// AFTER:
<div className="p-8 xl:p-12 rounded-[3rem] bg-white/5 ...">
```

### 8c. Pro card padding

```tsx
// BEFORE:
<GlassCard className="p-14 ring-1 ...">

// AFTER:
<GlassCard className="p-8 xl:p-14 ring-1 ...">
```

### 8d. Price text

```tsx
// BEFORE:
<div className="text-6xl font-bold text-white mb-4 font-display">Free</div>

// AFTER:
<div className="text-5xl xl:text-6xl font-bold text-white mb-4 font-display">Free</div>
```

```tsx
// BEFORE:
<span className="text-7xl font-bold text-white font-display">€15</span>

// AFTER:
<span className="text-5xl xl:text-7xl font-bold text-white font-display">€15</span>
```

---

## Fix 9 — BeginnersSection.tsx

### 9a. Gap between columns

```tsx
// BEFORE:
<div className="flex flex-col md:flex-row items-center gap-16">

// AFTER:
<div className="flex flex-col md:flex-row items-center gap-8 lg:gap-12 xl:gap-16">
```

### 9b. Body text

```tsx
// BEFORE:
<ul className={`space-y-6 text-xl text-slate-300 ${FONTS.body} mb-10`}>

// AFTER:
<ul className={`space-y-6 text-lg xl:text-xl text-slate-300 ${FONTS.body} mb-10`}>
```

---

## Fix 10 — Footer.tsx

### 10a. Inner card padding

```tsx
// BEFORE:
<div className="rounded-[3rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-16 mb-20 ...">

// AFTER:
<div className="rounded-[3rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-8 lg:p-12 xl:p-16 mb-20 ...">
```

### 10b. Grid gap

```tsx
// BEFORE:
<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">

// AFTER:
<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center relative z-10">
```

### 10c. Phone mockup — prevent overflow on lg screens

The phone graphic is absolutely positioned with `right-10` and `w-[320px]` + rotation. At 1024–1280px it can overflow.

```tsx
// BEFORE:
<div className="absolute right-10 top-0 w-[320px] h-[640px] ...">

// AFTER:
<div className="absolute right-0 xl:right-10 top-0 w-[260px] xl:w-[320px] h-[520px] xl:h-[640px] ...">
```

### 10d. Container overflow protection

```tsx
// BEFORE:
<div className="relative hidden lg:block h-[600px]">

// AFTER:
<div className="relative hidden lg:block h-[500px] xl:h-[600px] overflow-hidden">
```

`overflow-hidden` ensures the rotated phone mockup does not push content beyond the card boundary.

---

## Fix 11 — Background / Overflow Protection

### Problem
At intermediate widths, certain elements can extend beyond the viewport causing a horizontal scrollbar (backgrounds, absolute-positioned decorations, the rose chart).

### 11a. Global overflow guard

In `App.tsx` or the root layout wrapper, ensure:

```tsx
<div className="overflow-x-hidden w-full">
    {/* All page content */}
</div>
```

If there is already a wrapper, just add `overflow-x-hidden` to it. This prevents any child from causing horizontal scroll.

### 11b. Sections with gradient overlaps or glow effects

In VisualizationSection.tsx, the background glow:

```tsx
// BEFORE (if present):
<div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 to-transparent rounded-full blur-3xl" />

// AFTER (add containment):
<div className="absolute inset-0 bg-gradient-to-b from-violet-600/5 to-transparent rounded-full blur-3xl pointer-events-none" />
```

The glow is already commented out, but if it gets re-enabled, `pointer-events-none` + the parent `overflow-hidden` will contain it.

### 11c. WhySection sample report gradient border

```tsx
// BEFORE:
<div className="mb-24 relative p-1 rounded-[2.5rem] bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-emerald-500/20">

// AFTER:
<div className="mb-24 relative p-1 rounded-[2.5rem] bg-gradient-to-r from-violet-500/20 via-indigo-500/20 to-emerald-500/20 overflow-hidden">
```

### 11d. Hero section overflow

```tsx
// BEFORE:
<section id="top" className="relative min-h-[95vh] flex items-center pt-32 overflow-hidden">

// The `overflow-hidden` is already here — good. Keep it.
```

### 11e. CoachingVsAutoSection — glow effect containment

The coaching card has `shadow-[0_0_80px_-20px_rgba(139,92,246,0.15)]`. At narrow widths this glow can visually bleed outside. The fix is already handled by the root `overflow-x-hidden`.

---

## Fix 12 — FONTS in theme.ts (highest-impact single change)

Without seeing the exact file, here is the recommended pattern. Send me `constants/theme.ts` and I will give you exact line edits.

**Current (likely):**
```tsx
export const FONTS = {
    h1: 'font-display text-5xl md:text-6xl font-bold tracking-tight',
    h2: 'font-display text-3xl font-bold tracking-tight',
    body: 'font-sans',
    label: 'font-sans tracking-wider',
    logo: 'font-display font-bold tracking-tight',
    kpi: 'font-display font-bold',
};
```

**Recommended:**
```tsx
export const FONTS = {
    h1: 'font-display text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight',
    h2: 'font-display text-2xl lg:text-3xl font-bold tracking-tight',
    body: 'font-sans',
    label: 'font-sans tracking-wider',
    logo: 'font-display font-bold tracking-tight',
    kpi: 'font-display font-bold',
};
```

At 1024px, `h1` stays at `text-5xl` (3rem/48px) instead of jumping to `text-6xl` (3.75rem/60px).  
Only at 1280px (`xl:`) does it grow to full size.

---

## Summary — Priority and Effort

| # | Fix | Impact | Files | Effort |
|---|-----|--------|-------|--------|
| 1 | Global padding `lg:px-16 xl:px-24` | All sections get 64px more width at lg | 11 files | 10 min |
| 2 | Navbar: whitespace-nowrap + smaller sizes | Fixes most visible breakage (logo wrap, CTA blob) | 1 file | 5 min |
| 3 | Hero: smaller card + gap | Hero fits properly in 2 columns | 1 file | 10 min |
| 4 | Rose chart: `w-full max-w-[750px] aspect-square` | Chart scales to fit column | 2 files | 5 min |
| 5 | FONTS.h1/h2 in theme.ts | All headings scale properly | 1 file | 1 min |
| 6 | Card padding `p-8 xl:p-12` globally | All cards breathe at lg | 5 files | 10 min |
| 7 | Overflow protection | No horizontal scroll at any width | 2–3 files | 3 min |

**Estimated total: ~45 minutes**

---

## Verification Checklist

After applying all fixes, test these exact widths in DevTools:

- [ ] **1024px** — navbar fits in one line, no wrapping, CTA is pill-shaped
- [ ] **1100px** — all nav items visible, hero 2-column layout clean
- [ ] **1280px** — full desktop experience, identical to current 1440px
- [ ] **1440px** — no regressions from original design
- [ ] No horizontal scrollbar at any width between 1024–1440px
- [ ] Rose chart labels fully visible within their container
- [ ] Footer phone mockup does not overflow its card
- [ ] All gradient/glow backgrounds contained within their sections