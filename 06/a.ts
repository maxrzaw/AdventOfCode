import * as fs from 'fs';
export const x = "";

const filename: string = process.argv[2];
const count: number = parseInt(process.argv[3]);

const input: string = fs.readFileSync(filename, 'utf8');

let last: string[] = Array.from({ length: count }, () => "");

for (let i = 0; i < input.length; ++i) {
    last.unshift(input[i]);
    last.pop();

    let set: Set<string> = new Set(last);

    if (i > count && set.size === count) {
        console.log(i + 1);
        break;
    }
}
