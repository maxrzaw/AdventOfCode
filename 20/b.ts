import { log } from 'console';
import * as fs from 'fs';
export const ex = "";

const DECRYPTION_KEY: number = 811589153;
const filename = process.argv[2];

class LinkedListNode {
    value: number;
    next: LinkedListNode | null;
    prev: LinkedListNode | null;
    constructor(value: number) {
        this.value = value;
        this.next = null;
        this.prev = null;
    }

    toString(): string {
        return `value: ${this.value}`;
    }
}

function Mix(node: LinkedListNode, length: number): void {
    length--;

    const shift: number = (node.value % length);
    if (shift === 0) {
        return;
    }

    const prev = node.prev;
    const next = node.next;

    // Remove node
    prev.next = next;
    next.prev = prev;

    const shiftRight: number = ((node.value % length) + length) % length;

    let curr = node.next;
    for (let i = 0; i < shiftRight - 1; ++i) {
        curr = curr.next;
    }

    node.next = curr.next;
    node.prev = curr;
    curr.next.prev = node;
    curr.next = node;
}

/** 
* Returns the node after taking n steps forward. Negative steps are not possible.
* */
function FindNthNode(n: number, node: LinkedListNode, length: number): LinkedListNode {
    const shift: number = (n % length);

    if (shift === 0) {
        return node;
    }

    if (shift > 0) {
        let curr = node;
        for (let i = 0; i < shift; ++i) {
            curr = curr.next;
        }
        return curr;
    } else if (shift < 0) {
        return null;
    }
}

let zero: LinkedListNode = null;
const input = fs.readFileSync(filename, 'utf8');
const numbers = input.trim().split('\n').map((n) => parseInt(n));
const nodes: LinkedListNode[] = [];

let last: LinkedListNode = null;
for (let i = 0; i < numbers.length; ++i) {
    const node = new LinkedListNode(numbers[i] * DECRYPTION_KEY);
    if (last !== null) {
        last.next = node;
        node.prev = last;
    }
    nodes.push(node);
    last = node;

    if (node.value === 0) {
        zero = node;
    }
}

nodes[0].prev = last;
last.next = nodes[0];

for (let j = 0; j < 10; ++j) {
    for (let i = 0; i < nodes.length; ++i) {
        // mix each node in order
        Mix(nodes[i], nodes.length);
    }
}

let one: LinkedListNode = FindNthNode(1000, zero, nodes.length);
let two: LinkedListNode = FindNthNode(2000, zero, nodes.length);
let three: LinkedListNode = FindNthNode(3000, zero, nodes.length);

log(one.value, two.value, three.value);
log(`Total: ${one.value + two.value + three.value}`);
