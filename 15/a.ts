import { log } from 'console';
import * as fs from 'fs';
import Utils, { point } from '../utils';

export const ex = "";
type lineSegment = { start: number, end: number };
class sensor {
    location: point;
    beacon: point;
};

// I found out this was a terrible way to do this in part two...
function GetRuledOut(sensor: sensor, y: number): lineSegment | null {
    const distance = Utils.ManhattanDistance(sensor.location, sensor.beacon);
    let middle = sensor.location.x;
    let left = middle;
    let right = middle;
    let currentDistance = Utils.ManhattanDistance(sensor.location, {x: middle, y: y });
    if (currentDistance > distance) {
        return null;
    }
    // find left
    while (Utils.ManhattanDistance(sensor.location, {x: left, y: y }) < distance) {
        left--
    }

    // find right
    while (Utils.ManhattanDistance(sensor.location, {x: right, y: y }) < distance) {
        right++;
    }

    return { start: left, end: right };
}

const filename = process.argv[2];
const y = parseInt(process.argv[3]);

const input = fs.readFileSync(filename, 'utf8');
const lines = input.trim().split('\n');

const sensors: sensor[] = lines.map((line) => {
    const points: point[] = line
    .replace("Sensor at ", "")
    .split(": closest beacon is at ")
    .map((coord) => {
        const [x, y] = coord.replace("x=", "").split(", y=").map((val) => parseInt(val));
        return { x: x, y: y };
    });
    return { location: points[0], beacon: points[1] };
});

// Done with parsing, now the fun begins
let spots = new Set<number>();
for (let sense of sensors) {
    const segment: lineSegment | null = GetRuledOut(sense, y);
    if (segment === null) {
        continue;
    }
    // I found out this was a terrible way to do this in part two...
    // I guess that makes sense now that I think about it.
    // There aren't many sensors, so that isn't the issue.
    // The issue is that this is going through every spot on a segment which is
    // SN^2 where S is the number of sensors. Didn't help that I had another
    // 2SN operations to find the start and end of the segments.
    // So overall, it was somethign like 3SN^2
    for (let i = segment.start; i <= segment.end; ++i) {
        spots.add(i);
    }
}

// remove the beacons
for (let sensor of sensors) {
    if (sensor.beacon.y === y) {
        spots.delete(sensor.beacon.x);
    }
}

log(spots.size);
