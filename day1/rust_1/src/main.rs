use baselib::io;

fn main() {
    let sum = get_fuel_amount(io::read_file("input"));
    println!("total amount of fuel {}", sum);
}

fn get_fuel_amount(lines: Vec<String>) -> usize {
    lines.iter().filter_map(|line| {
       parse_mass(line) 
    }).map(mass_to_fuel).sum()
}

fn parse_mass(s: &str) -> Option<usize> {
   s.parse::<usize>().ok() 
}

fn mass_to_fuel(mass: usize) -> usize {
   let mass = mass as f32;
   ((mass / 3.0).floor() - 2.0) as usize
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
        assert_eq!(get_fuel_amount(d), 34241);
    }
}
