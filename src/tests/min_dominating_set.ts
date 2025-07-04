
// -----------------
// Domination number

import { Graph } from "../graph"

console.log(Graph.path(4).dominationNumber() == 2)
console.log(Graph.path(6).dominationNumber() == 2)
console.log(Graph.path(7).dominationNumber() == 3)
console.log(Graph.path(20).dominationNumber() == 7)
console.log(Graph.path(22).dominationNumber() == 8)  
console.log(Graph.path(23).dominationNumber() == 8)  
console.log(Graph.path(24).dominationNumber() == 8) 

console.log(Graph.clique(4).dominationNumber() == 1)

console.log(Graph.Paley(5).dominationNumber() == 2)
console.log(Graph.Paley(13).dominationNumber() == 3)
console.log(Graph.Paley(29).dominationNumber() == 4)

console.log(Graph.petersen().dominationNumber() == 3);


// ---------------------------------
// Independent domination number IDN

// Example of graph where IDN > DN
const g1 = Graph.fromEdges([[0,2],[0,3],[0,4],[1,2],[1,3],[1,4],[2,3],[2,4],[2,5],[3,6],[3,7],[4,6],[4,7],[5,6],[5,7]]);
console.log(g1.dominationNumber() == 2);
console.log(g1.independentDominationNumber() == 3);

// For a bipartite complete graph Knm
// IDN = min(n,m)
// DN = 2
// CDN = 2


console.log(Graph.petersen().independentDominationNumber() == 3);


// ---------------------------
// Connected Domination Number

// For a path, CDN = n-2, DN like n/3 

console.log(Graph.path(2).connectedDominationNumber() == 1);
console.log(Graph.path(5).connectedDominationNumber() == 3);
console.log(Graph.clique(4).connectedDominationNumber() == 1);
console.log(Graph.Paley(5).connectedDominationNumber() == 3);
console.log(Graph.Paley(13).connectedDominationNumber() == 4);
console.log(Graph.petersen().connectedDominationNumber() == 4);

