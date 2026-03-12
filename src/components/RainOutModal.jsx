import { useState } from 'react';
import { useTheme } from '../ThemeContext';

export default function RainOutModal({ weekDate, onCancelGames, onReschedule, onClose }) {
  const { colors } = useTheme();
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [mode, setMode] = useState("select"); // 'select' | 'reschedule'

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 100 }}>
      <div style={{ background: colors.BG, border: `1px solid ${colors.BORDER}`, borderRadius: 16, width: "100%", maxWidth: 440, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${colors.BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: colors.CARD }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: colors.TEXT }}>Rain Out Options</h3>
          <button onClick={onClose} style={{ background: "transparent", border: "none", color: colors.MUTED, fontSize: 24, cursor: "pointer", lineHeight: 1 }}>&times;</button>
        </div>

        <div style={{ padding: "24px 20px" }}>
          {mode === "select" ? (
             <>
                <p style={{ margin: "0 0 20px 0", color: colors.TEXT, fontSize: 15 }}>
                  The matches for <strong>{weekDate}</strong> were rained out. Would you like to cancel these matches entirely, or reschedule them to a new makeup date?
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    <button onClick={() => setMode("reschedule")} style={{
                        background: colors.BLUE, color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontWeight: 700, fontSize: 16, cursor: "pointer", textAlign: "center"
                    }}>
                        📅 Reschedule Matches
                    </button>
                    <button onClick={onCancelGames} style={{
                        background: colors.RED, color: "#fff", border: "none", borderRadius: 8, padding: "14px", fontWeight: 700, fontSize: 16, cursor: "pointer", textAlign: "center"
                    }}>
                        ❌ Cancel Matches Entirely
                    </button>
                </div>
             </>
          ) : (
             <>
                <h4 style={{ margin: "0 0 12px 0", color: colors.TEXT, fontSize: 16 }}>Select Makeup Date</h4>
                <p style={{ margin: "0 0 16px 0", color: colors.MUTED, fontSize: 14 }}>
                  The postponed matches will be added to the end of the schedule on this date.
                </p>
                <input 
                    type="date"
                    value={rescheduleDate}
                    onChange={(e) => setRescheduleDate(e.target.value)}
                    style={{ background: colors.INPUT_BG, border: `1px solid ${colors.BORDER}`, borderRadius: 6, padding: "12px", color: colors.INPUT_COLOR, fontSize: 16, width: "100%", outline: "none", boxSizing: "border-box", marginBottom: 20 }}
                />
                
                <div style={{ display: "flex", gap: 12 }}>
                    <button onClick={() => setMode("select")} style={{
                        flex: 1, background: colors.CARD, color: colors.TEXT, border: `1px solid ${colors.BORDER}`, borderRadius: 8, padding: "12px", fontWeight: 700, fontSize: 15, cursor: "pointer"
                    }}>
                        Back
                    </button>
                    <button 
                        onClick={() => onReschedule(rescheduleDate)} 
                        disabled={!rescheduleDate}
                        style={{
                            flex: 2, background: colors.GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "12px", fontWeight: 700, fontSize: 15, cursor: rescheduleDate ? "pointer" : "not-allowed", opacity: rescheduleDate ? 1 : 0.5
                        }}>
                        Confirm Reschedule
                    </button>
                </div>
             </>
          )}
        </div>
      </div>
    </div>
  );
}
