import { Graph } from "../graph";
import { AbstractGraph } from "../graph_abstract";

const g1 = new Graph();
const g2 = AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,0]]);
g1.pasteGraph(g2);
console.log(g1.vertices.size == 3);
console.log(g1.links.size == 3);

g1.pasteGraph(g2);
console.log(g1.vertices.size == 6);
console.log(g1.links.size == 6);