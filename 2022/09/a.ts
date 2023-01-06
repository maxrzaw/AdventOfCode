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

const KNOT_COUNT: number = parseInt(process.argv[3]);

const moves = fs.readFileSync(process.argv[2], 'utf8').trimEnd().split('\n');
const points: number[][] = Array.from({ length: 500 }, () => Array.from({ length: 250 }, () => 0));

const exes: number[] = Array.from({ length: KNOT_COUNT }, () => 125);
const whys: number[] = Array.from({ length: KNOT_COUNT }, () => 250);

for (let move of moves) {
    const [dir, distance] = move.split(' ');
    const dist = parseInt(distance);

    const x_dir = getX(dir);
    const y_dir = getY(dir);

    for (let i = 0; i < dist; ++i) {
        exes[0] += x_dir;
        whys[0] += y_dir;
        for (let j = 1; j < KNOT_COUNT; ++j) {
            if (isAdjacent(j)) {
                continue;
            }

            if (Math.abs(exes[j - 1] - exes[j]) > 0) {
                exes[j] += Math.sign(exes[j - 1] - exes[j]);
            }

            if (Math.abs(whys[j - 1] - whys[j]) > 0) {
                whys[j] += Math.sign(whys[j - 1] - whys[j]);
            }

            points[exes[KNOT_COUNT - 1]][whys[KNOT_COUNT - 1]] = 1;
        }
    }
}

console.log(points.reduce((t, v) => t + v.reduce((s, v) => s + v, 0), 0));
