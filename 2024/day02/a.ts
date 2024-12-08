import * as fs from 'fs';
const filename = process.argv[2];

let safeReportsPartTwo = 0;
let safeReportsPartOne = 0;

const input = fs.readFileSync(filename, 'utf8');
const reports = input
  .split('\n')
  .filter((x) => x !== '')
  .map((x) => x.split(' ').map((x) => parseInt(x)));

/*
 * Criteria that makes a report unsafe:
 * 1. Levels are not all increasing or all decreasing
 * 2. Two adjacent levels differ by less than one
 * 3. Two adjacent levels differ by more than three
 */
const isSafe = (report: number[]) => {
  let [safe, increasing, decreasing] = [true, true, true];
  let index = 1;
  let prev: number = report[0];

  do {
    const level = report[index++];
    const diff = level - prev;

    if (increasing && prev >= level) {
      increasing = false;
    }
    if (decreasing && level >= prev) {
      decreasing = false;
    }

    if (!increasing && !decreasing) {
      safe = false;
    }

    prev = level;

    const absoluteDiff = Math.abs(diff);
    if (absoluteDiff < 1 || absoluteDiff > 3) {
      safe = false;
      continue;
    }
  } while (safe && index < report.length);
  return safe;
};

reports.forEach((report) => {
  const safe = isSafe(report);

  if (safe) {
    safeReportsPartTwo++;
    safeReportsPartOne++;
  } else {
    for (let index = 0; index < report.length; index++) {
      const modifiedReport = [...report.slice(0, index), ...report.slice(index + 1)];
      if (isSafe(modifiedReport)) {
        safeReportsPartTwo++;
        return;
      }
    }
  }
});

console.log(`Total Safe Part One: ${safeReportsPartOne}`);
console.log(`Total Safe Part Two: ${safeReportsPartTwo}`);
