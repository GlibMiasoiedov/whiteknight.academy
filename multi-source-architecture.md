# Multi-Source Data Architecture — White Knight Analytics

## Проблема

Гравець може мати ігри на Chess.com, Lichess, і в PGN файлах (турнірні партії, OTB).
Потрібно: аналізувати кожне джерело окремо АБО все разом на одній панелі.
Також: порівнювати СЕБЕ (з одного джерела) з ОПОНЕНТОМ (з іншого джерела).

Складності:
- Різні формати даних (JSON vs ndjson vs PGN)
- Різні рейтингові системи (Chess.com Elo ≠ Lichess Glicko-2)
- Різні назви time controls ("blitz" може мати різні межі)
- Різна детальність даних (Lichess має clock data, Chess.com — accuracy)
- Одна і та ж гра може існувати на двох платформах (дублікати)

---

## Архітектура: 3 шари

```
┌─────────────────────────────────────────────────┐
│                   UI Layer                       │
│  Source Selector → Filters → Widgets/Charts      │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────┐
│              Unified Data Store                  │
│  NormalizedGame[] — єдиний формат для всіх       │
│  + metadata: source, sourceId, importedAt        │
└──────────────────────┬──────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────┐
│             Source Adapters (Parsers)             │
│  ChessCom → Normalize │ Lichess → Normalize      │
│                PGN → Normalize                   │
└─────────────────────────────────────────────────┘
```

---

## Шар 1: Unified Game Model (NormalizedGame)

Кожна гра з будь-якого джерела конвертується в єдиний формат.
Це серце всієї системи — всі widgets працюють ТІЛЬКИ з цим форматом.

```typescript
// src/types/game.ts

type GameSource = 'chess.com' | 'lichess' | 'pgn';

type TimeClass = 'bullet' | 'blitz' | 'rapid' | 'classical' | 'correspondence' | 'unknown';

type GameResult = 'win' | 'loss' | 'draw';

type Termination = 
  | 'checkmate' 
  | 'resignation' 
  | 'timeout' 
  | 'stalemate' 
  | 'insufficient' 
  | 'repetition' 
  | 'agreement' 
  | 'abandoned' 
  | 'unknown';

interface NormalizedGame {
  // === Ідентифікація ===
  id: string;                    // унікальний: `${source}:${sourceGameId}`
  source: GameSource;
  sourceGameId: string;          // оригінальний ID на платформі
  sourceUrl: string | null;      // посилання на гру на платформі
  importedAt: number;            // timestamp імпорту

  // === Гравці ===
  player: {                      // завжди наш юзер
    username: string;
    rating: number | null;       // рейтинг НА ЦІЙ ПЛАТФОРМІ на момент гри
    ratingSystem: 'elo' | 'glicko2' | 'unknown';
    color: 'white' | 'black';
  };
  opponent: {
    username: string;
    rating: number | null;
    ratingSystem: 'elo' | 'glicko2' | 'unknown';
    color: 'white' | 'black';
    title: string | null;        // GM, IM, FM etc
  };

  // === Результат ===
  result: GameResult;            // з перспективи нашого гравця
  termination: Termination;

  // === Час ===
  playedAt: number;              // UTC timestamp
  timeControl: {
    initial: number;             // секунди
    increment: number;           // секунди
    raw: string;                 // оригінальний формат: "300+5", "10|0"
  };
  timeClass: TimeClass;          // нормалізований

  // === Дебют ===
  opening: {
    eco: string | null;          // "B20"
    name: string | null;         // "Sicilian Defense"
    ply: number | null;          // кількість напівходів
  };

  // === Ходи ===
  pgn: string;                   // завжди PGN формат
  moves: string[];               // ['e4', 'e5', 'Nf3', ...]
  totalMoves: number;            // повні ходи (не напівходи)

  // === Аналітика (якщо доступна) ===
  analysis: {
    playerAccuracy: number | null;    // % (Chess.com) або обчислений
    opponentAccuracy: number | null;
    blunders: number | null;
    mistakes: number | null;
    inaccuracies: number | null;
    // eval per move — якщо є
    evaluations: number[] | null;     // centipawns після кожного ходу
  } | null;

  // === Мета (платформо-специфічне) ===
  meta: {
    rated: boolean;
    tournament: string | null;        // назва турніру
    variant: string;                  // 'standard', 'chess960', etc
    clockData: number[] | null;       // залишок часу після кожного ходу (Lichess)
    [key: string]: unknown;           // для platform-specific полів
  };
}
```

### Чому саме такий формат

| Рішення | Обґрунтування |
|---------|---------------|
| `id = source:sourceId` | Запобігає колізіям між платформами. Chess.com ID "12345" ≠ Lichess ID "12345" |
| `player` завжди наш юзер | Всі widgets не мають думати хто білі/чорні — результат завжди з перспективи гравця |
| `rating` зберігає оригінальний | НЕ конвертуємо між системами — це неточно. Замість цього показуємо рейтинг з поміткою системи |
| `ratingSystem` явно вказано | UI може показати "(Elo)" або "(Glicko-2)" біля числа |
| `timeClass` нормалізований | Обидві платформи мають різні межі. Нормалізуємо при імпорті |
| `analysis` nullable | PGN файли зазвичай не мають accuracy. Chess.com має, Lichess — тільки якщо запросити |
| `pgn` завжди зберігається | Дозволяє re-parse або відкрити в зовнішньому аналізаторі |

---

## Шар 2: Source Adapters

### Chess.com Adapter

```
API: GET /pub/player/{username}/games/{year}/{month}
Формат: JSON з масивом games[]
Rate limit: не документований, ~1 req/sec рекомендовано
```

```typescript
// src/adapters/chesscom.ts

function normalizeChessComGame(raw: ChessComGame, ourUsername: string): NormalizedGame {
  const isWhite = raw.white.username.toLowerCase() === ourUsername.toLowerCase();
  
  return {
    id: `chess.com:${raw.uuid || raw.url.split('/').pop()}`,
    source: 'chess.com',
    sourceGameId: raw.uuid || raw.url.split('/').pop(),
    sourceUrl: raw.url,
    importedAt: Date.now(),

    player: {
      username: ourUsername,
      rating: isWhite ? raw.white.rating : raw.black.rating,
      ratingSystem: 'elo',      // Chess.com uses Glicko internally but displays as Elo
      color: isWhite ? 'white' : 'black',
    },
    opponent: {
      username: isWhite ? raw.black.username : raw.white.username,
      rating: isWhite ? raw.black.rating : raw.white.rating,
      ratingSystem: 'elo',
      color: isWhite ? 'black' : 'white',
      title: null, // не завжди доступно в games endpoint
    },

    result: mapChessComResult(isWhite ? raw.white.result : raw.black.result),
    termination: mapChessComTermination(isWhite ? raw.white.result : raw.black.result),

    playedAt: raw.end_time * 1000,
    timeControl: parseTimeControl(raw.time_control), // "300" → {initial:300, increment:0}
    timeClass: raw.time_class as TimeClass,

    opening: {
      eco: raw.eco ? raw.eco.split('/').pop() : null,
      name: null, // Chess.com дає URL, не назву — парсимо окремо
      ply: null,
    },

    pgn: raw.pgn,
    moves: extractMovesFromPgn(raw.pgn),
    totalMoves: Math.ceil(extractMovesFromPgn(raw.pgn).length / 2),

    analysis: raw.accuracies ? {
      playerAccuracy: isWhite ? raw.accuracies.white : raw.accuracies.black,
      opponentAccuracy: isWhite ? raw.accuracies.black : raw.accuracies.white,
      blunders: null,       // потрібен окремий API call для individual game
      mistakes: null,
      inaccuracies: null,
      evaluations: null,
    } : null,

    meta: {
      rated: raw.rated,
      tournament: raw.tournament || null,
      variant: raw.rules || 'standard',
      clockData: null,
    },
  };
}

// Chess.com result → unified
function mapChessComResult(result: string): GameResult {
  if (result === 'win') return 'win';
  if (['checkmated', 'timeout', 'resigned', 'abandoned', 'lose'].includes(result)) return 'loss';
  return 'draw'; // stalemate, insufficient, repetition, agreed, timevsinsufficient, 50move
}
```

### Lichess Adapter

```
API: GET /api/games/user/{username}
Формат: ndjson (Accept: application/x-ndjson) або PGN
Rate limit: 15 games/sec
Потребує: Accept header для JSON формату
```

```typescript
// src/adapters/lichess.ts

function normalizeLichessGame(raw: LichessGame, ourUsername: string): NormalizedGame {
  const isWhite = raw.players.white.user?.id.toLowerCase() === ourUsername.toLowerCase();
  const playerData = isWhite ? raw.players.white : raw.players.black;
  const opponentData = isWhite ? raw.players.black : raw.players.white;

  return {
    id: `lichess:${raw.id}`,
    source: 'lichess',
    sourceGameId: raw.id,
    sourceUrl: `https://lichess.org/${raw.id}`,
    importedAt: Date.now(),

    player: {
      username: ourUsername,
      rating: playerData.rating,
      ratingSystem: 'glicko2',
      color: isWhite ? 'white' : 'black',
    },
    opponent: {
      username: opponentData.user?.name || 'Anonymous',
      rating: opponentData.rating,
      ratingSystem: 'glicko2',
      color: isWhite ? 'black' : 'white',
      title: opponentData.user?.title || null,
    },

    result: mapLichessResult(raw, isWhite),
    termination: mapLichessTermination(raw.status),

    playedAt: raw.createdAt,
    timeControl: {
      initial: raw.clock?.initial || 0,
      increment: raw.clock?.increment || 0,
      raw: `${(raw.clock?.initial || 0) / 60}+${raw.clock?.increment || 0}`,
    },
    timeClass: mapLichessSpeed(raw.speed),

    opening: {
      eco: raw.opening?.eco || null,
      name: raw.opening?.name || null,
      ply: raw.opening?.ply || null,
    },

    pgn: raw.pgn || movesToPgn(raw.moves),
    moves: raw.moves ? raw.moves.split(' ') : [],
    totalMoves: raw.moves ? Math.ceil(raw.moves.split(' ').length / 2) : 0,

    analysis: raw.analysis ? {
      playerAccuracy: null,                // Lichess не дає accuracy напряму
      opponentAccuracy: null,
      blunders: countMoveTypes(raw.analysis, isWhite, 'blunder'),
      mistakes: countMoveTypes(raw.analysis, isWhite, 'mistake'),
      inaccuracies: countMoveTypes(raw.analysis, isWhite, 'inaccuracy'),
      evaluations: raw.analysis.map(a => a.eval ?? null),
    } : null,

    meta: {
      rated: raw.rated,
      tournament: raw.tournament || null,
      variant: raw.variant || 'standard',
      clockData: raw.clocks || null,    // Lichess дає clock per move!
    },
  };
}
```

### PGN Adapter

```typescript
// src/adapters/pgn.ts

function normalizePgnGame(headers: PgnHeaders, moves: string[], ourUsername: string): NormalizedGame {
  const isWhite = headers.White?.toLowerCase() === ourUsername.toLowerCase();
  
  // Визначаємо time class з TimeControl header якщо є
  const tc = parsePgnTimeControl(headers.TimeControl); // "300+5" або "?" або "-"
  
  return {
    id: `pgn:${generatePgnId(headers, moves)}`, // hash від дати + гравців + перших ходів
    source: 'pgn',
    sourceGameId: generatePgnId(headers, moves),
    sourceUrl: headers.Site || null,
    importedAt: Date.now(),

    player: {
      username: isWhite ? headers.White : headers.Black,
      rating: isWhite ? parseInt(headers.WhiteElo) || null : parseInt(headers.BlackElo) || null,
      ratingSystem: detectRatingSystem(headers), // evристика: Site header → platform
      color: isWhite ? 'white' : 'black',
    },
    opponent: {
      username: isWhite ? headers.Black : headers.White,
      rating: isWhite ? parseInt(headers.BlackElo) || null : parseInt(headers.WhiteElo) || null,
      ratingSystem: detectRatingSystem(headers),
      color: isWhite ? 'black' : 'white',
      title: null, // PGN може мати це в імені: "GM Carlsen, Magnus"
    },

    result: mapPgnResult(headers.Result, isWhite),
    termination: mapPgnTermination(headers.Termination),

    playedAt: parsePgnDate(headers.Date, headers.UTCDate, headers.UTCTime),
    timeControl: tc,
    timeClass: tc ? classifyTimeControl(tc.initial, tc.increment) : 'unknown',

    opening: {
      eco: headers.ECO || null,
      name: headers.Opening || null,
      ply: null,
    },

    pgn: reconstructPgn(headers, moves),
    moves: moves,
    totalMoves: Math.ceil(moves.length / 2),

    analysis: null,  // PGN зазвичай не має accuracy

    meta: {
      rated: true,  // припускаємо rated, якщо не вказано інше
      tournament: headers.Event || null,
      variant: headers.Variant || 'standard',
      clockData: null,
    },
  };
}
```

---

## Шар 3: Data Store + Source Filtering

### GameStore — центральне сховище

```typescript
// src/store/gameStore.ts

interface SourceConfig {
  id: string;                         // "chess.com:hikaru", "lichess:DrNykterstein", "pgn:upload-1"
  source: GameSource;
  username: string;
  displayName: string;                // для UI
  color: string;                      // для фільтр-чіпів: Chess.com = green, Lichess = white, PGN = blue
  gamesCount: number;
  lastUpdated: number;
  enabled: boolean;                   // чи включено в поточний вид
}

interface GameStore {
  // === Джерела ===
  sources: SourceConfig[];
  
  // === Всі ігри ===
  games: NormalizedGame[];
  
  // === Активні фільтри ===
  activeSourceIds: string[];          // які джерела зараз увімкнені
  filters: {
    timeClass: TimeClass | 'all';
    dateRange: { from: number; to: number } | null;
    color: 'white' | 'black' | 'both';
    rated: boolean | 'all';
    minRating: number | null;
    maxRating: number | null;
  };
  
  // === Computed ===
  /** Ігри після фільтрації по джерелах і фільтрах */
  filteredGames: () => NormalizedGame[];
  
  /** Статистика по активних іграх */
  stats: () => AggregatedStats;
}

// Головна функція фільтрації
function getFilteredGames(store: GameStore): NormalizedGame[] {
  return store.games.filter(game => {
    // 1. Фільтр по джерелу
    const sourceId = `${game.source}:${game.player.username}`;
    if (!store.activeSourceIds.includes(sourceId)) return false;
    
    // 2. Time class
    if (store.filters.timeClass !== 'all' && game.timeClass !== store.filters.timeClass) return false;
    
    // 3. Date range
    if (store.filters.dateRange) {
      if (game.playedAt < store.filters.dateRange.from) return false;
      if (game.playedAt > store.filters.dateRange.to) return false;
    }
    
    // 4. Color
    if (store.filters.color !== 'both' && game.player.color !== store.filters.color) return false;
    
    // 5. Rated
    if (store.filters.rated !== 'all' && game.meta.rated !== store.filters.rated) return false;
    
    return true;
  });
}
```

### Дедуплікація

Одна гра може бути імпортована з Chess.com API І з PGN файлу.

```typescript
// src/utils/deduplication.ts

function deduplicateGames(games: NormalizedGame[]): NormalizedGame[] {
  const seen = new Map<string, NormalizedGame>();
  
  for (const game of games) {
    const fingerprint = generateFingerprint(game);
    const existing = seen.get(fingerprint);
    
    if (!existing) {
      seen.set(fingerprint, game);
    } else {
      // Зберігаємо версію з більшою кількістю даних
      seen.set(fingerprint, mergeGameData(existing, game));
    }
  }
  
  return Array.from(seen.values());
}

function generateFingerprint(game: NormalizedGame): string {
  // Fingerprint = дата + гравці + перші 10 ходів
  // Це надійно ідентифікує гру навіть між платформами
  const date = new Date(game.playedAt).toISOString().split('T')[0];
  const players = [game.player.username, game.opponent.username].sort().join('-');
  const openingMoves = game.moves.slice(0, 10).join(' ');
  return `${date}:${players}:${openingMoves}`;
}

function mergeGameData(a: NormalizedGame, b: NormalizedGame): NormalizedGame {
  // Пріоритет: платформа > PGN (бо має більше метаданих)
  const primary = a.source !== 'pgn' ? a : b;
  const secondary = a.source !== 'pgn' ? b : a;
  
  return {
    ...primary,
    // Беремо analysis від того хто має
    analysis: primary.analysis || secondary.analysis,
    // Зберігаємо обидва sourceUrl
    meta: {
      ...primary.meta,
      alternateSource: secondary.source,
      alternateUrl: secondary.sourceUrl,
    },
  };
}
```

---

## Time Control Normalization

Критична проблема: Chess.com і Lichess мають РІЗНІ межі для time classes.

```typescript
// src/utils/timeControl.ts

// Наша уніфікована класифікація (базується на FIDE + онлайн конвенціях)
function classifyTimeControl(initialSeconds: number, incrementSeconds: number): TimeClass {
  // Estimated game duration = initial + 40 * increment (приблизно 40 ходів)
  const estimated = initialSeconds + 40 * incrementSeconds;
  
  if (estimated < 180) return 'bullet';           // < 3 хв
  if (estimated < 600) return 'blitz';             // 3-10 хв
  if (estimated < 1800) return 'rapid';            // 10-30 хв
  if (estimated < 86400) return 'classical';       // 30 хв - 1 день
  return 'correspondence';
}

// Для порівняння: як класифікують платформи
// Chess.com:  bullet < 3min, blitz 3-10min, rapid 10-30min
// Lichess:    bullet < 3min, blitz 3-8min,  rapid 8-25min, classical > 25min
// Наша:       bullet < 3min, blitz 3-10min, rapid 10-30min, classical > 30min
// 
// Різниця: 8-10 хв гра = blitz (Chess.com, ми) vs rapid (Lichess)
// Це СВІДОМИЙ вибір — ми використовуємо СВОЮ класифікацію яка ближча до Chess.com
// В UI показуємо tooltip: "Classified as Blitz (estimated 8 min)"
```

---

## Рейтинги: НЕ конвертуємо, а показуємо з контекстом

```typescript
// src/utils/rating.ts

// ВАЖЛИВО: ми НЕ конвертуємо рейтинги між системами
// Chess.com 1500 ≠ Lichess 1500 (різниця ~200-400 пунктів залежно від time control)
// Замість конвертації — показуємо рейтинг з міткою джерела

interface RatingDisplay {
  value: number;
  system: 'elo' | 'glicko2' | 'unknown';
  source: GameSource;
  label: string;       // "1523 (Chess.com)" або "1847 (Lichess)"
}

// Для графіків рейтингу: окремі лінії для кожного джерела
// Для mid-widget display: показуємо домінуюче джерело з поміткою
// Для порівняння з опонентом: показуємо обидва рейтинги БЕЗ порівняння числа

// Опціонально: показуємо ПРИБЛИЗНИЙ FIDE еквівалент
// (ChessMonitor робить це — "Estimated FIDE: 1650")
// Формула залежить від time control і варіюється, тому це "estimate"
function estimateFideRating(rating: number, source: GameSource, timeClass: TimeClass): number | null {
  // Дуже приблизно, базується на статистичних дослідженнях:
  // Chess.com Blitz → FIDE ≈ rating - 100..200
  // Lichess Blitz → FIDE ≈ rating - 300..400
  // Це НЕ точна наука, показуємо тільки як "estimate"
  if (source === 'chess.com') return Math.round(rating - 150);
  if (source === 'lichess') return Math.round(rating - 350);
  return null;
}
```

---

## UI Design: Source Selector

### Концепція: "Source Chips" — панель вибору джерел

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Data Sources                                            │
│                                                             │
│  [🟢 Chess.com: hikaru ✓] [⚪ Lichess: DrNykterstein ✓]    │
│  [🔵 PGN: Tournament 2024 ✓]                               │
│                                                             │
│  Combined: 1,247 games │ [All Sources ▾] [Blitz ▾]         │
└─────────────────────────────────────────────────────────────┘
```

### Правила Source Chips

| Стан | Поведінка |
|------|-----------|
| Всі увімкнені | Widgets показують агреговані дані з усіх джерел |
| Один увімкнений | Widgets показують тільки дані з цього джерела |
| Кілька увімкнених | Widgets показують merged view |
| Ніхто не увімкнений | Показати empty state: "Select at least one source" |

### Колірна система джерел

```typescript
// src/constants/sourceColors.ts

const SOURCE_COLORS = {
  'chess.com': {
    primary: '#7FA650',        // Chess.com brand green
    bg: 'bg-[#7FA650]/10',
    border: 'border-[#7FA650]/30',
    text: 'text-[#7FA650]',
    chip: 'bg-[#7FA650]/20 text-[#7FA650] border-[#7FA650]/30',
    icon: '♞',                 // або SVG Chess.com logo
  },
  'lichess': {
    primary: '#FFFFFF',
    bg: 'bg-white/10',
    border: 'border-white/30',
    text: 'text-white',
    chip: 'bg-white/20 text-white border-white/30',
    icon: '♘',                 // або SVG Lichess logo
  },
  'pgn': {
    primary: '#60A5FA',        // Blue
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/30',
    text: 'text-blue-400',
    chip: 'bg-blue-400/20 text-blue-400 border-blue-400/30',
    icon: '📄',
  },
} as const;
```

### Де розмістити Source Selector

```
Варіант A: В існуючому FiltersDrawer (зправа, разом з фільтрами)
  ✅ Не змінює layout
  ❌ Прихований за кнопкою, важко перемикати

Варіант B: Між header і контентом ReportDashboard (горизонтальна панель)
  ✅ Завжди видимий, швидке перемикання
  ✅ Природно вписується в flow: Header → Sources → Content
  ❌ Займає вертикальний простір

Варіант C: В Sidebar (ліва панель, під навігацією)
  ✅ Постійно видимий
  ❌ Sidebar вже тісний

РЕКОМЕНДАЦІЯ: Варіант B — горизонтальна панель під header ReportDashboard.
Компактна (1 рядок), з чіпами які можна toggle on/off.
На мобільних: collapse в dropdown "Sources (3)" з checkbox-ами.
```

### Widget-level Source Indicator

Кожен widget який показує дані має маленький індикатор джерела:

```
┌──────────────────────────────────────────┐
│  ⚔️ Most Played Openings    🟢⚪ [i]     │  ← 🟢⚪ = Chess.com + Lichess active
│  ─────────────────────────────────────── │
│  1. Sicilian Defense    76.6% W  134g    │
│  2. Italian Game        71.2% W   89g    │
│  ...                                     │
└──────────────────────────────────────────┘
```

`🟢⚪` — мінімальні dot indicators які показують з яких джерел зібрані дані.
`[i]` — tooltip з деталями: "Showing 134 games from Chess.com + 89 from Lichess"

### Rating Chart — Multiple Lines

```
Rating ▲
2000 │         ╱──── Lichess (Glicko-2)
     │    ╱───╱
1800 │───╱          
     │              ╱──── Chess.com (Elo)
1600 │─────────────╱
     │
     └────────────────────────► Time
       Jan    Mar    Jun    Sep

Легенда: 🟢 Chess.com: 1,523  ⚪ Lichess: 1,847
```

Для рейтингу НІКОЛИ не зливаємо лінії — завжди окремі, бо шкали різні.

---

## Comparison Mode: Мої дані vs Опонент

### Use Case

Я граю на Chess.com. Мій наступний опонент грає на Lichess. 
Хочу порівняти наші дебютні репертуари.

### Data Flow

```
Мій профіль (Chess.com)    Опонент (Lichess)
         │                        │
    Normalize                Normalize
         │                        │
         └──────┬─────────────────┘
                │
         ComparisonView
         ├── Мої дебюти vs Його дебюти
         ├── Мій winrate vs Його winrate  
         └── Side-by-side stats
```

### ComparisonStore

```typescript
// src/store/comparisonStore.ts

interface ComparisonStore {
  player: {
    sources: SourceConfig[];
    games: NormalizedGame[];
  };
  opponent: {
    sources: SourceConfig[];
    games: NormalizedGame[];
  };
  
  // Спільні дебюти
  commonOpenings: () => {
    eco: string;
    name: string;
    playerStats: { wins: number; draws: number; losses: number; games: number };
    opponentStats: { wins: number; draws: number; losses: number; games: number };
  }[];
}
```

### UI: Comparison Panel

```
┌─────────────────────────────────────────────────────────┐
│  📊 Opponent Preparation                                 │
│                                                          │
│  YOU                          OPPONENT                   │
│  🟢 hikaru (Chess.com)       ⚪ DrNykterstein (Lichess)  │
│  Rating: 1,523 (Elo)         Rating: 1,847 (Glicko-2)   │
│  Games: 847                  Games: 1,203                │
│                                                          │
│  ═══ Common Openings ═══                                 │
│                                                          │
│  Sicilian Defense (B20)                                  │
│  YOU:  W 76% │ D 12% │ L 12%  (34 games)                │
│  OPP:  W 68% │ D 15% │ L 17%  (52 games)                │
│  → You have better results here                          │
│                                                          │
│  Italian Game (C50)                                      │
│  YOU:  W 45% │ D 20% │ L 35%  (20 games)                │
│  OPP:  W 82% │ D 10% │ L 8%   (28 games)                │
│  → ⚠️ Avoid this opening — opponent is much stronger     │
└─────────────────────────────────────────────────────────┘
```

---

## Імплементація: Поетапний план

### Фаза 1: Базовий фреймворк (Core)

```
Файли:
  src/types/game.ts              — NormalizedGame interface + всі допоміжні типи
  src/adapters/chesscom.ts       — Chess.com → NormalizedGame
  src/adapters/lichess.ts        — Lichess → NormalizedGame  
  src/adapters/pgn.ts            — PGN → NormalizedGame
  src/adapters/index.ts          — barrel export
  src/utils/timeControl.ts       — classifyTimeControl, parseTimeControl
  src/utils/deduplication.ts     — fingerprinting, merge
  src/utils/openings.ts          — ECO lookup, нормалізація назв
  src/store/gameStore.ts         — центральний store
  src/constants/sourceColors.ts  — колірна система джерел

Результат: можна імпортувати ігри з 3 джерел у єдиний store
```

### Фаза 2: Source UI + Filters

```
Файли:
  src/components/ui/SourceChip.tsx       — toggle chip з логотипом та кількістю ігор
  src/components/report/SourceBar.tsx    — горизонтальна панель з чіпами
  src/components/report/SourceDots.tsx   — мінімальний індикатор в header кожного widget

Зміни:
  ReportDashboard.tsx — додати SourceBar між header і widgets
  FiltersDrawer.tsx   — інтегрувати source фільтри
  
Результат: можна toggle джерела on/off, widgets реагують
```

### Фаза 3: Widget Migration

```
Поступово мігруємо кожен widget на NormalizedGame[]:

1. Замінити хардкодовані mock дані на виклик gameStore.filteredGames()
2. Обчислювати stats з NormalizedGame[] замість хардкодованих чисел
3. Додати SourceDots в header кожного widget

Порядок міграції:
  1. ReportDashboard (KPI cards вгорі) — найпростіше
  2. MostPlayedOpenings — дебюти
  3. TimeControlsTable — розподіл по time controls
  4. ActivityHeatmap — активність по днях
  5. RatingDynamicsChart — графік рейтингу (окремі лінії!)
  6. TopOpponentsList — опоненти
  7. EloEstimateCard — оцінка FIDE рейтингу
```

### Фаза 4: Comparison Mode

```
Файли:
  src/store/comparisonStore.ts
  src/components/report/ComparisonPanel.tsx
  src/components/report/OpponentSearch.tsx     — пошук опонента по username

Результат: повна підготовка до матчу з опонентом
```

### Фаза 5: Persistence + Sync

```
Файли:
  src/utils/storage.ts     — localStorage з prefix wk_
  src/utils/sync.ts        — background refresh ігор
  
Логіка:
  - При першому завантаженні: fetch all games → normalize → save to localStorage
  - При повторних візитах: load from localStorage + fetch тільки нові (after lastUpdated)
  - Chess.com: fetch останній місяць (API по місяцях)
  - Lichess: fetch since=lastGameTimestamp
  - PGN: re-upload не потрібен (зберігається в localStorage)
```

---

## Технічні рішення: FAQ

### Q: Де парсити PGN?
**A:** У браузері. Використати бібліотеку `pgn-parser` або написати свій lightweight parser.
PGN — це текстовий формат, парсинг навіть 10K ігор займає < 1 сек в browser.

### Q: Як обробити великий обсяг даних?
**A:** Web Workers для парсингу + virtualized lists для UI.
- Парсинг 5K+ ігор — в Web Worker щоб не блокувати UI
- Списки (MostPlayedOpenings, TopOpponents) — virtual scroll

### Q: Де зберігати дані — localStorage чи IndexedDB?
**A:** localStorage для config/sources (~10KB). IndexedDB для ігор (~5MB для 5000 ігор).
- NormalizedGame без PGN string ≈ 500 bytes
- З PGN ≈ 2KB
- 5000 ігор ≈ 10MB — IndexedDB OK, localStorage limit

### Q: Що якщо API платформи повертає помилку?
**A:** Graceful degradation: показати дані які вже є з fallback повідомленням.
"Chess.com: 847 games (last synced 2 hours ago) ⚠️ Update failed — retry?"

### Q: CORS — як робити API calls з браузера?
**A:** 
- Lichess: CORS дозволений, можна напряму з фронтенду
- Chess.com: CORS дозволений для PubAPI
- Для обох: через proxy якщо потрібна автентифікація

### Q: Як обробити 10K+ ігор (активний гравець)?
**A:** Пагінація при імпорті + lazy aggregation.
- Chess.com: fetch по місяцях, починаючи з останнього
- Lichess: stream ndjson з параметром `max`
- Показуємо прогрес: "Importing... 2,847 / ~5,000 games"
