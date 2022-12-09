import {Graph} from "../graph";

const g = Graph.directed_from_list([[0, 1], [1, 2]]);
console.log(g.strongly_connected_components());
