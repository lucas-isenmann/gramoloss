import { Graph } from "../graph";
import { Vertex, VertexIndex } from "../vertex";


/**
 * Returns the adjacencies list. (Can be seen as an abstract graph)
 * @param g 
 * @param subset the subset of vertices to induce the graph (keep every arc xy when x and y are in subset)
 * @returns outNeighbors: Map<number, Set<number>> which tells for every vertex id the out-neighbors id of this vertex
 * 
 */
export function getInducedSubgraph(g: Graph, subset: Set<Vertex>) {
    
    const subOutNeighbors = new Map<VertexIndex, Set<VertexIndex>>();
    for (const v of subset){
        const vSubOutNeighbors = new Set<VertexIndex>();
        for (const neigh of v.outNeighbors.values()){
            if (subset.has(neigh)){
                vSubOutNeighbors.add(neigh.index);
            }
        }
        subOutNeighbors.set(v.index, vSubOutNeighbors); 
    }
    

    const subInNeighbors = new Map<VertexIndex, Set<VertexIndex>>();
    for (const v of subset){
        const vSubInNeighbors = new Set<VertexIndex>();
        for (const neigh of v.inNeighbors.values()){
            if (subset.has(neigh)){
                vSubInNeighbors.add(neigh.index);
            }
        }
        subInNeighbors.set(v.index, vSubInNeighbors); 
    }

    return {
        outNeighbors: subOutNeighbors,
        inNeighbors: subInNeighbors
    }
}
