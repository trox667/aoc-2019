#include <iostream>
#include <initializer_list>
#include <vector>
#include <string>
#include <fstream>
#include <algorithm>
#include <cstdlib>

#include <fplus/fplus.hpp>
using namespace fplus;
using namespace std;

std::vector<string> read_file(const string& filename) {
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

int fuel(const int& mass) {
  return max(mass / 3 - 2, 0);
}

int fuel_mass(const int& mass) {
  auto f= fuel(mass);
  return f> 0 ? f+ fuel_mass(f) : f;
}

int part1(const std::vector<string>& lines) {
  return fwd::apply(
      lines,
      fwd::transform([](const auto& line) {
        return fuel(atoi(line.data()));
      }),
      fwd::sum()
  );
}

int part1a(const std::vector<string>& lines) {
  return 
    fwd::compose(
      fwd::transform([](const auto& str) {return str.data();}),
      fwd::transform(atoi),
      fwd::transform(fuel),
      fwd::sum()
    )
    (lines);
}

int part2(const std::vector<string>& lines) {
  return fwd::apply(
      lines,
      fwd::transform([](const auto& str) {return str.data();}),
      fwd::transform(atoi),
      fwd::transform(fuel_mass),
      fwd::sum()
  );
}

int part2a(const std::vector<string>& lines) {
  return 
    fwd::compose(
      fwd::transform([](const auto& str) {return str.data();}),
      fwd::transform(atoi),
      fwd::transform(fuel_mass),
      fwd::sum()
    )
    (lines);
}

int main(int argc, char* argv[]) {
  auto lines = read_file("../input");
  cout << "Part 1: " << part1(lines) << endl;
  cout << "Part 1a: " << part1a(lines) << endl;
  cout << "Part 2: " << part2(lines) << endl;
  cout << "Part 2a: " << part2a(lines) << endl;
}
