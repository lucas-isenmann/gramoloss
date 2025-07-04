import { Graph } from "../../graph";


const g = Graph.path(3);
console.log(g.degree(0) == 1);
console.log(g.degree(1) == 2);

const g2 = Graph.Paley(3);
console.log(g2.indegree(0) == 1);
console.log(g2.outdegree(0) == 1);




