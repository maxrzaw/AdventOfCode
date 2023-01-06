import { log } from 'console';
import * as fs from 'fs';
export const ex = "";

const filename = process.argv[2];

const DIRECTIONS: number[][][] = [
    [[-1, -1], [-1, 0], [-1, 1]],   // North
    [[1, -1], [1, 0], [1, 1]],      // South
    [[-1, -1], [0, -1], [1, -1]],   // West
    [[-1, 1], [0, 1], [1, 1]],      // East
];

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

                if (fieldMap.has(`${row},${col}`) && fieldMap.get(`${row},${col}`).occupied) {
                    return true;
                }
            }
        }

        return false;
    }

    MakeProposal(proposals: Map<string, number>, field: Map<string, Plot>, directionOffset: number): void {
        if (!this.occupied || !this.CheckSurroundings()) {
            this.madeProposal = false;
            return;
        }

        for (let i = 0; i < 4; ++i) {
            const direction: number[][] = DIRECTIONS[(directionOffset + i) % 4];

            let free = true;

            // check if the direction is available
            for (let j = 0; j < 3; ++j) {
                const row = this.row + direction[j][0];
                const col = this.col + direction[j][1];
                if (field.has(`${row},${col}`) && field.get(`${row},${col}`).occupied) {
                    free = false;
                    break;
                }
            }

            if (free) {
                this.madeProposal = true;
                this.proposal = [this.row + direction[1][0], this.col + direction[1][1]];
                const key = `${this.proposal[0]},${this.proposal[1]}`;
                if (!proposals.has(key)) {
                    proposals.set(key, 0);
                }
                const prev = proposals.get(key);
                proposals.set(key, prev + 1);
                return;
            }
        }
    }

    Move(proposals: Map<string, number>, field: Map<string, Plot>): boolean {
        if (!this.madeProposal || !this.occupied) {
            return false;
        }

        const key = `${this.proposal[0]},${this.proposal[1]}`;
        if (proposals.get(key) !== 1) {
            this.madeProposal = false;
            return false;
        }

        field.set(key, new Plot(this.proposal[0], this.proposal[1], '#'));
        const oldKey = `${this.row},${this.col}`;
        this.occupied = false;
        this.madeProposal = false;

        field.delete(oldKey);
        return true;
    }
};

const fieldMap: Map<string, Plot> = new Map<string, Plot>();
const input = fs.readFileSync(filename, 'utf8');
input.trim().split('\n').map((s, row) => s.split('').forEach((p, col) => {
    if (p === '#') {
        fieldMap.set(`${row},${col}`, new Plot(row, col, p))
    }
}));

let currentDirection = 0;
for (let i = 0; i < 10000000; ++i) {
    const proposals: Map<string, number> = new Map<string, number>();
    const direction = currentDirection++;
    // Step One
    for (let key of fieldMap.keys()) {
        const plot = fieldMap.get(key);
        plot.MakeProposal(proposals, fieldMap, direction);
    }

    // Step Two
    let moved = false;
    for (let key of fieldMap.keys()) {
        const plot = fieldMap.get(key);
        moved = plot.Move(proposals, fieldMap) || moved;
    }
    if (!moved) {
        log(i + 1);
        break;
    }
}
