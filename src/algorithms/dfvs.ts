// DFVS: Directed Feedback Vertex Set

import { Graph } from "../graph";


function visit (cur: number, 
    visited: Set<number>,
    outNeighbors: Map<number, Set<number>>, 
    stack: Array<number>) {
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
function assign ( cur: number,
    inNeighbors: Map<number, Set<number>>,
    assigned: Set<number>,
    component: Set<number>): boolean {
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
    vertices: Array<number>,
    outNeighbors: Map<number, Set<number>>, 
    inNeighbors: Map<number,Set<number>>
): Array<Set<number>>{
    const scc = new Array<Set<number>>(); // Strongly Connected Components
    const stack = new Array<number>();
    const visited = new Set<number>();

    for (const v of vertices) {
        visit(v, visited, outNeighbors, stack);
    }

    const assigned = new Set<number>();

    while (stack.length > 0) {
        const stackHead = stack.pop();
        if (typeof stackHead == "undefined") break;

        if (assigned.has(stackHead) == false) {
            const component = new Set<number>();
            const is_source = assign(stackHead, inNeighbors, assigned, component);
            scc.push(component);
        }
    }

    return scc;
}


function aux(
    vertices: Array<number>,
    choosable: Array<number>,
    current: Set<number>, 
    best: Set<number>, 
    outNeighbors: Map<number, Set<number>>, 
    inNeighbors: Map<number, Set<number>>,
    depth: number
    ){
        // console.log("_".repeat(depth) + "aux");
        // There is no more vertices
        if (vertices.length <= 2){
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
            // console.log("decomposable");
            
            const agregateMinSol = new Set<number>();
            for (const compo of components){

                const compoVertices = Array.from(compo);

                // Compute out-neighbors restricted to compo
                const compoOutNeighbors = new Map<number, Set<number>>();
                for (const [v,vOutNeighbors] of outNeighbors){
                    if (compo.has(v)){
                        const vCompoOutNeighbors = new Set<number>();
                        for (const neigh of vOutNeighbors){
                            if (compo.has(neigh)){
                                vCompoOutNeighbors.add(neigh);
                            }
                        }
                        compoOutNeighbors.set(v, vCompoOutNeighbors);
                    }
                }

                // Compute in-neighbors restricted to compo
                const compoInNeighbors = new Map<number, Set<number>>();
                for (const [vId, vInNeighbors] of inNeighbors){
                    if (compo.has(vId)){
                        const vCompoInNeighbors = new Set<number>();
                        for (const neigh of vInNeighbors){
                            if (compo.has(neigh)){
                                vCompoInNeighbors.add(neigh);
                            }
                        }
                        compoInNeighbors.set(vId, vCompoInNeighbors);
                    }
                }

                // The restriction of best to compo is a DFVS of compo
                const compoBest = new Set<number>();
                for (const vId of best){
                    if (compo.has(vId)){
                        compoBest.add(vId);
                    }
                }

                // Restriction of choosable to compo
                const compoChoosable = new Array();
                for (const vId of choosable){
                    if (compo.has(vId)){
                        compoChoosable.push(vId);
                    }
                }

                aux(compoVertices, choosable, new Set(), compoBest, compoOutNeighbors, compoInNeighbors, depth+1);

                for (const vId of compoBest){
                    agregateMinSol.add(vId);
                }

            }
            best.clear();
            for (const vId of agregateMinSol){
                best.add(vId);
            }
            for (const vId of current){
                best.add(vId);
            }
            return;
        }


        if (choosable.length == 0) return;


        // There is exactly 1 strongly connected component
        // Branch on every vertex

        const v = choosable.pop();
        // console.log("branch on choosable.back()", v);
        if (typeof v == "undefined") return;

        if (current.size >= best.size) return;

        // Case: v is not used
        aux(vertices, choosable, current, best, outNeighbors, inNeighbors, depth+1);

        if (current.size + 1 >= best.size) return;

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


export function minDFVS<V,L>(g: Graph<V,L>): Set<number>{

    const vertices = new Array();
    for (const vId of g.vertices.keys()){
        vertices.push(vId);
    }
    const choosable = new Array();
    for (const vId of g.vertices.keys()){
        choosable.push(vId);
    }

    const outNeighbors = new Map<number, Set<number>>();
    for (const vId of g.vertices.keys()){
        outNeighbors.set(vId, new Set(g.getOutNeighborsList(vId)));
    }

    const inNeighbors = new Map<number, Set<number>>();
    for (const vId of g.vertices.keys()){
        inNeighbors.set(vId, new Set(g.getInNeighborsList(vId)));
    }
    
    const best = new Set<number>(vertices);


    aux(vertices, 
        choosable,
        new Set(), 
        best, 
        outNeighbors,
        inNeighbors, 0);

    return best;
}