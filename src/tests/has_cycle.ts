import { Graph } from "../graph";

console.log(Graph.from_list([[2,3]]).has_cycle() == false);
console.log(Graph.from_list([[0,1],[1,2],[2,0]]).has_cycle() == true);
console.log(Graph.from_list([[0,1],[1,2],[2,3],[3,0]]).has_cycle() == true);
console.log(Graph.from_list([[0,1],[1,2],[2,4],[2,3],[3,1]]).has_cycle() == true);
console.log(Graph.from_list([[0,1],[1,2],[3,4],[4,5]]).has_cycle() == false);