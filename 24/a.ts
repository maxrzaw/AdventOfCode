import { log } from 'console';
import * as fs from 'fs';
export const ex = "";

type position = { row: number, column: number, minute: number };

function ToString(p: position): string {
    return `${p.row},${p.column},${p.minute}`;
}

function MakePosition(row: number = 0, column: number = 0, minute: number = 0): position {
    return { row: row, column: column, minute: minute };
}

function MakeAdjustedPosition(rowDelta: number, columnDelta: number, currentPosition: position): position {
    return {
        row: currentPosition.row + rowDelta,
        column: currentPosition.column + columnDelta,
        minute: currentPosition.minute + 1
    };
}

function IsBlizzard(value: string) {
    return '<>^v'.includes(value);
}

class Plot {
    blizzards: string[] = [];
    constructor(blizzards: string[]) {
        this.blizzards = blizzards;
    }

    IsBlizzard(): boolean {
        return this.blizzards.length > 0;
    }
};

const moves: number[][] = [
    [0, 0], // wait
    [-1, 0], // up
    [1, 0], // down
    [0, -1], // left
    [0, 1], // right
];

function SimulateMinute(minute: number, valley: string[][]): void {
    for (let i = 0; i < valley.length; ++i) {
        for (let j = 0; j < valley[i].length; ++j) {
            const position = MakePosition(i, j, minute);
            const plot: Plot = blizzards.get(ToString(position));
            if (plot === undefined || !plot.IsBlizzard()) {
                continue;
            }

            // We can now assume there is at least one blizzard currently here
            for (let blizzard of plot.blizzards) {
                let nextPosition: position = MakePosition(position.row, position.column, position.minute + 1);
                switch (blizzard) {
                    case '<':
                        nextPosition.column--;
                        if (position.column === 1) {
                            nextPosition.column = valley[i].length - 2;
                        }
                        break;
                    case '>':
                        nextPosition.column++;
                        if (position.column === valley[i].length - 2) {
                            nextPosition.column = 1;
                        }
                        break;
                    case '^':
                        nextPosition.row--;
                        if (position.row === 1) {
                            nextPosition.row = valley.length - 2;
                        }
                        break;
                    case 'v':
                        nextPosition.row++;
                        if (position.row === valley.length - 2) {
                            nextPosition.row = 1;
                        }
                        break;
                }

                // add the next plot
                const nextPositionString = ToString(nextPosition);
                const nextPlot: Plot = blizzards.get(nextPositionString);
                if (nextPlot === undefined) {
                    blizzards.set(nextPositionString, new Plot([blizzard]));
                } else {
                    nextPlot.blizzards.push(blizzard);
                }
            }
        }
    }
}

function PrintValleyAtMinute(valley: string[][], blizzards: Map<string, Plot>, currentPosition: position) {
    let position: position = MakePosition(currentPosition.row, currentPosition.column, currentPosition.minute);
    for (let i = 0; i < valley.length; ++i) {
        let row: string = "";
        for (let j = 0; j < valley[i].length; ++j) {
            position.row = i;
            position.column = j;
            const plot = blizzards.get(ToString(position));
            if (plot === undefined) {
                if (valley[i][j] === '#') {
                    row += '#';
                } else {
                    row += '.';
                }
            } else if (!plot.IsBlizzard()) {
                row += '.';
            } else {
                row += plot.blizzards.length === 1 ? plot.blizzards[0] : plot.blizzards.length.toString();
            }
        }
        log(row);
    }
    log();
    log();
}

const filename = process.argv[2];

const blizzards: Map<string, Plot> = new Map<string, Plot>();
const input = fs.readFileSync(filename, 'utf8');
const lines = input.trim().split('\n');
const valley: string[][] = lines.map((line) => line.trim().split(''));

let start: position = { row: 0, column: 1, minute: 0 };
let end: position = { row: 0, column: 0, minute: 0 };

for (let i = 0; i < valley.length; ++i) {
    for (let j = 0; j < valley[i].length; ++j) {
        const value = valley[i][j];
        const position: position = MakePosition(i, j, 0);
        if (IsBlizzard(value)) {
            blizzards.set(ToString(position), new Plot([value]));
        } else if (value === 'S') {
            start = position;
        } else if (value === 'E') {
            end = position;
        }
    }
}

const queue: position[] = [start];
const seen: Set<string> = new Set<string>();
const prev: Map<string, string> = new Map<string, string>();
let minute = 0;
seen.add(ToString(start));

while (queue.length > 0) {
    const currentPosition = queue.shift();
    if (currentPosition.row === end.row && currentPosition.column === end.column) {
        end.minute = currentPosition.minute;
        break;
    }

    // make sure the next minute is simulated
    while (minute < currentPosition.minute + 1) {
        SimulateMinute(minute, valley);
        minute++;
    }

    for (let move of moves) {
        const nextPosition: position = MakeAdjustedPosition(move[0], move[1], currentPosition);
        const nextPositionString = ToString(nextPosition);

        const isSeen = seen.has(nextPositionString);

        if (isSeen ||
            nextPosition.row < 0 ||
            nextPosition.column < 0 ||
            valley[nextPosition.row][nextPosition.column] === '#') {
            continue;
        }

        seen.add(nextPositionString);
        if (blizzards.has(nextPositionString) && blizzards.get(nextPositionString).IsBlizzard()) {
            continue;
        }

        prev.set(nextPositionString, ToString(currentPosition));
        queue.push(nextPosition);
    }
}

log("End:");
log(end);
const path: string[] = [];
let currentPosition: string = ToString(end);
while (currentPosition !== undefined) {
    path.push(currentPosition);
    currentPosition = prev.get(currentPosition);
}
// log(path.reverse());
