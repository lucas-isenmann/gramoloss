import { Coord } from "./coord";
import { Graph } from "./graph";
import { ORIENTATION } from "./link";
import { Option } from "./option";
import { isModSquare } from "./utils";
import { Vertex } from "./vertex";

export enum GeneratorId {
    CliqueCircle = "CliqueCircle",
    IndependentCircle = "IndependentCircle",
    RandomTournament = "RandomTournament",
    RandomGNP = "RandomGNP",
    Star = "Star",
    CompleteBipartite = "CompleteBipartite",
    Grid = "Grid",
    AztecDiamond = "AztecDiamond",
    Paley = "Paley",
    UnitDisk = "UnitDisk",
    UTournament = "UTournament"
}



export class EmbeddedVertexData {
    pos: Coord;
    constructor(pos: Coord){
        this.pos = pos;
    }
}

export class EmbeddedGraph extends Graph<EmbeddedVertexData, void>{}


export function generateGraph(generatorId: string, params: Array<any> ): Option<EmbeddedGraph>{

    if (generatorId == GeneratorId.CliqueCircle){
        if (params.length != 1){
            logErrorNbParams(params.length, 1);
            return undefined;
        }
        const n = params[0];
        if (typeof n != "number") return undefined;
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
    } else if (generatorId == GeneratorId.RandomTournament){
        if (params.length != 1){
            logErrorNbParams(params.length, 1);
            return undefined;
        }
        const n = params[0];
        if (typeof n != "number") return undefined;
        return generateRandomTournament(n); 
    } else if (generatorId == GeneratorId.RandomGNP){
        if (params.length != 2){
            logErrorNbParams(params.length, 2);
            return undefined;
        }
        const n = params[0];
        if (typeof n != "number") return undefined;
        const p = params[1];
        if (typeof p != "number") return undefined;
        return generateRandomGNP(n, p); 
    } else if (generatorId == GeneratorId.Star){
        if (params.length != 1){
            logErrorNbParams(params.length, 1);
            return undefined;
        }
        const n = params[0];
        if (typeof n != "number") return undefined;
        return generateStar(n); 
    } else if (generatorId == GeneratorId.CompleteBipartite){
        if (params.length != 2){
            logErrorNbParams(params.length, 2);
            return undefined;
        }
        const n = params[0];
        if (typeof n != "number") return undefined;
        const m = params[1];
        if (typeof m != "number") return undefined;
        return generateCompleteBipartite(n, m); 
    } else if (generatorId == GeneratorId.Grid){
        if (params.length != 2){
            logErrorNbParams(params.length, 2);
            return undefined;
        }
        const n = params[0];
        if (typeof n != "number") return undefined;
        const m = params[1];
        if (typeof m != "number") return undefined;
        return generateGrid(n, m); 
    } else if (generatorId == GeneratorId.AztecDiamond){
        if (params.length != 1){
            logErrorNbParams(params.length, 1);
            return undefined;
        }
        const n = params[0];
        if (typeof n != "number") return undefined;
        return generateAztecDiamond(n); 
    } else if (generatorId == GeneratorId.Paley){
        if (params.length != 1){
            logErrorNbParams(params.length, 1);
            return undefined;
        }
        const n = params[0];
        if (typeof n != "number") return undefined;
        return generatePaleyGraph(n); 
    } else if (generatorId == GeneratorId.UnitDisk){
        if (params.length != 2){
            logErrorNbParams(params.length, 2);
            return undefined;
        }
        const n = params[0];
        if (typeof n != "number") return undefined;
        const d = params[1];
        if (typeof n != "number") return undefined;
        return generateUnitDisk(n, d); 
    }  else if (generatorId == GeneratorId.UTournament){
        if (params.length != 1){
            logErrorNbParams(params.length, 1);
            return undefined;
        }
        const n = params[0];
        if (typeof n != "number") return undefined;
        return generateUTournament(n); 
    }

    return undefined;
}


export function generateUTournament(n: number): EmbeddedGraph {
    const graph = new EmbeddedGraph();
    const r = 50;
    for ( let i = 0 ; i < n ; i ++){
        graph.addVertex( new EmbeddedVertexData(new Coord(i*50, 0 )));
        if (i > 0){
            graph.addLink(i, i-1, ORIENTATION.DIRECTED, undefined);
        }
        for ( let j = 0 ; j < i-1 ; j ++ ){
            graph.addLink(j, i, ORIENTATION.DIRECTED, undefined);
        }
    }
    return graph;
}

function generateAztecDiamond(n: number): EmbeddedGraph {
    const graph = new EmbeddedGraph();

    function check(i: number,j: number,n: number): boolean {
        return (i+j >= n-1 && i+j <= 3*n+1 && j-i <= n+1 && i-j <= n+1);
    }

    const indices = new Array();

    for ( let i = 0 ; i < 2*n+1 ; i++){
        indices.push(new Array());
        for ( let j = 0 ; j < 2*n+1 ; j ++){
            indices[i].push(-1);
            if ( check(i,j,n) ){
                const v = graph.addVertex( new EmbeddedVertexData(new Coord(i*30-n*30, j*30-n*30 )));
                indices[i][j] = v.index;
            }
        }
    }

    for ( let i = 0 ; i < 2*n+1 ; i++){
        for (let j = 0 ; j < 2*n+1 ; j ++){
            if (indices[i][j] != -1){
                if (check(i+1, j, n) && i+1 < 2*n+1){
                    graph.addLink(indices[i][j], indices[i+1][j], ORIENTATION.UNDIRECTED, undefined);
                }
                if (check(i,j+1,n) && j+1 < 2*n+1){
                    graph.addLink(indices[i][j], indices[i][j+1], ORIENTATION.UNDIRECTED, undefined);

                }
            }
        }
    }
    return graph;
}

function generateGrid(n: number, m: number): EmbeddedGraph {
    const graph = new EmbeddedGraph();
    
    for ( let i = 0 ; i < n ; i++){
        for ( let j = 0 ; j < m ; j ++){
            graph.addVertex( new EmbeddedVertexData(new Coord(i*30, j*30 )));
        }
    }

    for ( let i = 0 ; i < n ; i ++){
        for ( let j = 0 ; j < m ; j ++){
            let current_index = i*m + j;
            if( j < m - 1){
                graph.addLink(current_index, current_index + 1, ORIENTATION.UNDIRECTED, undefined);
            }
            if( i < n-1 ){
                graph.addLink(current_index, current_index+m, ORIENTATION.UNDIRECTED, undefined);
            }
        }
    }
    return graph;
}

function generateCompleteBipartite(n: number, m: number): EmbeddedGraph {
    const graph = new EmbeddedGraph();

    for ( let i = 0 ; i < n ; i ++){
        graph.addVertex( new EmbeddedVertexData(new Coord(i*30, 0 )));
    }
    for ( let j = 0 ; j < m ; j ++){
        graph.addVertex( new EmbeddedVertexData(new Coord(j*30, 100 )));
    }

    for ( let i = 0 ; i < n ; i ++){
        for ( let j = 0 ; j < m ; j ++){
            graph.addLink(i, n+j, ORIENTATION.UNDIRECTED, undefined);
        }
    }
    return graph;
}

function generateStar(n: number): EmbeddedGraph {
    const graph = new EmbeddedGraph();
    const r = 50;
    if ( n > 0 ){
        graph.addVertex( new EmbeddedVertexData(new Coord(0, 0 )));
        for ( let i = 1 ; i <= n ; i ++){
            graph.addVertex( new EmbeddedVertexData(new Coord( r*Math.cos( (2*Math.PI*i) /n), r*Math.sin( (2*Math.PI*i) /n) )));
            graph.addLink(0,i, ORIENTATION.UNDIRECTED, undefined);
        }
    }
    return graph;
}


function generateRandomGNP(n: number, p: number): EmbeddedGraph {
    const graph = new EmbeddedGraph();
    const r = 50;
    for ( let i = 0 ; i < n ; i ++){
        graph.addVertex( new EmbeddedVertexData(new Coord( r*Math.cos( (2*Math.PI*i) /n), r*Math.sin( (2*Math.PI*i) /n) )));
        for ( let j = 0 ; j < i ; j ++ ){
            if ( Math.random() < p){
                graph.addLink(j, i, ORIENTATION.UNDIRECTED, undefined);
            }
        }
    }
    return graph;
}


export function generateRandomTournament(n: number): EmbeddedGraph {
    const graph = new EmbeddedGraph();
    const r = 50;
    for ( let i = 0 ; i < n ; i ++){
        graph.addVertex( new EmbeddedVertexData(new Coord( r*Math.cos( (2*Math.PI*i) /n), r*Math.sin( (2*Math.PI*i) /n) )));
        for ( let j = 0 ; j < i ; j ++ ){
            if ( Math.random() < 0.5 ){
                graph.addLink(j, i, ORIENTATION.DIRECTED, undefined);
            }else {
                graph.addLink(i, j, ORIENTATION.DIRECTED, undefined);
            }
        }
    }
    return graph;
}

function generateCliqueCircle(n: number): EmbeddedGraph {
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

function generateIndependentCircle(n: number): EmbeddedGraph {
    const graph = new EmbeddedGraph();
    const r = 50;
    for ( let i = 0 ; i < n ; i ++){
        graph.addVertex( new EmbeddedVertexData(new Coord( r*Math.cos( (2*Math.PI*i) /n), r*Math.sin( (2*Math.PI*i) /n) )));
    }
    return graph;
}


/**
 * PaleyGraph is unoriented if p = 1 mod 4.
 * It is oriented if p = -1 mod 4.
 * @param p should be a prime number = +-1 mod 4
 * @returns Error if p is not such a number
 * @example undirected: 5 13 17, directed: 3 7 11
 */
export function generatePaleyGraph(p: number): EmbeddedGraph {
    if ( Number.isInteger(p) == false ) throw Error(`p (given ${p}) should be an integer`);
    if ( (p -1) % 4 != 0 && (p+1) % 4 != 0 ) throw Error(`param p (given ${p}) should be = +-1 mod 4 (here p = ${p%4} mod 4)`);

    const orientation = (p-1)%4 == 0 ? ORIENTATION.UNDIRECTED : ORIENTATION.DIRECTED;

    const graph = new EmbeddedGraph();
    const r = 50;
    for ( let i = 0 ; i < p ; i ++){
        graph.addVertex( new EmbeddedVertexData(new Coord( r*Math.cos( (2*Math.PI*i) /p), r*Math.sin( (2*Math.PI*i) /p) )));
    }

    if (orientation == ORIENTATION.UNDIRECTED){
        for ( let i = 0 ; i < p ; i ++){
            for (let j = i+1 ; j < p ; j ++){
                if ( isModSquare(j-i, p) ){
                    graph.addLink(i, j, ORIENTATION.UNDIRECTED, undefined);
                }
            }
        }
    } else {
        for ( let i = 0 ; i < p ; i ++){
            for (let j = 0 ; j < p ; j ++){
                if ( i != j &&  isModSquare(j-i, p) ){
                    graph.addLink(i, j, ORIENTATION.DIRECTED, undefined);
                }
            }
        }
    }
    
    return graph;
}


/**
 * Return a random Unit Disk graph where vertices are set uniformely randomly in [-50,50]^2.
 * @param n integer >= 0, the number of vertices
 * @param d maximum distance between adjacent vertiecs
 */
export function generateUnitDisk(n: number, d: number): EmbeddedGraph {
    const graph = new EmbeddedGraph();

    const vertices = new Array<Vertex<EmbeddedVertexData>>();
    for (let i = 0 ; i < n ; i ++){
        vertices.push(graph.addVertex( new EmbeddedVertexData(new Coord( Math.random()*100-50, Math.random()*100 -50))));
    }
    for (let i = 0 ; i < n ; i ++){
        for (let j = i+1 ; j < n ; j ++){
            const dist = Math.sqrt(vertices[i].data.pos.dist2(vertices[j].data.pos));
            if (dist < d){
                graph.addLink(i, j, ORIENTATION.UNDIRECTED, undefined);
            }
        }
    }

    return graph;
}





 function logErrorNbParams(received: number, expected: number){
    console.log(`Error: not enough parameters (received: ${received} expected: ${expected})`);
 }

 function logErrorTypeParam(received: string, expected: string){
    console.log(`Error: wrong type of param (received: ${received} expected: ${expected})`);
 }


 