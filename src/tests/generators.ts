import { generatePaleyGraph} from "../generators";

// undirected: 5 13 17
// directed: 3 7 11

// in undirected, d = (q-1)/2
// in directed, d+ = d- = (q-1)/2

let q = 7;
const paley = generatePaleyGraph(q);

console.log(paley.vertices.size, q);
console.log(paley.links.size, q*(q-1)/4); // if undirected
console.log(paley.links.size, q*(q-1)/2); // if directed

