import { bruteforceMinSubsetVertices } from "../algorithms/bruteforce";
import { DFVSproperty } from "../algorithms/dfvs";
import { AbstractGraph } from "../graph_abstract";


// Check on random oriented graphs
// console.log("Check on random oriented graphs")
// for (let i = 0; i < 100; i ++){
//     const g = AbstractGraph.generateRandomOGNP(14, Math.random());
//     const r = bruteforceMinSubsetVertices(g, DFVSproperty, false);
//     const r2 = g.directedFeedbackVertexSetNumber();
//     if (r.minimum != r2){
//         console.log("bug", g.links.values());
//     }
// }

// a planar graph
const g0 = AbstractGraph.fromArcsListDefault(
    [[0,1],[4,5],[0,6],[9,5],[6,7],[5,7],[7,9],[3,4],[3,1],[7,3],[3,6],[1,2],[2,3],[2,8],[8,0]]);
console.log(g0.directedFeedbackVertexSetNumber() == 2);

// an arc and an oriented triangle
const g1 = AbstractGraph.fromArcsListDefault([[0,1],[2,3],[3,4],[4,2]]);
console.log(g1.directedFeedbackVertexSetNumber() == 1);

// two disjoint oriented triangles
const g2 = AbstractGraph.fromArcsListDefault([[0,1],[1,2],[2,0],[3,4],[4,5],[5,3]]);
console.log(g2.directedFeedbackVertexSetNumber() == 2);

// an oriented 2-cycle
const g3 = AbstractGraph.fromArcsListDefault([[0,1],[1,0]]);
console.log(g3.directedFeedbackVertexSetNumber() == 1);


console.log(AbstractGraph.orientedPath(3).directedFeedbackVertexSetNumber() == 0);
console.log(AbstractGraph.orientedPath(4).directedFeedbackVertexSetNumber() == 0);
console.log(AbstractGraph.orientedPath(5).directedFeedbackVertexSetNumber() == 0);
console.log(AbstractGraph.orientedPath(6).directedFeedbackVertexSetNumber() == 0);
console.log(AbstractGraph.orientedCycle(3).directedFeedbackVertexSetNumber() == 1);
console.log(AbstractGraph.orientedCycle(4).directedFeedbackVertexSetNumber() == 1);
console.log(AbstractGraph.orientedCycle(5).directedFeedbackVertexSetNumber() == 1);
console.log(AbstractGraph.orientedCycle(6).directedFeedbackVertexSetNumber() == 1);
console.log(AbstractGraph.generatePaley(7).directedFeedbackVertexSetNumber() == 4)
console.log(AbstractGraph.generatePaley(11).directedFeedbackVertexSetNumber() == 7)
console.log(AbstractGraph.generatePaley(19).directedFeedbackVertexSetNumber() == 14)

// // Speed test
// // console.time("dfvs");
// console.log(AbstractGraph.generatePaley(23).directedFeedbackVertexSetNumber()) // 19s
// console.timeEnd("dfvs")