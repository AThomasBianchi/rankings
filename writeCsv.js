import Papa from 'papaparse';
import fs from 'fs';

function writeCsv() {
  var json = JSON.parse(fs.readFileSync('./ranks.json'));

  const csv = Papa.unparse(json);

  fs.writeFile('ranks.csv', csv, (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });

  for (let i = 0; i < 30; i++) {
    let { player, team, position, vorp } = json[i];
    let str = `${i + 1}: ${position} ${player} (${team}) - ${vorp}`;
    console.log(str);
  }
}

writeCsv();
