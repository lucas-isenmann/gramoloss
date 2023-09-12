import { Coord } from "./coord";
import { BasicLinkData, Geometric, Weighted } from "./traits";
import { eqSet } from "./utils";
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