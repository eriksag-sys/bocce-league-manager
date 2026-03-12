export const COURTS = ["A", "B", "C", "D", "E", "F", "G", "H", 1, 2];

export const COURT_COLORS = [
  "#2563eb","#059669","#d97706","#dc2626",
  "#7c3aed","#0891b2","#c026d3","#ea580c",
  "#4f46e5","#16a34a",
];

export const BOCCE_TEAM_NAMES = [
  "Roll Models","Bocce Ballers","Kiss My Bocce","Pallino Chasers",
  "Ball Busters","Court Jesters","Rolling Stones","The Underdogs",
  "Lawn & Order","Spare Me","Gutter Gang","Roll Tide",
  "The Pallinos","Night Owls","Moon Rollers","Bocce Bandits",
  "Lawn Stars","Full Tilt","Ball of Fame","No Bocce No Cry",
  "Toss & Tumble","The Big Lebocce","Just Roll With It","Smooth Operators",
  "Curve Balls","Pin Droppers","On A Roll","Bocce Queens",
  "The Rollaways","Dead On Balls","Heavy Hitters","Balls to the Wall",
  "Marin Mashers","Terra Cotta Crew","San Rafael Rollers","Novato Knockouts",
  "Kickin Grass","Turf Warriors","Green Machine","Old School Rollers",
  "Alley Cats","Lane Sharks","Point Blank","Frame Breakers",
  "Dirt Devils","The Closers","Bocce Bonanza","Lucky Rollers",
  "Rolling Thunder","Golden Pallinos","Rack City","Foul Line Riders",
  "Coast Rollers","Bay Area Bocce","North Bay Ballers","The Ringers",
  "Ace in the Hole","Bank Shot Bros","Spin Doctors","Ricochet Rebels",
];

export const SEASONS = {
  spring: { label: "Spring", icon: "🌱", color: "#22c55e", defaultStart: "2026-03-09", defaultEnd: "2026-05-29" },
  summer: { label: "Summer", icon: "☀️", color: "#f59e0b", defaultStart: "2026-06-01", defaultEnd: "2026-08-28" },
  fall:   { label: "Fall",   icon: "🍂", color: "#ea580c", defaultStart: "2026-09-07", defaultEnd: "2026-11-20" },
};

export const LEAGUE_CONFIGS = {
  mon_day: { label: "Monday Daytime",    shortLabel: "Mon Day", day: 1, time: "10:00 AM", type: "daytime", maxPts: 10 },
  wed_day: { label: "Wednesday Daytime", shortLabel: "Wed Day", day: 3, time: "10:00 AM", type: "daytime", maxPts: 10 },
  fri_day: { label: "Friday Daytime",    shortLabel: "Fri Day", day: 5, time: "10:00 AM", type: "daytime", maxPts: 10 },
  mon_eve: { label: "Monday Evening",    shortLabel: "Mon Eve", day: 1, time: "6:30 PM",  type: "evening", maxPts: 12 },
  tue_eve: { label: "Tuesday Evening",   shortLabel: "Tue Eve", day: 2, time: "6:30 PM",  type: "evening", maxPts: 12 },
  wed_eve: { label: "Wednesday Evening", shortLabel: "Wed Eve", day: 3, time: "6:30 PM",  type: "evening", maxPts: 12 },
  thu_eve: { label: "Thursday Evening",  shortLabel: "Thu Eve", day: 4, time: "6:30 PM",  type: "evening", maxPts: 12 },
  fri_eve: { label: "Friday Evening",    shortLabel: "Fri Eve", day: 5, time: "6:30 PM",  type: "evening", maxPts: 12 },
};

export const FRAMES = 3;

export const emptyTeams = () => Array.from({ length: 20 }, (_, i) => ({ name: "", division: i < 10 ? "upper" : "lower" }));
export const emptyFrames = () => [null, null, null]; // each frame: { a, b } or null
