import { VertexIndex } from "../vertex";




export function getDirectedCycle(verticesIndices: Iterable<VertexIndex>, outNeighbors: Map<VertexIndex, Iterable<VertexIndex>>): undefined | Array<VertexIndex> {
    const state = new Map<VertexIndex, number>();
    // if a vertexIndex is a key of state, then the value is either 1 for DISCOVERED
    // either 2 for TREATED, which means that no cycle start from this vertex
    // if a vertexIndex is not a key, then is is considered as UNDISCOVERED

    for (const v of verticesIndices) {
        if ( state.has(v) == false){
            const stack = new Array<VertexIndex>();
            const previous = new Map<VertexIndex, VertexIndex>();
            stack.push(v);
            while (stack.length > 0){
                const u = stack[stack.length-1]; 

                if (state.has(u) == false){
                    state.set(u, 1); // 1 is DISCOVERED
                    const neighbors = outNeighbors.get(u);
                    if (typeof neighbors == "undefined") return undefined; // should not happen
                    for (const uNeighbor of neighbors) {
                        if ( state.has(uNeighbor) == false){
                            previous.set(uNeighbor, u);
                            stack.push(uNeighbor);
                        } else if (state.get(uNeighbor) == 1) {

                            const cycle = new Array<VertexIndex>();
                            cycle.push(uNeighbor);
                            cycle.push(u);
                            let j = previous.get(u);
                            while ( typeof j != "undefined" && j != uNeighbor){
                                cycle.push(j);
                                j = previous.get(j);
                            }
                            return cycle;
                        }
                    }
                }
                else {
                    stack.pop();
                    state.set(u, 2); // TREATED, no cycle starts from u
                }
            }
        }
    }
    return undefined;
}