import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];

let lines = fs.readFileSync(filename, 'utf8').split('\n').slice(0, -1);

let groups: string[][] = [];
while (lines.length) {
    groups.push(lines.slice(0, 3));
    lines = lines.slice(3);
}

const priorities: number[] = [];

for (let group of groups) {
    let [left, center, right] = group;
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

console.log(priorities.reduce((sum, value) => sum + value, 0));
