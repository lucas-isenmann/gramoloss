import { AbstractGraph } from "../graph_abstract";

// Domination number

console.log(AbstractGraph.generatePath(4).dominationNumber() == 2)
console.log(AbstractGraph.generatePath(6).dominationNumber() == 2)
console.log(AbstractGraph.generatePath(7).dominationNumber() == 3)
console.log(AbstractGraph.generatePath(20).dominationNumber() == 7)
console.log(AbstractGraph.generatePath(22).dominationNumber() == 8)  
console.log(AbstractGraph.generatePath(23).dominationNumber() == 8)  
console.log(AbstractGraph.generatePath(24).dominationNumber() == 8) 

console.log(AbstractGraph.generateClique(4).dominationNumber() == 1)

console.log(AbstractGraph.generatePaley(5).dominationNumber() == 2)
console.log(AbstractGraph.generatePaley(13).dominationNumber() == 3)
console.log(AbstractGraph.generatePaley(29).dominationNumber() == 4)

// Independent domination number


// It seems hard to find a graph such that the domination number is different from the indep dom number
// Here is one of them
const g1 = AbstractGraph.fromEdgesListDefault([[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[2,5],[3,6],[3,7],[4,6],[4,7],[5,6],[5,7]]);
console.log(g1.dominationNumber() == 2);
console.log(g1.independentDominationNumber() == 3);

console.log(AbstractGraph.petersen().dominationNumber() == 3);
console.log(AbstractGraph.petersen().independentDominationNumber() == 3);

