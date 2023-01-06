import * as fs from 'fs';
export const x = "";

const ops = fs.readFileSync(process.argv[2], 'utf8').split('\n');
let register: number = 1;
let adds: number[] = [];
let totalSignalStrength: number = 0;
let pixels: string[] = [];

let opIdx: number = 0;
for (let cycle = 1; cycle <= 240; ++cycle) {
    if ((cycle + 20) % 40 === 0) {
        const signalStrength = cycle * register;
        totalSignalStrength += signalStrength;
    }

    const x = (cycle - 1) % 40;
    pixels.push(Math.abs(x - register) < 2 ? '▓' : ' ');

    if (adds.length === 0) {
        const op = ops[opIdx++];
        const splitOp = op.split(' ');

        // Adds noop or the first cycle of delay
        adds.push(0);

        if (splitOp.length === 2) {
            // this is an addx
            adds.push(parseInt(splitOp[1]));
        }
    }
    register += adds.shift();
}

console.log(`Part One: Total Signal Strength: ${totalSignalStrength}\nPart Two:`);

let out: string = "";
for (let i = 0; i < 240; ++i) {
    out += pixels[i];
    if ((i + 1) % 40 === 0) {
        console.log(out);
        out = "";
    }
}
