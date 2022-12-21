import { Area } from "./area";
import { Board } from "./board";
import { Vect } from "./coord";
import { SENSIBILITY } from "./graph";
import { Link } from "./link";
import { Stroke } from "./stroke";
import { TextZone } from "./text_zone";
import { Vertex } from "./vertex";

export interface BoardModification<V extends Vertex,L extends Link, S extends Stroke, A extends Area, T extends TextZone> { 
    try_implement(board: Board<V,L,S,A,T>): Set<SENSIBILITY> | string;
    deimplement(board: Board<V,L,S,A,T>): Set<SENSIBILITY>;
};

export class AddElement<V extends Vertex,L extends Link, S extends Stroke, A extends Area, T extends TextZone> implements BoardModification<V,L,S,A,T> {
    kind: string;
    index: number;
    element: V|L|S|A|T;
    
    constructor(kind: string, index: number, element: V|L|S|A|T) {
        this.kind = kind;
        this.index = index;
        this.element = element;
    }

    try_implement(board: Board<V,L,S,A,T>): Set<SENSIBILITY> | string{
        if (this.kind == "TextZone"){
            if ( board.text_zones.has(this.index) ){
                return "index " + String(this.index) + " already exists in text_zones";
            } else {
                const element = this.element as T;
                board.text_zones.set(this.index, element);
            }
        } else if (this.kind == "Vertex"){
            if ( board.graph.vertices.has(this.index) ){
                return "index " + String(this.index) + " already exists in vertices";
            } else {
                const element = this.element as V;
                board.graph.vertices.set(this.index, element);
            }
        }else if (this.kind == "Link"){
            if ( board.graph.links.has(this.index) ){
                return "index " + String(this.index) + " already exists in links";
            } else {
                const link = this.element as L;
                if (board.graph.check_link(link)){
                    board.graph.links.set(this.index, link);
                } else {
                    return "Error: link is not valid";
                }
            }
        }else if (this.kind == "Stroke"){
            if ( board.graph.strokes.has(this.index) ){
                return "index " + String(this.index) + " already exists in strokes";
            } else {
                const element = this.element as S;
                board.graph.strokes.set(this.index, element);
            }
        }else if (this.kind == "Area"){
            if ( board.graph.areas.has(this.index) ){
                return "index " + String(this.index) + " already exists in areas";
            } else {
                const element = this.element as A;
                board.graph.areas.set(this.index, element);
            }
        }
        return new Set();
    }

    deimplement(board: Board<V,L,S,A,T>): Set<SENSIBILITY>{
        if ( this.kind == "TextZone"){
            board.text_zones.delete(this.index);
        } else if (this.kind == "Stroke"){
            board.graph.strokes.delete(this.index);
        } else if (this.kind == "Area"){
            board.graph.areas.delete(this.index);
        } else if (this.kind == "Vertex"){
            board.graph.delete_vertex(this.index);
        } else if (this.kind == "Link"){
            board.graph.links.delete(this.index);
        }
        return new Set();
    }
}

export class UpdateElement<V extends Vertex,L extends Link, S extends Stroke, A extends Area, T extends TextZone> implements BoardModification<V,L,S,A,T> {
    index: number;
    kind: string;
    param: string;
    new_value: any;
    old_value: any;
    
    constructor(index: number, kind: string, param: string, new_value: any, old_value: any){
        this.index = index;
        this.kind = kind;
        this.param = param;
        this.new_value = new_value;
        this.old_value = old_value;
    }

    try_implement(board: Board<V,L,S,A,T>): Set<SENSIBILITY> | string{
        if (this.kind == "TextZone" && board.text_zones.has(this.index)){
            board.text_zones.get(this.index)[this.param] = this.new_value;
            return new Set();
        } else if (this.kind == "Vertex" && board.graph.vertices.has(this.index)){
            board.graph.vertices.get(this.index)[this.param] = this.new_value;
            return new Set()
        }else if (this.kind == "Link" && board.graph.links.has(this.index)){
            board.graph.links.get(this.index)[this.param] = this.new_value;
            return new Set()
        }else if (this.kind == "Stroke" && board.graph.strokes.has(this.index)){
            board.graph.strokes.get(this.index)[this.param] = this.new_value;
            return new Set()
        }else if (this.kind == "Area" && board.graph.areas.has(this.index)){
            board.graph.areas.get(this.index)[this.param] = this.new_value;
            return new Set()
        }else {
            return "Error: index not in text_zones";
        }
    }

    deimplement(board: Board<V,L,S,A,T>): Set<SENSIBILITY>{
        if (this.kind == "TextZone" && board.text_zones.has(this.index)){
            board.text_zones.get(this.index)[this.param]  = this.old_value;
            return new Set();
        }else if (this.kind == "Vertex" && board.graph.vertices.has(this.index)){
            board.graph.vertices.get(this.index)[this.param] = this.old_value;
            return new Set([SENSIBILITY.COLOR])
        }else if (this.kind == "Link" && board.graph.links.has(this.index)){
            board.graph.links.get(this.index)[this.param] = this.old_value;
            return new Set()
        }else if (this.kind == "Stroke" && board.graph.strokes.has(this.index)){
            board.graph.strokes.get(this.index)[this.param] = this.old_value;
            return new Set()
        }else if (this.kind == "Area" && board.graph.areas.has(this.index)){
            board.graph.areas.get(this.index)[this.param] = this.old_value;
            return new Set()
        }
        return new Set();
    }
}


export class TranslateElements<V extends Vertex,L extends Link, S extends Stroke, A extends Area, T extends TextZone> implements BoardModification<V,L,S,A,T> {
    indices: Array<[string,number]>;
    shift: Vect;
    
    constructor(indices: Array<[string,number]>, shift: Vect){
        this.indices = indices;
        this.shift = shift;
    }

    try_implement(board: Board<V,L,S,A,T>): Set<SENSIBILITY> | string{
        for (const [kind, index] of this.indices) {
            if (kind == "TextZone"){
                if (board.text_zones.has(index)){
                    board.text_zones.get(index).pos.translate(this.shift);
                }else {
                    return "Error: index not in text_zones";
                }
            } else if (kind == "Stroke"){
                if (board.graph.strokes.has(index)){
                    board.graph.strokes.get(index).translate(this.shift);
                }else {
                    return "Error: index not in strokes";
                }
            } else if (kind == "Area"){
                if (board.graph.areas.has(index)){
                    board.graph.translate_areas(new Set([index]), this.shift);
                }else {
                    return "Error: index not in areas";
                }
            } else if (kind == "ControlPoint"){
                if (board.graph.links.has(index)){
                    board.graph.links.get(index).cp.translate(this.shift);
                }else {
                    return "Error: index not in links";
                }
            } else if (kind == "Vertex"){
                if( board.graph.vertices.has(index)){
                    board.graph.translate_vertices([index], this.shift);
                } else {
                    return "Error: index not in vertices";
                }
            }
        }
        return new Set();
    }

    deimplement(board: Board<V,L,S,A,T>): Set<SENSIBILITY>{
        for (const [kind, index] of this.indices) {
            if (kind == "TextZone"){
                if (board.text_zones.has(index)){
                    board.text_zones.get(index).pos.rtranslate(this.shift);
                }
            } else if (kind == "Stroke"){
                if (board.graph.strokes.has(index)){
                    board.graph.strokes.get(index).rtranslate(this.shift);
                }
            } else if (kind == "Area"){
                if (board.graph.areas.has(index)){
                    board.graph.translate_areas(new Set([index]), this.shift.opposite());               
                }
            } else if (kind == "ControlPoint"){
                if (board.graph.links.has(index)){
                    board.graph.links.get(index).cp.rtranslate(this.shift);
                }
            } else if (kind == "Vertex"){
                if( board.graph.vertices.has(index)){
                    board.graph.translate_vertices([index], this.shift.opposite());
                }
            }
        }
        return new Set();
    }
}



export class GraphPaste<V extends Vertex,L extends Link, S extends Stroke, A extends Area, T extends TextZone> implements BoardModification<V,L,S,A,T> {
    added_vertices: Map<number, V>;
    added_links: Map<number, L>;

    constructor(added_vertices, added_links){
        this.added_vertices = added_vertices;
        this.added_links = added_links;
    }


    try_implement(board: Board<V,L,S,A,T>): Set<SENSIBILITY> | string{
        for ( const [vertex_index, vertex] of this.added_vertices.entries()){
            board.graph.vertices.set(vertex_index, vertex);
        }
        for ( const [link_index, link] of this.added_links.entries()){
            board.graph.links.set(link_index, link);
        }
        return new Set([SENSIBILITY.ELEMENT]);
    }


    deimplement(board: Board<V,L,S,A,T>): Set<SENSIBILITY>{
        for ( const vertex_index of this.added_vertices.keys()){
            board.graph.vertices.delete(vertex_index);
        }
        for ( const link_index of this.added_links.keys()){
            board.graph.links.delete(link_index);
        }
        return new Set([SENSIBILITY.ELEMENT])
    }
}


export class DeleteElements<V extends Vertex,L extends Link, S extends Stroke, A extends Area, T extends TextZone> implements BoardModification<V,L,S,A,T> {
    vertices: Map<number, V>;
    links: Map<number, L>;
    strokes: Map<number, S>;
    areas: Map<number, A>;
    text_zones: Map<number, T>;

    constructor(vertices, links, strokes, areas, text_zones) {
        this.vertices = vertices;
        this.links = links;
        this.strokes = strokes;
        this.areas = areas;
        this.text_zones = text_zones;
    }

    static from_indices<V extends Vertex,L extends Link, S extends Stroke, A extends Area, T extends TextZone>(board: Board<V,L,S,A,T>, indices: Array<[string, number]>){
        const vertices = new Map();
        const links = new Map();
        const strokes = new Map();
        const areas = new Map();
        const text_zones = new Map();
        for (const [kind, index] of indices){
            if (kind == "Vertex"){
                vertices.set(index, board.graph.vertices.get(index));
                board.graph.links.forEach((link, link_index) => {
                    if (link.end_vertex === index || link.start_vertex === index) {
                        links.set(link_index, link);
                    }
                })
            } else if (kind == "Link"){
                links.set(index, board.graph.links.get(index));
            } else if (kind == "Stroke"){
                strokes.set(index, board.graph.strokes.get(index));
            } else if (kind == "Area"){
                areas.set(index, board.graph.areas.get(index));
            } else if (kind == "TextZone"){
                text_zones.set(index, board.text_zones.get(index));
            } else {
                return "Error: kind not supported " + kind
            }
        }
        return new DeleteElements(vertices, links, strokes, areas, text_zones);
    }

    try_implement(board: Board<V,L,S,A,T>): Set<SENSIBILITY> | string{
        for (const index of this.vertices.keys()) {
            board.graph.delete_vertex(index);
        }
        for (const index of this.links.keys()) {
            board.graph.delete_link(index);
        }
        for (const index of this.strokes.keys()) {
            board.graph.delete_stroke(index);
        }
        for (const index of this.areas.keys()) {
            board.graph.delete_area(index);
        }
        for (const index of this.text_zones.keys()){
            board.text_zones.delete(index);
        }
        // TODO set is false
        return new Set([SENSIBILITY.ELEMENT, SENSIBILITY.COLOR, SENSIBILITY.GEOMETRIC, SENSIBILITY.WEIGHT])
    }


    deimplement(board: Board<V,L,S,A,T>): Set<SENSIBILITY>{
        for (const [index, vertex] of this.vertices.entries()) {
            board.graph.vertices.set(index, vertex);
        }
        for (const [index, link] of this.links.entries()) {
            board.graph.links.set(index, link);
        }
        for (const [index, stroke] of this.strokes.entries()) {
            board.graph.strokes.set(index, stroke);
        }
        for (const [index, area] of this.areas.entries()) {
            board.graph.areas.set(index, area);
        }
        for (const [index, text_zone] of this.text_zones.entries()){
            board.text_zones.set(index, text_zone);
        }
        return new Set([SENSIBILITY.ELEMENT, SENSIBILITY.COLOR, SENSIBILITY.GEOMETRIC, SENSIBILITY.WEIGHT])
    }
}