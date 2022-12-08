use std::fs;

fn main() {
    let contents = fs::read_to_string("example.txt").expect("Error reading string");

    let counts: Vec<usize> = contents
        .split("\n\n")
        .map(|e| {
            return e.lines().flat_map(str::parse::<usize>).sum();
        })
        .collect();

    let max = counts.iter().max();
    match max {
        Some(max) => println!("max: {}", max),
        None => println!("Empty"),
    }
}
