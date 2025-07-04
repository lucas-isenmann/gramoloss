import { antimagicGreedyLabelling } from "../algorithms/antimagic";
import { Graph } from "../graph";


const g = Graph.fromEdges([[0,1],[1,2],[1,3],[3,4],[3,5],[4,6],[5,7]]);
// const g = Graph.generateRandomGNP(10, 0.5)

antimagicGreedyLabelling(g) 

