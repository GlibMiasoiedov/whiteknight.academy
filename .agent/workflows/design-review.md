---
description: Audits a component or page for design consistency, hover effects, responsive behavior, and accessibility
---

# Design Review Workflow

## Steps

1. **Color & Typography Audit**:
   - Read the `design-system` skill
   - Verify colors match `THEMES[section]` palette
   - Verify typography uses `DASHBOARD_FONTS` or `FONTS` tokens (no inline overrides)
   - Check tooltips use dark theme
   - Check no checkout-only colors leaked into dashboard

2. **Component Structure Audit**:
   - Read the `component-patterns` skill
   - Verify Card uses `padding` prop (not className override)
   - Verify widget headers follow the standard template (icon + widgetTitle + Insights)
   - Verify Insights buttons use section theme color
   - Verify component is under ~300 lines

3. **Hover & Interaction Audit**:
   - Read the `hover-and-interactions` skill
   - Verify NO inline `hover:shadow-[...]` — must use CSS classes
   - Verify all widget cards have `hover:-translate-y-1`
   - Verify transitions use correct durations (cards: 300ms, WDL bars: 1000ms)

4. **Responsive Audit**:
   - Read the `responsive-layout` skill
   - Check behavior at 1024px, 1280px, 1440px+
   - Check `backdrop-blur` is hidden on mobile
   - Check SVG charts have `max-w` + `aspect-square` container
   - Check grid layouts use `auto-cols-fr` (no fixed pixel cells)

5. **Full QA Checklist**:
   - Read the `accessibility-qa` skill
   - Run all checklists (pre-deploy, visual, responsive, state, post-deploy)

6. **Generate Report**:
   - Document findings as a markdown artifact
   - Group by severity: 🔴 Critical, 🟡 Should fix, 🔵 Cosmetic
   - Include file:line references for each finding
