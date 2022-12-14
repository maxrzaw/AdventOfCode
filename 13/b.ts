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

function Compare(left: Array<any> | number, right: Array<any> | number): Result {
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
        const length = Math.min(left.length, right.length);
        for (let i = 0; i < length; ++i) {
            let result = Compare(left[i], right[i]);
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

    if (!Array.isArray(left)) {
        left = [left];
    }
    if (!Array.isArray(right)) {
        right = [right];
    }

    return Compare(left, right);
}

//Function used to determine the order of the elements. It is expected to return
//a negative value if the first argument is less than the second argument, zero if they're equal, and a positive
//value otherwise. If omitted, the elements are sorted in ascending, ASCII character order.
function CompareStrings(a: string, b: string): number {
    const aJson = JSON.parse(a);
    const bJson = JSON.parse(b);
    const result = Compare(aJson, bJson);

    if (result === Result.Right) {
        return -1;
    } else if (result === Result.Wrong) {
        return 1;
    } else {
        return 0;
    }
}

const filename = process.argv[2];
const input = fs.readFileSync(filename, 'utf8');

const pairs = input.trimEnd().split('\n\n').flatMap((pair) => pair.trim().split('\n'));
pairs.sort((a, b) => CompareStrings(a, b));
const two = pairs.indexOf("[[2]]") + 1;
const six = pairs.indexOf("[[6]]") + 1;
let product = two * six;
log(product);

