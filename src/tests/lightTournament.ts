import { searchHeavyArc, tournamentLightConflict } from "../algorithms/isTournamentLight";
import { generateAcyclicTournament, generateCirculantTournament, generateUTournament } from "../generators";
import { AbstractGraph } from "../graph_abstract";
import { ORIENTATION } from "../link";



// const g = generateAcyclicTournament(3);
 console.log(generateUTournament(3).isTournamentLight())
 console.log(generateUTournament(4).isTournamentLight())
 console.log(generateUTournament(5).isTournamentLight())


{
    const g = new AbstractGraph();

    for (let i = 0; i < 6; i ++){
        g.addVertex();
    }

    g.addLink(0,1, ORIENTATION.DIRECTED, undefined)
    g.addLink(0,3, ORIENTATION.DIRECTED, undefined)
    g.addLink(0,4, ORIENTATION.DIRECTED, undefined)
    g.addLink(1,2, ORIENTATION.DIRECTED, undefined)
    g.addLink(2,0, ORIENTATION.DIRECTED, undefined)
    g.addLink(2,4, ORIENTATION.DIRECTED, undefined)
    g.addLink(2,5, ORIENTATION.DIRECTED, undefined)
    g.addLink(4,1, ORIENTATION.DIRECTED, undefined)
    g.addLink(4,3, ORIENTATION.DIRECTED, undefined)
    g.addLink(5,0, ORIENTATION.DIRECTED, undefined)
    g.addLink(5,1, ORIENTATION.DIRECTED, undefined)

    console.log(g.isTournamentLight() == true)
}

{
    // Tri(C3,1,1)
    const g = new AbstractGraph();
    for (let i = 0; i < 5; i ++){
        g.addVertex();
    }

    g.addLink(0,1, ORIENTATION.DIRECTED, undefined)
    g.addLink(1,2, ORIENTATION.DIRECTED, undefined)
    g.addLink(1,3, ORIENTATION.DIRECTED, undefined)
    g.addLink(1,4, ORIENTATION.DIRECTED, undefined)
    g.addLink(2,0, ORIENTATION.DIRECTED, undefined)
    g.addLink(3,0, ORIENTATION.DIRECTED, undefined)
    g.addLink(4,0, ORIENTATION.DIRECTED, undefined)
    g.addLink(2,3, ORIENTATION.DIRECTED, undefined)
    g.addLink(3,4, ORIENTATION.DIRECTED, undefined)
    g.addLink(4,2, ORIENTATION.DIRECTED, undefined)

    console.log(g.isTournamentLight() == false)
}

{
    // Tri(C3,1,1) with one more vertex (so it is not a tournament)
    const g = new AbstractGraph();
    for (let i = 0; i < 6; i ++){
        g.addVertex();
    }

    g.addLink(0,1, ORIENTATION.DIRECTED, undefined)
    g.addLink(1,2, ORIENTATION.DIRECTED, undefined)
    g.addLink(1,3, ORIENTATION.DIRECTED, undefined)
    g.addLink(1,4, ORIENTATION.DIRECTED, undefined)
    g.addLink(2,0, ORIENTATION.DIRECTED, undefined)
    g.addLink(3,0, ORIENTATION.DIRECTED, undefined)
    g.addLink(4,0, ORIENTATION.DIRECTED, undefined)
    g.addLink(2,3, ORIENTATION.DIRECTED, undefined)
    g.addLink(3,4, ORIENTATION.DIRECTED, undefined)
    g.addLink(4,2, ORIENTATION.DIRECTED, undefined)
    g.addLink(0,5, ORIENTATION.DIRECTED, undefined);

    console.log(g.isTournamentLight() == false)
}

{
    const g = generateCirculantTournament(4,[1,2,3,5])
    console.log(g.isTournamentLight() == false)
}


{ 
    const g = new AbstractGraph();
    g.addVertex();
    console.log(typeof g.lightnessConflict() == "undefined")
}




// -----------------
// Speed test
// -----------------

/*
const n = 7;
const g = generateAcyclicTournament(n);
let arcs = new Array<[number, number]>();
let m = n*(n-1)/2;
console.log("m=", m);
for (let i = 0; i < n; i ++){
    for (let j = 0; j < i; j ++){
        arcs.push([i,j]);
    }
}

let c = 0;
let c2 = 0;
let record = 0;

let i = 1;
do {
    if (typeof searchHeavyArc(g.getDirectedMatrix()) == "undefined" ){
        c2 += 1
        const dchr = g.dichromaticNumber();
        if (dchr > record){
            record = dchr;
        }
    }

    if ( i == 2**m){
        break;
    }
    const x = (i ^ (i >> 1)) ^ ((i-1) ^ ((i-1) >> 1))
    const y = log2(x);
    const arc = arcs[y];
    const u = arc[0];
    const v = arc[1];
    if (g.hasArc(u,v)){
        g.flipArc(u,v)
    } else {
        g.flipArc(v,u);
    }

    i ++;
}while ( i <= 2**m)



console.log(`Number of light tournaments of size ${n}: ${c}`);
console.log("Proportion: ", c/(2**m))
console.log("Dichromatix max", record);

console.log(`Number of light tournaments of size ${n}: ${c2}`);
console.log("Proportion: ", c2/(2**m))

function log2(x: number): number{
    if ( x == 1){
        return 0;
    } else {
        return 1 + log2(x / 2);
    }
}
*/
