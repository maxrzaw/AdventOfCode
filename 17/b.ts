import { log } from 'console';
import * as fs from 'fs';
import { Bits } from '../utils';
import { Shape, ShapeType } from './Shapes';
export const ex = "";

const shapeOrder: ShapeType[] = [
    ShapeType.HorizontalLine,
    ShapeType.Cross,
    ShapeType.RightAngle,
    ShapeType.VerticalLine,
    ShapeType.Square,
];

let i = 0;
function GetNextShape(): ShapeType {
    return shapeOrder[i++ % shapeOrder.length];
}

function PrintChamber(chamber: number[], end: number): void {
    log(chamber.slice(-10).reverse());
    for (let line of chamber.slice(end - 10, end + 1).reverse()) {
        log(line.toString(2).split("").reverse().join("").slice(0, 9).padEnd(9, "0").replaceAll("0", ".").replaceAll("1", "#"));
    }
}

const wallsMask: number = Bits.SetBits(0, [0, 8]);
const floor: number = Bits.SetBits(0, [0, 1, 2, 3, 4, 5, 6, 7, 8]);
const chamber: number[] = [floor];

// returns the height of the stack after adding shape
function AddShapeToChamber(chamber: number[], currentHeight: number, shape: Shape): number {
    const shapeArr: number[] = shape.GetShape();
    const shapeBottom = shape.GetBottomLevel();

    // make sure the chamber is tall enough to add the shape
    while (chamber.length < shapeBottom + shapeArr.length) {
        chamber.push(wallsMask);
    }

    for (let i = 0; i < shapeArr.length; ++i) {
        chamber[shapeBottom + i] |= shapeArr[i];
    }

    return Math.max(currentHeight, shape.GetTopLevel());
}

const filename = process.argv[2];
const input = fs.readFileSync(filename, 'utf8')
const jets = input.trim().split('');

let rocks: number[] = [];
let maxHeight: number = 0;
let rock: Shape = new Shape(maxHeight + 4, GetNextShape());
type value = { rockCount: number, height: number, history: number[], hits: number };

function CompareValues(a: value, b: value): boolean {
    if (a.hits < 1) {
        return false;
    }

    for (let i = 0; i < a.history.length; ++i) {
        if (a.history[i] !== b.history[i]) {
            return false;
        }
    }
    return true;
}

let cache: Map<string, value> = new Map<string, value>();
function CheckCache(chamber: number[], height: number, wind: number, rock: number): boolean {
    const k = wind.toString() + " " + (rock % shapeOrder.length).toString();
    const v = { rockCount: rock, height: height, history: chamber.slice(-10), hits: 0 };
    if (!cache.has(k)) {
        cache.set(k, v);
    } else {
        const a = cache.get(k);
        if (CompareValues(a, v)) {
            log(k, cache.get(k), v);
            let rocksInRepition = rock - a.rockCount;
            let heightInRepition = height - a.height;
            let rocksRequired = 1000000000000 - a.rockCount;
            let repsRequired = Math.floor(rocksRequired / rocksInRepition);
            let mod = rocksRequired % rocksInRepition;
            let estimate = a.height + heightInRepition * repsRequired;
            const extra = rocks[a.rockCount + mod - 1] - rocks[a.rockCount - 1];
            log(`Total: ${extra + estimate}`);

            return true;
        }
        cache.get(k).hits += 1;
    }
    return;
}

let end = false;
while (!end) {
    for (let j = 0; j < jets.length; ++j) {
        const jet = jets[j];
        // Jet pushes the rock
        rock.TryMove(chamber, jet);

        // rock falls
        if (!rock.Fall(chamber)) {
            maxHeight = AddShapeToChamber(chamber, maxHeight, rock);
            // I hope 2000 is enough
            if (i < 2000) {
                rocks.push(maxHeight);
            }
            if (CheckCache(chamber, maxHeight, j, i)) {
                end = true;
                break;
            }
            rock = new Shape(maxHeight + 4, GetNextShape());
        }
    }
}
