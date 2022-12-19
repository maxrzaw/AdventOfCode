import { log } from 'console';
import * as fs from 'fs';
export const ex = "";

const SIZE = 22;
const filename = process.argv[2];
type xyz = { x: number, y: number, z: number };

const input = fs.readFileSync(filename, 'utf8');
const cubes = input.trim().split('\n').map((line) => line.trim().split(',').map((s) => parseInt(s)));
const space: boolean[][][] = Array
    .from({ length: SIZE }, () => Array
        .from({ length: SIZE }, () => Array
            .from({ length: SIZE }, () => false)));

const ADJACENT_CUBES = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
];

let openSurfaces: number = 0;
for (let cube of cubes) {
    const [x, y, z] = cube;
    space[x][y][z] = true;
    if (x === 0 || x === SIZE - 1) {
        openSurfaces++;
    }
    if (y === 0 || y === SIZE - 1) {
        openSurfaces++;
    }
    if (z === 0 || z === SIZE - 1) {
        openSurfaces++;
    }
}

const seen: boolean[][][] = Array
    .from({ length: SIZE }, () => Array
        .from({ length: SIZE }, () => Array
            .from({ length: SIZE }, () => false)));
const stack: xyz[] = [];

// Not very often I do DFS with a stack instead of recursion
stack.push({ x: 0, y: 0, z: 0 });
while (stack.length > 0) {
    const cube = stack.pop();
    const [x, y, z] = [cube.x, cube.y, cube.z];
    if (seen[x][y][z]) {
        continue;
    } else {
        seen[x][y][z] = true;
    }

    for (let delta of ADJACENT_CUBES) {
        const [dx, dy, dz] = delta;
        if (x + dx >= 0 && y + dy >= 0 && z + dz >= 0 &&
            x + dx < SIZE && y + dy < SIZE && z + dz < SIZE) {
            if (space[x + dx][y + dy][z + dz]) {
                openSurfaces++
            } else {
                stack.push({ x: x + dx, y: y + dy, z: z + dz });
            }
        }
    }
}

log(openSurfaces);
