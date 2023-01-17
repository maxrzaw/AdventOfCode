use std::{collections::HashMap, fs};

#[derive(Debug, PartialEq, Eq)]
pub enum GateOps {
    And,
    Or,
    Not,
    LeftShift,
    RightShift,
    Empty,
}

fn try_parse_gate_op(input: &str) -> GateOps {
    match input {
        "AND" => GateOps::And,
        "OR" => GateOps::Or,
        "NOT" => GateOps::Not,
        "LSHIFT" => GateOps::LeftShift,
        "RSHIFT" => GateOps::RightShift,
        _ => GateOps::Empty,
    }
}

pub struct LeftHandSide<'a> {
    // these will have to be converted
    arguments: Vec<&'a str>,
    gate: GateOps,
}

fn make_lhs(input: &str) -> LeftHandSide {
    let tokens = input.split(' ').collect::<Vec<&str>>();
    let mut lhs = LeftHandSide {
        arguments: Vec::new(),
        gate: GateOps::Empty,
    };

    // There is only one token so there can only be an argument.
    if tokens.len() == 1 {
        lhs.arguments.push(tokens[0]);
        return lhs;
    }

    // There is a gate since there are at least two tokens
    for t in tokens {
        let arg = try_parse_gate_op(t);
        if arg == GateOps::Empty {
            lhs.arguments.push(t);
        } else {
            lhs.gate = arg;
        }
    }

    return lhs;
}

fn evaluate_wire(
    cache: &mut HashMap<String, u16>,
    gates: &HashMap<String, LeftHandSide>,
    wire: &str,
) -> u16 {
    // Base case: Already in cache
    if cache.get(wire).is_some() {
        return cache[wire];
    }

    // Base case: is a number
    if wire.parse::<u16>().is_ok() {
        return wire.parse::<u16>().unwrap();
    }

    // Recursive Case: calculate the value
    let lhs: &LeftHandSide = &gates[wire];

    match lhs.gate {
        GateOps::Not => {
            let val: u16 = evaluate_wire(cache, &gates, lhs.arguments[0]);
            cache.insert(wire.into(), !val);
        },
        GateOps::LeftShift => {
            let v0: u16 = evaluate_wire(cache, &gates, lhs.arguments[0]);
            let v1: u16 = evaluate_wire(cache, &gates, lhs.arguments[1]);
            cache.insert(wire.into(), v0 << v1);
        },
        GateOps::RightShift => {
            let v0: u16 = evaluate_wire(cache, &gates, lhs.arguments[0]);
            let v1: u16 = evaluate_wire(cache, &gates, lhs.arguments[1]);
            cache.insert(wire.into(), v0 >> v1);
        },
        GateOps::And => {
            let v0: u16 = evaluate_wire(cache, &gates, lhs.arguments[0]);
            let v1: u16 = evaluate_wire(cache, &gates, lhs.arguments[1]);
            cache.insert(wire.into(), v0 & v1);
        },
        GateOps::Or => {
            let v0: u16 = evaluate_wire(cache, &gates, lhs.arguments[0]);
            let v1: u16 = evaluate_wire(cache, &gates, lhs.arguments[1]);
            cache.insert(wire.into(), v0 | v1);
        },
        GateOps::Empty => {
            let v0: u16 = evaluate_wire(cache, &gates, lhs.arguments[0]);
            cache.insert(wire.into(), v0);
        },
    }

    return cache[wire];
}

fn main() {
    let mut gates: HashMap<String, LeftHandSide> = HashMap::new();
    let mut cache: HashMap<String, u16> = HashMap::new();

    let input = fs::read_to_string("input.txt").expect("Expected to be able to read the input");
    input.lines().for_each(|line| {
        let sides = line.split(" -> ").collect::<Vec<&str>>();
        let lhs = sides[0];
        let rhs = sides[1];
        gates.insert(rhs.into(), make_lhs(lhs));
    });

    // Save the value for part one
    let a = evaluate_wire(&mut cache, &gates, "a");
    println!("Part One {}: {}", "a", a);

    // Reset for Part Two
    cache.clear();
    cache.insert("b".into(), a);
    let a2 = evaluate_wire(&mut cache, &gates, "a");
    println!("Part Two {}: {}", "a", a2);
}
