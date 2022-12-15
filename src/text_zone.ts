import { Coord } from "./coord";

export class TextZone {
    pos: Coord;
    width: number;
    text: string;

    constructor(pos: Coord, width: number, text: string){
        this.pos = pos.copy();
        this.width = width;
        this.text = text;
    }
}