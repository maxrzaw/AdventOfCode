import * as fs from 'fs';
export const ex = "";

enum Operation { Add, Subtract, Multiply, Divide, Equality, None, };

class Monkey {
    name: string;
    left: string;
    right: string;
    operation: Operation;
    value: number = 0;
    constructor(input: string) {
        let equation: string;
        [this.name, equation] = input.trim().split(':').map((s) => s.trim());

        if (isNaN(parseInt(equation))) {
            let op: string = "";
            [this.left, op, this.right] = equation.split(' ');
            switch (op) {
                case "+":
                    this.operation = Operation.Add;
                    break;
                case "-":
                    this.operation = Operation.Subtract;
                    break;
                case "*":
                    this.operation = Operation.Multiply;
                    break;
                case "/":
                    this.operation = Operation.Divide;
                    break;
            }
        } else {
            this.value = parseInt(equation);
            this.operation = Operation.None;
        }
    }

    public Evaluate(monkeys: Map<string, Monkey>): number {
        if (this.operation === Operation.None) {
            return this.value;
        }

        const leftMonkey: Monkey = monkeys.get(this.left);
        const rightMonkey: Monkey = monkeys.get(this.right);
        const left = leftMonkey.Evaluate(monkeys);
        const right = rightMonkey.Evaluate(monkeys);
        switch (this.operation) {
            case Operation.Add:
                this.value = left + right;
                break;
            case Operation.Subtract:
                this.value = left - right;
                break;
            case Operation.Multiply:
                this.value = left * right;
                break;
            case Operation.Divide:
                this.value = left / right;
                break;
            case Operation.Equality:
                if (left > right) {
                    this.value = -1;
                } else if (left < right) {
                    this.value = 1;
                } else {
                    this.value = 0;
                }
        }

        return this.value;
    }
}

const monkeysMap: Map<string, Monkey> = new Map<string, Monkey>();
for (let line of fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map((s) => s.trim())) {
    const monkeyName: string = line.slice(0, 4);
    monkeysMap.set(monkeyName, new Monkey(line));
}

const root: Monkey = monkeysMap.get("root");
const human: Monkey = monkeysMap.get("humn");

console.log(`Part One: ${root.Evaluate(monkeysMap)}`);
root.operation = Operation.Equality;

let previousValue: number = 1;
let lower = 0;
let upper = 0;
let stillClimbing = true;
let result = -1;
while (true) {
    let currentValue: number;
    if (result < 0 && stillClimbing) {
        currentValue = previousValue * 2;
    } else if (result === 0) {
        break;
    } else if (result > 0 && stillClimbing) {
        stillClimbing = false;
        upper = previousValue;
        currentValue = Math.floor(previousValue / 2);
        lower = currentValue;
    } else if (result < 0) {
        lower = previousValue;
        currentValue = lower + Math.floor(Math.abs(upper - lower) / 2);
    }
    else if (result > 0) {
        upper = previousValue;
        currentValue = upper - Math.floor(Math.abs(upper - lower) / 2);
    }
    human.value = currentValue;
    result = root.Evaluate(monkeysMap);
    previousValue = currentValue;
}

console.log(`Part Two: ${previousValue}`);
