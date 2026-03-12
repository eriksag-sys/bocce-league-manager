import { useTheme } from '../ThemeContext';
import { getMatchResult } from '../logic/standings';
import { COURT_COLORS, COURTS } from '../logic/constants';

export default function CourtCard({ matchup, colorIdx, indoor, onClick }) {
  const { colors } = useTheme();
  // We use the same colors array but handled safely
  const idx = COURTS.indexOf(matchup.court);
  const color = COURT_COLORS[idx] || "#475569";

  const r = getMatchResult(matchup.frames);
  const scored = r.complete;
  const partial = matchup.frames.some((f) => f !== null) && !scored;

  return (
    <div onClick={onClick} style={{
      background: scored ? colors.DONE_BG : colors.CARD,
      border: `2px solid ${scored ? colors.DONE_BORDER : color}`, borderRadius: 12, padding: "8px 12px",
      display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
      minWidth: 0, flex: 1, cursor: "pointer", transition: "transform 0.1s",
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
    >
      <div style={{
        background: color, color: "#fff", fontWeight: 800, fontSize: 13,
        borderRadius: 6, padding: "2px 10px", letterSpacing: 1, textTransform: "uppercase",
        display: "flex", alignItems: "center", gap: 5,
      }}>
        Court {matchup.court}
        {indoor && <span style={{ fontSize: 9, opacity: 0.85 }}>(Indoor)</span>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, width: "100%", justifyContent: "center", marginTop: 2 }}>
        <div style={{
          flex: 1, textAlign: "center", fontWeight: 700, fontSize: 13, lineHeight: 1.2,
          padding: "4px 2px", background: "rgba(128,128,128,0.06)", borderRadius: 6,
          color: scored && r.framesA > r.framesB ? colors.GREEN : colors.TEXT,
        }}>
          {matchup.teamA}
          {(scored || partial) && (
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 3 }}>
              {matchup.frames.map((f, i) => (
                <span key={i} style={{
                  fontSize: 14, fontWeight: 900,
                  color: f ? (f.a > f.b ? colors.GREEN : f.a < f.b ? colors.RED : colors.MUTED) : colors.BORDER,
                }}>{f ? f.a : "-"}</span>
              ))}
            </div>
          )}
          {scored && <div style={{ fontSize: 11, color: colors.MUTED, marginTop: 1 }}>Frames: {r.framesA}</div>}
        </div>

        <div style={{ color: colors.YELLOW, fontWeight: 900, fontSize: 11, flexShrink: 0 }}>VS</div>

        <div style={{
          flex: 1, textAlign: "center", fontWeight: 700, fontSize: 13, lineHeight: 1.2,
          padding: "4px 2px", background: "rgba(128,128,128,0.06)", borderRadius: 6,
          color: scored && r.framesB > r.framesA ? colors.GREEN : colors.TEXT,
        }}>
          {matchup.teamB}
          {(scored || partial) && (
            <div style={{ display: "flex", justifyContent: "center", gap: 4, marginTop: 3 }}>
              {matchup.frames.map((f, i) => (
                <span key={i} style={{
                  fontSize: 14, fontWeight: 900,
                  color: f ? (f.b > f.a ? colors.GREEN : f.b < f.a ? colors.RED : colors.MUTED) : colors.BORDER,
                }}>{f ? f.b : "-"}</span>
              ))}
            </div>
          )}
          {scored && <div style={{ fontSize: 11, color: colors.MUTED, marginTop: 1 }}>Frames: {r.framesB}</div>}
        </div>
      </div>

      {!scored && !partial && <div style={{ fontSize: 10, color: colors.MUTED, marginTop: 1 }}>Tap to enter score</div>}
      {partial && <div style={{ fontSize: 10, color: colors.YELLOW, marginTop: 1 }}>In progress</div>}
    </div>
  );
}
