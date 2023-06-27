import { Coord } from "./coord";

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
    weight: string;
    color: string;

    constructor( weight: string, color: string){
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