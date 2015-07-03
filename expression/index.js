import GeneticAlgorithm from '../genetic'
import { encodeGenome, showGenome, evalGenome } from './serialization'

export default class ExpressionSearch extends GeneticAlgorithm {
  constructor(config) {
    super(Object.assign(config, { fitnessThreshold: 1 }))
    let { target } = config;
    this.target = target
  }

  initPopulation() {
    let zeros = Array.apply(null, Array(this.populationSize)).map(Number.prototype.valueOf,0)
    return zeros
      .map(() => {
        let chars = [0,1,2,3,4,5,6,7,8,9,'+','-','*','/']

        let size = Math.floor(Math.random() * (this.initialGenomeSize - 1)) + 1
        let genChar = () => chars[Math.floor(Math.random() * chars.length)]

        let genes = []
        for(let i = 0; i < size; i++) {
          genes.push(genChar())
        }

        return genes
      })
      .map(encodeGenome)
  }

  fitness(genome) {
    let val = evalGenome(genome)
    let v = Math.abs(this.target - (isNaN(val) ? 0 : val))
    return (1 / (1 + v))
  }

  show(genome) {
    return showGenome(genome)
  }
}
