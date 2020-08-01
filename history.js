const Papa = require('papaparse');
const fs = require('fs');

function getHistoryJson(year) {
  const csv = fs.readFileSync(`./history/${year}.csv`, 'utf8');
  return Papa.parse(csv).data;

}

const json2019 = getHistoryJson(2019).slice(1);
const obj2019 = {};
let overAll = 1;
let qb = 1;
let rb = 1;
let wr = 1
let te = 1;
let k = 1;


json2019.forEach(pick => {
  let [jtfflTeam, player, nflTeam, pos] = pick
  pos = pos.toUpperCase();
  if (pos === 'QB') {
    obj2019[pos + qb] = overAll;
    qb++;
  }
  if (pos === 'RB') {
    obj2019[pos + rb] = overAll;
    rb++;
  }
  if (pos === 'WR') {
    obj2019[pos + wr] = overAll;
    wr++;
  }
  if (pos === 'TE') {
    obj2019[pos + te] = overAll;
    te++;
  }
  if (pos === 'K') {
    obj2019[pos + k] = overAll;
    k++;
  }
  overAll++;
});

