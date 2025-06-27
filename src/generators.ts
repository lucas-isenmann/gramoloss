import { Coord } from "./coord";
import { Graph } from "./graph";
import { ORIENTATION } from "./link";
import { Option } from "./option";
import { isModSquare, isPrime } from "./utils";
import { Vertex } from "./vertex";

export enum GeneratorId {
    CliqueCircle = "CliqueCircle",
    IndependentCircle = "IndependentCircle",
    RandomTournament = "RandomTournament",
    RandomGNP = "RandomGNP",
    Star = "Star",
    CompleteBipartite = "CompleteBipartite",
    CompleteMultipartite = "CompleteMultipartite",
    Grid = "Grid",
    AztecDiamond = "AztecDiamond",
    Paley = "Paley",
    UnitDisk = "UnitDisk",
    UGTournament = "UGTournament",
    AcyclicTournament = "AcyclicTournament"
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
    }  else if (generatorId == GeneratorId.UGTournament){
        if (params.length != 2){
            logErrorNbParams(params.length, 2);
            return undefined;
        }
        const n = params[0];
        const m = params[1];
        if (typeof n != "number" || typeof m != "number") return undefined;
        return generateUGTournament(n, m); 
    } else if (generatorId == GeneratorId.AcyclicTournament){
        if (params.length != 1){
            logErrorNbParams(params.length, 1);
            return undefined;
        }
        const n = params[0];
        if (typeof n != "number"){
            return undefined;
        }
        return generateAcyclicTournament(n);
    }

    return undefined;
}

/**
 * OBSOLETE generateUGTOurnament is a generalisation.
 * @param n number of vertices
 * @returns 
 */
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


/**
 * An acyclic tournament is a tournament which contains no directed cycle.
 * Such a graph is a Directed Acyclic Graph (DAG).
 * @param n number of vertices
 */
export function generateAcyclicTournament(n: number): EmbeddedGraph {
    return generateUGTournament(n, 0);
}




/**
 * v(i) -> v(i-j) for all j in [1,k]
 * @param n number of vertices
 * @param k order
 * @example k = 0: acyclic
 * @example k = 1: U-tournaments
 */
export function generateUGTournament(n: number, k: number): EmbeddedGraph {
    const graph = new EmbeddedGraph();
    for ( let i = 0 ; i < n ; i ++){
        graph.addVertex( new EmbeddedVertexData(new Coord(i*50, 0 )));
        for ( let j = 1; j <= k; j ++){
            if (i-j >= 0){
                graph.addLink(i, i-j, ORIENTATION.DIRECTED, undefined);
            }
        }
        for ( let j = 0 ; j < i-k ; j ++ ){
            graph.addLink(j, i, ORIENTATION.DIRECTED, undefined);
        }
    }
    return graph;
}


/**
 * for every i < j, i -> j iff i+j is prime
 * @param n 
 */
export function generateTestTournament(n: number): EmbeddedGraph {
    const graph = new EmbeddedGraph();
    for ( let i = 0 ; i < n ; i ++){
        graph.addVertex( new EmbeddedVertexData(new Coord(i*50, 0 )));
        for ( let j = 0 ; j < i ; j ++ ){
            if (isPrime(i+j)){
                graph.addLink(j, i, ORIENTATION.DIRECTED, undefined);
            } else {
                graph.addLink(i, j, ORIENTATION.DIRECTED, undefined);
            }
            
        }
    }
    return graph;
}



export function generateAztecDiamond(n: number): EmbeddedGraph {
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

export function generateGrid(n: number, m: number): EmbeddedGraph {
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

/**
 * Returns a graph with vertex set indices [0, sum(sizes)-1]
 * Vi = sum( sizes[k], k < i) + [0, sizes[i]-1]
 * For every i and j, every vertex of Vi is adjacent to every vertex of Vj
 * @param sizes list of the sizes of the parts
 * @example
 * For sizes = [5,4,3], the graph has 5+4+3 vertices
 * The sum of the degrees is 5*(4+3) + 4*(5+3) + 3*(5+4). 
 */
export function generateCompleteMultipartite(sizes: Array<number>): EmbeddedGraph {
    const graph = new EmbeddedGraph();
    const k = sizes.length;
    const r = 50;
    for ( let i = 0 ; i < k ; i ++){
        for (let ki = 0; ki < sizes[i]; ki ++){
            graph.addVertex( 
                new EmbeddedVertexData(
                    new Coord( 
                        r*Math.cos( (2*Math.PI*i) /k )+ (-Math.sin( (2*Math.PI*i) /k))*(ki-sizes[i]/2),  
                        r*Math.sin( (2*Math.PI*i) /k) + (Math.cos( (2*Math.PI*i) /k))*(ki-sizes[i]/2) )));
        }
    }

    let sumi = 0;
    for (let i = 0; i < k ; i ++){

        let sumj = 0;
        for (let j = 0; j < i; j ++){
            for (let ki = 0; ki < sizes[i]; ki ++){
                for (let kj = 0; kj < sizes[j]; kj ++){
                    graph.addLink(sumi+ki, sumj+kj, ORIENTATION.UNDIRECTED, undefined)
                }
            }
            sumj += sizes[j];
        }
        sumi += sizes[i];
    }
    return graph;
}

export function generateCompleteBipartite(n: number, m: number): EmbeddedGraph {
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

export function generateStar(n: number): EmbeddedGraph {
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


export function generateRandomGNP(n: number, p: number): EmbeddedGraph {
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

export function generateCliqueCircle(n: number): EmbeddedGraph {
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

export function generateIndependentCircle(n: number): EmbeddedGraph {
    const graph = new EmbeddedGraph();
    const r = 50;
    for ( let i = 0 ; i < n ; i ++){
        graph.addVertex( new EmbeddedVertexData(new Coord( r*Math.cos( (2*Math.PI*i) /n), r*Math.sin( (2*Math.PI*i) /n) )));
    }
    return graph;
}

// --------------------------------
// Generate Random Tree with markov chain



export function generateRandomTree(n: number): EmbeddedGraph {
    
    const root = Math.floor(n/2);
    const leaves = [0,n-1];
    const kids = new Array<Set<number>>();
    const parents = new Array();
    for (let i = 0; i < n ; i ++){
        parents.push(root);
        kids.push(new Set());
    } 
    for (let i = root; i-1 >= 0; i --){
        parents[i-1] = i;
        kids[i].add(i-1);
    }
    for (let i = root; i+1 < n; i ++){
        parents[i+1] = i;
        kids[i].add(i+1);
    }

    for (let k = 0; k < 20; k ++){
        const leafId = Math.floor(Math.random()*leaves.length);
        const leaf = leaves[leafId];
        // Delete edge
        kids[parents[leaf]].delete(leaf);

        
        let newParent = Math.floor(Math.random()*n);
        if (newParent >= leaf){
            newParent += 1;
        }
        if (kids[newParent].size == 0){
            leaves // remove newp
        }
        kids[newParent].add(leaf);
        parents[leaf] = newParent;






        
    }

    const graph = new EmbeddedGraph();
    const r = 50;
    for ( let i = 0 ; i < n ; i ++){
        graph.addVertex( new EmbeddedVertexData(new Coord( i*50, 0 )));
    }
    for (let i = 0; i <n-1; i ++){
        graph.addLink(i, i+1, ORIENTATION.UNDIRECTED, undefined);
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


export function generateCirculantTournament(n: number, gaps: Array<number>): EmbeddedGraph {
    const graph = new EmbeddedGraph();
    const r = 50;
    for ( let i = 0 ; i < (2*n+1) ; i ++){
        graph.addVertex( new EmbeddedVertexData(new Coord( r*Math.cos( (2*Math.PI*i) /(2*n+1) ), r*Math.sin( (2*Math.PI*i) /(2*n+1) ) )));
    }

    for ( let i = 0 ; i < (2*n+1)  ; i ++){
        for (const k of gaps ){
            const j = ((2*n+1)+i+k)%(2*n+1) ;
            graph.addLink(i, j, ORIENTATION.DIRECTED, undefined);
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


 