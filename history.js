const Papa = require('papaparse');
const fs = require('fs');

function getHistoryJson(year) {
  const csv = fs.readFileSync(`./history/${year}.csv`, 'utf8');
  return Papa.parse(csv).data;
}

function getPickPostion(year) {
  const json = getHistoryJson(year).slice(1);
  const obj = {};
  let overAll = 1;
  let qb = 1;
  let rb = 1;
  let wr = 1
  let te = 1;
  let k = 1;

  json.forEach(pick => {
    let [jtfflTeam, player, nflTeam, pos] = pick
    pos = pos.toUpperCase();
    if (pos === 'QB') {
      obj[pos + qb] = overAll;
      qb++;
    }
    if (pos === 'RB') {
      obj[pos + rb] = overAll;
      rb++;
    }
    if (pos === 'WR') {
      obj[pos + wr] = overAll;
      wr++;
    }
    if (pos === 'TE') {
      obj[pos + te] = overAll;
      te++;
    }
    if (pos === 'K') {
      obj[pos + k] = overAll;
      k++;
    }
    overAll++;
  });
  return obj;
}

let order19 = getPickPostion(2019);
let order18 = getPickPostion(2018);
let order16 = getPickPostion(2016);
let order15 = getPickPostion(2015);

let years = [order19, order18, order16, order15];

let totalObj = {};
years.forEach(yearObj => {
  Object.keys(yearObj).forEach(key => {
    if (!totalObj[key]) {
      totalObj[key] = [yearObj[key]]
    } else {
      totalObj[key] = [...totalObj[key], yearObj[key]]
    }
  });
});

logPos('K');

for (let prop in totalObj) {
  totalObj[prop] = totalObj[prop].reduce((a,b) => a + b) / totalObj[prop].length;
}

logPos('K');

function logPos(pos) {
  pos = pos.toUpperCase();
  for (let prop in totalObj) {
    if (prop.indexOf(pos) !== -1) {
      console.log(prop + ': ' + totalObj[prop]);
    }
  }
}

