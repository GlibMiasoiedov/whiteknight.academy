---
name: data-mixer
description: Design patterns and conventions for the Data Mixer page, source-aware components (SourceCard, SourceDots), and multi-source color system. Use when adding widgets to the Data Mixer page or working with multi-source data visualization.
---

# Data Mixer — Skill Guide

## Overview

The **Data Mixer** (`/dashboard` → "Data Mixer" tab) allows users to aggregate chess data from multiple platforms (Chess.com, Lichess, PGN files) and view them together or separately.

Active file: `analytics-app/src/components/pages/DataMixerPage.tsx`

---

## Theme Color

```typescript
// theme.ts
mixer: { color: '#A855F7', label: 'Purple', bg: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500/20' }
```

When theming Data Mixer elements:
- Primary accent: `#A855F7` (purple)
- Subtle backgrounds: `bg-purple-500/10`, `bg-purple-500/5`
- Borders: `border-purple-500/20`, `border-purple-500/30`
- Text: `text-purple-300`, `text-purple-400`
- Glows/shadows: `shadow-[0_0_20px_rgba(168,85,247,0.3)]`

---

## Source Color System

Defined in `src/components/ui/SourceDots.tsx`:

```typescript
const SOURCE_META = {
  'chess.com': { color: '#7FA650', label: 'Chess.com' },
  'lichess':   { color: '#E8E8E8', label: 'Lichess' },
  'pgn':       { color: '#60A5FA', label: 'PGN' },
};
```

**Rule:** Never use arbitrary colors for source indicators — always reference `SOURCE_META`.

---

## Component: SourceDots

File: `src/components/ui/SourceDots.tsx`

Minimal glowing dot row showing which data sources back a widget or table row.

```tsx
import SourceDots from '../ui/SourceDots';
import type { DataSource } from '../ui/SourceDots';

// In widget header:
<SourceDots
  sources={['chess.com', 'lichess']}  // what this widget contains
  activeSources={activeSources}        // from page state
/>

// In table row (smaller dots):
<SourceDots sources={row.sources} activeSources={activeSources} size={5} />
```

**Props:**
- `sources: DataSource[]` — sources this element covers
- `activeSources: DataSource[]` — currently enabled by user
- `size?: number` — dot diameter in px (default: 6)

---

## Component: SourceCard

File: `src/components/ui/SourceCard.tsx`

Togglable card representing a data source (Chess.com / Lichess / PGN).

```tsx
import SourceCard, { AddSourceCard } from '../ui/SourceCard';
import type { SourceConfig } from '../ui/SourceCard';

<SourceCard
  config={{ id: 'chess.com', username: 'hikaru', games: 847, rating: 1523, ratingSystem: 'Elo', lastSync: '2 min ago' }}
  enabled={activeSources.includes('chess.com')}
  onToggle={() => toggleSource('chess.com')}
  animDelay={0}
/>

<AddSourceCard />  // Phantom "+" card to add a new source
```

---

## View Modes

The page supports three view modes via header segmented control:
- **Combined** — aggregate all active sources
- **By Source** — separate breakdown per source
- **vs Opponent** — head-to-head comparison (Pro feature)

State: `const [viewMode, setViewMode] = useState<ViewMode>('combined')`

---

## Adding a New Widget to Data Mixer

1. Create the widget component in `src/components/report/widgets/` (follow existing widget patterns from component-patterns skill).
2. Import `SourceDots` and add it to the widget header alongside the title.
3. Pass `activeSources` as a prop from `DataMixerPage`.
4. Add the widget inside the grid in `DataMixerPage.tsx`.

Example header pattern:
```tsx
<div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
    <div className={DASHBOARD_FONTS.widgetTitle}>Widget Title</div>
    <SourceDots sources={['chess.com', 'lichess']} activeSources={activeSources} />
</div>
```

---

## Rating Display Rule

**NEVER** convert or directly compare ratings across platforms.

- Chess.com uses Elo (displayed as "1,523 Elo")
- Lichess uses Glicko-2 (displayed as "1,847 Glicko-2")
- When both are visible, show a warning: "Rating scales are different — comparison is not meaningful"

See `RatingChart` component in `DataMixerPage.tsx` for the implementation.

---

## Backend Integration Points

`// TODO(backend): Replace MOCK_SOURCES with API call to user's connected accounts`

`// TODO(backend): Replace MOCK_OPENINGS with filteredGames() from GameStore`

See `.agent/backend/multi-source-data.md` for the full NormalizedGame architecture.
