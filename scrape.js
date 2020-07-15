const rp = require('request-promise');
const $ = require('cheerio');
const replacementLevel = require('./replacementLevel');
const QB_URL = 'https://www.fantasypros.com/nfl/projections/qb.php';
const RB_URL = 'https://www.fantasypros.com/nfl/projections/rb.php';
const WR_URL = 'https://www.fantasypros.com/nfl/projections/wr.php';
const TE_URL = 'https://www.fantasypros.com/nfl/projections/te.php';

function promiseQBs() {
  return new Promise((resolve, reject) => {
    let qbs = [];
    rp(QB_URL)
      .then(function (html) {
        $('#main-container table tbody tr', html).each((i, e) => {
          let player = $('.player-label', e).text();
          // let [name, team] = 
          let passingTds = parseFloat($('td:nth-of-type(5)', e).text());
          let rushingTds = parseFloat($('td:nth-of-type(9)', e).text());
          qbs.push({player, passingTds, rushingTds});
        });
        // console.log(qbs);
        // return;
        // add total points
        qbs.forEach(x => x.totalPoints = (Math.round((x.passingTds * 3 + x.rushingTds * 6) * 100) / 100));
        // sort by totals
        qbs.sort((a, b) => {
          if (a.totalPoints > b.totalPoints) return -1;
          if (b.totalPoints > a.totalPoints) return 1;
          return 0;
        });
        // add vorp level
        let replacementQb = (qbs[replacementLevel['qb'] - 2].totalPoints + qbs[replacementLevel['qb'] - 1].totalPoints + qbs[replacementLevel['qb']].totalPoints) / 3;
        qbs.forEach(x => x.vorp = (Math.round((x.totalPoints - replacementQb) * 100) / 100));
        console.log(qbs);
        return;
        resolve(qbs);
      })
      .catch(function (err) {
        reject(err);
        //handle error
      });
  })
}

function promiseRBs() {
  return new Promise((resolve, reject) => {
    let rbs = [];
    rp(RB_URL)
      .then((html) => {
        $('#main-container table tbody tr', html).each((i, e) => {
          let player = $('.player-label', e).text();
          let rushtds = parseFloat($('td:nth-of-type(4)', e).text());
          let rectds = parseFloat($('td:nth-of-type(7)', e).text());
          rbs.push([player, rushtds, rectds]);
        });
        rbs.forEach(x => x.push(Math.round((x[1] * 6 + x[2] * 6) * 100) / 100));
        rbs.sort((a, b) => {
          if (a[3] > b[3]) return -1;
          if (b[3] > a[3]) return 1;
          return 0;
        });
        let replacementRb = (rbs[replacementLevel['rb'] - 3][3] + rbs[replacementLevel['rb'] - 2][3] + rbs[replacementLevel['rb'] - 1][3] + rbs[replacementLevel['rb']][3] + rbs[replacementLevel['rb'] + 1][3]) / 5;
        rbs.forEach(x => x.push(Math.round((x[3] - replacementRb) * 100) / 100));
        resolve(rbs);
      })
      .catch((err) => {
        reject(err);
      })
  })
}

function promiseWRs() {
  return new Promise((resolve, reject) => {
    let wrs = [];
    rp(WR_URL)
      .then((html) => {
        $('#main-container table tbody tr', html).each((i, e) => {
          let player = $('.player-label', e).text();
          let rushtds = parseFloat($('td:nth-of-type(4)', e).text());
          let rectds = parseFloat($('td:nth-of-type(7)', e).text());
          wrs.push([player, rushtds, rectds]);
        });
        wrs.forEach(x => x.push(Math.round((x[1] * 6 + x[2] * 6) * 100) / 100));
        wrs.sort((a, b) => {
          if (a[3] > b[3]) return -1;
          if (b[3] > a[3]) return 1;
          return 0;
        });
        let replacementWr = (wrs[replacementLevel['wr'] - 3][3] + wrs[replacementLevel['wr'] - 2][3] + wrs[replacementLevel['wr'] - 1][3] + wrs[replacementLevel['wr']][3] + wrs[replacementLevel['wr'] + 1][3]) / 5;
        wrs.forEach(x => x.push(Math.round((x[3] - replacementWr) * 100) / 100));
        resolve(wrs);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function promiseTEs() {
  return new Promise((resolve, reject) => {
    let tes = [];
    rp(TE_URL)
      .then(function (html) {
        $('#main-container table tbody tr', html).each((i, e) => {
          let player = $('.player-label', e).text();
          let rectds = parseFloat($('td:nth-of-type(4)', e).text());
          tes.push([player, rectds]);
        });
        // total points
        tes.forEach(x => x.push(Math.round((x[1] * 6) * 100) / 100));
        // sort by totals
        tes.sort((a, b) => {
          if (a[2] > b[2]) return -1;
          if (b[2] > a[2]) return 1;
          return 0;
        });
        // add vorp level
        let replacementTe = (tes[replacementLevel['te'] - 2][2] + tes[replacementLevel['te'] - 1][2] + tes[replacementLevel['te']][2]) / 3;
        tes.forEach(x => x.push(Math.round((x[2] - replacementTe) * 100) / 100));
        resolve(tes);
      })
      .catch(function (err) {
        //handle error
        reject(err);
      });
  });
}

async function combineAll() {
  const qbs = await promiseQBs();
  const wrs = await promiseWRs();
  const tes = await promiseTEs();
  const rbs = await promiseRBs();
  let ranks = [...qbs, ...rbs, ...wrs, ...tes];
  ranks.sort((a, b) => {
    let aLast = a.length - 1;
    let bLast = b.length - 1;
    if (a[aLast] > b[bLast]) return -1;
    if (b[bLast] > a[aLast]) return 1;
    return 0;
  });
  // return ranks;
  for (let i = 0; i < 30; i++) {
    console.log(i + 1 + ': ' + ranks[i][0] + ' ' + ranks[i][ranks[i].length - 1]);
  }
}

// combineAll();
async function getQbs() {
  const qbs = await promiseQBs();
  console.log(qbs);
}

promiseQBs();