import GeneticAlgorithm from '../genetic'

function decodeCircle(encoded) {
  if(encoded === undefined) {
    return new Circle({ })
  }

  let eX = encoded.substring(0, 32)
  let eY = encoded.substring(32, 64)
  let eZ = encoded.substring(64)
  let x = parseInt(eX, '2')
  let y = parseInt(eY, '2')
  let radius = parseInt(eZ, '2')
  return new Circle({ x, y, radius })
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
    this._fitness = 0
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

  set fitness(f) {
    this._fitness = f
  }

  get fitness() {
    return this._fitness
  }

  encode() {
    let pX = pad(32, this._x)
    let pY = pad(32, this._y)
    let pR = pad(32, this._radius)
    return pX + pY + pR
  }

  show() {
    let { r, pos: { x, y }, fitness } = this
    return `Circle(x=${x},y=${y},r=${r},f=${fitness})`
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

  generateRandomCircles(popSize) {
    let maxRadius = Math.min(this._boxWidth, this._boxHeight) / 2

    let circles = [
      new Circle({
        x: Math.floor(Math.random() * this._boxWidth),
        y: Math.floor(Math.random() * this._boxHeight),
        radius: Math.floor(Math.random() * maxRadius),
      })
    ]
    while(circles.length < popSize) {
      let newC = new Circle({
        x: Math.floor(Math.random() * this._boxWidth),
        y: Math.floor(Math.random() * this._boxHeight),
        radius: Math.floor(Math.random() * maxRadius),
      })

      if(circles.findIndex((c) => c.overlaps(newC)) === -1) {
        circles.push(newC)
      }
    }

    return circles
  }

  initPopulation() {
    this._circles = this.generateRandomCircles(this._initialCircles)

    return this.generateRandomCircles(this.populationSize).map((c) => c.encode())
  }

  fitness(encoded) {
    // calculate number overlapping, reduce fitness based on that
    let decoded = decodeCircle(encoded)
    let numOverlapping = this._circles
      .map((c) => c.overlaps(decoded))
      .filter((t) => t)
      .length

    // make sure (cx, cy, cr) keep the circle inside the box from
    // (0,0) to (boxWidth, boxHeight)

    return numOverlapping === 0 ? decoded.r : -numOverlapping
  }

  show(genome) {
    let c = decodeCircle(genome)
    c.fitness = this.fitness(genome)
    return c.show()
  }
}
