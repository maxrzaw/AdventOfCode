import * as fs from 'fs';
export const x = "";

const lines = fs.readFileSync(process.argv[2], 'utf8').split('\n').slice(0, -1);

let countOne = 0;
let countTwo = 0;
for (let line of lines) {
    let left = line.split(',')[0].split('-');
    let right = line.split(',')[1].split('-');
    if ((parseInt(left[1]) >= parseInt(right[0]) && parseInt(right[1]) >= parseInt(left[0])) ||
        (parseInt(right[1]) >= parseInt(left[0]) && parseInt(left[1]) >= parseInt(right[0]))) {
        countTwo += 1;
    }
    if ((parseInt(left[0]) <= parseInt(right[0]) && parseInt(left[1]) >= parseInt(right[1])) ||
        (parseInt(right[0]) <= parseInt(left[0]) && parseInt(right[1]) >= parseInt(left[1]))) {
        countOne += 1;
    }
}

console.log(`Part One: ${countOne}\nPart Two: ${countTwo}`);
