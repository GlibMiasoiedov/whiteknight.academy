---
name: accessibility-qa
description: >
  Quality assurance checklists, pre-deploy verification steps, and accessibility
  guidelines for the White Knight Analytics dashboard. Use before deploying
  changes or when reviewing code quality.
---

# Accessibility & QA

## Pre-Deploy Checklist

Run through these checks before every `npm run build` + deploy:

### Build
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] No console warnings about missing keys or deprecated APIs

### Tailwind
- [ ] Class strings have NO spaces inside class names (e.g. `w-full` not `w - full`)
- [ ] No inline `hover:shadow-[...]` for glow effects — use CSS classes from `index.css`

### z-index
- [ ] New modals use `z-[60]` or higher
- [ ] No new `z-[9999]` or `z-[99999]` values introduced
- [ ] Target hierarchy: badge `z-10` → sidebar `z-40` → panel `z-50` → modals `z-[60]` → critical `z-[200]`

### Component Size
- [ ] No component exceeds ~300 lines
- [ ] Large components split into sub-components (check for files >300 lines)

## Visual QA Checklist

### Widgets
- [ ] All widget cards have `hover:-translate-y-1`
- [ ] Widget title uses `DASHBOARD_FONTS.widgetTitle`
- [ ] Insights buttons use section theme color (report = emerald, coaching = amber)
- [ ] Insights buttons have `flex items-center gap-1.5`

### Tooltips
- [ ] Dark theme: `bg-[#0F1623]/95 backdrop-blur-md text-white`
- [ ] No white/light tooltips in dashboard

### Icons
- [ ] Only Lucide React icons used — no emoji in UI elements
- [ ] Icons use section theme color (e.g. `text-emerald-400` for report)

### Colors
- [ ] Primary action buttons match section theme from `THEMES` object
- [ ] Card backgrounds use standard gradient: `from-[#0F1623] to-[#0B1220]`
- [ ] No hardcoded checkout-page colors (`#05060B`, `#1A1D2B`) leaking into dashboard

## Responsive QA Checklist

### Dashboard (requires desktop)
- [ ] **1024px** (lg): Sidebar collapsed, RightPanel as drawer. Content not clipped
- [ ] **1280px** (xl): RightPanel visible. No horizontal overflow
- [ ] **1440px+** (2xl): Full 3-column layout. Sidebar auto-visible
- [ ] **<1024px**: MobileGate shows "Desktop Required" message

### Landing Page
- [ ] **425px** (mobile): Text readable, no horizontal scroll
- [ ] **768px** (md): Sections stack properly
- [ ] **1024px** (lg): Full desktop layout active
- [ ] `backdrop-blur` elements hidden on mobile (`hidden md:block`)

## State Management QA

- [ ] Opening widget Insights clears previous Radar slice state
- [ ] Modals render above RightPanel (z-index ≥ 60)
- [ ] Modal backdrop covers full viewport including side panels
- [ ] Closing modal restores scroll (no body scroll lock leftover)

## Post-Deploy

- [ ] Verify changes on https://analytics.whiteknight.academy (clear cache / use vN.html)
- [ ] Commit and push to GitHub after milestone
- [ ] Version badge in DashboardLayout shows updated version

## Accessibility Basics

- [ ] All interactive elements are keyboard-focusable
- [ ] Color contrast: text on dark backgrounds ≥ 4.5:1 ratio
- [ ] Buttons have descriptive text (not just icons without labels)
- [ ] Form inputs have associated labels or aria-label
