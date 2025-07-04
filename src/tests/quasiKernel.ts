import { Graph } from "../graph";
import { eqSet } from "../utils";


// console.log( eqSet(Graph.orientedPath(0).minQuasiKernel(), new Set()) )
// console.log( eqSet(Graph.orientedPath(1).minQuasiKernel() , new Set([0])) )

// console.log( eqSet(Graph.orientedPath(2).minQuasiKernel(), new Set([1])) )
// console.log( eqSet(Graph.orientedPath(3).minQuasiKernel(), new Set([2])) )
// console.log( Graph.orientedPath(4).minQuasiKernel().size == 2 )
// console.log( Graph.orientedPath(5).minQuasiKernel().size == 2 )
// console.log( eqSet(Graph.orientedPath(6).minQuasiKernel(), new Set([5,2])) )

// console.log( Graph.Paley(7).minQuasiKernel().size == 1);

// console.log( Graph.orientedCycle(4).minQuasiKernel().size == 2);
// console.log( Graph.orientedCycle(6).minQuasiKernel().size == 2);
// console.log( Graph.orientedCycle(7).minQuasiKernel().size == 3);

// console.log(Graph.orientedCycle(25).minQuasiKernel()) // 800ms


// // Example of a graph such that there is a distance-2 DS (a quasi kernel but not independent) of size 2 but minQK is 3
// console.log(Graph.fromArcsList([[0,1],[1,2],[2,0],[3,0],[4,0],[5,1],[6,1],[7,2],[8,2]]).minQuasiKernel().size == 3);