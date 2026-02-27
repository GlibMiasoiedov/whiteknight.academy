# Antigravity Agent Configuration

AI agent configuration for the [White Knight Academy](https://analytics.whiteknight.academy) chess analytics dashboard.

## Structure

```
GEMINI.md           ← Always-active rules (language, code style, critical rules)
.agent/
├── skills/         ← On-demand knowledge (read when relevant task detected)
│   ├── design-system/           Colors, fonts, shadows, gradients
│   ├── component-patterns/      Card, Button, Badge, widget templates
│   ├── hover-and-interactions/  Hover glow, transitions, animations
│   ├── responsive-layout/       Breakpoints, grids, mobile adaptations
│   ├── backend-ready-code/      Mock data, TODO markers, API stubs
│   └── accessibility-qa/        Pre-deploy checklists, QA guidelines
├── workflows/      ← Step-by-step procedures
│   ├── new-component.md         Scaffold a new component
│   ├── new-section.md           Scaffold a dashboard/landing section
│   ├── design-review.md         Audit design consistency
│   ├── deploy.md                Build + FTP deploy
│   ├── sync-content.md          Sync WordPress content
│   └── sync-theme.md            Sync WordPress theme
└── config.ps1      ← PowerShell environment config
```

## Skills

| Skill | Triggers on | Key content |
|-------|------------|-------------|
| `design-system` | Colors, fonts, backgrounds, styling | `THEMES` object, `FONTS`/`DASHBOARD_FONTS` tokens, background hex map, border-radius table |
| `component-patterns` | Creating components, widgets, cards, buttons | Card API (`padding` prop), Button variants, widget card template, input style rules |
| `hover-and-interactions` | Hover effects, glow, animations, transitions | CSS glow classes (`hover-glow-*-strong`), transition durations, CSS specificity rules |
| `responsive-layout` | Responsive, mobile, breakpoints, layout | Dashboard 3-column layout, MobileGate, sidebar collapse, grid patterns, SVG sizing |
| `backend-ready-code` | Mock data, TODO comments, API integration | Mock data location, `TODO(backend):` format, hook stubs, `wk_` localStorage keys |
| `accessibility-qa` | Deploy, review, QA, testing | Pre-deploy checklist, visual QA, responsive QA, state management QA |

## Workflows

| Command | Purpose |
|---------|---------|
| `/new-component` | Creates a component following design system conventions |
| `/new-section` | Scaffolds a full dashboard tab or landing section with routing |
| `/design-review` | Audits a component/page against all design rules |
| `/deploy` | Builds and deploys to analytics.whiteknight.academy |

## How to Update

### Add a new color to the palette
1. Add to `THEMES` in `src/constants/theme.ts`
2. Update `design-system/SKILL.md` → Section Theme Colors
3. Add `.hover-glow-NAME-strong` class to `src/index.css`
4. Update `hover-and-interactions/SKILL.md` → CSS Glow Classes

### Add a new component pattern
1. Add the pattern to `component-patterns/SKILL.md`
2. Include real code example with `// Source:` reference
3. Update the template in `templates/component-template.tsx` if needed

### Add a new rule
1. Decide scope: universal (GEMINI.md) vs domain-specific (skill)
2. Add one-line rule to GEMINI.md only if it applies to EVERY request
3. Add detailed explanation with examples to the relevant skill

### Add a new skill
1. Create `.agent/skills/skill-name/SKILL.md`
2. Add YAML frontmatter with `name` and `description`
3. Write detailed instructions with real code examples
4. Update this README

## Origin

This configuration was derived from:
- **Design audit** of all project components (colors, fonts, spacing, hover effects)
- **Inconsistency analysis** identifying 33+ design deviations
- **Chat history audit** of 50+ design iterations across 7+ conversations
- **23 rules** extracted from hours of debugging and iteration
