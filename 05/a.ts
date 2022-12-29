import * as fs from "fs";
export const x = "";

const [header, moves] = fs.readFileSync(process.argv[2], "utf8").split("\n\n").map((s) => s.trimEnd().split("\n"));
const stacksOne: string[][] = Array.from({ length: Math.ceil(header[0].length / 4) }, () => []);
const stacksTwo: string[][] = Array.from({ length: Math.ceil(header[0].length / 4) }, () => []);

for (let line of header.slice(0, -1)) {
    const crates: string[] = new Array<string>().fill("", Math.ceil(header[0].length / 4));
    let j = 0;
    for (let i = 0; i < line.length; i += 4) {
        crates[j] = line.slice(i, i + 4)[1];
        if (crates[j] !== " ") {
            stacksOne[j].unshift(crates[j]);
            stacksTwo[j].unshift(crates[j]);
        }
        ++j;
    }
}

for (let move of moves) {
    const [count, start, end] = move.split(" ").map((s) => parseInt(s)).filter((s) => !isNaN(s));
    stacksOne[end - 1].push(...stacksOne[start - 1].splice(-1 * count).reverse());
    stacksTwo[end - 1].push(...stacksTwo[start - 1].splice(-1 * count));
}

console.log(`Part One: ${stacksOne.map((s) => s.at(s.length - 1)).join("")}`);
console.log(`Part Two: ${stacksTwo.map((s) => s.at(s.length - 1)).join("")}`);
