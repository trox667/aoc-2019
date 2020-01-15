using System;
using System.Collections.Generic;

namespace IntCode
{
  class Computer
  {
    public List<int> memory { get; }
    private int position = 0;

    public Computer(List<int> memory)
    {
      this.memory = memory;
    }

    private int read()
    {
      return this.memory[this.position++];
    }

    private int read(int position)
    {
      return this.memory[position];
    }

    private void write(int position, int v)
    {
      this.memory[position] = v;
    }

    public int run()
    {
      var stop = false;

      while (!stop)
      {
        var instruction = this.read();
        switch (instruction)
        {
          case 1:
            {
              var p1 = read(read());
              var p2 = read(read());
              var o1 = read();
              write(o1, p1 + p2);
              break;
            }
          case 2:
            {
              var p1 = read(read());
              var p2 = read(read());
              var o1 = read();
              write(o1, p1 * p2);
              break;
            }
          case 99:
            stop = true;
            break;
        }
      }
      if (this.memory.Count > 0)
        return this.memory[0];
      else
        return 0;
    }
  }
}
