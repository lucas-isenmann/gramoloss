import { Graph } from "../graph";

console.log(Graph.from_list([[2,3]]).has_cycle() == false);
console.log(Graph.from_list([[0,1],[1,2],[2,0]]).has_cycle() == true);
console.log(Graph.from_list([[0,1],[1,2],[2,3],[3,0]]).has_cycle() == true);
console.log(Graph.from_list([[0,1],[1,2],[2,4],[2,3],[3,1]]).has_cycle() == true);
console.log(Graph.from_list([[0,1],[1,2],[3,4],[4,5]]).has_cycle() == false);

console.log("has_cycle2");
console.log(Graph.from_list([[2,3]]).has_cycle2() == false);
console.log(Graph.from_list([[0,1],[1,2],[2,0]]).has_cycle2() == true);
console.log(Graph.from_list([[0,1],[1,2],[2,3],[3,0]]).has_cycle2() == true);
console.log(Graph.from_list([[0,1],[1,2],[2,4],[2,3],[3,1]]).has_cycle2() == true);
console.log(Graph.from_list([[0,1],[1,2],[3,4],[4,5]]).has_cycle2() == false);

const g = Graph.from_list([[1,2],[2,3],[3,4],[4,0],[0,5],[4,6],[3,7],[2,8],[0,9],[1,10],[3,11],[4,12],[6,14],[0,13],[13,15],[11,16],[2,17],[8,18],[16,19],[16,20],[11,21],[5,22],[13,23],[9,24],[9,25],[13,26],[1,27],[17,28],[12,29],[6,30],[7,31],[10,32],[3,33],[22,34],[5,35],[15,36],[17,37],[16,38],[7,39],[20,40],[21,41],[15,42],[35,43],[26,44],[9,45],[12,46],[8,47],[17,48],[11,49]])
console.time("has_cycle");
for ( let i= 0 ; i < 10000 ; i ++){
    g.has_cycle();
}
console.timeEnd("has_cycle");

console.time("has_cycle2");
for ( let i= 0 ; i < 10000 ; i ++){
    g.has_cycle2();
}
console.timeEnd("has_cycle2");

