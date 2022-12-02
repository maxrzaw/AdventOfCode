import * as fs from 'fs';
export const x = "";

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');
