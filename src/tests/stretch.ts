import { Graph } from "../graph";


// 1 vertex
const g0 = new Graph(1);
console.log(g0.stretch()[0] == 1 ); 
console.log(g0.stretch()[1].length == 0 ); 

const g1 = Graph.fromEdges([[0,1]], [[0,0], [0,10]]);
console.log(g1.stretch()[0] == 1 ); 
console.log(g1.stretch()[1].length == 2 ); 

const g2 = Graph.fromEdges([[0,1],[1,2]], [[0,0], [0,10], [10,10]]);
console.log( Math.abs(g2.stretch()[0] - Math.sqrt(2)) < 0.0001); // should be sqrt(2)
console.log(g2.stretch()[1].length == 3);


// 2 unadjacent vertices
{   
    const g3 = new Graph(2);
    console.log(g3.stretch()[0] == Infinity ); 
    console.log(g3.stretch()[1].length == 2 ); 
}



