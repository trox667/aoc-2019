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

const splitLine = (line) => {
  return line.split("")
}

const walkMap = (map) => {
  const results = new Map();
  for(let y = 0; y < map.length; y++) {
    for(let x = 0; x < map[0].length; x++) {
      if(map[y][x].localeCompare('#') != 0) continue;
      let count = checkLOS(map, [x,y]);
      results.set(`${x}${y}`, count);
    }
  }
  return results;
}

const checkLOS = (map, source) => {
  let count = 0;
  const [sx, sy] = source;
  for(let y = 0; y < map.length; y++) {
    for(let x = 0; x < map[0].length; x++) {
      if(map[y][x].localeCompare('#') != 0 ||
         x == sx && y == sy) continue;
      else {
        if(isLOSClear(map, [x,y], source)) count++;
      }
    }
  }
  return count;
}

const angle = (target, source) => {
  const [tx, ty] = target;
  const [sx, sy] = source;
  return (tx*sx + ty * sy) / ( (Math.sqrt(tx*tx + ty*ty)) * (Math.sqrt(sx*sx + sy*sy))) 
}

const angleEq = (a1, a2) => {
  const EPSILON = 0.001;
  return a1 - a2 <= EPSILON;
}

const isLOSClear = (map, target, source) => {
  let [tx, ty] = target;
  let [sx, sy] = source;

  let a = angle(target, source);
  if (sy > ty) {
    for(let y = (ty+1); y < sy; y++) {
      // source is below target, target++
      if(sx > tx) {
        // source is right of the target, target++
        tx++;
        let b = angle([tx,y], source);
        if(angleEq(a,b) && map[y][tx].localeCompare('#'))
          return false;
      } else if(sx < tx) {
        // source is left of the target, target--
      } else {
        // source and target are vertical
      }
    }
  } else if(sy < ty) {
    // source is above target, target--

  } else {
    // source and target are horizontal

  }

  return true
}

const test = () => {
  const data = [
    ".#..#",
    ".....",
    "#####",
    "....#",
    "...##",
  ];
  let map =  data.map(line => splitLine(line));
  console.log(map);
  //console.log(walkMap(map))
  return false;
};

const main = lines => {
  if (test()) {
    console.log("Test finished");

  }
};
