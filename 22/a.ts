import { assert, log } from 'console';
import * as fs from 'fs';
export const ex = "";

enum TileType {
    Open = '.',
    Wall = '#',
    Void = ' ',
};

enum Facing {
    Left,
    Right,
    Up,
    Down,
    None,
};

class Tile {
    type: TileType;
    facing: Facing = Facing.None;
    constructor(type: TileType) {
        this.type = type;
    }
};

function GetFacingValue(facing: Facing): number {
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

function GetFacingString(facing: Facing): string {
    switch (facing) {
        case Facing.Right:
            return '>';
        case Facing.Down:
            return 'v';
        case Facing.Left:
            return '<';
        case Facing.Up:
            return '^';
    };
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
    assert(modifier === Facing.Right || modifier === Facing.Left);
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

function MoveForward(board: Tile[][], row: number, col: number, currentDirection: Facing, distance: number): number[] {
    const delta: number[] = GetFacingDelta(currentDirection);
    let lastConfirmed: number[] = [row, col];

    while (distance > 0) {
        const newRow = ((row + delta[0]) % board.length + board.length) % board.length;
        const newCol = ((col + delta[1]) % length + length) % length;
        const tile: Tile = board[newRow][newCol];

        switch (tile.type) {
            case TileType.Open:
                tile.facing = currentDirection;
                distance--;
                row = newRow;
                col = newCol;
                lastConfirmed = [row, col];
                break;
            case TileType.Void:
                row = newRow;
                col = newCol;
                break;
            case TileType.Wall:
                distance = 0;
                break;
        }
    }

    return lastConfirmed;
}

function printBoard(board: Tile[][]): void {
    for (let row of board) {
        let line: string = "";
        for (let col of row) {
            line += col.facing !== Facing.None ? GetFacingString(col.facing) : col.type;
        }
        log(line);
    }
}

const filename = process.argv[2];
const input: string = fs.readFileSync(filename, 'utf8');
const [puzzleInput, movesInput] = input.split('\n\n');
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

log(`Starting Row: ${row}\nStarting Column: ${col}\nStarting Direction: ${GetFacingString(currentDirection)}`);
puzzleBoard[row][col].facing = currentDirection;

for (let move of moves) {
    const m = ParseMove(move);
    if (IsTurn(move)) {
        currentDirection = ModifyFacing(currentDirection, m);
        puzzleBoard[row][col].facing = currentDirection;
    } else {
        [row, col] = MoveForward(puzzleBoard, row, col, currentDirection, m);
    }
}

const password = 1000 * (row + 1) + 4 * (col + 1) + GetFacingValue(currentDirection);
log(`password = 1000 * ${(row + 1)} + 4 * ${(col + 1)} + ${GetFacingValue(currentDirection)} = ${password}`);
