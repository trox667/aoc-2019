pub mod io {
    use std::fs::File;
    use std::io::BufReader;
    use std::io::prelude::*;

    pub fn read_file(filepath: &str) -> Vec<String> {
        if let Ok(file) = File::open(filepath) {
            let reader = BufReader::new(file);
            reader.lines().filter_map(Result::ok).collect()
        } else {
            Vec::new()
        }
    }
}
