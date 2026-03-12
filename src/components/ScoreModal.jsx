import { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { FRAMES } from '../logic/constants';

export default function ScoreModal({ matchup, maxPts, onSave, onClose }) {
  const { colors } = useTheme();
  // Using generic "FRAMES" and "maxPts" for input bounds
  const [frames, setFrames] = useState(() =>
    matchup.frames.map((f) => f ? { a: String(f.a), b: String(f.b) } : { a: "", b: "" })
  );

  const updateFrame = (fi, team, val) => {
    setFrames((prev) => {
      const copy = prev.map((f) => ({ ...f }));
      copy[fi][team] = val;
      return copy;
    });
  };

  const handleSave = () => {
    const parsed = frames.map((f) => {
      const a = parseInt(f.a, 10), b = parseInt(f.b, 10);
      if (isNaN(a) || isNaN(b)) return null;
      return { a, b };
    });
    onSave(parsed);
  };

  const handleClear = () => onSave([null, null, null]);

  // Compute live frame wins
  let fA = 0, fB = 0;
  frames.forEach((f) => {
    const a = parseInt(f.a, 10), b = parseInt(f.b, 10);
    if (!isNaN(a) && !isNaN(b)) {
        if (a > b) fA++;
        else if (b > a) fB++;
    }
  });

  return (
    <div style={{ position: "fixed", inset: 0, background: colors.OVERLAY, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: colors.PANEL, border: `2px solid ${colors.BORDER}`, borderRadius: 16, padding: 24, width: 520, maxWidth: "95vw" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: colors.TEXT }}>Court {matchup.court} — Score</h3>
          <span style={{ background: colors.CARD, padding: "3px 10px", borderRadius: 6, fontSize: 12, color: colors.MUTED, fontWeight: 600 }}>
            {FRAMES} frames to {maxPts}
          </span>
        </div>
        <div style={{ color: colors.MUTED, fontSize: 12, marginBottom: 16 }}>
          {typeof matchup.court === "number" ? "Indoor" : "Outdoor"} Court
        </div>

        {/* Frame headers */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, marginBottom: 6 }}>
          <div style={{ textAlign: "center", fontWeight: 800, color: colors.TEXT, fontSize: 15 }}>{matchup.teamA}</div>
          <div />
          <div style={{ textAlign: "center", fontWeight: 800, color: colors.TEXT, fontSize: 15 }}>{matchup.teamB}</div>
        </div>

        {/* Frame inputs */}
        {[0, 1, 2].map((fi) => (
          <div key={fi} style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 8, marginBottom: 8, alignItems: "center" }}>
            <input type="number" min="0" max={maxPts}
              style={{
                  background: colors.INPUT_BG, border: `1px solid ${colors.BORDER}`, borderRadius: 6,
                  color: colors.INPUT_COLOR, fontSize: 22, fontWeight: 800, textAlign: "center", padding: 10, width: "100%", outline: "none", boxSizing: "border-box"
              }}
              value={frames[fi].a} onChange={(e) => updateFrame(fi, "a", e.target.value)}
              placeholder="0" autoFocus={fi === 0} />
            <div style={{ color: colors.MUTED, fontWeight: 700, fontSize: 12, textAlign: "center", minWidth: 60 }}>
              Frame {fi + 1}
            </div>
            <input type="number" min="0" max={maxPts}
              style={{
                  background: colors.INPUT_BG, border: `1px solid ${colors.BORDER}`, borderRadius: 6,
                  color: colors.INPUT_COLOR, fontSize: 22, fontWeight: 800, textAlign: "center", padding: 10, width: "100%", outline: "none", boxSizing: "border-box"
              }}
              value={frames[fi].b} onChange={(e) => updateFrame(fi, "b", e.target.value)}
              placeholder="0" />
          </div>
        ))}

        {/* Live summary */}
        <div style={{ textAlign: "center", padding: "8px 0 14px 0", fontSize: 14, fontWeight: 700 }}>
          <span style={{ color: fA > fB ? colors.GREEN : colors.MUTED }}>{matchup.teamA} {fA}</span>
          <span style={{ color: colors.MUTED, margin: "0 8px" }}>frames won</span>
          <span style={{ color: fB > fA ? colors.GREEN : colors.MUTED }}>{matchup.teamB} {fB}</span>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ background: colors.GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", flex: 1 }} onClick={handleSave}>Save Scores</button>
          {matchup.frames.some((f) => f !== null) && (
            <button style={{ background: colors.RED, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }} onClick={handleClear}>Clear</button>
          )}
          <button style={{ background: colors.MUTED, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}
