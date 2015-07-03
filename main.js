import ExpressionSearch from './expression/'

let s = new ExpressionSearch({
  populationSize: 20,
  initialGenomeSize: 30,
  crossoverRate: 0.7,
  mutationRate: 0.01,

  target: 42
});
s.run()
