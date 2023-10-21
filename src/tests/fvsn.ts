import { generatePaleyGraph, generateUTournament} from "../generators";


// fvsn( Un ) = floor(n/3)

for (let n = 2; n <= 9 ; n ++){
    console.log(`U${n}`, generateUTournament(n).fvsn(), Math.floor(n/3))
}

console.log(generatePaleyGraph(3).fvsn(), 1)
console.log(generatePaleyGraph(11).fvsn(), 7)
