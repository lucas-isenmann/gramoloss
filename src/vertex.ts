import { Coord, Vect } from './coord';
import { Geometric, Weighted } from "./traits";


export class Vertex<V> {
    index: number;
    data: V;

    constructor(index: number, data: V) {
        this.index = index;
        this.data = data;
    }
}


// export class BasicVertex extends Vertex<BasicVertex> {

//     clone(): BasicVertex {
//         const newVertex = new BasicVertex(this.pos.x, this.pos.y, this.weight, this.color);
//         return newVertex;
//     }

//     static default(): BasicVertex{
//         return new BasicVertex(0,0,"", "black");
//     }
// }





export class BasicVertex<V extends Geometric & Weighted> extends Vertex<V> {
    
    distTo(other: BasicVertex<V>): number {
        return Math.sqrt(this.getPos().dist2(other.getPos()));
    }

    translate(shift: Vect){
        this.getPos().translate(shift);
    }

    getPos(): Coord {
        return this.data.getPos();
    }

    /**
     * 
     * @param c1 one corner of the rectangle
     * @param c2 the opposite one
     * @returns true if this.pos is in the rectangle
     */
    isInRectangle(c1: Coord, c2: Coord){
        return this.data.getPos().is_in_rect(c1, c2);
    }
}