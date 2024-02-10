import { BasicGraph } from "../graph";

/*
     2
g1 = |
     0-1
*/
const g1 = BasicGraph.from([[0,0,""], [1,0,""], [0,1,""]], [[0,1,""],[0,2,""]]);
console.log(g1.crossings().length == 0)


/*
     2 3
g2 =  X
     0 1
*/
const g2 = BasicGraph.from([[0,0,""], [1,0,""], [0,1,""], [1,1,""]], [[0,3,""],[1,2,""]]);
console.log(g2.crossings().length == 1)
