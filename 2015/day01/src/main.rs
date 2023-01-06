use std::fs;

fn one() {
    let sum: i32 = fs::read_to_string("input.txt")
        .expect("should have been able to read in input.txt")
        .chars()
        .map(|c| match c {
            '(' => 1,
            ')' => -1,
            _ => 0,
        })
        .sum();
    println!("Part One Sum: {}", sum);
}

fn two() {
    let position = fs::read_to_string("input.txt")
        .expect("should have been able to read in input.txt")
        .chars()
        .scan(0, |state, c| {
            match c {
                '(' => *state += 1,
                ')' => *state += -1,
                _ => *state += 0,
            };
            return Some(*state);
        })
        .position(|c| c == -1)
        .expect("should have found a value with -1");
    println!("Part Two Position: {}", position + 1);
}

fn main() {
    one();
    two();
}
