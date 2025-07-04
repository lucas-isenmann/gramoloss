// Vertex Cover tests

import { Graph } from "../graph";



// p(P2) = 1
console.log(Graph.path(3).vertexCoverNumber() == 1);

// p(P3) = 2
console.log(Graph.path(4).vertexCoverNumber() == 2);

// p(K3) = 2
console.log(Graph.clique(3).vertexCoverNumber() == 2);

// p(K4) = 3
console.log(Graph.clique(4).vertexCoverNumber() == 3);

// p(C5) = 3
console.log(Graph.Paley(5).vertexCoverNumber() == 3);

// p(K33) = 3
console.log(Graph.fromEdges([[0,1],[0,3],[0,5],[2,1],[2,3],[2,5],[4,1],[4,3],[4,5]]).vertexCoverNumber() == 3);