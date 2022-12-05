import { log } from 'console';
import * as fs from 'fs';
export const x = "";

class Stack {
    // The stack is represented as an array
    private items: any[] = [];

    // The push() method adds an element to the top of the stack
    push(item: any) {
        this.items.push(item);
    }

    pushBack(item: any) {
        this.items.unshift(item);
    }

    // The pop() method removes and returns the top element of the stack
    pop() {
        return this.items.pop();
    }

    // The peek() method returns the top element of the stack without removing it
    peek() {
        return this.items[this.items.length - 1];
    }

    // The isEmpty() method returns true if the stack is empty, and false otherwise
    isEmpty() {
        return this.items.length === 0;
    }
}

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');

const setup = input.split('\n\n');
const stackCount = Math.ceil(setup[0].split('\n')[0].length / 4);
const stacks: Stack[] = [];

for (let i = 0; i < stackCount; ++i) {
    const stack = new Stack();
    stacks.push(stack);
}

let starting = setup[0].trimEnd().split('\n');

for (let line of starting) {
    const crates: string[] = new Array<string>().fill("", stackCount);
    let j = 0;
    for (let i = 0; i < line.length; i += 4) {
        const crate = line.slice(i, i + 4)[1];
        crates[j] = line.slice(i, i + 4)[1];
        if (crate !== " ") {
            stacks[j].pushBack(crate);
        }
        ++j;
    }
}

const instructions = setup[1].trimEnd().split('\n');

for (let instruction of instructions) {
    const line = instruction.split(' ');

    const count = parseInt(line[1]);

    const start = parseInt(line[3]) - 1;
    const end = parseInt(line[5]) - 1;

    for (let i = 0; i < count; ++i) {
        stacks[end].push(stacks[start].pop());
    }
}

log(stacks.map((s) => s.peek()).join(''));
