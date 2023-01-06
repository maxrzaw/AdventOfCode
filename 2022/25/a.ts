import { log } from 'console';
import * as fs from 'fs';
export const ex = "";

const filename = process.argv[2];

const numericValues: Map<string, number> = new Map<string, number>([
    ["0", 0],
    ["1", 1],
    ["2", 2],
    ["-", -1],
    ["=", -2],
]);

const input = fs.readFileSync(filename, 'utf8');
let sum = input.trim().split('\n').map((line) => line.trim().split('').reverse()
    .reduce((acc, curr, idx) => acc + Math.pow(5, idx) * numericValues.get(curr), 0))
    .reduce((acc, curr) => acc + curr, 0);
log(sum);

let snafuDigits = [];
while (sum != 0) {
    sum += 2;
    snafuDigits.unshift("=-012"[sum % 5]);
    sum = Math.floor(sum / 5);
}

log(snafuDigits.join(''));
