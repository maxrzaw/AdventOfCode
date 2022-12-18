import { log } from 'console';
import { Bits } from '../utils';

export enum ShapeType {
    HorizontalLine,
    Cross,
    RightAngle,
    VerticalLine,
    Square,
};

function CreateHorizontalLine(): number[] {
    return [Bits.SetBits(0, [3, 4, 5, 6])];
}

function CreateCross(): number[] {
    let arr: number[] = [];
    arr.push(Bits.SetBits(0, [4]));
    arr.push(Bits.SetBits(0, [3, 4, 5]));
    arr.push(Bits.SetBits(0, [4]));
    return arr;
}

function CreateRightAngle(): number[] {
    let arr: number[] = [];
    arr.push(Bits.SetBits(0, [3, 4, 5]));
    arr.push(Bits.SetBits(0, [5]));
    arr.push(Bits.SetBits(0, [5]));
    return arr;
}

function CreateVerticalLine(): number[] {
    let arr: number[] = [];
    arr.push(Bits.SetBits(0, [3]));
    arr.push(Bits.SetBits(0, [3]));
    arr.push(Bits.SetBits(0, [3]));
    arr.push(Bits.SetBits(0, [3]));
    return arr;
}

function CreateSquare(): number[] {
    let arr: number[] = [];
    arr.push(Bits.SetBits(0, [3, 4]));
    arr.push(Bits.SetBits(0, [3, 4]));
    return arr;
}

export class Shape {
    private bottomRow: number = null;

    // who knows if I will need this?
    private shapeType: ShapeType = null;

    // the shape will technically be upside down
    // Representing it as an array of numbers, settign the bits where there is
    // material
    private shape: number[] = null;

    constructor(startingLevel: number, shapeType: ShapeType) {
        this.bottomRow = startingLevel;
        switch (shapeType) {
            case ShapeType.HorizontalLine:
                this.shape = CreateHorizontalLine();
                break;

            case ShapeType.Cross:
                this.shape = CreateCross();
                break;

            case ShapeType.RightAngle:
                this.shape = CreateRightAngle();
                break;

            case ShapeType.VerticalLine:
                this.shape = CreateVerticalLine();
                break;

            case ShapeType.Square:
                this.shape = CreateSquare();
                break;

            default:
                log("Invalid shape type passed into the constructor for Shape");
                break;
        }
    }

    private WillCollide(chamber: number[]): boolean {
        for (let i = 0; i < this.shape.length; ++i) {
            // if there are no rows, we have not collided
            if (this.bottomRow - 1 + i >= chamber.length) {
                return false;
            }

            if (Bits.Union(chamber[this.bottomRow - 1 + i], this.shape[i]) !== 0) {
                return true;
            }
        }
        return false;
    }

    /** returns true if the shape fell, false if it collided */
    public Fall(chamber: number[]): boolean {
        if (this.WillCollide(chamber)) {
            return false;
        }

        this.bottomRow--;
        return true;
    }

    private Move(x: string): void {
        for (let i = 0; i < this.shape.length; ++i) {
            if (x === '<') {
                this.shape[i] = this.shape[i] >> 1;
            }
            else if (x === '>') {
                this.shape[i] = this.shape[i] << 1;
            }
            else {
                log(`Invalid move direction: ${x}`);
            }
        }
    }

    public TryMove(chamber: number[], x: string): void {
        let canMove: boolean = true;

        for (let i = 0; i < this.shape.length; ++i) {
            let moved: number = 0;

            if (x === '<') {
                moved = this.shape[i] >> 1;
            }
            else if (x === '>') {
                moved = this.shape[i] << 1;
            }
            else {
                log(`Invalid move direction: ${x}`);
            }

            const line = chamber[this.bottomRow + i] ?? Bits.SetBits(0, [0, 8]);
            if (Bits.Union(moved, line) !== 0) {
                canMove = false;
                break;
            }
        }
        if (canMove) {
            this.Move(x);
        }
    }

    public GetShape(): number[] {
        return this.shape;
    }

    public GetShapeType(): ShapeType {
        return this.shapeType;
    }

    public GetBottomLevel(): number {
        return this.bottomRow;
    }

    public GetTopLevel(): number {
        return this.bottomRow + this.shape.length - 1;
    }

    public Print(includeWalls: boolean = false): void {
        for (let line of this.shape.slice().reverse()) {
            if (includeWalls) {
                line = Bits.SetBits(line, [0, 8]);
            }
            log(line.toString(2).split("").reverse().join("").slice(0, 9).padEnd(9, "0").replaceAll("0", ".").replaceAll("1", "#"));
        }
    }
};


