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
    0
  else 
    data.[pointer]

let getValue (data: int[]) (pointer: int) (immediate: int) =
  let accessData = access data
  match immediate with
  | 0 -> accessData (accessData pointer)
  | _ -> accessData pointer

let getInstruction (data: int[]) (pointer: int) =
  let accessData = access data
  match isCombined (accessData pointer) with
  | true -> 
    let (op, p1, p2, p3) = accessData pointer |> splitCombined
    let r1 = getValue data (pointer+1) p1
    let r2 = getValue data (pointer+2) p2
    let r3 = getValue data (pointer+3) p3

    (op, r1, r2, r3)
  | false ->
    let op = accessData pointer
    let r1 = getValue data (pointer+1) 0
    let r2 = getValue data (pointer+2) 0
    let r3 = getValue data (pointer+3) 1

    (op, r1, r2, r3)

let rec run pointer (data: int[]) (output: int[]) =
  let (op, i1, i2, o1) = getInstruction data pointer
  match op with
  | 1 -> 
    Array.set data o1 (i1+i2)
    run (pointer+4) data output
  | 2 -> 
    Array.set data o1 (i1*i2)
    run (pointer+4) data output
  | 3 ->
    data
  | 4 ->
    data
  | 99 ->
    data
  | _ ->
    data

let tests () =
  1002 |> splitCombined |> printfn "%A"
  getInstruction [|1;0;0;3;99|] 0 |> printfn "%A"
  run 0 [|1;9;10;3;2;3;11;0;99;30;40;50|] [||] |> printfn "%A"
  true

[<EntryPoint>]
let main argv =
  if tests() then
    //let data = File.ReadAllLines "../../day2/input" |> Array.item 0 |> toIntArr
    //Array.set data 1 12
    //Array.set data 2 2
    //run 0 data [||] |> printfn "%A"
    let data = File.ReadAllLines "../input" |> Array.item 0 |> toIntArr
    printfn "%A" data
  0 // return an integer exit code
