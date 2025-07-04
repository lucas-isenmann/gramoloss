// DFVS: Directed Feedback Vertex Set

import { Graph } from "../graph";
import { Vertex, VertexIndex } from "../vertex";
import { getDirectedCycle } from "./cycle";
import { getInducedSubgraph } from "./inducedSubgraph";


function visit (cur: VertexIndex, 
    visited: Set<VertexIndex>,
    outNeighbors: Map<VertexIndex, Set<VertexIndex>>, 
    stack: Array<VertexIndex>) {
        if (visited.has(cur)) return;
        visited.add(cur);
        const curOutNeighbors = outNeighbors.get(cur);
        if (typeof curOutNeighbors != "undefined"){
            for (const neigh of curOutNeighbors) {
                visit(neigh, visited, outNeighbors, stack);
            }
            stack.push(cur);
        }
}

/**
 * 
 * @param cur 
 * @param inNeighbors 
 * @param assigned 
 * @param component 
 * @return true if the component is a source
 * @return false otherwise (there is an arc from a vertex not in the component to this component)
 */
function assign ( cur: VertexIndex,
    inNeighbors: Map<VertexIndex, Set<VertexIndex>>,
    assigned: Set<VertexIndex>,
    component: Set<VertexIndex>): boolean {
        if (assigned.has(cur) == false) {
            assigned.add(cur);
            component.add(cur);
            let isSource = true;
            const curInNeighbors = inNeighbors.get(cur);
            if (typeof curInNeighbors == "undefined") return isSource;
            for (const neigh of curInNeighbors) {
                if (assigned.has(neigh) && component.has(neigh) == false){
                    isSource = false;
                } else {
                    if (assign(neigh, inNeighbors, assigned, component) == false){
                        isSource = false;
                    }
                }
            }
            return isSource;
        }
        return true;
}


    


function scc(
    vertices: Array<VertexIndex>,
    outNeighbors: Map<VertexIndex, Set<VertexIndex>>, 
    inNeighbors: Map<VertexIndex,Set<VertexIndex>>
): Array<Set<VertexIndex>>{
    const scc = new Array<Set<VertexIndex>>(); // Strongly Connected Components
    const stack = new Array<VertexIndex>();
    const visited = new Set<VertexIndex>();

    for (const v of vertices) {
        visit(v, visited, outNeighbors, stack);
    }

    const assigned = new Set<VertexIndex>();

    while (stack.length > 0) {
        const stackHead = stack.pop();
        if (typeof stackHead == "undefined") break;

        if (assigned.has(stackHead) == false) {
            const component = new Set<VertexIndex>();
            const is_source = assign(stackHead, inNeighbors, assigned, component);
            scc.push(component);
        }
    }

    return scc;
}


function aux(
    vertices: Array<VertexIndex>,
    choosable: Array<VertexIndex>,
    current: Set<VertexIndex>, 
    best: Set<VertexIndex>, 
    outNeighbors: Map<VertexIndex, Set<VertexIndex>>, 
    inNeighbors: Map<VertexIndex, Set<VertexIndex>>,
    depth: number
    ){
        // const predebug = "_".repeat(depth)
        // console.log(predebug, "aux");

        // There is no cycle
        if (vertices.length <= 1 ) { //  || typeof getDirectedCycle(vertices, outNeighbors) == "undefined"){
            if (current.size < best.size){
                best.clear();
                for (const vId of current){
                    best.add(vId);
                }
            }
            return;
        }


        // There is at least 1 vertex

        const components = scc(vertices, outNeighbors, inNeighbors);
        if (components.length >= 2){
            // console.log(predebug, "decomposable into ", components.length, "components");
            
            const agregateMinSol = new Set<VertexIndex>();
            for (const compo of components){
                // console.log(predebug, compo);
                const compoVertices = Array.from(compo);

                // Compute out-neighbors restricted to compo
                const compoOutNeighbors = new Map<VertexIndex, Set<VertexIndex>>();
                for (const [v,vOutNeighbors] of outNeighbors){
                    if (compo.has(v)){
                        const vCompoOutNeighbors = new Set<VertexIndex>();
                        for (const neigh of vOutNeighbors){
                            if (compo.has(neigh)){
                                vCompoOutNeighbors.add(neigh);
                            }
                        }
                        compoOutNeighbors.set(v, vCompoOutNeighbors);
                    }
                }

                // Compute in-neighbors restricted to compo
                const compoInNeighbors = new Map<VertexIndex, Set<VertexIndex>>();
                for (const [vId, vInNeighbors] of inNeighbors){
                    if (compo.has(vId)){
                        const vCompoInNeighbors = new Set<VertexIndex>();
                        for (const neigh of vInNeighbors){
                            if (compo.has(neigh)){
                                vCompoInNeighbors.add(neigh);
                            }
                        }
                        compoInNeighbors.set(vId, vCompoInNeighbors);
                    }
                }

                // The restriction of best to compo is a DFVS of compo
                const compoBest = new Set<VertexIndex>();
                for (const vId of best){
                    if (compo.has(vId)){
                        compoBest.add(vId);
                    }
                }

                // Restriction of choosable to compo
                const compoChoosable = new Array<VertexIndex>();
                for (const vId of choosable){
                    if (compo.has(vId)){
                        compoChoosable.push(vId);
                    }
                }

                aux(compoVertices, compoChoosable, new Set(), compoBest, compoOutNeighbors, compoInNeighbors, depth+1);

                for (const vId of compoBest){
                    agregateMinSol.add(vId);
                }

            }
            if (agregateMinSol.size + current.size < best.size){
                best.clear();
                for (const vId of agregateMinSol){
                    best.add(vId);
                }
                for (const vId of current){
                    best.add(vId);
                }
            }
            return;
        }


        if (choosable.length == 0) return;


        // There is exactly 1 strongly connected component
        // Branch on every vertex
        if (current.size >= best.size) return;

        const v = choosable.pop();
        // console.log(predebug, "branch on choosable.back()", v);
        if (typeof v == "undefined") return;


        // Case: v is not used
        aux(vertices, choosable, current, best, outNeighbors, inNeighbors, depth+1);

        if (current.size + 1 >= best.size) {
            choosable.push(v);
            return;
        }

        // Case: v is used: remove it from the graph
        // Update structure after selecting v
        current.add(v);
        const i = vertices.indexOf(v);
        if (i == -1) return; // bug
        vertices.splice(i, 1);
        const outNeighborsReinsert = new Array();
        for (const [vId, out] of outNeighbors.entries()){
            if (out.has(v)){
                out.delete(v);
                outNeighborsReinsert.push(vId);
            }
        }
        const inNeighborsReinsert = new Array();
        for (const [vId, inNeighs] of inNeighbors.entries()){
            if (inNeighs.has(v)){
                inNeighs.delete(v);
                inNeighborsReinsert.push(vId);
            }
        }

        aux(vertices, choosable, current, best, outNeighbors, inNeighbors, depth+1);

        // Revert changes
        vertices.splice(i, 0, v);
        current.delete(v);
        for (const w of outNeighborsReinsert){
            const outNeighs = outNeighbors.get(w);
            if (typeof outNeighs != "undefined"){
                outNeighs.add(v);
            }
        }
        for (const w of inNeighborsReinsert){
            const inNeighs = inNeighbors.get(w);
            if (typeof inNeighs != "undefined"){
                inNeighs.add(v);
            }
        }

        choosable.push(v);
}


export function minDFVS(g: Graph): Set<VertexIndex>{

    const vertices = new Array();
    for (const vId of g.vertices.keys()){
        vertices.push(vId);
    }
    const choosable = new Array();
    for (const vId of g.vertices.keys()){
        choosable.push(vId);
    }

    const outNeighbors = new Map<VertexIndex, Set<VertexIndex>>();
    const inNeighbors = new Map<VertexIndex, Set<VertexIndex>>();
    for (const v of g.vertices.values()){
        outNeighbors.set(v.index, new Set(v.outNeighbors.keys()));
        inNeighbors.set(v.index, new Set(v.inNeighbors.keys()));
    }
    
    const best = new Set<VertexIndex>(vertices);


    aux(vertices, 
        choosable,
        new Set(), 
        best, 
        outNeighbors,
        inNeighbors, 0);

    return best;
}







export function isDFVS(g: Graph, subset: Set<VertexIndex>): boolean{
    const complementary = new Set<Vertex>();
    const complementaryIndices = new Set<VertexIndex>();
    for (const v of g.vertices.values()){
        if (subset.has(v.index) == false){
            complementary.add(v);
            complementaryIndices.add(v.index);
        }
    }
    const sub = getInducedSubgraph(g, complementary);

    return (typeof getDirectedCycle(complementaryIndices, sub.outNeighbors) == "undefined");
}