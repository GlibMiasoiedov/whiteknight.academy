# White Knight Analytics — Dashboard & Report IA Spec (v1)

## 0) Goal & Product Positioning (what we ship and what we **don’t**)
**Goal:** a premium chess performance report that converts analytics into **actionable coaching** (group lessons + 1:1 coaches). The report should feel “dense but friendly”: high information value like ChessMonitor + clear interpretation like Aimchess, with our unique differentiators:

- **Compare Mode:** compare user vs any opponent/player (Chess.com/Lichess profile connect OR manual input).
- **Biometrics Overlay:** stress / heart rate / fatigue / focus indicators layered onto game phases & decision quality.

**Not in scope:** built-in interactive puzzles/missions/training drills. Instead we provide: (1) diagnosis, (2) what to improve, (3) best next action: join a group / book a coach.

---

## 1) Current Layout (keep the good parts)
We keep the existing “3-column” layout:
- **Left Sidebar:** primary navigation.
- **Main Content:** page content.
- **Right Panel:** context panel (setup checklist, recommendations, AI Coach, filters) — collapsible.
- **Bottom-left User Card:** profile + quick settings, billing, privacy (keep as-is).

**Design philosophy:** evolve, don’t rebuild.

---

## 2) Global Navigation (Left Sidebar)
### 2.1 Primary Tabs
1) **Home (Data Hub)**
   - Purpose: connect accounts, manage imports, pick time controls, set goals/preferences.

2) **Report** (core)
   - Purpose: full analytics dashboard + recommendations + compare + biometrics.

3) **Coaching**
   - Purpose: groups & coaches discovery, booking, waitlists, scheduling.

4) **Apps / Integrations**
   - Purpose: connect biometrics provider(s), manage permissions, API keys, data export.

### 2.2 Optional / Pro Features (keep existing if you want, but ensure consistency)
- **AI Coach (Pro)**
  - If kept: the AI experience should also be visible inside Report as a right-panel assistant.
- **Opening Lab**
  - If kept: Opening deep-dive; also referenced from Report → Opening section.

> **Comment:** Don’t create too many top-level items. 4 primary tabs is clean. Optional items should either live inside Report sub-tabs or be clearly “labs”.

---

## 3) Right Panel (Context Panel)
The right panel is dynamic and changes per page.

### 3.1 Home (Data Hub) Right Panel
- **Setup Checklist** (already exists)
- **Recommended Groups** (already exists)
- **Next Step CTA**: “Generate Report” (disabled until minimum data)

### 3.2 Report Right Panel (key upgrade)
Right panel becomes a **multi-mode drawer** with 3 tabs:
1) **Insights** (default)
   - Top 3 weaknesses (ranked)
   - Top 3 strengths
   - “Next Best Actions” (Join Group / Book Coach)

2) **AI Coach**
   - Chat + context chips (e.g., “Explain my opening weakness”, “Compare vs Opponent”, “Why is my endgame score low?”)
   - Auto-insert: current filters + selected chart context

3) **Filters**
   - Global filter controls (see section 4)

> **Comment:** Keep right panel slim; allow collapse. On mobile, right panel becomes a slide-over.

---

## 4) Global Filters (apply everywhere in Report)
Filters must be consistent, visible, and never “reset unexpectedly”.

### 4.1 Filter Bar Placement
- **Primary filter bar** at top of Report main content (sticky on scroll).
- Secondary “Filters” tab in right panel for advanced filters.

### 4.2 Filters (Minimum)
- **Time range:** last 7/14/30/90 days, YTD, custom
- **Time control:** bullet / blitz / rapid / classical (multi-select)
- **Platform/source:** Chess.com / Lichess / Uploaded PGN / Masters DB
- **Rated only toggle**
- **Color:** white / black / both
- **Opponent strength range** (rating band)

### 4.3 Advanced Filters (optional)
- Opening/ECO filter
- Opponent name search
- Game length range
- Result filter (W/D/L)

> **Comment:** Default view should use 30 days + blitz (if user mostly plays blitz) OR “most played” time control auto-selected.

---

## 5) Report Information Architecture (IA)
Report should feel like a “story”:
1) Summary → 2) Deep-dive sections → 3) Action plan (groups/coaches).

### 5.1 Report Sub-tabs (top-level inside Report)
Use a horizontal sub-nav (tabs) under the Report title.

1) **Overview**
2) **Openings**
3) **Middlegame & Tactics**
4) **Endgame**
5) **Time & Habits**
6) **Opponents & Matchups**
7) **Compare (vs Player)** *(our differentiator)*
8) **Biometrics** *(our differentiator; hidden if not connected)*
9) **Action Plan** *(coaching conversion page)*

> **Comment:** Keep 7–9 tabs max. If too much, merge “Opponents” + “Compare” into one “Opponents” tab with a “Compare” mode.

---

## 6) Report — Overview (Structure)
### 6.1 Header Card (above-the-fold)
- Player identity (name + connected sources)
- Primary rating + trend (sparkline)
- Win/Draw/Loss split
- “Confidence” indicator (data volume quality)

### 6.2 Performance Radar / Dimensions (Aimchess inspiration)
A 5–7 dimension score summary (0–100):
- Opening
- Tactics
- Endgame
- Advantage Conversion
- Resourcefulness (playing from worse positions)
- Time Management
- Consistency (optional)

Each dimension card includes:
- Score
- Trend vs previous period
- One-line interpretation
- “See details” deep link

### 6.3 “Top Insights” Strip
- 3 biggest weaknesses (with severity)
- 3 best strengths
- 1 “focus theme” for next 2 weeks

### 6.4 Next Best Actions (CTA cluster)
- **Join a Group**: show 2–3 recommended groups with matching tags
- **Book a Coach**: show 1–2 coaches with specialization tags

> **Comment:** Every page should have at least one clear action CTA without feeling spammy.

---

## 7) Report — Openings
### 7.1 Opening Health Summary
- “Score at move 10 / move 15” (Aimchess idea)
- Separate White vs Black performance
- Top winning openings vs top losing openings

### 7.2 Opening Tables (ChessMonitor inspiration)
Two tables:
- **As White:** Most played openings (ECO, name, games, win/draw/loss, avg eval after move 10/15)
- **As Black:** Same

### 7.3 Opening Mistake Patterns
- Most common early mistakes (by piece move type): e.g., premature queen moves, missed development, king safety
- “Theme tags” that map to coaching offerings

### 7.4 Recommendations
- “If you want a simple fix”: 1 recommended opening repertoire direction (high-level)
- CTA: “Join Opening Fundamentals group” / “Book Coach for Opening Prep”

> **Comment:** Avoid teaching opening theory inside the report. Provide diagnostics + direction + coaching path.

---

## 8) Report — Middlegame & Tactics
### 8.1 Mistake Breakdown (Aimchess style)
- Inaccuracies / Mistakes / Blunders per game
- Compare vs opponents average (same rating band)

### 8.2 Tactical Motifs Heatmap
- Missed tactics categories (fork, pin, skewer, discovered attack, back rank, hanging pieces)
- When they occur: early/mid/late

### 8.3 Advantage Capitalization
- How often user converts when +1 / +3 / +5
- Time used during winning positions

### 8.4 Recommendations
- “Primary leak” + what causes it
- CTA to relevant group/coach specialization

> **Comment:** We’re not building tactics training. Instead we output *what type of tactics you miss* and *which coaching sessions address it*.

---

## 9) Report — Endgame
### 9.1 Endgame Entry Quality
- How often user reaches endgame
- Eval swing after move 30+ (or after queen trade)

### 9.2 Endgame Themes
- Rook endgames, pawn endgames, minor piece endgames
- Conversion / defense rates

### 9.3 Practical Endgame Issues
- Time trouble in endgames
- Blunders in low material positions

### 9.4 Recommendations
- “Endgame Plan”: 2–3 priorities
- CTA: “Rook Endgames group” etc.

---

## 10) Report — Time & Habits (ChessMonitor inspiration)
### 10.1 Time Management
- Time usage per phase
- Time trouble frequency
- Blunders under time pressure

### 10.2 Activity Calendar (heatmap)
- Games per day/week
- Best performance windows (optional)

### 10.3 Tilt / Consistency
- Performance after losses (streak analysis)
- Win rate by session length

### 10.4 Recommendations
- “Personal routine suggestion” (non-medical)
- CTA: “Time Management group” / coach specialization

---

## 11) Report — Opponents & Matchups (ChessMonitor inspiration)
### 11.1 Opponent List
- Most played opponents
- Results vs each
- Rating delta vs opponent

### 11.2 Termination Breakdown
- Win by: checkmate / resign / timeout
- Loss by: checkmate / resign / timeout

### 11.3 Player Archetypes (optional)
- Opponents who play fast vs slow
- Aggressive vs positional (heuristic)

---

## 12) Compare Mode (our differentiator)
**Purpose:** show user vs target player head-to-head *and* style differences.

### 12.1 Entry
- Choose: opponent from your games OR search/enter username (Chess.com/Lichess) OR manual PGN upload

### 12.2 Compare Dashboard
Side-by-side cards:
- Win rate by color
- Opening repertoire overlap
- Mistake profile comparison
- Time pressure sensitivity
- Endgame strength

### 12.3 Output
- “If you play this opponent again” guidance:
  - avoid X openings
  - aim for Y structures
  - watch for Z tactic motifs
- CTA: “Train for Match” group / coach

> **Comment:** This is a major monetization hook. Make it feel special and polished.

---

## 13) Biometrics Overlay (our differentiator)
Biometrics data is shown only if connected and user opted in.

### 13.1 Biometrics Summary
- Stress / HR / fatigue score by session
- Correlation indicators (e.g., “Blunders increase when HR > X”)

### 13.2 Overlay Views
- **Timeline overlay:** chart with game events (blunders, eval swings) aligned with stress/HR
- **Phase overlay:** opening/middlegame/endgame vs biometrics averages

### 13.3 Recommendations
- Non-medical suggestions:
  - breaks, hydration reminder, limit session length, warm-up routine
- CTA: “Performance under pressure” group / coach

> **Comment (privacy):** clear consent + ability to disconnect/delete biometrics. Don’t imply medical diagnosis.

---

## 14) Action Plan (conversion-friendly)
A dedicated tab that compiles everything into a simple plan.

### 14.1 Priority Ladder (Top 3)
- Priority #1 (largest impact)
- Priority #2
- Priority #3

Each has:
- What it is (plain English)
- Evidence (charts / stats)
- Recommended group(s)
- Recommended coach(es)

### 14.2 Suggested Schedule
- 2-week and 4-week plan
- “Recommended groups this week” list

> **Comment:** This tab is the “sales page” inside the product, but must feel helpful first.

---

## 15) Empty / Locked States (important UX)
### 15.1 Report Locked (your current screen)
Keep the existing layout but improve messaging:
- Show **preview skeleton** of report sections (blurred or disabled) to increase motivation.
- Clear steps:
  1) Connect Chess.com or Lichess (or Upload PGN)
  2) Choose time control + date range
  3) Generate Report

### 15.2 Not Enough Data
If < N games in selected period:
- explain “low confidence”
- suggest expanding date range

### 15.3 Pro vs Free
- Free: limited overview + 1–2 insights + coaching CTA
- Pro: full report + compare + biometrics overlays + export

---

## 16) Visual & Interaction Guidelines (for the designer/dev)
- Use **progressive disclosure**: overview first, deep details on click.
- Use consistent components:
  - cards with title + metric + tiny trend
  - tables with sticky headers
  - “Interpretation” text block (1–3 lines)
  - “Next Action” CTA block (group/coach)
- Make charts interactive:
  - hover tooltips
  - click-to-filter (e.g., click an opening → filters table + insights)
- Keep purple brand accents, but avoid large purple blocks everywhere.

---

## 17) Implementation Notes (engineering)
- Data model should support:
  - multiple sources per user (Chess.com, Lichess, PGN)
  - unified game schema
  - computed metrics per filter set (cache)
  - “confidence score” per metric
  - compare-mode queries for external player
  - biometrics time alignment (timestamp normalization)

- URL state:
  - store filters in query params for shareable links

- Export:
  - allow “Download PDF summary” or “Export CSV” for tables (Pro)

---

## 18) Proposed Minimal v1 (if you want to ship faster)
**Report tabs for v1:** Overview, Openings, Tactics, Endgame, Compare, Action Plan.
Biometrics = optional beta.

---

## 19) Summary (what to tell the programmer)
- Keep 3-column layout.
- Report becomes a multi-tab analytics product with a sticky filter bar.
- Right panel has Insights / AI Coach / Filters.
- Every analytics section ends with recommended Groups/Coaches CTAs.
- No puzzles/training modules — only diagnosis + recommendation + booking.
- Two unique differentiators: Compare Mode + Biometrics overlays.

