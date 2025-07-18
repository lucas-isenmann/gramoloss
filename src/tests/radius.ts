import { Graph } from "../graph";


// P3
const g1 = Graph.fromEdges([[0,1],[1,2]]);
console.log(g1.radius(undefined)[0] == 1)

// P4
const g2 = Graph.fromEdges([[0,1],[1,2], [2,3]]);
console.log(g2.radius(undefined)[0] == 2)

// Star 3
const g3 = Graph.fromEdges([[0,1],[0,2], [0,3]]);
console.log(g3.radius(undefined)[0] == 1)