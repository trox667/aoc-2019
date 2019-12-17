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

class Computer {
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
    let p = new Computer();
    p.pointer = this.pointer;
    p.input = [...this.input];
    p.output = [...this.output];
    p.program = [...this.program];
    p.base = [...this.base];
    return p;
  }
}

exports.Computer = Computer;