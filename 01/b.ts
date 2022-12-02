import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');

let elves = input.split("\n\n");

const highest: number[] = [];

for (const elve of elves)
{
    const items = elve.split("\n")
        .map(value => parseInt(value, 10))
        .filter(value => !isNaN(value));

    const calories = items.reduce( (sum, value) => sum + value, 0)

    if (highest.length < 3)
    {
        highest.push(calories);
        highest.sort((a, b) => a - b);
    }
    else if (calories > highest[0])
    {
        highest[0] = calories;
        highest.sort((a, b) => a - b);
    }
}

console.log(highest.reduce( (sum, value) => sum + value, 0));
