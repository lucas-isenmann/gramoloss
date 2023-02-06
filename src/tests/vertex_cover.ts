// Vertex Cover tests


import { Graph } from "../graph";

// p(P2) = 1
console.log(Graph.from_list([[0,1],[1,2]]).vertex_cover_number() == 1);

// p(P3) = 2
console.log(Graph.from_list([[0,1],[1,2],[2,3]]).vertex_cover_number() == 2);

// p(K3) = 2
console.log(Graph.from_list([[0,1],[1,2],[2,0]]).vertex_cover_number() == 2);

// p(K4) = 3
console.log(Graph.from_list([[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]).vertex_cover_number() == 3);

// p(C5) = 3
console.log(Graph.from_list([[0,1],[1,2],[2,3],[3,4],[4,0]]).vertex_cover_number() == 3);

// p(K33) = 3
console.log(Graph.from_list([[0,1],[0,3],[0,5],[2,1],[2,3],[2,5],[4,1],[4,3],[4,5]]).vertex_cover_number() == 3);