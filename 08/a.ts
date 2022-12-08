import { log } from 'console';
import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');

let trees: number[][] = input.trimEnd().split('\n').map((line) => line.trimEnd().split('').map((num) => parseInt(num)));
const seen: number[][] = Array.from({ length: trees.length }, () => Array.from({ length: trees.length }, () => 0));

// left to right
for (let i = 0; i < trees.length; ++i) {
    let tallest: number = 0;
    for (let j = 0; j < trees[i].length; ++j) {
        if (trees[i][j] > tallest) {
            tallest = trees[i][j];
            seen[i][j] = 1;
        }
        if (i === 0 || j === 0 || i === trees.length - 1 || j === trees[0].length - 1) {
            seen[i][j] = 1;
        }
    }
}


//
// right to left
for (let i = 0; i < trees.length; ++i) {
    let tallest: number = 0;
    for (let j = 0; j < trees[i].length; ++j) {
        if (trees[trees.length - 1 - i][trees.length - 1 - j] > tallest) {
            tallest = trees[trees.length - 1 - i][trees.length - 1 - j];
            seen[trees.length - 1 - i][trees.length - 1 - j] = 1;
        }
    }
}

// top to bottom
for (let j = 0; j < trees.length; ++j) {
    let tallest: number = 0;
    for (let i = 0; i < trees[j].length; ++i) {
        if (trees[i][j] > tallest) {
            tallest = trees[i][j];
            seen[i][j] = 1;
        }
    }
}
// bottom to top

for (let j = 0; j < trees.length; ++j) {
    let tallest: number = 0;
    for (let i = 0; i < trees[j].length; ++i) {
        if (trees[trees.length - 1 - i][trees.length - 1 - j] > tallest) {
            tallest = trees[trees.length - 1 - i][trees.length - 1 - j];
            seen[trees.length - 1 - i][trees.length - 1 - j] = 1;
        }
    }
}


log(trees, seen);
log(seen.reduce((sum, val) => sum + val.reduce((s, v) => s + v, 0), 0));
