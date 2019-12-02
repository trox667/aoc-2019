use baselib::io;

fn main() {
    let lines: Vec<String> = io::read_file("input");
    if lines.len() > 0 {
        let mut d: Vec<usize> = string_to_num_vec(&lines[0]);
        let d2 = d.clone();
        d[1] = 12;
        d[2] = 2;
        run(&mut d);
        println!("Part 1: {}", d[0]);

        if let Some(res) = search(19690720, &d2) {
            println!("Part 2: {}", 100 * res.0 + res.1);
        }
    }
}

fn search(target: usize, d: &Vec<usize>) -> Option<(usize, usize)> {
    for n in 0..99 {
        for v in 0..99 {
            let mut dc = d.clone();
            dc[1] = n;
            dc[2] = v;
            run(&mut dc); 
            if dc[0] == target {
                return Some((n,v)); 
            }
        }
    }
    None
}

const ADD: usize = 1;
const MULTIPLY: usize = 2;
const TERMINATE: usize = 99;

fn string_to_num_vec(s: &str) -> Vec<usize> {
    s.split(',').filter_map(|token| token.parse::<usize>().ok()).collect()
}

fn op(c: usize, in1: usize, in2: usize) -> Option<usize> {
    match c {
        ADD => Some(in1 + in2),
        MULTIPLY => Some(in1 * in2),
        _ => None,
    }
}

fn run(d: &mut Vec<usize>) {
    let mut i = 0;
    while i < d.len() {
        match d[i] {
            TERMINATE => return,
            ADD | MULTIPLY => {
                if let Some(v) = op(d[i], d[d[i+1]], d[d[i+2]]) {
                    let idx = d[i+3];
                    d[idx] = v;
                }
                i += 4;
            },
            _ => i += 1
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn parse() {
        let d = "1,9,10,3,2,3,11,0,99,30,40,50";
        let ref_d = vec![1,9,10,3,2,3,11,0,99,30,40,50];
        assert_eq!(string_to_num_vec(d), ref_d);
    }

    #[test]
    fn sample() {
        let mut d = vec![1,9,10,3,2,3,11,0,99,30,40,50];
        run(&mut d);
        assert_eq!(d[0], 3500);
    }
}
