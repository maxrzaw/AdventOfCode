use std::{collections::HashMap, fs};

fn is_nice_part_one(s: &str) -> bool {
    let mut total_vowels = 0;
    for vowel in ['a', 'e', 'i', 'o', 'u'] {
        total_vowels += s.matches(vowel).count();
    }
    if total_vowels < 3 {
        return false;
    }

    let mut found_pair = false;
    for pair in ["ab", "cd", "pq", "xy"] {
        if s.contains(pair) {
            found_pair = true;
            break;
        }
    }

    if found_pair {
        return false;
    }

    let mut prev = '_';
    for value in s.chars() {
        if value == prev {
            return true;
        }
        prev = value;
    }
    return false;
}

fn is_nice_part_two(s: &str) -> bool {
    // A map from a pair to the first occurence
    let mut pairs: HashMap<&[char], u32> = HashMap::new();

    let vec = s.chars().collect::<Vec<char>>();
    let windows = vec.windows(2);
    let mut pair_idx = 0;
    let mut found_pair = false;
    for pair in windows {
        let p = pairs.get(pair);
        if p != None {
            if p.unwrap() + 1 != pair_idx {
                found_pair = true;
                break;
            }
        } else {
            pairs.insert(pair, pair_idx);
        }
        pair_idx += 1;
    }

    if !found_pair {
        return false;
    }

    let mut prev = '_';
    let mut prev_prev = '_';
    for value in s.chars() {
        if value == prev_prev {
            return true;
        }
        prev_prev = prev;
        prev = value;
    }

    return false;
}

fn main() {
    let input =
        fs::read_to_string("input.txt").expect("should have been able to read in input.txt");
    let mut count_part_one = 0;
    let mut count_part_two = 0;
    input.lines().for_each(|line| {
        if is_nice_part_one(line) {
            count_part_one += 1;
        }
        if is_nice_part_two(line) {
            count_part_two += 1;
        }
    });
    println!("Part One: {}", count_part_one);
    println!("Part Two: {}", count_part_two);
}
