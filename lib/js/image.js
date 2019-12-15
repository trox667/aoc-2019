const fs = require("fs");

class PNMImage {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Array(width * height);
    this.data.fill([255, 255, 255]);
  }

  fill_react(x, y, w, h, color) {
    for (let iy = y; iy < y + h; iy++) {
      for (let ix = x; ix < x + w; ix++) {
        this.add_pixel(ix, iy, color)
      }
    }
  }

  add_pixel(x, y, color) {
    const idx = this.width * y + x;
    this.data[idx] = color;
  }

  write(file) {
    const header = `P3\n${this.width} ${this.height}`;
    const lines = [header, "255"];
    const color2str = color => {
      return `${color[0]} ${color[1]} ${color[2]}`;
    };
    for (let y = 0; y < this.height; y++) {
      let line = "";
      for (let x = 0; x < this.width; x++) {
        const idx = this.width * y + x;
        const color = this.data[idx];
        line += color2str(color) + " ";
      }
      lines.push(line.trim());
    }
    const data = lines.join("\n") + "\n";
    fs.writeFileSync(file, data);
  }
}

const test = () => {
  const img = new PNMImage(3, 2);
  img.add_pixel(0, 0, [255, 0, 0]);
  img.add_pixel(1, 0, [0, 255, 0]);
  img.add_pixel(2, 0, [0, 0, 255]);
  img.add_pixel(0, 1, [255, 255, 0]);
  img.add_pixel(1, 1, [255, 255, 255]);
  img.add_pixel(2, 1, [0, 0, 0]);
  img.write("test.ppm");
};

const test2 = () => {
  const img = new PNMImage(10, 10);
  img.fill_react(0, 0, 5, 10, [255, 0, 0])
  img.write("test.ppm");
}

exports.PNMImage = PNMImage;
