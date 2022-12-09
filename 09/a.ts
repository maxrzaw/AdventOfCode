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

function print(arr: number[][]) {
    for (let i = 0; i < arr.length; ++i) {
        let out: string = "";
        for (let j = 0; j < arr.length; j++) {
            out += arr[arr.length - i - 1][j] === 0 ? '.' : '#';
        }
        console.log(out);
    }
}

const filename = process.argv[2];
const SIZE = 540;

const input = fs.readFileSync(filename, 'utf8');
const moves = input.trimEnd().split('\n');
const points: number[][] = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => 0));
let hx = 200;
let hy = 200;
let tx = 200;
let ty = 200;
points[hx][hy] = 1;

function isAdjacent(): boolean {
    if (Math.max(Math.abs(hx - tx), Math.abs(hy - ty)) > 1) {
        return false;
    }
    if (Math.abs(hx - tx) + Math.abs(hy - ty) > 2) {
        return false;
    }

    return true;
}

for (let move of moves) {
    const [dir, distance] = move.split(' ');
    const dist = parseInt(distance);

    const x_dir = getX(dir);
    const y_dir = getY(dir);

    for (let i = 0; i < dist; ++i) {
        hx += x_dir;
        hy += y_dir;

        if (!isAdjacent()) {
            if (Math.abs(hx - tx) > 0) {
                tx += Math.sign(hx - tx);
            }

            if (Math.abs(hy - ty) > 0) {
                ty += Math.sign(hy - ty);
            }

            points[tx][ty] = 1;
        }
    }

}

print(points);
let count = points.reduce((t, v) => t + v.reduce((s, v) => s + v, 0), 0);
console.log(count);
