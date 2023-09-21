import { Coord } from "./coord";
import { Graph } from "./graph";
import { ORIENTATION } from "./link";
import { Option } from "./option";

export enum GeneratorId {
    CliqueCircle = "CliqueCircle",
    IndependentCircle = "IndependentCircle"
}




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
            graph.addLink(j,i, ORIENTATION.UNDIRECTED, undefined);
        }
    }
    return graph;
 }

function generateIndependentCircle(n: number) {
    const graph = new EmbeddedGraph();
    const r = 50;
    for ( let i = 0 ; i < n ; i ++){
        graph.addVertex( new EmbeddedVertexData(new Coord( r*Math.cos( (2*Math.PI*i) /n), r*Math.sin( (2*Math.PI*i) /n) )));
    }
    return graph;
 }



 function logErrorNbParams(received: number, expected: number){
    console.log(`Error: not enough parameters (received: ${received} expected: ${expected})`);
 }

 function logErrorTypeParam(received: string, expected: string){
    console.log(`Error: wrong type of param (received: ${received} expected: ${expected})`);
 }


 export function generateGraph(generatorId: string, params: Array<any> ): Option<EmbeddedGraph>{

    if (generatorId == GeneratorId.CliqueCircle){
        if (params.length != 1){
            logErrorNbParams(params.length, 1);
            return undefined;
        }
        const n = params[0];
        if (typeof n != "number"){
            return undefined;
        }
        return generateCliqueCircle(n);
    } else if (generatorId == GeneratorId.IndependentCircle){
        if (params.length != 1){
            logErrorNbParams(params.length, 1);
            return undefined;
        }
        const n = params[0];
        if (typeof n != "number"){
            return undefined;
        }
        return generateIndependentCircle(n);
    } 

    return undefined;
}