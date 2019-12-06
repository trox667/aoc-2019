use baselib::io;
use std::collections::HashMap;

type SpaceMap = HashMap<String, String>;

fn read_line(space: &mut SpaceMap, line: &str) {
    let tokens: Vec<&str> = line.split(")").collect();
    if tokens.len() >= 2 {
        space.insert(String::from(tokens[1]), String::from(tokens[0]));
    }
}

fn get_parents(space: &SpaceMap, planet: &str, parents: &mut Vec<String>) {
    if let Some(parent) = space.get(planet) {
        parents.push(parent.clone());    
        get_parents(space, parent, parents);
    }
}

fn count(space: &SpaceMap) -> usize {
    let mut count = 0;
    space.iter().for_each(|(k,v)| {
        let mut parents: Vec<String> = vec![];
        get_parents(space, k, &mut parents);
        count += parents.len();
    });
    count
}

fn get_common_parent(planets_a: &Vec<String>, planets_b: &Vec<String>) -> String {
    let common_parents: Vec<&String> = planets_a.into_iter().filter(|a| {
        planets_b.contains(a)
    }).collect();
    common_parents[0].clone()
}

fn count_distance_to(planets: &Vec<String>, planet: &str) -> usize {
    let res: (bool, usize) = planets.iter().fold((false, 0), |acc, x| {
        if planet.eq(x) {
            (true, acc.1)
        } else if !acc.0 {
            (acc.0, acc.1 + 1)
        } else {
            acc
        }
    });
    res.1
}

fn main() {
    let lines = io::read_file("../input");
    let mut space = SpaceMap::new();
    lines.iter().for_each(|l| {
        read_line(&mut space, l); 
    });
    let c = count(&space); 
    println!("Part 1: {}", c);

    let mut parents_a: Vec<String> = vec![];
    let mut parents_b: Vec<String> = vec![];
    get_parents(&space, "YOU", &mut parents_a);
    get_parents(&space, "SAN", &mut parents_b);
    let common_parent = get_common_parent(&parents_a, &parents_b);
    let count_a = count_distance_to(&parents_a, &common_parent);
    let count_b = count_distance_to(&parents_b, &common_parent);
    println!("Part 2: {}", count_a + count_b);
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn sample() {
        let d = vec![
            "COM)B",
            "B)C",
            "C)D",
            "D)E",
            "E)F",
            "B)G",
            "G)H",
            "D)I",
            "E)J",
            "J)K",
            "K)L",
        ];
        let mut space = SpaceMap::new();
        d.iter().for_each(|l| {
            read_line(&mut space, l); 
        });
        let c = count(&space); 
        assert_eq!(c, 42);
    }

    #[test]
    fn sample2() {
        let d = vec![
            "COM)B",
            "B)C",
            "C)D",
            "D)E",
            "E)F",
            "B)G",
            "G)H",
            "D)I",
            "E)J",
            "J)K",
            "K)L",
            "K)YOU",
            "I)SAN",
        ];
        let mut space = SpaceMap::new();
        d.iter().for_each(|l| {
            read_line(&mut space, l); 
        });
        let mut parents_a: Vec<String> = vec![];
        let mut parents_b: Vec<String> = vec![];
        get_parents(&space, "YOU", &mut parents_a);
        get_parents(&space, "SAN", &mut parents_b);
        let common_parent = get_common_parent(&parents_a, &parents_b);
        let count_a = count_distance_to(&parents_a, &common_parent);
        let count_b = count_distance_to(&parents_b, &common_parent);
        assert_eq!(count_a + count_b, 4);
    }
}
