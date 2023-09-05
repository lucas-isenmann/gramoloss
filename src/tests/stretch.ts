import { BasicGraph } from "../graph";
import { BasicLinkData } from "../traits";

const g1 = BasicGraph.from([[0,0,""], [0,10,""]], [[0,1,""]]);
console.log(g1.stretch()); // should be 1

const g2 = BasicGraph.from([[0,0,""], [0,10,""], [10,10,""]], [[0,1,""],[1,2,""]]);
console.log(g2.stretch()); // should be sqrt(2)

const g3 = BasicGraph.from([[0,0,""], [0,10,""], [10,10,""], [22,8,""]], []);
g3.resetDelaunayGraph((i,j) => { return new BasicLinkData(undefined, "", "black")});
console.log(g3.links.size); // should be 5
