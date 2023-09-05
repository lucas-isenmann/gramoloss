import { Coord } from "./coord";
import { Option } from "./option";

export interface Geometric {
    getPos(): Coord;
}



export interface Weighted {
    getWeight(): string;
    setWeight(weight: string): void;
}


export class BasicVertexData {
    pos: Coord;
    weight: string;
    color: string;

    constructor(pos: Coord, weight: string, color: string){
        this.pos = pos;
        this.weight = weight;
        this.color = color;
    }

    getPos(){
        return this.pos;
    }

    getWeight(){
        return this.weight;
    }

    setWeight(weight: string){
        this.weight = weight;
    }
}


export class BasicLinkData {
    cp: Option<Coord>;
    weight: string;
    color: string;

    constructor(cp: Option<Coord>, weight: string, color: string){
        this.cp = cp;
        this.weight = weight;
        this.color = color;
    }


    getWeight(){
        return this.weight;
    }

    setWeight(weight: string){
        this.weight = weight;
    }
}