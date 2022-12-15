import { log } from 'console';
import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];
const GetX = (x: number): number => {
    return x - 325;
}

function PrintCave(cave: string[][]) {
    let i = 0;
    for (let row of cave) {
        let out = "" + i++ + '\t';
        for (let col of row) {
            out += col;
        }
        log(out);
    }
}

const DrawLine = (cave: string[][], start: number[], end: number[]): void => {
    const [dx, dy] = [end[0] - start[0], end[1] - start[1]];
    const [startX, startY] = start;
    const length = Math.max(Math.abs(dx), Math.abs(dy));
    const nx = dx != 0 ? dx / Math.abs(dx) : 0;
    const ny = dy != 0 ? dy / Math.abs(dy) : 0;
    for (let i = 0; i <= length; ++i) {
        cave[startY + (i * ny)][startX + (i * nx)] = "#";
    }
}

const source: number[] = [0, GetX(500)];

const input = fs.readFileSync(filename, 'utf8');
const lines = input.trimEnd().split('\n').map((line) => line.trim().split(" -> ").map((point) => point.split(',').map((val) => parseInt(val))));

const cave: string[][] = Array.from({ length: 174 }, () => Array.from({ length: 350 }, () => "."));

for (let line of lines) {
    for (let point of line) {
        point[0] = GetX(point[0]);
    }
}

for (let line of lines) {
    for (let i = 0; i < line.length - 1; ++i) {
        DrawLine(cave, line[i], line[i + 1]);
    }
}
cave[source[0]][source[1]] = '+';

let totalSand = 0;
let sand = source;
while (true) {
    if (sand[0] + 1 === cave.length) {
        break;
    }

    const dx = [0, -1, 1];
    const dy = [1, 1, 1];
    let stopped: boolean = true;

    for (let i = 0; i < 3; ++i) {
        if (cave[sand[0] + dy[i]][sand[1] + dx[i]] === '.') {
            sand = [sand[0] + dy[i], sand[1] + dx[i]];
            stopped = false;
            break;
        }
    }

    if (stopped) {
        cave[sand[0]][sand[1]] = 'o';
        totalSand++;
        if (sand === source) {
            break;
        }
        sand = source;
    }
}

PrintCave(cave);
log(totalSand);
