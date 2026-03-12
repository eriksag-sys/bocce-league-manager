import { useTheme } from '../ThemeContext';
import { LEAGUE_CONFIGS } from '../logic/constants';
import { computeStandings } from '../logic/standings';

const PodiumStep = ({ teamData, rank, height, color, emoji }) => {
  const { colors } = useTheme();
  if (!teamData) return <div style={{ flex: 1 }} />;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', flex: 1 }}>
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>{emoji}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: colors.TEXT, lineHeight: 1.1 }}>{teamData.team}</div>
        <div style={{ fontSize: 13, color: color, fontWeight: 700, marginTop: 4 }}>
          {teamData.matchW}-{teamData.matchL} ({teamData.matchW * 2 + teamData.matchT} pts)
        </div>
      </div>
      <div style={{ 
          width: '100%', 
          height: height, 
          background: `linear-gradient(to top, ${colors.BG}, ${color})`,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          boxShadow: `0 -10px 20px ${color}33`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
      }}>
          <span style={{ fontSize: 32, fontWeight: 900, color: colors.BG, opacity: 0.8 }}>{rank}</span>
      </div>
    </div>
  );
};

export default function ChampionsView({ schedules, activeSeason, activeLeague }) {
  const { colors } = useTheme();

  const schedKey = `${activeSeason}_${activeLeague}`;
  const sched = schedules[schedKey] || [];
  const standings = computeStandings(sched);
  const cfg = LEAGUE_CONFIGS[activeLeague];

  if (!cfg) return null;

  if (standings.length === 0) {
    return (
      <div style={{ padding: "40px 20px", maxWidth: 1200, margin: "0 auto", textAlign: 'center' }}>
        <div style={{ background: colors.CARD, border: `1px solid ${colors.BORDER}`, borderRadius: 12, padding: 40 }}>
          <div style={{ fontSize: 40 }}>🏆</div>
          <div style={{ color: colors.MUTED, fontSize: 16, marginTop: 10, fontWeight: 600 }}>No scores entered yet for {cfg.label}.</div>
        </div>
      </div>
    );
  }

  // Get top 3
  const top3 = standings.slice(0, 3);
  const first = top3[0];
  const second = top3[1];
  const third = top3[2];

  return (
    <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ textAlign: 'center', marginBottom: 40, marginTop: 20 }}>
        <h2 style={{ margin: 0, fontSize: 36, fontWeight: 900, color: colors.TEXT, textTransform: 'uppercase', letterSpacing: 2 }}>
          {cfg.label} Champions
        </h2>
        <div style={{ color: colors.YELLOW, fontSize: 18, marginTop: 8, fontWeight: 700, letterSpacing: 1 }}>
          {activeSeason.toUpperCase()} SEASON
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16, maxWidth: 800, margin: '0 auto', height: 400, borderBottom: `4px solid ${colors.BORDER}` }}>
        <PodiumStep teamData={second} rank="2" height={220} color="#C0C0C0" emoji="🥈" />
        <PodiumStep teamData={first} rank="1" height={300} color="#FFD700" emoji="🏆" />
        <PodiumStep teamData={third} rank="3" height={160} color="#CD7F32" emoji="🥉" />
      </div>

      <div style={{ marginTop: 40, background: colors.CARD, borderRadius: 16, border: `1px solid ${colors.BORDER}`, padding: 24, maxWidth: 800, margin: '40px auto' }}>
        <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 800, color: colors.MUTED, textTransform: 'uppercase', letterSpacing: 1, textAlign: 'center' }}>Top 10 Finishers</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {standings.slice(0, 10).map((s, i) => (
                <div key={s.team} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: "10px 16px", background: colors.BG, borderRadius: 8, border: `1px solid ${colors.BORDER}` }}>
                    <div style={{ fontWeight: 900, color: i < 3 ? colors.YELLOW : colors.MUTED, width: 20 }}>{i + 1}.</div>
                    <div style={{ fontWeight: 700, color: colors.TEXT, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.team}</div>
                    <div style={{ fontWeight: 800, color: colors.MUTED, fontSize: 12 }}>{s.matchW * 2 + s.matchT}p</div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
}
