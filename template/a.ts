import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');
const sections = input.split('\n\n');
const header = sections[0].trimEnd();
const footer = sections[0].trimEnd();

const lines = footer.split('\n');


