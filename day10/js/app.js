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

const splitLine = line => {
  return line.split("");
};

const findBest = resultsMap => {
  let maxV = 0;
  let maxK = "";
  for (let [k, v] of resultsMap.entries()) {
    if (v > maxV) {
      maxV = v;
      maxK = k;
    }
  }

  return [maxK, maxV];
};

const walkMap = map => {
  const results = new Map();
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x].localeCompare("#") != 0) continue;
      results.set(`${x},${y}`, checkLos(map, [x, y]));
    }
  }
  return results;
};

const checkLos = (map, source) => {
  let count = 0;
  const [sx, sy] = source;
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x].localeCompare("#") != 0 || (x == sx && y == sy)) continue;
      else {
        if (los(map, source, [x, y])) count++;
      }
    }
  }

  return count;
};

const los = (map, source, target) => {
  const [sx, sy] = source;
  const [tx, ty] = target;
  const [gx, gy] = gradient(source, target);

  let x = sx + gx;
  let y = sy + gy;
  let hit = false;
  while (!hit) {
    if (map[y][x].localeCompare("#") == 0) {
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

const gcd = (a, b) => {
  let x = Math.abs(a);
  let y = Math.abs(b);

  while (y) {
    const t = y;
    y = x % y;
    x = t;
  }
  return x;
};

const gradient = (source, target) => {
  const [sx, sy] = source;
  const [tx, ty] = target;
  const gx = tx - sx;
  const gy = ty - sy;
  const g = gcd(gx, gy);
  const t1 = gx != 0 ? gx / g : 0;
  const t2 = gy != 0 ? gy / g : 0;
  return [t1, t2];
};

const gradientMap = (map, source) => {
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x].localeCompare("#") == 0) {
        const [sx, sy]= source;
        const [gx, gy] = gradient([sx+1, sy+1], [x+1, y+1]);
        if(gy == 0) map[y][x] = 0;
        else map[y][x] = gx / gy;
        console.log(x,y, (map[y][x]))
      }
    }
  }
  return map;
};

const test = () => {
  let sample = [
    ".#....#####...#..",
    "##...##.#####..##",
    "##...#...#.#####.",
    "..#.....X...###..",
    "..#.#.....#....##"
  ];
  const map = sample.map(line => splitLine(line));
  console.log(map);
  console.log("Test finished");
  //const result = walkMap(map);
  //console.log(`Sample 1: ${findBest(result)}`);
  console.log(gradientMap(map, [8,3]));

  return false;
};

const main = lines => {
  if (test()) {
    const map = lines.map(line => splitLine(line));
    console.log(map);
    console.log("Test finished");
    const result = walkMap(map);
    const best = findBest(result);
    console.log(`Part 1: ${best}`);

    console.log(gradientMap(map, [8, 16]));
  }
};
