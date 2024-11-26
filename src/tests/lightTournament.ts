import { tournamentLightConflict } from "../algorithms/isTournamentLight";
import { generateAcyclicTournament, generateUTournament } from "../generators";



// const g = generateAcyclicTournament(5);

// g.flipArc(0,4);
// g.flipArc(1,3);



// const r = tournamentLightConflict(g);
// console.log(r)

console.log(generateUTournament(3).isTournamentLight())
console.log(generateUTournament(4).isTournamentLight())
console.log(generateUTournament(5).isTournamentLight())