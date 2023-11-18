import { AbstractGraph } from "../graph";

// chi(Pn) = 2 
// chi(Cn) = 2 or 3 if n is odd, for n >= 3
// chi(Kn) = n

console.log("chi(P2) = 2")
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2]]).chromatic_number() == 2);

console.log("chi(P3) = 2")
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,3]]).chromatic_number() == 2);

console.log("chi(K3) = 3")
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,0]]).chromatic_number() == 3);

console.log("chi(K4) = 4")
console.log(AbstractGraph.generateClique(4).chromatic_number() == 4);

console.log("chi(K5) = 5")
console.log(AbstractGraph.generateClique(5).chromatic_number() == 5);



console.log("chi(C5) = 3")
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,3],[3,4],[4,0]]).chromatic_number() == 3);

console.log("chi(Petersen) = 3")
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[1,6],[2,7],[3,8],[4,9],[5,7],[7,9],[9,6],[6,8],[8,5]]).chromatic_number() == 3);



// Speed test

const petersenGraph = AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[1,6],[2,7],[3,8],[4,9],[5,7],[7,9],[9,6],[6,8],[8,5]]);
const lgp = AbstractGraph.lineGraph(petersenGraph);

console.time('chromaticNumber');
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2]]).chromatic_number() == 2);
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,3]]).chromatic_number() == 2);
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,0]]).chromatic_number() == 3);
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]).chromatic_number() == 4);
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,3],[3,4],[4,0]]).chromatic_number() == 3);
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[1,6],[2,7],[3,8],[4,9],[5,7],[7,9],[9,6],[6,8],[8,5]]).chromatic_number() == 3);
console.timeEnd('chromaticNumber');


console.time('vPetersen');
const n = 6;
const g = AbstractGraph.generateClique(n);
const lgp2 = AbstractGraph.lineGraph(g);
const cliques = new Set<Set<number>>();
for (let i = 0 ; i < n ; i ++){
    const clique = new Set<number>();
    for (const link of g.links.values()){
        if (link.startVertex.index == i || link.endVertex.index == i){
            clique.add(link.index);
        }
    }
    cliques.add(clique);
}

console.log(lgp2.chromatic_number(cliques));
console.timeEnd('vPetersen');


console.log( petersenGraph.minimalProperColoring());