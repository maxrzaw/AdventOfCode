import { warn } from 'console';
import * as fs from 'fs';
export const x = "";

function getX(dir: string): number {
    if (dir === 'L' || dir === 'R') {
        return 0;
    }
    if (dir === 'U') {
        return 1;
    }
    return -1;
}

function getY(dir: string): number {
    if (dir === 'U' || dir === 'D') {
        return 0;
    }
    if (dir === 'R') {
        return 1;
    }
    return -1;
}

function isAdjacent(current: number): boolean {
    if (Math.max(Math.abs(exes[current - 1] - exes[current]), Math.abs(whys[current - 1] - whys[current])) > 1) {
        return false;
    }
    if (Math.abs(exes[current - 1] - exes[current]) + Math.abs(whys[current - 1] - whys[current]) > 2) {
        return false;
    }

    return true;
}

function print(arr: number[][]) {
    for (let i = 0; i < arr.length; ++i) {
        let out: string = String(i).padStart(3, '0');
        for (let j = 0; j < arr[i].length; j++) {
            out += arr[arr.length - i - 1][j] === 0 ? '.' : '#';
        }
        console.log(out);
    }
}

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');
const moves = input.trimEnd().split('\n');
// I wanted to use a set for this, but wasted about 40 minutes trying to get it
// working and just gave up...
const points: number[][] = Array.from({ length: 409 }, () => Array.from({ length: 191 }, () => 0));

const exes: number[] = Array.from({ length: 10 }, () => 71);
const whys: number[] = Array.from({ length: 10 }, () => 190);

for (let move of moves) {
    const [dir, distance] = move.split(' ');
    const dist = parseInt(distance);

    const x_dir = getX(dir);
    const y_dir = getY(dir);

    for (let i = 0; i < dist; ++i) {
        exes[0] += x_dir;
        whys[0] += y_dir;
        for (let j = 1; j < 10; ++j) {

            if (isAdjacent(j)) {
                continue;
            }
            if (Math.abs(exes[j - 1] - exes[j]) > 0) {
                exes[j] += Math.sign(exes[j - 1] - exes[j]);
            }

            if (Math.abs(whys[j - 1] - whys[j]) > 0) {
                whys[j] += Math.sign(whys[j - 1] - whys[j]);
            }

            points[exes[9]][whys[9]] = 1;
        }
    }
}

let count = points.reduce((t, v) => t + v.reduce((s, v) => s + v, 0), 0);
print(points);
console.log(count);
