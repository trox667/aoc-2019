const fs = require("fs");
const readline = require("readline");
const { PNMImage } = require("../../lib/js/image");

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

const getData = (pointer, program, mode, base = [0]) => {
  const m = read(pointer, program);
  if (mode == 1) {
    return m;
  } else if (mode == 2) {
    return read(m + base[0], program);
  } else if (mode == -1) {
    return m + base[0];
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

const run = (pointer, program, inputs, output, base) => {
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
        base[0] += p1;
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

class Program {
  constructor() {
    this.pointer = 0;
    this.base = [0];
    this.output = [];
    this.input = [];
    this.program = [];
  }

  compile(instructions) {
    this.program = new Array(65535);
    this.program.fill(0);
    for (let i = 0; i < instructions.length; i++)
      this.program[i] = instructions[i];
  }

  run(input) {
    input.forEach(i => this.input.push(i));
    this.pointer = run(
      this.pointer,
      this.program,
      this.input,
      this.output,
      this.base
    );
    return this.output.pop();
  }

  clone() {
    let p = new Program();
    p.pointer = this.pointer;
    p.input = [...this.input];
    p.output = [...this.output];
    p.program = [...this.program];
    p.base = [...this.base];
    return p;
  }
}

// ----------------------------------------------------------------------------
// Part 1
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

const WALL = 0;
const MOVED = 1;
const OXYGEN = 2;

const addToSet = (visited, [x, y]) => {
  visited.add(`${x},${y}`);
  return visited;
};

const part1 = lines => {
  const instructions = lines.map(line => toIntArr(line))[0];
  let program = new Program();
  program.compile(instructions);

  let found = false;
  let result = [];

  let visited = new Set();
  let stack = [];
  stack.push([0, 0, 0, program]);
  let screen = [];

  while (!found) {
    let curr = stack.shift();
    let [cx, cy, cs, cprogram] = curr;
    if (!visited.has(`${cx},${cy}`)) {
      visited = addToSet(visited, [cx, cy]);
      cs = cs + 1;
      for (let d = NORTH; d <= EAST; d++) {
        const [dx, dy] = dir(d);
        const x = cx + dx;
        const y = cy + dy;
        let nprogram = cprogram.clone();
        const o = nprogram.run([d]);
        if (o === OXYGEN) {
          screen.push([[x, y], OXYGEN]);
          result = [cs, [x, y]];
          found = true;
        } else if (o === WALL) {
          screen.push([[x, y], WALL]);
          visited = addToSet(visited, [x, y]);
        } else {
          screen.push([[x, y], MOVED]);
          stack.push([x, y, cs, nprogram]);
        }
      }
    }
  }
  toImage(screen);
  return result;
};

const toImage = screen => {
  let maxX = Number.MIN_VALUE;
  let maxY = Number.MIN_VALUE;
  let minX = Number.MAX_VALUE;
  let minY = Number.MAX_VALUE;
  screen.forEach(([[x, y], status]) => {
    maxX = Math.max(x, maxX);
    maxY = Math.max(y, maxY);
    minX = Math.min(x, minX);
    minY = Math.min(y, minY);
  });
  let w = maxX + Math.abs(minX);
  let h = maxY + Math.abs(minY);
  let image = new PNMImage(w, h);

  screen.forEach(([[x, y], status]) => {
    let px = x + Math.abs(minX);
    let py = y + Math.abs(minY);
    let color = [255, 255, 255];
    if (status === WALL) {
      color = [0, 0, 0];
    } else if (status === MOVED) {
      color = [200, 200, 200];
    } else if (status === OXYGEN) {
      color = [0, 0, 255];
    }
    image.add_pixel(px, py, color);
  });
  image.add_pixel(0+Math.abs(minX), 0+Math.abs(minY), [0, 255, 0]);
  image.write("part1.ppm");
};

const part2 = lines => {
  const instructions = lines.map(line => toIntArr(line))[0];
  let program = new Program();
  program.compile(instructions);

  let visited = new Set();
  let queue = [];
  queue.push([0, 0, 0, program]);

  let oxygens = new Set();
  let oxPos = [0, 0];

  while (queue.length > 0) {
    let curr = queue.shift();
    let [cx, cy, cs, cprogram] = curr;
    if (!visited.has(`${cx},${cy}`)) {
      visited = addToSet(visited, [cx, cy]);
      cs = cs + 1;
      for (let d = NORTH; d <= EAST; d++) {
        const [dx, dy] = dir(d);
        const x = cx + dx;
        const y = cy + dy;
        let nprogram = cprogram.clone();
        const o = nprogram.run([d]);
        if (o === OXYGEN) {
          oxPos = [x, y];
          oxygens = addToSet(oxygens, [x, y]);
        } else if (o === WALL) {
          visited = addToSet(visited, [x, y]);
        } else {
          queue.push([x, y, cs, nprogram]);
          oxygens = addToSet(oxygens, [x, y]);
        }
      }
    }
  }

  let minutes = 0;
  queue = [];
  queue.push([oxPos[0], oxPos[1], 0]);
  visited = new Set();

  while (queue.length > 0) {
    let curr = queue.shift();
    let [cx, cy, cm] = curr;
    if (!visited.has(`${cx},${cy}`)) {
      visited = addToSet(visited, [cx, cy]);
      if (oxygens.has(`${cx},${cy}`)) {
        minutes = Math.max(minutes, cm);
        for (let d = NORTH; d <= EAST; d++) {
          const [dx, dy] = dir(d);
          const x = cx + dx;
          const y = cy + dy;
          queue.push([x, y, cm + 1]);
        }
      }
    }
  }

  return [minutes, oxPos];
};

const test = () => {
  return true;
};

const main = lines => {
  if (test()) {
    console.log(`Part 1: ${part1([...lines])}`);
    console.log(`Part 2: ${part2([...lines])}`);
  }
};
