import { Graph } from "../graph";
import { Option } from "../option";
import { Vertex } from "../vertex";


/**
 * A conflict is a list of 5 vertices u, v, a, b, c such that
 * u -> v
 * a -> b -> c -> a is a cycle
 * a,b,c -> u
 * v -> a,b,c
 * @param g 
 * @returns 
 */
export function tournamentLightConflict<V,L>(g: Graph<V,L>): Option<Array<Vertex<V>>> {

    for (const [_, u] of g.vertices){
        for (const v of g.getOutNeighbors(u)){
            const order = new Array<Vertex<V>>();


            for (const b of g.getOutNeighbors(v)){
                
                let i = 0;
                while (i < order.length){
                    const a = order[i];
                    if ( g.hasArc(b.index, a.index) ){
                        break;
                    }
                    i ++;
                }
                let isCycle = false;
                let j = i+1;
                while (j < order.length){
                    const c = order[j];
                    if ( g.hasArc(b.index, c.index)){
                    } else {
                        isCycle = true;
                        break;
                    }
                    j ++;
                }
                if (isCycle){
                    return [u,v,order[i],b,order[j]];
                } else {
                    order.splice( i, 0, b);
                }
            }
        }
            
    }
    

    return undefined;
}


/**
 * A tournament is light if there is no arc uv such that there exists a cycle abc such that abc dominates u and v dominates abcs.
 * If you want to get a conflict, if there is some, use the function tournamentLightConflict
 * @param g 
 * @returns 
 */
export function isTournamentLight<V,L>(g: Graph<V,L>): boolean {
    if (typeof tournamentLightConflict(g) == "undefined"){
        return true;
    } else {
        return false;
    }
}