import { log } from "console";
import * as fs from "fs";
export const x = "";

const filename = process.argv[2];

const input = fs.readFileSync(filename, "utf8");

const setup = input.split("\n\n").map((s) => s.trimEnd().split("\n"));
const header = setup[0].slice(0, -1); // remove the row of labels
const instructions = setup[1];

const stackCount = Math.ceil(header[0].length / 4);
const stacks: string[][] = Array.from({ length: stackCount }, () => []);

for (let line of header) {
    const crates: string[] = new Array<string>().fill("", stackCount);
    let j = 0;
    for (let i = 0; i < line.length; i += 4) {
        const crate = line.slice(i, i + 4)[1];
        crates[j] = line.slice(i, i + 4)[1];
        if (crate !== " ") {
            stacks[j].unshift(crate);
        }
        ++j;
    }
}

for (let instruction of instructions) {
    const [count, start, end] = instruction
        .split(" ")
        .map((s) => parseInt(s))
        .filter((s) => !isNaN(s));
    stacks[end - 1].push(...stacks[start - 1].splice(-1 * count).reverse());
}

log(stacks.map((s) => s.at(s.length - 1)).join(""));
