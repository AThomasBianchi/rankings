const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');

const replacementLevel = require('./replacementLevel.js');

const QB_URL = 'https://www.fantasypros.com/nfl/projections/qb.php';
const RB_URL = 'https://www.fantasypros.com/nfl/projections/rb.php';
const WR_URL = 'https://www.fantasypros.com/nfl/projections/wr.php';
const TE_URL = 'https://www.fantasypros.com/nfl/projections/te.php';

const regex = /(?<=\s)[A-Z]+$/m

function promiseQBs() {
  return new Promise((resolve, reject) => {
    const position = 'QB';
    let qbs = [];
    rp(QB_URL)
      .then(function (html) {
        $('#main-container table tbody tr', html).each((i, e) => {
          let player_team = $('.player-label', e).text().trim();
          let { player, team } = returnPlayerTeam(player_team, regex);
          let passTds = parseFloat($('td:nth-of-type(5)', e).text());
          let rushTds = parseFloat($('td:nth-of-type(9)', e).text());
          qbs.push({ player, team, position, passTds, rushTds });
        });
        // add total points
        qbs.forEach(x => x.totalPoints = (Math.round((x.passTds * 3 + x.rushTds * 6) * 100) / 100));
        // sort by totals
        qbs.sort((a, b) => {
          if (a.totalPoints > b.totalPoints) return -1;
          if (b.totalPoints > a.totalPoints) return 1;
          return 0;
        });
        // add vorp level
        let replacementQb = (qbs[replacementLevel['qb'] - 2].totalPoints + qbs[replacementLevel['qb'] - 1].totalPoints + qbs[replacementLevel['qb']].totalPoints) / 3;
        qbs.forEach((x, index) => {
          x.vorp = (Math.round((x.totalPoints - replacementQb) * 100) / 100);
          x.projPosRank = index + 1;
        });
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
    const position = 'RB';
    let rbs = [];
    rp(RB_URL)
      .then((html) => {
        $('#main-container table tbody tr', html).each((i, e) => {
          let player_team = $('.player-label', e).text().trim();
          let { player, team } = returnPlayerTeam(player_team, regex);
          let rushTds = parseFloat($('td:nth-of-type(4)', e).text());
          let recTds = parseFloat($('td:nth-of-type(7)', e).text());
          rbs.push({ player, team, position, rushTds, recTds });
        });
        rbs.forEach(x => x.totalPoints = (Math.round((x.rushTds * 6 + x.recTds * 6) * 100) / 100));
        rbs.sort((a, b) => {
          if (a.totalPoints > b.totalPoints) return -1;
          if (b.totalPoints > a.totalPoints) return 1;
          return 0;
        });
        let replacementRb = (
          rbs[replacementLevel['rb'] - 3].totalPoints +
          rbs[replacementLevel['rb'] - 2].totalPoints +
          rbs[replacementLevel['rb'] - 1].totalPoints +
          rbs[replacementLevel['rb']].totalPoints +
          rbs[replacementLevel['rb'] + 1].totalPoints
          ) / 5;
        rbs.forEach((x, index) => {
          x.vorp = (Math.round((x.totalPoints - replacementRb) * 100) / 100)
          x.projPosRank = index + 1;
        });
        resolve(rbs);
      })
      .catch((err) => {
        reject(err);
      })
  })
}

function promiseWRs() {
  return new Promise((resolve, reject) => {
    const position = 'WR';
    let wrs = [];
    rp(WR_URL)
      .then((html) => {
        $('#main-container table tbody tr', html).each((i, e) => {
          let player_team = $('.player-label', e).text().trim();
          let { player, team } = returnPlayerTeam(player_team, regex);
          let recTds = parseFloat($('td:nth-of-type(4)', e).text());
          let rushTds = parseFloat($('td:nth-of-type(7)', e).text());
          wrs.push({ player, team, position, rushTds, recTds });
        });
        wrs.forEach(x => x.totalPoints = (Math.round((x.rushTds * 6 + x.recTds * 6) * 100) / 100));
        wrs.sort((a, b) => {
          if (a.totalPoints > b.totalPoints) return -1;
          if (b.totalPoints > a.totalPoints) return 1;
          return 0;
        });
        let replacementWr = (
          wrs[replacementLevel['wr'] - 3].totalPoints +
          wrs[replacementLevel['wr'] - 2].totalPoints +
          wrs[replacementLevel['wr'] - 1].totalPoints +
          wrs[replacementLevel['wr']].totalPoints +
          wrs[replacementLevel['wr'] + 1].totalPoints
          ) / 5;
        wrs.forEach((wr, index) => {
          wr.vorp = (Math.round((wr.totalPoints - replacementWr) * 100) / 100);
          wr.projPosRank = index + 1
        });
        resolve(wrs);
      })
      .catch((err) => {
        reject(err);
      });
  });
}

function promiseTEs() {
  return new Promise((resolve, reject) => {
    const position = 'TE';
    let tes = [];
    rp(TE_URL)
      .then(function (html) {
        $('#main-container table tbody tr', html).each((i, e) => {
          let player_team = $('.player-label', e).text().trim();
          let { player, team } = returnPlayerTeam(player_team, regex);
          let recTds = parseFloat($('td:nth-of-type(4)', e).text());
          tes.push({ player, team, position, recTds });
        });
        // total points
        tes.forEach(x => x.totalPoints = (Math.round((x.recTds * 6) * 100) / 100));
        // sort by totals
        tes.sort((a, b) => {
          if (a.totalPoints > b.totalPoints) return -1;
          if (b.totalPoints > a.totalPoints) return 1;
          return 0;
        });
        // add vorp level
        let replacementTe = (
          tes[replacementLevel['te'] - 2].totalPoints +
          tes[replacementLevel['te'] - 1].totalPoints +
          tes[replacementLevel['te']].totalPoints
        ) / 3;
        tes.forEach((te, index) => {
          te.vorp = (Math.round((te.totalPoints - replacementTe) * 100) / 100)
          te.projPosRank = index + 1
        });
        resolve(tes);
      })
      .catch(function (err) {
        //handle error
        reject(err);
      });
  });
}

function returnPlayerTeam(player_team, regex) {
  let index = player_team.search(regex);
  let player = player_team.slice(0, index).trim();
  let team = player_team.slice(index).trim();
  return { player, team };
}

async function combineAll() {
  const qbs = await promiseQBs();
  const rbs = await promiseRBs();
  const wrs = await promiseWRs();
  const tes = await promiseTEs();
  let ranks = [...qbs.slice(0, 30), ...rbs.slice(0, 80), ...wrs.slice(0, 80), ...tes.slice(0, 30)];
  ranks.sort((a, b) => {
    if (a.vorp > b.vorp) return -1;
    if (b.vorp > a.vorp) return 1;
    return 0;
  });
  ranks.forEach((rank, index) => {
    rank.projOvrRank = index + 1;
  });
  var json = JSON.parse(fs.readFileSync('./ranks.json'));
  let saveRanks = ranks.map(rank => {
    let { player: projPlayer } = rank;
    let jsonPlayer = json.find(player => player.player === projPlayer)
    return {...rank, ...jsonPlayer};
  })

  storeData(saveRanks, 'ranks.json')
}

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}

combineAll();

// todo assign instead of overwriting
