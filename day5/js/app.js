const fs = require("fs");
const readline = require("readline");

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
  if(pointer < program.length)
    program[pointer] = value
}

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
    const instruction = splitCombined(getData(pointer, program))
    op = instruction[0]
    p1 = instruction[1] == 0
    p2 = instruction[2] == 0
    //p3 = instruction[3] > 0
  } else {
    op = getData(pointer, program);
  }
  if(op == 3) p1 = false
  r1 = getData(pointer + 1, program, p1);
  r2 = getData(pointer + 2, program, p2);
  r3 = getData(pointer + 3, program, p3);
  return [op, r1, r2, r3]
};

const run = (pointer, program, input, output) => {
  let halt = false;
  while (!halt || pointer >= program.length) {
    const [op, p1, p2, p3] = getInstruction(pointer, program);
    switch (op) {
      case 1: {
        write(p3, program, p1+p2)
        pointer += 4
        break;  
      }
      case 2: {
        write(p3, program, p1*p2)
        pointer += 4
        break;  
      }
      case 3: {
        write(p1, program, input)
        pointer += 2
        break; 
      }
      case 4: {
        output.push(p1)
        pointer += 2
        break;  
      }
      case 5: {
        if(p1 != 0)
          pointer = p2
        else 
          pointer += 3
        break;  
      }
      case 6: {
        if(p1 == 0)
          pointer = p2
        else 
          pointer += 3
        break;  
      }
      case 7: {
        if (p1 < p2) 
          write(p3, program, 1)
        else
          write(p3, program, 0)
        pointer += 4
        break;  
      }
      case 8: {
        if (p1 == p2)
          write(p3, program, 1)
        else
          write(p3, program, 0)
        pointer += 4
        break;  
      }
      case 99: {
        halt = true
        break;  
      }
      default: {
        pointer += 1
      }
    }
  }
};

const test = () => {
  console.log("Test started");
  console.log(splitCombined(1002), "should be [2, 0, 1, 0]")

  let sample = [1002,4,3,4,33]
  let output = []
  run(0, sample, 0, output)
  console.log(output)

  return true;
};

const main = lines => {
  if (test()) {
    console.log("Test successful");
    const program = lines.map(line => toIntArr(line))[0];
    let output = [];
    run(0,[...program], 1, output)
    console.log(output)
    output = [];
    run(0,[...program], 5, output)
    console.log(output)
  }
};
