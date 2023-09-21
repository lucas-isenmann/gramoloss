import { Coord } from "./coord";
import { Graph } from "./graph";
import { ORIENTATION } from "./link";

export class EmbeddedVertexData {
    pos: Coord;
    constructor(pos: Coord){
        this.pos = pos;
    }
}

export class EmbeddedGraph extends Graph<EmbeddedVertexData, void>{}

function generateCliqueCircle(n: number) {
    const graph = new EmbeddedGraph();
    const r = 50;
    for ( let i = 0 ; i < n ; i ++){
        graph.addVertex( new EmbeddedVertexData(new Coord( r*Math.cos( (2*Math.PI*i) /n), r*Math.sin( (2*Math.PI*i) /n) )));
        for ( let j = 0 ; j < i ; j ++ ){
            graph.addLink(j,i, ORIENTATION.UNDIRECTED, null);
        }
    }
    return graph;
 }