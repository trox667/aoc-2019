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

// 2 BGLTP, 1 HPNWP, 2 GLHWQ, 9 CRJZ, 22 QVQJ, 3 PHGWC, 1 BDWQP => 3 LKPNB
const parseReaction = line => {
  const parts = line.split("=>").map(l => l.trim());
  const output = parts[1].split(" ");
  const outputReaction = [parseInt(output[0]), output[1]];

  const input = parts[0].split(", ");
  const inputReactions = input.map(i => {
    const input = i.split(" ");
    return [parseInt(input[0]), input[1]];
  });
  return [inputReactions, outputReaction];
};

const createReactionMaps = reactions => {
  let map = new Map();
  reactions.forEach(([inputs, output]) => {
    map.set(output[1], [output[0], inputs]);
  });
  return map;
};

const getOreCount = (reactionMap, storage, name, count) => {
  const [ocount, inputs] = reactionMap.get(name);
  let inStorage = storage.get(name);
  if (inStorage === undefined) {
    storage.set(name, 0);
    inStorage = 0;
  }

  const required = Math.max(0, count - inStorage);
  const totalProd = Math.floor(
    required / ocount + (required % ocount !== 0 ? 1 : 0)
  );
  const addProduced = totalProd * ocount - count;
  storage.set(name, inStorage + addProduced);

  let sum = 0;
  inputs.forEach(([icount, iname]) => {
    if (iname === "ORE") {
      sum += icount * totalProd;
    } else {
      sum += getOreCount(reactionMap, storage, iname, icount * totalProd);
    }
  });
  return sum;
};

const part1 = lines => {
  const reactions = lines.map(line => parseReaction(line));
  const reactionMap = createReactionMaps(reactions);
  const resOreCount = getOreCount(reactionMap, new Map(), "FUEL", 1);
  return resOreCount;
};

const part2 = lines => {
  const reactions = lines.map(line => parseReaction(line));
  const reactionMap = createReactionMaps(reactions);
  const resOreCount = getOreCount(reactionMap, new Map(), "FUEL", 1);
  const trillion = 1000000000000;
  let low = Math.floor(trillion / resOreCount);
  let high = low * 2;
  let mid = -1;
  while(low <= high) {
    mid = Math.floor((low + high) / 2);
    let reqOreCount = getOreCount(reactionMap, new Map(), "FUEL", mid);
    if(reqOreCount > trillion) {
      high = mid - 1;
    } else {
      low = mid +1;
    }
  }
  return mid;
};

const test = () => {
  {
    const sample = [
      "10 ORE => 10 A",
      "1 ORE => 1 B",
      "7 A, 1 B => 1 C",
      "7 A, 1 C => 1 D",
      "7 A, 1 D => 1 E",
      "7 A, 1 E => 1 FUEL"
    ];
  }
  {
    const sample = [
      "9 ORE => 2 A",
      "8 ORE => 3 B",
      "7 ORE => 5 C",
      "3 A, 4 B => 1 AB",
      "5 B, 7 C => 1 BC",
      "4 C, 1 A => 1 CA",
      "2 AB, 3 BC, 4 CA => 1 FUEL"
    ];
  }
  {
    const sample = [
      "157 ORE => 5 NZVS",
      "165 ORE => 6 DCFZ",
      "44 XJWVT, 5 KHKGT, 1 QDVJ, 29 NZVS, 9 GPVTF, 48 HKGWZ => 1 FUEL",
      "12 HKGWZ, 1 GPVTF, 8 PSHF => 9 QDVJ",
      "179 ORE => 7 PSHF",
      "177 ORE => 5 HKGWZ",
      "7 DCFZ, 7 PSHF => 2 XJWVT",
      "165 ORE => 2 GPVTF",
      "3 DCFZ, 7 NZVS, 5 HKGWZ, 10 PSHF => 8 KHKGT"
    ];
    part2(sample)
  }
  {
    const sample = [
      "2 VPVL, 7 FWMGM, 2 CXFTF, 11 MNCFX => 1 STKFG",
      "17 NVRVD, 3 JNWZP => 8 VPVL",
      "53 STKFG, 6 MNCFX, 46 VJHF, 81 HVMC, 68 CXFTF, 25 GNMV => 1 FUEL",
      "22 VJHF, 37 MNCFX => 5 FWMGM",
      "139 ORE => 4 NVRVD",
      "144 ORE => 7 JNWZP",
      "5 MNCFX, 7 RFSQX, 2 FWMGM, 2 VPVL, 19 CXFTF => 3 HVMC",
      "5 VJHF, 7 MNCFX, 9 VPVL, 37 CXFTF => 6 GNMV",
      "145 ORE => 6 MNCFX",
      "1 NVRVD => 8 CXFTF",
      "1 VJHF, 6 MNCFX => 4 RFSQX",
      "176 ORE => 6 VJHF"
    ];
  }

  return true;
};

const main = lines => {
  if (test()) {
    console.log(`Part 1: ${part1([...lines])}`);
    console.log(`Part 2: ${part2([...lines])}`);
  }
};
