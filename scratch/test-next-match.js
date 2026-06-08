import { fetchWorldCupData, getNextMatch, getMatchUTC, hasScore } from '../src/lib/worldcup.js';

async function run() {
  const data = await fetchWorldCupData();
  const now = new Date();
  const nextMatch = getNextMatch(data, now);
  console.log('Now:', now.toISOString());
  console.log('Next match:', nextMatch);
  if (nextMatch) {
    console.log('nextMatchUTC:', getMatchUTC(nextMatch));
    console.log('hasScore:', hasScore(nextMatch));
    console.log('Condition nextMatchUTC && !hasScore:', !!(getMatchUTC(nextMatch) && !hasScore(nextMatch)));
  }
}

run().catch(console.error);
