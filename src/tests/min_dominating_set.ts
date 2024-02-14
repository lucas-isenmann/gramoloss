import { AbstractGraph } from "../graph_abstract";


console.log(AbstractGraph.generatePath(4).minDominatingSet().size == 2)
console.log(AbstractGraph.generatePath(6).minDominatingSet().size == 2)
console.log(AbstractGraph.generatePath(20).minDominatingSet().size == 7)

console.log(AbstractGraph.generateClique(4).minDominatingSet().size == 1)

console.log(AbstractGraph.generatePaley(5).minDominatingSet().size == 2)
console.log(AbstractGraph.generatePaley(13).minDominatingSet().size == 3)