import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');
let lines = input.split('\n');
lines.pop();

let groups: string[][] = [];
while (lines.length) {
    let group = lines.slice(0, 3);
    groups.push(group);
    lines = lines.slice(3);
}

const priorities: number[] = [];

for (let group of groups) {
    let left = group[0];
    let center = group[1];
    let right = group[2];
    for (let letter of left) {
        if (right.includes(letter) && center.includes(letter)) {
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
