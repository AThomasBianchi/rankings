import rp from 'request-promise';
import $ from 'cheerio';

import replacementLevel from './replacementLevel.js';

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
        qbs.forEach(x => x.vorp = (Math.round((x.totalPoints - replacementQb) * 100) / 100));
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
        rbs.forEach(x => x.vorp = (Math.round((x.totalPoints - replacementRb) * 100) / 100));
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
          let rushTds = parseFloat($('td:nth-of-type(4)', e).text());
          let recTds = parseFloat($('td:nth-of-type(7)', e).text());
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
        wrs.forEach(x => x.vorp = (Math.round((x.totalPoints - replacementWr) * 100) / 100));
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
        tes.forEach(x => x.vorp = (Math.round((x.totalPoints - replacementTe) * 100) / 100));
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

function combineAll() {
  return new Promise( async (resolve, reject) => {
    const qbs = await promiseQBs();
    const rbs = await promiseRBs();
    const wrs = await promiseWRs();
    const tes = await promiseTEs();
    let ranks = [...qbs, ...rbs, ...wrs, ...tes];
    ranks.sort((a, b) => {
      if (a.vorp > b.vorp) return -1;
      if (b.vorp > a.vorp) return 1;
      return 0;
    });
    // return ranks;
    for (let i = 0; i < 30; i++) {
      let { player, team, position, vorp } = ranks[i];
      let str = `${i + 1}: ${position} ${player} (${team}) - ${vorp}`;
      console.log(str);
    }
    resolve(ranks);
  })
}

export default combineAll;