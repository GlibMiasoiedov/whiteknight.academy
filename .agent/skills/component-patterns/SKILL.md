---
name: component-patterns
description: >
  Templates and conventions for UI components in the White Knight Analytics
  dashboard, including Card, Button, Badge, widget cards, data tables, and
  input styles. Use when creating new components, widgets, or dashboard sections.
---

# Component Patterns

## Card Component

Location: `src/components/ui/Card.tsx`

```tsx
// Source: src/components/ui/Card.tsx (full component)
interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: string;        // <-- ALWAYS pass padding as prop
    onClick?: React.MouseEventHandler<HTMLDivElement>;
    active?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className = '', padding = 'p-6', onClick, active }) => (
    <div
        onClick={onClick}
        className={`
      relative rounded-xl border bg-[#0F1623] transition-all duration-300 group
      ${active ? 'border-white/20 ring-1 ring-white/10' : 'border-white/5 hover:border-white/10'}
      ${padding} ${className} ${onClick ? 'cursor-pointer hover:shadow-xl hover:bg-[#131C2D]' : ''}
    `}
    >
        <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
        {children}
    </div>
);
```

### Padding Rule

Pass `padding` as a prop, NEVER override via `className="p-0"`:

```tsx
// ✅ Correct
<Card padding="p-0">

// ❌ Wrong — Tailwind does NOT guarantee override order
<Card className="p-0">
```

## Button Component

Location: `src/components/ui/Button.tsx`

```tsx
// Source: src/components/ui/Button.tsx:4-9
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'gradient';
    fullWidth?: boolean;
    icon?: LucideIcon;
    themeColor?: string;     // hex from THEMES[section].color
    size?: 'xs' | 'sm' | 'md' | 'lg';
}
```

Size map:
- `xs`: `h-7 px-2 text-[10px]`
- `sm`: `h-8 px-3 text-xs`
- `md`: `h-10 px-4 text-sm` (default)
- `lg`: `h-12 px-6 text-base`

Variant `'primary'` uses `themeColor` for background + glow shadow. Default = `#8B5CF6` (violet).

## Widget Card Template

The standard structure for report widgets. Copy this pattern for new widgets:

```tsx
// Source: src/components/report/widgets/TopOpponentsList.tsx:29-50
const MyWidget: React.FC<MyWidgetProps> = ({ onHint }) => {
    return (
        <Card padding="p-0" className="bg-gradient-to-br from-[#0F1623] to-[#0B1220] border-white/5 hover:-translate-y-1 hover:shadow-xl transition-all duration-300">
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Users size={16} className="text-violet-400" />
                    <div className={DASHBOARD_FONTS.widgetTitle}>Widget Title</div>
                </div>
                {onHint && (
                    <button
                        onClick={onHint}
                        className="px-3 py-1 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white border border-emerald-500/30 text-[10px] rounded uppercase tracking-wider font-bold transition-all hover:-translate-y-0.5 hover-glow-emerald-strong flex items-center gap-1.5"
                    >
                        <Sparkles className="w-3 h-3" /> Insights
                    </button>
                )}
            </div>
            {/* Content */}
            <div className="p-6">
                {/* Widget content here */}
            </div>
        </Card>
    );
};
```

### Checklist for new widgets:
- [ ] `<Card padding="p-0">` with gradient bg
- [ ] Header: `px-6 py-5 border-b border-white/5`
- [ ] Icon: Lucide icon, `size={16}`, section theme color
- [ ] Title: `DASHBOARD_FONTS.widgetTitle`
- [ ] Insights button: section theme color (report = emerald)
- [ ] `hover:-translate-y-1 hover:shadow-xl transition-all duration-300`
- [ ] `relative overflow-hidden group` if ambient glow needed
- [ ] Insights button includes `<Sparkles className="w-3 h-3" />` icon
- [ ] Add entry to `WIDGET_HINTS` in `RightPanel.tsx` (title, desc, weakness, strength, training)

## Input Styles — Conscious Choice

Three different input styles exist and this is INTENTIONAL:

| Context | Style | Source |
|---------|-------|--------|
| Dashboard (wizard/modal) | `bg-[#0A0E18] border-white/10 rounded-lg` | `ManualInputsModal.tsx`, `OnboardingWizard.tsx` |
| Landing (registration) | `bg-white/5 border-white/10 rounded-xl` + focus ring | `RegistrationModal.tsx` |
| Checkout | `bg-[#11131F] border-white/5 rounded-xl` | `CheckoutPage.tsx` |

Do NOT try to unify these.

## Insights State Pattern

When activating a new widget hint, ALWAYS clear the previous active state:

```tsx
// Source: DashboardLayout.tsx — insights handler pattern
const handleWidgetHint = (hint: string) => {
    setReportActiveSlice(null);  // Clear radar slice first
    setWidgetHint(hint);
};
```

This prevents the Radar slice and widget hints from conflicting.

## Component File Structure

Every component follows this order:

```tsx
// 1. Imports
import React from 'react';
import { Sparkles } from 'lucide-react';
import Card from '../../ui/Card';
import { DASHBOARD_FONTS } from '../../../constants/theme';

// 2. Interface
interface MyComponentProps {
    data: SomeType;
    onAction?: () => void;
}

// 3. Component
const MyComponent: React.FC<MyComponentProps> = ({ data, onAction }) => {
    return (/* JSX */);
};

// 4. Export
export default MyComponent;
```
