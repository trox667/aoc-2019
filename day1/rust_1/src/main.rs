use baselib::io;

fn main() {
    io::read_file("sample").iter().for_each(|line| {
        println!("{}", line);
    });
}
