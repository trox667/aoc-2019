use baselib::io;

fn main() {
    println!("🎅 Happy Advent of Code, let's start 🎁...");
    let input = io::read_file("input");
    let sum = get_fuel_amount(&input);
    println!("total amount of fuel {}", sum);
    let fuel = get_total_fuel_amount(&input);
    println!("total amount of fuel with mass {}", fuel);
    println!("🎅 ...done for today 🎄");
}

// part 1
fn get_fuel_amount(lines: &Vec<String>) -> usize {
    lines.iter().filter_map(|line| {
       parse_mass(line) 
    }).map(mass_to_fuel).sum()
}

fn parse_mass(s: &str) -> Option<usize> {
   s.parse::<usize>().ok() 
}

fn mass_to_fuel(mass: usize) -> usize {
   let mass = mass as f32;
   match (mass / 3.0).floor() - 2.0 {
       fuel if fuel > 0.0 => fuel as usize,
       _ => 0
   }
}

// part 2
fn get_total_fuel_amount(lines: &Vec<String>) -> usize {
    lines.iter().filter_map(|line| {
       parse_mass(line) 
    }).map(mass_to_fuel_add_fuel).sum()
}

fn mass_to_fuel_add_fuel(mass: usize) -> usize {
    let fuel = mass_to_fuel(mass);
    if fuel > 0 {
        fuel + mass_to_fuel_add_fuel(fuel)
    } else {
        fuel
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn mass() {
        let fuel = mass_to_fuel(12);
        assert_eq!(fuel, 2);
        let fuel = mass_to_fuel(14);
        assert_eq!(fuel, 2);
        let fuel = mass_to_fuel(1969);
        assert_eq!(fuel, 654);
        let fuel = mass_to_fuel(100756);
        assert_eq!(fuel, 33583);
    }

    #[test]
    fn fuel_amount() {
        let d = vec!["12", "14", "1969", "100756"];
        let d = d.into_iter().map(String::from).collect();
        assert_eq!(get_fuel_amount(&d), 34241);
    }

    #[test]
    fn star_one() {
        let sum = get_fuel_amount(&io::read_file("input"));
        assert_eq!(sum, 3327415);
    }
    
    #[test]
    fn fuel_for_fuel_rec() {
        let fuel = mass_to_fuel_add_fuel(12);
        assert_eq!(fuel, 2);
        let fuel = mass_to_fuel_add_fuel(1969);
        assert_eq!(fuel, 966);
        let fuel = mass_to_fuel_add_fuel(100756);
        assert_eq!(fuel, 50346);
    }

    #[test]
    fn start_two() {
        let sum = get_total_fuel_amount(&io::read_file("input"));
        assert_eq!(sum, 4988257);
    }
}
