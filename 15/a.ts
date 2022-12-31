import * as fs from 'fs';
import Utils, { point } from '../utils';

export const ex = "";
type lineSegment = { start: number, end: number };
class sensor { location: point; beacon: point; };

function GetRuledOut(sensor: sensor, y: number, min: number, max: number): lineSegment | null {
    const distance = Utils.ManhattanDistance(sensor.location, sensor.beacon);
    let middle = sensor.location.x;
    if (Utils.ManhattanDistance(sensor.location, { x: middle, y: y }) > distance) {
        return null;
    }

    let left = middle - distance + Math.abs(sensor.location.y - y);
    let right = middle + distance - Math.abs(sensor.location.y - y);
    left = Math.max(min, left);
    right = Math.min(max, right);

    return { start: left, end: right };
}

const y = parseInt(process.argv[3]);
const maxCoordinate = parseInt(process.argv[4]);

const sensors: sensor[] = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map((line) => {
    const points: point[] = line.replace("Sensor at ", "").split(": closest beacon is at ").map((coord) => {
        const [x, y] = coord.replace("x=", "").split(", y=").map((val) => parseInt(val));
        return { x: x, y: y };
    });
    return { location: points[0], beacon: points[1] };
});

// Done with parsing, now the fun begins
let spots = new Set<number>();
for (let sense of sensors) {
    const segment: lineSegment | null = GetRuledOut(sense, y, -Infinity, Infinity);
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

console.log(`Part One: ${spots.size}`);

let x = -Infinity;
for (let y = 0; y < maxCoordinate; ++y) {
    let segments: lineSegment[] = [];
    for (let sense of sensors) {
        let segment: lineSegment | null = GetRuledOut(sense, y, 0, maxCoordinate);
        if (segment === null) {
            continue;
        }

        // I don't care about the other portions of the space
        segment.start = Math.max(segment.start, 0);
        segment.end = Math.min(segment.end, maxCoordinate);
        segments.push(segment);
    }

    segments.sort((a, b) => a.start - b.start);
    let grandSegment = { start: 0, end: 0 };

    for (let segment of segments) {
        if (segment.start > grandSegment.end) {
            x = segment.start - 1;
            break;
        }
        grandSegment.end = Math.max(grandSegment.end, segment.end);
    }

    if (x !== -Infinity) {
        console.log(`Part Two: ${maxCoordinate} * (x:${x}) + (y:${y}) = ${maxCoordinate * x + y}`);
        break;
    }
}
