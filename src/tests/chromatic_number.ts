import { Graph } from "../graph";

// chi(P2) = 2
console.log(Graph.from_list([[0,1],[1,2]]).chromatic_number() == 2);

// chi(P3) = 2
console.log(Graph.from_list([[0,1],[1,2],[2,3]]).chromatic_number() == 2);

// chi(K3) = 3
console.log(Graph.from_list([[0,1],[1,2],[2,0]]).chromatic_number() == 3);

// chi(K4) = 4
console.log(Graph.from_list([[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]).chromatic_number() == 4);

// chi(C5) = 3
console.log(Graph.from_list([[0,1],[1,2],[2,3],[3,4],[4,0]]).chromatic_number() == 3);
