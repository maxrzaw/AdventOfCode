fn main() {
    // Start by removing the quotations from the ends of the string
    // count all characters, but when we get to an escape sequence, we need to look ahead up to 3
    // characters
    // if the next character is '/' or '"', then we continue parsing and reduce the count by one
    // if the next character is an 'x', then we keep looking for two more hex digits
    // how would we deal with something like this: "asdf\\x86"
    // what if the string ends in \"
    println!("Hello, world!");
    let x: Vec<i32> = [2; 3].to_vec();
    println!("{x:?}");
}
