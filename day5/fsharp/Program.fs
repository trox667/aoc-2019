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

let rec run pointer (data: int[]) (input: int) (output: int[]) =
  let (op, p1, p2, p3) = getInstruction data pointer
  match op with
  | 1 -> 
    let res = p1+p2
    Array.set data p3 res
    run (pointer+4) data res output
  | 2 -> 
    let res = p1*p2
    Array.set data p3 res
    run (pointer+4) data res output
  | 3 ->
    Array.set data p1 input
    run (pointer+2) data input output
  | 4 ->
    let o = Array.append output [|p1|]
    run (pointer+2) data input o
  | 5 ->
    if p1 <> 0 then
      run (p2) data input output
    else
      run (pointer+3) data input output
  | 6 -> 
    if p1 = 0 then
      run (p2) data input output
    else
      run (pointer+3) data input output
  | 7 ->
    if p1 < p2 then
      Array.set data p3 1
    else 
      Array.set data p3 0
    run (pointer+4) data input output
  | 8 ->
    if p1 = p2 then
      Array.set data p3 1
    else 
      Array.set data p3 0
    run (pointer+4) data input output
  | 99 ->
    output
  | _ ->
    run (pointer+1) data input output

let tests () =
  //1002 |> splitCombined |> printfn "%A"
  //getInstruction [|1;0;0;3;99|] 0 |> printfn "%A"
  //run 0 [|1;9;10;3;2;3;11;0;99;30;40;50|] 0 [||] |> printfn "%A"
  //run 0 [|1002;4;3;4;33|] 0 [||] |> printfn "%A"
  true

[<EntryPoint>]
let main argv =
  if tests() then
    //let data = File.ReadAllLines "../../day2/input" |> Array.item 0 |> toIntArr
    //Array.set data 1 12
    //Array.set data 2 2
    //run 0 data [||] |> printfn "%A"
    let data = File.ReadAllLines "../input" |> Array.item 0 |> toIntArr 
    run 0 data 1 [||] |> printfn "%A"
    let data = File.ReadAllLines "../input" |> Array.item 0 |> toIntArr 
    run 0 data 5 [||] |> printfn "%A"
  0 // return an integer exit code
