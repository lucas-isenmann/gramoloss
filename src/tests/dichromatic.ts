import { tournamentLightConflict } from "../algorithms/isTournamentLight";
import { generateAcyclicTournament, generatePaleyGraph, generateUGTournament, generateUTournament } from "../generators";


// const g = generatePaleyGraph(7);
// const n = 20;
// // const g = generateUGTournament(n,0);
// const g = generateAcyclicTournament(n);

// for (let i = 0; i < 100; i ++){
//     if (g.isTournamentLight()){
//         console.log(g.dichromaticNumber());
//     }
// }

// console.log(g.dichromaticNumber())
// console.log(g.isTournamentLight())
// console.log(tournamentLightConflict(g));


const n = 12;
const g = generateAcyclicTournament(n);
let arcs = new Array<[number, number]>();
let m = n*(n-1)/2;
console.log("m=", m);
for (let i = 0; i < n; i ++){
    for (let j = 0; j < i; j ++){
        arcs.push([i,j]);
    }
}

let record = 0;

for (let i = 1; i < 2**m; i ++){
    const x = (i ^ (i >> 1)) ^ ((i-1) ^ ((i-1) >> 1))
    const y = log2(x);
    const arc = arcs[y];
    const u = arc[0];
    const v = arc[1];
    // console.log(u,v)
    if (g.hasArc(u,v)){
        g.flipArc(u,v)
    } else {
        g.flipArc(v,u);
    }

    if (g.isTournamentLight()){
        const dchr = g.dichromaticNumber();
        if (dchr > record){
            record = dchr;
            console.log(record);
        }
    }
}



function log2(x: number): number{
    if ( x == 1){
        return 0;
    } else {
        return 1 + log2(x / 2);
    }
}