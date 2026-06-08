import { fetchWorldCupData, getNextMatch, getMatchUTC, hasScore } from '../src/lib/worldcup.js';

async function run() {
  const data = await fetchWorldCupData();
  const now = new Date();
  const nextMatch = getNextMatch(data, now);
  
  if (!nextMatch) {
    console.log("No next match found!");
    return;
  }
  
  const nextMatchUTC = getMatchUTC(nextMatch);
  const scored = hasScore(nextMatch);
  
  console.log("Next Match ID:", nextMatch.id);
  console.log("Next Match Number:", nextMatch.num);
  console.log("Next Match State:", nextMatch.estado);
  console.log("Next Match Score:", nextMatch.score);
  console.log("nextMatchUTC:", nextMatchUTC);
  console.log("hasScore:", scored);
  console.log("Condition (nextMatchUTC && !hasScore):", Boolean(nextMatchUTC && !scored));
}

run().catch(console.error);
