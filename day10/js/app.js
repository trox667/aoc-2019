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
        const g = gradient([x,y], source)
        if(isLOSClear(map, [x,y], source, g)) count++;
      }
    }
  }
  return count;
}

const gradient = (target, source) => {
  const [tx, ty] = target;
  const [sx, sy] = source;

  let dstX = Math.abs(sx-tx)
  let dstY = Math.abs(sy-ty)
  if(dstX % dstY == 0) {

  }
  return [dstX, dstY]
}

const isLOSClear = (map, target, source, gradient) => {
  let [tx, ty] = target;
  let [sx, sy] = source;
  let [gx, gy] = gradient;

  if(sy>ty) {
    // source is below target, y++
    for(let y = ty+gy; y < sy; y+=gy) {
      if(sx > tx) {
        // source is right of target, x++
        tx = tx+gx; 
        if(map[y][tx].localeCompare('#') == 0) return false;
      } else if (sx < tx) {
        // source is left of target, x--
        tx = tx-gx; 
        if(map[y][tx].localeCompare('#') == 0) return false;
      } else {
        return true
      }
    }
  } else if(sy<ty) {
    // source is above target, y--
    for(let y = ty-gy; y > sy; y-=gy) {
      if(sx > tx) {
        // source is right of target, x++
        tx = tx+gx; 
        if(map[y][tx].localeCompare('#') == 0) return false;
      } else if (sx < tx) {
        // source is left of target, x--
        tx = tx-gx; 
        if(map[y][tx].localeCompare('#') == 0) return false;
      } else {
        return true
      }
    }
  } else {
    // horizontal, y=0
    if(sx > tx) {
      while((sx-1) > tx) {
        // source is right of target, x++
        tx++; 
        if(map[ty][tx].localeCompare('#') == 0) return false;
      }
    } else if (sx < tx) {
      while(sx < (tx-1)) {
        // source is left of target, x--
        tx--; 
        if(map[ty][tx].localeCompare('#') == 0) return false;
      }
    } else {
      return true
    }
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
  console.log(isLOSClear(map, [4,0], [1,0], gradient([4,0], [1,0])))
  console.log(isLOSClear(map, [0,2], [1,0], gradient([0,2], [1,0])))
  console.log(isLOSClear(map, [1,2], [1,0], gradient([1,2], [1,0])))
  console.log(isLOSClear(map, [2,2], [1,0], gradient([2,2], [1,0])))
  console.log(isLOSClear(map, [3,2], [1,0], gradient([3,2], [1,0])))
  console.log(isLOSClear(map, [4,2], [1,0], gradient([4,2], [1,0])))
  console.log(isLOSClear(map, [4,3], [1,0], gradient([4,3], [1,0])))
  return false;
};

const main = lines => {
  if (test()) {
    console.log("Test finished");

  }
};
