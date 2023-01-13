use md5::{Digest, Md5};

fn main() {
    let mut found_5 = false;
    let mut i = 0;
    loop {
        let mut hasher = Md5::new();

        let input = "ckczppom".to_string() + i.to_string().as_str();
        hasher.update(input.as_bytes());
        let result = hasher.finalize();
        let vec_result = result.to_vec();

        if !found_5 && vec_result.starts_with(&[0x0, 0x0]) && vec_result[2] < 0x10 {
            println!("Input: {}\t{}\tResult: {:X?}", input, i, vec_result);
            found_5 = true;
        }

        if vec_result.starts_with(&[0x0, 0x0, 0x0]) {
            println!("Input: {}\t{}\tResult: {:X?}", input, i, vec_result);
            break;
        }
        i += 1;
    }
}
