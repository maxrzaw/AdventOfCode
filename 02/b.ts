import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];
console.log(filename);

const input = fs.readFileSync(filename, 'utf8');
const rounds = input.split('\n');
console.log(rounds);

let total_score = 0;
for (let round of rounds) {
    const p1 = round.split(' ')[0];
    const p2 = round.split(' ')[1];
    console.log(p1, p2);
    let score = 0;
    if (p1 === 'A') {
        if (p2 === 'Y') {
            score += 1;
            score += 3;
        } else if (p2 === 'Z') {
            score += 2;
            score += 6;
        } else if (p2 === 'X') {
            score += 3;
            score += 0;
        }
    } else if (p1 === 'B') {
        if (p2 === 'X') {
            score += 1;
            score += 0;
        } else if (p2 === 'Y') {
            score += 2;
            score += 3;
        } else if (p2 === 'Z') {
            score += 3;
            score += 6;
        }
    } else if (p1 === 'C') {
        if (p2 === 'Z') {
            score += 1;
            score += 6;
        } else if (p2 === 'X') {
            score += 2;
            score += 0;
        } else if (p2 === 'Y') {
            score += 3;
            score += 3;
        }
    }
    total_score += score;
}

console.log(total_score);
