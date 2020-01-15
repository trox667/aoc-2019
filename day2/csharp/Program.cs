using System;
using System.Collections.Generic;
using IntCode;
using InputReader;

namespace playground
{
  class Program
  {
    static void search() {
      var lines = Reader.readLines("input");
      if (lines.Count > 0)
      {
        var memory = Reader.lineToInts(lines[0]);
        for(var i = 0; i <= 100; i++) {
          for(var j = 0; j <= 100; j++) {
            var curr = new List<int>(memory);
            curr[1] = i;
            curr[2] = j;
            var computer = new Computer(curr);
            var result = computer.run();
            if(result == 19690720) {
              Console.WriteLine($"{100 * i + j}");
              return;
            }
          }
        }
      }
    }

    static void Main(string[] args)
    {
      // var memory = new List<int> {1,0,0,0,99};
      // var memory = new List<int> {2,3,0,3,99};
      // var memory = new List<int> {2,4,4,5,99,0};
      // var memory = new List<int> {1,1,1,4,99,5,6,0,99};
      var lines = Reader.readLines("input");
      if (lines.Count > 0)
      {
        var memory = Reader.lineToInts(lines[0]);
        memory[1] = 12;
        memory[2] = 2;
        var computer = new Computer(memory);
        Console.WriteLine(computer.run());
      }

      search();
    }
  }
}
