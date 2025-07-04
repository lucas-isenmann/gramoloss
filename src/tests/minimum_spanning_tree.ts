import { Graph } from "../graph";

console.log(Graph.fromEdges([[0,1],[1,2],[2,0]]).minimumSpanningTree()[0] == 2 );

console.log(Graph.fromEdges([[0,1,"1"],[1,2,"2"],[2,0,"3"]]).minimumSpanningTree()[0] == 3 );
console.log(Graph.fromEdges([[0,1,"1"],[1,2,"2"],[2,0,"3"],[0,3,"3"],[1,3,"2"],[2,3,"1"]]).minimumSpanningTree()[0] == 4 );
console.log(Graph.fromEdges([[0,1,"1"],[1,2,"2"],[0,2,"3"],[0,3,"1"],[1,3,"1"],[2,3,"3"]]).minimumSpanningTree()[0] == 4 );


