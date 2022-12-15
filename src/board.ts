import { Area } from "./area";
import { Graph } from "./graph";
import { Link } from "./link";
import { Stroke } from "./stroke";
import { TextZone } from "./text_zone";
import { Vertex } from "./vertex";

export class Board<V extends Vertex,L extends Link, S extends Stroke, A extends Area, T extends TextZone> {
    graph: Graph<V,L,S,A>;
    text_zones: Map<number, T>;

    constructor() {
        this.graph = new Graph();
        this.text_zones = new Map();
    }

    get_next_available_index_text_zone() {
        let index = 0;
        while (this.text_zones.has(index)) {
            index += 1;
        }
        return index;
    }
}