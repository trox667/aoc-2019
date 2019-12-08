// Learn more about F# at http://fsharp.org

open System
open System.IO

let toIntArr (line: string) =
  line.Split "," |> Seq.map int |> Seq.toArray

let setValues (d: int[]) =
  Array.set d 1 12
  Array.set d 2 2
  d

let rec run i (d: int[]) =
  match d.[i] with
  | 1 -> 
    Array.set d d.[i+3] (d.[d.[i+1]] + d.[d.[i+2]])
    run (i+4) d
  | 2 -> 
    Array.set d d.[i+3] (d.[d.[i+1]] * d.[d.[i+2]])
    run (i+4) d
  | 99 -> d
  | _ -> d

let rec increment (n, v) target (d: int[]) =
  let dc = Array.copy d
  Array.set dc 1 n
  Array.set dc 2 v
  let res = (run 0 dc).[0]
  printfn "%i" res
  match res with
  | _ when res = target -> (n, v)
  | _ -> 
    if n > 99 && v > 99 then
      (0, 0)
    else 
      let n = if v > 10 then n + 1 else n
      let v = if v > 10 then 0 else v + 1
      increment (n, v) target dc     


[<EntryPoint>]
let main argv =
  let lines = File.ReadAllLines("../input")
  let res = lines.[0] |> toIntArr |> setValues |> run 0
  printfn " Part 1: %i" res.[0]
  let res2 = lines.[0] |> toIntArr |> increment (0,0) 19690720
  printfn " Part 2: %i" (fst res2 * 100 + snd res2)
  0 // return an integer exit code
