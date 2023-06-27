import { Coord } from "./coord";
import { Geometric, Weighted } from "./traits";
import { eqSet } from "./utils";
import { Vertex } from "./vertex";
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

   

    signature_equals(start_index: number, end_index: number, orientation: ORIENTATION): boolean{
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








export class BasicLink<V extends Geometric & Weighted, L extends Weighted> extends Link<V,L> {
    cp: Option<Coord>;


    getWeight(): string {
        return this.data.getWeight();
    }

    setWeight(weight: string){
        this.data.setWeight(weight);
    }

    /**
     *  @param fixed_end is the coord of the fixed_end
     * @param new_pos and @param previous_pos are the positions of the end which has moved
     */
    transform_cp(new_pos: Coord, previous_pos: Coord, fixed_end: Coord) {
        if (typeof this.cp == "string"){
            return;
        }
        const w = fixed_end;
        const u = previous_pos.sub(w);
        const nv = new_pos.sub(w);
        const theta = nv.getTheta(u);
        const rho = u.getRho(nv);
        const cp = this.cp.copy();
        this.cp.x = w.x + rho * (Math.cos(theta) * (cp.x - w.x) - Math.sin(theta) * (cp.y - w.y))
        this.cp.y = w.y + rho * (Math.sin(theta) * (cp.x - w.x) + Math.cos(theta) * (cp.y - w.y))
    }
} 