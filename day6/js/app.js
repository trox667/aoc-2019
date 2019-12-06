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

const read_line = (space, parent_map, line) => {
  const tokens = line.split(')');
  if (tokens.length >= 2) {
    const list = space[tokens[0]] || [];
    list.push(tokens[1]);
    space[tokens[0]] = list;

    parent_map[tokens[1]] = tokens[0];
  }
};

const get_parents = (parent_map, planet, parents) => {
  const parent = parent_map[planet];
  if(!parent) return;

  parents.add(parent);
  get_parents(parent_map, parent, parents);
};

const get_common_parent = (set_a, set_b) => {
  let result = [...set_a].filter(a => set_b.has(a))
  return result.length > 0 ? result[0] : null;
};

const count_distance_to = (set, planet) => {
  let found = false;
  let count = 0;
  [...set].forEach(p => {
    if(p.localeCompare(planet) == 0) {
      found = true;
    } 
    if(!found) {
      count++;
    }
  });

  return count;
}

const count = (space, planet, counts, parent) => {
  const orbit = space[planet];
  if (!orbit) return;

  parent = planet;
  orbit.forEach(planet => {
    let curr_count = counts[parent] || 0;
    counts[planet] = ++curr_count;
    count(space, planet, counts, parent);
  });
};

const sum = counts => {
  let keys = Object.keys(counts);
  return keys.reduce((acc, key) => {
    acc += counts[key];
    return acc;
  }, 0);
};

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
  let parent_map = {};
  let counts = {};
  lines.forEach(line => read_line(space, parent_map, line));
  count(space, 'COM', counts, '');
  const result = sum(counts);
  if (result == 42) return true;
  return false;
};

const test2 = () => {
  const lines = [
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
  let space = {};
  let parent_map = {};
  lines.forEach(line => read_line(space, parent_map, line));
  let parents_a = new Set();
  let parents_b = new Set();

  get_parents(parent_map, "YOU", parents_a);
  get_parents(parent_map, "SAN", parents_b);
  let common_parent = get_common_parent(parents_a, parents_b);

  let count_a =count_distance_to(parents_a, common_parent); 
  let count_b =count_distance_to(parents_b, common_parent); 
  let result = count_a + count_b;

  if (result == 4) return true;
  return false;
};

const main = lines => {
  if (!test()) return;
  if (!test2()) return;
  let space = {};
  let parent_map = {};
  let counts = {};
  lines.forEach(line => read_line(space, parent_map, line));
  count(space, 'COM', counts, '');
  const result = sum(counts);
  console.log(`Part 1: ${result}`);

  let parents_a = new Set();
  let parents_b = new Set();

  get_parents(parent_map, "YOU", parents_a);
  get_parents(parent_map, "SAN", parents_b);
  let common_parent = get_common_parent(parents_a, parents_b);

  let count_a =count_distance_to(parents_a, common_parent); 
  let count_b =count_distance_to(parents_b, common_parent); 

  console.log(`Part 2: ${count_a + count_b}`);
};
