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
  //input: fs.createReadStream("../../day7/input")
});

let lines = [];

readInterface.on("line", line => lines.push(line.trim()));

readInterface.on("close", () => {
  main(lines);
});

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
    return read(m+base, program);
  } else if (mode == -1) {
    return m+base;
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
    if(p1 == 0)
      p1 = 1;
    if(p1 == 2)
      p1 = -1;
  }
  if (op == 1 || op == 2 || op == 7 || op == 8)
    if(p3 == 2)
      p3 = -1;
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


const test = () => {
  return true;
  const sample = "109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99";
  const memory = toIntArr(sample)
  let program = new Array(65535);
  program.fill(0);
  for(let i = 0; i < memory.length; i++) program[i] = memory[i];
  let output = [];
  run(0, program, [], output);
  console.log(output);

  const sample2 = "1102,34915192,34915192,7,4,7,99,0";
  const memory2 = toIntArr(sample2)
  let program2 = new Array(65535);
  program2.fill(0);
  for(let i = 0; i < memory2.length; i++) program2[i] = memory2[i];
  let output2 = [];
  run(0, program2, [], output2);
  console.log(output2);

  const sample3 = "104,1125899906842624,99";
  const memory3 = toIntArr(sample3)
  let program3 = new Array(65535);
  program3.fill(0);
  for(let i = 0; i < memory3.length; i++) program3[i] = memory3[i];
  let output3 = [];
  run(0, program3, [], output3);
  console.log(output3);
  return true;
};

const main = lines => {
  if (test()) {
    console.log("Test finished");
    const memory = lines.map(line => toIntArr(line))[0];
    let program = new Array(65535);
                               //34463338
    program.fill(0);
    for(let i = 0; i < memory.length; i++) program[i] = memory[i];
    let output = [];
    run(0, program, [2], output);
    console.log(output);

    //console.log(`Part 1: ${searchSignal([...program])}`);
    //console.log(`Part 2: ${searchSignalLoop([...program])}`);
  }
};
