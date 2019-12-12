// Learn more about F# at http://fsharp.org

open System

type Moon = 
  {
    x: int
    y: int
    z: int
    vx: int
    vy: int
    vz: int
  }

// <x=-1, y=0, z=2>
let createMoon (line:string) =
  let splitBeginEnd (b: int) (e: int) (s:string) =
    s.[1..s.Length-e]
  let split (t: string) (s: string) =
    s.Split t

  let inputs = 
    line 
    |> splitBeginEnd 1 2 
    |> split ", " 
    |> Array.map (fun a -> 
    (
      let a = split "=" a
      (a.[0], int a.[1])
    ))
  {x = snd inputs.[0]; y = snd inputs.[1]; z = snd inputs.[2]; vx = 0; vy = 0; vz = 0}

let gravity (x1:int) (x2:int) =
  if x1 > x2 then 
    -1
  else if x1 < x2 then
    +1
  else 0

let applyVelocity (moon: Moon) =
  {x = moon.x + moon.vx; y = moon.y + moon.vy; z = moon.z + moon.vz; vx = moon.vx; vy = moon.vy; vz = moon.vz}

let energy (moon: Moon) =
  let potential = abs moon.x + abs moon.y + abs moon.z
  let kinetic = abs moon.vx + abs moon.vy + abs moon.vz
  potential * kinetic

let updateGravity (moons: Moon list) =
  

[<EntryPoint>]
let main argv =
  0 // return an integer exit code
