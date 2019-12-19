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
// SEARCH
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
const WALL = "#";
const MOVED = ".";

const addToSet = (visited, [x, y]) => {
  visited.add(`${x},${y}`);
  return visited;
};

// DFS search of items in the map starting at
// a given position
const search = (map, startPosition, target) => {
  let found = false;
  let result = [];

  let visited = new Set();
  let stack = [];
  let [currX, currY] = startPosition;
  stack.push([currX, currY, 0, []]);

  while (!found) {
    let curr = stack.shift();
    let [cx, cy, cs, foundItems] = curr;
    if (!visited.has(`${cx},${cy}`)) {
      visited = addToSet(visited, [cx, cy]);
      cs = cs + 1;
      for (let d = NORTH; d <= EAST; d++) {
        const [dx, dy] = dir(d);
        const x = cx + dx;
        const y = cy + dy;
        const v = map[y][x];
        if (v === target) {
          result = [x, y, cs, [...foundItems]];
          found = true;
        } else if (v === WALL) {
          visited = addToSet(visited, [x, y]);
        } else if (v === MOVED) {
          stack.push([x, y, cs, [...foundItems]]);
        } else {
          const addedItems = [...foundItems];
          addedItems.push(v);
          stack.push([x, y, cs, addedItems]);
        }
      }
    }
  }
  return result;
};

// ----------------------------------------------------------------------------
// HELPER
// ----------------------------------------------------------------------------
const isLowerCase = a => a === a.toLowerCase();
const isUpperCase = a => !isLowerCase(a);

const linesToMap = lines => lines.map(line => line.split(""));

// add item to the list and sort it by the distance (item -> [distance, data]
const enqueue = (queue, element) => {
  queue.push(element);
  queue.sort((a, b) => {
    const [da, ...x] = a;
    const [db, ...y] = b;
    return a > b;
  });

  return queue;
};

// get the first item of the queue
const dequeue = queue => {
  return queue.shift();
};

const createGraph = start => {
  const m = new Map();
  m.set(start, []);
  return [[start], m];
};

const addNodeToGraph = (graph, node) => {
  const [nodes, neighbours] = graph;
  nodes.push(node);
  neighbours.set(node, []);
  return [nodes, neighbours];
};

const addEdgeToGraph = (graph, node1, node2, weight) => {
  const [nodes, neighbours] = graph;
  const neighbours1 = neighbours.get(node1);
  const neighbours2 = neighbours.get(node2);
  neighbours1.push([weight, node2]);
  neighbours2.push([weight, node1]);
  neighbours.set(node1, neighbours1);
  neighbours.set(node2, neighbours2);
  return [nodes, neighbours];
};

// graph -> [[nodes], map<node, [nodes]>]
const djikstra = (graph, start, end) => {
  let times = new Map();
  let backtrace = new Map();
  let queue = [];

  times.set(start, 0);
  let [nodes, neighbours] = graph;
  nodes = nodes.map(node => {
    if (node !== start) times.set(node, Infinity);
  });

  enqueue(queue, [0, start]);
  while (queue.length > 0) {
    let [distance, node] = dequeue(queue);
    neighbours.get(node).forEach(([weight, neighbour]) => {
      let time = times.get(node) + weight;
      if (time < times.get(neighbour)) {
        times.set(neighbour, time);
        backtrace.set(neighbour, node);
        enqueue(queue, [time, neighbour]);
      }
    });
  }

  let path = [end];
  let lastStep = end;
  while (lastStep !== start) {
    path.unshift(backtrace.get(lastStep));
    lastStep = backtrace.get(lastStep);
  }

  return [path, times.get(end)];
};

const printGraph = graph => {
  const [nodes, neighbours] = graph;
  nodes.forEach(node => console.log(node));
  for (let [k, v] of neighbours) {
    console.log(k, v);
  }
};

// ----------------------------------------------------------------------------
// PART 1
// ----------------------------------------------------------------------------
const getKey = a => a.toLowerCase();
const getDoor = a => a.toUpperCase();

const matchKeyDoors = (keys, doors) => {
  let matched = new Map();
  let unmatched = [];
  for (let [key, keyPosition] of keys.entries()) {
    if (doors.has(key.toUpperCase())) {
      matched.set(key, [true, keyPosition]);
    } else {
      unmatched.push([key, keyPosition]);
    }
  }
  return [matched, unmatched];
};

const doorsOnPath = path => {
  return path.filter(item => isUpperCase(item));
};

const keysOnPath = path => {
  return path.filter(item => isLowerCase(item));
};

const buildGraph = (map, [startPosition, keys, doors]) => {
  let graph = createGraph("@");

  // create a dependency list between keys and doors
  const [matched, unmatched] = matchKeyDoors(keys, doors);
  // there should be one key without a matching door
  const [ukey, upos] = unmatched[0];
  // search the map from the startPosition to the one and only key
  const [x, y, count, foundItems] = search(map, startPosition, ukey);

  // add all keys and doors as nodes to the graph
  keys.forEach(([_, position], key) => {
    graph = addNodeToGraph(graph, key);
  });
  doors.forEach(([_, position], key) => {
    graph = addNodeToGraph(graph, key);
  });

  doors.forEach((position, key) => {
    const [x, y, distance, foundItems] = search(
      map,
      position,
      key.toLowerCase()
    );
    graph = addEdgeToGraph(graph, key, key.toLowerCase(), distance);
  });

  const foundDoors = doorsOnPath(foundItems);

  const firstDoor = foundDoors[0];
  const [fx, fy, fdistance, ffoundItems] = search(
    map,
    startPosition,
    firstDoor.toLowerCase()
  );
  graph = addEdgeToGraph(graph, "@", firstDoor.toLowerCase(), fdistance);

  const lastDoor = foundDoors[foundDoors.length - 1];
  const lastDoorPos = doors.get(lastDoor);
  const [lx, ly, ldistance, lfoundItems] = search(map, lastDoorPos, ukey);
  graph = addEdgeToGraph(graph, ukey, lastDoor, ldistance);
  printGraph(graph)
  return djikstra(graph, "@", ukey);
};

const findData = map => {
  let startPosition = [0, 0];
  let keys = new Map();
  let doors = new Map();
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      const v = map[y][x];
      if (v === "#" || v === ".") continue;
      else if (v === "@") startPosition = [x, y];
      else if (isLowerCase(v)) keys.set(v, [x, y]);
      else if (isUpperCase(v)) doors.set(v, [x, y]);
    }
  }
  return [startPosition, keys, doors];
};

const part1 = lines => {};

// ----------------------------------------------------------------------------
// PART 2
// ----------------------------------------------------------------------------
const part2 = lines => {};

// ----------------------------------------------------------------------------
// TESTS
// ----------------------------------------------------------------------------
const test = () => {
  {
    const lines = ["#########", "#b.A.@.a#", "#########"];
    const map = linesToMap(lines);
    const [startPosition, keys, doors] = findData(map);
    let result = buildGraph(map, [startPosition, keys, doors]);
    console.log(result);
  }
  {
    const lines = [
      "########################",
      "#f.D.E.e.C.b.A.@.a.B.c.#",
      "######################.#",
      "#d.....................#",
      "########################"
    ];
    const map = linesToMap(lines);
    const [startPosition, keys, doors] = findData(map);
    let result = buildGraph(map, [startPosition, keys, doors]);
    console.log(result);
  }

  return false;
};

const testDjikstra = () => {
  console.log("TEST DJIKSTRA");
  let graph = createGraph("DIG INN");
  graph = addNodeToGraph(graph, "FULLSTACK");
  graph = addNodeToGraph(graph, "STARBUCKS");
  graph = addNodeToGraph(graph, "DUBLINER");
  graph = addNodeToGraph(graph, "CAFE GRUMPY");
  graph = addNodeToGraph(graph, "INSOMNIA COOKIES");
  graph = addEdgeToGraph(graph, "DIG INN", "FULLSTACK", 7);
  graph = addEdgeToGraph(graph, "DIG INN", "DUBLINER", 4);
  graph = addEdgeToGraph(graph, "DIG INN", "CAFE GRUMPY", 9);
  graph = addEdgeToGraph(graph, "CAFE GRUMPY", "INSOMNIA COOKIES", 5);
  graph = addEdgeToGraph(graph, "INSOMNIA COOKIES", "DUBLINER", 7);
  graph = addEdgeToGraph(graph, "INSOMNIA COOKIES", "STARBUCKS", 6);
  graph = addEdgeToGraph(graph, "DUBLINER", "STARBUCKS", 3);
  graph = addEdgeToGraph(graph, "DUBLINER", "FULLSTACK", 2);
  graph = addEdgeToGraph(graph, "FULLSTACK", "STARBUCKS", 6);
  {
    const [path, time] = djikstra(graph, "FULLSTACK", "INSOMNIA COOKIES");
    console.log("should be 9", path, time);
  }
  {
    const [path, time] = djikstra(graph, "DIG INN", "STARBUCKS");
    console.log("should be 7", path, time);
  }
};

const main = lines => {
  if (test()) {
    console.log(`Part 1: ${part1([...lines])}`);
    console.log(`Part 2: ${part2([...lines])}`);
  }
};
