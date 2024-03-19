import { AbstractGraph } from "../graph_abstract";

console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[3,4],[4,5]]).sizeConnectedComponentOf(0) == 3);
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[3,4],[4,5]]).sizeConnectedComponentOf(1) == 3);
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[3,4],[4,5]]).sizeConnectedComponentOf(3) == 3);

console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,0], [3,4]]).sizeConnectedComponentOf(0) == 3);

console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,3],[2,4],[1,5]]).sizeConnectedComponentOf(1) == 6);
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,3],[2,4],[1,5]]).maxCutEdge() == 1);
