function binarySearch(v, array) {
  if(array.length === 1) {
    return array[0]
  }

  let mid = Math.floor(array.length / 2) - 1
  if(v < array[mid]) {
    return binarySearch(v, array.slice(0, mid + 1))
  } else {
    return binarySearch(v, array.slice(mid + 1))
  }
}

function flipBit(b) {
  return b === '1' ? '0' : '1'
}

export default class GeneticAlgorithm {
  constructor({ populationSize, initialGenomeSize, crossoverRate, mutationRate, fitnessThreshold }) {
    this.populationSize = populationSize
    this.initialGenomeSize = initialGenomeSize

    this.crossoverRate = crossoverRate
    this.mutationRate = mutationRate
    this.fitnessThreshold = fitnessThreshold

    this.population = this.initPopulation()
    this.generation = 0
  }

  // must return encoded population
  initPopulation() {
    return []
  }

  fitness(genome) {
    return 0.0
  }

  show(genome) {
    return ''
  }

  // functions needed for select
  weightPopulation() {
    let populationFitness = population.map(this.fitness.bind(this))
    let fs = populationFitness.map((x) => x === 0 ? 0.001 : x)

    let totalFitness = fs.reduce((a, b) => a + b)
    let weightedFitness = fs.map((f) => f / totalFitness)

    return weightedFitness
  }

  rouletteSelect() {
    let weights = this.weightPopulation()

    let cdf = weights.reduce((acc, c) => {
      let last = acc[acc.length - 1]
      acc.push(c + last)
      return acc
    }, [0])
    cdf.splice(0, 1)

    let random = Math.random()

    let idx = cdf.indexOf(binarySearch(random, cdf))
    let chosen = population[idx]
    return chosen
  }

  bestSelect() {
    return this.getCurrentBest()
  }

  // destructive to population
  select() {
    // TODO let user pass select options
    // let genome = this.rouletteSelect()
    let genome = this.bestSelect()
    let idx = this.population.indexOf(genome)
    this.population.splice(idx, 1)

    return genome
  }

  // a and b must be encoded already
  cross(a, b) {
    let minLength = Math.min(a.length, b.length)

    let pos = Math.floor(Math.random() * minLength)
    let aPre = a.slice(0, pos)
    let bPre = b.slice(0, pos)

    let aPost = a.slice(pos)
    let bPost = b.slice(pos)

    return [aPre + bPost, bPre + aPost]
  }

  // genome must be encoded
  mutate(genome) {
    let mapped = Array.prototype.map.call(genome, (b) => (Math.random() <= this.mutationRate) ? flipBit(b) : b);
    return Array.prototype.reduce.call(mapped, (acc, p) => acc + p, '')
  }

  getCurrentBest() {
    let populationFitness = this.population.map((g) => this.fitness(g))
    let maxFitness = Math.max.apply(null, populationFitness)
    let idx = populationFitness.indexOf(maxFitness)
    return this.population[idx]
  }

  iterate() {
    let pCopy = this.population.slice()
    let popLen = this.population.length

    let newPopulation = []
    while(newPopulation.length != popLen) {
      let a = this.select()
      let b = this.select()

      let crossed = this.cross(a,b)
      let [ma, mb] = crossed.map(this.mutate.bind(this))
      newPopulation.push(ma, mb)
    }

    return newPopulation
  }

  logGeneration(best) {
    console.log(`Generation ${this.generation}`)
    console.log(`Best: ${this.show(best)}`)
    console.log(`Fitness: ${this.fitness(best)}`)
  }

  logResult(found) {
    console.log(`Searched ${this.generation} generations.`)
    console.log(`Result genome: ${this.show(found)}`)
  }

  run() {
    let best = this.getCurrentBest()
    do {
      best = this.getCurrentBest()
      this.logGeneration(best)

      this.population = this.iterate()
      this.generation++
    } while(this.fitness(best) < this.fitnessThreshold)

    this.logResult(this.getCurrentBest())

    return this.getCurrentBest()
  }
}
