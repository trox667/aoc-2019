extern crate chrono;

pub mod io {
    use chrono::NaiveDateTime;
    use std::fs::File;
    use std::io::prelude::*;
    use std::io::BufReader;

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

pub mod computer {
    const ADD: i32 = 1;
    const MULTIPLY: i32 = 2;
    const INPUT: i32 = 3;
    const OUTPUT: i32 = 4;
    const JUMPTRUE: i32 = 5;
    const JUMPFALSE: i32 = 6;
    const LESSTHAN: i32 = 7;
    const EQUALS: i32 = 8;
    const TERMINATE: i32 = 99;
    const HALT: i32 = -1;
    const TERMINATED: i32 = -99;

    fn is_combined(a: i32) -> bool {
        a > 100
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

    pub struct Computer {
        pointer: i32,
        program: Vec<i32>,
        inputs: Vec<i32>,
        outputs: Vec<i32>,
    }

    impl Computer {
        pub fn new() -> Computer {
            Computer {
                pointer: 0,
                program: vec![],
                inputs: vec![],
                outputs: vec![],
            }
        }
        pub fn compile(&mut self, program: &Vec<i32>) {
            self.program = program.clone();
        }

        pub fn add_inputs(&mut self, inputs: &Vec<i32>) {
            self.inputs.append(inputs.clone().as_mut());
        }

        pub fn get_outputs(&self) -> Vec<i32> {
            return self.outputs.clone();
        }

        fn read(&self, pointer: i32, is_position: bool) -> i32 {
            if pointer >= self.program.len() as i32 {
                return 0;
            }
            let position = self.program[pointer as usize];
            if is_position {
                return self.read(position, false);
            } else {
                return position;
            }
        }

        fn write(&mut self, pointer: i32, value: i32) {
            if pointer >= self.program.len() as i32 {
                return;
            } else {
                self.program[pointer as usize] = value;
            }
        }
        fn instruction(&self, pointer: i32) -> (i32, i32, i32, i32) {
            let val = self.read(pointer, false);
            if is_combined(val) {
                let (o, p1, p2, p3) = combined(val);
                (
                    o,
                    self.read(pointer + 1, if o == 3 { false } else { p1 == 0 }),
                    self.read(pointer + 2, p2 == 0),
                    self.read(pointer + 3, false),
                )
            } else {
                (
                    val,
                    self.read(pointer + 1, if val == 3 { false } else { true }),
                    self.read(pointer + 2, true),
                    self.read(pointer + 3, false),
                )
            }
        }

        #[allow(dead_code)]
        pub fn run(
            &mut self,
            inputs: &Vec<i32>,
        ) -> i32 {
            self.inputs.append(inputs.clone().as_mut());
            let mut halt = false;
            let mut res = 0;
            while !halt && self.pointer < self.program.len() as i32 {
                let (op, p1, p2, p3) = self.instruction(self.pointer);
                match op {
                    ADD => {
                        self.write(p3, p1 + p2);
                        self.pointer = self.pointer + 4;
                    }
                    MULTIPLY => {
                        self.write(p3, p1 * p2);
                        self.pointer = self.pointer + 4;
                    }
                    INPUT => {
                        if self.inputs.len() > 0 {
                            let i: Vec<i32> = self.inputs.drain(..1).collect();
                            self.write(p1, i[0]);
                            self.pointer = self.pointer + 2;
                        } else {
                            halt = true;
                            res = HALT;
                        }
                    }
                    OUTPUT => {
                        self.outputs.push(p1);
                        self.pointer = self.pointer + 2;
                    }
                    JUMPTRUE => {
                        if p1 != 0 {
                            self.pointer = p2;
                        } else {
                            self.pointer = self.pointer + 3;
                        }
                    }
                    JUMPFALSE => {
                        if p1 == 0 {
                            self.pointer = p2;
                        } else {
                            self.pointer = self.pointer + 3;
                        }
                    }
                    LESSTHAN => {
                        if p1 < p2 {
                            self.write(p3, 1);
                        } else {
                            self.write(p3, 0);
                        }
                        self.pointer = self.pointer + 4;
                    }
                    EQUALS => {
                        if p1 == p2 {
                            self.write(p3, 1);
                        } else {
                            self.write(p3, 0);
                        }
                        self.pointer = self.pointer + 4;
                    }
                    TERMINATE => {
                        res = TERMINATED;
                        halt = true;
                    }
                    _ => {
                        self.pointer = self.pointer + 1;
                    }
                }
            }
            res
        }
    }
}
