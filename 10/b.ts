import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');
const ops = input.split('\n');
let register: number = 1;
let pixels: string[] = [];
let adds: number[] = [];

let opIdx: number = 0;
for (let cycle = 1; cycle <= 240; ++cycle) {
    const x = (cycle - 1) % 40;
    pixels.push(Math.abs(x - register) < 2 ? '▓' : '░');

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

let out: string = "";
for (let i = 0; i < 240; ++i) {
    out += pixels[i];
    if ((i + 1) % 40 === 0) {
        console.log(out, i);
        out = "";
    }
}
