import ExpressionSearch from './expressionSearch'

let s = new ExpressionSearch({
  populationSize: 10,
  initialGenomeSize: 15,
  crossoverRate: 0.7,
  mutationRate: 0.001,

  target: 42
});
s.run()
