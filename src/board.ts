import { Area } from "./area";
import { Vect } from "./coord";
import { Graph } from "./graph";
import { Link } from "./link";
import { Representation } from "./representations/representation";
import { Stroke } from "./stroke";
import { TextZone } from "./text_zone";
import { Vertex } from "./vertex";

export class Board<V extends Vertex,L extends Link, S extends Stroke, A extends Area, T extends TextZone, R extends Representation> {
    graph: Graph<V,L>;
    text_zones: Map<number, T>;
    representations: Map<number, R>;
    strokes: Map<number, S>;
    areas: Map<number, A>;

    constructor() {
        this.graph = new Graph();
        this.text_zones = new Map();
        this.representations = new Map();
        this.strokes = new Map();
        this.areas = new Map();
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
        while (this.strokes.has(index)) {
            index += 1;
        }
        return index;
    }

    get_next_available_index_area() {
        let index = 0;
        while (this.areas.has(index)) {
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
            return this.strokes.get(index)[param];
        } else if (kind == "Area"){
            return this.areas.get(index)[param];
        }
    }


    delete_stroke(stroke_index: number) {
        this.strokes.delete(stroke_index);
    }

    delete_area(area_index: number) {
        this.areas.delete(area_index);
    }

    translate_areas(indices: Set<number>, shift: Vect) {
        const contained_vertices = new Set<number>();
        for (const area_index of indices.values()) {
            const area = this.areas.get(area_index);
            for (const [vertex_index, vertex] of this.graph.vertices.entries()) {
                if (area.is_containing(vertex)) {
                    contained_vertices.add(vertex_index);
                }
            }
            area.translate(shift);
        }
        this.graph.translate_vertices(contained_vertices, shift);
    }

    get_subgraph_from_area(area_index: number): Graph<V,L>{
        const area = this.areas.get(area_index);
        const subgraph = new Graph<V,L>();

         for (const [index, v] of this.graph.vertices.entries()) {
            if(area.is_containing(v)){
                subgraph.vertices.set(index, v);
            }
        }

        for (const [index, link] of this.graph.links.entries()){
            const u = this.graph.vertices.get(link.start_vertex);
            const v = this.graph.vertices.get(link.end_vertex);

            if( area.is_containing(u) && area.is_containing(v)){
                subgraph.links.set(index, link);
            }
        }
        return subgraph;
    }

    
}