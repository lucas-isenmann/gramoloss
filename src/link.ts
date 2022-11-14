import { Coord } from "./coord";
import { eqSet } from "./utils";

export enum ORIENTATION {
    UNDIRECTED = "UNDIRECTED",
    DIRECTED = "DIRECTED"
}


export class Link {
    start_vertex: number;
    end_vertex: number;
    cp: Coord; // control point
    orientation: ORIENTATION;
    color: string;
    weight: string = "";

    constructor(i: number, j: number, cp: Coord, orientation: ORIENTATION, color: string, weight: string) {
        this.start_vertex = i;
        this.end_vertex = j;
        this.cp = cp;
        this.orientation = orientation;
        this.color = color;
        this.weight = weight;
    }

    // fixed_end is the coord of the fixed_end
    // new_pos and previous_pos are the positions of the end which has moved
    transform_cp(new_pos: Coord, previous_pos: Coord, fixed_end: Coord) {
        const w = fixed_end;
        const u = previous_pos.sub(w);
        const nv = new_pos.sub(w);
        const theta = nv.getTheta(u);
        const rho = u.getRho(nv);
        const cp = this.cp.copy();
        this.cp.x = w.x + rho * (Math.cos(theta) * (cp.x - w.x) - Math.sin(theta) * (cp.y - w.y))
        this.cp.y = w.y + rho * (Math.sin(theta) * (cp.x - w.x) + Math.cos(theta) * (cp.y - w.y))
    }

    has_same_signature(link: Link){
        if ( this.orientation == link.orientation ){
            switch (this.orientation){
                case ORIENTATION.UNDIRECTED: {
                    if ( eqSet(new Set([this.start_vertex, this.end_vertex]), new Set([link.start_vertex, link.end_vertex]) ) ){
                        return true;
                    }
                    break;
                }
                case ORIENTATION.DIRECTED: {
                    if ( this.start_vertex == link.start_vertex && this.end_vertex == link.end_vertex){
                        return true;
                    }
                    break;
                }
            }
        }
        return false;
    }


}

