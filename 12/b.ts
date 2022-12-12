import { log } from 'console';
import * as fs from 'fs';
export const x = "";

type GraphEdge = { to: number; weight: number };
class GraphNode {
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

const filename = process.argv[2];
let index = 0;
let peak = -1;

const input = fs.readFileSync(filename, 'utf8');
const rows: string[] = input.split('\n');
const nodes: GraphNode[] = [];
const nodesByRow = rows.map((row) => row.trimEnd().split('').map((square) => {
    let val: string = square;
    if (square === 'E') {
        val = 'z';
        peak = index;
    }
    return new GraphNode(val, index++);
}));

if (peak === -1) {
    log(`ERROR: Peak (${peak}) was not set.`);
}

for (let i = 0; i < nodesByRow.length; ++i) {
    for (let j = 0; j < nodesByRow[i].length; ++j) {
        const node: GraphNode = nodesByRow[i][j];
        if (i > 0) {
            // add row above
            const nodeAbove: GraphNode = nodesByRow[i - 1][j];
            const weight: number = nodeAbove.GetValue().charCodeAt(0) - node.GetValue().charCodeAt(0);
            const edge: GraphEdge = { to: nodeAbove.GetIndex(), weight: weight };
            node.edges.push(edge);
        }
        if (i < nodesByRow.length - 2) {
            // add row below
            const nodeBelow: GraphNode = nodesByRow[i + 1][j];
            const weight: number = nodeBelow.GetValue().charCodeAt(0) - node.GetValue().charCodeAt(0);
            const edge: GraphEdge = { to: nodeBelow.GetIndex(), weight: weight };
            node.edges.push(edge);
        }
        if (j > 0) {
            // add column to the left
            const nodeLeft: GraphNode = nodesByRow[i][j - 1];
            const weight: number = nodeLeft.GetValue().charCodeAt(0) - node.GetValue().charCodeAt(0);
            const edge: GraphEdge = { to: nodeLeft.GetIndex(), weight: weight };
            node.edges.push(edge);
        }
        if (j < nodesByRow[i].length - 1) {
            // add column to the right
            const nodeRight: GraphNode = nodesByRow[i][j + 1];
            const weight: number = nodeRight.GetValue().charCodeAt(0) - node.GetValue().charCodeAt(0);
            const edge: GraphEdge = { to: nodeRight.GetIndex(), weight: weight };
            node.edges.push(edge);
        }
        nodes.push(node);
    }
}

const seen: boolean[] = Array.from({ length: nodes.length }, () => false);
const prev: number[] = Array.from({ length: nodes.length }, () => -Infinity);
const queue: number[] = [];
queue.push(peak);
let start: number = -Infinity;

while (queue.length > 0) {
    const curr: number = queue.shift() as number;

    if (nodes[curr].GetValue() === 'a') {
        log("made it to a start");
        start = curr;
        break;
    }

    const node: GraphNode = nodes[curr];
    for (let edge of node.edges) {
        if (prev[edge.to] < 0 && edge.weight >= -1) {
            queue.push(edge.to);
            seen[edge.to] = true;
            prev[edge.to] = curr;
        }
    }
}

const path: number[] = [];
path.push(start);
let pre: number = prev[start];
while (pre !== peak) {
    pre = prev[pre];
    path.push(pre);
}

log(path.length);
