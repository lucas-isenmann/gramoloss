import { AbstractGraph } from "../graph_abstract";

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