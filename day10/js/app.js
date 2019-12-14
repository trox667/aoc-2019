const fs = require("fs");
const readline = require("readline");

const readInterface = readline.createInterface({
  input: fs.createReadStream("../input")
  //input: fs.createReadStream("../../day7/input")
});

let lines = [];

readInterface.on("line", line => lines.push(line.trim()));

readInterface.on("close", () => {
  main(lines);
});

const createMap = lines => {
  return lines.map(line => line.split(""));
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
    if (map[y][x] === "#") {
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
      if (map[y][x] === "#") targets.push([x, y]);
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

const distance = (source, target) => {
  const [sx, sy] = source;
  const [tx, ty] = target;
  const a = sx - tx;
  const b = sy - ty;
  return Math.sqrt(a * a + b * b);
};
const getTargets = (map, center) => {
  const [cx, cy] = center;
  let targets = new Map();
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === "#" && !(x === cx && y === cy)) {
        const g = gradient(center, [x, y]);
        const d = distance(center, [x, y]);
        let key = `${g[0]},${g[1]}`;
        let t = targets.get(key);
        if (t) {
          t.push([[x, y], d]);
          t.sort((a, b) => {
            const [ap, ad] = a;
            const [bp, bd] = b;
            return a - b;
          });
          targets.set(key, t);
        } else {
          targets.set(key, [[[x, y], d]]);
        }
      }
    }
  }
  return targets;
};

const part2 = (map, center) => {
  const targets = getTargets(map, center);
  const sortedTargets = new Map();
  for (let [key, t] of targets.entries()) {
    const [gx, gy] = key.split(",").map(k => parseFloat(k));
    let angle = Math.atan2(gx, -gy);
    if (angle < 0) {
      angle += 2 * Math.PI;
    }
    t.sort(([[ax, ab], ad], [[bx, by], bd]) => {
      return ad - bd;
    });
    sortedTargets.set(angle, t);
  }
  const sortedKeys = Array.from(sortedTargets.keys());
  sortedKeys.sort((a, b) => {
    return a - b;
  });
  let removed = [];
  while (sortedTargets.size > 0) {
    for (let k of sortedKeys) {
      let v = sortedTargets.get(k);
      if (v) {
        const remove = v.shift();
        removed.push(remove);
        if (v.length == 0) {
          sortedTargets.delete(k);
        }
      }
    }
  }
  if (removed.length >= 200) {
    const [[x, y], d] = removed[199];
    return 100 * x + y;
  } else {
    return -1;
  }
};

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
  const sample1 = [".#..#", ".....", "#####", "....#", "...##"];
  const sample1Map = createMap(sample1);
  assert(getPossibleTargets([...sample1Map]).length, 10);
  const [count1, corrd1] = part1(sample1Map);
  assert(count1, 8);

  const sample2 = [
    ".#..##.###...#######",
    "##.############..##.",
    ".#.######.########.#",
    ".###.#######.####.#.",
    "#####.##.#.##.###.##",
    "..#####..#.#########",
    "####################",
    "#.####....###.#.#.##",
    "##.#################",
    "#####.##.###..####..",
    "..######..##.#######",
    "####.##.####...##..#",
    ".#####..#.######.###",
    "##...#.##########...",
    "#.##########.#######",
    ".####.#.###.###.#.##",
    "....##.##.###..#####",
    ".#.#.###########.###",
    "#.#.#.#####.####.###",
    "###.##.####.##.#..##"
  ];
  const sample2Map = createMap(sample2);
  const [count2, coord2] = part1(sample2Map);
  assert(count2, 210);
  return true;
};

const test2 = () => {
  const sample1 = [
    ".#....#####...#..",
    "##...##.#####..##",
    "##...#...#.#####.",
    "..#.....X...###..",
    "..#.#.....#....##"
  ];
  const sample1Map = createMap(sample1);
  const source = [8, 3];
  //part2(sample1Map, source);

  const sample2 = [
    ".#..##.###...#######",
    "##.############..##.",
    ".#.######.########.#",
    ".###.#######.####.#.",
    "#####.##.#.##.###.##",
    "..#####..#.#########",
    "####################",
    "#.####....###.#.#.##",
    "##.#################",
    "#####.##.###..####..",
    "..######..##.#######",
    "####.##.####...##..#",
    ".#####..#.######.###",
    "##...#.##########...",
    "#.##########.#######",
    ".####.#.###.###.#.##",
    "....##.##.###..#####",
    ".#.#.###########.###",
    "#.#.#.#####.####.###",
    "###.##.####.##.#..##"
  ];
  const sample2Map = createMap(sample2);
  const source2 = [11, 13];
  //part2(sample2Map, source2);
  return true;
};

// ############################################################################
// MAIN
// ############################################################################
const main = lines => {
  if (test() && test2()) {
    const map = createMap(lines);

    console.log(`Part1: ${part1(copyMap(map))}`);
    console.log(`Part2: ${part2(copyMap(map), [8, 16])}`);
  }
};
