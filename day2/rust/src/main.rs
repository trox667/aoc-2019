use baselib::io;

fn main() {
    io::read_file("input").iter().for_each(|line| {
        let mut d = parse_uint(line);
        d[1] = 12;
        d[2] = 2;
        process(&mut d);
        println!("Part 1: {}", d[0]);
    });

    io::read_file("input").iter().for_each(|line| {
        let mut d = parse_uint(line);
        if let Some(res) = solve(19690720, &mut d.clone()) {
            println!("Part 2: {}", res.0 * 100 + res.1);

            d[1] = res.0;
            d[2] = res.1;
            process(&mut d);
            println!("Part 2 verify: {}", d[0]);
        } else {
            println!("Part 2: error");
        }
    });
}

fn solve(target: usize, d: &mut Vec<usize>) -> Option<(usize, usize)> {
    for n in 0..99 {
        for v in 0..99 {
           let mut d = d.clone();
           d[1] = n;
           d[2] = v;
           process(&mut d);
           if d[0] == target {
               return Some((n,v));
           }
        }
    }
    None
}

const ADD: usize = 1;
const MULTIPLY: usize = 2;
const TERMINATE: usize = 99;
const WIDTH: usize = 4;

fn parse_uint(d: &str) -> Vec<usize> {
    d.split(',').filter_map(|t| {
        t.parse::<usize>().ok()
    }).collect()
}

fn exec(c: usize, d1: usize, d2: usize) -> Option<usize> {
    match c {
        ADD => Some(d1 + d2),
        MULTIPLY => Some(d1 * d2),
        _ => None
    }
}

fn process(d: &mut Vec<usize>) {
    let mut i = 0;
    while i < d.len() {
        if d[i] == TERMINATE {
            return;
        } else if i % WIDTH == 0 {
            let c = d[i];
            let res = exec(c, d[d[i+1]], d[d[i+2]]);
            if let Some(res) = res {
                let idx = d[i+3];
                d[idx] = res;
            } else {
                panic!("add/multiply without result");
            }
            i += 4;
        } else {
            i += 1;
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
        assert_eq!(parse_uint(d), ref_d);
    }

    #[test]
    fn sample() {
        let mut ref_d = vec![1,9,10,3,2,3,11,0,99,30,40,50];
        process(&mut ref_d);
        assert_eq!(ref_d, vec![3500,9,10,70,2,3,11,0,99,30,40,50]);
        let mut ref_d = vec![1,0,0,0,99];
        process(&mut ref_d);
        assert_eq!(ref_d, vec![2,0,0,0,99]);
        let mut ref_d = vec![2,3,0,3,99];
        process(&mut ref_d);
        assert_eq!(ref_d, vec![2,3,0,6,99]);
        let mut ref_d = vec![2,4,4,5,99,0];
        process(&mut ref_d);
        assert_eq!(ref_d, vec![2,4,4,5,99,9801]);
        let mut ref_d = vec![1,1,1,4,99,5,6,0,99];
        process(&mut ref_d);
        assert_eq!(ref_d, vec![30,1,1,4,2,5,6,0,99]);
    }
}
