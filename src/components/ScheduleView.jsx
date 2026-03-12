import { useState, useEffect } from 'react';
import { useTheme } from '../ThemeContext';
import { LEAGUE_CONFIGS, SEASONS, COURTS } from '../logic/constants';
import { getMatchResult } from '../logic/standings';
import { formatDate } from '../logic/helpers';
import CourtCard from './CourtCard';
import ScoreModal from './ScoreModal';
import RainOutModal from './RainOutModal';

function Label({ color, text, colors }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ background: color, width: 10, height: 10, borderRadius: 3 }} />
      <span style={{ fontWeight: 700, fontSize: 13, color: colors.MUTED, textTransform: "uppercase", letterSpacing: 2 }}>{text}</span>
      <div style={{ flex: 1, height: 1, background: colors.BORDER }} />
    </div>
  );
}

function CourtGrid({ matchups, onCourtClick, isCanceled }) {
  const { colors } = useTheme();
  if (!matchups || !matchups.length) return <div style={{ color: colors.MUTED }}>No matchups</div>;
  const outdoor = matchups.filter((m) => typeof m.court === "string");
  const indoor = matchups.filter((m) => typeof m.court === "number");
  const row1 = outdoor.slice(0, 4), row2 = outdoor.slice(4);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, opacity: isCanceled ? 0.5 : 1, pointerEvents: isCanceled ? 'none' : 'auto' }}>
      <Label color={colors.GREEN} text="Outdoor Courts" colors={colors} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", overflowX: 'auto' }}>{row1.map((m) => <CourtCard key={m.court} matchup={m} colorIdx={COURTS.indexOf(m.court)} onClick={() => onCourtClick(m)} />)}</div>
      {row2.length > 0 && <div style={{ display: "flex", gap: 8, flexWrap: "wrap", overflowX: 'auto' }}>{row2.map((m) => <CourtCard key={m.court} matchup={m} colorIdx={COURTS.indexOf(m.court)} onClick={() => onCourtClick(m)} />)}</div>}
      {indoor.length > 0 && <>
        <Label color={colors.YELLOW} text="Indoor Courts (Clubhouse)" colors={colors} />
        <div style={{ display: "flex", gap: 8, maxWidth: "50%", flexWrap: "wrap", overflowX: 'auto' }}>{indoor.map((m) => <CourtCard key={m.court} matchup={m} colorIdx={COURTS.indexOf(m.court)} indoor onClick={() => onCourtClick(m)} />)}</div>
      </>}
    </div>
  );
}

function LeaguePill({ k, activeLeague, setActiveLeague, setWeekIdx, colors }) {
  return (
    <button onClick={() => { setActiveLeague(k); setWeekIdx(0); }} style={{
      padding: "5px 12px", borderRadius: 5, border: "none", cursor: "pointer", fontWeight: 700, fontSize: 13,
      background: activeLeague === k ? (LEAGUE_CONFIGS[k].type === "daytime" ? colors.YELLOW : colors.BLUE) : colors.CARD,
      color: activeLeague === k ? (LEAGUE_CONFIGS[k].type === "daytime" ? "#000" : "#fff") : colors.MUTED,
      border: `1px solid ${activeLeague === k ? 'transparent' : colors.BORDER}`
    }}>{LEAGUE_CONFIGS[k].shortLabel}</button>
  );
}

export default function ScheduleView({ schedules, leagueTeams, setSchedules, activeSeason, setActiveSeason, activeLeague, setActiveLeague, isAdmin, hideCourts }) {
  const { colors } = useTheme();

  const [weekIdx, setWeekIdx] = useState(0);
  const [scoreModal, setScoreModal] = useState(null);
  const [showRainOut, setShowRainOut] = useState(false);

  const schedKey = `${activeSeason}_${activeLeague}`;
  const sched = schedules[schedKey] || [];
  const cfg = LEAGUE_CONFIGS[activeLeague];
  const teamsOk = (leagueTeams[schedKey] || []).filter((t) => t.trim()).length === 20;

  useEffect(() => {
    if (!sched.length) return;
    const now = new Date();
    let closest = 0, minD = Infinity;
    sched.forEach((w, i) => { const d = Math.abs(new Date(w.date + "T00:00:00") - now); if (d < minD) { minD = d; closest = i; } });
    if (closest !== weekIdx && weekIdx === 0 && !sched[0].isMakeup) { // only auto-jump on first load
        setWeekIdx(closest);
    }
  }, [activeLeague, activeSeason, schedules]);

  const week = sched[weekIdx];

  const handleSaveScore = (frames) => {
    if (!isAdmin) return;
    setSchedules((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      const m = copy[schedKey][weekIdx].matchups.find((x) => x.court === scoreModal.court);
      if (m) m.frames = frames;
      return copy;
    });
    setScoreModal(null);
  };

  const dayKeys = Object.keys(LEAGUE_CONFIGS).filter((k) => LEAGUE_CONFIGS[k].type === "daytime");
  const eveKeys = Object.keys(LEAGUE_CONFIGS).filter((k) => LEAGUE_CONFIGS[k].type === "evening");

  const handleCancelGames = () => {
    setSchedules((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[schedKey][weekIdx].isCanceled = true;
      copy[schedKey][weekIdx].isRainedOut = true;
      return copy;
    });
    setShowRainOut(false);
  };

  const handleReschedule = (newDate) => {
    setSchedules((prev) => {
      const copy = JSON.parse(JSON.stringify(prev));
      copy[schedKey][weekIdx].isRainedOut = true;
      
      // Clone matchups, reset frames
      const clonedMatchups = copy[schedKey][weekIdx].matchups.map(m => ({
          ...m,
          frames: []
      }));
      
      copy[schedKey].push({
          date: newDate,
          isMakeup: true,
          matchups: clonedMatchups
      });
      // Sort schedule by date
      copy[schedKey].sort((a, b) => new Date(a.date) - new Date(b.date));
      return copy;
    });
    setShowRainOut(false);
  };

  return (
    <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>
      {/* Filters (Season & League) */}
      <div style={{ display: "flex", flexDirection: 'column', gap: 12, marginBottom: 20 }}>
        {/* Season Picker */}
        <div style={{ display: "flex", gap: 4, background: colors.CARD, border: `1px solid ${colors.BORDER}`, borderRadius: 8, padding: 3, width: "fit-content" }}>
          {Object.entries(SEASONS).map(([key, s]) => (
            <button key={key} onClick={() => setActiveSeason(key)} style={{
              padding: "6px 18px", borderRadius: 6, border: "none", cursor: "pointer",
              fontWeight: 700, fontSize: 14, background: activeSeason === key ? s.color : "transparent",
              color: activeSeason === key ? "#fff" : colors.MUTED,
            }}>{s.icon} {s.label}</button>
          ))}
        </div>

        {/* League Picker */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: 'center' }}>
           <div style={{ display: "flex", gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: colors.MUTED, textTransform: "uppercase", letterSpacing: 1 }}>Daytime</span>
            {dayKeys.map((k) => <LeaguePill key={k} k={k} activeLeague={activeLeague} setActiveLeague={setActiveLeague} setWeekIdx={setWeekIdx} colors={colors} />)}
           </div>
           <div style={{ display: "flex", gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: colors.MUTED, textTransform: "uppercase", letterSpacing: 1 }}>Evening</span>
            {eveKeys.map((k) => <LeaguePill key={k} k={k} activeLeague={activeLeague} setActiveLeague={setActiveLeague} setWeekIdx={setWeekIdx} colors={colors} />)}
           </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `2px solid ${colors.BORDER}`, paddingBottom: 12, marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 22, fontWeight: 900, color: colors.TEXT }}>{SEASONS[activeSeason].label} — {cfg.label}</h2>
              <div style={{ color: colors.MUTED, fontSize: 14, marginTop: 4 }}>
                {cfg.time} — {cfg.type === "daytime" ? "3 frames to 10" : "3 frames to 12"}
              </div>
            </div>
            {isAdmin && week && !week.isRainedOut && !week.isCanceled && (
                <button onClick={() => setShowRainOut(true)} style={{ background: colors.CARD, color: colors.MUTED, border: `1px solid ${colors.BORDER}`, borderRadius: 6, padding: "4px 8px", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                    🌧️ Rain Out
                </button>
            )}
        </div>
        {week && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontWeight: 800, color: week.isRainedOut ? colors.RED : colors.YELLOW, fontSize: 18 }}>
                {week.isMakeup ? "Makeup Week" : `Week ${weekIdx + 1}/${sched.length}`}
            </div>
            <div style={{ color: colors.MUTED, fontSize: 14 }}>
                {formatDate(week.date)}
                {week.isCanceled && <span style={{ color: colors.RED, marginLeft: 8, fontWeight: 700 }}>CANCELED</span>}
                {week.isRainedOut && !week.isCanceled && <span style={{ color: colors.RED, marginLeft: 8, fontWeight: 700 }}>RAINED OUT</span>}
            </div>
          </div>
        )}
      </div>

      {!hideCourts && sched.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <button style={{ background: weekIdx === 0 ? colors.CARD : colors.BORDER, color: colors.TEXT, border: "none", borderRadius: 6, padding: "5px 12px", fontWeight: 600, fontSize: 14, cursor: weekIdx === 0 ? 'not-allowed' : 'pointer', opacity: weekIdx === 0 ? 0.5 : 1 }} disabled={weekIdx === 0}
            onClick={() => setWeekIdx((p) => p - 1)}>&larr;</button>
          <div style={{ flex: 1, display: "flex", gap: 4, overflow: "auto", padding: "4px 0" }}>
            {sched.map((w, i) => {
              const allDone = w.matchups.every((m) => getMatchResult(m.frames).complete);
              const labelColor = w.isRainedOut ? colors.RED : (i === weekIdx ? "#fff" : allDone ? colors.GREEN : colors.MUTED);
              const bgColor = i === weekIdx ? colors.BLUE : allDone ? colors.DONE_BG : colors.CARD;
              return (
                <button key={`${w.date}-${i}`} onClick={() => setWeekIdx(i)} style={{
                  padding: "6px 10px", borderRadius: 4, border: "none", cursor: "pointer",
                  fontSize: 12, fontWeight: 700, whiteSpace: "nowrap",
                  background: bgColor,
                  color: labelColor,
                  border: `1px solid ${i === weekIdx ? colors.BLUE : allDone ? colors.DONE_BORDER : colors.BORDER}`,
                  textDecoration: w.isRainedOut ? 'line-through' : 'none'
                }}>
                  {w.isMakeup && "✨ "}{formatDate(w.date)}
                </button>
              );
            })}
          </div>
          <button style={{ background: weekIdx >= sched.length - 1 ? colors.CARD : colors.BORDER, color: colors.TEXT, border: "none", borderRadius: 6, padding: "5px 12px", fontWeight: 600, fontSize: 14, cursor: weekIdx >= sched.length - 1 ? 'not-allowed' : 'pointer', opacity: weekIdx >= sched.length - 1 ? 0.5 : 1 }}
            disabled={weekIdx >= sched.length - 1}
            onClick={() => setWeekIdx((p) => p + 1)}>&rarr;</button>
        </div>
      )}

      {hideCourts ? null : !teamsOk ? (
        <div style={{ background: colors.CARD, border: `1px solid ${colors.BORDER}`, borderRadius: 12, textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 40 }}>📋</div>
          <div style={{ color: colors.MUTED, fontSize: 16, marginTop: 10, fontWeight: 600 }}>No teams entered or not exactly 20 teams. Go to Setup.</div>
        </div>
      ) : !sched.length ? (
        <div style={{ background: colors.CARD, border: `1px solid ${colors.BORDER}`, borderRadius: 12, textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 40 }}>⏳</div>
          <div style={{ color: colors.MUTED, fontSize: 16, marginTop: 10, fontWeight: 600 }}>Teams ready — generate schedules in Setup.</div>
        </div>
      ) : week ? (
        <CourtGrid matchups={week.matchups} isCanceled={week.isCanceled || week.isRainedOut} onCourtClick={(m) => { if (isAdmin && !week.isCanceled && !week.isRainedOut) setScoreModal(m); }} />
      ) : null}

      {scoreModal && <ScoreModal matchup={scoreModal} maxPts={cfg.maxPts} onSave={handleSaveScore} onClose={() => setScoreModal(null)} />}
      
      {showRainOut && (
          <RainOutModal 
              weekDate={formatDate(week.date)} 
              onClose={() => setShowRainOut(false)}
              onCancelGames={handleCancelGames}
              onReschedule={handleReschedule}
          />
      )}
    </div>
  );
}
