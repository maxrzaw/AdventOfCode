import { log } from 'console';
import * as fs from 'fs';
import Utils, { point } from '../utils';

export const ex = "";
type lineSegment = { start: number, end: number };
class sensor {
    location: point;
    beacon: point;
};

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

const filename = process.argv[2];
const maxCoordinate = parseInt(process.argv[3]);

const input = fs.readFileSync(filename, 'utf8');
const lines = input.trim().split('\n');

const sensors: sensor[] = lines.map((line) => {
    const points: point[] = line
        .replace("Sensor at ", "")
        .split(": closest beacon is at ")
        .map((coord) => {
            // "x=[num], y=[num]"
            const [x, y] = coord.replace("x=", "").split(", y=").map((val) => parseInt(val));
            return { x: x, y: y };
        });
    return { location: points[0], beacon: points[1] };
});

// Done with parsing, now the fun begins
let x = -Infinity;
for (let y = 0; y < maxCoordinate; ++y) {
    if (y % 10000 === 0) {
        log(`Reached iteration ${y}`);
    }

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
        log(y, x, 4000000 * x + y);
        break;
    }
}

