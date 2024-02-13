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

    getValue(param: string): any{
        if (param == "color"){
            return this.color;
        }
        if (param == "weight"){
            return this.weight;
        }
        return undefined;
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

    getValue(param: string): any{
        if (param == "cp"){
            return this.cp;
        }
        if (param == "color"){
            return this.color;
        }
        if (param == "weight"){
            return this.weight;
        }
        return undefined;
    }

    getWeight(){
        return this.weight;
    }

    setWeight(weight: string){
        this.weight = weight;
    }
}