import { useState } from 'react';
import { useTheme } from '../ThemeContext';
import { SEASONS, LEAGUE_CONFIGS, emptyTeams } from '../logic/constants';
import { getRandomTeams, formatDate } from '../logic/helpers';

export default function SetupView({ seasonDates, setSeasonDates, holidays, setHolidays, leagueTeams, setLeagueTeams, onGenerate, schedules, activeSeason, setActiveSeason }) {
  const { colors } = useTheme();
  const [newHol, setNewHol] = useState("");
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState([]);

  const sd = seasonDates[activeSeason] || { start: "", end: "" };
  const hols = holidays[activeSeason] || [];

  const startEdit = (key) => { 
    setEditing(key); 
    const existing = leagueTeams[`${activeSeason}_${key}`] || emptyTeams();
    const migrated = existing.map((t, i) => typeof t === 'string' ? { name: t, division: i < 10 ? 'upper' : 'lower' } : { ...t });
    setDraft(migrated); 
  };
  const saveTeams = () => { setLeagueTeams((p) => ({ ...p, [`${activeSeason}_${editing}`]: [...draft] })); setEditing(null); };
  const fillRandom = () => setDraft(getRandomTeams());
  const teamsCount = (key) => {
    const teams = leagueTeams[`${activeSeason}_${key}`] || [];
    const valid = teams.filter((t) => typeof t === 'string' ? t.trim() : t.name.trim());
    const upper = valid.filter((t, i) => (typeof t === 'string' ? i < 10 : t.division === 'upper')).length;
    const lower = valid.filter((t, i) => (typeof t === 'string' ? i >= 10 : t.division === 'lower')).length;
    return { total: valid.length, upper, lower };
  };

  const dayLeagues = Object.entries(LEAGUE_CONFIGS).filter(([, v]) => v.type === "daytime");
  const eveLeagues = Object.entries(LEAGUE_CONFIGS).filter(([, v]) => v.type === "evening");

  if (editing) {
    const cfg = LEAGUE_CONFIGS[editing];
    return (
      <div style={{ padding: "16px 20px", maxWidth: 1200, margin: "0 auto", fontFamily: "inherit" }}>
        <button onClick={() => setEditing(null)} style={{ background: colors.CARD, color: colors.TEXT, border: `1px solid ${colors.BORDER}`, borderRadius: 6, padding: "5px 12px", fontWeight: 600, fontSize: 12, cursor: "pointer", marginBottom: 12 }}>&larr; Back</button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: colors.TEXT, margin: 0 }}>{SEASONS[activeSeason].icon} {SEASONS[activeSeason].label} — {cfg.label}</h2>
          <button onClick={fillRandom} style={{
            background: colors.BLUE, color: "#fff", border: "none", borderRadius: 8, padding: "8px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
          }}>
            🎲 Fill Random Teams
          </button>
        </div>
        <div style={{ color: colors.MUTED, fontSize: 12, marginBottom: 10 }}>
          {cfg.type === "daytime" ? "3 frames to 10 points" : "3 frames to 12 points"}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
          {draft.map((team, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: colors.MUTED, fontWeight: 700, fontSize: 12, minWidth: 22, textAlign: "right" }}>{i + 1}.</span>
              <input style={{ background: colors.INPUT_BG, border: `1px solid ${colors.BORDER}`, borderRadius: 6, padding: "7px 10px", color: colors.INPUT_COLOR, fontSize: 14, width: "100%", outline: "none", boxSizing: "border-box" }} placeholder={`Team ${i + 1}`} value={team.name}
                onChange={(e) => { const c = [...draft]; c[i].name = e.target.value; setDraft(c); }} />
              <button title="Click to change division" onClick={() => { const c = [...draft]; c[i].division = c[i].division === "upper" ? "lower" : "upper"; setDraft(c); }} style={{ background: team.division === "upper" ? colors.BLUE : colors.CARD, color: team.division === "upper" ? "#fff" : colors.MUTED, border: `1px solid ${team.division === "upper" ? colors.BLUE : colors.BORDER}`, borderRadius: 6, padding: "5px 4px", fontSize: 10, fontWeight: 800, cursor: "pointer", minWidth: 44 }}>
                {team.division === "upper" ? "UP" : "LOW"}
              </button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
          <button style={{ background: colors.GREEN, color: "#fff", border: "none", borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }} onClick={saveTeams}>Save Teams</button>
          <button style={{ background: colors.CARD, color: colors.TEXT, border: `1px solid ${colors.BORDER}`, borderRadius: 8, padding: "9px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer" }} onClick={() => setEditing(null)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "16px 20px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 4, background: colors.CARD, border: `1px solid ${colors.BORDER}`, borderRadius: 8, padding: 3, marginBottom: 12 }}>
        {Object.entries(SEASONS).map(([key, s]) => (
          <button key={key} onClick={() => setActiveSeason(key)} style={{
            padding: "6px 18px", borderRadius: 6, border: "none", cursor: "pointer",
            fontWeight: 700, fontSize: 14, background: activeSeason === key ? s.color : "transparent",
            color: activeSeason === key ? "#fff" : colors.MUTED,
          }}>{s.icon} {s.label}</button>
        ))}
      </div>

      <div style={{ background: colors.CARD, border: `1px solid ${colors.BORDER}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: colors.TEXT, margin: "0 0 10px 0" }}>{SEASONS[activeSeason].icon} {SEASONS[activeSeason].label} Season Dates</h3>
        <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontWeight: 700, fontSize: 13, color: colors.MUTED, marginBottom: 4, display: "block" }}>Start Date</label>
            <input type="date" style={{ background: colors.INPUT_BG, border: `1px solid ${colors.BORDER}`, borderRadius: 6, padding: "7px 10px", color: colors.INPUT_COLOR, fontSize: 14, width: "100%", outline: "none", boxSizing: "border-box" }} value={sd.start}
              onChange={(e) => setSeasonDates((p) => ({ ...p, [activeSeason]: { ...p[activeSeason], start: e.target.value } }))} />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label style={{ fontWeight: 700, fontSize: 13, color: colors.MUTED, marginBottom: 4, display: "block" }}>End Date</label>
            <input type="date" style={{ background: colors.INPUT_BG, border: `1px solid ${colors.BORDER}`, borderRadius: 6, padding: "7px 10px", color: colors.INPUT_COLOR, fontSize: 14, width: "100%", outline: "none", boxSizing: "border-box" }} value={sd.end}
              onChange={(e) => setSeasonDates((p) => ({ ...p, [activeSeason]: { ...p[activeSeason], end: e.target.value } }))} />
          </div>
        </div>
      </div>

      <div style={{ background: colors.CARD, border: `1px solid ${colors.BORDER}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: colors.TEXT, margin: "0 0 10px 0" }}>Holidays / Excluded Dates</h3>
        <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
          <input type="date" style={{ background: colors.INPUT_BG, border: `1px solid ${colors.BORDER}`, borderRadius: 6, padding: "7px 10px", color: colors.INPUT_COLOR, fontSize: 14, flex: 1, outline: "none", boxSizing: "border-box" }} value={newHol} onChange={(e) => setNewHol(e.target.value)} />
          <button style={{ background: colors.BLUE, color: "#fff", border: "none", borderRadius: 6, padding: "5px 12px", fontWeight: 600, fontSize: 12, cursor: "pointer" }} onClick={() => {
            if (newHol && !hols.includes(newHol)) { setHolidays((p) => ({ ...p, [activeSeason]: [...(p[activeSeason] || []), newHol].sort() })); setNewHol(""); }
          }}>Add</button>
        </div>
        {hols.length === 0 ? <div style={{ color: colors.MUTED, fontSize: 12 }}>None</div> : (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {hols.map((h) => (
              <span key={h} style={{ background: colors.INPUT_BG, padding: "3px 8px", borderRadius: 5, fontSize: 12, display: "flex", alignItems: "center", gap: 5, color: colors.TEXT, border: `1px solid ${colors.BORDER}` }}>
                {formatDate(h)}
                <span onClick={() => setHolidays((p) => ({ ...p, [activeSeason]: p[activeSeason].filter((x) => x !== h) }))}
                  style={{ cursor: "pointer", color: colors.RED, fontWeight: 700 }}>&times;</span>
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ background: colors.CARD, border: `1px solid ${colors.BORDER}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: colors.TEXT, margin: "0 0 10px 0" }}>Daytime Leagues — 3 Frames to 10</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {dayLeagues.map(([key, cfg]) => {
            const counts = teamsCount(key);
            const ok = counts.upper === 10 && counts.lower === 10;
            return (
              <button key={key} onClick={() => startEdit(key)} style={{
                flex: 1, minWidth: 160, background: ok ? colors.DONE_BG : colors.INPUT_BG,
                border: `2px solid ${ok ? colors.GREEN : colors.BORDER}`, borderRadius: 10, padding: 14, cursor: "pointer", textAlign: "left",
              }}>
                <div style={{ color: colors.TEXT, fontWeight: 800, fontSize: 15 }}>☀️ {cfg.label}</div>
                <div style={{ color: ok ? colors.GREEN : colors.MUTED, fontSize: 12, marginTop: 3 }}>{counts.total}/20 ({counts.upper}U, {counts.lower}L) {ok && "✔"}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ background: colors.CARD, border: `1px solid ${colors.BORDER}`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: colors.TEXT, margin: "0 0 10px 0" }}>Evening Leagues — 3 Frames to 12</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {eveLeagues.map(([key, cfg]) => {
            const counts = teamsCount(key);
            const ok = counts.upper === 10 && counts.lower === 10;
            return (
              <button key={key} onClick={() => startEdit(key)} style={{
                background: ok ? colors.ACTIVE_BG : colors.INPUT_BG,
                border: `2px solid ${ok ? colors.BLUE : colors.BORDER}`, borderRadius: 10, padding: 12, cursor: "pointer", textAlign: "left",
              }}>
                <div style={{ color: colors.TEXT, fontWeight: 800, fontSize: 14 }}>🌙 {cfg.label}</div>
                <div style={{ color: ok ? colors.BLUE : colors.MUTED, fontSize: 12, marginTop: 3 }}>{counts.total}/20 ({counts.upper}U, {counts.lower}L) {ok && "✔"}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: 6 }}>
        <button style={{ background: colors.YELLOW, color: "#000", border: "none", borderRadius: 8, padding: "12px 40px", fontWeight: 700, fontSize: 16, cursor: "pointer" }} onClick={onGenerate}>
          Generate {SEASONS[activeSeason].label} Schedules
        </button>
        {Object.keys(schedules).some((k) => k.startsWith(activeSeason)) && (
          <div style={{ color: colors.GREEN, fontSize: 12, marginTop: 6, fontWeight: 700 }}>Schedules generated!</div>
        )}
      </div>
    </div>
  );
}
