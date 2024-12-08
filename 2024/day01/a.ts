// read in a line and split it on whitespace
import * as fs from "fs";
const left = [];
const right = [];
fs.readFileSync(process.argv[2], "utf8")
  .split("\n")
  .map((items) =>
    items
      .split(" ")
      .filter((x) => x != "")
      .map((x) => parseInt(x))
  )
  .filter((x) => x.length > 0)
  .forEach(([l, r]) => {
    left.push(l);
    right.push(r);
  });
left.sort((a, b) => a - b);
right.sort((a, b) => a - b);
let total = 0;
for (let i = 0; i < left.length; i++) {
  total += Math.abs(left[i] - right[i]);
}
console.log(total);
