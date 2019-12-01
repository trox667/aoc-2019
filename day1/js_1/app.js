const fs = require('fs')
const readline = require('readline')

const readInterface = readline.createInterface({
  input: fs.createReadStream('input')
})
let lines = []
readInterface.on('line', line => lines.push(line.trim()))

readInterface.on('close', () => {
  const mass_data = lines.map(line => parseInt(line))
  const sum = mass_data.map(mass => massToFuel(mass))
  .reduce((acc, v) => acc + v)
  console.log(`Part 1: ${sum}`)

  const sum2 = mass_data.map(mass => allMassToFuel(mass))
  .reduce((acc, v) => acc + v)
  console.log(`Part 2: ${sum2}`)
})

const massToFuel = mass => Math.floor(mass / 3) - 2
const allMassToFuel = mass => {
  let fuel = massToFuel(mass)
  return fuel > 0 ? fuel + allMassToFuel(fuel) : 0
}