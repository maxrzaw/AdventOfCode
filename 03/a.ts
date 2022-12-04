import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');
const lines = input.split('\n');
lines.pop();

const priorities: number[] = [];
for (let sack of lines) {
    let length = sack.length;
    let left = sack.substring(0, (length / 2));
    let right = sack.substring((length / 2));
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
