use std::cmp;
use std::fs;

// Returns ([on/off/toggle], [x1,y1], [x2,y2])
fn parse_line(s: &str) -> (&str, &str, &str) {
    let tokens = s.rsplit(' ').collect::<Vec<&str>>();
    return (tokens[3], tokens[2], tokens[0]);
}

// Sets the range from start to stop. Parses start and stop as strings
fn set_range_one(lights: &mut [[bool; 1000]; 1000], line: (&str, &str, &str)) -> () {
    // sets the range from start to stop
    let s = line
        .1
        .split(',')
        .map(|s| s.parse::<usize>().unwrap())
        .collect::<Vec<usize>>();
    let e = line
        .2
        .split(',')
        .map(|s| s.parse::<usize>().unwrap())
        .collect::<Vec<usize>>();
    // I want to work with tuples
    let start: (usize, usize) = (s[0], s[1]);
    let end: (usize, usize) = (e[0], e[1]);
    for row in start.0..=end.0 {
        for col in start.1..=end.1 {
            if line.0 == "toggle" {
                lights[row][col] = !lights[row][col];
            }
            if line.0 == "on" {
                lights[row][col] = true;
            }
            if line.0 == "off" {
                lights[row][col] = false;
            }
        }
    }
}

// Sets the range from start to stop. Parses start and stop as strings
fn set_range_two(lights: &mut [[i32; 1000]; 1000], line: (&str, &str, &str)) -> () {
    // sets the range from start to stop
    let s = line
        .1
        .split(',')
        .map(|s| s.parse::<usize>().unwrap())
        .collect::<Vec<usize>>();
    let e = line
        .2
        .split(',')
        .map(|s| s.parse::<usize>().unwrap())
        .collect::<Vec<usize>>();
    // I want to work with tuples
    let start: (usize, usize) = (s[0], s[1]);
    let end: (usize, usize) = (e[0], e[1]);
    for row in start.0..=end.0 {
        for col in start.1..=end.1 {
            if line.0 == "toggle" {
                lights[row][col] += 2;
            }
            if line.0 == "on" {
                lights[row][col] += 1;
            }
            if line.0 == "off" {
                lights[row][col] = cmp::max(0, lights[row][col] - 1);
            }
        }
    }
}

fn print_count_one(lights: &mut [[bool; 1000]; 1000]) {
    let mut count: u32 = 0;
    for row in 0..1000 {
        for col in 0..1000 {
            if lights[row][col] {
                count += 1;
            }
        }
    }
    println!("Part One Count On: {}", count);
}

fn print_total_two(lights: &mut [[i32; 1000]; 1000]) {
    let mut total: i32 = 0;
    for row in 0..1000 {
        for col in 0..1000 {
            total += lights[row][col];
        }
    }
    println!("Part Two Total Brightness: {}", total);
}

fn main() {
    let mut lights_one = [[false; 1000]; 1000];
    let mut lights_two = [[0; 1000]; 1000];
    fs::read_to_string("input.txt")
        .expect("should have been able to read in input.txt")
        .lines()
        .for_each(|line| {
            let parsed_line = parse_line(line);
            set_range_one(&mut lights_one, parsed_line);
            set_range_two(&mut lights_two, parsed_line);
        });

    print_count_one(&mut lights_one);
    print_total_two(&mut lights_two);
}
