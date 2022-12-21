import { Area } from "./area";
import { Coord, Vect } from "./coord";
import { Link, ORIENTATION } from "./link";
import { Stroke } from "./stroke";
import { Vertex } from "./vertex";


export enum ELEMENT_TYPE {
    VERTEX = "VERTEX",
    LINK = "LINK",
    STROKE = "STROKE",
    AREA = "AREA"
}


export interface Modification { };


export class AreaMoveSide implements Modification {
    index: number;
    previous_c1: Coord;
    previous_c2: Coord;
    new_c1: Coord;
    new_c2: Coord;

    constructor(index: number, previous_c1: Coord, previous_c2: Coord, new_c1: Coord, new_c2: Coord) {
        this.index = index;
        this.previous_c1 = previous_c1;
        this.previous_c2 = previous_c2;
        this.new_c1 = new_c1;
        this.new_c2 = new_c2;
    }

    static from_area(index: number, area: Area, x: number, y: number, side_number: number): AreaMoveSide {
        const new_c1 = area.c1.copy();
        const new_c2 = area.c2.copy();

        switch (side_number) {
            case 1:
                if (area.c1.y > area.c2.y) { new_c2.y = y; }
                else { new_c1.y = y; }
                break;
            case 2:
                if (area.c1.x > area.c2.x) { new_c1.x = x; }
                else { new_c2.x = x; }
                break;
            case 3:
                if (area.c1.y < area.c2.y) { new_c2.y = y; }
                else { new_c1.y = y; }
                break;
            case 4:
                if (area.c1.x < area.c2.x) { new_c1.x = x; }
                else { new_c2.x = x; }
                break;
        }

        return new AreaMoveSide(index, area.c1, area.c2, new_c1, new_c2);
    }
}

export class AreaMoveCorner implements Modification {
    index: number;
    previous_c1: Coord;
    previous_c2: Coord;
    new_c1: Coord;
    new_c2: Coord;

    constructor(index: number, previous_c1: Coord, previous_c2: Coord, new_c1: Coord, new_c2: Coord) {
        this.index = index;
        this.previous_c1 = previous_c1;
        this.previous_c2 = previous_c2;
        this.new_c1 = new_c1;
        this.new_c2 = new_c2;
    }

    static from_area(index: number, area: Area, x: number, y: number, corner_number: number): AreaMoveCorner {
        const new_c1 = area.c1.copy();
        const new_c2 = area.c2.copy();

        switch (corner_number) {
            case 1:
                if (area.c1.x < area.c2.x) { new_c1.x = x; }
                else { new_c2.x = x; }
                if (area.c1.y > area.c2.y) { new_c2.y = y; }
                else { new_c1.y = y; }
                break;
            case 2:
                if (area.c1.x > area.c2.x) { new_c1.x = x; }
                else { new_c2.x = x; }
                if (area.c1.y > area.c2.y) { new_c2.y = y; }
                else { new_c1.y = y; }
                break;
            case 3:
                if (area.c1.x > area.c2.x) { new_c1.x = x; }
                else { new_c2.x = x; }
                if (area.c1.y < area.c2.y) { new_c2.y = y; }
                else { new_c1.y = y; }
                break;
            case 4:
                if (area.c1.x < area.c2.x) { new_c1.x = x; }
                else { new_c2.x = x; }
                if (area.c1.y < area.c2.y) { new_c2.y = y; }
                else { new_c1.y = y; }
                break;
        }

        return new AreaMoveCorner(index, area.c1, area.c2, new_c1, new_c2);
    }
}




export class VerticesMerge<V extends Vertex, L extends Link> implements Modification {
    index_vertex_fixed: number;
    index_vertex_to_remove: number;
    vertex_to_remove: V;
    deleted_links: Map<number, L>;
    modified_links_indices: Array<number>;

    constructor(index_vertex_fixed: number, index_vertex_to_remove: number, vertex_to_remove: V, deleted_links: Map<number, L>, modified_links_indices: Array<number>) {
        this.index_vertex_fixed = index_vertex_fixed;
        this.index_vertex_to_remove = index_vertex_to_remove;
        this.vertex_to_remove = vertex_to_remove;
        this.deleted_links = deleted_links;
        this.modified_links_indices = modified_links_indices;
    }
}

