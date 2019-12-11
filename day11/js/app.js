const fs = require("fs");
const readline = require("readline");

const permutator = inputArr => {
  let result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m);
    } else {
      for (let i = 0; i < arr.length; i++) {
        let curr = arr.slice();
        let next = curr.splice(i, 1);
        permute(curr.slice(), m.concat(next));
      }
    }
  };

  permute(inputArr);

  return result;
};

const readInterface = readline.createInterface({
  input: fs.createReadStream("../input")
});

let lines = [];

readInterface.on("line", line => lines.push(line.trim()));

readInterface.on("close", () => {
  main(lines);
});

const toIntArr = line => {
  return line.split(",").map(v => parseInt(v));
};

const isCombinedInstr = instruction => instruction > 100;

const splitCombined = instruction => {
  const s = instruction.toString();
  const c = s.split("");
  let op = c
    .reverse()
    .splice(0, 2)
    .reverse();
  op = op.reduce((acc, c) => acc + c, "");
  let p1 = 0;
  let p2 = 0;
  let p3 = 0;
  if (c.length >= 1) p1 = parseInt(c[0]);
  if (c.length >= 2) p2 = parseInt(c[1]);
  if (c.length >= 3) p3 = parseInt(c[2]);

  return [parseInt(op), p1, p2, p3];
};

const read = (pointer, program) => {
  if (pointer >= program.length) {
    return 0;
  } else {
    return program[pointer];
  }
};

const write = (pointer, program, value) => {
  if (pointer < program.length) program[pointer] = value;
};

const getData = (pointer, program, mode, base = 0) => {
  const m = read(pointer, program);
  if (mode == 1) {
    return m;
  } else if (mode == 2) {
    return read(m + base, program);
  } else if (mode == -1) {
    return m + base;
  } else {
    return read(m, program);
  }
};

const getInstruction = (pointer, program, base) => {
  let op = 0;
  let p1 = 0;
  let p2 = 0;
  let p3 = 1;
  let r1 = 0;
  let r2 = 0;
  let r3 = 0;
  if (isCombinedInstr(getData(pointer, program, 1))) {
    const instruction = splitCombined(getData(pointer, program, 1));
    op = instruction[0];
    p1 = instruction[1];
    p2 = instruction[2];
    p3 = instruction[3] == 2 ? 2 : 1;
  } else {
    op = getData(pointer, program, 1);
  }
  if (op == 3) {
    if (p1 == 0) p1 = 1;
    if (p1 == 2) p1 = -1;
  }
  if (op == 1 || op == 2 || op == 7 || op == 8) if (p3 == 2) p3 = -1;
  r1 = getData(pointer + 1, program, p1, base);
  r2 = getData(pointer + 2, program, p2, base);
  r3 = getData(pointer + 3, program, p3, base);
  return [op, r1, r2, r3];
};

const run = (pointer, program, inputs, output) => {
  let base = 0;
  let halt = false;
  while (!halt || pointer >= program.length) {
    const [op, p1, p2, p3] = getInstruction(pointer, program, base);
    switch (op) {
      case 1: {
        write(p3, program, p1 + p2);
        pointer += 4;
        break;
      }
      case 2: {
        write(p3, program, p1 * p2);
        pointer += 4;
        break;
      }
      case 3: {
        if (inputs.length == 0) {
          halt = true;
          break;
        }
        write(p1, program, inputs.shift());
        pointer += 2;
        break;
      }
      case 4: {
        output.push(p1);
        pointer += 2;
        break;
      }
      case 5: {
        if (p1 != 0) pointer = p2;
        else pointer += 3;
        break;
      }
      case 6: {
        if (p1 == 0) pointer = p2;
        else pointer += 3;
        break;
      }
      case 7: {
        if (p1 < p2) write(p3, program, 1);
        else write(p3, program, 0);
        pointer += 4;
        break;
      }
      case 8: {
        if (p1 == p2) write(p3, program, 1);
        else write(p3, program, 0);
        pointer += 4;
        break;
      }
      case 9: {
        base += p1;
        pointer += 2;
        break;
      }
      case 99: {
        halt = true;
        pointer = -1;
        break;
      }
      default: {
        pointer += 1;
      }
    }
  }
  return pointer;
};

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

const getDirection = (currDir, direction) => {
  switch (currDir) {
    case UP:
      if (direction === 1) currDir = RIGHT;
      else if (direction === 0) currDir = LEFT;
      break;
    case RIGHT:
      if (direction === 1) currDir = DOWN;
      else if (direction === 0) currDir = UP;
      break;
    case DOWN:
      if (direction === 1) currDir = LEFT;
      else if (direction === 0) currDir = RIGHT;
      break;
    case LEFT:
      if (direction === 1) currDir = UP;
      else if (direction === 0) currDir = DOWN;
      break;
  }
  return currDir;
};

// black = 0
// white = 0
// panel default = black
// turn left 90 = 0
// turn right 90 = 1
const part1 = lines => {
  const memory = lines.map(line => toIntArr(line))[0];
  let program = new Array(65535);
  program.fill(0);
  for (let i = 0; i < memory.length; i++) program[i] = memory[i];
  let output = [];
  // [x,y,count]
  let panels = new Map();
  let colors = new Map();

  // start input is black
  let input = [];
  let stop = false;
  let x = 0;
  let y = 0;
  let currDir = UP;
  let pointer = 0;
  while (!stop) {
    // get current color for robot camera
    let currColor = colors.get(`${x},${y}`);
    if (!currColor) currColor = 0;
    input.push(currColor);

    // run the int code
    pointer = run(pointer, program, input, output);

    // get the color and the direction
    const [color, direction] = output;
    output = [];

    // store the color
    colors.set(`${x},${y}`, color);

    // get the panel to change the visited count
    let panel = panels.get(`${x},${y}`);
    if (!panel) {
      panels.set(`${x},${y}`, 1);
    } else {
      panels.set(`${x},${y}`, ++panel);
    }

    // convert the direction to x/y
    currDir = getDirection(currDir, direction);
    switch (currDir) {
      case UP:
        y++;
        break;
      case RIGHT:
        x++;
        break;
      case DOWN:
        y--;
        break;
      case LEFT:
        x--;
        break;
    }

    // terminate
    if (pointer === -1) {
      stop = true;
    }
  }

  return panels.size;
};

const test = () => {
  return true;
};

const main = lines => {
  if (test()) {
  }

  console.log(`Part 1: ${part1(lines)}`);
};
