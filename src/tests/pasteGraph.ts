import { Graph } from "../graph";

const g1 = new Graph();
const g2 = Graph.from_list([[0,1],[1,2],[2,0]]);
g1.pasteGraph(g2);
console.log(g1.vertices.size == 3);
console.log(g1.links.size == 3);

g1.pasteGraph(g2);
console.log(g1.vertices.size == 6);
console.log(g1.links.size == 6);