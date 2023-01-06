import * as fs from 'fs';
export const ex = "";

const partOne: boolean = process.argv[3] === "one";

enum TileType { Open = '.', Wall = '#', Void = ' ', };

enum Facing { Left = "Left", Right = "Right", Up = "Up", Down = "Down", None = "None", };

class Tile {
    type: TileType;
    facing: Facing = Facing.None;
    constructor(type: TileType) {
        this.type = type;
    }
};

function GetFacingValue(facing: Facing): number {
    console.assert(facing !== Facing.None, "GetFacingValue called with None");
    switch (facing) {
        case Facing.Right:
            return 0;
        case Facing.Down:
            return 1;
        case Facing.Left:
            return 2;
        case Facing.Up:
            return 3;
    };
}

function GetFacingDelta(facing: Facing): number[] {
    console.assert(facing !== Facing.None, "GetFacingDelta called with None");
    switch (facing) {
        case Facing.Right:
            return [0, 1];
        case Facing.Down:
            return [1, 0];
        case Facing.Left:
            return [0, -1];
        case Facing.Up:
            return [-1, 0];
    }
}

function ParseMove(move: string): Facing | number {
    switch (move) {
        case 'R':
            return Facing.Right;
        case 'L':
            return Facing.Left;
        default:
            return parseInt(move);
    };
}

function IsTurn(move: string): boolean {
    return move === 'R' || move === 'L';
}

function ModifyFacing(current: Facing, modifier: Facing): Facing {
    console.assert(modifier === Facing.Right || modifier === Facing.Left);
    switch (current) {
        case Facing.Right:
            switch (modifier) {
                case Facing.Right:
                    return Facing.Down;
                case Facing.Left:
                    return Facing.Up;
            };
        case Facing.Down:
            switch (modifier) {
                case Facing.Right:
                    return Facing.Left;
                case Facing.Left:
                    return Facing.Right;
            };
        case Facing.Left:
            switch (modifier) {
                case Facing.Right:
                    return Facing.Up;
                case Facing.Left:
                    return Facing.Down;
            };
        case Facing.Up:
            switch (modifier) {
                case Facing.Right:
                    return Facing.Right;
                case Facing.Left:
                    return Facing.Left;
            };
    };
};

function MoveForward(board: Tile[][], row: number, col: number, currentDirection: Facing, distance: number): { row: number, col: number, facing: Facing } {
    let lastConfirmed: { row: number, col: number, facing: Facing } = { row: row, col: col, facing: currentDirection };

    while (distance > 0) {
        console.assert(currentDirection !== Facing.None, `Facing: ${currentDirection.toString()}`);
        const delta: number[] = GetFacingDelta(currentDirection);
        let newRow: number;
        let newCol: number;
        if (partOne) {
            newRow = ((row + delta[0]) % board.length + board.length) % board.length;
            newCol = ((col + delta[1]) % length + length) % length;
        }
        else {
            newRow = row + delta[0];
            newCol = col + delta[1];
            // we go out of bounds
            if (newRow > board.length - 1 || newRow < 0
                || newCol > board[row].length - 1 || newCol < 0
                || board[newRow][newCol].type === TileType.Void) {
                const wrapped = Wrap(row, col, currentDirection);
                currentDirection = wrapped.facing;
                newRow = wrapped.row;
                newCol = wrapped.col;
                console.assert(currentDirection !== Facing.None, `Facing after going off the edge: ${currentDirection.toString()}, curent face: ${GetFace(row, col).toString()}, current location: [${row}, ${col}]\n`);
            }
        }



        const tile: Tile = board[newRow][newCol];
        switch (tile.type) {
            case TileType.Open:
                tile.facing = currentDirection;
                distance--;
                row = newRow;
                col = newCol;
                lastConfirmed = { row: row, col: col, facing: currentDirection };
                break;
            case TileType.Void:
                row = newRow;
                col = newCol;
                console.assert(partOne, "WE SHOULD NOT ARRIVE HERE ON PART TWO");
                break;
            case TileType.Wall:
                distance = 0;
                break;
        }
    }

    console.assert(lastConfirmed.facing !== Facing.None);
    return lastConfirmed;
}

function GetFace(row: number, col: number): number {
    const length: number = 50;
    if (row < length) {
        console.assert(col >= length);
        if (col < 2 * length) {
            return 1;
        } else {
            return 2;
        }
    } else if (row < 2 * length) {
        console.assert(col >= length);
        console.assert(col < 2 * length);
        return 3;
    } else if (row < 3 * length) {
        console.assert(col < 2 * length);
        if (col < length) {
            return 4;
        } else {
            return 5;
        }
    } else {
        console.assert(col < length);
        return 6;
    }
}

function Normalize(row: number, col: number): number[] {
    const length = 50;
    console.assert(row >= 0 && col >= 0);
    return [row % length, col % length];
}

function Adjust(row: number, col: number, face: number): number[] {
    const length = 50;
    switch (face) {
        case 1:
            col += length;
            break;
        case 2:
            col += 2 * length;
            break;
        case 3:
            row += length;
            col += length;
            break;
        case 4:
            row += 2 * length;
            break;
        case 5:
            row += 2 * length;
            col += length;
            break;
        case 6:
            row += 3 * length;
            break;
        default:
            console.assert(false, "invalid face");
            break;
    }
    return [row, col];
}

function Flip(num: number): number {
    const length = 50;
    console.assert(num >= 0 && num < length);
    return length - 1 - num;
}

function Wrap(row: number, col: number, facing: Facing): { row: number, col: number, facing: Facing } {
    const face: number = GetFace(row, col);
    [row, col] = Normalize(row, col);
    console.assert(face > 0 && face < 7);
    let newDirection: Facing = Facing.None;

    let tempRow = row;
    switch (face) {
        case 1:
            switch (facing) {
                case Facing.Up:
                    row = col;
                    col = 0;
                    [row, col] = Adjust(row, col, 6);
                    newDirection = Facing.Right;
                    break;
                case Facing.Left:
                    row = Flip(tempRow);
                    col = 0;
                    [row, col] = Adjust(row, col, 4);
                    newDirection = Facing.Right;
                    break;
                default:
                    console.assert(false, `impossible direction from face 1, facing: ${facing} `);
            }
            break;
        case 2:
            switch (facing) {
                case Facing.Right:
                    row = Flip(row);
                    col = 49;
                    [row, col] = Adjust(row, col, 5);
                    newDirection = Facing.Left;
                    break;
                case Facing.Down:
                    row = col;
                    col = 49;
                    [row, col] = Adjust(row, col, 3);
                    newDirection = Facing.Left;
                    break;
                case Facing.Up:
                    row = 49;
                    col = col;
                    [row, col] = Adjust(row, col, 6);
                    newDirection = Facing.Up;
                    break;
                default:
                    console.assert(false, "impossible direction from face 2");
            }
            break;
        case 3:
            switch (facing) {
                case Facing.Left:
                    row = 0;
                    col = tempRow;
                    [row, col] = Adjust(row, col, 4);
                    newDirection = Facing.Down;
                    break;
                case Facing.Right:
                    row = 49;
                    col = tempRow;
                    [row, col] = Adjust(row, col, 2);
                    newDirection = Facing.Up;
                    break;
                default:
                    console.assert(false, "impossible direction from face 3");
            }
            break;
        case 4:
            switch (facing) {
                case Facing.Left:
                    row = Flip(tempRow);
                    col = 0;
                    [row, col] = Adjust(row, col, 1);
                    newDirection = Facing.Right;
                    break;
                case Facing.Up:
                    row = col;
                    col = 0;
                    [row, col] = Adjust(row, col, 3);
                    newDirection = Facing.Right;
                    break;
                default:
                    console.assert(false, "impossible direction from face 4");
            }
            break;
        case 5:
            switch (facing) {
                case Facing.Right:
                    row = Flip(tempRow);
                    col = 49;
                    [row, col] = Adjust(row, col, 2);
                    newDirection = Facing.Left;
                    break;
                case Facing.Down:
                    row = col;
                    col = 49;
                    [row, col] = Adjust(row, col, 6);
                    newDirection = Facing.Left;
                    break;
                default:
                    console.assert(false, "impossible direction from face 5");
            }
            break;
        case 6:
            switch (facing) {
                case Facing.Right:
                    row = 49;
                    col = tempRow;
                    [row, col] = Adjust(row, col, 5);
                    newDirection = Facing.Up;
                    break;
                case Facing.Down:
                    row = 0;
                    col = col;
                    [row, col] = Adjust(row, col, 2);
                    newDirection = Facing.Down;
                    break;
                case Facing.Left:
                    row = 0;
                    col = tempRow;
                    [row, col] = Adjust(row, col, 1);
                    newDirection = Facing.Down;
                    break;
                default:
                    console.assert(false, "impossible direction from face 6");
            }
            break;
    }

    console.assert(newDirection !== Facing.None, "newDirection was None at the end of Wrap");
    return { row: row, col: col, facing: newDirection };
}


const [puzzleInput, movesInput] = fs.readFileSync(process.argv[2], 'utf8').split('\n\n');
const lines: string[] = puzzleInput.split('\n');
const length: number = Math.max(...lines.map((line) => line.length));
const puzzleBoard: Tile[][] = lines.map((line) => line.padEnd(length, ' ').split('').map((c) => {
    switch (c) {
        case '.':
            return new Tile(TileType.Open);
        case '#':
            return new Tile(TileType.Wall);
        case ' ':
            return new Tile(TileType.Void);
    };
}));

let moves = movesInput.replaceAll(/([A-Z])/g, " $1 ").trim().split(' ');
// Done Parsing

// You begin the path in the leftmost open tile of the top row of tiles.
// Initially, you are facing to the right (from the perspective of how the map is drawn).

let currentDirection: Facing = Facing.Right;
let row: number = 0;
let col: number = 0;

// set the starting column
while (puzzleBoard[0][col].type !== TileType.Open) {
    col++;
}

puzzleBoard[row][col].facing = currentDirection;

for (let move of moves) {
    const m = ParseMove(move);
    if (IsTurn(move)) {
        currentDirection = ModifyFacing(currentDirection, m as Facing);
        puzzleBoard[row][col].facing = currentDirection;
    } else {
        const moveResult = MoveForward(puzzleBoard, row, col, currentDirection, m as number);
        currentDirection = moveResult.facing;
        row = moveResult.row;
        col = moveResult.col;
    }
}

const password = 1000 * (row + 1) + 4 * (col + 1) + GetFacingValue(currentDirection);
console.log(`password = 1000 * ${(row + 1)} + 4 * ${(col + 1)} + ${GetFacingValue(currentDirection)} = ${password}`);
