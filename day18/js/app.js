const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("../input")
});

let lines = [];

readInterface.on("line", line => lines.push(line.trim()));

readInterface.on("close", () => {
  main(lines);
});

// ----------------------------------------------------------------------------
// SEARCH
// ----------------------------------------------------------------------------

const NORTH = 1;
const SOUTH = 2;
const WEST = 3;
const EAST = 4;

const dir = dir => {
  switch (dir) {
    case 1:
      return [0, 1];
    case 2:
      return [0, -1];
    case 3:
      return [-1, 0];
    case 4:
      return [1, 0];
  }
};
const WALL = '#';
const MOVED = '.';

const addToSet = (visited, [x, y]) => {
  visited.add(`${x},${y}`);
  return visited;
};

// DFS search of items in the map starting at 
// a given position
const search = (map, startPosition, target) => {
  let found = false;
  let result = [];

  let visited = new Set();
  let stack = [];
  let [currX, currY] = startPosition;
  stack.push([currX, currY, 0, []]);

  while (!found) {
    let curr = stack.shift();
    let [cx, cy, cs, foundItems] = curr;
    if (!visited.has(`${cx},${cy}`)) {
      visited = addToSet(visited, [cx, cy]);
      cs = cs + 1;
      for (let d = NORTH; d <= EAST; d++) {
        const [dx, dy] = dir(d);
        const x = cx + dx;
        const y = cy + dy;
        const v = map[y][x];
        if (v === target) {
          result.push([x, y, cs, [...foundItems]]);
          found = true;
        } else if (v === WALL) {
          visited = addToSet(visited, [x, y]);
        } else if (v === MOVED) {
          stack.push([x, y, cs, [...foundItems]]);
        } else {
          const addedItems = [...foundItems];
          addedItems.push(v);
          stack.push([x, y, cs, addedItems]);
        }
      }
    }
  }
  return result;
}

// ----------------------------------------------------------------------------
// HELPER
// ----------------------------------------------------------------------------
const isLowerCase = a => a === a.toLowerCase();
const isUpperCase = a => !isLowerCase(a);

const linesToMap = lines => lines.map(line => line.split(""));

// ----------------------------------------------------------------------------
// PART 1
// ----------------------------------------------------------------------------
const getKey = a => a.toLowerCase();
const getDoor = a => a.toUpperCase();
const nextKey = list => {
}

const findData = map => {
  let startPosition = [0,0];
  let keys = new Map();
  let doors = new Map();
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const v = map[y][x];
      if (v === '#' || v === '.') continue;
      else if(v === '@') startPosition = [x,y];
      else if(isLowerCase(v)) keys.set(v, [x,y]); 
      else if(isUpperCase(v)) doors.set(v, [x,y]); 
    }
  }
  return [startPosition, keys, doors];
};

const part1 = lines => {
};

// ----------------------------------------------------------------------------
// PART 2
// ----------------------------------------------------------------------------
const part2 = lines => {
};

// ----------------------------------------------------------------------------
// TESTS
// ----------------------------------------------------------------------------
const test = () => {
  const lines = [
    "#########",
    "#b.A.@.a#",
    "#########",
  ];
  const map = linesToMap(lines);
  const [startPosition, keys, doors] = findData(map);
  console.log(search(map, startPosition, 'b'));

  return false;
};

const main = lines => {
  if (test()) {
    console.log(`Part 1: ${part1([...lines])}`);
    console.log(`Part 2: ${part2([...lines])}`);
  }
};
