import Papa from 'papaparse';
import fs from 'fs';
import combineAll from './scrape.js';

async function writeCsv() {
  let ranks = await combineAll();

  const csv = Papa.unparse(ranks);

  fs.writeFile('ranks.csv', csv, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  for (let i = 0; i < 30; i++) {
    let { player, team, position, vorp } = ranks[i];
    let str = `${i + 1}: ${position} ${player} (${team}) - ${vorp}`;
    console.log(str);
  }
}

writeCsv();
