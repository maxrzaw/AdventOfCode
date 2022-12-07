import * as fs from 'fs';

declare global {
    interface Array<T> {
        sum(this: Array<number>): number;
    }
}

Array.prototype.sum = function() {
    return this.reduce((total: number, num: number) => total + num, 0);
}

console.log(fs.readFileSync(process.argv[2], 'utf8')
    .split("\n\n")
    .map((items) => items.split('\n')
        .map(val => parseInt(val, 10))
        .filter(n => !isNaN(n))
        .sum())
    .sort((a, b) => b - a)
    .splice(0, 3).sum());

