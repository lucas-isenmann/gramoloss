import { Graph } from "../graph";




/**
 * 
 * @param choosable the vertices that can be chosen or not
 * @param current the current subset of vertices that have been chosen
 * @param g 
 * @param property 
 * @param verbose 
 * @returns 
 */
function auxMin<V,L>(
    choosable: Array<number>,
    current: Set<number>, 
    g: Graph<V,L>,
    property: (h: Graph<V,L>, subset: Set<number>) => boolean,
    verbose: boolean
    ): {
        minimum: number,
        nbMinSolutions: number,
        nbSolutions: number,
    }{
        // console.log("aux", choosable, current)
        const v = choosable.pop();
        
        if (typeof v == "undefined"){
            if (property(g, current)){
                if (verbose){
                    console.log(current);
                }
                return {minimum: current.size, nbMinSolutions: 1, nbSolutions: 1};
            } else {
                if (verbose){
                    console.log("X", current);
                }
                return {minimum: Infinity, nbMinSolutions: 0, nbSolutions: 0};
            }
        } else {
            const r1 = auxMin( choosable, current, g, property, verbose);

            current.add(v);
            const r2 = auxMin(choosable, current, g, property, verbose);
            current.delete(v);

            choosable.push(v);
    
            if (r1.minimum == r2.minimum){
                return {
                    minimum: r1.minimum,
                    nbMinSolutions: r1.nbMinSolutions + r2.nbMinSolutions,
                    nbSolutions: r1.nbSolutions + r2.nbSolutions 
                };
            } else if (r1.minimum < r2.minimum){
                return {
                    minimum: r1.minimum,
                    nbMinSolutions: r1.nbMinSolutions,
                    nbSolutions: r1.nbSolutions + r2.nbSolutions 
                };
            } else {
                return {
                    minimum: r2.minimum,
                    nbMinSolutions: r2.nbMinSolutions,
                    nbSolutions: r1.nbSolutions + r2.nbSolutions 
                };
            }
            
        }
}


/**
 * Bruteforce algorithm which tries every 2^V subset of the vertices of G.
 * @param g 
 * @param property meta property on a graph
 * @param verbose if true, prints all the solutions
 * @returns minimum, nbMinSolutions, nbSolutions 
 */
export function bruteforceMinSubsetVertices<V,L>(
    g: Graph<V,L>, 
    property: (g: Graph<V,L>, subset: Set<number>) => boolean,
    verbose: boolean
    ): {
        minimum: number,
        nbMinSolutions: number,
        nbSolutions: number,
    }{
        const choosable = new Array();
        for (const vId of g.vertices.keys()){
            choosable.push(vId);
        }

        return auxMin(choosable, new Set<number>(), g, property, verbose);
}