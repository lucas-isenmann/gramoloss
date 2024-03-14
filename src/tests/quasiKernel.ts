import { AbstractGraph } from "../graph_abstract";
import { eqSet } from "../utils";


console.log( eqSet(AbstractGraph.orientedPath(0).minQuasiKernel(), new Set()) )
console.log( eqSet(AbstractGraph.orientedPath(1).minQuasiKernel() , new Set([0])) )

console.log( eqSet(AbstractGraph.orientedPath(2).minQuasiKernel(), new Set([1])) )
console.log( eqSet(AbstractGraph.orientedPath(3).minQuasiKernel(), new Set([2])) )
console.log( AbstractGraph.orientedPath(4).minQuasiKernel().size == 2 )
console.log( AbstractGraph.orientedPath(5).minQuasiKernel().size == 2 )
console.log( eqSet(AbstractGraph.orientedPath(6).minQuasiKernel(), new Set([5,2])) )

console.log( AbstractGraph.generatePaley(7).minQuasiKernel().size == 1);

console.log( AbstractGraph.orientedCycle(4).minQuasiKernel().size == 2);
console.log( AbstractGraph.orientedCycle(6).minQuasiKernel().size == 2);
console.log( AbstractGraph.orientedCycle(7).minQuasiKernel().size == 3);

console.log(AbstractGraph.orientedCycle(25).minQuasiKernel()) // 800ms