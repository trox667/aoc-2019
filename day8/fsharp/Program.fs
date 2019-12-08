// Learn more about F# at http://fsharp.org

open System
open System.IO

let WIDTH = 25
let HEIGHT = 6
let LAYERSIZE = WIDTH*HEIGHT

let toIntArr (line: string) =
  line.ToCharArray() 
    |> Array.map (fun c -> c.ToString() |> int)

let createLayers (size: int) (data: int[]) =
  data |> Array.chunkBySize size

let countDigit (digit: int) (layer: int[]) =
  layer 
    |> Array.countBy (fun d -> d = digit)
    |> Array.filter fst
    |> Array.map snd
    |> Array.tryExactlyOne

let find0 (layers: int[][]) =
  layers
    |> Array.map (fun layer ->
      match countDigit 0 layer with
      | Some c -> (c, layer)
      | None -> (0, layer)
    )
    |> Array.reduce (fun (oc, olayer) (c, layer) -> 
      if c < oc && c > 0 then  
        (c, layer)
      else 
        (oc, olayer)
    )
    |> snd

let mul1And2 (layer: int[]) =
  let one = 
    match countDigit 1 layer with
    | Some i -> i
    | None -> 0
  let two = 
    match countDigit 2 layer with
    | Some i -> i
    | None -> 0
  one * two

let createImage size (layers: int[][]) =
  let imageData = Array.create size 2
  for i in 0..(size-1) do
    layers 
      |> Array.iter (fun layer ->
        if imageData.[i] = 2 then
          Array.set imageData i layer.[i]
      )
  imageData

let toImage width (imageData: int[]) =
  Array.chunkBySize width imageData
    |> Array.iter (fun line ->
      line |> Array.iter (fun c ->
        if c = 0 then 
          printf "#" 
        else 
          printf " "
      ) 
      printf "\n"
    )

[<EntryPoint>]
let main argv =
    let data = File.ReadAllLines "../input" |> Array.item 0 |> toIntArr 
    data 
      |> createLayers LAYERSIZE 
      |> find0
      |> mul1And2
      |> printfn "Part 1: %i"
    printfn "Part 2:"
    data 
      |> createLayers LAYERSIZE 
      |> createImage LAYERSIZE
      |> toImage WIDTH
    0 // return an integer exit code
