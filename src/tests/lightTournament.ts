import { Graph } from "../graph";



// const g = generateAcyclicTournament(3);
 console.log(Graph.UGtournament(3,1).isTournamentLight())
 console.log(Graph.UGtournament(4,1).isTournamentLight())
 console.log(Graph.UGtournament(5,1).isTournamentLight())


{
    const g = Graph.fromArcs([[0,1], [0,3], [0,4], [1,2], [2,0], [2,4], [2,5], [4,1], [4,3], [5,0], [5,1]])
    console.log(g.isTournamentLight() == true)
}

{
    // Tri(C3,1,1)
    const g = Graph.fromArcs([[0,1], [1,2], [1,3], [1,4], [2,0], [3,0], [4,0], [2,3], [3,4], [4,2]])
    console.log(g.isTournamentLight() == false)
}

{
    // Tri(C3,1,1) with one more vertex (so it is not a tournament)
    const g = Graph.fromArcs([[0,1], [1,2], [1,3], [1,4], [2,0], [3,0], [4,0], [2,3], [3,4], [4,2], [0,5]])
    console.log(g.isTournamentLight() == false)
}

{
    const g = Graph.circulantTournament(4,[1,2,3,5])
    console.log(g.isTournamentLight() == false)
}


{ 
    const g = new Graph(1);
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
