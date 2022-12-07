import { readFileSync } from "fs";
export class File {
    name: string;
    _size: number;

    public constructor(name: string, size: number) {
        this.name = name;
        this._size = size;
    }

    size(): number {
        return this._size;
    }

    print(prefix: string): void {
        console.log(`${prefix}- ${this.name} (file, size=${this._size})`);
    }
}

export class Dir extends File {
    content: File[];
    parent: Dir | undefined;
    dirty: boolean = true;
    constructor(name: string, parent: Dir | undefined) {
        super(name, 0);
        this.content = [];
        this.parent = parent;
    }

    cd(name: string): Dir | undefined {
        if (name === "..") {
            return this.parent;
        }

        let dir: Dir | undefined = this.content.find((f) => f instanceof Dir && f.name === name) as Dir;
        if (dir === undefined) {
            dir = new Dir(name, this);
            this.content.push(dir);
        }

        return dir;
    }

    makeDirty(): void {
        this.dirty = true;
        this.parent?.makeDirty();
    }

    size(): number {
        if (this.dirty) {
            this._size = this.content.reduce((sum, file) => {
                return sum + file.size();
            }, 0);
        }
        return this._size;
    }

    addFile(file: string): void {
        const [arg1, name] = file.split(' ');

        let _file: File | undefined;
        if (arg1 === "dir") {
            _file = this.content.find((f) => f instanceof Dir && f.name === name);
            if (_file === undefined) {
                _file = new Dir(name, this);
                this.content.push(_file);
            }
        } else {
            _file = this.content.find((f) => f instanceof File && f.name === name);
            if (_file === undefined) {
                _file = new File(name, parseInt(arg1));
                this.content.push(_file);
                this.makeDirty();
            }
        }
    }

    walk(victims: Dir[], minimum: number): void {
        if (this.size() >= minimum) {
            victims.push(this);
        }
        this.content.forEach((f) => {
            if (f instanceof Dir) {
                f.walk(victims, minimum);
            }
        });
    }

    print(prefix: string): void {
        console.log(`${prefix}- ${this.name} (dir) (${this.size()})`);
        this.content.forEach((f) => f.print(prefix + '  '));
    }
}

const filename = process.argv[2];

const input = readFileSync(filename, 'utf8');
const lines = input.trimEnd().split('\n');

const root = new Dir("/", undefined);
let currentDir = root;
const victims: Dir[] = [];
for (const line of lines) {
    const parsedLine = line.split(' ');
    if (parsedLine[0] === '$') {
        // command
        if (parsedLine[1] === "cd") {
            // cd
            currentDir = currentDir.cd(parsedLine[2]) as Dir;
        }
        // do not need to do anything for ls
    } else {
        // output from ls
        currentDir.addFile(line);
    }
}
root.print('');
const totalDisk = 70000000;
const requiredSpace = 30000000;
const used = root.size();
console.log(used);
const minimumSize = used + requiredSpace - totalDisk;
console.log(minimumSize);
root.walk(victims, minimumSize);

console.log(victims.sort((a, b) => b.size() - a.size()).slice(-5));

