extern crate permutohedron;

use baselib::computer::Computer;
use baselib::io;
use permutohedron::LexicalPermutation;

fn main() {
    let lines: Vec<String> = io::read_file("../input");
    if lines.len() <= 0 {
        return;
    }
    let instructions = string_to_num_vec(&lines[0]);
    println!("🎅 Happy Advent of Code, let's start 🎁...");
    println!("Part 1: {}", part1(&instructions));
    println!("Part 2: {}", part2(&instructions));
    println!("🎅 ...done for today 🎄");
}

fn amplifier(instructions: &Vec<i32>, inputs: &Vec<i32>) -> i32 {
    let mut a1 = Computer::new();
    a1.compile(&instructions);
    a1.run(inputs);
    match a1.get_outputs().last() {
        Some(o1) => *o1,
        None => 0,
    }
}

fn amplifiers(instructions: &Vec<i32>, phases: (i32, i32, i32, i32, i32)) -> i32 {
    let o1 = amplifier(instructions, &vec![phases.0, 0]);
    let o2 = amplifier(instructions, &vec![phases.1, o1]);
    let o3 = amplifier(instructions, &vec![phases.2, o2]);
    let o4 = amplifier(instructions, &vec![phases.3, o3]);
    amplifier(instructions, &vec![phases.4, o4])
}

fn part1(instructions: &Vec<i32>) -> i32 {
    let mut phase_range = vec![0, 1, 2, 3, 4];
    let mut permutations = vec![];
    loop {
        permutations.push(phase_range.clone());
        if !phase_range.next_permutation() {
            break;
        }
    }
    let mut signal = 0;
    permutations.iter().for_each(|p| {
        let o = amplifiers(instructions, (p[0], p[1], p[2], p[3], p[4]));
        signal = signal.max(o);
    });
    signal
}

// PART 2
fn create_amplifier(instructions: &Vec<i32>, inputs: &Vec<i32>) -> Computer {
    let mut a = Computer::new();
    a.compile(&instructions);
    a.add_inputs(inputs);
    a
}

fn amplifier_loop(instructions: &Vec<i32>, phases: (i32, i32, i32, i32, i32)) -> i32 {
    let mut a1 = create_amplifier(instructions, &vec![phases.0]);
    let mut a2 = create_amplifier(instructions, &vec![phases.1]);
    let mut a3 = create_amplifier(instructions, &vec![phases.2]);
    let mut a4 = create_amplifier(instructions, &vec![phases.3]);
    let mut a5 = create_amplifier(instructions, &vec![phases.4]);
    let mut o5 = 0;
    loop {
        let r1 = a1.run(&vec![o5]);
        let o1 = match a1.get_outputs().last() {
            Some(o1) => *o1,
            None => 0,
        };
        let r2 = a2.run(&vec![o1]);
        let o2 = match a2.get_outputs().last() {
            Some(o2) => *o2,
            None => 0,
        };
        let r3 = a3.run(&vec![o2]);
        let o3 = match a3.get_outputs().last() {
            Some(o3) => *o3,
            None => 0,
        };
        let r4 = a4.run(&vec![o3]);
        let o4 = match a4.get_outputs().last() {
            Some(o4) => *o4,
            None => 0,
        };
        let r5 = a5.run(&vec![o4]);
        o5 = match a5.get_outputs().last() {
            Some(o5) => *o5,
            None => 0,
        };

        if r5 == -99 {
            return o5;
        }
    }
}

fn part2(instructions: &Vec<i32>) -> i32 {
    let mut phase_range = vec![5, 6, 7, 8, 9];
    let mut permutations = vec![];
    loop {
        permutations.push(phase_range.clone());
        if !phase_range.next_permutation() {
            break;
        }
    }
    let mut signal = 0;
    permutations.iter().for_each(|p| {
        let o = amplifier_loop(instructions, (p[0], p[1], p[2], p[3], p[4]));
        signal = signal.max(o);
    });
    signal
}

fn string_to_num_vec(s: &str) -> Vec<i32> {
    s.split(',')
        .filter_map(|token| token.parse::<i32>().ok())
        .collect()
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn sample1_part1() {
        let data = vec![
            3, 15, 3, 16, 1002, 16, 10, 16, 1, 16, 15, 15, 4, 15, 99, 0, 0,
        ];
        let phases = (4, 3, 2, 1, 0);
        let max_thruster = amplifiers(&data, phases);
        assert_eq!(max_thruster, 43210);
    }

    #[test]
    fn sample2_part1() {
        let data = vec![
            3, 23, 3, 24, 1002, 24, 10, 24, 1002, 23, -1, 23, 101, 5, 23, 23, 1, 24, 23, 23, 4, 23,
            99, 0, 0,
        ];
        let phases = (0, 1, 2, 3, 4);
        let max_thruster = amplifiers(&data, phases);
        assert_eq!(max_thruster, 54321);
    }

    #[test]
    fn sample3_part1() {
        let data = vec![
            3, 31, 3, 32, 1002, 32, 10, 32, 1001, 31, -2, 31, 1007, 31, 0, 33, 1002, 33, 7, 33, 1,
            33, 31, 31, 1, 32, 31, 31, 4, 31, 99, 0, 0, 0,
        ];
        let phases = (1, 0, 4, 3, 2);
        let max_thruster = amplifiers(&data, phases);
        assert_eq!(max_thruster, 65210);
    }

    #[test]
    fn sample1_part2() {
        let data = vec![
            3, 26, 1001, 26, -4, 26, 3, 27, 1002, 27, 2, 27, 1, 27, 26, 27, 4, 27, 1001, 28, -1,
            28, 1005, 28, 6, 99, 0, 0, 5,
        ];
        let phases = (9, 8, 7, 6, 5);
        let max_thruster = amplifier_loop(&data, phases);
        assert_eq!(max_thruster, 139629729);
    }
}
