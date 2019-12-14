use baselib::io;
use std::collections::HashMap;

fn main() {
    let lines = io::read_file("../input");
    println!("🎅 Happy Advent of Code, let's start 🎁...");
    println!("Part 1: {}", part1(&lines));
    println!("Part 2: {}", part2(&lines));
    println!("🎅 ...done for today 🎄");
}

#[derive(Debug, Clone)]
struct Chemical {
    count: i64,
    name: String,
}
type InputList = Vec<Chemical>;


#[derive(Debug, Clone)]
struct Reaction {
    output: Chemical,
    inputs: InputList
}
type Reactions = Vec<Reaction>;
type ReactionMap = HashMap<String, (i64, InputList)>;
type Storage = HashMap<String, i64>;

fn read_reaction(line: &str) -> Reaction {
    let tokens: Vec<&str> = line.split("=>").map(|s| {s.trim()}).collect();
    let output: Vec<&str> = tokens[1].split(" ").collect();    
    let chemical = Chemical {count: output[0].parse::<i64>().unwrap_or(0), name: output[1].to_string()};

    let inputs: InputList = tokens[0].split(", ").map(|s| {
        let input: Vec<&str> = s.split(" ").collect();
        return Chemical {count: input[0].parse::<i64>().unwrap_or(0), name: input[1].to_string()};
    }).collect();
    Reaction {output: chemical, inputs: inputs}
}

fn create_reaction_map(reactions: &Reactions) -> ReactionMap {
    let mut map = ReactionMap::new();
    reactions.iter().for_each(|r| {
        map.insert(r.output.name.clone(), (r.output.count, r.inputs.clone()));
    });
    map
}

fn get_ore_count(reactions: &ReactionMap, storage: &mut Storage, name: &str, count: i64) -> i64 {
    let (output_count, inputs) = reactions.get(name).unwrap();
    let in_storage = storage.entry(name.to_string()).or_insert(0);
    let required = 0.max(count - *in_storage);
    let total_produced = required / output_count + if required % output_count != 0 { 1 } else { 0 };
    let add_produced = total_produced * output_count - count;
    *in_storage += add_produced;
    inputs.iter().map(|input| {
        let iname = input.name.clone();
        let icount = input.count;
        if iname == "ORE" {
            icount * total_produced
        } else {
            get_ore_count(reactions, storage, &iname, icount * total_produced)
        }
    }).sum()
}

fn part1(lines: &Vec<String>) -> i64 {
    let reactions: Reactions = lines.iter().map(|s| {
        read_reaction(&s) 
    }).collect();
    let reactions = create_reaction_map(&reactions);
    get_ore_count(&reactions, &mut Storage::new(), "FUEL", 1)
}

fn part2(lines: &Vec<String>) -> i64 {
    let reactions: Reactions = lines.iter().map(|s| {
        read_reaction(&s) 
    }).collect();
    let reactions = create_reaction_map(&reactions);
    
    let trillion: i64 = 1000000000000;
    let mut start = trillion / get_ore_count(&reactions, &mut Storage::new(), "FUEL", 1);
    let mut end = start * 2;
    let mut fuel = -1;
    while start <= end {
        fuel = (start + end) / 2;
        let ore = get_ore_count(&reactions, &mut Storage::new(), "FUEL", fuel);
        if ore > trillion {
            end = fuel - 1;
        } else {
            start = fuel + 1;
        }
    }
    fuel
}


#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn sample1() {
        let lines = vec![
            "10 ORE => 10 A".to_string(),
            "1 ORE => 1 B".to_string(),
            "7 A, 1 B => 1 C".to_string(),
            "7 A, 1 C => 1 D".to_string(),
            "7 A, 1 D => 1 E".to_string(),
            "7 A, 1 E => 1 FUEL".to_string(),
        ];
        assert_eq!(part1(&lines), 31);
    }
}
