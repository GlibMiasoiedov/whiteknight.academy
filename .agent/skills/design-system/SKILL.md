---
name: design-system
description: >
  Defines the color palette, typography tokens (FONTS, DASHBOARD_FONTS), shadows,
  gradients, border-radius, and section theme conventions for the White Knight
  Analytics dashboard. Use when creating or modifying UI elements that involve
  colors, fonts, backgrounds, borders, or visual styling.
---

# Design System

Reference: read [THEME_TOKENS.md](references/THEME_TOKENS.md) for the full copy of `theme.ts`.

## Section Theme Colors

Every section has a distinct accent via the `THEMES` object in `theme.ts`:

```typescript
// Source: src/constants/theme.ts:1-7
export const THEMES = {
    home:         { color: '#8B5CF6', label: 'Violet',  bg: 'bg-violet-500',  text: 'text-violet-400'  },
    report:       { color: '#10B981', label: 'Emerald', bg: 'bg-emerald-500', text: 'text-emerald-400' },
    coaching:     { color: '#F59E0B', label: 'Amber',   bg: 'bg-amber-500',   text: 'text-amber-400'   },
    training:     { color: '#06B6D4', label: 'Cyan',    bg: 'bg-cyan-500',    text: 'text-cyan-400'    },
    integrations: { color: '#EC4899', label: 'Pink',    bg: 'bg-pink-500',    text: 'text-pink-400'    },
};
```

**Rule:** Primary action buttons in a section use `themeColor={THEMES[section].color}`.
For example, the Insights buttons in report widgets use emerald, not violet.

## Background Colors

| Token                  | Hex       | Used for                          |
|------------------------|-----------|-----------------------------------|
| App background         | `#080C14` | Body, main `bg-[#080C14]`        |
| Card bg (from)         | `#0F1623` | `Card.tsx` default, tooltip bg    |
| Card gradient (to)     | `#0B1220` | Widget card gradient end          |
| Card hover bg          | `#131C2D` | `Card.tsx` `hover:bg-[#131C2D]`  |
| Sidebar/RightPanel bg  | `#080C14` | Same as app bg                    |

### One-off page colors (conscious choice)

`PaymentSuccessPage` and `CheckoutPage` use unique backgrounds (`#05060B`, `#11131F`, `#0B0E14`, `#1A1D2B`).
These are intentionally different from the dashboard palette. Do NOT copy them into dashboard widgets.

## Typography

### Landing Page Tokens (`FONTS`)

```typescript
// Source: src/constants/theme.ts:9-16
FONTS.h1:    'font-display text-3xl md:text-5xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-white'
FONTS.h2:    'font-display text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-semibold tracking-tight text-white'
FONTS.label: 'font-body text-xs md:text-sm font-bold text-slate-400 uppercase tracking-wider'
FONTS.body:  'font-body text-base md:text-xl font-medium text-slate-400 leading-relaxed'
FONTS.kpi:   'font-display text-4xl md:text-6xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-white'
FONTS.logo:  'font-display text-2xl md:text-3xl font-bold tracking-tight text-white'
```

If `FONTS.h2` is too large — do NOT override with `!important`. Instead create `FONTS.h3` or use inline classes directly.

### Dashboard Tokens (`DASHBOARD_FONTS`)

```typescript
// Source: src/constants/theme.ts:19-29
DASHBOARD_FONTS.h1:          'font-display text-xl xl:text-2xl font-bold tracking-tight text-white'
DASHBOARD_FONTS.h2:          'font-display text-lg xl:text-xl font-semibold tracking-tight text-white'
DASHBOARD_FONTS.h3:          'font-display text-base xl:text-lg font-semibold text-white'
DASHBOARD_FONTS.widgetTitle: 'font-body text-[11px] md:text-xs xl:text-sm font-bold text-white uppercase tracking-wider'
DASHBOARD_FONTS.label:       'font-body text-[10px] xl:text-xs font-bold text-slate-400 uppercase tracking-wider'
DASHBOARD_FONTS.body:        'font-body text-sm font-medium text-slate-400 leading-relaxed'
DASHBOARD_FONTS.kpi:         'font-display text-2xl xl:text-3xl font-extrabold tracking-tight text-white'
DASHBOARD_FONTS.small:       'font-body text-xs text-slate-500'
```

**Rule:** New widget headers MUST use `DASHBOARD_FONTS.widgetTitle`. Labels use `DASHBOARD_FONTS.label`.

### Font Families

- **Display** (`font-display`): Unbounded — headings, KPIs, logos
- **Body** (`font-body`): Manrope — labels, body text, UI elements

## Border Radius

| Element            | Class          | Source                       |
|--------------------|----------------|------------------------------|
| Card.tsx default   | `rounded-xl`   | `src/components/ui/Card.tsx:15` |
| Buttons (standard) | `rounded-xl`   | `src/components/ui/Button.tsx:25` |
| Buttons (pill)     | `rounded-full`  | Insights, icon-only buttons  |
| Landing sections   | `rounded-2xl`  | Large containers, feature cards |
| Inputs             | `rounded-lg`   | Form fields                  |
| Tooltips           | `rounded-lg`   | Dashboard tooltips           |

## Shadows

- **Card hover**: `hover:shadow-xl` (built into `Card.tsx` when `onClick` present)
- **Widget cards**: `hover:shadow-xl` (explicit in className)
- **Premium cards**: Use CSS classes from `index.css` (see `hover-and-interactions` skill)
- **Buttons**: Primary buttons get `boxShadow: '0 0 20px -5px ${color}80'` via inline style

## Gradients

### Card Background Gradient
```
bg-gradient-to-br from-[#0F1623] to-[#0B1220]
```
Used by all 6 report widget cards. Applied via className on `<Card>`, overriding the default `bg-[#0F1623]`.

### Text Gradients
```
bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent
```
Used for section title accent words (e.g. "Performance **Report**").

## Tooltips

All tooltips use dark theme:
```
bg-[#0F1623]/95 backdrop-blur-md text-white border border-emerald-500/30 rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.2)]
```
- Title text: `text-white`
- Secondary text: `text-slate-300`

Do NOT use white/light tooltips. The codebase previously had a white tooltip in `ActivityHeatmap` which was migrated to dark.

## Icons

- **Primary**: Lucide React (`lucide-react`) — use for ALL UI icons
- **Custom SVG**: `src/components/ui/Icons.tsx` — contains `GoogleIcon` and `AppleIcon` for social login buttons only
- **NEVER**: emoji in UI elements (exception: chess piece symbols ♟ as text content in filter labels, not as icon substitutes)
