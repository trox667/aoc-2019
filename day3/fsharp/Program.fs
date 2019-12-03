// Learn more about F# at http://fsharp.org

open System
open System.IO
open System.Collections.Generic

let makeMove (t: string) =
  (t.[0], int t.[1..])

let getMoves (line: string) =
  line.Split "," |> Array.map makeMove 

let calcMove moves =
  let mutable x = 0
  let mutable y = 0
  let mutable count = 0
  let counts = new Dictionary<(int * int), int>()

  for m in moves do
    match fst m with
    | 'U' -> 
      for _ = 0 to (snd m)-1 do
        y <- y + 1
        count <- count + 1
        if counts.ContainsKey (x,y) = false then
          counts.Add ((x,y), count) |> ignore
    | 'D' -> 
      for _ = 0 to (snd m)-1 do
        y <- y - 1
        count <- count + 1
        if counts.ContainsKey (x,y) = false then
          counts.Add ((x,y), count) |> ignore
    | 'L' -> 
      for _ = 0 to (snd m)-1 do
        x <- x - 1
        count <- count + 1
        if counts.ContainsKey (x,y) = false then
          counts.Add ((x,y), count) |> ignore
    | 'R' -> 
      for _ = 0 to (snd m)-1 do
        x <- x + 1
        count <- count + 1
        if counts.ContainsKey (x,y) = false then
          counts.Add ((x,y), count) |> ignore
    | _ -> ()

  counts

let manhattan x1 x2 y1 y2 =
  abs (x1 - x2) + abs (y1 - y2)

[<EntryPoint>]
let main argv =
    let lines = File.ReadAllLines("../input")
    let mapA = lines.[0] |> getMoves |> calcMove
    let mapB = lines.[1] |> getMoves |> calcMove
    let set = Set.intersect (Set.ofSeq mapA.Keys) (Set.ofSeq mapB.Keys) |> Set.map (fun s -> (manhattan 0 (fst s) 0 (snd s)), fst s, snd s) |> Set.toList |> List.sort
    printfn "Part 1: %A" (set.[0])

    let mutable res = Int32.MaxValue
    for (d, x, y) in set do
      let key = (x,y)
      let a = mapA.Item(key)
      let b = mapB.Item(key)
      res <- min (a+b) res
      
    printfn "Part 2: %i" res

    0 // return an integer exit code
