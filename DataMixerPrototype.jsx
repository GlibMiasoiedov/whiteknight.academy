import { useState, useEffect } from "react";

const SOURCE_CONFIG = {
  "chess.com": {
    name: "Chess.com",
    color: "#7FA650",
    games: 847,
    username: "hikaru",
    rating: 1523,
    ratingSystem: "Elo",
    lastSync: "2 хв тому",
  },
  lichess: {
    name: "Lichess",
    color: "#E8E8E8",
    games: 1203,
    username: "DrNykterstein",
    rating: 1847,
    ratingSystem: "Glicko-2",
    lastSync: "5 хв тому",
  },
  pgn: {
    name: "PGN файл",
    color: "#60A5FA",
    games: 156,
    username: "Tournament 2024",
    rating: null,
    ratingSystem: null,
    lastSync: "Вчора",
  },
};

const TIME_CLASSES = ["Всі", "Bullet", "Blitz", "Rapid", "Classical"];

const MOCK_OPENINGS = [
  { eco: "B20", name: "Sicilian Defense", games: 234, winRate: 76.6, drawRate: 11.2, lossRate: 12.2, sources: ["chess.com", "lichess"] },
  { eco: "C50", name: "Italian Game", games: 189, winRate: 71.2, drawRate: 14.8, lossRate: 14.0, sources: ["chess.com", "lichess", "pgn"] },
  { eco: "D06", name: "Queen's Gambit", games: 145, winRate: 58.3, drawRate: 22.1, lossRate: 19.6, sources: ["lichess"] },
  { eco: "C44", name: "Scotch Game", games: 98, winRate: 82.1, drawRate: 8.2, lossRate: 9.7, sources: ["chess.com"] },
  { eco: "A45", name: "Indian Defense", games: 87, winRate: 64.7, drawRate: 15.3, lossRate: 20.0, sources: ["chess.com", "pgn"] },
  { eco: "B01", name: "Scandinavian Defense", games: 76, winRate: 55.2, drawRate: 18.5, lossRate: 26.3, sources: ["lichess", "pgn"] },
  { eco: "C60", name: "Ruy Lopez", games: 62, winRate: 69.4, drawRate: 16.1, lossRate: 14.5, sources: ["chess.com", "lichess"] },
];

const MOCK_ACTIVITY = Array.from({ length: 26 * 7 }, () => ({
  games: Math.random() > 0.45 ? Math.floor(Math.random() * 10) + 1 : 0,
  source: ["chess.com", "lichess", "pgn"][Math.floor(Math.random() * 3)],
}));

const DAYS = ["Пн", "", "Ср", "", "Пт", "", ""];

function SourceDots({ sources, activeSources }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
      {Object.entries(SOURCE_CONFIG).map(([key, cfg]) => (
        <div key={key} style={{
          width: 6, height: 6, borderRadius: "50%",
          background: activeSources.includes(key) && sources.includes(key) ? cfg.color : "rgba(255,255,255,0.08)",
          transition: "all 0.4s ease",
          boxShadow: activeSources.includes(key) && sources.includes(key) ? `0 0 6px ${cfg.color}40` : "none",
        }} />
      ))}
    </div>
  );
}

function SourceCard({ config, enabled, onToggle, animDelay }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { const t = setTimeout(() => setMounted(true), animDelay); return () => clearTimeout(t); }, [animDelay]);

  return (
    <div onClick={onToggle} style={{
      flex: "1 1 200px", minWidth: 180,
      padding: "14px 16px", borderRadius: 14,
      border: `1px solid ${enabled ? config.color + "35" : "rgba(255,255,255,0.05)"}`,
      background: enabled ? `linear-gradient(135deg, ${config.color}12, ${config.color}06)` : "rgba(255,255,255,0.015)",
      cursor: "pointer",
      transition: "all 0.35s cubic-bezier(0.4,0,0.2,1)",
      opacity: mounted ? (enabled ? 1 : 0.4) : 0,
      transform: mounted ? "translateY(0)" : "translateY(12px)",
      position: "relative", overflow: "hidden",
    }}>
      {enabled && <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${config.color}80, ${config.color}20)` }} />}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 9, height: 9, borderRadius: "50%", background: config.color,
            boxShadow: enabled ? `0 0 10px ${config.color}50` : "none", transition: "box-shadow 0.3s",
          }} />
          <span style={{ fontSize: 12.5, fontWeight: 600, color: "#fff", letterSpacing: "-0.01em" }}>{config.name}</span>
        </div>
        <div style={{
          width: 16, height: 16, borderRadius: 4,
          border: `1.5px solid ${enabled ? config.color : "rgba(255,255,255,0.15)"}`,
          background: enabled ? config.color + "25" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 9, color: config.color, transition: "all 0.3s",
        }}>{enabled && "✓"}</div>
      </div>
      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.4)", marginBottom: 8, fontFamily: "monospace" }}>{config.username}</div>
      <div style={{ display: "flex", gap: 20 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{config.games.toLocaleString()}</div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>партій</div>
        </div>
        {config.rating && (
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{config.rating.toLocaleString()}</div>
            <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.08em" }}>{config.ratingSystem}</div>
          </div>
        )}
      </div>
      <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 8 }}>Оновлено: {config.lastSync}</div>
    </div>
  );
}

function WDLBar({ w, d, l }) {
  return (
    <div style={{ display: "flex", height: 5, borderRadius: 3, overflow: "hidden", width: 110, background: "rgba(255,255,255,0.04)" }}>
      <div style={{ width: `${w}%`, background: "#10B981", transition: "width 0.8s ease" }} />
      <div style={{ width: `${d}%`, background: "rgba(255,255,255,0.2)", transition: "width 0.8s ease" }} />
      <div style={{ width: `${l}%`, background: "#EF4444", transition: "width 0.8s ease" }} />
    </div>
  );
}

function OpeningRow({ opening, index, activeSources }) {
  const visible = opening.sources.some(s => activeSources.includes(s));
  if (!visible) return null;
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "24px 36px 1fr auto 110px 44px 44px",
      alignItems: "center", gap: 8, padding: "9px 16px",
      borderBottom: "1px solid rgba(255,255,255,0.03)", transition: "background 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.02)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)", textAlign: "center", fontFamily: "monospace" }}>{index + 1}</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "monospace" }}>{opening.eco}</span>
      <span style={{ fontSize: 12.5, color: "#fff", fontWeight: 500 }}>{opening.name}</span>
      <SourceDots sources={opening.sources} activeSources={activeSources} />
      <WDLBar w={opening.winRate} d={opening.drawRate} l={opening.lossRate} />
      <span style={{ fontSize: 11.5, fontWeight: 600, color: opening.winRate > 65 ? "#10B981" : opening.winRate > 50 ? "#F59E0B" : "#EF4444", textAlign: "right" }}>{opening.winRate}%</span>
      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", textAlign: "right" }}>{opening.games}</span>
    </div>
  );
}

function Heatmap({ activeSources }) {
  return (
    <div style={{ padding: "12px 16px 6px" }}>
      <div style={{ display: "flex", gap: 3 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 3, marginRight: 4 }}>
          {DAYS.map((d, i) => (
            <div key={i} style={{ height: 11, display: "flex", alignItems: "center" }}>
              <span style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", width: 14 }}>{d}</span>
            </div>
          ))}
        </div>
        {Array.from({ length: 26 }, (_, w) => (
          <div key={w} style={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {Array.from({ length: 7 }, (_, d) => {
              const cell = MOCK_ACTIVITY[w * 7 + d];
              const active = cell && activeSources.includes(cell.source);
              const intensity = active ? Math.min(cell.games / 8, 1) : 0;
              const clr = cell ? SOURCE_CONFIG[cell.source]?.color || "#8B5CF6" : "#8B5CF6";
              return (
                <div key={d} style={{
                  width: 11, height: 11, borderRadius: 2.5,
                  background: intensity > 0 ? `${clr}${Math.round(intensity * 180 + 40).toString(16).padStart(2, "0")}` : "rgba(255,255,255,0.025)",
                  transition: "all 0.5s ease",
                }} />
              );
            })}
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, marginTop: 10, paddingLeft: 18 }}>
        {Object.entries(SOURCE_CONFIG).map(([k, c]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 4, opacity: activeSources.includes(k) ? 0.7 : 0.15, transition: "opacity 0.4s" }}>
            <div style={{ width: 7, height: 7, borderRadius: 2, background: c.color }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>{c.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RatingChart({ activeSources }) {
  return (
    <div style={{ position: "relative", height: 140, margin: "8px 0 0" }}>
      {[2000, 1750, 1500, 1250].map((v, i) => (
        <div key={v} style={{ position: "absolute", left: 0, top: `${i * 33.3}%`, display: "flex", alignItems: "center", width: "100%" }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", width: 32, textAlign: "right", paddingRight: 8, fontFamily: "monospace" }}>{v}</span>
          <div style={{ flex: 1, borderTop: "1px solid rgba(255,255,255,0.025)" }} />
        </div>
      ))}
      <svg style={{ position: "absolute", left: 40, top: 0, width: "calc(100% - 48px)", height: "100%" }} viewBox="0 0 400 140" preserveAspectRatio="none">
        {activeSources.includes("lichess") && (<>
          <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#E8E8E8" stopOpacity="0.1" /><stop offset="100%" stopColor="#E8E8E8" stopOpacity="0" /></linearGradient></defs>
          <path d="M0,52 C30,50 60,48 100,42 C160,36 220,30 280,26 C340,23 380,20 400,18" fill="none" stroke="#E8E8E8" strokeWidth="2" opacity="0.5" />
          <path d="M0,52 C30,50 60,48 100,42 C160,36 220,30 280,26 C340,23 380,20 400,18 L400,140 L0,140Z" fill="url(#lg)" />
        </>)}
        {activeSources.includes("chess.com") && (<>
          <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7FA650" stopOpacity="0.1" /><stop offset="100%" stopColor="#7FA650" stopOpacity="0" /></linearGradient></defs>
          <path d="M0,88 C30,85 60,82 100,78 C160,72 220,66 280,60 C340,56 380,54 400,52" fill="none" stroke="#7FA650" strokeWidth="2" opacity="0.5" />
          <path d="M0,88 C30,85 60,82 100,78 C160,72 220,66 280,60 C340,56 380,54 400,52 L400,140 L0,140Z" fill="url(#cg)" />
        </>)}
      </svg>
      <div style={{ position: "absolute", bottom: 4, right: 8, display: "flex", gap: 14 }}>
        {activeSources.includes("lichess") && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 14, height: 2, background: "#E8E8E8", borderRadius: 1, opacity: 0.5 }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Lichess 1,847</span>
          </div>
        )}
        {activeSources.includes("chess.com") && (
          <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 14, height: 2, background: "#7FA650", borderRadius: 1, opacity: 0.5 }} />
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>Chess.com 1,523</span>
          </div>
        )}
      </div>
    </div>
  );
}

function KPI({ label, value, sub, sources, activeSources, delay }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <div style={{
      background: "linear-gradient(135deg, #0F1623, #0B1220)", border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: 14, padding: "14px 16px", flex: "1 1 130px",
      opacity: show ? 1 : 0, transform: show ? "translateY(0)" : "translateY(8px)",
      transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>{label}</span>
        <SourceDots sources={sources} activeSources={activeSources} />
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function WidgetCard({ title, icon, sources, activeSources, children, fullWidth }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #0F1623, #0B1220)", border: "1px solid rgba(255,255,255,0.05)",
      borderRadius: 14, overflow: "hidden", gridColumn: fullWidth ? "1 / -1" : undefined,
    }}>
      <div style={{
        padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 12 }}>{icon}</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "#fff", letterSpacing: "0.01em" }}>{title}</span>
        </div>
        <SourceDots sources={sources} activeSources={activeSources} />
      </div>
      {children}
    </div>
  );
}

function AlgorithmBlock() {
  const [expanded, setExpanded] = useState(false);
  const steps = [
    { n: "1", title: "Source Adapters", desc: "Chess.com JSON, Lichess ndjson, PGN — кожен формат має свій парсер" },
    { n: "2", title: "NormalizedGame", desc: "Єдиний TypeScript інтерфейс (~40 полів) — всі widgets працюють тільки з ним" },
    { n: "3", title: "Дедуплікація", desc: "Fingerprint = дата + гравці + перші 10 ходів → видаляє дублі між джерелами" },
    { n: "4", title: "Рейтинги", desc: "Зберігаємо оригінальну шкалу. Chess.com (Elo) ≠ Lichess (Glicko-2) — не конвертуємо" },
    { n: "5", title: "GameStore → Widgets", desc: "filteredGames() → кожен widget отримує готовий масив NormalizedGame[]" },
  ];

  return (
    <div style={{
      marginTop: 16, borderRadius: 14, overflow: "hidden",
      border: "1px solid rgba(139,92,246,0.12)",
      background: "linear-gradient(135deg, rgba(139,92,246,0.04), rgba(139,92,246,0.01))",
    }}>
      <div onClick={() => setExpanded(!expanded)} style={{
        padding: "12px 16px", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 13 }}>⚙️</span>
          <span style={{ fontSize: 11.5, fontWeight: 600, color: "rgba(139,92,246,0.8)" }}>Алгоритм міксування даних</span>
          <span style={{ fontSize: 9, color: "rgba(139,92,246,0.4)", marginLeft: 4 }}>натисніть для деталей</span>
        </div>
        <span style={{
          fontSize: 10, color: "rgba(139,92,246,0.5)",
          transform: expanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.3s", display: "inline-block",
        }}>▼</span>
      </div>
      <div style={{
        maxHeight: expanded ? 350 : 0, overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ padding: "0 16px 16px", display: "flex", flexDirection: "column", gap: 8 }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{
                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                background: "rgba(139,92,246,0.12)", display: "flex",
                alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700, color: "#A78BFA",
              }}>{s.n}</div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{s.title}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", lineHeight: 1.4, marginTop: 1 }}>{s.desc}</div>
              </div>
            </div>
          ))}
          <div style={{
            marginTop: 4, padding: "8px 10px", borderRadius: 8, background: "rgba(139,92,246,0.06)",
            fontSize: 9, color: "rgba(139,92,246,0.5)", lineHeight: 1.5, fontFamily: "monospace",
          }}>
            Source → Adapter → NormalizedGame[] → Dedup → GameStore → filteredGames() → Widget
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DataMixerPage() {
  const [activeSources, setActiveSources] = useState(["chess.com", "lichess", "pgn"]);
  const [timeClass, setTimeClass] = useState("Всі");
  const [viewMode, setViewMode] = useState("combined");

  const toggleSource = (k) => setActiveSources(p => p.includes(k) ? p.filter(x => x !== k) : [...p, k]);
  const totalGames = activeSources.reduce((s, k) => s + (SOURCE_CONFIG[k]?.games || 0), 0);
  const visibleOpenings = MOCK_OPENINGS.filter(o => o.sources.some(s => activeSources.includes(s)));

  const viewModes = [
    { id: "combined", label: "Агреговано", icon: "⊕" },
    { id: "split", label: "По джерелах", icon: "▥" },
    { id: "compare", label: "vs Опонент", icon: "⇔" },
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#080C14", fontFamily: "'Manrope', -apple-system, sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: 240, minHeight: "100vh", background: "#080C14",
        borderRight: "1px solid rgba(255,255,255,0.05)", padding: "20px 12px", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 8px", marginBottom: 28 }}>
          <span style={{ fontSize: 24 }}>♞</span>
          <div style={{ fontFamily: "'Unbounded', sans-serif", fontWeight: 700, fontSize: 13, color: "#fff", lineHeight: 1.2, letterSpacing: "-0.02em" }}>Chess<br />Analytics</div>
        </div>
        <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", padding: "4px 12px 6px", textTransform: "uppercase" }}>Platform</div>
        {[
          { id: "home", label: "Home (Data Hub)", icon: "◈" },
          { id: "report", label: "Report", icon: "◫" },
          { id: "mixer", label: "Data Mixer", icon: "⊕", badge: "NEW" },
          { id: "coaching", label: "Coaching", icon: "♟" },
          { id: "integrations", label: "Apps / Integrations", icon: "⊞" },
        ].map(item => {
          const active = item.id === "mixer";
          return (
            <div key={item.id} style={{
              display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", margin: "1px 0",
              borderRadius: 10,
              background: active ? "rgba(139,92,246,0.1)" : "transparent",
              borderLeft: active ? "3px solid #8B5CF6" : "3px solid transparent",
              cursor: "pointer",
            }}>
              <span style={{ fontSize: 14, opacity: active ? 0.9 : 0.35 }}>{item.icon}</span>
              <span style={{ fontSize: 12, fontWeight: active ? 600 : 400, color: active ? "#fff" : "rgba(255,255,255,0.45)" }}>{item.label}</span>
              {item.badge && (
                <span style={{ marginLeft: "auto", fontSize: 8, fontWeight: 700, padding: "1.5px 5px", borderRadius: 4, background: "rgba(139,92,246,0.2)", color: "#A78BFA" }}>{item.badge}</span>
              )}
            </div>
          );
        })}
        <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.25)", letterSpacing: "0.15em", padding: "16px 12px 6px", textTransform: "uppercase" }}>AI Features</div>
        {[
          { label: "AI Coach", icon: "◎", tag: "PRO" },
          { label: "Opening Lab", icon: "◉", locked: true },
        ].map(item => (
          <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", opacity: item.locked ? 0.3 : 0.5, cursor: "pointer" }}>
            <span style={{ fontSize: 14 }}>{item.icon}</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{item.label}</span>
            {item.tag && <span style={{ marginLeft: "auto", fontSize: 8, fontWeight: 700, padding: "1.5px 6px", borderRadius: 4, background: "linear-gradient(135deg, #F59E0B, #D97706)", color: "#000" }}>{item.tag}</span>}
            {item.locked && <span style={{ marginLeft: "auto", fontSize: 10, opacity: 0.6 }}>🔒</span>}
          </div>
        ))}
      </div>

      {/* Main */}
      <div style={{ flex: 1, padding: "20px 28px", overflow: "auto", maxHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0, fontFamily: "'Unbounded', sans-serif", display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 18, opacity: 0.7 }}>⊕</span>Data Mixer
            </h1>
            <p style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", margin: "4px 0 0" }}>Агрегуй та аналізуй партії з chess.com, lichess та PGN файлів</p>
          </div>
          <div style={{ display: "flex", gap: 3, background: "rgba(255,255,255,0.03)", borderRadius: 9, padding: 2.5 }}>
            {viewModes.map(m => (
              <button key={m.id} onClick={() => setViewMode(m.id)} style={{
                padding: "5px 12px", borderRadius: 7, border: "none",
                background: viewMode === m.id ? "rgba(139,92,246,0.15)" : "transparent",
                color: viewMode === m.id ? "#A78BFA" : "rgba(255,255,255,0.35)",
                fontSize: 11, fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 5,
              }}>
                <span style={{ fontSize: 11 }}>{m.icon}</span>{m.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          {Object.entries(SOURCE_CONFIG).map(([k, c], i) => (
            <SourceCard key={k} config={c} enabled={activeSources.includes(k)} onToggle={() => toggleSource(k)} animDelay={i * 80} />
          ))}
          <div style={{
            flex: "0 0 80px", borderRadius: 14, border: "1px dashed rgba(255,255,255,0.08)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", gap: 4,
          }}>
            <span style={{ fontSize: 20, color: "rgba(255,255,255,0.15)" }}>+</span>
            <span style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Додати</span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 5, marginBottom: 16, alignItems: "center" }}>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", textTransform: "uppercase", letterSpacing: "0.1em", marginRight: 2 }}>Час:</span>
          {TIME_CLASSES.map(tc => (
            <button key={tc} onClick={() => setTimeClass(tc)} style={{
              padding: "3px 10px", borderRadius: 6, border: "none",
              background: timeClass === tc ? "rgba(139,92,246,0.15)" : "rgba(255,255,255,0.03)",
              color: timeClass === tc ? "#A78BFA" : "rgba(255,255,255,0.3)",
              fontSize: 10.5, fontWeight: 500, cursor: "pointer", transition: "all 0.2s",
            }}>{tc}</button>
          ))}
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 10, color: "rgba(255,255,255,0.2)" }}>{totalGames.toLocaleString()} партій · {activeSources.length} джерел</span>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
          <KPI label="Всього партій" value={totalGames.toLocaleString()} sub="з усіх джерел" sources={activeSources} activeSources={activeSources} delay={200} />
          <KPI label="Win Rate" value={activeSources.length ? "64.3%" : "—"} sub="W 64 · D 18 · L 18" sources={["chess.com", "lichess"]} activeSources={activeSources} delay={280} />
          <KPI label="Найвищий рейтинг" value={activeSources.includes("lichess") ? "1,847" : activeSources.includes("chess.com") ? "1,523" : "—"} sub={activeSources.includes("lichess") ? "Lichess Glicko-2" : "Chess.com Elo"} sources={["lichess", "chess.com"]} activeSources={activeSources} delay={360} />
          <KPI label="Accuracy" value={activeSources.includes("chess.com") ? "78.4%" : "n/a"} sub={activeSources.includes("chess.com") ? "Chess.com" : "Потрібен Chess.com"} sources={["chess.com"]} activeSources={activeSources} delay={440} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <WidgetCard title="Дебютний репертуар" icon="⚔️" sources={["chess.com", "lichess", "pgn"]} activeSources={activeSources}>
            <div style={{ maxHeight: 280, overflow: "auto" }}>
              {visibleOpenings.length > 0 ? (<>
                <div style={{ display: "grid", gridTemplateColumns: "24px 36px 1fr auto 110px 44px 44px", gap: 8, padding: "6px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  {["#", "ECO", "Назва", "", "W / D / L", "Win%", "N"].map((h, i) => (
                    <span key={i} style={{ fontSize: 8, color: "rgba(255,255,255,0.2)", textTransform: "uppercase", letterSpacing: "0.1em", textAlign: i > 4 ? "right" : "left" }}>{h}</span>
                  ))}
                </div>
                {visibleOpenings.map((o, i) => <OpeningRow key={o.eco} opening={o} index={i} activeSources={activeSources} />)}
              </>) : (
                <div style={{ padding: 40, textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 11 }}>Оберіть хоча б одне джерело</div>
              )}
            </div>
          </WidgetCard>

          <WidgetCard title="Активність" icon="📊" sources={["chess.com", "lichess", "pgn"]} activeSources={activeSources}>
            <Heatmap activeSources={activeSources} />
          </WidgetCard>

          <WidgetCard title="Динаміка рейтингу" icon="📈" sources={["chess.com", "lichess"]} activeSources={activeSources} fullWidth>
            <div style={{ padding: "4px 16px 12px" }}>
              <RatingChart activeSources={activeSources} />
              {activeSources.includes("chess.com") && activeSources.includes("lichess") && (
                <div style={{ marginTop: 10, padding: "7px 10px", borderRadius: 7, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.1)", fontSize: 9.5, color: "rgba(245,158,11,0.6)", display: "flex", alignItems: "center", gap: 6 }}>
                  ⚠️ Рейтинги Chess.com та Lichess використовують різні шкали — пряме порівняння некоректне
                </div>
              )}
            </div>
          </WidgetCard>
        </div>

        <AlgorithmBlock />
      </div>
    </div>
  );
}
