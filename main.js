import ExpressionSearch from './expression/'
import CircleSearch from './circles/'

// let s = new ExpressionSearch({
//   populationSize: 20,
//   initialGenomeSize: 30,
//   crossoverRate: 0.7,
//   mutationRate: 0.01,

//   target: 42
// });
// s.run()

let s = new CircleSearch({
  populationSize: 20,
  initialGenomeSize: 30,
  crossoverRate: 0.7,
  mutationRate: 0.01,

  initialCircles: 10,
  boxWidth: 200,
  boxHeight: 200
})
s.run()
