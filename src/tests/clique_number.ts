// Clique Number unit tests

import { AbstractGraph } from "../graph_abstract";


// w(Pm) = 2 if m >= 1
console.log("Test paths");
for (let i = 3; i < 8; i ++){
    console.log(AbstractGraph.generatePath(i).clique_number() == 2);
}

// w(Kn) = n 
console.log("Test cliques");
for (let i = 3; i < 8; i ++){
    console.log(AbstractGraph.generateClique(i).clique_number() == i);
}


// p(C5) = 2
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,3],[3,4],[4,0]]).clique_number() == 2);

// p(K33) = 2
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[0,3],[0,5],[2,1],[2,3],[2,5],[4,1],[4,3],[4,5]]).clique_number() == 2);



// Paley graphs
console.log(AbstractGraph.generatePaley(5).clique_number() == 2);
console.log(AbstractGraph.generatePaley(13).clique_number() == 3);
console.log(AbstractGraph.generatePaley(17).clique_number() == 3);
