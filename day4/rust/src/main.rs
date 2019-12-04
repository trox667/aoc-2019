use baselib::io;
use std::collections::HashMap;

const INPUT: &str = "168630-718098";

fn main() {
    let input = input(INPUT);
    let res = make_list(input.0, input.1);
    println!("Part 1: {}", res);
    let res = make_list2(input.0, input.1);
    println!("Part 2: {}", res);
}

fn make_list(start: usize, end: usize) -> usize {
    let mut list = Vec::new(); 
    for i in start..=end {
        list.push(i);
    }

    let mut prev = 0;
    let res: Vec<&usize> = list.iter().filter(|s| {
        let dec = !decrease(**s);
        let eq = two_digits_equal(**s);
        let res = dec && eq;
        prev = **s;
        res
    }).collect();


    res.len()
}

fn make_list2(start: usize, end: usize) -> usize {
    let mut list = Vec::new(); 
    for i in start..=end {
        list.push(i);
    }

    let mut prev = 0;
    let res: Vec<&usize> = list.iter().filter(|s| {
        let dec = !decrease(**s);
        let eq = only_two_digits_equal(**s);
        let res = dec && eq;
        prev = **s;
        res
    }).collect();


    res.len()
}

fn decrease(val: usize) -> bool {
    let chars: Vec<char> = val.to_string().chars().collect();
    for i in 0..chars.len() {
        if i < chars.len()-1 && chars[i+1] < chars[i] {
            return true;
        }
    }
    false
}

fn two_digits_equal(val: usize) -> bool {
    let val_s = val.to_string();
    let chars: Vec<char> = val_s.chars().collect();
    for i in 1..chars.len() {
       if chars[i-1] == chars[i] || i < chars.len()-1 && chars[i] == chars[i+1] {
           return true;
       }
    }

    false
}

fn only_two_digits_equal(val: usize) -> bool {
    let val_s = val.to_string();
    let chars: Vec<char> = val_s.chars().collect();
    let mut res: Vec<Vec<char>> = vec![];
    let mut j = 0;
    while j < chars.len() {
        let mut v: Vec<char> = vec![chars[j]];
        for i in (j+1)..chars.len() {
            if chars[j] == chars[i] {
                v.push(chars[i])
            } else {
                break;
            }
        }
        j += v.len();
        res.push(v);
    }
    let mut has_pair = false;
    res.iter().for_each(|v| {
        if v.len() == 2 {
            has_pair = true;
        }
    });
    return has_pair;
}

fn input(s: &str) -> (usize, usize) {
    let d: Vec<usize> = s.split("-").filter_map(|t| {
        t.parse::<usize>().ok()
    }).collect();
    (d[0], d[1])
}



#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn decrease() {
        let s1 = 10;
        let s2 = 11;

        assert_eq!(super::decrease(s1), true);
        assert_eq!(super::decrease(s2), false);
    }

    #[test]
    fn equal() {
        assert_eq!(two_digits_equal(11), true);
        assert_eq!(two_digits_equal(22), true);
        assert_eq!(two_digits_equal(23), false);
        assert_eq!(two_digits_equal(122345), true);
    }

    #[test]
    fn sample() {
        let s = 111111;
        let e = 111113;
        assert_eq!(make_list(s, e), 3);
    }

    #[test]
    fn sample2() {
        assert_eq!(only_two_digits_equal(112233), true);
        assert_eq!(only_two_digits_equal(123444), false);
        assert_eq!(only_two_digits_equal(111122), true);
    }
}
