// Clique Number unit tests
// p(Pm) = 2 

import { AbstractGraph, Graph } from "../graph";

// p(P2) = 2
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2]]).clique_number() == 2);

// p(P3) = 2
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,3]]).clique_number() == 2);

// p(K3) = 3
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,0]]).clique_number() == 3);

// p(K4) = 4
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]).clique_number() == 4);

// p(C5) = 2
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,3],[3,4],[4,0]]).clique_number() == 2);

// p(K33) = 2
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[0,3],[0,5],[2,1],[2,3],[2,5],[4,1],[4,3],[4,5]]).clique_number() == 2);