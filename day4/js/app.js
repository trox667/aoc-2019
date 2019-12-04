const INPUT = "168630-718098";

const main = () => {
  const [start, end]= INPUT.split('-');
  const [s, e] = INPUT.split('-').map(v => parseInt(v));
  let arr1 = [];
  let arr2 = [];
  for(let i = s; i <= e; i++) {
    const v = ""+i;
    if(never_decrease(v) && adjacent_pair(v))
      arr1.push(v);
    if(never_decrease(v) && has_adjacent_pair(v))
      arr2.push(v);
  }

  console.log(`Part 1: ${arr1.length}`);
  console.log(`Part 2: ${arr2.length}`);

};

const never_decrease = value => {
  let values = value.split('').map(v => parseInt(v));
  return values.reduce((acc, v, i, arr) => {
    if(v < arr[i-1]) acc = false;
    return acc;
  }, true);
}

const adjacent_pair = value => {
  let values = value.split('').map(v => parseInt(v));
  return values.reduce((acc, v, i, arr) => {
    if(v == arr[i-1]) acc = true;
    return acc;
  }, false)
}

const has_adjacent_pair = value => {
  let values = value.split('').map(v => parseInt(v));
  return values.reduce((acc, v, i, arr) => {
    if(v == arr[i-1] && v == arr[i-2]) acc = acc ? true : false;
    else if(v == arr[i-1] && v != arr[i+1]) acc = true;
    return acc;
  }, false)
}

main()

console.log(has_adjacent_pair("123444"))
console.log(has_adjacent_pair("1223444"))
