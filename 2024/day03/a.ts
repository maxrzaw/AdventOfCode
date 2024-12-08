import * as fs from 'fs';

const filename = process.argv[2];

const evaluate = (x: string) => {
  // mul(a,b)
  const trimmed = x
    .slice(4, -1)
    .split(',')
    .map((c) => parseInt(c));
  return trimmed[0] * trimmed[1];
};

const input = fs.readFileSync(filename, 'utf8');
const re = /mul\(\d+,\d+\)|do\(\)|don't\(\)/g;
const matches = input.match(re);

let sumPartOne = 0;
let sumPartTwo = 0;
let enabled = true;

matches.forEach((x) => {
  if (x === 'do()') {
    enabled = true;
  } else if (x === "don't()") {
    enabled = false;
  } else {
    const result = evaluate(x);
    sumPartOne += result;
    if (enabled) {
      sumPartTwo += result;
    }
  }
});

console.log(`Sum Part One: ${sumPartOne}`);
console.log(`Sum Part Two: ${sumPartTwo}`);
