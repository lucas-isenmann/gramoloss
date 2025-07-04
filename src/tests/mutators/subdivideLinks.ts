import { Graph } from "../../graph";

const g = new Graph();
const u = g.addVertex(0, 0,0);
const v = g.addVertex(1, 1,1);
g.addEdge(u, v);
g.addArc(u,v)

g.print();

g.subdivideLinks(1);

g.print();

// for (const v of g.vertices.values()){
//     console.log(v);
// }

// for (const link of g.links.values()){
//     console.log(link);
// }




