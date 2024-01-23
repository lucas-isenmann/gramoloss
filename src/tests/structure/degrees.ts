import { AbstractGraph } from "../../graph_abstract";

const g = AbstractGraph.generatePath(3);

console.log(g.degree(0) == 1);
console.log(g.degree(1) == 2);
console.log(g.degree(3) == 0);

const g2 = AbstractGraph.generatePaley(3);
console.log(g2.inDegree(0) == 1);
console.log(g2.outDegree(0) == 1);




