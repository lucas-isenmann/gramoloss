import { Area } from "./area";
import { Vect } from "./coord";
import { BasicGraph, Graph } from "./graph";
import { BasicLink } from "./link";
import { Rectangle } from "./rectangle";
import { Representation } from "./representations/representation";
import { Stroke } from "./stroke";
import { TextZone } from "./text_zone";
import { BasicLinkData, BasicVertexData, Geometric, Weighted } from "./traits";
import { BasicVertex } from "./vertex";

export class Board<V extends BasicVertexData, L extends BasicLinkData, S extends Stroke, A extends Area, T extends TextZone, R extends Representation, Rect extends Rectangle> {
    graph: BasicGraph<V,L>;
    text_zones: Map<number, T>;
    representations: Map<number, R>;
    strokes: Map<number, S>;
    areas: Map<number, A>;
    rectangles: Map<number, Rect>; 

    constructor() {
        this.graph = new BasicGraph();
        this.text_zones = new Map();
        this.representations = new Map();
        this.strokes = new Map();
        this.areas = new Map();
        this.rectangles = new Map();
    }

    /**
     * @param n 
     * @returns n available stroke indices
     * 
     * It does not start from the max of the current stroke indices.
     */
    getNextNAvailableStrokeIndices(n: number): Array<number> {
        let index = 0;
        const indices = new Array<number>();
        while (indices.length < n) {
            if (this.strokes.has(index) == false) {
                indices.push(index);
            }
            index += 1;
        }
        return indices;
    }

     /**
     * @param n 
     * @returns n available stroke indices
     * 
     * It does not start from the max of the current stroke indices.
     */
     getNextNAvailableRectangleIndices(n: number): Array<number> {
        let index = 0;
        const indices = new Array<number>();
        while (indices.length < n) {
            if (this.rectangles.has(index) == false) {
                indices.push(index);
            }
            index += 1;
        }
        return indices;
    }

    /**
     * @param n 
     * @returns n available stroke indices
     * 
     * It does not start from the max of the current stroke indices.
     */
    getNextNAvailableTextZoneIndices(n: number): Array<number> {
        let index = 0;
        const indices = new Array<number>();
        while (indices.length < n) {
            if (this.text_zones.has(index) == false) {
                indices.push(index);
            }
            index += 1;
        }
        return indices;
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

    
    get_next_available_index_rectangle() {
        let index = 0;
        while (this.rectangles.has(index)) {
            index += 1;
        }
        return index;
    }


    /**
     * Return an element of a certain kind and index.
     * @todo an error should be triggered if kind does not exists or index
     */
    getElement(kind: string, index: number): undefined | BasicVertex<V> | BasicLink<V,L> | S | T | A | Rect {
        if (kind == "TextZone"){
            const elt = this.text_zones.get(index);
            if (typeof elt == "undefined"){
                return undefined;
            } else {
                return elt;
            }
        } else if (kind == "Vertex"){
            const elt = this.graph.vertices.get(index);
            if (typeof elt == "undefined"){
                return undefined;
            } else {
                return elt;
            }
        } else if (kind == "Link"){
            const elt = this.graph.links.get(index);
            if (typeof elt == "undefined"){
                return undefined;
            } else {
                return elt;
            }
        } else if (kind == "Stroke"){
            const elt = this.strokes.get(index);
            if (typeof elt == "undefined"){
                return undefined;
            } else {
                return elt;
            }
        } else if (kind == "Area"){
            const elt = this.areas.get(index);
            if (typeof elt == "undefined"){
                return undefined;
            } else {
                return elt;
            }
        } else if (kind == "Rectangle"){
            const elt = this.rectangles.get(index);
            if (typeof elt == "undefined"){
                return undefined;
            } else {
                return elt;
            }
        } else {
            return undefined;
        }
    }

    /**
     * Return the value of a param of an element of a certain kind and index.
     * @todo return type should exist
     */
    get_value(kind: string, index: number, param: string): undefined | any{
        const elt = this.getElement(kind, index);
        if (typeof elt == "undefined"){
            return undefined;
        } else {
            return elt[param];
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
            if (typeof area != "undefined"){
                for (const [vertex_index, vertex] of this.graph.vertices.entries()) {
                    if (area.is_containing(vertex)) {
                        contained_vertices.add(vertex_index);
                    }
                }
                area.translate(shift);
            }
        }
        this.graph.translate_vertices(contained_vertices, shift);
    }

    get_subgraph_from_area(area_index: number): Graph<V,L>{
        const area = this.areas.get(area_index);
        const subgraph = new Graph<V,L>();
        if (typeof area == "undefined") return subgraph;

        for (const [index, v] of this.graph.vertices.entries()) {
            if (area.is_containing(v)){
                subgraph.vertices.set(index, v);
            }
        }

        for (const [index, link] of this.graph.links.entries()){
            const u = link.startVertex;
            const v = link.endVertex;

            if( area.is_containing(u) && area.is_containing(v)){
                subgraph.links.set(index, link);
            }
        }
        return subgraph;
    }

    
}