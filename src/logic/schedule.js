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

export function assignCourts(pairings, history) {
  const assignments = [];
  const used = new Set();

  pairings.forEach(([tA, tB]) => {
    let best = null;
    let bestScore = -Infinity;

    for (const c of COURTS) {
      if (used.has(c)) continue;
      const cs = String(c);
      const aH = history[tA] || [];
      const bH = history[tB] || [];
      const score = (aH.lastIndexOf(cs) === -1 ? 100 : aH.length - aH.lastIndexOf(cs)) +
                    (bH.lastIndexOf(cs) === -1 ? 100 : bH.length - bH.lastIndexOf(cs));
      if (score > bestScore) {
          bestScore = score;
          best = c;
      }
    }

    if (best !== null) {
      used.add(best);
      assignments.push({ court: best, teamA: tA, teamB: tB, frames: emptyFrames() });
      if (!history[tA]) history[tA] = [];
      if (!history[tB]) history[tB] = [];
      history[tA].push(String(best));
      history[tB].push(String(best));
    }
  });

  const order = COURTS.map(String);
  assignments.sort((a, b) => order.indexOf(String(a.court)) - order.indexOf(String(b.court)));
  return assignments;
}

export function generateSchedule(teams, dates) {
  const valid = teams.filter((t) => t.trim());
  if (valid.length < 20) return null;
  const history = {};
  valid.forEach((t) => (history[t] = []));
  const pairings = generateRoundRobin(valid);
  return dates.map((date, i) => ({
      date,
      matchups: assignCourts(pairings[i % pairings.length], history)
  }));
}
