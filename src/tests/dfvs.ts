import { AbstractGraph } from "../graph_abstract";


// console.log(AbstractGraph.generatePaley(7).minDirectedFeedbackVertexSet())
// console.log(AbstractGraph.orientedCycle(4).minDirectedFeedbackVertexSet());
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