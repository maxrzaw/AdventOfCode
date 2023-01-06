import { log } from 'console';
import * as fs from 'fs';
export const ex = "";

const SIZE = 22;
const filename = process.argv[2];

const ADJACENT_CUBES = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
];

function GetSurfaceArea(space: boolean[][][], cube: number[]): number {
    let openSurfaces = 6;
    const [x, y, z] = cube;
    for (let delta of ADJACENT_CUBES) {
        const [dx, dy, dz] = delta;
        if (x + dx >= 0 && y + dy >= 0 && z + dz >= 0 &&
            x + dx < SIZE && y + dy < SIZE && z + dz < SIZE) {
            if (space[x + dx][y + dy][z + dz]) {
                openSurfaces--;
            }
        }
    }

    return openSurfaces;
}

const input = fs.readFileSync(filename, 'utf8');
const cubes = input.trim().split('\n').map((line) => line.trim().split(',').map((s) => parseInt(s)));
const space: boolean[][][] = Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => Array.from({ length: SIZE }, () => false)));

for (let cube of cubes) {
    const [x, y, z] = cube;
    space[x][y][z] = true;
}

let total: number = 0;
for (let cube of cubes) {
    total += GetSurfaceArea(space, cube);
}

log(total);
