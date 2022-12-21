import { log } from 'console';
import * as fs from 'fs';
export const ex = "";

enum Operation {
    Add,
    Subtract,
    Multiply,
    Divide,
    Equality,
    Human,
};

class Monkey {
    name: string;
    left: string;
    right: string;
    operation: Operation;
    evaluated: boolean = false;
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
            this.evaluated = false;
            if (this.name === "root") {
                this.operation = Operation.Equality;
            }
        } else {
            this.value = parseInt(equation);
            this.evaluated = true;
            if (this.name === "humn") {
                this.value = null;
                this.evaluated = false;
            }
        }
    }

    public Evaluate(monkeys: Map<string, Monkey>): number {
        if (this.evaluated) {
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
        }
        this.evaluated = true;
        return this.value;
    }
}



const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');
const lines = input.trim().split('\n').map((s) => s.trim());
const monkeysMap: Map<string, Monkey> = new Map<string, Monkey>();
for (let line of lines) {
    const monkeyName: string = line.slice(0, 4);
    monkeysMap.set(monkeyName, new Monkey(line));
}


const root: Monkey = monkeysMap.get("root");
log(root);
log(root.Evaluate(monkeysMap));
