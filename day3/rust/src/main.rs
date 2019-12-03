use baselib::io;
use std::collections::{HashMap, HashSet};

fn main() {
    let lines = io::read_file("../input");
    let wire_a = get_moves(&lines[0]);
    let wire_b = get_moves(&lines[1]);
    let moves_a = calc_move(wire_a);
    let moves_b = calc_move(wire_b);
    let mut set: Vec<(i32, i32, i32)> = moves_a.0.intersection(&moves_b.0).map(|s| {
        (manhattan(0, s.0, 0, s.1), s.0, s.1)
    }).collect();
    set.sort_by(|a, b| {
        a.0.partial_cmp(&b.0).unwrap()
    });
    println!("Part 1: {:?}", set[0]);

    let mut res = std::i32::MAX;
    set.iter().for_each(|s| {
        let key = &(s.1, s.2); 
        if let Some(a) = moves_a.1.get(key) {
            if let Some(b) = moves_b.1.get(key) {
                res = (a + b).min(res);
            }
        }
    });

    println!("Part 2: {}", res);
}

fn get_moves(s: &str) -> Vec<(char, i32)> {
    s.split(",").map(|s| {
        if let Some(c) = s.chars().next() {
            if let Some(count) = s[1..].parse::<i32>().ok() {
                (c, count)
            } else {
                (c, 0)
            }
        } else {
            ('_', 0)
        }
    }).collect::<Vec<(char, i32)>>()
}

fn calc_move(moves: Vec<(char, i32)>) -> (HashSet<(i32, i32)>, HashMap<(i32, i32), i32>) {
    let mut x = 0;
    let mut y = 0;
    let mut res = HashSet::new();
    let mut count = 0;
    let mut counts = HashMap::new();
    moves.iter().for_each(|m| {
        match m.0 {
            'U' => for _ in 0..m.1 {
                y += 1;
                res.insert((x, y));
                count += 1;
                counts.insert((x,y), count);
            },
            'D' => for _ in 0..m.1 {
                y -= 1;
                res.insert((x, y));
                count += 1;
                counts.insert((x,y), count);
            },
            'L' => for _ in 0..m.1 {
                x -= 1;
                res.insert((x,y));
                count += 1;
                counts.insert((x,y), count);
            },
            'R' => for _ in 0..m.1 {
                x += 1;
                res.insert((x, y));
                count += 1;
                counts.insert((x,y), count);
            },
            _ => {
            }
        }
    });

    (res, counts)
}


fn manhattan(x1: i32, x2: i32, y1: i32, y2: i32) -> i32 {
    (x1 - x2).abs() + (y1 - y2).abs()
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn sample() {
        let wire_a = get_moves("R8,U5,L5,D3");
        let wire_b = get_moves("U7,R6,D4,L4");
        let moves_a = calc_move(wire_a);
        let moves_b = calc_move(wire_b);
        let mut set: Vec<(i32, i32, i32)> = moves_a.0.intersection(&moves_b.0).map(|s| {
            (manhattan(0, s.0, 0, s.1), s.0, s.1)
        }).collect();
        set.sort_by(|a, b| {
            a.0.partial_cmp(&b.0).unwrap()
        });
        assert_eq!(set[0].0, 6); 

        let mut res = std::i32::MAX;
        set.iter().for_each(|s| {
            let key = &(s.1, s.2); 
            if let Some(a) = moves_a.1.get(key) {
                if let Some(b) = moves_b.1.get(key) {
                    res = (a + b).min(res);
                }
            }
        });

        assert_eq!(res, 30);
    }

}
