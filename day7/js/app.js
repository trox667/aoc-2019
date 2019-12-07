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

const getData = (pointer, program, positionMode) => {
  const m = read(pointer, program);
  if (!positionMode) {
    return m;
  } else {
    return read(m, program);
  }
};

const getInstruction = (pointer, program) => {
  let op = 0;
  let p1 = true;
  let p2 = true;
  let p3 = false;
  let r1 = 0;
  let r2 = 0;
  let r3 = 0;
  if (isCombinedInstr(getData(pointer, program))) {
    const instruction = splitCombined(getData(pointer, program));
    op = instruction[0];
    p1 = instruction[1] == 0;
    p2 = instruction[2] == 0;
    //p3 = instruction[3] > 0
  } else {
    op = getData(pointer, program);
  }
  if (op == 3) p1 = false;
  r1 = getData(pointer + 1, program, p1);
  r2 = getData(pointer + 2, program, p2);
  r3 = getData(pointer + 3, program, p3);
  return [op, r1, r2, r3];
};

const run = (pointer, program, inputs, output) => {
  let halt = false;
  while (!halt || pointer >= program.length) {
    const [op, p1, p2, p3] = getInstruction(pointer, program);
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
      case 99: {
        halt = true;
        break;
      }
      default: {
        pointer += 1;
      }
    }
  }
};

const amplifier = (program, phase) => {
  let output = [];
  run(0, program, phase, output);
  if (output.length > 0) return output[output.length - 1];
  return 0;
};

const amplifierSeries = (program, phases) => {
  const r1 = amplifier([...program], [phases[0], 0]);
  const r2 = amplifier([...program], [phases[1], r1]);
  const r3 = amplifier([...program], [phases[2], r2]);
  const r4 = amplifier([...program], [phases[3], r3]);
  const r5 = amplifier([...program], [phases[4], r4]);
  return r5;
};

const searchSignal = program => {
  const permutations = permutator([0, 1, 2, 3, 4]);
  let signal = 0;
  permutations.forEach(phases => {
    signal = Math.max(signal, amplifierSeries(program, phases));
  });
  return signal;
};

const test = () => {
  console.log("Test started");
  let program = [
    3,
    15,
    3,
    16,
    1002,
    16,
    10,
    16,
    1,
    16,
    15,
    15,
    4,
    15,
    99,
    0,
    0
  ];
  let phases = [4, 3, 2, 1, 0];
  console.log(amplifierSeries(program, phases));
  program = [
    3,
    23,
    3,
    24,
    1002,
    24,
    10,
    24,
    1002,
    23,
    -1,
    23,
    101,
    5,
    23,
    23,
    1,
    24,
    23,
    23,
    4,
    23,
    99,
    0,
    0
  ];
  phases = [0, 1, 2, 3, 4];
  console.log(amplifierSeries(program, phases));
  return true;
};

const main = lines => {
  if (test()) {
    const program = lines.map(line => toIntArr(line))[0];
    console.log(`Part 1: ${searchSignal(program)}`);
  }
};
