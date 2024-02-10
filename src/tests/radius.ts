import { BasicGraph } from "../graph";


// P3
const g1 = BasicGraph.from([[0,0,""], [0,0,""], [0,0,""]], [[0,1,""],[1,2,""]]);
console.log(g1.radius(false)[0] == 1)

// P4
const g2 = BasicGraph.from([[0,0,""], [0,0,""], [0,0,""], [0,0,""]], [[0,1,""],[1,2,""], [2,3,""]]);
console.log(g2.radius(false)[0] == 2)

// Star 3
const g3 = BasicGraph.from([[0,0,""], [0,0,""], [0,0,""], [0,0,""]], [[0,1,""],[0,2,""], [0,3,""]]);
console.log(g3.radius(false)[0] == 1)