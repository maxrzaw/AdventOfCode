export type point = { x: number, y: number };
export default class Utils {
    static Normalize(x: number): number {
        return x / Math.abs(x);
    }

    static Print2DArray<T>(arr: T[][], delimeter: string = ""): void {
        for (let i = 0; i < arr.length; ++i) {
            let row: string = "";
            for (let j = 0; j < arr[i].length; ++j) {
                row += arr[i][j] + delimeter;
            }
            console.log(row);
        }
    }

    static Print2DArrayTransposed<T>(arr: T[][], delimeter: string = ""): void {
        for (let i = 0; i < arr[0].length; ++i) {
            let row: string = "";
            for (let j = 0; j < arr.length; ++j) {
                row += arr[j][i] + delimeter;
            }
            console.log(row);
        }
    }

    static Print2DArrayTransposedWithRows<T>(arr: T[][], delimeter: string = ""): void {
        for (let i = 0; i < arr[0].length; ++i) {
            let row: string = "" + i + '\t';
            for (let j = 0; j < arr.length; ++j) {
                row += arr[j][i] + delimeter;
            }
            console.log(row);
        }
    }

    static Print2DArrayWithRows<T>(arr: T[][], delimeter: string = ""): void {
        for (let i = 0; i < arr.length; ++i) {
            let row: string = "" + i + '\t';
            for (let j = 0; j < arr[i].length; ++j) {
                row += arr[i][j] + delimeter;
            }
            console.log(row);
        }
    }

    /**
    * Parses lines using '\n' and uses the specified delimeter to split the
    * items within a line.
    */
    static Parse2DInputToStrings(input: string, delimeter: string): string[][] {
        return input.trimEnd()
            .split('\n')
            .map((line) => line.trimEnd()
                .split(delimeter));
    }

    /**
    * Parses lines using '\n' and uses the specified delimeter to split the
    * items within a line.
    */
    static Parse2DInputToNumbers(input: string, delimeter: string): number[][] {
        return input.trimEnd()
            .split('\n')
            .map((line) => line.trimEnd()
                .split(delimeter)
                .map((num) => parseInt(num)));
    }

    /**
     * Returns the Manhattan distance between two points.
     * Uses the formula |x1 - x2| + |y1 - y2|
     */
    static ManhattanDistance(a: point, b: point): number {
        return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
    }
}

export type GraphEdge = { to: number; weight: number };

export class GraphNode {
    private value: string;
    private index: number;
    public edges: GraphEdge[];
    constructor(value: string, index: number) {
        this.value = value;
        this.edges = [];
        this.index = index;
    }

    public GetValue(): string {
        return this.value;
    }

    public GetIndex(): number {
        return this.index;
    }
    public toString = (): string => {
        return `(idx: ${this.index}\t value: ${this.value}\t edgeCount: ${this.edges.length}`;
    }
}

export class Bits {
    static GetBitMask(n: number): number {
        return 1 << n;
    }

    static SetNthBit(num: number, pos: number): number {
        const mask = this.GetBitMask(pos);
        num |= mask;
        return num;
    }

    static SetBits(num: number, positions: number[]): number {
        for (let n of positions) {
            num = this.SetNthBit(num, n);
        }
        return num;
    }

    static ClearNthBit(num: number, pos: number): number {
        const mask = this.GetBitMask(pos);
        num &= ~mask;
        return num;
    }

    static Union(a: number, b: number) {
        return a & b;
    }
}
