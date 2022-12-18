import { log } from 'console';
import * as fs from 'fs';
import { Bits } from '../utils';
import { Shape, ShapeType } from './Shapes';
export const ex = "";

const ROCKS: number = 2022;

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

function PrintChamber(chamber: number[]): void {
    for (let line of chamber.slice(-10).reverse()) {
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


let maxHeight: number = 0;
let rock: Shape = new Shape(maxHeight + 4, GetNextShape());
while (true) {
    for (let jet of jets) {
        // Jet pushes the rock
        if (i === ROCKS + 1) {
            break;
        }
        rock.TryMove(chamber, jet);

        // rock falls
        if (!rock.Fall(chamber)) {
            maxHeight = AddShapeToChamber(chamber, maxHeight, rock);
            rock = new Shape(maxHeight + 4, GetNextShape());
        }
    }
    if (i === ROCKS + 1) {
        break;
    }
}
log(maxHeight);
