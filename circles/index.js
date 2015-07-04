import GeneticAlgorithm from '../genetic'

function decodeCircle(encoded) {
  let x = parseInt(encoded.substring(0, 32), '2')
  let y = parseInt(encoded.substring(32, 64), '2')
  let radius = parseInt(encoded.substring(64), '2')
  return new Circle({ x, y, radius })
}

function showCircle(encoded) {
  let decoded = decodeCircle(encoded)
  let { r, pos: { x, y } } = decoded
  return `Circle (x=${x},y=${y},r=${r})`
}

function pad(n, x) {
  let padding = '0'.repeat(n)
  let str = x.toString('2')

  return padding.substring(str.length) + str
}

function euclidDistance({ x: xA, y: yA }, { x: xB, y: yB }) {
  return Math.sqrt(Math.pow(xA - xB, 2) + Math.pow(yA - yB, 2))
}

class Circle {
  constructor({ x, y, radius }) {
    this._x = x || 0
    this._y = y || 0
    this._radius = radius || 0
  }

  get pos() {
    return {
      x: this._x,
      y: this._y
    }
  }

  get r() {
    return this._radius
  }

  encode() {
    let pX = pad(32, this._x)
    let pY = pad(32, this._y)
    let pR = pad(32, this._radius)
    return pX + pY + pR
  }

  overlaps(c) {
    let { r: rT, pos: pT } = this
    let { r: rC, pos: pC } = c
    let pD = euclidDistance(pT, pC)
    return pD < rT + rC
  }
}

export default class CircleSearch extends GeneticAlgorithm {
  constructor(config) {
    super(Object.assign(config, { fitnessThreshold: Math.min(config.boxWidth, config.boxHeight) }))

    let { initialCircles, boxWidth, boxHeight } = config
    this._initialCircles = initialCircles
    this._boxWidth = boxWidth
    this._boxHeight = boxHeight

    this.population = this.initPopulation()
  }

  initPopulation() {
    let maxRadius = Math.min(this._boxWidth, this._boxHeight) / 2

    console.log(this)
    let circles = [
      new Circle({
        x: Math.floor(Math.random() * this._boxWidth),
        y: Math.floor(Math.random() * this._boxHeight),
        radius: Math.floor(Math.random() * maxRadius),
      })
    ]
    while(circles.length < this._initialCircles) {
      let newC = new Circle({
        x: Math.floor(Math.random() * this._boxWidth),
        y: Math.floor(Math.random() * this._boxHeight),
        radius: Math.floor(Math.random() * maxRadius),
      })

      if(circles.findIndex((c) => c.overlaps(newC)) === -1) {
        circles.push(newC)
      }
    }
    return circles.map((c) => c.encode())
  }

  fitness(encoded) {
    // calculate number overlapping, reduce fitness based on that
    return decodeCircle(encoded).r
  }

  show(genome) {
    return showCircle(genome)
  }
}
