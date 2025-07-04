import { Coord, Vect } from './coord';
import { Graph } from './graph';
import { Link } from './link';

export type VertexIndex = number | string;


export class Vertex {
    index: VertexIndex;
    stackedIndex: number;
    neighbors: Map<VertexIndex, Vertex>;
    inNeighbors: Map<VertexIndex, Vertex>;
    outNeighbors: Map<VertexIndex, Vertex>;
    incidentLinks: Map<number, Link>;
    graph: Graph;

    pos: Coord;
    color: string;
    innerLabel: string;
    outerLabel: string;



    constructor(graph: Graph, index: VertexIndex, stackedIndex: number, x: number, y: number) {
        this.index = index;
        this.stackedIndex = stackedIndex;
        this.graph = graph;
        this.neighbors = new Map();
        this.inNeighbors = new Map();
        this.outNeighbors = new Map();
        this.incidentLinks = new Map();

        this.pos = new Coord(x, y);
        this.color = "Neutral";
        this.innerLabel = "";
        this.outerLabel = "";
    }


    degree(): number {
        return this.neighbors.size;
    }

    indegree(): number {
        return this.inNeighbors.size;
    }

    outdegree(): number {
        return this.outNeighbors.size;
    }

    distTo(other: Vertex): number {
        return Math.sqrt(this.getPos().dist2(other.getPos()));
    }

    translate(shift: Vect){
        this.getPos().translate(shift);
    }

    getPos(): Coord {
        return this.pos;
    }

    isInRectangle(c1: Coord, c2: Coord){
        return this.getPos().isInRect(c1, c2);
    }
}





    
   