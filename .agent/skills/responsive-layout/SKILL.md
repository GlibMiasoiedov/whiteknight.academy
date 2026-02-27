---
name: responsive-layout
description: >
  Breakpoint conventions, responsive grid patterns, mobile adaptations, and
  layout rules for the White Knight Analytics dashboard. Covers sidebar collapse,
  right panel drawer, MobileGate, and landing page responsive behavior.
  Use when working on responsive layouts or mobile-specific changes.
---

# Responsive Layout

## Breakpoints

| Breakpoint | Width     | Dashboard behavior                    |
|------------|-----------|---------------------------------------|
| `<1024px`  | mobile    | `MobileGate` blocks dashboard access  |
| `lg`       | 1024px    | Sidebar collapsed, RightPanel = drawer |
| `xl`       | 1280px    | RightPanel visible                    |
| `2xl`      | 1440px    | Full 3-column: Sidebar + Center + Right |

Landing page uses standard Tailwind breakpoints: `sm:640`, `md:768`, `lg:1024`, `xl:1280`.

## Dashboard Layout Structure

```
┌──────────┬────────────────────────┬───────────┐
│ Sidebar  │    CenterColumn        │ RightPanel│
│ 260px    │    flex-1              │ 340px     │
│ z-50     │                        │ z-50      │
│ fixed    │                        │ fixed     │
└──────────┴────────────────────────┴───────────┘
```

```tsx
// Source: src/components/layout/Sidebar.tsx:44
<div className={`fixed top-0 left-0 h-screen w-[260px] ... z-50 bg-[#080C14]
  transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
  2xl:translate-x-0`}>

// Source: src/components/layout/RightPanel.tsx:158
<aside className={`w-[280px] lg:w-[340px] bg-[#080C14] ... fixed right-0 top-0
  h-screen ... z-50 transition-transform duration-300
  ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}`}>
```

### Enrollment page exception
On `/dashboard/coaching/enroll`, the RightPanel is part of the page layout (not the global panel), and CenterColumn takes full width.

## Navigation — ALWAYS Flexbox

Navbar MUST use Flexbox layout. NEVER use absolute positioning for navigation items.
This project went through 9 iterations fixing a navbar that used absolute positioning.

```tsx
// ✅ Correct — Flexbox
<nav className="flex items-center justify-between">

// ❌ Wrong — Absolute positioning
<nav className="relative">
  <div className="absolute right-0">
```

## Menu Toggle Button

The sidebar toggle uses a CSS class for reliable edge-attached hover:

```tsx
// Source: src/DashboardLayout.tsx:171
<button className={`menu-edge-btn 2xl:hidden z-[60] fixed top-1/2 -translate-y-1/2 left-0
  backdrop-blur-md rounded-r-2xl ... ${isLeftSidebarOpen ? 'opacity-0 pointer-events-none -translate-x-full' : ''}`}>
```

## Mobile Text Line Breaks

To force heading text onto specific lines on mobile, use `<br>` with responsive visibility:

```tsx
// ✅ Correct
<h1>Your Chess<br className="md:hidden" /> Performance Report</h1>
```

## Mobile Performance

Heavy visual effects must be hidden on mobile to prevent GPU overload:

```tsx
// backdrop-blur elements — hide on mobile
<div className="hidden md:block absolute inset-0 blur-[120px] ...">
```

The project had white/black screen issues on mobile Safari caused by too many `backdrop-blur` elements.

## Grid Layouts (Heatmaps, Calendar)

For responsive grid-based visualizations, use CSS Grid with `auto-cols-fr`.
NEVER use fixed pixel sizes for grid cells:

```tsx
// ✅ Correct — responsive grid
<div className="grid grid-flow-col auto-cols-fr grid-rows-7 gap-[2px]">

// ❌ Wrong — fixed pixels collapse on narrow screens  
<div className="flex gap-1">
  <div className="w-3 h-3">
```

Percentage-based label positioning:
```tsx
// Month labels — percentage of total width
style={{ left: `${(weekIndex / totalWeeks) * 100}%` }}
```

## SVG Chart Containers

SVG charts MUST be wrapped in a container with max-width and aspect ratio:

```tsx
// Source: ReportDashboard.tsx — Performance Radar container
<div className="max-w-[440px] aspect-square mx-auto">
  <StatRoseChart ... />
</div>
```

Without this constraint, SVGs expand infinitely on large screens.

## RightPanel Backdrop (mobile drawer)

When RightPanel opens as a drawer on mobile, it shows a backdrop:

```tsx
// Source: src/components/layout/RightPanel.tsx:153
<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[45] lg:hidden"
     onClick={onClose} />
```
