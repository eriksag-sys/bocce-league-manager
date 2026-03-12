import { useTheme } from '../ThemeContext';
import { LEAGUE_CONFIGS } from '../logic/constants';
import { computeStandings } from '../logic/standings';

export default function StandingsView({ schedules, activeSeason, activeLeague, leagueTeams, division }) {
  const { colors } = useTheme();

  const schedKey = `${activeSeason}_${activeLeague}`;
  const sched = schedules[schedKey] || [];
  const allTeams = leagueTeams ? (leagueTeams[schedKey] || []) : [];
  
  const divTeams = new Set(
    allTeams
      .map((t, i) => {
         if (typeof t === 'string') return { name: t.trim(), division: i < 10 ? 'upper' : 'lower' };
         return { name: t?.name?.trim() || "", division: t.division };
      })
      .filter(t => t.name && (!division || t.division === division))
      .map(t => t.name)
  );

  const allStandings = computeStandings(sched);
  // Filter and re-sort if necessary (computeStandings already sorts by pts then diff)
  const standings = allStandings.filter(s => divTeams.size === 0 || divTeams.has(s.team));
  const cfg = LEAGUE_CONFIGS[activeLeague];

  if (!cfg) return null;

  return (
    <div style={{ padding: division ? "0" : "0 20px 20px 20px", width: "100%" }}>
      <div style={{ borderBottom: `2px solid ${colors.BORDER}`, paddingBottom: 8, marginBottom: 16, marginTop: division ? 0 : 24 }}>
        <h2 style={{ margin: 0, fontSize: division ? 16 : 20, fontWeight: 900, color: colors.TEXT, textTransform: division ? "uppercase" : "none", letterSpacing: division ? 1 : 0 }}>
          {division ? `${division} Division` : "Current Standings"}
        </h2>
      </div>

      {standings.length === 0 ? (
        <div style={{ background: colors.CARD, border: `1px solid ${colors.BORDER}`, borderRadius: 12, textAlign: "center", padding: 32 }}>
          <div style={{ fontSize: 24 }}>📊</div>
          <div style={{ color: colors.MUTED, fontSize: 13, marginTop: 6, fontWeight: 600 }}>No scores entered.</div>
        </div>
      ) : (
        <div style={{ background: colors.CARD, borderRadius: 12, border: `1px solid ${colors.BORDER}`, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: division ? 400 : 500 }}>
              <thead>
                <tr style={{ background: colors.ACTIVE_BG }}>
                  {[
                    { label: "#", title: "Rank" },
                    { label: "Team", title: "Team Name" },
                    { label: "Pts", title: "Points (2 for Win, 1 for Tie)" },
                    { label: "FW", title: "Frame Wins" },
                    { label: "FL", title: "Frame Losses" },
                    { label: "PF", title: "Points For (Total points scored by team)" },
                    { label: "PA", title: "Points Against (Total points given up by team)" },
                    { label: "Diff", title: "Point Differential (PF minus PA)" },
                    { label: "GP", title: "Games Played" }
                  ].map((h) => (
                    <th key={h.label} title={h.title} style={{ padding: "8px 6px", textAlign: h.label === "Team" ? "left" : "center", fontWeight: 800, color: colors.MUTED, fontSize: 11, textTransform: "uppercase", letterSpacing: 1, borderBottom: `1px solid ${colors.BORDER}`, cursor: 'help' }}>{h.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {standings.map((s, i) => {
                  const pts = s.matchW * 2 + s.matchT;
                  const diff = s.pf - s.pa;
                  return (
                    <tr key={s.team} style={{ borderBottom: `1px solid ${colors.BORDER}`, background: i < 4 ? colors.WIN_BG : "transparent" }}>
                      <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 800, color: i < 4 ? colors.YELLOW : colors.MUTED, fontSize: 13 }}>{i + 1}</td>
                      <td style={{ padding: "8px 6px", fontWeight: 700, color: colors.TEXT }}>{s.team}</td>
                      <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 900, color: colors.YELLOW, fontSize: 14 }}>{pts}</td>
                      <td style={{ padding: "8px 6px", textAlign: "center", color: colors.GREEN, fontWeight: 600 }}>{s.frameW}</td>
                      <td style={{ padding: "8px 6px", textAlign: "center", color: colors.RED, fontWeight: 600 }}>{s.frameL}</td>
                      <td style={{ padding: "8px 6px", textAlign: "center", color: colors.MUTED, fontWeight: 600 }}>{s.pf}</td>
                      <td style={{ padding: "8px 6px", textAlign: "center", color: colors.MUTED, fontWeight: 600 }}>{s.pa}</td>
                      <td style={{ padding: "8px 6px", textAlign: "center", fontWeight: 800, color: diff > 0 ? colors.GREEN : diff < 0 ? colors.RED : colors.MUTED }}>{diff > 0 ? "+" : ""}{diff}</td>
                      <td style={{ padding: "8px 6px", textAlign: "center", color: colors.MUTED }}>{s.played}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!division && (
        <div style={{ color: colors.MUTED, fontSize: 11, marginTop: 12, textAlign: 'center', fontWeight: 600 }}>
          FW/FL = Frame Wins/Losses &middot; Pts: Win=2 &middot; Top 4 highlighted
        </div>
      )}
    </div>
  );
}
