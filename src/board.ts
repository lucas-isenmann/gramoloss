import { Area } from "./area";
import { Graph } from "./graph";
import { Link } from "./link";
import { Representation } from "./representations/representation";
import { Stroke } from "./stroke";
import { TextZone } from "./text_zone";
import { Vertex } from "./vertex";

export class Board<V extends Vertex,L extends Link, S extends Stroke, A extends Area, T extends TextZone, R extends Representation> {
    graph: Graph<V,L,S,A>;
    text_zones: Map<number, T>;
    representations: Map<number, R>;

    constructor() {
        this.graph = new Graph();
        this.text_zones = new Map();
        this.representations = new Map();
    }

    get_next_available_index_representation() {
        let index = 0;
        while (this.representations.has(index)) {
            index += 1;
        }
        return index;
    }

    get_next_available_index_text_zone() {
        let index = 0;
        while (this.text_zones.has(index)) {
            index += 1;
        }
        return index;
    }

    get_next_available_index_strokes() {
        let index = 0;
        while (this.graph.strokes.has(index)) {
            index += 1;
        }
        return index;
    }

    get_next_available_index_area() {
        let index = 0;
        while (this.graph.areas.has(index)) {
            index += 1;
        }
        return index;
    }



    get_value(kind: string, index: number, param: string){
        if (kind == "TextZone"){
            return this.text_zones.get(index)[param];
        } else if (kind == "Vertex"){
            return this.graph.vertices.get(index)[param];
        } else if (kind == "Link"){
            return this.graph.links.get(index)[param];
        } else if (kind == "Stroke"){
            return this.graph.strokes.get(index)[param];
        } else if (kind == "Area"){
            return this.graph.areas.get(index)[param];
        }
    }
}