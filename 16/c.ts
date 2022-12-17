import { log } from 'console';
import * as fs from 'fs';
import Utils, { Bits } from '../utils';
export const x = "";

type tunnel = { destination: string, distance: number };
const flowRatesStrings: Map<string, number> = new Map<string, number>();
const valveStatusStrings: Map<string, boolean> = new Map<string, boolean>();
const tunnelsStrings: Map<string, Map<string, number>> = new Map<string, Map<string, number>>();
const filename = process.argv[2];
const allValves: string[] = [];

const input = fs.readFileSync(filename, 'utf8');
const lines = input.trim().split('\n');
lines.forEach((line) => {
    const valve: string = line.slice(6, 8);
    const rate: number = parseInt(line.split(';')[0].split('=')[1]);
    flowRatesStrings.set(valve, rate);
    valveStatusStrings.set(valve, false);

    const valves: tunnel[] = line.split('valve')[1].replace('s ', '').trim().split(',').map((v) => {
        return { destination: v.trim(), distance: 1 };
    });
    const m: Map<string, number> = new Map<string, number>();
    for (let tunnel of valves) {
        m.set(tunnel.destination, tunnel.distance);
    }
    tunnelsStrings.set(valve, m);
});

//log(tunnels);
//log(flowRates);

// remove valves with flow rate of zero
// find all the valves a valve can see and add all the valves with a flow rate
// of zero and add them to the current valve
for (let currentValve of tunnelsStrings.keys()) {
    const possibleValves: Map<string, number> = tunnelsStrings.get(currentValve);

    // check all the valves that we know the distance to
    for (let nextValve of possibleValves.keys()) {
        // get the distance to the nextValve from currentValve
        const distanceFromCurrentValve = possibleValves.get(nextValve);
        // Add the valves that are visible from the next valve to currentValve
        const nextValveTunnels = tunnelsStrings.get(nextValve);
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

const valveToInt = new Map<string, number>();
valveToInt.set("AA", 0);
allValves.push("AA");
const flowRates: Map<number, number> = new Map<number, number>();
const valveStatus: Map<number, boolean> = new Map<number, boolean>();
const tunnels: Map<number, Map<number, number>> = new Map<number, Map<number, number>>();
// remove valves that have a flow rate of zero and are not AA
for (let valve of tunnelsStrings.keys()) {
    if (flowRatesStrings.has(valve) && flowRatesStrings.get(valve) === 0) {
        // delete this valve from all the other valves lists
        for (let key of tunnelsStrings.keys()) {
            tunnelsStrings.get(key).delete(valve);
        }

        // I do not want to remove the start
        if (valve !== "AA") {
            tunnelsStrings.delete(valve);
            flowRatesStrings.delete(valve);
        }
    } else {
        const valveNumber = allValves.length;
        allValves.push(valve);
        valveToInt.set(valve, valveNumber);
    }
}

for (let key of flowRatesStrings.keys()) {
    flowRates.set(valveToInt.get(key), flowRatesStrings.get(key));
    valveStatus.set(valveToInt.get(key), valveStatusStrings.get(key));
}

for (let key of tunnelsStrings.keys()) {
    const t2 = tunnelsStrings.get(key);
    const a = new Map<number, number>();
    for (let key2 of t2.keys()) {
        a.set(valveToInt.get(key2), t2.get(key2));
    }
    tunnels.set(valveToInt.get(key), a);
}

//log(flowRatesStrings, valveStatusStrings, tunnelsStrings);
//log(allValves, flowRates, valveStatus, tunnels);
const totals = new Map<number, number>();
let grandTotal = 0;

function GetMaxPressure(valve: number, time: number, path: number, total: number): number {
    // Base Case: Ran out of time, I guess we could get negative
    if (valve !== 0) {
        path = Bits.SetNthBit(path, valve);
    }
    if (time <= 0) {
        return -Infinity;
    }
    let pressureReleased = 0;
    const flowRate = flowRates.get(valve);
    if (flowRate !== 0) {
        // take one minute to open the valve
        time--;
        pressureReleased = time * flowRate;
        total += pressureReleased;
        if (totals.has(path) && totals.get(path) < total) {
            totals.set(path, total);
        } else if (!totals.has(path)) {
            totals.set(path, total);
        }

        if (total > grandTotal) {
            grandTotal = total;
        }
        // mark the current valve as opened
        valveStatus.set(valve, true);
    }

    // Go through all the valves this valve can see and see which gives us the
    // best value
    const pressuresReleased: Map<number, number> = new Map<number, number>();
    const currentValves: Map<number, number> = tunnels.get(valve);

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

    return pressureReleased;
}

// mark the starting valve as Open (actually it is stuck closed)
valveStatus.set(valveToInt.get("AA"), true);

const result = GetMaxPressure(valveToInt.get("AA"), 26, 0, 0);
const totalArray = Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
log(totalArray.length);
let total = 0;
for (let i = 0; i < totalArray.length; ++i) {
    const a = totalArray[i];
    if (i % 10000 === 0) {
        log(`iteration ${i}`);
    }
    for (let j = 0; j < totalArray.length; j++) {
        if (i === j) {
            continue;
        }
        const b = totalArray[j];
        let unique = Bits.Union(a[0], b[0]) === 0;
        if (unique && a[1] + b[1] > total) {
            total = a[1] + b[1];
        }
    }
}
log(total);
log(result);
