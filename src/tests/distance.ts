import { generateRandomTournament } from "../generators";
import { BasicGraph } from "../graph";


const g1 = BasicGraph.from([[0,0,""], [0,0,""], [0,0,""], [0,0,""]],
    [[0,1,""],
    [1,2,""],
    [2,3,""],
    [3,1,""]]);

const f1 = g1.FloydWarshall(undefined);
// console.log([...distances])
// console.log([...next])
console.log(f1.distances.get(0)?.get(2) == 2)
console.log(f1.next.get(0)?.get(2) == 1)
console.log(f1.distances.get(0)?.get(3) == 2)
console.log(f1.next.get(0)?.get(3) == 1)

const g2 = BasicGraph.from([[0,0,""], [0,0,""], [0,0,""], [0,0,""], [0,0,""], [0,0,""]],
    [[0,3,""],
    [3,1,""],
    [1,2,""],
    [2,5,""],
    [5,1,""],
    [1,4,""],
    [4,0,""]]);

const f2 = g2.FloydWarshall(undefined);
console.log(f2.distances.get(3)?.get(2) == 2)
console.log(f2.next.get(3)?.get(2) == 1)
console.log(f2.distances.get(0)?.get(5) == 3)
console.log(f2.next.get(5)?.get(0) == 1)


const g3 = BasicGraph.fromArcs([[0,0,""], [0,0,""], [0,0,""]],
    [[0,1,""],
    [1,0,""],
    [1,2,""]]);

const f3 = g3.FloydWarshall(undefined);
console.log(f3.distances.get(0));
console.log(f3.distances.get(1));
console.log(f3.distances.get(2));



// Compute the diameter of random tournaments
// It seems that the probability of that it has diameter <= 2 tends to 1 when n tends to +infinity

// for (let i = 0 ; i < 10 ; i ++){
//     const g = generateRandomTournament(40);
//     const vertices = new Array();
//     for (const v of g.vertices.values()){
//         vertices.push( [v.data.pos.x, v.data.pos.y, ""]);
//     }

//     const arcs = new Array();
//     for (const arc of g.links.values()){
//         arcs.push( [arc.startVertex.index, arc.endVertex.index, ""])
//     }

//     const bg = BasicGraph.fromArcs(vertices, arcs);
//     console.log(bg.diameter(undefined));
// }


// --------------
// LongestGeodesic

// The graph C4
console.log(BasicGraph.cycle(4).longestGeodesic(undefined)[0].length == 3);
console.log(BasicGraph.cycle(4).longestGeodesic(undefined)[1] == 2);
console.log(BasicGraph.cycle(5).longestGeodesic(undefined)[1] == 2);
console.log(BasicGraph.cycle(6).longestGeodesic(undefined)[1] == 3);

// I2 (independent graph with 2 vertices)
console.log(BasicGraph.from([[0,0,""],[0,0,""]],[]).longestGeodesic(undefined)[1] == Infinity)
console.log(BasicGraph.from([[0,0,""],[0,0,""]],[]).longestGeodesic(undefined)[0].length == 2)



// --------
// Diameter

console.log(BasicGraph.cycle(4).diameter(undefined) == 2);
console.log(BasicGraph.cycle(5).diameter(undefined) == 2);
console.log(BasicGraph.cycle(6).diameter(undefined) == 3);
console.log(BasicGraph.clique(3).diameter(undefined) == 1);
console.log(BasicGraph.clique(4).diameter(undefined) == 1);
