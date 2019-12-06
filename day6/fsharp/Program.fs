// Learn more about F# at http://fsharp.org

open System.IO
open System.Collections.Generic

type SpaceMap = Dictionary<string, string>
let readLines (lines: string[]) =
    let space = new SpaceMap()
    Array.iter (fun (line: string) ->
      let tokens = line.Split ")" |> Seq.toArray
      if Array.length tokens >= 2 then
          space.Add(tokens.[1], tokens.[0])
    ) lines
    space

let rec getParents (space: SpaceMap) (planet: string) (parents: string list) =
    if space.ContainsKey planet then
        getParents space space.[planet] (space.[planet] :: parents)
    else
      parents

let count (space: SpaceMap) =
    let mutable count = 0
    for KeyValue(k, v) in space do
        count <- List.length (getParents space k []) + count
    count

let getCommonParents (planetsA: string list) (planetsB: string list) =
    List.filter (fun a -> 
      List.contains a planetsB
    ) planetsA |> List.take 1

let countDistanceTo (planets: string list) (planet: string) =
    let mutable count = 0
    let mutable found = false
    List.iter (fun p ->
      if p = planet then
          found <- true
      else if not found then
          count <- count + 1
      else 
          ()
    ) planets
    count

let test () =
    let data = [|
        "COM)B";
        "B)C";
        "C)D";
        "D)E";
        "E)F";
        "B)G";
        "G)H";
        "D)I";
        "E)J";
        "J)K";
        "K)L"
    |]
    let space = readLines data
    let c = count space
    c = 42

let test2 () =
    let data = [|
        "COM)B";
        "B)C";
        "C)D";
        "D)E";
        "E)F";
        "B)G";
        "G)H";
        "D)I";
        "E)J";
        "J)K";
        "K)L";
        "K)YOU";
        "I)SAN"
    |]
    let space = readLines data
    let parentsA = getParents space "YOU" [] |> List.rev
    let parentsB = getParents space "SAN" [] |> List.rev
    let commonParents = getCommonParents parentsA parentsB
    let countA = countDistanceTo parentsA  commonParents.[0]
    let countB = countDistanceTo parentsB  commonParents.[0]
    countA + countB = 4

[<EntryPoint>]
let main argv =
    if test() && test2() then
        File.ReadAllLines "../input" 
          |> readLines 
          |> count 
          |> printfn "Part 1 %i" 


    let space = File.ReadAllLines "../input" |> readLines 
    let parentsA = getParents space "YOU" [] |> List.rev
    let parentsB = getParents space "SAN" [] |> List.rev
    let commonParents = getCommonParents parentsA parentsB
    let countA = countDistanceTo parentsA  commonParents.[0]
    let countB = countDistanceTo parentsB  commonParents.[0]

    printfn "Part 2: %i" (countA + countB)
    0 // return an integer exit code
