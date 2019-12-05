use baselib::io;

fn main() {
    let lines: Vec<String> = io::read_file("../input");
    if lines.len() > 0 {
        let mut d: Vec<i32> = string_to_num_vec(&lines[0]);
        let mut o: Vec<i32> = vec![];
        run(&mut d, 1, &mut o);
        println!("outputs: {:?}", o);
        println!("Part 1: {}", d[0]);

    }
}

const ADD: i32 = 1;
const MULTIPLY: i32 = 2;
const INPUT: i32 = 3;
const OUTPUT: i32 = 4;
const TERMINATE: i32 = 99;

const POSITION_MODE: i32 = 0;
const IMMEDIATE_MODE: i32 = 1;

#[derive(Debug, PartialEq)]
struct Instruction {
    op: i32,
    p1: i32,
    p2: i32,
    p3: i32,
}

impl Instruction {
    fn new() -> Instruction {
        Instruction {op: 0, p1: 0, p2: 0, p3: 0}
    }
}

fn string_to_num_vec(s: &str) -> Vec<i32> {
    s.split(',').filter_map(|token| token.parse::<i32>().ok()).collect()
}

fn join_digits(a: i32, b: i32) -> i32 {
    let f = format!("{}{}", a.to_string(), b.to_string());
    f.parse::<i32>().unwrap_or(0)
}

fn param(p: i32) -> Instruction {
    let tokens: Vec<i32> = p.to_string().chars().rev().filter_map(|c| c.to_digit(10)).map(|d| d as i32).collect();
    let mut instruction = Instruction::new();
    match tokens.len() {
        2 => {
            instruction.op = join_digits(tokens[1], tokens[0]);
            instruction
        },
        3 => {
            instruction.op = join_digits(tokens[1], tokens[0]);
            instruction.p1 = tokens[2];
            instruction
        },
        4 => {
            instruction.op = join_digits(tokens[1], tokens[0]);
            instruction.p1 = tokens[2];
            instruction.p2 = tokens[3];
            instruction
        },
        5 => {
            instruction.op = join_digits(tokens[1], tokens[0]);
            instruction.p1 = tokens[2];
            instruction.p2 = tokens[3];
            instruction.p3 = tokens[4];
            instruction
        },
        _ => instruction
    }
}

fn run_param(d: &mut Vec<i32>, i: usize, instruction: Instruction, input: i32, output: &mut Vec<i32>) -> (usize, i32) {
    match instruction.op {
        ADD => {
            let i1 = match instruction.p1 {
                0 => {
                    d[d[i+1] as usize]
                },
                _ => {
                    d[i+1]
                }
            };
            let i2 = match instruction.p2 {
                0 => {
                    d[d[i+2] as usize]
                },
                _ => {
                    d[i+2]
                }
            };
            let idx = d[i+3] as usize;
            d[idx] = i1 + i2;

           (i + 4, d[idx])
        },
        MULTIPLY => {
            let i1 = match instruction.p1 {
                0 => {
                    d[d[i+1] as usize]
                },
                _ => {
                    d[i+1]
                }
            };
            let i2 = match instruction.p2 {
                0 => {
                    d[d[i+2] as usize]
                },
                _ => {
                    d[i+2]
                }
            };
            let idx = d[i+3] as usize;
            d[idx] = i1 * i2;

            (i + 4, d[idx])
        },
        _ => (i +1, input)
    }
}

fn run_non_param(d: &mut Vec<i32>, i: usize, input: i32, output: &mut Vec<i32>) -> (usize, i32) {
    match d[i] {
        ADD => {
           let idx = d[i+3] as usize;
           d[idx] = d[d[i+1] as usize] + d[d[i+2] as usize]; 
           (i + 4, d[idx])
        },
        MULTIPLY => {
           let idx = d[i+3] as usize;
           d[idx] = d[d[i+1] as usize] * d[d[i+2] as usize]; 
           (i + 4, d[idx])
        },
        INPUT => {
           let idx = d[i+1] as usize;
           d[idx] = input;
           (i + 2, input)
        },
        OUTPUT => {
           let idx = d[i+1] as usize;
           output.push(d[idx]);
           (i + 2, input)
        },
        _ => (i + 1, input)
    }
}

fn run(d: &mut Vec<i32>, input: i32, output: &mut Vec<i32>) {
    let mut i = 0;
    let mut input = input;
    while i < d.len() {
        match d[i] {
            x if x == 99 => {
                return;
            },
            x if x < 100 => {
                let res = run_non_param(d, i as usize, input, output);
                input = res.1;
                i = res.0;
            },
            _ => {
                let res = run_param(d, i, param(d[i]), input, output);
                input = res.1;
                i = res.0;
            },
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn sample() {
       let mut v = vec![1002,4,3,4,33];
       let mut o = vec![];
       run(&mut v, 1, &mut o);
       assert_eq!(v[4], 99);

       let mut v = vec![1,9,10,3,2,3,11,0,99,30,40,50];
       let mut o = vec![];
       run(&mut v, 1, &mut o);
       assert_eq!(v[0], 3500);
    }

    #[test]
    fn sample_input() {
       let mut v = vec![3, 0];
       let mut o = vec![];
       run(&mut v, 1, &mut o);
       assert_eq!(v[0], 1);
    }

    #[test]
    fn sample_output() {
       let mut v = vec![4, 0];
       let mut o = vec![];
       run(&mut v, 1, &mut o);
       assert_eq!(o[0], 4);
    }
}
