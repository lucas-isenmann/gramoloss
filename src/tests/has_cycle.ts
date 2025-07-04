
// console.log(Graph.fromEdgesList([[2,3]]).hasCycle() == false);
// console.log(Graph.fromEdgesList([[0,1],[1,2],[2,0]]).hasCycle() == true);
// console.log(Graph.fromEdgesList([[0,1],[1,2],[2,3],[3,0]]).hasCycle() == true);
// console.log(Graph.fromEdgesList([[0,1],[1,2],[2,4],[2,3],[3,1]]).hasCycle() == true);
// console.log(Graph.fromEdgesList([[0,1],[1,2],[3,4],[4,5]]).hasCycle() == false);

import { Graph } from "../graph";


// Check on random graph that it returns a cycle

// for (let j = 0 ; j < 1000 ; j ++){
//     const g = Graph.generateRandomGNP(20, 0.1);
//     const [b, cycle] = g.hasCycle2();
//     if ( b){
//         for (let i = 0 ; i < cycle.length; i ++){
//             const j = (i+1)%cycle.length;
//             if (g.hasLink(cycle[i], cycle[j], ORIENTATION.UNDIRECTED) == false){
//                 console.log("bug", cycle[i], cycle[j]);
//                  console.log([...g.links.values()].map( v => {return [v.startVertex.index, v.endVertex.index]}))

//                 console.log(cycle)
//             }
//         }
//         // console.log("checked");
//     }
// }



console.log("has_cycle2");
console.log(Graph.fromEdges([[2,3]]).hasCycle2()[0] == false);
console.log(Graph.fromEdges([[0,1],[1,2],[2,0]]).hasCycle2()[0] == true);
console.log(Graph.fromEdges([[0,1],[1,2],[2,3],[3,0]]).hasCycle2()[0] == true);
console.log(Graph.fromEdges([[0,1],[1,2],[2,4],[2,3],[3,1]]).hasCycle2()[0] == true);
console.log(Graph.fromEdges([[0,1],[1,2],[3,4],[4,5]]).hasCycle2()[0] == false);
console.log(Graph.fromEdges([[0,1],[1,2],[2,3],[3,0],[0,4]]).hasCycle2()[1].length == 4);


// const g = Graph.fromEdgesList([[1,2],[2,3],[3,4],[4,0],[0,5],[4,6],[3,7],[2,8],[0,9],[1,10],[3,11],[4,12],[6,14],[0,13],[13,15],[11,16],[2,17],[8,18],[16,19],[16,20],[11,21],[5,22],[13,23],[9,24],[9,25],[13,26],[1,27],[17,28],[12,29],[6,30],[7,31],[10,32],[3,33],[22,34],[5,35],[15,36],[17,37],[16,38],[7,39],[20,40],[21,41],[15,42],[35,43],[26,44],[9,45],[12,46],[8,47],[17,48],[11,49]])
// console.time("has_cycle");
// for ( let i= 0 ; i < 10000 ; i ++){
//     g.hasCycle();
// }
// console.timeEnd("has_cycle");

// console.time("has_cycle2");
// for ( let i= 0 ; i < 10000 ; i ++){
//     g.hasCycle2();
// }
// console.timeEnd("has_cycle2");

console.log("getDirectedCycle");
console.log(Graph.fromArcs([]).getDirectedCycle() === undefined);
console.log(Graph.fromArcs([[2,3]]).getDirectedCycle() === undefined);
console.log(Graph.fromArcs([[0,1],[1,2],[0,2]]).getDirectedCycle() === undefined);
console.log(Graph.fromArcs([[0,1],[2,1],[0,2]]).getDirectedCycle() === undefined);

console.log(Graph.fromArcs([[0,1],[0,2],[1,2],[1,3],[2,3],[3,4],[3,5],[5,4]]).getDirectedCycle() === undefined);

const c1 = Graph.fromArcs([[1,3],[3,0],[0,1]]).getDirectedCycle();
console.log(typeof c1 != "undefined" && c1.length == 3);

const c2 = Graph.fromArcs([[3,1],[0,3],[1,0]]).getDirectedCycle();
console.log(typeof c2 != "undefined" && c2.length == 3);

const c3 = Graph.fromArcs([[0,1],[1,2],[2,3],[3,0],[3,1]]).getDirectedCycle();
console.log(typeof c3 != "undefined");


console.log(Graph.petersen().girth() == 5);
console.log(Graph.clique(4).girth() == 3);
console.log(Graph.clique(5).girth() == 3);
console.log(Graph.Paley(13).girth() == 3);
console.log(Graph.path(4).girth() == Infinity);

