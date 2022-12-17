import { log } from 'console';
import * as fs from 'fs';
export const x = "";

type tunnel = { destination: string, distance: number };
const flowRates: Map<string, number> = new Map<string, number>();
const valveStatus: Map<string, boolean> = new Map<string, boolean>();
const tunnels: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();
const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');
const lines = input.trim().split('\n');
lines.forEach((line) => {
    const valve: string = line.slice(6, 8);
    const rate: number = parseInt(line.split(';')[0].split('=')[1]);
    flowRates.set(valve, rate);
    valveStatus.set(valve, false);

    const valves: tunnel[] = line.split('valve')[1].replace('s ', '').trim().split(',').map((v) => {
        return { destination: v.trim(), distance: 1 };
    });
    const m: Map<string, number> = new Map<string, number>();
    for (let tunnel of valves) {
        m.set(tunnel.destination, tunnel.distance);
    }
    tunnels.set(valve, m);
});

//log(tunnels);
//log(flowRates);

// remove valves with flow rate of zero
// find all the valves a valve can see and add all the valves with a flow rate
// of zero and add them to the current valve
for (let currentValve of tunnels.keys()) {
    const possibleValves: Map<string, number> = tunnels.get(currentValve);

    // check all the valves that we know the distance to
    for (let nextValve of possibleValves.keys()) {
        // get the distance to the nextValve from currentValve
        const distanceFromCurrentValve = possibleValves.get(nextValve);
        // Add the valves that are visible from the next valve to currentValve
        const nextValveTunnels = tunnels.get(nextValve);
        for (let twoHopValve of nextValveTunnels.keys()) {
            let newDistanceFromCurrentValve = distanceFromCurrentValve + nextValveTunnels.get(twoHopValve);
            // add one for the 
            // if the valve can already see it, update it to the shortest
            // distance
            if (possibleValves.has(twoHopValve)) {
                if (possibleValves.get(twoHopValve) > newDistanceFromCurrentValve) {
                    possibleValves.set(twoHopValve, newDistanceFromCurrentValve);
                }
            } else {
                possibleValves.set(twoHopValve, newDistanceFromCurrentValve);
            }
        }
    }
}

// remove valves that have a flow rate of zero and are not AA
for (let valve of tunnels.keys()) {
    if (flowRates.has(valve) && flowRates.get(valve) === 0) {
        // delete this valve from all the other valves lists
        for (let key of tunnels.keys()) {
            tunnels.get(key).delete(valve);
        }

        // I do not want to remove the start
        if (valve !== "AA") {
            tunnels.delete(valve);
            flowRates.delete(valve);
        }
    }
}

//log(tunnels);
//log(flowRates);
const totals = new Map<string, number>();
let grandTotal = 0;
let calls = 0;
function GetMaxPressure(valve: string, time: number, path: string[], total: number): number {
    calls++;
    if (calls % 1000 === 0) {
        log(calls);
    }
    //log(`Time Remaining: ${time}\nVisiting Valve: ${valve}\n`);
    if (valve !== "AA") {
        path.push(valve);
    }
    //log(minute, path);
    // Base Case: Ran out of time, I guess we could get negative
    if (time <= 0) {
        path.pop();
        return -Infinity;
    }
    let pressureReleased = 0;
    const flowRate = flowRates.get(valve);
    if (flowRate !== 0) {
        // take one minute to open the valve
        time--;
        pressureReleased = time * flowRate;
        total += pressureReleased;
        if (totals.has(path.toString()) && totals.get(path.toString()) < total) {
            totals.set(path.toString(), total);
        } else if (!totals.has(path.toString())) {
            totals.set(path.toString(), total);
        }

        if (total > grandTotal) {
            grandTotal = total;
            //log(path);
        }
        // mark the current valve as opened
        valveStatus.set(valve, true);
    }

    // Go through all the valves this valve can see and see which gives us the
    // best value
    const pressuresReleased: Map<string, number> = new Map<string, number>();
    const currentValves: Map<string, number> = tunnels.get(valve);

    for (let key of currentValves.keys()) {
        if (valveStatus.get(key) === false) { // valve has not been opened yet
            const distance = currentValves.get(key);
            // set the additional pressure that will be released
            pressuresReleased.set(key, GetMaxPressure(key, time - distance, path, total));
        }
    }

    let max: number = 0;
    for (let key of pressuresReleased.keys()) {
        max = Math.max(max, pressuresReleased.get(key));
    }

    // close the current valve
    valveStatus.set(valve, false);

    pressureReleased += max;


    path.pop();
    return pressureReleased;
}

// mark the starting valve as Open (actually it is stuck closed)
valveStatus.set("AA", true);
const result = GetMaxPressure("AA", 26, [], 0);
const totalArray = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
log(totalArray.length);
let total = 0;
for (let i = 0; i < totalArray.length; ++i) {
    const a = totalArray[i];
    const arr = a[0].split(',');
    if (i % 10000 === 0) {
        log(`iteration ${i}`);
    }
    for (let j = 0; j < totalArray.length; j++) {
        if (i === j) {
            continue;
        }
        const b = totalArray[j];
        const brr = b[0].split(',');
        let unique = true;
        const s = new Set<string>();
        for (let item of arr) {
            s.add(item);
        }
        for (let item of brr) {
            if (s.has(item)) {
                unique = false;
                break;
            }
        }
        if (unique && a[1] + b[1] > total) {
            total = a[1] + b[1];
        }
    }
}
log(total);
log(result);
