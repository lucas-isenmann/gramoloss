import { antimagicGreedyLabelling } from "../algorithms/antimagic";
import { AbstractGraph } from "../graph_abstract";


const g = AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[1,3],[3,4],[3,5],[4,6],[5,7]]);
// const g = AbstractGraph.generateRandomGNP(10, 0.5)

antimagicGreedyLabelling(g) 

