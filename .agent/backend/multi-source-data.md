# Multi-Source Data Architecture — Backend Integration Guide

> [!IMPORTANT]
> This document describes the **future backend architecture** for the Data Mixer feature.
> Nothing here is implemented yet on the server side — use it as a reference when building the real API integrations.

## Architecture: 3 Layers

```
UI Layer (DataMixerPage + widgets)
        ↑
Unified Data Store (NormalizedGame[] + GameStore)
        ↑
Source Adapters (ChessCom | Lichess | PGN)
```

---

## NormalizedGame Interface

All games from any source must be normalized to this format before reaching any widget.

```typescript
// src/types/game.ts (TODO: create this file when implementing)

type GameSource = 'chess.com' | 'lichess' | 'pgn';
type TimeClass = 'bullet' | 'blitz' | 'rapid' | 'classical' | 'correspondence' | 'unknown';
type GameResult = 'win' | 'loss' | 'draw';
type Termination = 'checkmate' | 'resignation' | 'timeout' | 'stalemate' |
                   'insufficient' | 'repetition' | 'agreement' | 'abandoned' | 'unknown';

interface NormalizedGame {
  id: string;                    // `${source}:${sourceGameId}` to avoid collisions
  source: GameSource;
  sourceGameId: string;
  sourceUrl: string | null;
  importedAt: number;

  player: {
    username: string;
    rating: number | null;
    ratingSystem: 'elo' | 'glicko2' | 'unknown';
    color: 'white' | 'black';
  };
  opponent: {
    username: string;
    rating: number | null;
    ratingSystem: 'elo' | 'glicko2' | 'unknown';
    color: 'white' | 'black';
    title: string | null;
  };

  result: GameResult;
  termination: Termination;

  playedAt: number;              // UTC timestamp ms
  timeControl: { initial: number; increment: number; raw: string };
  timeClass: TimeClass;

  opening: { eco: string | null; name: string | null; ply: number | null };

  pgn: string;
  moves: string[];
  totalMoves: number;

  analysis: {
    playerAccuracy: number | null;
    opponentAccuracy: number | null;
    blunders: number | null;
    mistakes: number | null;
    inaccuracies: number | null;
    evaluations: number[] | null;
  } | null;

  meta: {
    rated: boolean;
    tournament: string | null;
    variant: string;
    clockData: number[] | null;
    [key: string]: unknown;
  };
}
```

---

## Source Adapters

### Chess.com

**API:** `GET /pub/player/{username}/games/{year}/{month}`  
**Format:** JSON with `games[]`  
**Rate limit:** ~1 req/sec recommended  

Key normalization steps:
- `id = chess.com:${raw.uuid}`
- `result`: map `raw.white.result` / `raw.black.result` → win/loss/draw
- `ratingSystem: 'elo'`
- `analysis.playerAccuracy` available if `raw.accuracies` exists
- `clockData`: not available from games endpoint

### Lichess

**API:** `GET /api/games/user/{username}` with `Accept: application/x-ndjson`  
**Rate limit:** 15 games/sec  

Key normalization steps:
- `id = lichess:${raw.id}`
- `ratingSystem: 'glicko2'`
- `meta.clockData = raw.clocks` (Lichess provides clock per move!)
- `analysis.blunders/mistakes/inaccuracies` from `raw.analysis[].judgment`

### PGN Upload

Key normalization steps:
- `id = pgn:${fingerprint}` where fingerprint = hash(date + players + first 10 moves)
- `ratingSystem`: infer from `Site` header
- `analysis = null` (no accuracy data in standard PGN)
- `timeClass = 'unknown'` if `TimeControl` header is missing

---

## Deduplication

The same game can appear from Chess.com API AND a PGN upload.

**Fingerprint algorithm:**
```typescript
function generateFingerprint(game: NormalizedGame): string {
  const date = new Date(game.playedAt).toISOString().split('T')[0];
  const players = [game.player.username, game.opponent.username].sort().join('-');
  const openingMoves = game.moves.slice(0, 10).join(' ');
  return `${date}:${players}:${openingMoves}`;
}
```

When duplicate found: keep the version with more data (platform API > PGN). Merge `analysis` fields taking whichever is non-null.

---

## GameStore (Central State)

```typescript
interface GameStore {
  sources: SourceConfig[];
  games: NormalizedGame[];
  activeSourceIds: string[];
  filters: {
    timeClass: TimeClass | 'all';
    dateRange: { from: number; to: number } | null;
    color: 'white' | 'black' | 'both';
    rated: boolean | 'all';
  };
  filteredGames: () => NormalizedGame[];
  stats: () => AggregatedStats;
}
```

The `filteredGames()` function is the single source of truth that all widgets consume.

---

## Rating Display Rules

**NEVER** convert or compare ratings between platforms numerically.

| Rule | Reason |
|------|--------|
| Show Elo with "Chess.com" label | Chess.com Elo ≠ FIDE Elo |
| Show Glicko-2 with "Lichess" label | Lichess Glicko-2 is ~200-400 higher than Elo |
| Separate chart lines per source | Cannot average different scales |
| Show cross-platform warning in UI | Already implemented in RatingChart |

Optional: FIDE estimate (`rating - 150` for Chess.com Blitz, `rating - 350` for Lichess Blitz) — label clearly as **estimate**.

---

## Time Control Normalization

Our unified classification (based on FIDE + online conventions):

| Class | Estimated Duration |
|---|---|
| Bullet | < 3 min |
| Blitz | 3–10 min |
| Rapid | 10–30 min |
| Classical | 30 min – 1 day |
| Correspondence | > 1 day |

Formula: `estimated = initial + 40 * increment`

> Note: Lichess classifies 8-10 min games as Rapid; we classify them as Blitz. This is an intentional choice documented here.

---

## ComparisonStore (for Compare Mode)

For head-to-head opponent comparison (Data Mixer "vs Opponent" mode):

```typescript
interface ComparisonStore {
  player: { sources: SourceConfig[]; games: NormalizedGame[] };
  opponent: { sources: SourceConfig[]; games: NormalizedGame[] };
  commonOpenings: () => {
    eco: string; name: string;
    playerStats: { wins: number; draws: number; losses: number; games: number };
    opponentStats: { wins: number; draws: number; losses: number; games: number };
  }[];
}
```

Opponent data can come from:
1. Their Chess.com public API profile
2. Their Lichess public API profile
3. A PGN file uploaded by the user

---

## Implementation Phases

1. **Phase 1 — Core types**: Create `src/types/game.ts` with `NormalizedGame`
2. **Phase 2 — Adapters**: `src/adapters/chesscom.ts`, `lichess.ts`, `pgn.ts`  
3. **Phase 3 — Store**: `src/store/gameStore.ts` with Zustand or Context
4. **Phase 4 — Widget migration**: Replace mock data one widget at a time
5. **Phase 5 — Compare mode**: `ComparisonStore` and `OpponentCompareView`

---

## Frontend TODOs (Search for these in the codebase)

- `// TODO(backend): Replace MOCK_SOURCES with API call` — `DataMixerPage.tsx`
- `// TODO(backend): Replace MOCK_OPENINGS with filteredGames()` — `DataMixerPage.tsx`
- `// TODO(backend): Fetch opponent games from Chess.com/Lichess API` — future `OpponentCompareView.tsx`
