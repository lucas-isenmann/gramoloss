import { Coord } from "./coord";
import { BasicLinkData, Geometric, Weighted } from "./traits";
import { eqSet, is_quadratic_bezier_curves_intersection, is_segments_intersection, segmentsInteriorIntersection } from "./utils";
import { BasicVertex, Vertex } from "./vertex";
import { Option } from "./option";

export enum ORIENTATION {
    UNDIRECTED = "UNDIRECTED",
    DIRECTED = "DIRECTED"
}


export class Link<V,L> {
    index: number;
    startVertex: Vertex<V>;
    endVertex: Vertex<V>;
    orientation: ORIENTATION;
    data: L;


    constructor(index: number, startVertex: Vertex<V>, endVertex: Vertex<V>, orientation: ORIENTATION, data: L) {
        this.index = index;
        this.startVertex = startVertex;
        this.endVertex = endVertex;
        this.orientation = orientation;
        this.data = data;
    }

   
    /**
     * Return true iff at least one extremity of the link is in the set `s`.
     * @return `s.has(startIndex) || s.has(endIndex)`
     */
    hasAnExtrimityIn(s: Set<number>){
        return s.has(this.startVertex.index) || s.has(this.endVertex.index);
    }

    signatureEquals(start_index: number, end_index: number, orientation: ORIENTATION): boolean{
        if ( this.orientation == orientation ){
            switch (this.orientation){
                case ORIENTATION.UNDIRECTED: {
                    if ( eqSet(new Set([this.startVertex.index, this.endVertex.index]), new Set([start_index, end_index]) ) ){
                        return true;
                    }
                    break;
                }
                case ORIENTATION.DIRECTED: {
                    if ( this.startVertex.index == start_index && this.endVertex.index == end_index){
                        return true;
                    }
                    break;
                }
            }
        }
        return false;
    }

}




// export class BasicLink extends Link<BasicLink> {

//     clone(): BasicLink{
//         if (typeof this.cp === "string"){
//             return new BasicLink(this.start_vertex, this.end_vertex, this.cp, this.orientation, this.color, this.weight);
//         } else {
//             return new BasicLink(this.start_vertex, this.end_vertex, this.cp.copy(), this.orientation, this.color, this.weight);
//         }
//     }


//     static default_edge(x: number,y: number, weight: string): BasicLink{
//         return new BasicLink(x,y,new Coord(0,0), ORIENTATION.UNDIRECTED, "black", weight);
//     } 

//     static default_arc(x: number,y: number, weight: string): BasicLink{
//         return new BasicLink(x,y,new Coord(0,0), ORIENTATION.DIRECTED, "black", weight);
//     } 

// }






export class BasicLink<V extends Geometric & Weighted, L extends BasicLinkData> extends Link<V,L> {
    startVertex: BasicVertex<V>;
    endVertex: BasicVertex<V>;

    constructor(index: number, startVertex: BasicVertex<V>, endVertex: BasicVertex<V>, orientation: ORIENTATION, data: L ){
        super(index, startVertex, endVertex, orientation, data);
        this.startVertex = startVertex;
        this.endVertex = endVertex;
    }

    /**
     * Test if this link intersect another link 
    // TODO: faster algorithm for intersection between segment and bezier
     * TODO use in the planar test of a graph
     */
    intersectsLink(link: BasicLink<V,L>): boolean{
        const v1 = this.startVertex.getPos();
        const w1 = this.endVertex.getPos();
        const v2 = link.startVertex.getPos();
        const w2 = link.endVertex.getPos();
        if (typeof this.data.cp == "undefined" && typeof link.data.cp == "undefined"){
            return typeof segmentsInteriorIntersection(v1, w1, v2, w2) == "undefined";
            // return is_segments_intersection(v1, w1, v2, w2);
        }
        let cp1 = v1.middle(w1);
        let cp2 = v2.middle(w2);
        if (typeof this.data.cp != "undefined"){
            cp1 = this.data.cp;
        }
        if (typeof link.data.cp != "undefined"){
            cp2 = link.data.cp;
        }
        return is_quadratic_bezier_curves_intersection(v1, cp1, w1, v2, cp2, w2);
    }


    getWeight(): string {
        return this.data.getWeight();
    }

    setWeight(weight: string){
        this.data.setWeight(weight);
    }

     /**
     * @param fixedEnd is the coord of the extremity which has not moved
     * @param newPos and @param previousPos are the positions of the extremity which has moved
     */
    transformCP(newPos: Coord, previousPos: Coord, fixedEnd: Coord){
        if (typeof this.data.cp == "undefined"){
            return;
        }
        const w = fixedEnd;
        const u = previousPos.sub(w);
        const nv = newPos.sub(w);
        const theta = nv.getTheta(u);
        const rho = u.getRho(nv);
        const cp = this.data.cp.copy();
        this.data.cp.x = w.x + rho * (Math.cos(theta) * (cp.x - w.x) - Math.sin(theta) * (cp.y - w.y))
        this.data.cp.y = w.y + rho * (Math.sin(theta) * (cp.x - w.x) + Math.cos(theta) * (cp.y - w.y))
    }


} 