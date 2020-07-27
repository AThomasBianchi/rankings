import fs from 'fs';
import readline from 'readline';
import { log } from 'console';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var ranks = JSON.parse(fs.readFileSync('./ranks.json'));

let qbs = ranks.filter(x => x.position === 'QB');
qbs.forEach((qb, i) => {
  qb.rank = i + 1;
})


qbs = qbs.slice(0,10);


// rl.question('what is your name', (name) => {
//   console.log(name);
//   rl.question('what is your job', (job) => {
//     console.log(job);
//     rl.close();
//   });
// });

const logTopTen = (ranks) => {
  console.log('top ten')
  for (let i = 0; i < 10; i++) {
    console.log(`${ranks[i].rank}: ${ranks[i].player}`);
  }
}

const pickTwo = (ranks) => {
  let evalNum = Math.floor(Math.random() * Math.floor(ranks.length - 1));
  console.log(ranks[evalNum]);
  console.log(ranks[evalNum + 1]);
  console.log(`would you rather pick ${ranks[evalNum].player} or ${ranks[evalNum + 1].player}`);
  return evalNum;
}

const compare = (ranks) => {
  logTopTen(ranks);
  let rank = pickTwo(ranks);
  rl.question('1 or 2', (answer) => {
    if (answer === '2') {
      ranks[rank].rank = ranks[rank].rank + 1;
      ranks[rank + 1].rank = ranks[rank].rank - 1
      ranks.sort((a,b) => {
        if (a.rank > b.rank) return 1;
        if (b.rank > a.rank) return -1;
      });
    }
    logTopTen(ranks);
    rl.question('rank again? Y/N (N)', (answer) => {
      if (answer === 'Y') {
        compare(ranks);
      }
      rl.close();
    });
  })
  // rl.on('close')
}

compare(qbs);
