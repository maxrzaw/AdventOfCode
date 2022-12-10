import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');
const ops = input.split('\n');
let register: number = 1;
let totalSignalStrength: number = 0;
let adds: number[] = [];

const keyCycles: number[] = [20, 60, 100, 140, 180, 220];
let opIdx: number = 0;
for (let cycle = 1; cycle <= 220; ++cycle) {
    if (keyCycles.find((x) => x === cycle) !== undefined) {
        const signalStrength = cycle * register;
        totalSignalStrength += signalStrength;
    }

    if (adds.length === 0) {
        const op = ops[opIdx++];
        const splitOp = op.split(' ');
        // Adds noop or the first cycle of delay
        adds.push(0);
        if (splitOp.length === 2) {
            // this is an addx since the length was 2
            adds.push(parseInt(splitOp[1]));
        }
    }
    register += adds.shift();
}

console.log(`Total Signal Strength: ${totalSignalStrength}`);
