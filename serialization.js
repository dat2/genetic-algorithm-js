function flip(f) {
  return (a, b) => f(b, a)
}

function isNumber(n) {
  return !isNaN(n)
}

function isOperator(n) {
  return !isNumber(n)
}

function isSame(a,b) {
  return isNaN(a) === isNaN(b)
}

function operator(o) {
  switch(o) {
    case '+':
      return (a, b) => a + b
    case '-':
      return (a, b) => a - b
    case '*':
      return (a, b) => a * b
    case '/':
      return (a, b) => a / b
    default:
      return (x) => x
  }
}

function decodeGene(p) {
  switch(p) {
    case '1010':
      return '+'
    case '1011':
      return '-'
    case '1100':
      return '*'
    case '1101':
      return '/'
    case '1110':
    case '1111':
      return ''
    default:
      return parseInt(p, 2)
  }
}

function encodeGene(p) {
  if(isNumber(p)) {
    let s = '' + parseInt(p).toString(2)
    let pad = '0000'
    return pad.substring(s.length) + s
  } else {
    switch(p) {
      case '+':
        return '1010'
      case '-':
        return '1011'
      case '*':
        return '1100'
      case '/':
        return '1101'
      default:
        return ''
    }
  }
}

// TODO filter (/ 0)
function decode(genome) {
  if(genome.length % 4 !== 0) {
    return []
  }
  let i = 0

  let decoded = Array.prototype.reduce.call(genome,
        (acc, current, idx) => {
          if(idx % 4 === 0 && idx > 0) {
            i++
            acc[i] = ''
          }
          acc[i] += current
          return acc
        }, [''])
    .map(decodeGene)
    .filter((str) => str !== '')
    .reduce(function(acc, current) {
        // if the last thing and the current thing are same type
        // of things, don't add it
        let last = acc[acc.length-1]
        if(isSame(last, current)) {
            return acc
        }
        acc.push(current)
        return acc
    }, []);

  // remove trailing operators
  let last = decoded.length - 1
  if(isOperator(decoded[last])) {
    decoded.splice(last, 1)
  }

  return decoded
}

function encodeGenome(genes) {
  return genes.map(encodeGene).reduce((a, c) => a + c, '')
}

function showGenome(genome) {
  return Array.prototype.reduce.call(decode(genome), (acc, p) => `${acc} ${p}`, '')
}

function evalGenome(genome) {
  let decoded = decode(genome)
  if(decoded.length === 0) {
    return 0
  }

  let [l,o,r,...rest] = decoded
  let acc = operator(o).bind(null, l, r)

  let f = rest
    .map(function(x, idx, arr) {
      if(isNumber(x)) {
          return x
      }
      if(idx+1 == arr.length) {
        return (x) => x
      }
      return flip(operator(x)).bind(null, arr[idx+1])
    })
    .filter(isNaN)
    .reduce((acc, current) => function() { return current(acc()) }, acc)

  return f()
}

export {
  encodeGenome,
  showGenome,
  evalGenome
}
