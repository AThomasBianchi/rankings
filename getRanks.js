const rp = require('request-promise');
const $ = require('cheerio');
const fs = require('fs');

const RANKS_URL = 'https://www.fantasypros.com/nfl/rankings/consensus-cheatsheets.php'

const regex = /(?<=\s)[A-Z]+$/m

function getRanks() {
  rp(RANKS_URL)
    .then(function (html) {
      $('#main-container table tbody tr', html).each((i, rank) => {
        let player = $('.player-label .full-name', rank).text();
        let team = $('.player-label .grey', rank).text();
        let ovrrank = parseFloat($('td:nth-of-type(1)', rank).text())
        let posRank = $('td:nth-of-type(4)', rank).text()
        console.log(`${player} ${team} ${ovrrank} ${posRank}`)
      });
    })
}

getRanks();

function returnPlayerTeam(player_team, regex) {
  let index = player_team.search(regex);
  let player = player_team.slice(0, index).trim();
  let team = player_team.slice(index).trim();
  return { player, team };
}