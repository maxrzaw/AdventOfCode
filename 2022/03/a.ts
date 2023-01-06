import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];

let lines = fs.readFileSync(filename, 'utf8').split('\n').slice(0, -1);

const priorities: number[] = [];
for (let sack of lines) {
    let left = sack.substring(0, (sack.length / 2));
    let right = sack.substring((sack.length / 2));
    for (let letter of left) {
        if (right.includes(letter)) {
            if (letter.toUpperCase() === letter) {
                priorities.push(letter.charCodeAt(0) - 'A'.charCodeAt(0) + 27);
            } else {
                priorities.push(letter.charCodeAt(0) - 'a'.charCodeAt(0) + 1);
            }
            break;
        }
    }
}

console.log(priorities.reduce( (sum, value) => sum + value, 0));
