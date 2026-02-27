---
name: hover-and-interactions
description: >
  Hover effects, glow animations, transitions, and interactive states for the
  White Knight Analytics dashboard. CRITICAL: complex hover shadows MUST use CSS
  classes from index.css, never inline Tailwind arbitrary values. Use when adding
  hover effects, glow states, click feedback, or animated transitions.
---

# Hover & Interactions

## 🔴 Critical Rule — CSS Glow Classes

Tailwind CSS v4 JIT **drops complex `hover:shadow-[...]` arbitrary values** silently.
This has caused 6+ iterations of invisible hover effects in this project.

### NEVER do this:
```tsx
// ❌ BROKEN — Tailwind JIT drops this class silently
className="hover:shadow-[0_0_20px_rgba(139,92,246,0.3)]"
```

### ALWAYS use CSS classes from `index.css`:

```css
/* Source: src/index.css:188-234 */

.hover-glow-amber-strong {
  transition: all 0.3s ease;
}
.hover-glow-amber-strong:hover {
  box-shadow: 0 0 35px rgba(245, 158, 11, 0.6) !important;
  transform: translateY(-2px);
  border-color: rgba(245, 158, 11, 0.6) !important;
}

.hover-glow-violet-strong {
  transition: all 0.3s ease;
}
.hover-glow-violet-strong:hover {
  box-shadow: 0 0 35px rgba(139, 92, 246, 0.6) !important;
  transform: translateY(-2px);
  border-color: rgba(139, 92, 246, 0.6) !important;
}

.hover-glow-emerald-strong {
  transition: all 0.3s ease;
}
.hover-glow-emerald-strong:hover {
  box-shadow: 0 0 35px rgba(16, 185, 129, 0.6) !important;
  transform: translateY(-2px);
  border-color: rgba(16, 185, 129, 0.6) !important;
}

.hover-glow-red-strong {
  transition: all 0.3s ease;
}
.hover-glow-red-strong:hover {
  box-shadow: 0 0 35px rgba(239, 68, 68, 0.6) !important;
  transform: translateY(-2px);
  border-color: rgba(239, 68, 68, 0.6) !important;
}

.hover-glow-white-strong:hover {
  box-shadow: 0 0 30px rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-2px);
  background-color: rgba(255, 255, 255, 0.12) !important;
  border-color: rgba(255, 255, 255, 0.25) !important;
}
```

### Adding a new glow color

Add a new class to `src/index.css` following this template:
```css
.hover-glow-NEW-strong {
  transition: all 0.3s ease;
}
.hover-glow-NEW-strong:hover {
  box-shadow: 0 0 35px rgba(R, G, B, 0.6) !important;
  transform: translateY(-2px);
  border-color: rgba(R, G, B, 0.6) !important;
}
```

## Card Hover Patterns

### Standard Card (with onClick)
Built into `Card.tsx` automatically when `onClick` is present:
```
hover:shadow-xl hover:bg-[#131C2D] cursor-pointer
```

### Widget Card (report widgets)
Applied manually via className:
```tsx
// Source: src/components/report/widgets/TopOpponentsList.tsx:31
<Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
```
All 6 widget cards MUST have `hover:-translate-y-1`.

### Premium CTA Card
Uses CSS glow class + lift:
```tsx
className="hover-glow-violet-strong hover:-translate-y-1"
```

## Button Hover Patterns

### Insights Buttons (report section — emerald)
```tsx
// Source: src/components/report/widgets/TopOpponentsList.tsx:41
className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white
  border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold
  transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5"
```

### CTA Buttons (coaching section — amber)
```tsx
className="hover-glow-amber-strong hover:scale-[1.02]"
```

## Transition Durations

| Element       | Duration       | Source |
|---------------|----------------|--------|
| Cards         | `duration-300` | All cards |
| WDL bars      | `duration-1000` | `TimeControlsTable.tsx`, `MostPlayedOpenings.tsx` |
| Tooltips      | `duration-200` | `animate-in fade-in duration-200` |
| Modals        | `duration-200` | `animate-in fade-in duration-200` |
| Buttons       | `duration-200` | `Button.tsx:25` |

WDL bars MUST all use `duration-1000`. If inconsistent, fix to 1000ms.

## Tab Hover

Sub-navigation tabs use CSS classes (not inline Tailwind) for reliable hover:

```css
/* Source: src/index.css — .tab-inactive class */
```

Active tab styling = inline `style` with `THEMES[section].color`.
Inactive tab hover = `.tab-inactive` CSS class.

## CSS Specificity

When changing a wrapper's text color (e.g. from `text-slate-300` to `text-white`),
check for inner elements that may have their own `text-*` class overriding the parent.
Remove inner overrides to let the wrapper's color cascade properly.

## Focus States

Standard input focus:
```
focus:border-violet-500 outline-none
```
