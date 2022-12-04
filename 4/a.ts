import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');

let count = 0;
const lines = input.split('\n');
console.log(lines);
lines.pop();
console.log(lines);

for (let line of lines) {
    let left = line.split(',')[0].split('-');
    let right = line.split(',')[1].split('-');
    if ((parseInt(left[0]) <= parseInt(right[0]) && parseInt(left[1]) >= parseInt(right[1])) ||
        (parseInt(right[0]) <= parseInt(left[0]) && parseInt(right[1]) >= parseInt(left[1]))) {
        count += 1;
        console.log(line);
    }
}

console.log(count);
