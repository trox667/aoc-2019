use baselib::io;

fn main() {
    let lines: Vec<String> = io::read_file("../input");
    if lines.len() > 0 {
        let sample = &lines[0];
        let sample = string_to_num_vec(sample);
        let mut output = vec![];
        run(0, &mut sample.clone(), &mut vec![1], &mut output);
        println!("{:?}", output);
        output.clear();
        run(0, &mut sample.clone(), &mut vec![5], &mut output);
        println!("{:?}", output);
    }
}

const ADD: i32 = 1;
const MULTIPLY: i32 = 2;
const INPUT: i32 = 3;
const OUTPUT: i32 = 4;
const JUMPTRUE: i32 = 5;
const JUMPFALSE: i32 = 6;
const LESSTHAN: i32 = 7;
const EQUALS: i32 = 8;
const TERMINATE: i32 = 99;

fn string_to_num_vec(s: &str) -> Vec<i32> {
    s.split(',')
        .filter_map(|token| token.parse::<i32>().ok())
        .collect()
}

fn is_combined(a: i32) -> bool {
    a > 100
}

fn read(pointer: i32, program: &Vec<i32>, is_position: bool) -> i32 {
    if pointer >= program.len() as i32 {
        return 0;
    }
    let position = program[pointer as usize];
    if is_position {
        return read(position, program, false);
    } else {
        return position;
    }
}

fn write(pointer: i32, program: &mut Vec<i32>, value: i32) {
    if pointer >= program.len() as i32 {
        return;
    } else {
        program[pointer as usize] = value;
    }
}

fn get_value(s: &str, start: usize, count: usize) -> i32 {
    s.chars()
        .skip(start)
        .take(count)
        .collect::<String>()
        .parse::<i32>()
        .unwrap_or(0)
}

fn combined(instruction: i32) -> (i32, i32, i32, i32) {
    let i = instruction.to_string();
    match i.len() as i32 {
        5 => {
            let p3 = get_value(&i, 0, 1);
            let p2 = get_value(&i, 1, 1);
            let p1 = get_value(&i, 2, 1);
            let o1 = get_value(&i, 3, 2);
            (o1, p1, p2, p3)
        }
        4 => {
            let p2 = get_value(&i, 0, 1);
            let p1 = get_value(&i, 1, 1);
            let o1 = get_value(&i, 2, 2);
            (o1, p1, p2, 0)
        }
        3 => {
            let p1 = get_value(&i, 0, 1);
            let o1 = get_value(&i, 1, 2);
            (o1, p1, 0, 0)
        }
        2 => {
            let o1 = get_value(&i, 0, 2);
            (o1, 0, 0, 0)
        }
        _ => (0, 0, 0, 0),
    }
}

fn instruction(pointer: i32, program: &Vec<i32>) -> (i32, i32, i32, i32) {
    let val = read(pointer, program, false);
    if is_combined(val) {
        let (o, p1, p2, p3) = combined(val);
        (
            o,
            read(pointer + 1, program, if o == 3 {false} else {p1 == 0}),
            read(pointer + 2, program, p2 == 0),
            read(pointer + 3, program, false),
        )
    } else {
        (
            val,
            read(pointer + 1, program, if val == 3 {false} else {true}),
            read(pointer + 2, program, true),
            read(pointer + 3, program, false),
        )
    }
}

fn run (mut pointer: i32, program: &mut Vec<i32>, input: &mut Vec<i32>, output: &mut Vec<i32>) {
    let mut halt = false;
    while !halt && pointer < program.len() as i32 {
        let (op, p1, p2, p3) = instruction(pointer, program);
        match op {
            1 => {
                write(p3, program, p1+p2);
                pointer = pointer+4;
            },
            2 => {
                write(p3, program, p1*p2);
                pointer = pointer+4;
            },
            3 => {
                if input.len() > 0 {
                    let i: Vec<i32> = input.drain(..1).collect();
                    write(p1, program, i[0]);
                }
                pointer = pointer+2;
            },
            4 => {
                output.push(p1);
                pointer = pointer+2;
            },
            5 => {
                if p1 != 0 {
                    pointer = p2;
                } else {
                    pointer = pointer+3;
                }
            },
            6 => {
                if p1 == 0 {
                    pointer = p2;
                } else {
                    pointer = pointer+3;
                }
            },
            7 => {
                if p1 < p2 {
                    write(p3, program, 1);
                } else {
                    write(p3, program, 0);
                }
                pointer = pointer+4;
            },
            8 => {
                if p1 == p2 {
                    write(p3, program, 1);
                } else {
                    write(p3, program, 0);
                }
                pointer = pointer+4;
            },
            99 => {
                halt = true;
            },
            _ => {
                pointer = pointer+1;
            },
        }
    }
}

#[cfg(test)]
mod test {
    use super::*;
}
