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

const main = lines => {
  const wire_a = get_moves(lines[0]);
  const wire_b = get_moves(lines[1]);

  const [moves_a_set, moves_a_map] = calc_moves(wire_a);
  const [moves_b_set, moves_b_map] = calc_moves(wire_b);

  let set = []
  intersect(moves_a_set, moves_b_set).forEach(s => {
    const [x, y] = s.split(',')
    const px = parseInt(x)
    const py = parseInt(y)
    set.push([manhattan(0, px, 0, py), px, py])
  });

  set.sort((a, b) => {
    const [d1, f1] = a;
    const [d2, f2] = b;
    return d1 - d2;
  });

  console.log(`Part 1: ${set[0]}`);

  let res = Number.MAX_SAFE_INTEGER;
  set.forEach(s => {
    const [d, x, y] = s;
    const key = `${x},${y}`;
    const a = moves_a_map.get(key);
    const b = moves_b_map.get(key);
    res = Math.min(a+b, res)
  })

  console.log(`Part 2: ${res}`);
};

const get_moves = line => {
  return line.split(",").map(s => {
    const [c, ...count] = s;
    return [c, parseInt(count.join(""))];
  });
};

const calc_moves = moves => {
  let x = 0;
  let y = 0;
  let res = new Set();
  let count = 0;
  let counts = new Map();
  moves.forEach(move => {
    const [c, steps] = move;
    switch (c) {
      case "U": {
        for (let i = 0; i < steps; i++) {
          y += 1;
          res.add(`${x},${y}`);
          count += 1;
          counts.set(`${x},${y}`, count);
        }
        break;
      }
      case "D": {
        for (let i = 0; i < steps; i++) {
          y -= 1;
          res.add(`${x},${y}`);
          count += 1;
          counts.set(`${x},${y}`, count);
        }
        break;
      }
      case "L": {
        for (let i = 0; i < steps; i++) {
          x -= 1;
          res.add(`${x},${y}`);
          count += 1;
          counts.set(`${x},${y}`, count);
        }
        break;
      }
      case "R": {
        for (let i = 0; i < steps; i++) {
          x += 1;
          res.add(`${x},${y}`);
          count += 1;
          counts.set(`${x},${y}`, count);
        }
        break;
      }
      default:
        break;
    }
  });
  return [res, counts];
};

const manhattan = (x1, x2, y1, y2) => Math.abs(x1 - x2) + Math.abs(y1 - y2);

const intersect = (a, b) => {
  let res = new Set()
  a.forEach(entry => {
    if(b.has(entry))
      res.add(entry)
  })
  return res;
}