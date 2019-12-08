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

const WIDTH = 25;
const HEIGHT = 6;
const LAYERSIZE = WIDTH * HEIGHT;

const createLayers = (data, size) => {
  const layers = [];
  for (let i = 0; i < data.length; i += size)
    layers.push(data.slice(i, i + size));
  return layers;
};

const countDigit = (layer, digit) => {
  return layer.filter(d => d == digit).length;
};

const getLayerWithFewest = (layers, layersDigits) => {
  const [_, idx] = layersDigits.reduce(
    (acc, d, idx) => {
      const [pd, pidx] = acc;
      if (d < pd && d != 0) return [d, idx];
      return acc;
    },
    [Number.MAX_VALUE, 0]
  );
  return layers[idx];
};

const image = (layers, size) => {
  const imageData = new Array(size)
  imageData.fill(2, 0, size);
  for (let i = 0; i < size; i++) {
    layers.forEach(layer => {
      if (imageData[i] == 2) {
        imageData[i] = layer[i];
      }
    });
  }

  return imageData;
};

const toImage = (imageData, width, height) => {
  let lines = []
  for(let y = 0; y < height; y++) {
    let line = ""
    for(let x = 0; x < width; x++) {
      if(imageData[y*width + x] == 0) {
        line += "" + "#"
      } else {
        line += " "
      }
    }
    lines.push(line)
  }
  return lines
}

const test = () => {
  console.log("Test started");
  const sample = "123456789012";
  const data = sample.split("").map(v => parseInt(v));
  const layers = createLayers(data, 6);
  const layersDigits = layers.map(l => countDigit(l, 0));
  const fewest0 = getLayerWithFewest(layers, layersDigits);
  console.log(countDigit(fewest0, 1) * countDigit(fewest0, 2)) 
  return true
};

const test2 = () => {
  const sample = "0222112222120000";
  const data = sample.split("").map(v => parseInt(v));
  const layers = createLayers(data, 4);
  const imageData = image(layers, 4) 
  console.log(toImage(imageData, 2, 2));
  return true;
};

const main = lines => {
  if (!test() || !test2()) {
    console.log("Test failed");
    return;
  } else {
    console.log("Test done");
  }
  const data = lines[0].split("").map(v => parseInt(v));
  const layers = createLayers(data, LAYERSIZE);
  const layersDigits = layers.map(l => countDigit(l, 0));
  const fewest0 = getLayerWithFewest(layers, layersDigits);
  console.log(`Part 1: ${countDigit(fewest0, 1) * countDigit(fewest0, 2)}`);
  const img = toImage(image(layers, LAYERSIZE), WIDTH, HEIGHT);
  console.log(img)
  console.log(`Part 2: done`);
};
