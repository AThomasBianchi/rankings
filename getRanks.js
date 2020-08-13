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
          ranks.push({ player, team, ovrRank, posRank })
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
  });
  console.log(json);
  // console.log(ranks);
}


assignRanks();