import * as fs from 'fs';
export const x = "";

declare global { interface Array<T> { max(this: Array<number>): number; } }
Array.prototype.max = function() { return Math.max.apply(null, this); };

let trees: number[][] = fs.readFileSync(process.argv[2], 'utf8').trimEnd().split('\n').map((line) => line.trimEnd().split('').map((num) => parseInt(num)));
const scenicScores: number[][] = Array.from({ length: trees.length }, () => Array.from({ length: trees.length }, () => 0));

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

    return south * north * east * west;
}

for (let i = 0; i < trees.length; ++i) {
    for (let j = 0; j < trees.length; ++j) {
        scenicScores[i][j] = calculateScore(i, j);
    }
}

console.log(scenicScores.map((line) => line.max()).max());
