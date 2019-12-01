#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <algorithm>
#include <numeric>

std::vector<std::string> read_file(std::string filename) {
  std::string line;
  std::vector<std::string> lines;
  std::ifstream input_file(filename);
  if(input_file.is_open()) {
    while (getline(input_file, line)) {
      lines.push_back(line);
    }
    input_file.close();
  }
  return lines;
}

int mass_to_fuel(int mass) {
  auto fuel = mass / 3 - 2;
  return fuel > 0 ? fuel : 0;
}

int mass_to_fuel_add_fuel(int mass) {
  auto fuel = mass_to_fuel(mass);
  return fuel > 0 ? fuel + mass_to_fuel_add_fuel(fuel) : fuel;
}

int main(int argc, char* argv[]) {
  std::cout << "Hello Advent of Code!!" << std::endl;
  auto lines = read_file("input");
  std::vector<int> fuel;
  std::transform(lines.cbegin(), lines.cend(), std::back_inserter(fuel), [](const std::string& line) -> int {
    auto mass = std::stoi(line);
    return mass_to_fuel(mass);
  });

  int sum1 = std::accumulate(fuel.begin(), fuel.end(), 0);
  std::cout << "Part 1: " << sum1 << std::endl;
  
  std::vector<int> total_fuel;
  std::transform(lines.cbegin(), lines.cend(), std::back_inserter(total_fuel), [](const std::string& line) -> int {
    auto mass = std::stoi(line);
    return mass_to_fuel_add_fuel(mass);
  });

  int sum2 = std::accumulate(total_fuel.begin(), total_fuel.end(), 0);
  std::cout << "Part 2: " << sum2 << std::endl;
  return 0;
}
