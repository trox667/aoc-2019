const fs = require('fs');
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream('../input'),
});
let lines = [];
readInterface.on('line', line => lines.push(line.trim()));

readInterface.on('close', () => {
  main(lines);
});

const read_line = (space, line) => {
  const tokens = line.split(')');
  if (tokens.length >= 2) {
    const list = space[tokens[0]] || [];
    list.push(tokens[1]);
    space[tokens[0]] = list;
  }
};

const count = (space, planet, counts, parent) => {
  const orbit = space[planet];
  if(!orbit) {
    return;
  }
  parent = planet;
  orbit.forEach(planet => {
    let curr_count = counts[parent] || 0;
    counts[planet] = ++curr_count;
    count(space, planet, counts, parent);
  })
}

const sum = (counts) => {
  let keys = Object.keys(counts);
  return keys.reduce((acc, key) => {
    acc += counts[key];
    return acc;
  }, 0);
}

const test = () => {
  const lines = [
    'COM)B',
    'B)C',
    'C)D',
    'D)E',
    'E)F',
    'B)G',
    'G)H',
    'D)I',
    'E)J',
    'J)K',
    'K)L',
  ];
  let space = {};
  let counts = {};
  lines.forEach(line => read_line(space, line));
  count(space, "COM", counts, "");
  const result = sum(counts);
  if(result == 42) return true;
  return false;
};

const main = lines => {
  if(!test()) return;
  let space = {};
  let counts = {};
  lines.forEach(line => read_line(space, line));
  count(space, "COM", counts, "");
  const result = sum(counts);
  console.log(`Part 1: ${result}`);
};
