import { Coord } from "./coord";

export class Stroke {
    positions: Array<Coord>;
    color: string;
    width: number;
    top_left: Coord;
    bot_right: Coord;

    constructor(positions: any, color: string, width: number) {
        this.positions = positions;
        this.color = color;
        this.width = width;
        if(positions.length>0){
            this.top_left = new Coord(positions[0].x, positions[0].y);
            this.bot_right = new Coord(positions[0].x, positions[0].y);
            for(let i = 1; i<positions.length; i++){
                this.bot_right.x = Math.max(positions[i].x, this.bot_right.x);
                this.top_left.x = Math.min(positions[i].x, this.top_left.x);
                this.bot_right.y = Math.max(positions[i].y, this.bot_right.y);
                this.top_left.y = Math.min(positions[i].y, this.top_left.y);
            }
        }
        else{
            this.top_left = null;
            this.bot_right = null;
        }
    }

    translate(shift: Coord) {
        for (const pos of this.positions.values()) {
            pos.translate(shift);
        }
    }

    rtranslate(shift: Coord) {
        for (const pos of this.positions.values()) {
            pos.rtranslate(shift);
        }
    }
}