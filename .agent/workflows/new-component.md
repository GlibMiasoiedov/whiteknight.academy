---
description: Creates a new UI component following White Knight design conventions
---

# New Component Workflow

## Steps

1. **Read skills first**:
   - Read the `design-system` skill for color/typography tokens
   - Read the `component-patterns` skill for Card, Button, Badge templates

2. **Create component file**:
   - Path: `analytics-app/src/components/<domain>/ComponentName.tsx`
   - Use the template from `.agent/skills/component-patterns/templates/component-template.tsx`
   - Structure: imports → interface → component → export default

3. **Apply typography tokens**:
   - Widget headers: `DASHBOARD_FONTS.widgetTitle`
   - Labels: `DASHBOARD_FONTS.label`
   - Landing headings: `FONTS.h1` / `FONTS.h2`
   - Never inline font sizes when a token exists

4. **Apply hover effects**:
   - Read the `hover-and-interactions` skill
   - Cards: `hover:-translate-y-1 hover:shadow-xl transition-all duration-300`
   - Glow effects: use `.hover-glow-*-strong` CSS classes, NEVER inline `hover:shadow-[...]`
   - Buttons: `hover:-translate-y-0.5` + appropriate glow class

5. **Apply responsive layout**:
   - Read the `responsive-layout` skill
   - Use responsive padding: `px-4 md:px-6`
   - Test at 1024px, 1280px, 1440px+ breakpoints
   - `backdrop-blur` elements: `hidden md:block`

6. **Verify**:
   - Run `npm run build`
   - Read the `accessibility-qa` skill → run pre-deploy checklist
   - Check component is under ~300 lines
