import { Graph } from "../graph";
import { BasicLink, Link, ORIENTATION } from "../link";

const g1 = Graph.fromListBasic([[0,0,""], [0,10,""]], [[0,1,""]]);
console.log(g1.stretch()); // should be 1

const g2 = Graph.fromListBasic([[0,0,""], [0,10,""], [10,10,""]], [[0,1,""],[1,2,""]]);
console.log(g2.stretch()); // should be sqrt(2)

const g3 = Graph.fromListBasic([[0,0,""], [0,10,""], [10,10,""], [22,8,""]], []);
g3.resetDelaunayGraph((i,j) => { return new BasicLink(i,j,"", ORIENTATION.UNDIRECTED, "black", "")});
console.log(g3.links.size); // should be 5
