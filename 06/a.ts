import * as fs from 'fs';
export const x = "";

const count: number = parseInt(process.argv[3]);
const input: string = fs.readFileSync(process.argv[2], 'utf8');

for (let i = 0; i < input.length; ++i) {
    if (new Set(input.substring(i, count + i)).size === count) {
        console.log(i + count);
        break;
    }
}
