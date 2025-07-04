// Clique Number unit tests

import { Graph } from "../graph";


// w(Pm) = 2 if m >= 1
console.log("Test paths");
for (let i = 3; i < 8; i ++){
    console.log(Graph.path(i).cliqueNumber() == 2);
}

// w(Kn) = n 
console.log("Test cliques");
for (let i = 3; i < 8; i ++){
    console.log(Graph.clique(i).cliqueNumber() == i);
}


// p(C5) = 2
console.log(Graph.fromEdges([[0,1],[1,2],[2,3],[3,4],[4,0]]).cliqueNumber() == 2);

// p(K33) = 2
console.log(Graph.fromEdges([[0,1],[0,3],[0,5],[2,1],[2,3],[2,5],[4,1],[4,3],[4,5]]).cliqueNumber() == 2);



// Paley graphs
console.log(Graph.Paley(5).cliqueNumber() == 2);
console.log(Graph.Paley(13).cliqueNumber() == 3);
console.log(Graph.Paley(17).cliqueNumber() == 3);
