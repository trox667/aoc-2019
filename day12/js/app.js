const fs = require('fs');
const readline = require('readline');

const readInterface = readline.createInterface({
  input: fs.createReadStream('../input'),
});

let lines = [];

readInterface.on('line', line => lines.push(line.trim()));

readInterface.on('close', () => {
  main(lines);
});

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

const toIntArr = line => {
  return line.split(',').map(v => parseInt(v));
};

// 5 moons - x,y,z
// velocity per moon starts 0
// calc motion per time frame
//  apply gravity, per axis:
//  moon1.x > moon2.x => moon1.velocity -1
//  moon1.x < moon2.x => moon1.velocity +1
//  moon1.x = moon2.x => moon1.velocity +0

const createPairs = moons => {
  let pairs = [];
  for (let m1 = 0; m1 < moons.length; m1++) {
    for (let m2 = m1 + 1; m2 < moons.length; m2++) {
      pairs.push([moons[m1], moons[m2]]);
    }
  }
  return pairs;
};

// <x=-8, y=-18, z=6>
const createMoon = line => {
  line = line.substring(1);
  line = line.substring(0, line.length - 1);
  const tokens = line.split(', ');
  const moonAxis = tokens.map(token => {
    const [axis, value] = token.split('=');
    return {axis, value: parseInt(value)};
  });
  return {
    x: moonAxis[0].value,
    y: moonAxis[1].value,
    z: moonAxis[2].value,
    vx: 0,
    vy: 0,
    vz: 0,
  };
};

const gravity = (x1, x2) => {
  if (x1 > x2) return -1;
  else if (x1 < x2) return +1;
  else return 0;
};

const pairGravity = pair => {
  let [moon1, moon2] = pair;
  moon1.vx += gravity(moon1.x, moon2.x);
  moon1.vy += gravity(moon1.y, moon2.y);
  moon1.vz += gravity(moon1.z, moon2.z);

  moon2.vx += gravity(moon2.x, moon1.x);
  moon2.vy += gravity(moon2.y, moon1.y);
  moon2.vz += gravity(moon2.z, moon1.z);
  return [moon1, moon2];
};

const pairGravityAxis = (pair, axis, vel) => {
  let [moon1, moon2] = pair;
  moon1[vel] += gravity(moon1[axis], moon2[axis]);

  moon2[vel] += gravity(moon2[axis], moon1[axis]);
  return [moon1, moon2];
};

const applyVelocity = moon => {
  moon.x += moon.vx;
  moon.y += moon.vy;
  moon.z += moon.vz;
};

const applyVelocityAxis = (moon, axis, vel) => {
  moon[axis] += moon[vel];
};

const energy = moon => {
  const potential = Math.abs(moon.x) + Math.abs(moon.y) + Math.abs(moon.z);
  const kinetic = Math.abs(moon.vx) + Math.abs(moon.vy) + Math.abs(moon.vz);
  return potential * kinetic;
};

const systemEnergy = moons => {
  return moons.reduce((acc, moon) => {
    return acc + energy(moon);
  }, 0);
};

const part1 = lines => {
  const moons = lines.map(line => createMoon(line));
  const pairs = createPairs(moons);
  for (let t = 0; t < 1000; t++) {
    pairs.forEach(pair => pairGravity(pair));
    moons.forEach(moon => {
      applyVelocity(moon);
    });
  }
  return systemEnergy(moons);
};

const moonToString = moon => {
  return `${moon.x},${moon.y},${moon.z},${moon.vx},${moon.vy},${moon.vz}`;
};

const moonsToString = moons => {
  let line = '';
  moons.forEach(moon => (line += moonToString(moon) + ':'));
  return line;
};

const gcd = (a, b) => {
  if (!b) return a;
  return gcd(b, a % b);
};

const lcd = (a, b) => {
  return (a * b) / gcd(a, b);
};

const part2 = lines => {
  const moons = lines.map(line => createMoon(line));
  const startLocation = moonsToString(moons);
  console.log('startLocation', startLocation);
  const pairs = createPairs(moons);

  const getCountForAxis = (moons, pairs, axis, vel) => {
    let set = new Set();

    let count = 0;
    while (!set.has(startLocation)) {
      pairs.forEach(pair => pairGravityAxis(pair, axis, vel));
      moons.forEach(moon => {
        applyVelocityAxis(moon, axis, vel);
      });
      set.add(moonsToString(moons));
      count++;
    }
    return count;
  };

  const copyPairs = pairs => {
    return pairs.map(pair => [...pair]);
  };
  let x = getCountForAxis([...moons], copyPairs(pairs), 'x', 'vx');
  let y = getCountForAxis([...moons], copyPairs(pairs), 'y', 'vy');
  let z = getCountForAxis([...moons], copyPairs(pairs), 'z', 'vz');
  console.log(x,y,z)
  return lcd(x, lcd(y, z));
};

const test = () => {
  //let callisto = {x: 5, y:0, z:0, vx: 0, vy: 0, vz: 0}
  //let ganymede = {x: 3, y:0, z:0, vx: 0, vy: 0, vz: 0}
  //const pairs = createPairs([ganymede, callisto]);
  //pairGravity(pairs[0]);
  //
  let sample = [
    '<x=-1, y=0, z=2>',
    '<x=2, y=-10, z=-7>',
    '<x=4, y=-8, z=8>',
    '<x=3, y=5, z=-1>',
  ];

  const moons = sample.map(line => createMoon(line));
  const pairs = createPairs(moons);
  for (let t = 0; t < 10; t++) {
    pairs.forEach(pair => pairGravity(pair));
    moons.forEach(moon => {
      applyVelocity(moon);
    });
  }
  return systemEnergy(moons) === 179;
};

const test2 = () => {
  let sample = [
    '<x=-1, y=0, z=2>',
    '<x=2, y=-10, z=-7>',
    '<x=4, y=-8, z=8>',
    '<x=3, y=5, z=-1>',
  ];

  const moons = sample.map(line => createMoon(line));
  const startLocation = moonsToString(moons);
  console.log('startLocation', startLocation);
  const pairs = createPairs(moons);

  const getCountForAxis = (moons, pairs, axis, vel) => {
    let set = new Set();

    let count = 0;
    while (!set.has(startLocation)) {
      pairs.forEach(pair => pairGravityAxis(pair, axis, vel));
      moons.forEach(moon => {
        applyVelocityAxis(moon, axis, vel);
      });
      set.add(moonsToString(moons));
      count++;
    }
    return count;
  };

  const copyPairs = pairs => {
    return pairs.map(pair => [...pair]);
  };
  let x = getCountForAxis([...moons], copyPairs(pairs), 'x', 'vx');
  let y = getCountForAxis([...moons], copyPairs(pairs), 'y', 'vy');
  let z = getCountForAxis([...moons], copyPairs(pairs), 'z', 'vz');

  return lcd(x, lcd(y, z)) == 2772;
};

const main = lines => {
  if (test() && test2()) {
    console.log(`Part 1: ${part1([...lines])}`);
    console.log(`Part 2: ${part2([...lines])}`);
  }
};
