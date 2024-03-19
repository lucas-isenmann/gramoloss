    import { Graph } from "./graph";
    import { ORIENTATION } from "./link";

    interface Default<L> {
        default(): L
    }

    export function complete<V,L>(g: Graph<V,L>){
        for (const [i1, v1] of g.vertices.entries()){
            for (const [i2, v2] of g.vertices.entries()){
                if ( i1 >= i2) continue;
                if ( g.hasLink(i1, i2, ORIENTATION.UNDIRECTED) == false ){
                    g.addLink(i1, i2, ORIENTATION.UNDIRECTED, new L() );
                }
            }
        }
    }