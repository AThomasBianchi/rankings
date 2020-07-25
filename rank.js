import fs from 'fs';

var ranks = JSON.parse(fs.readFileSync('./ranks.json'));

let qbs = ranks.filter(x => x.position === 'QB')

for (let i = 0; i < 30; i++) {
  console.log(qbs[i])
}
