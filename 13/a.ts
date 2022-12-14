import { log } from 'console';
import * as fs from 'fs';
export const x = "";

function isNumber(obj: any): boolean {
    return typeof (obj) === 'number';
}

enum Result {
    Right,
    Wrong,
    Inconclusive
}

function Compare(left: Array<any> | number, right: Array<any> | number, prefix: string = ""): Result {
    log(`${prefix}- Compare ${left} vs ${right}`);

    // Both numbers
    if (isNumber(left) && isNumber(right)) {
        if (left < right) {
            log(prefix + "  - Left side is smaller, so imputs are in the right order");
            return Result.Right;
        } else if (left > right) {

            log(prefix + "  - Right side is smaller, so imputs are not in the right order");
            return Result.Wrong;
        }
        return Result.Inconclusive;
    }

    // Both Arrays
    if (Array.isArray(left) && Array.isArray(right)) {
        const length = Math.min(left.length, right.length);
        for (let i = 0; i < length; ++i) {
            let result = Compare(left[i], right[i], prefix + "  ");
            if (result != Result.Inconclusive) {
                return result;
            }
        }

        if (right.length < left.length) {
            log(prefix + "  - Right side ran out of items, so inputs are not in the right order");
            return Result.Wrong;
        } else if (left.length < right.length) {
            log(prefix + "  - Left side ran out of items, so inputs are in the right order");
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

const filename = process.argv[2];
const input = fs.readFileSync(filename, 'utf8');
const pairs = input.trimEnd().split('\n\n');

let sum = 0;
for (let i = 0; i < pairs.length; ++i) {
    const [left, right] = pairs[i].split('\n');
    const leftArray: Array<any> = JSON.parse(left.trim()) as Array<any>;
    const rightArray: Array<any> = JSON.parse(right.trim()) as Array<any>;

    log(`\n== Pair ${i + 1} ==`);
    log(pairs[i]);
    let result = Compare(leftArray, rightArray);
    if (result === Result.Right) {
        sum += i + 1;
    }
}

log(sum);
