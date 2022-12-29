export const x = "";
const PART = parseInt(process.argv[2]);
const ROUNDS = parseInt(process.argv[3]);
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
            if (PART === 1) {
                item = Math.floor(this._inspect(item) / 3);
            } else {
                item = this._inspect(item) % mod;
            }
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

// I used a vim macro to create these from the inputs ;)
const monkeys: Monkey[] = [];
monkeys.push(new Monkey([91, 58, 52, 69, 95, 54], 1, 5, (old: number) => old * 13, 7));
monkeys.push(new Monkey([80, 80, 97, 84], 3, 5, (old: number) => old * old, 3));
monkeys.push(new Monkey([86, 92, 71], 0, 4, (old: number) => old + 7, 2));
monkeys.push(new Monkey([96, 90, 99, 76, 79, 85, 98, 61], 7, 6, (old: number) => old + 4, 11));
monkeys.push(new Monkey([60, 83, 68, 64, 73], 1, 0, (old: number) => old * 19, 17));
monkeys.push(new Monkey([96, 52, 52, 94, 76, 51, 57], 7, 3, (old: number) => old + 3, 5));
monkeys.push(new Monkey([75], 4, 2, (old: number) => old + 5, 13));
monkeys.push(new Monkey([83, 75], 2, 6, (old: number) => old + 1, 19));

for (let monkey of monkeys) {
    mod *= monkey.GetTestMod();
}

for (let i = 0; i < ROUNDS; ++i) {
    for (let monkey of monkeys) {
        monkey.TakeTurn(monkeys);
    }
}

let inspections: number[] = [];
for (let monkey of monkeys) {
    inspections.push(monkey.GetInspections());
}

inspections.sort((a, b) => b - a);
console.log(inspections[0] * inspections[1]);
