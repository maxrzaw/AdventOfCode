import { log } from 'console';
import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');

const elves = input.split('\n\n');

console.log(elves.map((elf) => elf.split('\n').reduce((total, num) => total + parseInt(num), 0)).sort().reverse().slice(1, 4).reduce((total, num) => total + num, 0));
