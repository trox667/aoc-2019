// Learn more about F# at http://fsharp.org

open System

let INPUT = "168630-718098"

let neverDecrease (value: string) =
  let res = 
    value 
    |> Seq.map (fun v -> v.ToString() |> int) 
    |> Seq.toList 
    |> Seq.pairwise 
    |> Seq.map (fun p -> fst p <= snd p )

  not (Seq.contains false res)

let adjacentPair (value: string) =
  let res = 
    value |> Seq.map (fun v -> v.ToString() |> int) 
          |> Seq.toList 
          |> Seq.pairwise 
          |> Seq.map (fun p -> fst p = snd p ) 
          |> Seq.filter (id)
  Seq.length res > 0

[<EntryPoint>]
let main argv =
    let input = INPUT.Split [|'-'|]
    let s = input.[0] |> int
    let e = input.[1] |> int

    printfn "%i - %i" s e
    let res = 
      seq { for i in s..e do yield i.ToString()} 
      |> Seq.filter (fun v -> adjacentPair v && neverDecrease v)

    Seq.length res |> printfn "Part 1: %i" 

    0 // return an integer exit code
