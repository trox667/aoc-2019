const fs = require('fs')
const readline = require('readline')

const ADD = 1
const MULTIPLY = 2
const TERMINATE = 99

const TARGET = 19690720

const readInterface = readline.createInterface({
  input: fs.createReadStream('../input')
})
let lines = []
readInterface.on('line', line => lines.push(line.trim()))

readInterface.on('close', () => {
  const tokens = lines[0].split(',').map(val => parseInt(val))
  const tokens2 = [...tokens]
  tokens[1] = 12
  tokens[2] = 2
  run(tokens)
  console.log(`Part 1: ${tokens[0]}`)
  const [n,v] = search(tokens2)
  console.log(`Part 2: ${n * 100 + v}`)
})

const search = (d) => {
  for(let n = 0; n < 99; n++) {
    for(let v = 0; v < 99; v++) {
      let dc = [...d]
      dc[1] = n
      dc[2] = v
      run(dc)
      if(dc[0] == TARGET) {
        return [n,v]
      }
    }
  }
}

const run = (d) => {
  let i = 0;
  while(i < d.length) {
    if(d[i] == TERMINATE) return;
    else if(d[i] == ADD || d[i] == MULTIPLY) {
      let res = op(d[i], d[d[i+1]], d[d[i+2]])
      if(res != null)
        d[d[i+3]] = res
      i += 4
    } else {
      i++
    }
  }
}

const op = (c, in1, in2) => {
  if(c == ADD) return in1 + in2
  else if(c == MULTIPLY) return in1 * in2
  else return null
}
