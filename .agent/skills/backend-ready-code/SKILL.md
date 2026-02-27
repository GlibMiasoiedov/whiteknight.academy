---
name: backend-ready-code
description: >
  Conventions for mock data, TODO comments, API hook stubs, and preparing
  frontend code for future backend integration. Use when adding mock data,
  creating placeholder API calls, or leaving integration points for Chess.com
  and Lichess APIs.
---

# Backend-Ready Code

## Mock Data Location

**Current**: `src/components/coaching/mockData.ts`

This is the single mock data file. It contains coaching schedules, lesson data, coach profiles, and curriculum topics.

> **Migration note**: When the project grows beyond coaching data, consider moving to `src/data/mockData.ts`. For now, all mock data lives in the coaching domain.

### Naming Conventions

```typescript
// Constants — MOCK_ prefix
const MOCK_OPPONENTS: OpponentData[] = [...];
const MOCK_PLAYER_STATS = { ... };

// Factory functions — generate prefix
function generateWeeklySchedule(): Schedule[] { ... }
```

### Data Realism

Use chess-specific realistic values:
- Elo ratings: 800–2800 range
- ECO codes: A00–E99 (e.g. B20 Sicilian, C50 Italian)
- W/D/L stats: realistic ratios (not always 50/25/25)
- Opponent names: creative chess-themed usernames

```typescript
// Source: src/components/report/widgets/TopOpponentsList.tsx:16-22
const MOCK_OPPONENTS: OpponentData[] = [
    { name: "xXx_Slayer_xXx", games: 42, win: 20, draw: 5, loss: 17, ratingDelta: "+12.5", ... },
    { name: "ChessMaster99",   games: 38, win: 15, draw: 10, loss: 13, ratingDelta: "-4.2", ... },
    { name: "TheDarkKnight",   games: 25, win: 10, draw: 2, loss: 13, ratingDelta: "-18.0", ... },
    { name: "AlphaZeroFan",    games: 21, win: 12, draw: 4, loss: 5, ratingDelta: "+24.8", ... },
    { name: "PawnPusher1",     games: 18, win: 9, draw: 9, loss: 0, ratingDelta: "+15.0", ... },
];
```

## TODO Comment Format

Use `TODO(backend):` prefix with a specific API endpoint:

```typescript
// TODO(backend): Replace with Chess.com API — GET /pub/player/{username}/stats
// TODO(backend): Replace with Lichess API — GET /api/user/{username}/perf/{perf}
// TODO(backend): Fetch from backend — POST /api/analytics/report
```

## Hook Stubs

When creating data fetching logic, use this pattern:

```typescript
// src/hooks/usePlayerStats.ts
export const usePlayerStats = (username: string) => {
    // TODO(backend): Replace with real API call
    const [data] = React.useState(MOCK_PLAYER_STATS);
    const [isLoading] = React.useState(false);
    const [error] = React.useState<Error | null>(null);
    
    return { data, isLoading, error };
};
```

## LocalStorage

Key prefix: `wk_`

| Key | Purpose |
|-----|---------|
| `wk_coaching_profile` | Coaching preferences (level, goals, timezone) |
| `wk_analytics_wizard_seen` | Whether onboarding wizard was completed |
| `wk_connected_platforms` | Chess.com / Lichess connection state |

```typescript
// Reading
const profile = JSON.parse(localStorage.getItem('wk_coaching_profile') || '{}');

// Writing
localStorage.setItem('wk_coaching_profile', JSON.stringify(formData));
```

## API Integration Points

When backend is ready, these components will need API connections:

| Component | Currently | Future API |
|-----------|-----------|------------|
| `ReportDashboard.tsx` | Inline mock data | Chess.com/Lichess game history |
| `RatingDynamicsChart.tsx` | Static array | Rating history endpoint |
| `TopOpponentsList.tsx` | `MOCK_OPPONENTS` | Opponent analysis endpoint |
| `CenterColumn.tsx` | Hardcoded stats | User profile + stats API |
| `LessonCalendar.tsx` | `mockData.ts` | Booking system API |

## Key Dependencies

| Package | Version | Used for |
|---------|---------|----------|
| `react` | ^19.2.0 | Core framework |
| `react-router-dom` | ^7.13.0 | Client-side routing, lazy loading |
| `lucide-react` | ^0.564.0 | UI icons |
| `@tailwindcss/vite` | ^4.1.18 | Tailwind CSS v4 via Vite plugin |
| `@fontsource/manrope` | ^5.2.8 | Body font (`font-body`) |
| `@fontsource/unbounded` | ^5.2.8 | Display font (`font-display`) |
| `@stripe/react-stripe-js` | ^5.6.0 | Payment integration (Stripe) |
| `@paypal/react-paypal-js` | ^8.9.2 | Payment integration (PayPal) |

NOTE: No chart library (Recharts, Chart.js, etc.) — all charts are custom SVG.
