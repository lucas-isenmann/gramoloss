import { Graph } from "../graph";


/**
 * Returns the adjacencies list. (Can be seen as an abstract graph)
 * @param g 
 * @param subset the subset of vertices to induce the graph (keep every arc xy when x and y are in subset)
 * @returns outNeighbors: Map<number, Set<number>> which tells for every vertex id the out-neighbors id of this vertex
 * 
 */
export function getInducedSubgraph<V,L>(g: Graph<V,L>, subset: Set<number>) {
    
    const subOutNeighbors = new Map<number, Set<number>>();
    for (const vId of subset){
        const vSubOutNeighbors = new Set<number>();
        for (const neigh of g.getOutNeighborsList(vId)){
            if (subset.has(neigh)){
                vSubOutNeighbors.add(neigh);
            }
        }
        subOutNeighbors.set(vId, vSubOutNeighbors); 
    }
    

    const subInNeighbors = new Map<number, Set<number>>();
    for (const vId of subset){
        const vSubInNeighbors = new Set<number>();
        for (const neigh of g.getInNeighborsList(vId)){
            if (subset.has(neigh)){
                vSubInNeighbors.add(neigh);
            }
        }
        subInNeighbors.set(vId, vSubInNeighbors); 
    }

    return {
        outNeighbors: subOutNeighbors,
        inNeighbors: subInNeighbors
    }
}
