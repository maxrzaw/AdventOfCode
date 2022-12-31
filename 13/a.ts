import * as fs from 'fs';
export const x = "";

function isNumber(obj: any): boolean { return typeof (obj) === 'number'; }

enum Result { Right, Wrong, Inconclusive }

function Compare(left: Array<any> | number, right: Array<any> | number, prefix: string = ""): Result {
    // Both numbers
    if (isNumber(left) && isNumber(right)) {
        if (left < right) {
            return Result.Right;
        } else if (left > right) {
            return Result.Wrong;
        }
        return Result.Inconclusive;
    }

    // Both Arrays
    if (Array.isArray(left) && Array.isArray(right)) {
        for (let i = 0; i < Math.min(left.length, right.length); ++i) {
            const result = Compare(left[i], right[i], prefix + "  ");
            if (result != Result.Inconclusive) {
                return result;
            }
        }

        if (right.length < left.length) {
            return Result.Wrong;
        } else if (left.length < right.length) {
            return Result.Right;
        }

        return Result.Inconclusive;
    }

    // convert numbers into arrays for comparison
    if (!Array.isArray(left)) {
        left = [left];
    }
    if (!Array.isArray(right)) {
        right = [right];
    }

    return Compare(left, right, prefix + "  ");
}

const pairs = fs.readFileSync(process.argv[2], 'utf8').trimEnd().split('\n\n');

let sum = 0;
let two = 1;
let six = 2;
for (let i = 0; i < pairs.length; ++i) {
    const [left, right] = pairs[i].split('\n').map((s) => JSON.parse(s.trim()) as Array<any>);

    // Part One
    let result = Compare(left, right);
    if (result === Result.Right) {
        sum += i + 1;
    }

    // Part Two
    if (Compare([[2]], left) === Result.Wrong) {
        two++;
    }
    if (Compare([[2]], right) === Result.Wrong) {
        two++;
    }
    if (Compare([[6]], left) === Result.Wrong) {
        six++;
    }
    if (Compare([[6]], right) === Result.Wrong) {
        six++;
    }
}

console.log(`Part One: ${sum}`);
console.log(`Part Two: ${two * six}`);
