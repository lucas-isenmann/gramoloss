import { Coord } from "./coord";

export class Rectangle {
    c1 : Coord;
    c2 : Coord;
    color: string;

    constructor(c1: Coord, c2: Coord, color: string){
        this.c1 = c1.copy();
        this.c2 = c2.copy();
        this.color = color;
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