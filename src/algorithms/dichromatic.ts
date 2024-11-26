import { Graph } from "../graph";
import { Option } from "../option";
import { Vertex } from "../vertex";


function search_uncolored_triangles(m: Array<Array<boolean>>, n: number, coloring: Array<number>, color_max: number): Array<number>{

    for (let i = 0; i < n ; i ++){
        for (let j = 0; j < n ; j ++ ){
            for (let k = 0; k < n ; k ++){
                if (m[i][j] && m[j][k] && m[k][i]){
                    let nb_uncolored = 0;
                    if (coloring[i] == 0){
                        nb_uncolored ++;
                    }
                    if (coloring[j] == 0){
                        nb_uncolored ++;
                    } 
                    if (coloring[k] == 0){
                        nb_uncolored ++;
                    }

                    if (nb_uncolored >= 2) {
                        return [i,j,k];
                    }
                    if (nb_uncolored == 1){
                        // Branch on this vertex
                    }
                }
            }
        }
    }
    return [];
}

export function acyclic_coloring<V,L>(g: Graph<V,L>): Array<Array<number>> {
    
}

export function dichromatic<V,L>(g: Graph<V,L>): number {

}