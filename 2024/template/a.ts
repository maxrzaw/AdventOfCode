import * as fs from 'fs';

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');
const sections = input.split('\n').filter((x) => x !== '');
const lines = input.split('\n');
