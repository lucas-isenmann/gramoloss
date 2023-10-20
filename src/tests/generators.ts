import { generatePaleyGraph, generateUTournament} from "../generators";

// undirected: 5 13 17
// directed: 3 7 11

// in undirected, d = (q-1)/2
// in directed, d+ = d- = (q-1)/2

let q = 7;
const paley = generatePaleyGraph(q);

console.log(paley.vertices.size, q);
console.log(paley.links.size, q*(q-1)/4); // if undirected
console.log(paley.links.size, q*(q-1)/2); // if directed


// V(U(n)) = n
// A(U(n)) = binom(n,2)
// the in-degree or out-degree sequence of a UTournament(n)
// is 1 1 2 3 4 ... (n-2) (n-1) (n-1)
const n = 6;
const utourn = generateUTournament(n);
console.log(utourn.vertices.size)
console.log(utourn.links.size)
for (const v of utourn.vertices.values()){
    const outn = utourn.getOutNeighbors(v);
    console.log(outn.length)
}