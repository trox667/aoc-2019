using System;
using System.IO;
using System.Collections.Generic;

namespace csharp_1
{
    class Program
    {
        static void Main(string[] args)
        {
            var input = ReadFile("input");
            var fuel = GetFuel(input);
            Console.WriteLine("Part1: " + fuel);
            var totalFuel = GetTotalFuel(input);
            Console.WriteLine("Part2: " + totalFuel);
        }

        static List<int> ReadFile(string filename) 
        {
            var lines = System.IO.File.ReadLines(filename);
            var mass_data = new List<int>();
            foreach (string line in lines) {
                if (Int32.TryParse(line, out int num)) {
                    mass_data.Add(num);
                }
            }
            return mass_data;
        }

        static int MassToFuel(int mass) {
            var res = mass / 3 - 2;
            return res > 0 ? res : 0;
        }

        static int GetFuel(List<int> mass_data) {
            var sum = 0;
            foreach (int mass in mass_data) {
                sum += MassToFuel(mass);
            }
            return sum;
        }

        static int MassToFuelAddFuel(int mass) {
            var fuel = MassToFuel(mass);
            if (fuel > 0) {
                return fuel + MassToFuelAddFuel(fuel);
            } else {
                return fuel;
            }
        }

        static int GetTotalFuel(List<int> mass_data) {
            var sum = 0;
            foreach (int mass in mass_data) {
                sum += MassToFuelAddFuel(mass);
            }
            return sum;
        }
    }
}
