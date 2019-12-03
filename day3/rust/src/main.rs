use baselib::io;

fn main() {
    let lines = io::read_file("../input");

    let moves_wire1: Vec<Move> = lines[0].split(",").map(create_move).collect();
    let moves_wire2: Vec<Move> = lines[1].split(",").map(create_move).collect();
    let lines1 = create_lines(&moves_wire1);
    let lines2 = create_lines(&moves_wire2);
    let mut s: Vec<Point> = Vec::new();
    for line1 in &lines1 {
        for line2 in &lines2 {
            if let Some(p) = calc_intersection(*line1, *line2) {
                s.push(p);
            }
        }
    }
    let o = Point::new(0,0);
    let mut res = s.iter().map(|p| {
        manhattan_distance(&o, &p)
    }).collect::<Vec<i32>>();
    res.sort();
    println!("Part 1: {}", res[0]);
}

fn manhattan_distance(p1: &Point, p2: &Point) -> i32 {
    (p1.x - p2.x).abs() + (p1.y - p2.y).abs()
}

#[derive(Debug, PartialEq)]
enum Direction {
    Up,
    Right,
    Down,
    Left,
    Unknow,
}

type Move = (Direction, i32);

fn create_move(s: &str) -> Move {
    let c = s.chars().next().unwrap();
    let count = s[1..].parse::<i32>().ok().unwrap_or(0);
    match c {
       'D' => (Direction::Down, count),
       'L' => (Direction::Left, count),
       'R' => (Direction::Right, count),
       'U' => (Direction::Up, count),
       _ => (Direction::Unknow, 0)
    }
}

fn move_from_point(p: &Point, one_move: &Move) -> Point {
    match one_move.0 {
        Direction::Down => Point::new(p.x, p.y - one_move.1),
        Direction::Left => Point::new(p.x - one_move.1, p.y),
        Direction::Right => Point::new(p.x + one_move.1, p.y),
        Direction::Up => Point::new(p.x, p.y + one_move.1),
        _ => p.clone()
    }
}


#[derive(Debug, PartialEq, Clone, Copy)]
struct Point {
    x: i32,
    y: i32,
}

impl Point {
    fn new(x: i32, y: i32) -> Point {
        Point {x: x, y: y}
    }
}

#[derive(Debug, PartialEq, Clone, Copy)]
struct Line {
    p1: Point,
    p2: Point,
}

impl Line {
    fn new(p1: Point, p2: Point) -> Line {
        Line {p1: p1, p2: p2}
    }

    fn max_y(&self) -> i32 {
        self.p1.y.max(self.p2.y)
    }

    fn min_y(&self) -> i32 {
        self.p1.y.min(self.p2.y)
    }

    fn max_x(&self) -> i32 {
        self.p1.x.max(self.p2.x)
    }

    fn min_x(&self) -> i32 {
        self.p1.x.min(self.p2.x)
    }
}

fn create_lines(moves: &Vec<Move>) -> Vec<Line> {
    let mut last_point = Point::new(0,0);
    let mut lines: Vec<Line> = Vec::new();
    moves.iter().for_each(|one_move| {
        let curr_point = move_from_point(&last_point, one_move);
        lines.push(Line::new(last_point, curr_point));    
        last_point = curr_point;
    });
    lines
}

fn line_straight(line: Line) -> bool {
    line.p1.x == line.p2.x || line.p1.y == line.p2.y
}

fn check_segment(l1: Line, l2: Line) -> Option<Point> {
    if l1.p1.y < l2.max_y() &&
        l1.p1.y > l2.min_y() &&
        l2.p1.x < l1.max_x() &&
        l2.p1.x > l1.min_x() {
        Some(Point::new(l2.p1.x, l1.p1.y))
    } else {
        None
    }
}

fn calc_intersection(l1: Line, l2: Line) -> Option<Point> {
    if !line_straight(l1) || !line_straight(l2) {
        return None
    }

    return if l1.p1.y == l1.p2.y {
        check_segment(l1, l2)
    } else {
        check_segment(l2, l1)
    }
}

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn intersection() {
        let l1 = Line::new(
            Point::new(5,4),
            Point::new(5,7),
            );
        let l2 = Line::new(
            Point::new(4,5),
            Point::new(8,5),
            );
        assert_eq!(calc_intersection(l1, l2), Some(Point::new(5,5)));
        
        let l1 = Line::new(
            Point::new(5,7),
            Point::new(10,7),
            );
        let l2 = Line::new(
            Point::new(8,5),
            Point::new(8,9),
            );
        assert_eq!(calc_intersection(l1, l2), Some(Point::new(8,7)));
    }
    
    #[test]
    fn moves() {
        let line = "R8,U5,L5,D3";
        let moves: Vec<Move> = line.split(",").map(create_move).collect();
        let ref_moves = vec![(Direction::Right, 8), (Direction::Up, 5), (Direction::Left, 5), (Direction::Down, 3)];
        assert_eq!(moves, ref_moves);

    }

    #[test]
    fn lines() {
        let line = "R8,U5,L5,D3";
        let ref_lines = vec![
            Line::new(Point::new(0,0), Point::new(8,0)),
            Line::new(Point::new(8,0), Point::new(8,5)),
            Line::new(Point::new(8,5), Point::new(3,5)),
            Line::new(Point::new(3,5), Point::new(3,2)),
        ];
        let moves: Vec<Move> = line.split(",").map(create_move).collect();
        assert_eq!(create_lines(&moves), ref_lines);
    }

    #[test]
    fn sample() {
        let moves_wire1: Vec<Move> = "R8,U5,L5,D3".split(",").map(create_move).collect();
        let moves_wire2: Vec<Move> = "U7,R6,D4,L4".split(",").map(create_move).collect();
        let lines1 = create_lines(&moves_wire1);
        let lines2 = create_lines(&moves_wire2);
        let mut s: Vec<Point> = Vec::new();
        for line1 in &lines1 {
            for line2 in &lines2 {
                if let Some(p) = calc_intersection(*line1, *line2) {
                    s.push(p);
                }
            }
        }
        let ref_s = vec![
            Point::new(6,5),
            Point::new(3,3),
        ];

        let o = Point::new(0,0);
        assert_eq!(s, ref_s);
        let mut res = s.iter().map(|p| {
            manhattan_distance(&o, &p)
        }).collect::<Vec<i32>>();
        res.sort();
        assert_eq!(res[0], 6);
    }

    #[test]
    fn samples() {
        let moves_wire1: Vec<Move> = "R75,D30,R83,U83,L12,D49,R71,U7,L72".split(",").map(create_move).collect();
        let moves_wire2: Vec<Move> = "U62,R66,U55,R34,D71,R55,D58,R83".split(",").map(create_move).collect();
        let lines1 = create_lines(&moves_wire1);
        let lines2 = create_lines(&moves_wire2);
        let mut s: Vec<Point> = Vec::new();
        for line1 in &lines1 {
            for line2 in &lines2 {
                if let Some(p) = calc_intersection(*line1, *line2) {
                    s.push(p);
                }
            }
        }
        let o = Point::new(0,0);
        let mut res = s.iter().map(|p| {
            manhattan_distance(&o, &p)
        }).collect::<Vec<i32>>();
        res.sort();
        assert_eq!(res[0], 159);
    }
}
