import Papa from 'papaparse';
import combineAll from './scrape.js';

async function writeCsv() {
  let ranks = await combineAll();

  for (let i = 0; i < 30; i++) {
    let { player, team, position, vorp } = ranks[i];
    let str = `${i + 1}: ${position} ${player} (${team}) - ${vorp}`;
    console.log(str);
  }
}

writeCsv();
