use std::fs;

fn main() {
    let input = fs::read_to_string("input.txt")
        .expect("should have been able to read in input.txt")
        .lines().map(|l| {
            let mut lengths = l.split('x').filter_map(|s| s.parse::<i32>().ok()).collect::<Vec<i32>>();
            assert_eq!(3, lengths.len());
            lengths.sort();
            let paper = 3 * lengths[0] * lengths[1] + 2 * lengths[0] * lengths[2] + 2 * lengths[1] * lengths[2];
            let ribbon = 2 * (lengths[0] + lengths[1]) + lengths[0] * lengths[1] * lengths[2];
            return [paper, ribbon];
        }).reduce(|accum, item| { [accum[0] + item[0], accum[1] + item[1]] })
        .unwrap();
    println!("Part One: {}\nPart Two: {}", input[0], input[1]);
}
