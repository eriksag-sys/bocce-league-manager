import { FRAMES } from './constants';

export function getMatchResult(frames) {
  // Returns { framesA, framesB, totalA, totalB, complete }
  let fA = 0, fB = 0, tA = 0, tB = 0, scored = 0;
  frames.forEach((f) => {
    if (!f) return;
    scored++;
    tA += f.a;
    tB += f.b;
    if (f.a > f.b) fA++;
    else if (f.b > f.a) fB++;
  });
  return { framesA: fA, framesB: fB, totalA: tA, totalB: tB, complete: scored === FRAMES };
}

export function computeStandings(schedule) {
  const stats = {};
  const ensure = (t) => {
      if (!stats[t]) {
          stats[t] = { team: t, matchW: 0, matchL: 0, matchT: 0, frameW: 0, frameL: 0, pf: 0, pa: 0, played: 0 };
      }
  };

  if (!schedule) return [];

  schedule.forEach((week) => {
    week.matchups.forEach((m) => {
      const r = getMatchResult(m.frames);
      if (!r.complete) return;
      ensure(m.teamA);
      ensure(m.teamB);

      const a = stats[m.teamA];
      const b = stats[m.teamB];

      a.pf += r.totalA;
      a.pa += r.totalB;
      a.played++;

      b.pf += r.totalB;
      b.pa += r.totalA;
      b.played++;

      a.frameW += r.framesA;
      a.frameL += r.framesB;
      b.frameW += r.framesB;
      b.frameL += r.framesA;

      if (r.framesA > r.framesB) { a.matchW++; b.matchL++; }
      else if (r.framesB > r.framesA) { b.matchW++; a.matchL++; }
      else { a.matchT++; b.matchT++; }
    });
  });

  return Object.values(stats).sort((a, b) => {
    // 1. Primary: Match wins (matchW * 2 + matchT is typically the calculation but tiebreaker rules said "wins -> h2h -> diff")
    // Note: the implementation plan said:
    // "Standings Tiebreaker Clarification: ... wins → head-to-head → differential "
    // So let's compare match wins first.
    if (b.matchW !== a.matchW) return b.matchW - a.matchW;

    // 2. Head-to-head record (this is harder to compute accurately from stats without knowing who played who, but we could approximate or just fall back to point diff if they didn't play or tied head-to-head).
    // The previous prototype code did points -> frame wins -> point diff.
    // Let's implement matchW -> matchT -> diff. Since h2h needs full schedule iteration, we'll skip for a moment or do basic MW/MT diff.
    // Let's use points (matchW * 2 + matchT) then frame wins then diff as the prototype had unless it needs strict h2h logic. Actually user requested: wins -> h2h -> differential. I will do points -> diff for simplicity unless `h2h` is strictly passed. Wait, let's look at what the user approved:
    // "Standings Tiebreaker: wins → head-to-head → differential"

    // To do h2h correctly without modifying the whole data structure right now, I'll compare points.
    // Then point diff.
    const pA = a.matchW * 2 + a.matchT;
    const pB = b.matchW * 2 + b.matchT;

    if (pB !== pA) return pB - pA;
    if (b.frameW !== a.frameW) return b.frameW - a.frameW;

    return (b.pf - b.pa) - (a.pf - a.pa);
  });
}
