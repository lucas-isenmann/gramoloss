import { AbstractGraph } from "../graph_abstract";

// -----------------
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

console.log(AbstractGraph.petersen().dominationNumber() == 3);


// ---------------------------------
// Independent domination number IDN

// Example of graph where IDN > DN
const g1 = AbstractGraph.fromEdgesListDefault([[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[2,5],[3,6],[3,7],[4,6],[4,7],[5,6],[5,7]]);
console.log(g1.dominationNumber() == 2);
console.log(g1.independentDominationNumber() == 3);

// For a bipartite complete graph Knm
// IDN = min(n,m)
// DN = 2
// CDN = 2


console.log(AbstractGraph.petersen().independentDominationNumber() == 3);


// ---------------------------
// Connected Domination Number

// For a path, CDN = n-2, DN like n/3 

console.log(AbstractGraph.generatePath(2).connectedDominationNumber() == 1);
console.log(AbstractGraph.generatePath(5).connectedDominationNumber() == 3);
console.log(AbstractGraph.generateClique(4).connectedDominationNumber() == 1);
console.log(AbstractGraph.generatePaley(5).connectedDominationNumber() == 3);
console.log(AbstractGraph.generatePaley(13).connectedDominationNumber() == 4);
console.log(AbstractGraph.petersen().connectedDominationNumber() == 4);

