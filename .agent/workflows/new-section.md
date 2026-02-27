---
description: Scaffolds a new dashboard section or landing page section with routing, layout, and theme support
---

# New Section Workflow

## Steps

1. **Determine section type**: dashboard tab or landing section

2. **Read skills**:
   - Read the `design-system` skill → identify section theme from `THEMES` object
   - Read the `component-patterns` skill → use widget card template
   - Read the `responsive-layout` skill → plan breakpoint behavior

3. **For Dashboard section**:
   - Add route in `App.tsx` (lazy-loaded)
   - Add tab entry in `DashboardLayout.tsx` → `TAB_MAP`
   - Add sidebar navigation entry in `Sidebar.tsx`
   - Create main component in `src/components/<section>/`
   - Use section theme color for primary buttons: `themeColor={THEMES[section].color}`
   - Wire up RightPanel contextual insights if needed

4. **For Landing section**:
   - Create in `src/components/landing/SectionName.tsx`
   - Lazy-load in `LandingPage.tsx` via `React.lazy`
   - Use standard section padding: `px-6 md:px-14 lg:px-16 xl:px-24`
   - Use `FONTS.*` tokens (not `DASHBOARD_FONTS`)

5. **Apply hover and interactions**:
   - Read the `hover-and-interactions` skill
   - Cards: CSS glow classes for premium feel
   - CTAs: section-themed glow + scale

6. **Implement responsive behavior**:
   - Read the `responsive-layout` skill
   - Dashboard: test at lg, xl, 2xl breakpoints
   - Landing: test at 425px, 768px, 1024px

7. **Build and verify**:
   - Run `npm run build`
   - Read the `accessibility-qa` skill → run checklists
   - Deploy via `/deploy` workflow
