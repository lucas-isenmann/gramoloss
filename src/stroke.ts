import { Coord, Vect } from "./coord";

export class Stroke {
    positions: Array<Coord>;
    color: string;
    width: number;
    top_left: Coord;
    bot_right: Coord;
    index: number;

    /**
     * Positions should be non empty, otherwise top_left and bot_right are erroneous.
     */
    constructor(positions: Array<Coord>, color: string, width: number, index: number) {
        this.positions = positions;
        this.color = color;
        this.width = width;
        this.index = index;
        this.top_left = new Coord(0,0);
        this.bot_right = new Coord(0,0);
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
    }

    translate(shift: Vect) {
        this.top_left.translate(shift);
        this.bot_right.translate(shift);
        for (const pos of this.positions.values()) {
            pos.translate(shift);
        }
    }

    rtranslate(shift: Vect) {
        this.top_left.rtranslate(shift);
        this.bot_right.rtranslate(shift);
        for (const pos of this.positions.values()) {
            pos.rtranslate(shift);
        }
    }
}