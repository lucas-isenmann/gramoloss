import { Coord } from "./coord";

export class TextZone {
    pos: Coord;
    width: number;
    private _text: string;

    constructor(pos: Coord, width: number, text: string){
        this.pos = pos.copy();
        this.width = width;
        this._text = text;
    }

    set text(new_text: string){
        this._text = new_text;
    }

    get text(): string{
        return this._text;
    }
}