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

std::vector<string> split(string s, string sep) {
  stringstream ss(s);
  
}

typedef int64_t i64;
struct Chemical
{
  i64 count;
  string name;
};
typedef vector<Chemical> InputList;
struct Reaction
{
  Chemical output;
  InputList inputs;
}

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

Reaction parse_reaction(const string& line) {
  line.
}

int part1(const std::vector<string>& lines) {
}

int part2(const std::vector<string>& lines) {
}

}

int main(int argc, char* argv[]) {
  auto lines = read_file("../input");
  cout << "Part 1: " << part1(lines) << endl;
  cout << "Part 2: " << part2(lines) << endl;
}
