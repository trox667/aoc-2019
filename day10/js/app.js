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
  for(let [k,v] of resultsMap.entries()) {
    if( v > maxV) {
      maxV = v;
      maxK = k;
    }
  }

  return [maxK, maxV];
}

const walkMap = map => {
  const results = new Map();
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x].localeCompare("#") != 0) continue;
      results.set(`${x},${y}`, checkLos(map, [x,y]))
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

  return count
};

const vaporizeSector = (map, source, sector) => {
  const [sx, sy] = source;
  if(sector == 0) {
    const my = 0;
    const mx = map[0].length;
    for (let y = sy; y > my; y--) {
      for (let x = sx; x < mx; x++) {
        if (map[y][x].localeCompare("#") != 0 || (x == sx && y == sy)) continue;
        else {
          if (los(map, source, [x, y])) {
            map[y][x] = "."
          }
        }
      }
    }

  }

}

const los = (map, source, target) => {
  const [sx, sy] = source;
  let [tx, ty] = target;
  const [gx, gy] = gradient(source, target);

  if (sy < ty) {
    // target is above source, y--
    for (let y = ty - gy; y > sy; y -= gy) {
      if (sx < tx) {
        // x--
        tx = tx - gx;
        if (map[y][tx].localeCompare("#") == 0) return false;
      } else if (sx > tx) {
        // x++
        tx = tx + gx;
        if (map[y][tx].localeCompare("#") == 0) return false;
      } else {
        if (map[y][tx].localeCompare("#") == 0) return false;
      }
    }
  } else if (sy > ty) {
    // target is below source, y++
    for (let y = ty + gy; y < sy; y += gy) {
      if (sx < tx) {
        // x--
        tx = tx - gx;
        if (map[y][tx].localeCompare("#") == 0) return false;
      } else if (sx > tx) {
        // x++
        tx = tx + gx;
        if (map[y][tx].localeCompare("#") == 0) return false;
      } else {
        if (map[y][tx].localeCompare("#") == 0) return false;
      }
    }
  } else {
    // target and source are horizontal aligned
    if (sx < tx) {
      // x--
      while (sx + 1 < tx) {
        tx = tx - gx;
        if (map[ty][tx].localeCompare("#") == 0) return false;
      }
    } else if (sx > tx) {
      // x++
      while (sx - 1 > tx) {
        tx = tx + gx;
        if (map[ty][tx].localeCompare("#") == 0) return false;
      }
    } else {
      if (map[ty][tx].localeCompare("#") == 0) return false;
    }
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
  const gx = Math.abs(sx - tx);
  const gy = Math.abs(sy - ty);
  const g = gcd(gx, gy);
  return [gx / g, gy / g];
};

const test = () => {
  const data = [".#..#", ".....", "#####", "....#", "...##"];
  let map = data.map(line => splitLine(line));
  console.log(map);
  console.log("MAP")
  console.log(walkMap(map))
  const resultsMap = walkMap(map)
  console.log(findBest(resultsMap))

  let sample1 = [
    "......#.#.",
    "#..#.#....",
    "..#######.",
    ".#.#.###..",
    ".#..#.....",
    "..#....#.#",
    "#..#....#.",
    ".##.#..###",
    "##...#..#.",
    ".#....####",
  ]
  const resultsMap1 = walkMap(sample1)
  console.log(findBest(resultsMap1))

  return true;
};

const main = lines => {
  if (test()) {
    console.log("Test finished");
    const map = walkMap(lines)
    console.log(`Part 1: ${findBest(map)}`)
  }
};
