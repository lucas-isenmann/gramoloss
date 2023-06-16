import { Area } from "../area";
import { Coord } from "../coord";
import { Graph } from "../graph";
import { Link } from "../link";
import { Vertex } from "../vertex";
import { Representation } from "./representation";


export class DegreeWidthRep<V extends Vertex<V>, L extends Link<L>> implements Representation {
    c1: Coord;
    c2: Coord;
    x: Map<number, number>;

    constructor(g: Graph<V, L>, c1: Coord, c2: Coord){
        this.c1 = c1.copy(); 
        this.c2 = c2.copy();
        this.x = new Map();

        const h = (this.c2.x - this.c1.x ) / g.vertices.size;
        let i = this.c1.x + h/2;
        for (const [index, vertex] of g.vertices.entries()){
            this.x.set(index, i)
            i += h;
        }
    }

    distribute(){
        const h = (this.c2.x - this.c1.x ) / this.x.size;
        const stack = new Array();
        for (const [index, x] of this.x.entries()){
            stack.push([index,x]);
        }
        stack.sort(([i1,x1],[i2,x2]) => x1-x2);
        let i = this.c1.x + h/2;
        for (const [index, x] of stack){
            this.x.set(index, i);
            i += h;
        }
    }

    top_right_corner(): Coord{
        return new Coord(Math.max(this.c1.x, this.c2.x), Math.min(this.c1.y, this.c2.y))
    }
    
    bot_left_corner(): Coord{
        return new Coord(Math.min(this.c1.x, this.c2.x), Math.max(this.c1.y, this.c2.y))
    }


    top_left_corner(): Coord{
        return new Coord(Math.min(this.c1.x, this.c2.x), Math.min(this.c1.y, this.c2.y))
    }

    bot_right_corner(): Coord{
        return new Coord(Math.max(this.c1.x, this.c2.x), Math.max(this.c1.y, this.c2.y))
    }
}