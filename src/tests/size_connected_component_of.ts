import { Graph } from "../graph";

console.log(Graph.from_list([[0,1],[1,2],[3,4],[4,5]]).size_connected_component_of(0) == 3);
console.log(Graph.from_list([[0,1],[1,2],[3,4],[4,5]]).size_connected_component_of(1) == 3);
console.log(Graph.from_list([[0,1],[1,2],[3,4],[4,5]]).size_connected_component_of(3) == 3);

console.log(Graph.from_list([[0,1],[1,2],[2,0], [3,4]]).size_connected_component_of(0) == 3);

console.log(Graph.from_list([[0,1],[1,2],[2,3],[2,4],[1,5]]).size_connected_component_of(1) == 6);
console.log(Graph.from_list([[0,1],[1,2],[2,3],[2,4],[1,5]]).max_cut_edge() == 1);
