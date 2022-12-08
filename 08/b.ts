import { log, warn } from 'console';
import * as fs from 'fs';
export const x = "";
declare global {
    interface Array<T> {
        max(this: Array<number>): number;
    }
}
Array.prototype.max = function() {
    return Math.max.apply(null, this);
};

Math.max
const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');

let trees: number[][] = input.trimEnd().split('\n').map((line) => line.trimEnd().split('').map((num) => parseInt(num)));
const scenicScores: number[][] = Array.from({ length: trees.length }, () => Array.from({ length: trees.length }, () => 0));

// left to right
let calculateScore = function(row: number, col: number) {
    const height = trees[row][col];
    let south = 0;
    let north = 0;
    let east = 0;
    let west = 0;

    for (let i = row + 1; i < trees.length; ++i) {
        south++;
        if (trees[i][col] >= height) {
            break;
        }
    }

    if (row > 0) {
        for (let i = row - 1; i >= 0; --i) {
            north++;
            if (trees[i][col] >= height) {
                break;
            }
        }
    }

    for (let i = col + 1; i < trees[row].length; ++i) {
        east++;
        if (trees[row][i] >= height) {
            break;
        }
    }

    if (col > 0) {
        for (let i = col - 1; i >= 0; --i) {
            west++;
            if (trees[row][i] >= height) {
                break;
            }
        }
    }

    log(row, col);
    log(south, north, east, west);
    return south * north * east * west;
}
for (let i = 0; i < trees.length; ++i) {
    for (let j = 0; j < trees.length; ++j) {
        scenicScores[i][j] = calculateScore(i, j);
    }
}

log(trees, scenicScores);
log(scenicScores.map((line) => line.max()).max());
log(trees[0].length, trees.length);
