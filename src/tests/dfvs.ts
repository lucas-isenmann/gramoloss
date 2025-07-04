import { bruteforceMinSubsetVertices } from "../algorithms/bruteforce";
import { isDFVS } from "../algorithms/dfvs";
import { Graph } from "../graph";


// Check on random oriented graphs
// console.log("Check on random oriented graphs")
// for (let i = 0; i < 100; i ++){
//     const g = Graph.generateRandomOGNP(14, Math.random());
//     const r = bruteforceMinSubsetVertices(g, DFVSproperty, false);
//     const r2 = g.directedFeedbackVertexSetNumber();
//     if (r.minimum != r2){
//         console.log("bug", g.links.values());
//     }
// }

// a planar graph
const g0 = Graph.fromArcs(
    [[0,1],[4,5],[0,6],[9,5],[6,7],[5,7],[7,9],[3,4],[3,1],[7,3],[3,6],[1,2],[2,3],[2,8],[8,0]]);
console.log(g0.directedFeedbackVertexSetNumber() == 2);

// an arc and an oriented triangle
const g1 = Graph.fromArcs([[0,1],[2,3],[3,4],[4,2]]);
console.log(g1.directedFeedbackVertexSetNumber() == 1);

// two disjoint oriented triangles
const g2 = Graph.fromArcs([[0,1],[1,2],[2,0],[3,4],[4,5],[5,3]]);
console.log(g2.directedFeedbackVertexSetNumber() == 2);

// an oriented 2-cycle
const g3 = Graph.fromArcs([[0,1],[1,0]]);
console.log(g3.directedFeedbackVertexSetNumber() == 1);


console.log(Graph.orientedPath(3).directedFeedbackVertexSetNumber() == 0);
console.log(Graph.orientedPath(4).directedFeedbackVertexSetNumber() == 0);
console.log(Graph.orientedPath(5).directedFeedbackVertexSetNumber() == 0);
console.log(Graph.orientedPath(6).directedFeedbackVertexSetNumber() == 0);
console.log(Graph.orientedCycle(3).directedFeedbackVertexSetNumber() == 1);
console.log(Graph.orientedCycle(4).directedFeedbackVertexSetNumber() == 1);
console.log(Graph.orientedCycle(5).directedFeedbackVertexSetNumber() == 1);
console.log(Graph.orientedCycle(6).directedFeedbackVertexSetNumber() == 1);
console.log(Graph.Paley(7).directedFeedbackVertexSetNumber() == 4)
console.log(Graph.Paley(11).directedFeedbackVertexSetNumber() == 7)
console.log(Graph.Paley(19).directedFeedbackVertexSetNumber() == 14)

// // Speed test
// // console.time("dfvs");
// console.log(Graph.Paley(23).directedFeedbackVertexSetNumber()) // 19s
// console.timeEnd("dfvs")