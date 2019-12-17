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

// ----------------------------------------------------------------------------
// PART 1
// ----------------------------------------------------------------------------
const split = s => s.split("").map(s => parseInt(s))
const zip = (arr1, arr2) => {
  let i = 0;
  return arr1.map((a, j) => {
    if (i >= arr2.length) i = 0;
    if(j == 0) i++
    return a * arr2[i++];
  });
};
const lastDigit = num => Math.abs(num % 10);
const basePattern = (pattern, mul) => {
  return pattern
    .map(p => {
      let res = [];
      for (let i = 0; i < mul; i++) res.push(p);
      return res;
    })
    .flat();
};
const sum = arr => arr.reduce((acc, a) => acc + a, 0)

const signal = (input, pattern) => {
  return lastDigit(sum(zip(input, pattern)))
}

const signalLoop = (input, pattern, count) => {
  const res = [];
  for (let i = 1; i <= count; i++) {
    const p = basePattern(pattern, i);
    res.push(signal([...input], p));
  }
  return res;
}

const part1 = lines => {
  let input = split(lines[0]);
  const pattern = [0, 1, 0, -1];
  let result = [];
  for(let i = 1; i <= 100; i++) {
    result = signalLoop(input, pattern, input.length);
    input = result
  }
  return input.splice(0, 8).join("")
};

// ----------------------------------------------------------------------------
// PART 2
// ----------------------------------------------------------------------------
const part2 = lines => {};

// ----------------------------------------------------------------------------
// TESTS
// ----------------------------------------------------------------------------
const test = () => {
  console.log(8, lastDigit(38));
  console.log(7, lastDigit(-17));
  console.log(basePattern([0, 1, 0, -1], 3));
  console.log(zip([9, 8, 7, 6, 5], [1, 2, 3]));
  console.log(sum([1,2,3]))

  console.log(signalLoop([1,2,3,4,5,6,7,8], [0, 1, 0, -1], 1));
  console.log(signalLoop([1,2,3,4,5,6,7,8], [0, 1, 0, -1], 2));
  console.log(signalLoop([1,2,3,4,5,6,7,8], [0, 1, 0, -1], 3));
  console.log(signalLoop([1,2,3,4,5,6,7,8], [0, 1, 0, -1], 4));
  console.log(signalLoop([1,2,3,4,5,6,7,8], [0, 1, 0, -1], 5));
  console.log(signalLoop([1,2,3,4,5,6,7,8], [0, 1, 0, -1], 6));
  console.log(signalLoop([1,2,3,4,5,6,7,8], [0, 1, 0, -1], 7));
  console.log(signalLoop([1,2,3,4,5,6,7,8], [0, 1, 0, -1], 8));

  console.log(24176176, part1(["80871224585914546619083218645595"]));
  console.log(73745418, part1(["19617804207202209144916044189917"]));
  return true;
};

const main = lines => {
  if (test()) {
    console.log(`Part 1: ${part1([...lines])}`);
    console.log(`Part 2: ${part2([...lines])}`);
  }
};
