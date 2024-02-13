import { BasicGraph } from "../graph";
import { BasicLinkData } from "../traits";


// 1 vertex
const g0 = BasicGraph.from([[0,0,""]], []);
console.log(g0.stretch()[0] == 1 ); 
console.log(g0.stretch()[1].length == 0 ); 

const g1 = BasicGraph.from([[0,0,""], [0,10,""]], [[0,1,""]]);
console.log(g1.stretch()[0] == 1 ); 
console.log(g1.stretch()[1].length == 2 ); 

const g2 = BasicGraph.from([[0,0,""], [0,10,""], [10,10,""]], [[0,1,""],[1,2,""]]);
console.log( Math.abs(g2.stretch()[0] - Math.sqrt(2)) < 0.0001); // should be sqrt(2)
console.log(g2.stretch()[1].length == 3);

// unconnected
const g3 = BasicGraph.from([[0,0,""], [1,1,""]], []);
console.log(g3.stretch()[0] == Infinity ); 
console.log(g3.stretch()[1].length == 2 ); 

const g4 = BasicGraph.from([[0,0,""], [0,10,""], [10,10,""], [22,8,""]], []);
g4.resetDelaunayGraph((i,j) => { return new BasicLinkData(undefined, "", "black")});
console.log(g4.links.size); // should be 5
