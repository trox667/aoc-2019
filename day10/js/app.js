const fs = require('fs');
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream('../input'),
  //input: fs.createReadStream("../../day7/input")
});

let lines = [];

readInterface.on('line', line => lines.push(line.trim()));

readInterface.on('close', () => {
  main(lines);
});

const createMap = lines => {
  return lines.map(line => line.split(''));
};

const gcd = (a, b) => {
  if (!b) return a;
  return gcd(b, a % b);
};

const gradient = (source, target) => {
  const [sx, sy] = source;
  const [tx, ty] = target;
  const gx = tx - sx;
  const gy = ty - sy;
  const g = Math.abs(gcd(gx, gy));
  return [gx / g, gy / g];
};

const los = (map, source, target) => {
  const [sx, sy] = source;
  const [tx, ty] = target;
  const [gx, gy] = gradient(source, target);

  const inBounds = (w, h, x, y) => {
    if (x < w && x >= 0 && y >= 0 && y < h) return true;
    return false;
  };
  let w = map[0].length;
  let h = map.length;
  let x = sx + gx;
  let y = sy + gy;
  let hit = false;
  while (!hit && inBounds(w, h, x, y)) {
    if (map[y][x] === '#') {
      hit = true;
      break;
    }
    x += gx;
    y += gy;
  }
  if (hit) {
    if (x == tx && y == ty) return true;
    else return false;
  }
  return true;
};

const getPossibleTargets = map => {
  let targets = [];
  for (let y = 0; y < map.length; y++)
    for (let x = 0; x < map[0].length; x++)
      if (map[y][x] === '#') targets.push([x, y]);
  return targets;
};

const copyMap = m => {
  return m.map(row => {
    return [...row];
  });
};

// ############################################################################
// PART 1
// ############################################################################

const part1 = map => {
  const sources = getPossibleTargets(map);
  const targets = [...sources];
  let hits = new Map();
  sources.forEach(source => {
    const [sx, sy] = source;
    let count = 0;
    targets.forEach(target => {
      const [tx, ty] = target;
      if (sx == tx && sy == ty) {
      } else {
        if (los(map, source, target)) count++;
      }
    });
    hits.set(source, count);
  });
  let maxV = 0;
  let maxK = 0;
  for (let [k, v] of hits.entries()) {
    if (v > maxV) {
      maxV = v;
      maxK = k;
    }
  }
  return [maxV, maxK];
};

// ############################################################################
// PART 2
// ############################################################################

const printMap = map => {
  map.forEach(row => {
    let line = '';
    row.forEach(e => {
      if (typeof e === 'number') line += Math.round(e * 100) / 100 + '\t';
      else {
        line += e + '\t';
      }
    });
    console.log(line);
  });
};

const gradientMap = (map, source) => {
  let gm = copyMap(map);
  for (let y = 0; y < map.length; y++)
    for (let x = 0; x < map[0].length; x++)
      if (map[y][x] === '#') {
        let [gx, gy] = gradient(source, [x, y]);
        if(gy === 0) gy = 1;
        if(gx === 0) gx = 1;
        gm[y][x] = Math.abs(gx) / Math.abs(gy);
      }

  return gm;
};

const UP = 0;
const TOPRIGHT = 1;
const RIGHT = 2;
const DOWNRIGHT = 3;
const DOWN = 4;
const DOWNLEFT = 5;
const LEFT = 6;
const TOPLEFT = 7;


//   x- y- |  x+ y-
//    DESC |  ASC
//  ---------------
//    ASC  |  DESC
//   x- y+ |  x+ y+
const getNextTargets = (map, gm, source, direction) => {
  
}

const sortTargets = (targets, direction) => {
  const sortASC(a, b) => {
    return a-b
  }
  const sortDESC(a, b) => {
    return b-a
  }
  if(direction == 1 || direction == 5)
    targets.sort(sortASC)
  else if(direction == 3 || direction == 7)
    targets.sort(sortDESC)
}

const part2 = map => {};

// ############################################################################
// TESTING
// ############################################################################

const assert = (a, b) => {
  if (a != b) {
    throw `${a} does not match ${b}`;
  }
};

const test = () => {
  assert(gcd(4, 4), 4);
  assert(gcd(4, 2), 2);
  assert(gcd(3, 2), 1);
  const sample1 = ['.#..#', '.....', '#####', '....#', '...##'];
  const sample1Map = createMap(sample1);
  assert(getPossibleTargets([...sample1Map]).length, 10);
  const [count1, corrd1] = part1(sample1Map);
  assert(count1, 8);

  const sample2 = [
    '.#..##.###...#######',
    '##.############..##.',
    '.#.######.########.#',
    '.###.#######.####.#.',
    '#####.##.#.##.###.##',
    '..#####..#.#########',
    '####################',
    '#.####....###.#.#.##',
    '##.#################',
    '#####.##.###..####..',
    '..######..##.#######',
    '####.##.####...##..#',
    '.#####..#.######.###',
    '##...#.##########...',
    '#.##########.#######',
    '.####.#.###.###.#.##',
    '....##.##.###..#####',
    '.#.#.###########.###',
    '#.#.#.#####.####.###',
    '###.##.####.##.#..##',
  ];
  const sample2Map = createMap(sample2);
  const [count2, coord2] = part1(sample2Map);
  assert(count2, 210);
  return true;
};

const test2 = () => {
  const sample1 = [
    '.#....#####...#..',
    '##...##.#####..##',
    '##...#...#.#####.',
    '..#.....X...###..',
    '..#.#.....#....##',
  ];
  const sample1Map = createMap(sample1);
  const source = [8, 3];
  printMap(gradientMap(sample1Map, source));

  return false;
};

// ############################################################################
// MAIN
// ############################################################################
const main = lines => {
  if (test() && test2()) {
    const map = createMap(lines);
    console.log(`Part1: ${part1(map)}`);
  }
};
