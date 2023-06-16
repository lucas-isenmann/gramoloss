import { Coord } from "./coord";
import { eqSet } from "./utils";

export enum ORIENTATION {
    UNDIRECTED = "UNDIRECTED",
    DIRECTED = "DIRECTED"
}


export abstract class Link<T extends Link<T>> {
    start_vertex: number;
    end_vertex: number;
    cp: Coord | string;
    orientation: ORIENTATION;
    color: string;
    weight: string = "";

    constructor(i: number, j: number, cp: Coord | string, orientation: ORIENTATION, color: string, weight: string) {
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

    signature_equals(start_index: number, end_index: number, orientation: ORIENTATION): boolean{
        if ( this.orientation == orientation ){
            switch (this.orientation){
                case ORIENTATION.UNDIRECTED: {
                    if ( eqSet(new Set([this.start_vertex, this.end_vertex]), new Set([start_index, end_index]) ) ){
                        return true;
                    }
                    break;
                }
                case ORIENTATION.DIRECTED: {
                    if ( this.start_vertex == start_index && this.end_vertex == end_index){
                        return true;
                    }
                    break;
                }
            }
        }
        return false;
    }

 
    abstract clone(): T;

}


export class BasicLink extends Link<BasicLink> {

    clone(): BasicLink{
        if (typeof this.cp === "string"){
            return new BasicLink(this.start_vertex, this.end_vertex, this.cp, this.orientation, this.color, this.weight);
        } else {
            return new BasicLink(this.start_vertex, this.end_vertex, this.cp.copy(), this.orientation, this.color, this.weight);
        }
    }


    static default_edge(x: number,y: number, weight: string): BasicLink{
        return new BasicLink(x,y,new Coord(0,0), ORIENTATION.UNDIRECTED, "black", weight);
    } 

    static default_arc(x: number,y: number, weight: string): BasicLink{
        return new BasicLink(x,y,new Coord(0,0), ORIENTATION.DIRECTED, "black", weight);
    } 

}