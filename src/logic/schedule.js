import { COURTS, emptyFrames } from './constants';

export function getLeagueDates(start, end, dow, holidays) {
  const dates = [];
  const s = new Date(start + "T00:00:00"), e = new Date(end + "T00:00:00");
  const hSet = new Set(holidays);
  const d = new Date(s);
  while (d <= e) {
    if (d.getDay() === dow) {
        const iso = d.toISOString().split("T")[0];
        if (!hSet.has(iso)) dates.push(iso);
    }
    d.setDate(d.getDate() + 1);
  }
  return dates;
}

export function generateRoundRobin(teams) {
  const n = teams.length;
  const rounds = [];
  const list = [...teams];
  const fixed = list.shift();
  for (let r = 0; r < n - 1; r++) {
    const round = [];
    const cur = [fixed, ...list];
    for (let i = 0; i < n / 2; i++) {
        round.push([cur[i], cur[n - 1 - i]]);
    }
    rounds.push(round);
    list.push(list.shift());
  }
  return rounds;
}

export function assignCourts(pairings, history, weekIdx) {
  const assignments = [];
  const used = new Set();

  pairings.forEach(([tA, tB]) => {
    let best = null;
    let bestScore = -Infinity;

    for (const c of COURTS) {
      if (used.has(c)) continue;
      const cs = String(c);
      
      const aStats = history[tA] || { counts: {}, lastPlayed: {} };
      const bStats = history[tB] || { counts: {}, lastPlayed: {} };
      
      const aCount = aStats.counts[cs] || 0;
      const bCount = bStats.counts[cs] || 0;
      
      const aLast = aStats.lastPlayed[cs] !== undefined ? aStats.lastPlayed[cs] : -100;
      const bLast = bStats.lastPlayed[cs] !== undefined ? bStats.lastPlayed[cs] : -100;
      
      // Penalize heavily if they have played on courts 1 or 2 at all
      let penalty = 0;
      if (cs === "1" || cs === "2") {
          const aIndoorPlayed = (aStats.counts["1"] || 0) + (aStats.counts["2"] || 0);
          const bIndoorPlayed = (bStats.counts["1"] || 0) + (bStats.counts["2"] || 0);
          penalty -= (aIndoorPlayed * 5000) + (bIndoorPlayed * 5000);
      }
      
      const aTimeDiff = aLast === -100 ? 1000 : (weekIdx - aLast);
      const bTimeDiff = bLast === -100 ? 1000 : (weekIdx - bLast);

      const score = penalty - (aCount * 500) - (bCount * 500) + (aTimeDiff * 10) + (bTimeDiff * 10);
      
      if (score > bestScore) {
          bestScore = score;
          best = c;
      }
    }

    if (best !== null) {
      const cs = String(best);
      used.add(best);
      assignments.push({ court: best, teamA: tA, teamB: tB, frames: emptyFrames() });
      if (!history[tA]) history[tA] = { counts: {}, lastPlayed: {} };
      if (!history[tB]) history[tB] = { counts: {}, lastPlayed: {} };
      
      history[tA].counts[cs] = (history[tA].counts[cs] || 0) + 1;
      history[tA].lastPlayed[cs] = weekIdx;
      
      history[tB].counts[cs] = (history[tB].counts[cs] || 0) + 1;
      history[tB].lastPlayed[cs] = weekIdx;
    }
  });

  const order = COURTS.map(String);
  assignments.sort((a, b) => order.indexOf(String(a.court)) - order.indexOf(String(b.court)));
  return assignments;
}

export function generateSchedule(teams, dates) {
  const upperTeams = teams.filter(t => t.division === "upper").map((t) => typeof t === 'string' ? t : t.name).filter(Boolean);
  const lowerTeams = teams.filter(t => t.division === "lower").map((t) => typeof t === 'string' ? t : t.name).filter(Boolean);
  
  if (upperTeams.length !== 10 || lowerTeams.length !== 10) return null;

  const history = {};
  [...upperTeams, ...lowerTeams].forEach(t => history[t] = { counts: {}, lastPlayed: {} });

  const upperPairings = generateRoundRobin(upperTeams);
  const lowerPairings = generateRoundRobin(lowerTeams);

  return dates.map((date, weekIdx) => {
      const uPairs = upperPairings[weekIdx % upperPairings.length];
      const lPairs = lowerPairings[weekIdx % lowerPairings.length];
      return {
          date,
          matchups: assignCourts([...uPairs, ...lPairs], history, weekIdx)
      };
  });
}
