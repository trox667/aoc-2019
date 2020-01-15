using System;
using System.Collections.Generic;
using System.IO;

namespace InputReader
{
  class Reader
  {
    public static List<string> readLines(string filepath)
    {
      var lines = new List<string>();
      var sr = new StreamReader(filepath);
      string line;
      while ((line = sr.ReadLine()) != null)
      {
        lines.Add(line);
      }

      return lines;
    }

    public static List<int> lineToInts(string line) {
      var ints = new List<int>();
      var tokens = line.Split(',');
      foreach(var token in tokens) {
        if(Int32.TryParse(token, out int num)) {
          ints.Add(num);
        }
      }
      return ints;
    }
  }
}