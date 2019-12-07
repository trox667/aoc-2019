open System
open System.IO

let toIntArr (line: string) =
  line.Split "," |> Seq.map int |> Seq.toArray

let unpack parameters (index: int) =
  match Seq.tryItem index parameters with
    | Some(a) -> a
    | None -> 0

let splitCombined (v: int) = 
  let op = v.ToString() |> Seq.rev |> Seq.take 2 |> Seq.rev |> String.Concat |> int
  let parameters = v.ToString() |> Seq.rev |> Seq.skip 2 |> Seq.map (fun c -> c.ToString() |> int) |> Seq.toArray
  let unpackParameters = unpack parameters
  (op, unpackParameters 0, unpackParameters 1, unpackParameters 2)

let isCombined (v:int) =
  v > 100

let access (data: int[]) (pointer: int) =
  if pointer >= Array.length data then
    //printfn "ERROR -> %i" pointer
    0
  else 
    data.[pointer]

let getValue (data: int[]) (pointer: int) (immediate: int) =
  let accessData = access data
  match immediate with
  | 0 -> accessData (accessData pointer)
  | _ -> accessData pointer

let isInput (op: int) =
  match op with
  | 3 -> true
  | _ -> false

let getInstruction (data: int[]) (pointer: int) =
  let accessData = access data
  match isCombined (accessData pointer) with
  | true -> 
    let (op, p1, p2, p3) = accessData pointer |> splitCombined
    let r1 = getValue data (pointer+1) (if isInput op then 1 else p1)
    let r2 = getValue data (pointer+2) p2
    let r3 = getValue data (pointer+3) 1

    (op, r1, r2, r3)
  | false ->
    let op = accessData pointer
    let r1 = getValue data (pointer+1) (if isInput op then 1 else 0)
    let r2 = getValue data (pointer+2) 0
    let r3 = getValue data (pointer+3) 1

    (op, r1, r2, r3)

let getInput (inputs: int[]) (input: int) = 
  if Array.isEmpty inputs then
    (inputs, input)
  else 
    (Array.skip 1 inputs, inputs.[0])

let rec run pointer (data: int[]) (inputs: int[]) (input: int) (output: int[]) =
  let (op, p1, p2, p3) = getInstruction data pointer
  match op with
  | 1 -> 
    let res = p1+p2
    Array.set data p3 res
    run (pointer+4) data inputs res output
  | 2 -> 
    let res = p1*p2
    Array.set data p3 res
    run (pointer+4) data inputs res output
  | 3 ->
    let i = getInput inputs input
    Array.set data p1 (snd i)
    run (pointer+2) data (fst i) input output
  | 4 ->
    let o = Array.append output [|p1|]
    run (pointer+2) data inputs input o
  | 5 ->
    if p1 <> 0 then
      run (p2) data inputs input output
    else
      run (pointer+3) data inputs input output
  | 6 -> 
    if p1 = 0 then
      run (p2) data inputs input output
    else
      run (pointer+3) data inputs input output
  | 7 ->
    if p1 < p2 then
      Array.set data p3 1
    else 
      Array.set data p3 0
    run (pointer+4) data inputs input output
  | 8 ->
    if p1 = p2 then
      Array.set data p3 1
    else 
      Array.set data p3 0
    run (pointer+4) data inputs input output
  | 99 ->
    output
  | _ ->
    run (pointer+1) data inputs input output

let runAmplifiers (data: int[]) (settings: int[]) =
  let amplifierSettings = [|settings.[0]; 0|]
  let run1 = run 0 (Array.copy data) amplifierSettings 0 [||] |> Array.last
  let amplifierSettings = [|settings.[1]; run1|]
  let run2 = run 0 (Array.copy data) amplifierSettings 0 [||] |> Array.last
  let amplifierSettings = [|settings.[2]; run2|]
  let run3 = run 0 (Array.copy data) amplifierSettings 0 [||] |> Array.last
  let amplifierSettings = [|settings.[3]; run3|]
  let run4 = run 0 (Array.copy data) amplifierSettings 0 [||] |> Array.last
  let amplifierSettings = [|settings.[4]; run4|]
  let run5 = run 0 (Array.copy data) amplifierSettings 0 [||] |> Array.last
  run5

let searchAmplifierValue (data: int[]) = 
  let r = [|0;1;2;3;4|]
  let mutable result = 0
  Array.iter (fun i1 ->
    Array.iter (fun i2 ->
      Array.iter (fun i3 ->
        Array.iter (fun i4 ->
          Array.iter (fun i5 ->
            let count = runAmplifiers data [|i1;i2;i3;i4;i5|]
            result <- max result count
          ) r
        ) r
      ) r
    ) r
  ) r
  result

let tests () =
  //let data = [|3;15;3;16;1002;16;10;16;1;16;15;15;4;15;99;0;0|]
  //let settings = [|4;3;2;1;0|]
  //runAmplifiers data settings |> printfn "%i"
  //let data = [|3;23;3;24;1002;24;10;24;1002;23;-1;23;101;5;23;23;1;24;23;23;4;23;99;0;0|]
  //let settings = [|0;1;2;3;4|]
  //runAmplifiers data settings |> printfn "%i"
  //let data = [|3;31;3;32;1002;32;10;32;1001;31;-2;31;1007;31;0;33;1002;33;7;33;1;33;31;31;1;32;31;31;4;31;99;0;0;0|]
  //let settings = [|1;0;4;3;2|]
  //runAmplifiers data settings |> printfn "%i"

  let data = [|3;15;3;16;1002;16;10;16;1;16;15;15;4;15;99;0;0|]
  searchAmplifierValue data |> printfn "should be 43210, is: %i"
  true

let testDay5() =
    let data = File.ReadAllLines "D:/sw/rust/aoc-2019/day5/input" |> Array.item 0 |> toIntArr 
    let part1 = run 0 data [||] 1 [||] 

    let data = File.ReadAllLines "D:/sw/rust/aoc-2019/day5/input" |> Array.item 0 |> toIntArr 
    let part2 = run 0 data [||] 5 [||]
    Array.last part1 |> printfn "%i" 
    Array.last part2 |> printfn "%i" 
    Array.last part1 = 15314507 && Array.last part2 = 652726 

[<EntryPoint>]
let main argv =
  if tests() && testDay5() then
      printfn "Tests successfully run"
      let data = File.ReadAllLines "D:/sw/rust/aoc-2019/day7/input" |> Array.item 0 |> toIntArr 
      searchAmplifierValue data |> printfn "Part 1: %i"

  else 
    printfn "Tests failed"
  0 // return an integer exit code
