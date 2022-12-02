import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];
console.log(filename);

const input = fs.readFileSync(filename, 'utf8');

let elves = input.split("\n\n");

let highest = 0;

for (const elve of elves)
{
    let count = 0;
    const items = elve.split("\n");
    for (const item of items)
    {
        const calories = parseInt(item, 10);
        count += calories;
    }

    if (count > highest)
    {
        highest = count;
    }
}

console.log(highest);
