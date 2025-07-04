

// fvsn( Un ) = floor(n/3)

import { Graph } from "../graph"

for (let n = 2; n <= 9 ; n ++){
    console.log(`U${n}`, Graph.UGtournament(n,1).fvsn(), Math.floor(n/3))
}

console.log(Graph.Paley(3).fvsn(), 1)
console.log(Graph.Paley(11).fvsn(), 7)
