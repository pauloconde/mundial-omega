import { fetchWorldCupData, parseMatchDate, VENUES, calculateGroupStandings, getMatchesByDateChronological } from './src/lib/worldcup.js';

async function run() {
  const data = await fetchWorldCupData();
  console.log("Matches count:", data.matches.length);
  console.log("First match local time:", parseMatchDate(data.matches[0].date, data.matches[0].time).toISOString());
  console.log("Grounds from JSON:", [...new Set(data.matches.map(m => m.ground))]);
  console.log("Groups:", calculateGroupStandings(data).map(g => g.group));
}

run();
