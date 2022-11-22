import { Coord, Vect } from "./coord";
import { Vertex } from "./vertex";

// c1 and c2 are any points in the plane (not necessarily the bottom left corner or other corners)
export class Area {
    c1: Coord;
    c2: Coord;
    color: string;
    label: string;


    constructor(label: string, c1: Coord, c2: Coord, color: string) {
        this.c1 = c1;
        this.c2 = c2;
        this.label = label;
        this.color = "#E60007";
    }

    translate(shift: Vect) {
        this.c1.translate(shift);
        this.c2.translate(shift);
    }

    rtranslate(shift: Vect) {
        this.c1.rtranslate(shift);
        this.c2.rtranslate(shift);
    }

    is_containing(v: Vertex): Boolean {
        return Math.min(this.c1.x, this.c2.x) <= v.pos.x && v.pos.x <= Math.max(this.c1.x, this.c2.x) && Math.min(this.c1.y, this.c2.y) <= v.pos.y && v.pos.y <= Math.max(this.c1.y, this.c2.y);
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