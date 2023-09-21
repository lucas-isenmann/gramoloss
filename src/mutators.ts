import { BasicGraph } from "./graph";
import { ORIENTATION } from "./link";
import { BasicLinkData, BasicVertexData } from "./traits";


export function completeIntoClique(g: BasicGraph<BasicVertexData,BasicLinkData>){
    for (const [i1, v1] of g.vertices.entries()){
        for (const [i2, v2] of g.vertices.entries()){
            if ( i1 >= i2) continue;
            if ( g.has_link(i1, i2, ORIENTATION.UNDIRECTED) == false ){
                g.addLink(i1, i2, ORIENTATION.UNDIRECTED, new BasicLinkData(undefined, "", "black") );
            }
        }
    }
}


export function removeLinks(g: BasicGraph<BasicVertexData,BasicLinkData>){
    g.links.clear();
}