// Vertex Cover tests

import { AbstractGraph } from "../graph_abstract";


function compare(g: AbstractGraph){
    // console.time("v1");
    // console.log(g.vertex_cover_number());
    // console.timeEnd("v1")
    
    // console.time("v2");
    // console.log(g.vertexCoverV2());
    // console.timeEnd("v2")
    
    // console.time("v3");
    // console.log(g.vertexCoverV3());
    // console.timeEnd("v3")

    // console.time("v3Bis");
    // console.log(g.vertexCoverV3Bis());
    // console.timeEnd("v3Bis")

    // console.time("v4");
    // console.log(g.vertexCoverV4());
    // console.timeEnd("v4")
}

compare(AbstractGraph.generatePaley(29));








// p(P2) = 1
console.log(AbstractGraph.generatePath(3).vertex_cover_number() == 1);

// p(P3) = 2
console.log(AbstractGraph.generatePath(4).vertex_cover_number() == 2);

// p(K3) = 2
console.log(AbstractGraph.generateClique(3).vertex_cover_number() == 2);

// p(K4) = 3
console.log(AbstractGraph.generateClique(4).vertex_cover_number() == 3);

// p(C5) = 3
console.log(AbstractGraph.generatePaley(5).vertex_cover_number() == 3);

// p(K33) = 3
console.log(AbstractGraph.fromEdgesListDefault([[0,1],[0,3],[0,5],[2,1],[2,3],[2,5],[4,1],[4,3],[4,5]]).vertex_cover_number() == 3);