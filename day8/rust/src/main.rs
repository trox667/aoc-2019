use baselib::io;

const HEIGHT: usize = 6;
const WIDTH: usize = 25;
const LAYERSIZE: usize = WIDTH * HEIGHT;

fn main() {
    let lines = io::read_file("../input");
    if lines.len() > 0 {
        let (_, layer): (usize, Vec<usize>) = layers(string_to_int(&lines[0]), LAYERSIZE)
            .into_iter()
            .map(|layer| (count_digit(0, &layer), layer))
            .fold((std::usize::MAX, vec![]), |(oc, olayer), (c, layer)| {
                if c < oc && c > 0 {
                    (c, layer)
                } else {
                    (oc, olayer)
                }
            });
        println!(
            "Part 1: {}",
            count_digit(1, &layer) * count_digit(2, &layer)
        );
        println!("Part 2:");
        print_image(
            make_image(layers(string_to_int(&lines[0]), LAYERSIZE), LAYERSIZE),
            WIDTH,
            HEIGHT,
        );
    }
}

fn string_to_int(s: &str) -> Vec<usize> {
    s.chars()
        .map(|c| c.to_string().parse::<usize>().unwrap_or(0))
        .collect()
}

fn layers(data: Vec<usize>, size: usize) -> Vec<Vec<usize>> {
    data.chunks(size).map(|c| c.to_owned()).collect()
}

fn count_digit(digit: usize, layer: &Vec<usize>) -> usize {
    let mut count = 0;
    layer.iter().for_each(|v| {
        if *v == digit {
            count += 1;
        }
    });
    count
}

fn make_image(layers: Vec<Vec<usize>>, size: usize) -> Vec<usize> {
    let mut image_data = vec![2; size];
    for i in 0..(size) {
        layers.iter().for_each(|layer| {
            if image_data[i] == 2 {
                image_data[i] = layer[i];
            }
        });
    }
    image_data
}

fn print_image(image: Vec<usize>, width: usize, height: usize) {
    for y in 0..(height) {
        for x in 0..(width) {
            if image[y * width + x] == 0 {
                print!("#");
            } else {
                print!(" ");
            }
        }
        print!("\n");
    }
}
