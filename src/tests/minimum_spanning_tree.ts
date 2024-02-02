import { BasicGraph } from "../graph";

console.log(BasicGraph.fromBasicEdgesList([[0,1],[1,2],[2,0]]).minimum_spanning_tree()[0] == 2 );

console.log(BasicGraph.fromWeightedEdgesList([[0,1,"1"],[1,2,"2"],[2,0,"3"]]).minimum_spanning_tree()[0] == 3 );
console.log(BasicGraph.fromWeightedEdgesList([[0,1,"1"],[1,2,"2"],[2,0,"3"],[0,3,"3"],[1,3,"2"],[2,3,"1"]]).minimum_spanning_tree()[0] == 4 );
console.log(BasicGraph.fromWeightedEdgesList([[0,1,"1"],[1,2,"2"],[0,2,"3"],[0,3,"1"],[1,3,"1"],[2,3,"3"]]).minimum_spanning_tree()[0] == 4 );


