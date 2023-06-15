import { Coord } from './coord';

export class Vertex {
    pos: Coord;
    color: string;
    weight: string;

    constructor(x: number, y: number, weight: string) {
        this.pos = new Coord(x, y);
        this.color = "black";
        this.weight = weight;
    }

    static default(): Vertex{
        return new Vertex(0,0,"");
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
    
}

