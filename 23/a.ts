import { log } from 'console';
import * as fs from 'fs';
import Utils from '../utils';
export const ex = "";

const filename = process.argv[2];

const DIRECTIONS: number[][][] = [
    [[-1, -1], [-1, 0], [-1, 1]],   // North
    [[1, -1], [1, 0], [1, 1]],      // South
    [[-1, -1], [0, -1], [1, -1]],   // West
    [[-1, 1], [0, 1], [1, 1]],      // East
];

function PrintField(field: Plot[][], round: number): void {
    log(`== End of Round ${round} ==`);
    for (let i = 0; i < field.length; ++i) {
        let row: string = "";
        for (let j = 0; j < field[i].length; ++j) {
            row += field[i][j].occupied ? '#' : '.';
        }
        console.log(row);
    }
}

function CountEmptyPlots(field: Plot[][]): number {
    let sum = 0;
    let left = Infinity;
    let right = -Infinity;
    let top = Infinity;
    let bottom = -Infinity;
    for (let row of field) {
        for (let plot of row) {
            if (!plot.occupied) {
                continue;
            }
            left = Math.min(left, plot.col);
            right = Math.max(right, plot.col);
            top = Math.min(top, plot.row);
            bottom = Math.max(bottom, plot.row);
        }
    }

    log(`${left}, ${right}, ${top}, ${bottom}`)
    for (let i = top; i <= bottom; ++i) {
        for (let j = left; j <= right; ++j) {
            if (!field[i][j].occupied) {
                sum++;
            }
        }
    }
    return sum;
}

class Plot {
    occupied: boolean;
    row: number;
    col: number;
    proposal: number[];
    madeProposal: boolean;

    constructor(row: number, col: number, status: string) {
        this.row = row;
        this.col = col;
        this.occupied = status === '#' ? true : false;
        this.madeProposal = false;
    }
    private CheckSurroundings(): boolean {

        for (let i = -1; i < 2; ++i) {
            for (let j = -1; j < 2; ++j) {
                if (i === 0 && j === 0) {
                    continue;
                }

                const row = this.row + i;
                const col = this.col + j;

                if (row >= 0 && row < field.length && col < field[row].length && col >= 0 && field[row][col].occupied) {
                    return true;
                }
            }
        }
        return false;
    }

    MakeProposal(proposals: number[][], field: Plot[][], directionOffset: number): void {
        if (!this.occupied || !this.CheckSurroundings()) {
            this.madeProposal = false;
            return;
        }

        for (let i = 0; i < 4; ++i) {
            const direction: number[][] = DIRECTIONS[(directionOffset + i) % 4];

            let free = true;

            for (let j = 0; j < 3; ++j) {
                const row = this.row + direction[j][0];
                const col = this.col + direction[j][1];
                if (row >= 0 && row < field.length && col < field[row].length && col >= 0) {
                    if (field[row][col].occupied) {
                        free = false;
                        break;
                    }
                }
            }

            const row = this.row + direction[1][0];
            const col = this.col + direction[1][1];
            if (free && row >= 0 && row < field.length && col < field[row].length && col >= 0) {
                this.madeProposal = true;
                this.proposal = [this.row + direction[1][0], this.col + direction[1][1]];
                proposals[this.row + direction[1][0]][this.col + direction[1][1]]++;
                return;
            }
        }
    }

    Move(proposals: number[][], field: Plot[][]): void {
        if (!this.madeProposal || !this.occupied) {
            return;
        }

        if (proposals[this.proposal[0]][this.proposal[1]] !== 1) {
            this.madeProposal = false;
            return;
        }

        const next = field[this.proposal[0]][this.proposal[1]];
        next.occupied = true;
        this.occupied = false;
        this.madeProposal = false;
    }
};

const input = fs.readFileSync(filename, 'utf8');
const field: Plot[][] = input.trim().split('\n')
    .map((s, row) => s.split('')
        .map((p, col) => new Plot(row, col, p)));

PrintField(field, 0);
log();
let currentDirection = 0;
for (let i = 0; i < 10; ++i) {
    const proposals: number[][] = Array.from({ length: field.length }, () => Array.from({ length: field[0].length }, () => 0));
    const direction = currentDirection++;
    // Step One
    for (let row of field) {
        for (let plot of row) {
            // log(plot);
            plot.MakeProposal(proposals, field, direction);
        }
    }

    // Step Two
    for (let row of field) {
        for (let plot of row) {
            plot.Move(proposals, field);
        }
    }
    // Utils.Print2DArray<number>(proposals, '');
    PrintField(field, i + 1);
    log();
}
log(CountEmptyPlots(field));
