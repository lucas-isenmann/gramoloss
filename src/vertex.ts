import { Coord } from './coord';

export abstract class Vertex<V extends Vertex<V>> {
    pos: Coord;
    color: string;
    weight: string;

    constructor(x: number, y: number, weight: string) {
        this.pos = new Coord(x, y);
        this.color = "black";
        this.weight = weight;
    }

   

    /**
     * 
     * @param c1 one corner of the rectangle
     * @param c2 the opposite one
     * @returns true if this.pos is in the rectangle
     */
    isInRectangle(c1: Coord, c2: Coord){
        return this.pos.is_in_rect(c1, c2);
    }

    abstract clone(): V;
    
}


export class BasicVertex extends Vertex<BasicVertex> {

    clone(): BasicVertex {
        const newVertex = new BasicVertex(this.pos.x, this.pos.y, this.weight);
        newVertex.color = this.color;
        return newVertex;
    }

    static default(): BasicVertex{
        return new BasicVertex(0,0,"");
    }
}
