use std::{collections::HashSet, fs};

#[derive(Hash, Eq, PartialEq, Debug, Clone, Copy)]
struct Point {
    row: i32,
    col: i32,
}

impl Point {
    fn new(row: i32, col: i32) -> Point {
        Point { row, col }
    }
}

fn main() {
    let mut points_one: HashSet<Point> = HashSet::new();
    let mut current_one: Point = Point::new(0,0);

    let mut points_two: HashSet<Point> = HashSet::new();
    let mut current_santa: Point = Point::new(0,0);
    let mut current_robot: Point = Point::new(0,0);
    let mut i = 0;

    let input = fs::read_to_string("input.txt")
        .expect("should have been able to read in input.txt");

    input.chars().for_each(|c| {
        if c == '>' {
            current_one.col += 1;
            if i % 2 == 0 {
                current_santa.col += 1;
            }
            else {
                current_robot.col += 1;
            }
        }
        if c == '<' {
            current_one.col -= 1;
            if i % 2 == 0 {
                current_santa.col -= 1;
            }
            else {
                current_robot.col -= 1;
            }
        }
        if c == '^' {
            current_one.row += 1;
            if i % 2 == 0 {
                current_santa.row += 1;
            }
            else {
                current_robot.row += 1;
            }
        }
        if c == 'v' {
            current_one.row -= 1;
            if i % 2 == 0 {
                current_santa.row -= 1;
            }
            else {
                current_robot.row -= 1;
            }
        }

        i += 1;

        points_one.insert(current_one);

        points_two.insert(current_santa);
        points_two.insert(current_robot);

    });

    println!("Houses visited in Part One: {}", points_one.len());
    println!("Houses visited in Part Two: {}", points_two.len());
}
