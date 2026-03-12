import { BOCCE_TEAM_NAMES } from './constants';

export function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function getRandomTeams() {
  return shuffleArray(BOCCE_TEAM_NAMES).slice(0, 20);
}

export function formatDate(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export function getLeagueDates(startStr, endStr, dow, holidays = []) {
  const dates = [];
  const start = new Date(startStr + "T00:00:00");
  const end = new Date(endStr + "T00:00:00");
  let cur = new Date(start);
  while (cur.getDay() !== dow) {
    cur.setDate(cur.getDate() + 1);
  }
  while (cur <= end) {
    const dStr = cur.toISOString().split("T")[0];
    if (!holidays.includes(dStr)) {
      dates.push(dStr);
    }
    cur.setDate(cur.getDate() + 7);
  }
  return dates;
}
