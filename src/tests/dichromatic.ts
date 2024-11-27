import { generateAcyclicTournament, generateUTournament } from "../generators";



const g = generateAcyclicTournament(3);


console.log(g.dichromaticNumber())
g.flipArc(0,2);
console.log(g.dichromaticNumber())
