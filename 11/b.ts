import { log } from 'console';
export const x = "";
let mod: number = 1;

class Monkey {
    private items: number[];
    private trueTarget: number;
    private falseTarget: number;
    private _inspect: Function;
    private _test: number;
    private inspectionsPerformed: number = 0;

    constructor(items: number[], trueTarget: number, falseTarget: number, inspect: Function, test: number) {
        this.items = items;
        this.trueTarget = trueTarget;
        this.falseTarget = falseTarget;
        this._inspect = inspect;
        this._test = test;
    }

    public GetTestMod(): number {
        return this._test;
    }

    private test(item: number): boolean {
        return item % this._test === 0;
    }

    public TakeTurn(monkeys: Monkey[]): void {
        while (this.items.length > 0) {
            let item = this.items.shift();
            item = this._inspect(item) % mod;
            const destination = this.test(item) ? this.trueTarget : this.falseTarget;
            monkeys[destination].AddItem(item);
            this.inspectionsPerformed++;
        }
    }

    public GetInspections(): number {
        return this.inspectionsPerformed;
    }

    public AddItem(item: number) {
        this.items.push(item);
    }
}

const monkeys: Monkey[] = [];

// I used a vim macro to create these from the inputs ;)
monkeys.push(new Monkey([91, 58, 52, 69, 95, 54], 1, 5, (old: number) => old * 13, 7));
monkeys.push(new Monkey([80, 80, 97, 84], 3, 5, (old: number) => old * old, 3));
monkeys.push(new Monkey([86, 92, 71], 0, 4, (old: number) => old + 7, 2));
monkeys.push(new Monkey([96, 90, 99, 76, 79, 85, 98, 61], 7, 6, (old: number) => old + 4, 11));
monkeys.push(new Monkey([60, 83, 68, 64, 73], 1, 0, (old: number) => old * 19, 17));
monkeys.push(new Monkey([96, 52, 52, 94, 76, 51, 57], 7, 3, (old: number) => old + 3, 5));
monkeys.push(new Monkey([75], 4, 2, (old: number) => old + 5, 13));
monkeys.push(new Monkey([83, 75], 2, 6, (old: number) => old + 1, 19));

const exampleMonkeys: Monkey[] = [];
exampleMonkeys.push(new Monkey([79, 98], 2, 3, (old: number) => old * 19, 23));
exampleMonkeys.push(new Monkey([54, 65, 75, 74], 2, 0, (old: number) => old + 6, 19));
exampleMonkeys.push(new Monkey([79, 60, 97], 1, 3, (old: number) => old * old, 13));
exampleMonkeys.push(new Monkey([74], 0, 1, (old: number) => old + 3, 17));

for (let monkey of exampleMonkeys) {
    mod *= monkey.GetTestMod();
}

for (let i = 0; i < 10000; ++i) {
    for (let monkey of exampleMonkeys) {
        monkey.TakeTurn(exampleMonkeys);
    }
}

mod = 1;
for (let monkey of monkeys) {
    mod *= monkey.GetTestMod();
}

for (let i = 0; i < 10000; ++i) {
    for (let monkey of monkeys) {
        monkey.TakeTurn(monkeys);
    }
}

log("Example:");
let exampleInspections: number[] = [];
for (let monkey of exampleMonkeys) {
    exampleInspections.push(monkey.GetInspections());
}
exampleInspections.sort((a, b) => b - a);
log(exampleInspections, '\n', exampleInspections[0] * exampleInspections[1]);

log("\nMy Input:");
let inspections: number[] = [];
for (let monkey of monkeys) {
    inspections.push(monkey.GetInspections());
}

inspections.sort((a, b) => b - a);
log(inspections, '\n', inspections[0] * inspections[1]);
