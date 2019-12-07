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

const amplifier = (inputPointer, program, phase) => {
  let output = [];
  const pointer = run(inputPointer, program, phase, output);
  if (output.length > 0) return [pointer, output[output.length - 1]];
  return [pointer, 0];
};

const amplifierSeries = (program, phases) => {
  const [p1, r1] = amplifier(0, [...program], [phases[0], 0]);
  const [p2, r2] = amplifier(0, [...program], [phases[1], r1]);
  const [p3, r3] = amplifier(0, [...program], [phases[2], r2]);
  const [p4, r4] = amplifier(0, [...program], [phases[3], r3]);
  const [p5, r5] = amplifier(0, [...program], [phases[4], r4]);
  return r5;
};

const searchSignal = program => {
  const permutations = permutator([0, 1, 2, 3, 4]);
  let signal = 0;
  permutations.forEach(phases => {
    let output = amplifierSeries(program, phases);
    signal = Math.max(signal, output);
  });
  return signal;
};

const amplifierLoop = (program, phases) => {
  let i1 = [phases[0], 0];
  let i2 = [phases[1]];
  let i3 = [phases[2]];
  let i4 = [phases[3]];
  let i5 = [phases[4]];
  let pointer1 = 0;
  let pointer2 = 0;
  let pointer3 = 0;
  let pointer4 = 0;
  let pointer5 = 0;
  let lastSignal = 0;
  let program1 = [...program];
  let program2 = [...program];
  let program3 = [...program];
  let program4 = [...program];
  let program5 = [...program];
  while (pointer5 != -1) {
    const [p1, r1] = amplifier(pointer1, program1, i1);
    i2.push(r1);
    pointer1 = p1;
    const [p2, r2] = amplifier(pointer2, program2, i2);
    i3.push(r2);
    pointer2 = p2;
    const [p3, r3] = amplifier(pointer3, program3, i3);
    i4.push(r3);
    pointer3 = p3;
    const [p4, r4] = amplifier(pointer4, program4, i4);
    i5.push(r4);
    pointer4 = p4;
    const [p5, r5] = amplifier(pointer5, program5, i5);
    i1.push(r5);
    pointer5 = p5;
    lastSignal = r5;
  }
  return lastSignal;
};

const searchSignalLoop = program => {
  const permutations = permutator([5, 6, 7, 8, 9]);
  let signal = 0;
  permutations.forEach(phases => {
    let output = amplifierLoop(program, phases);
    signal = Math.max(signal, output);
  });
  return signal;
};

const test = () => {
  console.log("Test started");
  let program = [
    3,
    26,
    1001,
    26,
    -4,
    26,
    3,
    27,
    1002,
    27,
    2,
    27,
    1,
    27,
    26,
    27,
    4,
    27,
    1001,
    28,
    -1,
    28,
    1005,
    28,
    6,
    99,
    0,
    0,
    5
  ];
  let phase = [9, 8, 7, 6, 5];
  console.log(amplifierLoop(program, phase));
  program = [
    3,
    52,
    1001,
    52,
    -5,
    52,
    3,
    53,
    1,
    52,
    56,
    54,
    1007,
    54,
    5,
    55,
    1005,
    55,
    26,
    1001,
    54,
    -5,
    54,
    1105,
    1,
    12,
    1,
    53,
    54,
    53,
    1008,
    54,
    0,
    55,
    1001,
    55,
    1,
    55,
    2,
    53,
    55,
    53,
    4,
    53,
    1001,
    56,
    -1,
    56,
    1005,
    56,
    6,
    99,
    0,
    0,
    0,
    0,
    10
  ];
  phase = [9, 7, 8, 5, 6];
  console.log(amplifierLoop(program, phase));
  return true;
};

const main = lines => {
  if (test()) {
    console.log("Test finished");
    const program = lines.map(line => toIntArr(line))[0];
    console.log(`Part 1: ${searchSignal([...program])}`);
    console.log(`Part 2: ${searchSignalLoop([...program])}`);
  }
};
