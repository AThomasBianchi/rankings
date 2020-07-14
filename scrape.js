const rp = require('request-promise');
const $ = require('cheerio');
const url = 'https://www.fantasypros.com/nfl/projections/qb.php';

let json = [];

rp(url)
  .then(function (html) {

    $('#main-container table tbody tr', html).each((i, e) => {
      let player = $('.player-label', e).text();
      let ptds = parseFloat($('td:nth-of-type(5)', e).text());
      let rtds = parseFloat($('td:nth-of-type(9)', e).text());
      json.push([player, ptds, rtds]);
    })

  })
  .catch(function (err) {
    //handle error
  })
  .finally(() => {
    json.sort((a,b) => {
      if (a[1]*3 + a[2]*6 > b[1]*3 + b[2]*6) return -1;
      if (b[1] * 3 + b[2] * 6 > a[1] * 3 + a[2] * 6) return 1;
      return 0;
    })
    console.log(json);
  });