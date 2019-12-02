open System.IO

let massToFuel mass =
  let res = floor (mass / 3.0) - 2.0
  match res with
  | res when res > 0.0 -> (int) res
  | _ -> 0

let fuelAmount lines =
  Array.map float lines
  |> Array.sumBy massToFuel

let rec totalMassToFuel mass =
  let fuel = massToFuel mass
  match fuel with
  | fuel when fuel > 0 -> fuel + totalMassToFuel ((float)fuel)
  | _ -> fuel

let totalFuelAmount lines =
  Array.map float lines
  |> Array.sumBy totalMassToFuel

[<EntryPoint>]
let main argv =
    let fuelAmount = File.ReadAllLines("input") |> fuelAmount
    printfn "Part1: fuel amount: %i" fuelAmount
    let totalFuelAmount = File.ReadAllLines("input") |> totalFuelAmount
    printfn "Part2: total fuel amount: %i" totalFuelAmount
    
    0 
