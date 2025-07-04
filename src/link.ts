import { Coord } from "./coord";
import { Graph } from "./graph";
import { bezierCurvePoint, eqSet, isQuadraticBezierCurvesIntersection, segmentsInteriorIntersection } from "./utils";
import { Vertex, VertexIndex } from "./vertex";

export enum ORIENTATION {
    UNDIRECTED = "UNDIRECTED",
    DIRECTED = "DIRECTED"
}


export class Link {
    

    index: number;
    graph: Graph;
    startVertex: Vertex;
    endVertex: Vertex;
    orientation: ORIENTATION;
    color: string;
    cp: undefined | Coord;
    weight: string;


    constructor(index: number, graph: Graph, startVertex: Vertex, endVertex: Vertex, orientation: ORIENTATION) {
        this.index = index;
        this.graph = graph;
        this.startVertex = startVertex;
        this.endVertex = endVertex;
        this.orientation = orientation;
        this.color = "Neutral";
        this.weight = "";

    }


    delete(){
        // TODO : pour les aretes multiples il faut enlever neighbor que s'il n'y a plus d'aretes
            // TODO : attention aux loops 

        if (this.orientation == ORIENTATION.UNDIRECTED){
            this.graph.matrix[this.startVertex.stackedIndex][this.endVertex.stackedIndex] -= 1;
            this.graph.matrix[this.endVertex.stackedIndex][this.startVertex.stackedIndex] -= 1;
            
            this.startVertex.neighbors.delete(this.endVertex.index);
            this.endVertex.neighbors.delete(this.startVertex.index);

        } else {

            this.graph.matrix[this.startVertex.stackedIndex][this.endVertex.stackedIndex] -= 1;
            
            this.startVertex.outNeighbors.delete(this.endVertex.index);
            this.endVertex.inNeighbors.delete(this.startVertex.index);
        }

        this.startVertex.incidentLinks.delete(this.index);
        this.endVertex.incidentLinks.delete(this.index);



        this.graph.links.delete(this.index);
    }

    
    /**
     * Create k-1 vertices
     * Create k links with the same color
     * Delete this link
     * @param k 
     */
    subdivide(k: number) {
        let previousVertex = this.startVertex;
        for (let i = 0 ; i < k ; i ++){
            const bezierPoints = typeof this.cp == "undefined" ? 
            [this.startVertex.getPos(), this.endVertex.getPos()] :
            [this.startVertex.getPos(), this.cp, this.endVertex.getPos()];
            const vertexPos = bezierCurvePoint(i/k, bezierPoints);

            const v = this.graph.addVertex(this.graph.getAvailableVertexIndex(), vertexPos.x, vertexPos.y);
            
            if (this.orientation == ORIENTATION.UNDIRECTED){
                this.graph.addEdge(previousVertex, v);
            } else {
                this.graph.addArc(previousVertex, v);
            }
            previousVertex = v;
        }

        if (this.orientation == ORIENTATION.UNDIRECTED){
            this.graph.addEdge(previousVertex, this.endVertex);
        } else {
            this.graph.addArc(previousVertex, this.endVertex);
        }
        this.delete()
    }

   
    /**
     * Return true iff at least one extremity of the link is in the set `s`.
     * @return `s.has(startIndex) || s.has(endIndex)`
     */
    hasAnExtrimityIn(s: Set<VertexIndex>): boolean{
        return s.has(this.startVertex.index) || s.has(this.endVertex.index);
    }

    signatureEquals(startIndex: VertexIndex, endIndex: VertexIndex, orientation: ORIENTATION): boolean{
        if ( this.orientation == orientation ){
            switch (this.orientation){
                case ORIENTATION.UNDIRECTED: {
                    if ( eqSet(new Set([this.startVertex.index, this.endVertex.index]), new Set([startIndex, endIndex]) ) ){
                        return true;
                    }
                    break;
                }
                case ORIENTATION.DIRECTED: {
                    if ( this.startVertex.index == startIndex && this.endVertex.index == endIndex){
                        return true;
                    }
                    break;
                }
            }
        }
        return false;
    }


     /**
     * Test if this link intersect another link 
    // TODO: faster algorithm for intersection between segment and bezier
     * TODO use in the planar test of a graph
     */
    intersectsLink(link: Link): boolean{
        const v1 = this.startVertex.getPos();
        const w1 = this.endVertex.getPos();
        const v2 = link.startVertex.getPos();
        const w2 = link.endVertex.getPos();
        if (typeof this.cp == "undefined" && typeof link.cp == "undefined"){
            return typeof segmentsInteriorIntersection(v1, w1, v2, w2) == "undefined";
            // return is_segments_intersection(v1, w1, v2, w2);
        }
        let cp1 = v1.middle(w1);
        let cp2 = v2.middle(w2);
        if (typeof this.cp != "undefined"){
            cp1 = this.cp;
        }
        if (typeof link.cp != "undefined"){
            cp2 = link.cp;
        }
        return isQuadraticBezierCurvesIntersection(v1, cp1, w1, v2, cp2, w2);
    }


    getWeight(): string {
        return this.weight;
    }


     /**
     * @param fixedEnd is the coord of the extremity which has not moved
     * @param newPos and @param previousPos are the positions of the extremity which has moved
     */
    transformCP(newPos: Coord, previousPos: Coord, fixedEnd: Coord){
        if (typeof this.cp == "undefined"){
            return;
        }
        const w = fixedEnd;
        const u = previousPos.sub(w);
        const nv = newPos.sub(w);
        const theta = nv.getTheta(u);
        const rho = u.getRho(nv);
        const cp = this.cp.copy();
        this.cp.x = w.x + rho * (Math.cos(theta) * (cp.x - w.x) - Math.sin(theta) * (cp.y - w.y))
        this.cp.y = w.y + rho * (Math.sin(theta) * (cp.x - w.x) + Math.cos(theta) * (cp.y - w.y))
    }


} 