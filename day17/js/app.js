const fs = require("fs");
const readline = require("readline");

const { Computer } = require("./computer");

const readInterface = readline.createInterface({
  input: fs.createReadStream("../input")
});

let lines = [];

readInterface.on("line", line => lines.push(line.trim()));

readInterface.on("close", () => {
  main(lines);
});

// ----------------------------------------------------------------------------
// PART 1
// ----------------------------------------------------------------------------

const toIntArr = line => {
  return line.split(",").map(v => parseInt(v));
};

const findIntersections = map => {
  const crossroad = (map, [x, y]) => {
    if (
      map[y - 1][x] === "#" &&
      map[y + 1][x] === "#" &&
      map[y][x - 1] === "#" &&
      map[y][x + 1] === "#" &&
      map[y][x] === "#"
    ) {
      return true;
    }
    return false;
  };
  let intersections = [];
  for (let y = 1; y < map.length - 1; y++) {
    for (let x = 1; x < map[0].length - 1; x++) {
      if (crossroad(map, [x, y])) {
        intersections.push([x, y]);
      }
    }
  }
  return intersections;
};

const result = intersections =>
  intersections.map(([x, y]) => x * y).reduce((acc, a) => (acc += a), 0);

const part1 = lines => {
  const instructions = toIntArr(lines[0]);
  let computer = new Computer();
  computer.compile(instructions);
  computer.run([]);
  const output = computer.output;
  let map = [];
  let currLine = [];
  output.forEach(o => {
    if (o === 35) currLine.push("#");
    else if (o === 46) currLine.push(".");
    else if (o === 10) {
      map.push(currLine);
      currLine = [];
    } else {
      currLine.push("<")
    }
  });
  //printMap(map)
  return result(findIntersections(map));
};

const printMap = map => {
  let lines = []
  for (let y = 0; y < map.length; y++) {
    let line = ""
    for (let x = 0; x < map[0].length; x++) {
      line += map[y][x]
    }
    lines.push(line)
  }
  const result = lines.join("\n");
  fs.writeFileSync("output", result)
}

// ----------------------------------------------------------------------------
// PART 2
// ----------------------------------------------------------------------------

const lineToAscii = (input) => {
  let inputs = input.split("").map(c => {
    return c.charCodeAt(0)
  });
  return inputs
}
const part2 = lines => {
  let inputs = lineToAscii("A,B,A,B,A,C,A,C,B,C\n")
  inputs.push(lineToAscii("R,6,L,10,R,10,R,10\n"))
  inputs.push(lineToAscii("L,10,L,12,R,10\n"))
  inputs.push(lineToAscii("R,6,L,12,L,10\n"))
  inputs.push(lineToAscii("n\n"))
  inputs = inputs.flat();
  console.log(inputs)
  const instructions = toIntArr(lines[0]);
  instructions[0] = 2;
  let computer = new Computer();
  computer.compile(instructions);
  const output = computer.run(inputs);
  return output;
};

// ----------------------------------------------------------------------------
// TESTS
// ----------------------------------------------------------------------------
const test = () => {
  const data = [
    "..#..........".split(""),
    "..#..........".split(""),
    "#######...###".split(""),
    "#.#...#...#.#".split(""),
    "#############".split(""),
    "..#...#...#..".split("")
  ];
  console.log(result(findIntersections(data)));
  return true;
};

const main = lines => {
  if (test()) {
    console.log(`Part 1: ${part1([...lines])}`);
    console.log(`Part 2: ${part2([...lines])}`);
  }
};
