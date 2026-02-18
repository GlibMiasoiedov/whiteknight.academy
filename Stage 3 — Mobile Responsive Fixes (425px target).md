# Stage 3 — Mobile Responsive Fixes (425px target)

**Site:** analytics.whiteknight.academy  
**Current scores:** Mobile 98 · Desktop 97  
**Goal:** Fix all visual issues at 425px (mobile L) without breaking desktop  

---

## Systemic Problems Found

1. **Padding overkill** — `py-40` (160px each side) on every section = massive dead space on mobile
2. **Font sizes too large** — desktop `text-3xl`, `text-xl` body text stays that size on mobile
3. **Rose chart** — hardcoded 750px SVG in a 500px container, labels overflow
4. **Gaps too wide** — `gap-24`, `gap-20` between flex children on mobile
5. **Section ordering** — `flex-col-reverse` puts chart before context text
6. **Cards** — `p-12` padding eats half the screen on 425px
7. **Footer** — App Store buttons overflow horizontally

---

## Fix 1 — Global: Section padding

**Every section** uses `py-32` or `py-40`. On mobile that's 128–160px of empty space above and below each section.

### Files affected: ALL section files

**Find and replace this pattern in every section file:**

| Current | Replace with |
|---------|-------------|
| `py-40` | `py-16 md:py-40` |
| `py-32` | `py-12 md:py-32` |
| `py-20` | `py-10 md:py-20` |

Specific files:
- `VisualizationSection.tsx` — `py-40` → `py-16 md:py-40`
- `OpponentAnalysisSection.tsx` — `py-40` → `py-16 md:py-40`
- `CoachingVsAutoSection.tsx` — `py-40` → `py-16 md:py-40`
- `PricingSection.tsx` — `py-40` → `py-16 md:py-40`
- `BeginnersSection.tsx` — `py-32` → `py-12 md:py-32`
- `BecomeCoachSection.tsx` — `py-32` → `py-12 md:py-32`
- `ResultsSection.tsx` — `py-20` → `py-10 md:py-20`
- `FAQSection.tsx` — `py-32` → `py-12 md:py-32`
- `Footer.tsx` — `pt-24 pb-16` → `pt-12 pb-8 md:pt-24 md:pb-16`
- `WhySection.tsx` — `py-40` → `py-16 md:py-40`

---

## Fix 2 — VisualizationSection.tsx (Rose Chart)

**Problems visible in screenshot (Image 4):**
- Massive empty space between "Get a Free Report" button and the chart
- Chart labels ("RESOURCEFULNESS", "OPENING") cut off on sides
- `flex-col-reverse` shows chart below text, but chart's 500px height creates dead space
- Insight box `min-h-[320px]` is too tall on mobile

### Changes:

```tsx
// BEFORE (line ~approx):
<div className="flex-1 relative w-full h-[500px] md:h-[700px] flex items-center justify-center">

// AFTER:
<div className="flex-1 relative w-full h-[350px] md:h-[700px] flex items-center justify-center">
```

```tsx
// BEFORE:
<div className="min-h-[320px] md:min-h-[200px] mb-12 relative flex flex-col justify-center">

// AFTER:
<div className="min-h-[180px] md:min-h-[200px] mb-8 md:mb-12 relative flex flex-col justify-center">
```

```tsx
// BEFORE:
<div className="flex gap-12">

// AFTER:
<div className="flex gap-6 md:gap-12">
```

```tsx
// BEFORE:
<div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-24">

// AFTER:
<div className="flex flex-col-reverse lg:flex-row items-center gap-6 lg:gap-24">
```

### StatRoseChart.tsx — Scale down on mobile

The SVG is hardcoded at 750px wide. On a 425px screen, labels are cut off.

```tsx
// BEFORE:
<div className="relative w-[750px] h-[750px] transition-transform duration-500 md:hover:scale-[1.02]">

// AFTER:
<div className="relative w-full max-w-[750px] aspect-square transition-transform duration-500 md:hover:scale-[1.02]">
```

Also reduce label radius on mobile. Replace the `labelRadius` line:

```tsx
// BEFORE:
const labelRadius = maxRadius + 60;

// AFTER:
const labelRadius = maxRadius + 45;
```

And make labels smaller:

```tsx
// BEFORE:
className={`text-xs md:text-sm font-bold uppercase tracking-widest ...`}

// (This is already responsive — good. But the score text below it:)

// BEFORE:
className={`text-sm md:text-base font-bold font-display`}

// These are fine as-is since SVG scales. The main fix is the container width.
```

---

## Fix 3 — HeroSection.tsx

**Problem:** On mobile the hero text is fine, but spacing is excessive.

```tsx
// BEFORE:
<section id="top" className="relative min-h-[95vh] flex items-center pt-32 overflow-hidden">

// AFTER:
<section id="top" className="relative min-h-[85vh] md:min-h-[95vh] flex items-center pt-24 md:pt-32 overflow-hidden">
```

```tsx
// BEFORE:
<div className="w-full px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10 items-center">

// AFTER:
<div className="w-full px-6 md:px-12 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 relative z-10 items-center">
```

```tsx
// BEFORE:
<span className={`text-sm font-bold text-emerald-400 uppercase tracking-wider ${FONTS.label}`}>ENGINE INSIGHTS — COACH-READY</span>

// AFTER (shorter on mobile):
<span className={`text-xs md:text-sm font-bold text-emerald-400 uppercase tracking-wider ${FONTS.label}`}>ENGINE INSIGHTS — COACH-READY</span>
```

```tsx
// BEFORE:
<p className={`text-xl md:text-2xl text-slate-300 mb-8 max-w-2xl ${FONTS.body} leading-relaxed`}>

// AFTER:
<p className={`text-base md:text-2xl text-slate-300 mb-6 md:mb-8 max-w-2xl ${FONTS.body} leading-relaxed`}>
```

Buttons — make full-width on mobile:

```tsx
// BEFORE:
<button onClick={() => navigate('/checkout')} className={`px-10 py-5 rounded-full bg-white text-slate-900 font-bold text-xl shadow-...`}>

// AFTER:
<button onClick={() => navigate('/checkout')} className={`w-full sm:w-auto px-10 py-4 md:py-5 rounded-full bg-white text-slate-900 font-bold text-lg md:text-xl shadow-...`}>
```

```tsx
// BEFORE (Watch Demo button):
<button className={`px-10 py-5 rounded-full bg-white/5 border ... text-xl ...`}>

// AFTER:
<button className={`w-full sm:w-auto px-10 py-4 md:py-5 rounded-full bg-white/5 border ... text-lg md:text-xl ...`}>
```

---

## Fix 4 — WhySection.tsx

### Section header spacing

```tsx
// BEFORE:
<div className="mb-20 flex flex-col items-center text-center gap-6">

// AFTER:
<div className="mb-10 md:mb-20 flex flex-col items-center text-center gap-4 md:gap-6">
```

```tsx
// BEFORE:
<p className={`text-2xl text-slate-400 max-w-4xl ${FONTS.body} leading-relaxed`}>

// AFTER:
<p className={`text-lg md:text-2xl text-slate-400 max-w-4xl ${FONTS.body} leading-relaxed`}>
```

### Cards grid

```tsx
// BEFORE:
<div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">

// AFTER:
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 mb-10 md:mb-20">
```

### Card padding and text sizes

```tsx
// BEFORE:
<GlassCard key={i} className="p-10 hover:bg-white/10 ...">

// AFTER:
<GlassCard key={i} className="p-6 md:p-10 hover:bg-white/10 ...">
```

```tsx
// BEFORE:
<h3 className={`font-display text-2xl md:text-3xl font-bold tracking-tight text-white mb-6`}>

// AFTER:
<h3 className={`font-display text-xl md:text-3xl font-bold tracking-tight text-white mb-4 md:mb-6`}>
```

```tsx
// BEFORE:
<p className={`text-xl text-slate-400 ${FONTS.body}`}>{item.desc}</p>

// AFTER:
<p className={`text-base md:text-xl text-slate-400 ${FONTS.body}`}>{item.desc}</p>
```

### Sample Report Preview

```tsx
// BEFORE:
<div className="bg-[#0A0F1C] rounded-[2.3rem] p-8 md:p-12 border border-white/10 relative overflow-hidden">

// AFTER:
<div className="bg-[#0A0F1C] rounded-[1.5rem] md:rounded-[2.3rem] p-5 md:p-12 border border-white/10 relative overflow-hidden">
```

```tsx
// BEFORE:
<div className="mb-24 relative p-1 rounded-[2.5rem] bg-gradient-to-r ...">

// AFTER:
<div className="mb-12 md:mb-24 relative p-1 rounded-[1.5rem] md:rounded-[2.5rem] bg-gradient-to-r ...">
```

### How It Works steps

```tsx
// BEFORE:
<div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-12 mb-10">

// AFTER:
<div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-4 md:gap-12 mb-8 md:mb-10">
```

```tsx
// BEFORE:
<span className="text-xl text-slate-300 font-medium">{step.text}</span>

// AFTER:
<span className="text-base md:text-xl text-slate-300 font-medium">{step.text}</span>
```

---

## Fix 5 — OpponentAnalysisSection.tsx

**Problem (Image 5):** Massive gap between text and card, text too large.

```tsx
// BEFORE:
<div className="flex flex-col md:flex-row items-start gap-24">

// AFTER:
<div className="flex flex-col md:flex-row items-start gap-10 md:gap-24">
```

### Right side text

```tsx
// BEFORE:
<p className={`text-2xl text-slate-400 mb-8 ${FONTS.body}`}>Preparing for a specific player?...

// AFTER:
<p className={`text-lg md:text-2xl text-slate-400 mb-6 md:mb-8 ${FONTS.body}`}>Preparing for a specific player?...
```

```tsx
// BEFORE:
<div className="text-amber-200/80 mb-10 text-lg font-medium">

// AFTER:
<div className="text-amber-200/80 mb-6 md:mb-10 text-base md:text-lg font-medium">
```

### Card header padding

```tsx
// BEFORE:
<div className="p-6 md:p-8 pb-0">

// This is already responsive — good.
```

### Order fix — on mobile, show text FIRST, then card:

```tsx
// BEFORE:
<div className="flex-1 relative w-full flex justify-center">
    <GlassCard ...> {/* Opponent card */}
</div>

<div className="flex-1 order-1 md:order-2 flex flex-col justify-center">
    {/* Text content */}
</div>

// AFTER:
<div className="flex-1 relative w-full flex justify-center order-2 md:order-1">
    <GlassCard ...> {/* Opponent card */}
</div>

<div className="flex-1 order-1 md:order-2 flex flex-col justify-center">
    {/* Text content */}
</div>
```

Wait — the current code already has `order-1 md:order-2` on text. The issue is that the card div has no explicit order. Fix:

```tsx
// Card container — add order classes:
<div className="flex-1 relative w-full flex justify-center order-2 md:order-1">
```

This ensures: mobile = text first, card second. Desktop = card left, text right.

---

## Fix 6 — CoachingVsAutoSection.tsx

**Problem (Image 6):** Card title "Coaching Add-On via White Knight Academy" is huge, padding is massive.

```tsx
// BEFORE:
<div className="grid grid-cols-1 md:grid-cols-2 gap-12">

// AFTER:
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
```

### Both cards — reduce padding on mobile:

```tsx
// BEFORE (Automated card):
<div className="p-12 rounded-[3rem] bg-white/5 border border-white/5 text-left opacity-60 ...">

// AFTER:
<div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-white/5 border border-white/5 text-left opacity-60 ...">
```

```tsx
// BEFORE (Coaching card):
<div className="p-12 text-left ring-1 ring-violet-500/50 ... rounded-[3rem] ...">

// AFTER:
<div className="p-6 md:p-12 text-left ring-1 ring-violet-500/50 ... rounded-[2rem] md:rounded-[3rem] ...">
```

### Card titles — smaller on mobile:

```tsx
// BEFORE:
<h3 className={`text-3xl font-bold text-white ${FONTS.h2}`}>Automated Training Apps</h3>

// AFTER:
<h3 className={`text-xl md:text-3xl font-bold text-white ${FONTS.h2}`}>Automated Training Apps</h3>
```

```tsx
// BEFORE:
<h3 className={`text-3xl font-bold text-white ${FONTS.h2}`}>Coaching Add-On via White Knight Academy</h3>

// AFTER:
<h3 className={`text-xl md:text-3xl font-bold text-white ${FONTS.h2}`}>Coaching Add-On via White Knight Academy</h3>
```

### Icon containers and header row:

```tsx
// BEFORE:
<div className="flex items-center gap-6 mb-10">
    <div className="w-16 h-16 rounded-2xl ...">

// AFTER:
<div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-10">
    <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl ...">
```

Apply this to BOTH cards (Automated and Coaching).

### List items — smaller text:

```tsx
// BEFORE:
<ul className={`space-y-8 text-slate-400 text-xl ${FONTS.body}`}>

// AFTER:
<ul className={`space-y-4 md:space-y-8 text-slate-400 text-base md:text-xl ${FONTS.body}`}>
```

```tsx
// BEFORE (Coaching list):
<ul className={`space-y-8 text-slate-200 font-medium text-xl ${FONTS.body}`}>

// AFTER:
<ul className={`space-y-4 md:space-y-8 text-slate-200 font-medium text-base md:text-xl ${FONTS.body}`}>
```

### Section header text:

```tsx
// BEFORE:
<p className={`text-xl text-slate-400 max-w-2xl mx-auto mb-20 ${FONTS.body}`}>

// AFTER:
<p className={`text-base md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 md:mb-20 ${FONTS.body}`}>
```

### Coaching section CTA:

```tsx
// BEFORE:
<div className="mt-12 text-center">

// AFTER:
<div className="mt-8 md:mt-12 text-center">
```

---

## Fix 7 — PricingSection.tsx

**Problem (Image 7):** "RECOMMENDED" badge position overlaps title.

```tsx
// BEFORE:
<h2 className={`${FONTS.h1} text-center text-white mb-24`}>Simple Pricing</h2>

// AFTER:
<h2 className={`${FONTS.h1} text-center text-white mb-12 md:mb-24`}>Simple Pricing</h2>
```

```tsx
// BEFORE:
<div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">

// AFTER:
<div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 items-center mb-12 md:mb-24">
```

### Basic plan card:

```tsx
// BEFORE:
<div className="p-12 rounded-[3rem] bg-white/5 border border-white/5 text-slate-300">

// AFTER:
<div className="p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] bg-white/5 border border-white/5 text-slate-300">
```

```tsx
// BEFORE:
<div className="text-6xl font-bold text-white mb-4 font-display">Free</div>

// AFTER:
<div className="text-4xl md:text-6xl font-bold text-white mb-4 font-display">Free</div>
```

```tsx
// BEFORE:
<ul className={`space-y-6 mb-12 text-lg ${FONTS.body}`}>

// AFTER:
<ul className={`space-y-4 md:space-y-6 mb-8 md:mb-12 text-base md:text-lg ${FONTS.body}`}>
```

### Pro plan card:

```tsx
// BEFORE:
<GlassCard className="p-14 ring-1 ...">

// AFTER:
<GlassCard className="p-6 md:p-14 ring-1 ...">
```

```tsx
// BEFORE:
<div className="flex items-baseline gap-3 mb-4"><span className="text-7xl font-bold text-white font-display">€15</span>

// AFTER:
<div className="flex items-baseline gap-3 mb-4"><span className="text-5xl md:text-7xl font-bold text-white font-display">€15</span>
```

```tsx
// BEFORE:
<ul className={`space-y-6 mb-12 text-white font-medium text-lg ${FONTS.body}`}>

// AFTER:
<ul className={`space-y-4 md:space-y-6 mb-8 md:mb-12 text-white font-medium text-base md:text-lg ${FONTS.body}`}>
```

### RECOMMENDED badge — needs margin-top for title on mobile:

```tsx
// BEFORE:
<h3 className={`text-2xl font-bold text-white mb-3 flex items-center gap-3 ${FONTS.h2}`}>Pro

// AFTER:
<h3 className={`text-2xl font-bold text-white mb-3 mt-8 md:mt-0 flex items-center gap-3 ${FONTS.h2}`}>Pro
```

---

## Fix 8 — BeginnersSection.tsx

```tsx
// BEFORE:
<div className="flex flex-col md:flex-row items-center gap-16">

// AFTER:
<div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
```

```tsx
// BEFORE:
<ul className={`space-y-6 text-xl text-slate-300 ${FONTS.body} mb-10`}>

// AFTER:
<ul className={`space-y-4 md:space-y-6 text-base md:text-xl text-slate-300 ${FONTS.body} mb-6 md:mb-10`}>
```

### Card border radius on mobile:

```tsx
// BEFORE:
<div className="relative rounded-[2rem] bg-[#0F1623]/80 ...">

// AFTER:
<div className="relative rounded-[1.5rem] md:rounded-[2rem] bg-[#0F1623]/80 ...">
```

```tsx
// BEFORE:
<div className="relative w-full max-w-[550px] group perspective-1000">
    <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-[2.5rem] ...">

// AFTER:
<div className="relative w-full max-w-[550px] group perspective-1000">
    <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-[1.5rem] md:rounded-[2.5rem] ...">
```

### Chart container — slightly shorter on mobile:

```tsx
// BEFORE:
<div className="relative h-64 w-full mb-10 z-10">

// AFTER:
<div className="relative h-48 md:h-64 w-full mb-8 md:mb-10 z-10">
```

### Bottom stats — smaller text:

```tsx
// BEFORE:
<div className="grid grid-cols-3 gap-2 mt-8 pt-6 border-t border-white/10">

// AFTER:
<div className="grid grid-cols-3 gap-1 md:gap-2 mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10">
```

```tsx
// BEFORE:
<span className="text-2xl font-bold text-white">+800</span>

// AFTER:
<span className="text-xl md:text-2xl font-bold text-white">+800</span>
```

(Apply same pattern to "16" and "24/7" values)

---

## Fix 9 — ResultsSection.tsx

**Problem:** `grid-cols-2` with 5 items means last item is alone and centered weirdly.

```tsx
// BEFORE:
<div className="grid grid-cols-2 md:grid-cols-5 gap-6">

// AFTER:
<div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-6">
```

The 5th item (Rating Trend) will appear alone in its row on mobile. Fix by making it span full width:

Add to the last item:
```tsx
// Wrap the map and add conditional class for the last item:
{metrics.map((metric, i) => (
    <div key={i} className={`bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl flex flex-col items-center gap-3 md:gap-4 hover:bg-white/10 transition-colors ${i === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
```

Note: also reduced padding `p-4 md:p-6` and gap `gap-3 md:gap-4`.

```tsx
// BEFORE:
<p className={`text-xl text-slate-400 mb-16 max-w-3xl mx-auto ${FONTS.body}`}>

// AFTER:
<p className={`text-base md:text-xl text-slate-400 mb-8 md:mb-16 max-w-3xl mx-auto ${FONTS.body}`}>
```

---

## Fix 10 — Footer.tsx

**Problem (Image 8):** App Store buttons overflow on mobile.

```tsx
// BEFORE:
<div className="rounded-[3rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-16 mb-20 ...">

// AFTER:
<div className="rounded-[1.5rem] md:rounded-[3rem] bg-white/5 backdrop-blur-2xl border border-white/10 p-6 md:p-16 mb-10 md:mb-20 ...">
```

```tsx
// BEFORE:
<div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">

// AFTER:
<div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-20 items-center relative z-10">
```

### App Store buttons — stack vertically on mobile:

```tsx
// BEFORE:
<div className="flex gap-6 opacity-30 select-none pointer-events-none grayscale blur-[1px]">

// AFTER:
<div className="flex flex-col sm:flex-row gap-3 sm:gap-6 opacity-30 select-none pointer-events-none grayscale blur-[1px]">
```

### Social icons — smaller on mobile:

```tsx
// BEFORE (SocialButton):
<a ... className="w-14 h-14 rounded-full ...">

// AFTER:
<a ... className="w-12 h-12 md:w-14 md:h-14 rounded-full ...">
```

### Spacing:

```tsx
// BEFORE:
<p className={`text-sm font-bold text-slate-500 mb-8 ${FONTS.label}`}>Download our app in</p>

// AFTER:
<p className={`text-sm font-bold text-slate-500 mb-4 md:mb-8 ${FONTS.label}`}>Download our app in</p>
```

```tsx
// BEFORE:
<div className="mb-16">

// AFTER:
<div className="mb-8 md:mb-16">
```

```tsx
// BEFORE:
<p className={`text-sm font-bold text-slate-500 mb-8 ${FONTS.label}`}>Follow us</p>

// AFTER:
<p className={`text-sm font-bold text-slate-500 mb-4 md:mb-8 ${FONTS.label}`}>Follow us</p>
```

### Bottom bar — footer links wrap:

```tsx
// BEFORE:
<div className="flex gap-8 text-sm text-slate-400">

// AFTER:
<div className="flex flex-wrap gap-4 md:gap-8 text-sm text-slate-400">
```

---

## Fix 11 — FAQSection.tsx

```tsx
// BEFORE:
<h2 className={`${FONTS.h1} text-white mb-16 text-center`}>Frequently Asked Questions</h2>

// AFTER:
<h2 className={`${FONTS.h1} text-white mb-8 md:mb-16 text-center`}>Frequently Asked Questions</h2>
```

```tsx
// BEFORE:
<div className={`border border-white/10 rounded-3xl p-8 ...`}>

// AFTER:
<div className={`border border-white/10 rounded-2xl md:rounded-3xl p-5 md:p-8 ...`}>
```

```tsx
// BEFORE:
<h3 className={`font-bold text-white text-xl ${FONTS.h2} !text-xl`}>{item.q}</h3>

// AFTER:
<h3 className={`font-bold text-white text-base md:text-xl ${FONTS.h2} !text-base md:!text-xl`}>{item.q}</h3>
```

```tsx
// BEFORE:
<p className="text-slate-400 text-lg leading-relaxed pt-2">{item.a}</p>

// AFTER:
<p className="text-slate-400 text-base md:text-lg leading-relaxed pt-2">{item.a}</p>
```

---

## Fix 12 — BecomeCoachSection.tsx

```tsx
// BEFORE:
<p className={`text-xl text-slate-300 mb-12 max-w-2xl mx-auto ${FONTS.body}`}>

// AFTER:
<p className={`text-base md:text-xl text-slate-300 mb-8 md:mb-12 max-w-2xl mx-auto ${FONTS.body}`}>
```

---

## Fix 13 — FONTS.h1 global fix

The `FONTS.h1` constant likely sets a large font size (probably `text-5xl` or similar). If it's defined in `constants/theme.ts`, you should make it responsive there:

```tsx
// In constants/theme.ts, if FONTS.h1 is something like:
h1: 'font-display text-5xl md:text-6xl font-bold tracking-tight'

// Change to:
h1: 'font-display text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight'
```

This single change will fix oversized headings across ALL sections on mobile.

Similarly for `FONTS.h2`:
```tsx
// If currently:
h2: 'font-display text-3xl font-bold tracking-tight'

// Change to:
h2: 'font-display text-2xl md:text-3xl font-bold tracking-tight'
```

**This is the highest-impact single change.** If you only do one thing, do this.

---

## Summary — Priority Order

| Priority | Fix | Impact | Effort |
|----------|-----|--------|--------|
| **1** | **FONTS.h1/h2 in theme.ts** | Fixes ALL headings across site | 1 min |
| **2** | **Section padding (py-40 → py-16 md:py-40)** | Eliminates dead space everywhere | 5 min |
| **3** | **VisualizationSection chart height** | Fixes biggest visual bug (Image 4) | 3 min |
| **4** | **Card padding (p-12 → p-6 md:p-12)** | Fixes Coaching, Pricing, Footer | 5 min |
| **5** | **Body text (text-xl → text-base md:text-xl)** | Proper mobile typography | 10 min |
| **6** | **Gap reduction on mobile** | Tighter spacing | 5 min |
| **7** | **Footer app buttons stack** | Fixes overflow (Image 8) | 2 min |
| **8** | **StatRoseChart container** | Chart fits mobile viewport | 2 min |

**Total estimated time: 30–40 minutes**

---

## Verification Checklist

After applying fixes, test in DevTools responsive mode:

- [ ] **375px** (iPhone SE) — all content visible, no horizontal scroll
- [ ] **425px** (Mobile L) — matches all screenshot fixes
- [ ] **768px** (iPad) — grid layouts transition properly
- [ ] **1024px** (MacBook Air) — no layout breaks
- [ ] **1440px** (Desktop) — unchanged from current

For each screen, verify:
- [ ] No horizontal overflow (check with: `document.documentElement.scrollWidth > window.innerWidth`)
- [ ] All text readable without zooming
- [ ] Touch targets ≥ 44px
- [ ] No massive empty spaces between sections
- [ ] Charts/SVGs don't overflow their containers