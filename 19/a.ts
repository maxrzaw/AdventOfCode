import { log } from 'console';
import * as fs from 'fs';
export const ex = "";

enum Mineral {
    Ore,
    Clay,
    Obsidian,
    Geode,
}

const stringToMineral: Map<string, Mineral> = new Map<string, Mineral>([
    ["ore", Mineral.Ore],
    ["clay", Mineral.Clay],
    ["obsidian", Mineral.Obsidian],
    ["geode", Mineral.Geode],
]);

type minerals = { ore: number, clay: number, obsidian: number, geode: number };
class Robot {
    cost: minerals;
    product: Mineral;
    constructor(cost: minerals, product: Mineral) {
        this.cost = cost;
        this.product = product;
    }
}

class Blueprint {
    robots: Robot[];
    id: number;
    geodeCount: number;
    constructor(id: number, robots: Robot[] = []) {
        this.id = id;
        this.robots = robots;
        this.geodeCount = 0;
    }

    public GetQualityLevel(): number {
        return this.geodeCount * this.id;
    }

    public CalculateGeodeScore(minutes: number): void {
        log(minutes);
    }
}

function ParseCost(cost: string): minerals {
    const items: string[] = cost.split("and").map((s) => s.trim());
    let out: minerals = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
    for (let item of items) {
        const [val, mineral] = item.trim().split(' ');
        const value = parseInt(val);
        switch (mineral) {
            case "ore":
                out.ore = value;
                break;
            case "clay":
                out.clay = value;
                break;
            case "obsidian":
                out.obsidian = value;
                break;
            case "geode":
                out.geode = value;
                break;
            default:
                break;
        }
    }
    return out;
}

function ParseRobot(robot: string): Robot {
    const [type, cost] = robot.trim().split("costs").map((s) => s.trim());
    const minerals: minerals = ParseCost(cost);
    const robotType: Mineral = stringToMineral.get(type);
    return new Robot(minerals, robotType);
}

function ParseBlueprint(blueprint: string): Blueprint {
    const [idString, rest] = blueprint.trim().split(':').map((s) => s.trim());
    const id: number = parseInt(idString.split(' ')[1]);
    const robots: Robot[] = rest.split('.').filter((s) => s !== '').map((s) => ParseRobot(s.trim()));
    return new Blueprint(id, robots);

}

const filename = process.argv[2];

const input = fs.readFileSync(filename, 'utf8');

const blueprints: Blueprint[] = input.trim().split('\n').map((line) => ParseBlueprint(line));
log(blueprints);
