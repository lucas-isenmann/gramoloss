import { Coord } from "../coord";
import { Graph } from "../graph";
import { ORIENTATION } from "../link";
import { Vertex } from "../vertex";

// chi(Pn) = 2 
// chi(Cn) = 2 or 3 if n is odd, for n >= 3
// chi(Kn) = n

console.log("chi(P2) = 2")
console.log(Graph.fromEdges([[0,1],[1,2]]).chromaticNumber() == 2);

console.log("chi(P3) = 2")
console.log(Graph.fromEdges([[0,1],[1,2],[2,3]]).chromaticNumber() == 2);

console.log("chi(K3) = 3")
console.log(Graph.fromEdges([[0,1],[1,2],[2,0]]).chromaticNumber() == 3);

console.log("chi(K4) = 4")
console.log(Graph.clique(4).chromaticNumber() == 4);

console.log("chi(K5) = 5")
console.log(Graph.clique(5).chromaticNumber() == 5);



console.log("chi(C5) = 3")
console.log(Graph.fromEdges([[0,1],[1,2],[2,3],[3,4],[4,0]]).chromaticNumber() == 3);

console.log("chi(Petersen) = 3")
console.log(Graph.fromEdges([[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[1,6],[2,7],[3,8],[4,9],[5,7],[7,9],[9,6],[6,8],[8,5]]).chromaticNumber() == 3);



// Speed test

const petersenGraph = Graph.fromEdges([[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[1,6],[2,7],[3,8],[4,9],[5,7],[7,9],[9,6],[6,8],[8,5]]);
const lgp = Graph.lineGraph(petersenGraph);

console.time('chromaticNumber');
console.log(Graph.fromEdges([[0,1],[1,2]]).chromaticNumber() == 2);
console.log(Graph.fromEdges([[0,1],[1,2],[2,3]]).chromaticNumber() == 2);
console.log(Graph.fromEdges([[0,1],[1,2],[2,0]]).chromaticNumber() == 3);
console.log(Graph.fromEdges([[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]]).chromaticNumber() == 4);
console.log(Graph.fromEdges([[0,1],[1,2],[2,3],[3,4],[4,0]]).chromaticNumber() == 3);
console.log(Graph.fromEdges([[0,1],[1,2],[2,3],[3,4],[4,0],[0,5],[1,6],[2,7],[3,8],[4,9],[5,7],[7,9],[9,6],[6,8],[8,5]]).chromaticNumber() == 3);
console.timeEnd('chromaticNumber');


console.time('vPetersen');
const n = 6;
const g = Graph.clique(n);
const lgp2 = Graph.lineGraph(g);
const cliques = new Set<Set<Vertex>>();
for (let i = 0 ; i < n ; i ++){
    const clique = new Set<Vertex>();
    for (const link of g.links.values()){
        if (link.startVertex.index == i || link.endVertex.index == i){
            const vertexLink = lgp2.vertices.get(link.index);
            if (typeof vertexLink != "undefined"){
                clique.add(vertexLink);
            }
        }
    }
    cliques.add(clique);
}

console.log(lgp2.chromaticNumber(cliques));
console.timeEnd('vPetersen');


console.log( petersenGraph.minimalProperColoring());


checkGeomChromaticClique(4)


// K4 in circle should have GCI 4
function checkGeomChromaticClique(n: number){
    const g2 = new Graph();
    const v0 = g2.addVertex(0, 0, 0);
    const v1 = g2.addVertex(1, 1, 0);
    const v2 = g2.addVertex(2, 0, 1);
    const v3 = g2.addVertex(3, 1, 1);
    
    g2.addEdge(v0, v1);
    g2.addEdge(v0, v2);
    g2.addEdge(v0, v3);
    g2.addEdge(v1, v2);
    g2.addEdge(v1, v3);
    g2.addEdge(v2, v3);
    
    const glg2 = Graph.geometricLineGraph(g2);

    const cliques = new Set<Set<Vertex>>();
    for (let i = 0 ; i < n ; i ++){
        const clique = new Set<Vertex>();
        for (const link of g2.links.values()){
            if (link.startVertex.index == i || link.endVertex.index == i){
                const vertexLink = glg2.vertices.get(link.index);
                if (typeof vertexLink != "undefined"){
                    clique.add(vertexLink);
                }
            }
        }
        cliques.add(clique);
    }

    console.log(glg2.chromaticNumber(cliques));
    // console.log(glg2.minimalProperColoring(cliques));
    
}