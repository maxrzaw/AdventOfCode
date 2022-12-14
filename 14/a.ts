import { log } from 'console';
import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];
const GetX = (x: number): number => {
    return x - 450;
}

const DrawLine = (cave: string[][], start: number[], end: number[]): void => {
    // swapping the x and y here
    const [dy, dx] = [end[0] - start[0], end[1] - start[1]];
    const [startY, startX] = start;
    const length = Math.max(Math.abs(dx), Math.abs(dy));
    const nx = dx != 0 ? dx / Math.abs(dx) : 0;
    const ny = dy != 0 ? dy / Math.abs(dy) : 0;
    for (let i = 0; i <= length; ++i) {
        cave[startX + (i*nx)][startY + (i*ny)] = "#";
    }
}

const input = fs.readFileSync(filename, 'utf8');
const lines = input.trimEnd().split('\n').map((line) => line.trim().split(" -> ").map((point) => point.split(',').map((val) => parseInt(val))));
let max = [-Infinity, -Infinity];
let min = [Infinity, Infinity];
for (let line of lines) {
    for (let point of line) {
        point[0] = GetX(point[0]);
        min[0] = Math.min(point[0], min[0]);
        max[0] = Math.max(point[0], max[0]);
        min[1] = Math.min(point[1], min[1]);
        max[1] = Math.max(point[1], max[1]);
    }
}

const cave: string[][] = Array.from({ length: 10 }, () => Array.from({ length: 100 }, () => "."));

for (let line of lines) {
    for (let i = 0; i < line.length - 1; ++i) {
        DrawLine(cave, line[i], line[i+1]);
    }
}
PrintCave(cave);

function PrintCave(cave: string[][]) {
    for (let row of cave) {
        let out = "";
        for (let col of row) {
            out += col;
        }
        log(out);
    }
}

//log(cave);
log(min, max);
