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
export function tournamentLightConflict2(m: Array<Array<boolean>>): Option<Array<number>> {

    let n = m.length;

    const order = new Array<number>();
    for (let u = 0; u < n; u ++){
        for (let v = 0; v < n; v ++){
            if ( m[v][u] == false) { continue };
            order.splice(0, order.length);

            for (let b = 0; b < n ; b ++){
                if ( m[b][v] ){ // v -> b
                    if (m[u][b] == false){
                        continue;
                    }
                    let i = 0;
                    while (i < order.length){
                        const a = order[i];
                        if ( m[a][b] ){
                            break;
                        }
                        i ++;
                    }
                    let isCycle = false;
                    let j = i+1;
                    while (j < order.length){
                        const c = order[j];
                        if ( m[c][b] ){
                        } else {
                            isCycle = true;
                            break;
                        }
                        j ++;
                    }
                    if (isCycle){
                        return [u,v,order[j],b,order[i]];
                    } else {
                        order.splice( i, 0, b);
                    }
                }
                
            }
        }
            
    }
    

    return undefined;
}


export function tournamentLightConflict<V,L>(g: Graph<V,L>): Option<Array<Vertex<V>>> {
    for (const [_, u] of g.vertices){
        for (const v of g.getOutNeighbors(u)){
            const order = new Array<Vertex<V>>();


            for (const b of g.getOutNeighbors(v)){
                if (g.hasArc(b.index,u.index) == false){
                    continue;
                }
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
                    return [u,v,order[j],b,order[i]];
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