const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');

const RANKS_URL = 'https://www.fantasypros.com/nfl/rankings/consensus-cheatsheets.php'
const POS_REGEX = /\d+$/;

function getRanks() {
  return new Promise((resolve, reject) => {
    let ranks = [];
    rp(RANKS_URL)
      .then(function (html) {
        $('#main-container table tbody tr', html).each((i, rank) => {
          let player = $('.player-label .full-name', rank).text();
          let team = $('.player-label .grey', rank).text();
          let ovrRank = parseFloat($('td:nth-of-type(1)', rank).text())
          let posRank = $('td:nth-of-type(4)', rank).text();
          let adp = $('td:nth-of-type(10)', rank).text();
          console.log(player, adp);
          ranks.push({ player, team, ovrRank, posRank, adp })
          resolve(ranks);
        });
      }).catch((err) => {
        reject(err);
      });
  })
}

async function assignRanks() {
  const ranks = await getRanks();
  const json = JSON.parse(fs.readFileSync('./ranks.json'));
  json.forEach(player => {
    let rank = ranks.find(rank => rank.player === player.player);
    let posRank = rank.posRank.match(POS_REGEX);
    player.consensusOvrRank = rank.ovrRank;
    player.consensusPosRank = parseInt(posRank);
    player.adp = parseFloat(rank.adp);
  });
  // console.log(json);
  storeData(json, 'ranks.json');
  // todo rewrite json
  // console.log(ranks);
}

const storeData = (data, path) => {
  try {
    fs.writeFileSync(path, JSON.stringify(data))
  } catch (err) {
    console.error(err)
  }
}


assignRanks();