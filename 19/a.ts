import { log } from 'console';
import * as fs from 'fs';
export const ex = "";

enum Mineral {
    Ore = "Ore",
    Clay = "Clay",
    Obsidian = "Obsidian",
    Geode = "Geode",
}

const stringToMineral: Map<string, Mineral> = new Map<string, Mineral>([
    ["ore", Mineral.Ore],
    ["clay", Mineral.Clay],
    ["obsidian", Mineral.Obsidian],
    ["geode", Mineral.Geode],
]);

type minerals = { ore: number, clay: number, obsidian: number, geode: number };

function CanBuild(resources: minerals, cost: minerals): boolean {
    return (resources.ore >= cost.ore &&
        resources.clay >= cost.clay &&
        resources.obsidian >= cost.obsidian);
}

function WorthBuilding(robots: minerals, max: minerals, product: Mineral): boolean {
    switch (product) {
        case Mineral.Ore:
            return robots.ore <= max.ore + 1;
        case Mineral.Clay:
            return robots.clay <= max.clay + 1;
        case Mineral.Obsidian:
            return robots.obsidian <= max.obsidian + 1;
        case Mineral.Geode:
            return true;
        default:
            return true;
    }
}

function SubtractCostFromResources(resources: minerals, cost: minerals): minerals {
    return {
        ore: resources.ore - cost.ore,
        clay: resources.clay - cost.clay,
        obsidian: resources.obsidian - cost.obsidian,
        geode: resources.geode - cost.geode,
    };
}

function AddResourcesTogether(resources: minerals, cost: minerals): minerals {
    return {
        ore: resources.ore + cost.ore,
        clay: resources.clay + cost.clay,
        obsidian: resources.obsidian + cost.obsidian,
        geode: resources.geode + cost.geode,
    };
}

function MaxResources(max: minerals, cost: minerals): void {
    max.ore = Math.max(max.ore, cost.ore);
    max.clay = Math.max(max.clay, cost.clay);
    max.obsidian = Math.max(max.obsidian, cost.obsidian);
    max.geode = Math.max(max.geode, cost.geode);
}

class Robot {
    cost: minerals;
    product: Mineral;
    constructor(cost: minerals, product: Mineral) {
        this.cost = cost;
        this.product = product;
    }

    GetProductAsMinerals(): minerals {
        const out: minerals = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
        switch (this.product) {
            case Mineral.Ore:
                out.ore = 1;
                break;
            case Mineral.Clay:
                out.clay = 1;
                break;
            case Mineral.Obsidian:
                out.obsidian = 1;
                break;
            case Mineral.Geode:
                out.geode = 1;
                break;
            default:
                break;
        }
        return out;
    }
}

class Blueprint {
    id: number;
    oreBot: Robot;
    clayBot: Robot;
    obsidianBot: Robot;
    geodeBot: Robot;
    geodeCount: number;
    maxCost: minerals;
    constructor(id: number, robots: Robot[] = []) {
        this.id = id;
        this.geodeCount = 0;
        this.maxCost = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
        for (let bot of robots) {
            if (bot.product === Mineral.Ore) {
                this.oreBot = bot;
            }
            else if (bot.product === Mineral.Clay) {
                this.clayBot = bot;
            }
            else if (bot.product === Mineral.Obsidian) {
                this.obsidianBot = bot;
            }
            else if (bot.product === Mineral.Geode) {
                this.geodeBot = bot;
            }
            MaxResources(this.maxCost, bot.cost);
        }
    }

    public GetQualityLevel(): number {
        return this.geodeCount * this.id;
    }

    public CalculateGeodeScore(minutes: number): void {
        const robots: minerals = { ore: 1, clay: 0, obsidian: 0, geode: 0 };
        const bank: minerals = { ore: 0, clay: 0, obsidian: 0, geode: 0 };
        this.geodeCount = this.GetMinerals(robots, bank, minutes);
    }

    private GetMinerals(robots: minerals, resources: minerals, minutes: number): number {
        // if (resources.geode === 9) {
        //     log(robots, resources, minutes);
        // }
        if (minutes === 0) {
            return resources.geode;
        }

        const nextResources = GetResourcesNMinLater(robots, resources);
        let max = resources.geode;

        let tryNoBuilding = false;
        let geodeBuilt = CanBuild(resources, this.geodeBot.cost);
        if (geodeBuilt) {
            const afterBuilding = SubtractCostFromResources(nextResources, this.geodeBot.cost);
            const nextRobots: minerals = AddResourcesTogether(robots, this.geodeBot.GetProductAsMinerals());
            max = Math.max(max, this.GetMinerals(nextRobots, afterBuilding, minutes - 1));
        }

        geodeBuilt = false;

        if (!geodeBuilt //&& minutes >= this.oreBot.cost.ore
            && CanBuild(resources, this.oreBot.cost)
            && WorthBuilding(resources, this.maxCost, this.oreBot.product)
        ) {
            const afterBuilding = SubtractCostFromResources(nextResources, this.oreBot.cost);
            const nextRobots: minerals = AddResourcesTogether(robots, this.oreBot.GetProductAsMinerals());
            max = Math.max(max, this.GetMinerals(nextRobots, afterBuilding, minutes - 1));
        } else {
            tryNoBuilding = true;
        }

        if (!geodeBuilt && CanBuild(resources, this.clayBot.cost)
            && WorthBuilding(resources, this.maxCost, this.clayBot.product)
        ) {
            const afterBuilding = SubtractCostFromResources(nextResources, this.clayBot.cost);
            const nextRobots: minerals = AddResourcesTogether(robots, this.clayBot.GetProductAsMinerals());
            max = Math.max(max, this.GetMinerals(nextRobots, afterBuilding, minutes - 1));
        } else {
            tryNoBuilding = true;
        }

        if (!geodeBuilt && CanBuild(resources, this.obsidianBot.cost)
            && WorthBuilding(resources, this.maxCost, this.obsidianBot.product)
        ) {
            const afterBuilding = SubtractCostFromResources(nextResources, this.obsidianBot.cost);
            const nextRobots: minerals = AddResourcesTogether(robots, this.obsidianBot.GetProductAsMinerals());
            max = Math.max(max, this.GetMinerals(nextRobots, afterBuilding, minutes - 1));
        } else {
            tryNoBuilding = true;
        }

        if (true || tryNoBuilding) {
            // create no robots
            max = Math.max(max, this.GetMinerals(robots, nextResources, minutes - 1));
        }

        // create
        //log(robots, resources);
        // log(`${prefix}returning ${max}`);
        // log();
        return max;
    }
}

function GetResourcesNMinLater(robots: minerals, resources: minerals, n: number = 1): minerals {
    return {
        ore: resources.ore + robots.ore * n,
        clay: resources.clay + robots.clay * n,
        obsidian: resources.obsidian + robots.obsidian * n,
        geode: resources.geode + robots.geode * n,
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
    const robotType: Mineral = stringToMineral.get(type.split(' ')[1]);
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

let sum = 0;
for (let blueprint of blueprints) {
    blueprint.CalculateGeodeScore(24);
    log(`blueprint: ${blueprint.id}, result: ${blueprint.geodeCount}`);
    sum += blueprint.GetQualityLevel();
}
log(sum);
