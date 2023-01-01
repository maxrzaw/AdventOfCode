import * as fs from 'fs';
export const x = "";

type GraphEdge = { to: number; weight: number };
class GraphNode {
    public value: string;
    public index: number;
    public edges: GraphEdge[];
    constructor(value: string, index: number) {
        this.value = value;
        this.edges = [];
        this.index = index;
    }
}

let index = 0;
let peak = -1;
let startOne = -1;

const nodes: GraphNode[] = [];
const nodesByRow = fs.readFileSync(process.argv[2], 'utf8').split('\n').map((row) => row.trim().split('').map((x) => {
    if (x === 'S') {
        x = 'a';
        startOne = index;
    }
    if (x === 'E') {
        x = 'z';
        peak = index;
    }
    return new GraphNode(x, index++);
}));

for (let i = 0; i < nodesByRow.length; ++i) {
    for (let j = 0; j < nodesByRow[i].length; ++j) {
        const node: GraphNode = nodesByRow[i][j];
        if (i > 0) {
            // add row above
            const above: GraphNode = nodesByRow[i - 1][j];
            node.edges.push({ to: above.index, weight: above.value.charCodeAt(0) - node.value.charCodeAt(0) });
        }
        if (i < nodesByRow.length - 2) {
            // add row below
            const below: GraphNode = nodesByRow[i + 1][j];
            node.edges.push({ to: below.index, weight: below.value.charCodeAt(0) - node.value.charCodeAt(0) });
        }
        if (j > 0) {
            // add column to the left
            const left: GraphNode = nodesByRow[i][j - 1];
            node.edges.push({ to: left.index, weight: left.value.charCodeAt(0) - node.value.charCodeAt(0) });
        }
        if (j < nodesByRow[i].length - 1) {
            // add column to the right
            const right: GraphNode = nodesByRow[i][j + 1];
            node.edges.push({ to: right.index, weight: right.value.charCodeAt(0) - node.value.charCodeAt(0) });
        }
        nodes.push(node);
    }
}

const seen: boolean[] = Array.from({ length: nodes.length }, () => false);
const prev: number[] = Array.from({ length: nodes.length }, () => -Infinity);
const queue: number[] = [];
queue.push(peak);
let startTwo: number = -Infinity;

while (queue.length > 0) {
    const curr: number = queue.shift() as number;

    if (startTwo === -Infinity && nodes[curr].value === 'a') {
        console.log("made it to a possible start for Part Two");
        startTwo = curr;
    }

    if (curr === startOne) {
        console.log("made it to the start for Part One");
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

const pathOne: number[] = [];
pathOne.push(startOne);
let preOne: number = prev[startOne];
while (preOne !== peak) {
    preOne = prev[preOne];
    pathOne.push(preOne);
}

const pathTwo: number[] = [];
pathTwo.push(startTwo);
let preTwo: number = prev[startTwo];
while (preTwo !== peak) {
    preTwo = prev[preTwo];
    pathTwo.push(preTwo);
}

console.log(`Part One: ${pathOne.length}\nPart Two: ${pathTwo.length}`);
