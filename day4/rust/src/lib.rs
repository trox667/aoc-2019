extern crate chrono;

pub mod io {
    use chrono::NaiveDateTime;
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

    pub fn parse_date_ymd_hm(s: &str) -> Option<NaiveDateTime> {
        NaiveDateTime::parse_from_str(s, "%Y-%m-%d %H:%M").ok()
    }
}

