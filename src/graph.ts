import { BasicLink, Link, ORIENTATION } from './link';
import { BasicVertex, Vertex } from './vertex';
import { Coord, Vect } from './coord';
import { Area } from './area';
import { bezier_curve_point, det, is_quadratic_bezier_curves_intersection, is_segments_intersection, segmentsInteriorIntersection } from './utils';
import { Option } from "./option";
import { BasicLinkData, BasicVertexData, Geometric, Weighted } from './traits';
import { minDFVS } from './algorithms/dfvs';
import { getDirectedCycle } from './algorithms/cycle';
import { isTournamentLight, searchHeavyArc } from './algorithms/isTournamentLight';
import { acyclicColoring, dichromatic } from './algorithms/dichromatic';

export enum ELEMENT_TYPE {
    VERTEX = "VERTEX",
    LINK = "LINK",
    STROKE = "STROKE",
    AREA = "AREA"
}



/**
 * For the Dominating Set Algo
 * @todo should be removed by implementing a method for IDS
 */
export enum DominationVariant {
    Independent,
    OrientedIndependent
}



export class Graph<V,L> {
    vertices: Map<number, Vertex<V>>;
    links: Map<number, Link<V,L>>;

    constructor() {
        this.vertices = new Map();
        this.links = new Map();
    }


    /**
     * Returns an undirected Graph given by its edges.
     * @param edgesList
     * @param vertexConstructor is a constructor of V
     */
    static fromEdgesList<V,L>( edgesList: Array<[number,number, L]>, vertexConstructor: () => V ){
        return Graph.fromLinksList(edgesList, vertexConstructor, ORIENTATION.UNDIRECTED);
    }

    /**
     * Returns an undirected Graph given by its edges.
     * @param edgesList
     * @param vertexConstructor is a constructor of V
     */
        static fromArcsList<V,L>( arcsList: Array<[number,number, L]>, vertexConstructor: () => V ){
            return Graph.fromLinksList(arcsList, vertexConstructor, ORIENTATION.DIRECTED);
        }

    /**
     * Returns a graph given by its list of links.
     * @param linksList [startIndex, endIndex, linkData]
     * @param vertexConstructor is a constructor of V
     * @param orientation is the orientation of all the links
     */
    static fromLinksList<V,L>( linksList: Array<[number,number, L]>, vertexConstructor: () => V, orientation: ORIENTATION ){
        const g = new Graph<V,L>();
        const verticesIndices = new Set();

        for ( const [x,y,_] of linksList){
            if (g.vertices.has(x) == false){
                g.setVertex(x, vertexConstructor());
            }
            if (g.vertices.has(y) == false){
                g.setVertex(y, vertexConstructor());
            }
        }
        for ( const [indexV1,indexV2, data] of linksList.values()){
            g.addLink(indexV1, indexV2, orientation, data);
        }
        return g;
    }


    /**
     * Returns a graph given by its list of vertices and links.
     * @param verticesData [vertexData]
     * @param linksList [startIndex, endIndex, linkData] indices refer to the indices in the verticesData array.
     * @param vertexConstructor is a constructor of V
     * @param orientation is the orientation of all the links
     */
    static fromList<V,L>( verticesData: Array<V>, linksList: Array<[number,number, L]>, orientation: ORIENTATION ){
        const g = new Graph<V,L>();
        const verticesIndices = new Set();

        for ( const [index, data] of verticesData.entries()){
            g.setVertex(index, data);
        }
        for ( const [indexV1,indexV2, data] of linksList.values()){
            g.addLink(indexV1, indexV2, orientation, data);
        }
        return g;
    }

    /**
     * Returns an undirected Graph<Vertex,Link> (called basic) from a list of edges represented by couples of indices.
     * @param listVertices the two numbers are the coordinates of the vertices, the string is the weight of the vertex
     * @param listEdges 
     */
    // static fromListBasic(listVertices: Array<[number,number,string]>, listEdges: Array<[number,number, string]>): Graph<BasicVertex,BasicLink>{
    //     return Graph.fromList(listVertices, listEdges, (x,y,w,c) => {return new BasicVertex(x,y,w,c)}, (x,y,w) => {return new BasicLink(x,y,"",ORIENTATION.UNDIRECTED, "black", w)});
    // }
    

    /**
     * Returns an undirected Graph<V,L,S,A> from a list of edges.
     * @param vertex_default is a constructor of V
     * @param edge_default is a constructor of L
     */
    // static from_list_default<V extends Vertex<V>,L extends Link<L>>(l: Array<[number,number, string]>, vertex_default: (index: number)=> V, edge_default: (x: number, y: number, weight: string) => L ): Graph<V,L>{
    //     const g = new Graph<V,L>();
    //     const indices = new Set<number>();
    //     for ( const [x,y,w] of l.values()){
    //         if (indices.has(x) == false){
    //             indices.add(x);
    //             g.setVertex(x,vertex_default(x));
    //         }
    //         if (indices.has(y) == false){
    //             indices.add(y);
    //             g.setVertex(y,vertex_default(y));
    //         }
    //         const link = edge_default(x,y,w);
    //         g.addLink(link);
    //     }
    //     return g;
    // }

    /**
     * Returns an Undirected Graph from a list of edges represented by couples of indices.
     * Weights are set to "".
     */
    // static from_list(l: Array<[number,number]>): Graph<BasicVertex,BasicLink>{
    //     const l2 = new Array();
    //     for (const [x,y] of l){
    //         l2.push([x,y,""]);
    //     }
    //     const g = Graph.from_list_default(l2, BasicVertex.default, BasicLink.default_edge );
    //     return g;
    // }

    // create a Weighted Undirected Graph from a list of weighted edges represented by couples of number with the weight in third
    // static from_weighted_list(l: Array<[number,number,string]>): Graph<BasicVertex,BasicLink>{
    //     const g = Graph.from_list_default(l, BasicVertex.default, BasicLink.default_edge );
    //     return g;
    // }
	
    //  static directed_from_list(l: Array<[number,number]>): Graph<BasicVertex,BasicLink>{
    //     const g = Graph.directed_from_list_default(l, BasicVertex.default, BasicLink.default_arc );
    //     return g;
    // }

    // static directed_from_list_default<V extends Vertex<V>,L extends Link<L>>(l: Array<[number,number]>, vertex_default: (index: number)=> V, arc_default: (x: number, y: number, weight: string) => L ): Graph<V,L>{
    //     const g = new Graph<V,L>();
    //     const indices = new Set<number>();
    //     for ( const [x,y] of l.values()){
    //         if (indices.has(x) == false){
    //             indices.add(x);
    //             g.setVertex(x,vertex_default(x));
    //         }
    //         if (indices.has(y) == false){
    //             indices.add(y);
    //             g.setVertex(y,vertex_default(y));
    //         }
    //         const link = arc_default(x,y,"");
    //         g.addLink(link);
    //     }

        
    //     return g;
    // }


    /**
     * 
     * @returns the adjacency matrix of size nxn of the undirected links
     */
    getMatrix(): Array<Array<boolean>> {
        const n = this.vertices.size;
        const m = new Array(n);
        const indices = new Map<number, number>();
        let k = 0;
        for (const [id, v] of this.vertices){
            indices.set(id, k);
            k ++;
        }

        for (const [id, v] of this.vertices){
            const i = indices.get(id);
            if (typeof i != "undefined"){
                m[i] = new Array(n);
                for (const w of this.getNeighbors(v)) {
                    const j = indices.get(w.index);
                    if (typeof j != "undefined"){
                        m[j] = true;
                    }
                }
            }
        }
        return m;
    }

    /**
     * To every vertex id we associate an integer in {0,...,n-1}.
     * indices[vertexId] = packedId in [0,n-1]
     */
    getStackedIndices(): [Map<number, number>, Array<number>] {
        const n = this.vertices.size;
        const indices = new Map<number, number>();
        const reverse = new Array(n);
        let k = 0;
        for (const [id, v] of this.vertices){
            indices.set(id, k);
            reverse[k] = id;
            k ++;
        }
        return [indices, reverse];
    }


    /**
     * @todo TRANSPOSED
     * Only print arcs
     */
    printDirectedAdjacencyMatrix() {
        const m = this.getDirectedMatrix();

        function boolToNum(b: boolean): number {
            return b ? 1 : 0;
        }
        const matrix01 = m.map(row => row.map(boolToNum));
        const matrixFormatted = matrix01.map(row => row.join(' ')).join('\n');

        console.log(matrixFormatted)
    }

    /**
     * Transposed Adjacency Matrix
     */
    getDirectedMatrix(): Array<Array<boolean>> {
        const n = this.vertices.size;
        const m = new Array(n);
        const [indices, _] = this.getStackedIndices();

        for (let i = 0; i < n ; i ++){
            m[i] = new Array<boolean>(n).fill(false);
        }

        for (const [_, link] of this.links){
            if (link.orientation == ORIENTATION.DIRECTED) {
                const i = indices.get(link.startVertex.index);
                const j = indices.get(link.endVertex.index);
                if (typeof i != "undefined" && typeof j != "undefined"){
                    m[j][i] = true;
                }
            }
        }
        return m;
    }


    /**
     * Return the list of the extremeties of the arcs.
     */
    arcsList(): Array<[number, number]>{
        const l = new Array<[number, number]>();
        for (const link of this.links.values()){
            if (link.orientation == ORIENTATION.DIRECTED){
                l.push([link.startVertex.index, link.endVertex.index]);
            }
        }
        return l;
    }

    setVertexData(index: number, data: V){
        const vertex = this.vertices.get(index);
        if (typeof vertex !== "undefined"){
            vertex.data = data;
        }
    }

    setLinkData(index: number, data: L){
        const link = this.links.get(index);
        if (typeof link !== "undefined"){
            link.data = data;
        }
    }



    // update_element_weight(element_type: ELEMENT_TYPE, index: number, new_weight: string){
    //     if ( element_type == ELEMENT_TYPE.LINK && this.links.has(index)){
    //         const link = this.links.get(index);
    //         if (typeof link !== "undefined"){
    //             link.weight = new_weight;
    //         }
    //     }else if ( element_type == ELEMENT_TYPE.VERTEX && this.vertices.has(index)){
    //         const vertex = this.vertices.get(index);
    //         if (typeof vertex !== "undefined"){
    //             vertex.weight = new_weight;
    //         }
    //     }
    // }


    // update_vertex_pos(vertex_index: number, new_pos: Coord) {
    //     const vertex = this.vertices.get(vertex_index);
    //     if (typeof vertex !== "undefined"){
    //         vertex.pos = new_pos;
    //     }
    // }

    forceArc(u: number, v: number) {
        if (this.hasArc(v, u)){
            for (const [_, link] of this.links){
                if (link.signatureEquals(v, u, ORIENTATION.DIRECTED)) {
                    link.flip();
                }
            }
        }
    }

    /**
     * A tournament is light if and only there does not exist different vertices u,v,a,b,c such that
     * - u -> v
     * - a -> b -> c -> a is an oriented triangle
     * - v -> a,b,c
     * - a,b,c -> u
     * @returns undefined or a conflict [u,v,a,b,c]
     */
    lightnessConflict(): Option<Array<number>> {
        const m = this.getDirectedMatrix();
        const [_, r] = this.getStackedIndices();
        const heavyArc =  searchHeavyArc(m);

        if (typeof heavyArc == "undefined"){
            return undefined
        } else {
            const [u,v,a,b,c] = heavyArc;
            return [r[u], r[v], r[a], r[b], r[c] ];
        }
    }

    /**
     * A tournament is light if and only there does not exist different vertices u,v,a,b,c such that
     * - u -> v
     * - a -> b -> c -> a is an oriented triangle
     * - v -> a,b,c
     * - a,b,c -> u
     * @remark If the graph is not light and you want to get 5 such vertices use the method `lightnessConflict()` 
     */
    isTournamentLight(): boolean {
        return isTournamentLight(this);
    }

    flipArc(u: number, v: number) {
        if ( this.hasArc(u, v) && this.hasArc(v,u) == false){
            for (const [linkId, link] of this.links){
                if (link.signatureEquals(u,v, ORIENTATION.DIRECTED)) {
                    link.flip();
                }
            }
        }
    }



    getNextNAvailableVertexIndices(n: number): Array<number> {
        let index = 0;
        const indices = new Array<number>();
        while (indices.length < n) {
            if (this.vertices.has(index) == false) {
                indices.push(index);
            }
            index += 1;
        }
        return indices;
    }

    getNextAvailableIndexLinks() {
        let index = 0;
        while (this.links.has(index)) {
            index += 1;
        }
        return index;
    }

    getNextNavailableLinkIndices(n: number): Array<number> {
        let index = 0;
        const indices = new Array<number>();
        while (indices.length < n) {
            if (this.links.has(index) == false) {
                indices.push(index);
            }
            index += 1;
        }
        return indices;
    }


    /**
     * Return the array of the neighbors of a vertex v.
     * They are undirected neighbors.
     * If a link is oriented, then the oriented neighbor is not considered.
     */
    getNeighbors(v: Vertex<V>): Array<Vertex<V>>{
        return this.getNeighborsFromIndex(v.index);
    }
    
    /**
     * Return the array of the neighbors of a vertex v.
     * They are undirected neighbors.
     * If a link is oriented, then the oriented neighbor is not considered.
     */
    getNeighborsFromIndex(vIndex: number): Array<Vertex<V>>{
        const neighbors = new Array<Vertex<V>>();
        for (const link of this.links.values()){
            if (link.orientation == ORIENTATION.UNDIRECTED){
                if (link.startVertex.index == vIndex){
                    neighbors.push(link.endVertex);
                } else if (link.endVertex.index == vIndex){
                    neighbors.push(link.startVertex);
                }
            }
        }
        return neighbors;
    }

    

    getNextAvailableIndexVertex() {
        let index = 0;
        while (this.vertices.has(index)) {
            index += 1;
        }
        return index;
    }

    /**
     * Add a vertex to the graph.
     * Returns the index of the added vertex.
     */ 
    addVertex(vertexData: V): Vertex<V> {
        const index = this.getNextAvailableIndexVertex();
        const newVertex = new Vertex(index, vertexData);
        this.vertices.set(index, newVertex);
        return newVertex;
    }

    setVertex(index: number, vertexData: V): Vertex<V> {
        const newVertex = new Vertex(index, vertexData);
        this.vertices.set(index, newVertex);
        return newVertex;
    }

    hasLink(index_start: number,index_end: number, orientation: ORIENTATION): boolean{
        for (const link of this.links.values()){
            if (link.signatureEquals(index_start, index_end, orientation)){
                return true;
            }
        }
        return false;
    }

    hasArc(index_start: number, index_end: number): boolean {
        return this.hasLink(index_start, index_end, ORIENTATION.DIRECTED);
    }

    /**
     * 
     * @param link 
     * @returns false if
     * - link is a loop
     * - there is already a link with the same signature (same orientation and start and end)
     */
    chekLink(link: Link<V,L>): boolean {
        const i = link.startVertex.index;
        const j = link.endVertex.index;
        const orientation = link.orientation;
        // do not add link if it is a loop (NO LOOP)
        if (i == j) {
            return false;
        }

        // do not add link if it was already existing (NO MULTIEDGE)
        for (const link of this.links.values()) {
            if (link.orientation == orientation) {
                if (orientation == ORIENTATION.UNDIRECTED) {
                    if ((link.startVertex.index == i && link.endVertex.index == j) || (link.startVertex.index == j && link.endVertex.index == i)) {
                        return false;
                    }
                }
                else if (orientation == ORIENTATION.DIRECTED) {
                    if (link.startVertex.index == i && link.endVertex.index == j) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    /**
     * Adds a link to the graph.
     * Sets the index of link with a free link index.
     * Returns undefined if the link is already in the graph.
     * Returns the index otherwise.
     */
    addLink(startIndex: number, endIndex: number, orientation: ORIENTATION, data: L): Option<Link<V,L>> {
        const index = this.getNextAvailableIndexLinks();
        const newLink = this.setLink(index, startIndex, endIndex, orientation, data);
        return newLink;
    }


    /**
     * Inserts link at link_index in the links of the graph.
     */
    setLink(linkIndex: number, startIndex: number, endIndex: number, orientation: ORIENTATION, data: L): Option<Link<V,L>> {
        const startVertex = this.vertices.get(startIndex);
        if (typeof startVertex === "undefined"){
            return undefined;
        }
        const endVertex = this.vertices.get(endIndex);
        if (typeof endVertex === "undefined"){
            return undefined;
        }
        const newLink = new Link(linkIndex, startVertex, endVertex, orientation, data);
        if (this.chekLink(newLink) == false) {
            return undefined;
        }
        this.links.set(linkIndex, newLink);
        return newLink;
    }






    /**
     * Returns the list of the neighbors indices of a vertex.
     */
    getNeighborsList(vertexIndex: number): Array<number> {
        let neighbors = new Array<number>();
        for (let e of this.links.values()) {
            if (e.orientation == ORIENTATION.UNDIRECTED) {
                if (e.startVertex.index == vertexIndex) {
                    neighbors.push(e.endVertex.index);
                } else if (e.endVertex.index == vertexIndex) {
                    neighbors.push(e.startVertex.index);
                }
            }
        }
        return neighbors;
    }



    getNeighborsListExcludingLinks(i: number, excluded: Set<number>): Array<number> {
        const neighbors = new Array<number>();
        for (const [link_index, link] of this.links.entries()) {
            if (excluded.has(link_index) == false && link.orientation == ORIENTATION.UNDIRECTED) {
                if (link.startVertex.index == i) {
                    neighbors.push(link.endVertex.index);
                } else if (link.endVertex.index == i) {
                    neighbors.push(link.startVertex.index);
                }
            }
        }
        return neighbors;
    }

    /**
     * 
     * @param vertexId 
     * @returns an Array of the out-neighbors ids
     */
    getOutNeighborsList(vertexId: number): Array<number> {
        let neighbors = new Array<number>();
        for (let e of this.links.values()) {
            if (e.orientation == ORIENTATION.DIRECTED) {
                if (e.startVertex.index == vertexId) {
                    neighbors.push(e.endVertex.index);
                }
            }
        }
        return neighbors;
    }

    /**
     * Return the array of the out-neighbors of a vertex v.
     * The indices of the vertices are accessible via v.index.
     */
    getOutNeighbors(v: Vertex<V>): Array<Vertex<V>>{
        const neighbors = new Array<Vertex<V>>();
        for (const link of this.links.values()) {
            if (link.orientation == ORIENTATION.DIRECTED) {
                if (link.startVertex.index == v.index) {
                    neighbors.push(link.endVertex);
                }
            }
        }
        return neighbors;
    }

    /**
     * Return the array of the in-neighbors of a vertex v.
     * The indices of the vertices are accessible via v.index.
     */
    getInNeighbors(v: Vertex<V>): Array<Vertex<V>>{
        const neighbors = new Array<Vertex<V>>();
        for (const link of this.links.values()) {
            if (link.orientation == ORIENTATION.DIRECTED) {
                if (link.endVertex.index == v.index) {
                    neighbors.push(link.startVertex);
                }
            }
        }
        return neighbors;
    }

    /**
     * Return the indegree of a vertex.
     * The indegree is the number of vertices `w` such that there exists an arc from `w` to this vertex.
     */
    inDegree(vIndex: number): number | undefined {
        const v = this.vertices.get(vIndex);
        if (typeof v == "undefined"){
            return undefined;
        } else {
            return this.getInNeighbors(v).length;
        }
    }

    /**
     * Return the indegree of a vertex.
     * The indegree is the number of vertices `w` such that there exists an arc from `w` to this vertex.
     */
    outDegree(vIndex: number): number | undefined {
        const v = this.vertices.get(vIndex);
        if (typeof v == "undefined"){
            return undefined;
        } else {
            return this.getOutNeighbors(v).length;
        }
    }

    



    getInNeighborsList(i: number): Array<number> {
        let neighbors = new Array<number>();
        for (let e of this.links.values()) {
            if (e.orientation == ORIENTATION.DIRECTED) {
                if (e.endVertex.index == i) {
                    neighbors.push(e.startVertex.index);
                }
            }
        }
        return neighbors;
    }


    /**
     * 
     * @param vId vertex index
     * @param d distance >= 0 (when d = 1, then it returns the closed in-neighborhood)
     * @returns the closed in-neighborhood of `vId` at dist at most `d`. That is the vertices at distance at most d to `vId`.
     * @example 
     * AbstractGraph.orientedPath(3).getClosedDistInNeighborhood(2, 2); // = [0,1,2]
     * AbstractGraph.orientedPath(3).getClosedDistInNeighborhood(2, 1); // = [1,2]
     */
    getClosedDistInNeighborhood(vId: number, d: number): Array<number> {
        if (d <= 0){
            return [vId];
        } else {
            const neighborsPrec = this.getClosedDistInNeighborhood(vId, d-1);
            const neighborsD = new Array();
            for (const neighbor of neighborsPrec){
                if (neighborsD.indexOf(neighbor) == -1){
                    neighborsD.push(neighbor);
                }
                for (const nId of this.getInNeighborsList(neighbor)){
                    if (neighborsD.indexOf(nId) == -1){
                        neighborsD.push(nId);
                    }
                }
            }
            return neighborsD;
        }
    }

    /**
     * 
     * @param vId vertex index
     * @param d distance >= 0 (when d = 1, then it returns the closed in-neighborhood)
     * @returns the closed in-neighborhood of `vId` at dist at most `d`. That is the vertices at distance at most d from `vId`.
     * @example 
     * AbstractGraph.orientedPath(3).getClosedDistOutNeighborhood(0, 2); // = [0,1,2]
     * AbstractGraph.orientedPath(3).getClosedDistOutNeighborhood(0, 1); // = [0,1]
     */
    getClosedDistOutNeighborhood(vId: number, d: number): Array<number> {
        if (d <= 0){
            return [vId];
        } else {
            const neighborsPrec = this.getClosedDistOutNeighborhood(vId, d-1);
            const neighborsD = new Array();
            for (const neighbor of neighborsPrec){
                if (neighborsD.indexOf(neighbor) == -1){
                    neighborsD.push(neighbor);
                }
                for (const nId of this.getOutNeighborsList(neighbor)){
                    if (neighborsD.indexOf(nId) == -1){
                        neighborsD.push(nId);
                    }
                }
            }
            return neighborsD;
        }
    }

    deleteVertex(vertex_index: number) {
        this.vertices.delete(vertex_index);

        this.links.forEach((link, link_index) => {
            if (link.endVertex.index === vertex_index || link.startVertex.index === vertex_index) {
                this.links.delete(link_index);
            }
        })
    }

    deleteLink(link_index: number) {
        this.links.delete(link_index);
    }



    clear() {
        this.vertices.clear();
        this.links.clear();
    }

    



    




    getDegreesData() {
        if (this.vertices.size == 0) {
            return { min_value: 0, min_vertices: null, max_value: 0, max_vertices: null, avg: 0 };
        }

        const idFirst = this.vertices.keys().next().value;
        if (typeof idFirst == "undefined"){
            return { min_value: 0, min_vertices: null, max_value: 0, max_vertices: null, avg: 0 };
        }
        let min_indices = new Set([idFirst]);
        let min_degree = this.getNeighborsList(idFirst).length;
        let max_indices = new Set([idFirst]);
        let maxDegree = this.getNeighborsList(idFirst).length;
        let average = 0.0;

        for (const v_index of this.vertices.keys()) {
            const neighbors = this.getNeighborsList(v_index);
            if (min_degree > neighbors.length) {
                min_degree = neighbors.length;
                min_indices = new Set([v_index]);
            }
            if (min_degree === neighbors.length) {
                min_indices.add(v_index);
            }

            if (maxDegree < neighbors.length) {
                maxDegree = neighbors.length;
                max_indices = new Set([v_index]);
            }
            if (maxDegree === neighbors.length) {
                max_indices.add(v_index);
            }

            average += neighbors.length;
        }

        average = average / this.vertices.size;

        return { min_value: min_degree, min_vertices: min_indices, max_value: maxDegree, max_vertices: max_indices, avg: average };
    }

    /**
     * Return maximum (undirected) degree of the graph.
     * Out-neighbors and In-neighbors are not taken in account.
     * @returns -1 if there is no vertex
     * @TODO should return undefined if no vertex
     */
    maxDegree(): number{
        let record = -1;
        for ( const v_index of this.vertices.keys()){
            let degree = this.getNeighborsList(v_index).length;
            if ( degree > record ){
                record = degree;
            }
        }
        return record;
    }

    /**
     * Return the minimum (undirected) degree of the graph.
     * Out-neighbors and In-neighbors are not considered.
     * @returns Infinity if there is no vertex
     */
    minDegree(): number{
        let record = Infinity;
        for ( const vId of this.vertices.keys()){
            let degree = this.getNeighborsList(vId).length;
            if ( degree < record ){
                record = degree;
            }
        }
        return record;
    }

    /**
     * Return minimum in-degree of the graph
     * @returns `""` if there is no vertex
     * @TODO replace string return by undefined
     */
    minIndegree(): number | string{
        let record: number | string = "";
        for ( const v_index of this.vertices.keys()){
            let indegree = this.getInNeighborsList(v_index).length;
            if (typeof record == "string"){
                record = indegree;
            } else if ( indegree < record ){
                record = indegree;
            }
        }
        return record;
    }

    /**
     * Return maximum in-degree of the graph
     * @returns undefined if there is no vertex
     */
    maxIndegree(): number | undefined{
        let record: number | undefined = undefined;
        for ( const vIndex of this.vertices.keys()){
            let indegree = this.getInNeighborsList(vIndex).length;
            if (typeof record == "undefined"){
                record = indegree;
            } else if ( indegree > record ){
                record = indegree;
            }
        }
        return record;
    }

    /**
     * Return maximum out-degree of the graph
     * @returns undefined if there is no vertex
     */
    maxOutdegree(): number | undefined{
        let record: number | undefined = undefined;
        for ( const vIndex of this.vertices.keys()){
            let d = this.getOutNeighborsList(vIndex).length;
            if (typeof record == "undefined"){
                record = d;
            } else if ( d > record ){
                record = d;
            }
        }
        return record;
    }



    // return minimum outdegree of the graph
    // return "" if there is no vertex
    minOutdegree(): number | string{
        let record: number | string = "";
        for ( const v_index of this.vertices.keys()){
            let indegree = this.getOutNeighborsList(v_index).length;
            if (typeof record == "string"){
                record = indegree;
            } else if ( indegree < record ){
                record = indegree;
            }
        }
        return record;
    }


     DFSrecursive( v_index: number, visited: Map<number, boolean>) {
        visited.set(v_index, true);
        const neighbors = this.getNeighborsList(v_index);

        for (const u_index of neighbors) {
            if (visited.has(u_index) && !visited.get(u_index)) {
                this.DFSrecursive( u_index, visited);
            }
        }
    }

    DFSiterative( v_index: number) {
        const visited = new Map();
        for (const index of this.vertices.keys()) {
            visited.set(index, false);
        }
        console.log(visited);

        const S = Array();
        S.push(v_index);

        while (S.length !== 0) {
            const u_index = S.pop();
            if (!visited.get(u_index)) {
                visited.set(u_index, true);
                const neighbors = this.getNeighborsList(u_index);
                for (const n_index of neighbors) {
                    S.push(n_index);
                }
            }
        }

        return visited;
    }


    hasCycle(): boolean {
        let ok_list = new Set();
        let g = this;

        function _hasCycle(d: number, origin: number, s: Array<number>): boolean {
            for (const v of g.getNeighborsList(d)) {
                if (v == origin || ok_list.has(v)) {
                    continue;
                }
                if (s.indexOf(v) > -1) {
                    return true;
                }
                s.push(v);
                let b = _hasCycle(v,d, s)
                if (b) {return true}
                ok_list.add(v);
                s.pop();
            }
            return false;
        }
        for (const v of this.vertices.keys()) {
            if (ok_list.has(v)) {
                continue;
            }
            if (_hasCycle(v,-1, [v])) {
                return true;
            }
        }
        return false;
    }

    /**
     * @returns [b, cycle] where b is a boolean which is true iff there exists a cycle.
     * If b is true, a cycle is returned.
     * @remark Iterative version
     */
    hasCycle2(): [boolean, Array<number>] {
        const visited = new Set();
        for (const v of this.vertices.keys()) {
            // console.log("start", v);
            if ( visited.has(v) == false){
                const stack = new Array<[number, number]>();
                const previous = new Map<number,number>();
                stack.push([v,-1]);
                let r = stack.pop();
                while (typeof r != "undefined"){
                    const [uIndex, last] = r;
                    // console.log("stack", uIndex);
                    if (visited.has(uIndex)){
                        console.log("bug")
                        return [true, []];
                    }
                    visited.add(uIndex);
                    
                    const neighbors = this.getNeighborsList(uIndex);
                    for (const nIndex of neighbors) {
                        if ( nIndex != last ){
                            if (visited.has(nIndex) == false){
                                previous.set(nIndex, uIndex);
                                stack.push([nIndex, uIndex]);
                            }
                            else {
                                const cycle = new Array<number>();
                                cycle.push(nIndex);
                                cycle.push(uIndex);
                                let j = previous.get(uIndex);
                                while ( typeof j != "undefined" && j != nIndex){
                                    cycle.push(j);
                                    j = previous.get(j);
                                }
                                return [true, cycle];
                            }
                        }
                    }
                    r = stack.pop();
                    // console.log([...previous])
                    // console.log("--")
                }
            }
        }
        return [false, []];
    }

     /**
     * 
     * @returns girth of the graph. It is the minimum length of a cycle.
     * If there is no cycle then `Infinity` is returned.
     * If there is a cycle, a list of its consecutive vertices is returned.
     * 
     * @example
    * AbstractGraph.generateClique(4).girth() == 3
    * AbstractGraph.generatePaley(13).girth() == 3
    * AbstractGraph.petersen().girth() == 5
    * AbstractGraph.star(3).girth() == 0
     */
    girth(): number{
        const cycle = this.shortestCycle();
        if (cycle.length == 0){
            return Infinity;
        } else {
            return cycle.length;
        }
    }



    /**
    * @returns a shortest cycle. It is a cycle of minimum length.
    * Returns an empty array if there is no cycle.
    * 
    * @example
    * AbstractGraph.generateClique(4).shortestCycle().length == 3
    * AbstractGraph.generatePaley(13).shortestCycle().length == 3
    * AbstractGraph.petersen.shortestCycle().length == 5
    * AbstractGraph.star(3).shortestCycle().length == 0
    */
    shortestCycle(): Array<number> {
        let girth = Infinity;
        const shortestCycle = new Array<number>();
    
        for (const v of this.vertices.keys()) {
            const visited = new Set();
            const distances = new Map<number, number>();
            const predecessors = new Map<number, number>();
            // console.log("starting vertex", v);

            if (!visited.has(v)) {
                const queue = new Array<[number, number, number]>();
                queue.push([v,0, Infinity]); // Queue for BFS, each element is [vertex, distance, predecessor]
                // console.log("init push ", [v,0, Infinity]);
                while (queue.length > 0) {
                    const elt = queue.shift();
                    if (typeof elt != "undefined"){
                        const [current, distance, prede] = elt;
                        if (visited.has(current)) {
                            // Cycle detected because current was already visited
                            // It means that it has a shortest path to v of length distances[current]
                            // We have also reached current from prede

                            // console.log("cycle ", current,  "dist", distance, "from ", prede, "and", predecessors.get(current))
                            const d = distances.get(current);
                            if (typeof d != "undefined"){
                                const cycleLength = distance + d;
                                // console.log("cycle length", cycleLength);
                                if (cycleLength < girth) {
                                    girth = cycleLength;
                                    // Reconstruct the shortest cycle by computing the path from current to v
                                    // and from prede to v
                                    let cycleStart = current;
                                    shortestCycle.splice(0, shortestCycle.length);
                                    shortestCycle.push(cycleStart);
                                    while (cycleStart !== v) {
                                        const pred = predecessors.get(cycleStart);
                                        if (typeof pred != "undefined"){
                                            cycleStart = pred;
                                            shortestCycle.push(cycleStart);
                                        } else {
                                            break;
                                        }
                                    }
                                    
                                    cycleStart = prede;
                                    while (cycleStart !== v) {
                                        shortestCycle.unshift(cycleStart);
                                        const pred = predecessors.get(cycleStart);
                                        if (typeof pred != "undefined"){
                                            cycleStart = pred;
                                        } else {
                                            break;
                                        }
                                    }
                                    // console.log("final cycle", shortestCycle)
                                }
                            }
                        } else {
                            // console.log("visit ", current, "dist ",  distance, "pred ", prede);
                            visited.add(current);
                            distances.set(current, distance);
                            predecessors.set(current, prede); // Set the predecessor to the last vertex in the queue
                            for (const neighbor of this.getNeighborsList(current)) {
                                if (!visited.has(neighbor)) {
                                    // console.log("push" , neighbor, distance+1)
                                    queue.push([neighbor, distance + 1, current]);
                                }
                            }
                        }
                    }
                    
                }
            }
        }
    
        return shortestCycle; 
    }



    /**
     * @returns [b, cycle] where b is a boolean which is true iff there exists a directed cycle.
     * If b is true, a directed cycle is returned.
     * @remark Iterative version
     */
    getDirectedCycle(): undefined | Array<number> {
        const outNeighbors = new Map<number, Set<number>>();
        for (const v of this.vertices.values()){
            const vOutNeighbors = new Set<number>();
            for (const neigh of this.getOutNeighborsList(v.index)){
                vOutNeighbors.add(neigh);
            }
            outNeighbors.set(v.index, vOutNeighbors);
        }

        return getDirectedCycle(outNeighbors.keys(), outNeighbors);

        // const state = new Map<number, number>();
        // // if a vertexIndex is a key of state, then the value is either 1 for DISCOVERED
        // // either 2 for TREATED, which means that no cycle start from this vertex
        // // if a vertexIndex is not a key, then is is considered as UNDISCOVERED

        // for (const v of this.vertices.keys()) {
        //     if ( state.has(v) == false){
        //         const stack = new Array<number>();
        //         const previous = new Map<number,number>();
        //         stack.push(v);
        //         while (stack.length > 0){
        //             const u = stack[stack.length-1]; 

        //             if (state.has(u) == false){
        //                 state.set(u, 1); // 1 is DISCOVERED
        //                 const neighbors = this.getOutNeighborsList(u);
        //                 for (const uNeighbor of neighbors) {
        //                     if ( state.has(uNeighbor) == false){
        //                         previous.set(uNeighbor, u);
        //                         stack.push(uNeighbor);
        //                     } else if (state.get(uNeighbor) == 1) {

        //                         const cycle = new Array<number>();
        //                         cycle.push(uNeighbor);
        //                         cycle.push(u);
        //                         let j = previous.get(u);
        //                         while ( typeof j != "undefined" && j != uNeighbor){
        //                             cycle.push(j);
        //                             j = previous.get(j);
        //                         }
        //                         return cycle;
        //                     }
        //                 }
        //             }
        //             else {
        //                 stack.pop();
        //                 state.set(u, 2); // TREATED, no cycle starts from u
        //             }
                    
        //         }
        //     }
        // }
        // return undefined;
    }


    /**
     * @returns [b, cycle] where b is a boolean which is true iff there exists a directed cycle.
     * If b is true, a directed cycle is returned.
     * @remark Recursive version
     */
    hasDirectedCycleRecursive(): boolean {
        let ok_list = new Set();
        let g = this;
        
        function _has_directed_cycle(d: number, s: Array<number>): boolean {
            for (const v of g.getOutNeighborsList(d)) {
                if (s.indexOf(v) > -1) {
                    return true;
                }
                s.push(v);
                let b = _has_directed_cycle(v, s)
                if (b) {return true}
                ok_list.add(v);
                s.pop();
            }
            return false;
        }
        for (const v of this.vertices.keys()) {
            if (ok_list.has(v)) {
                continue;
            }
            if (_has_directed_cycle(v, [v])) {
                return true;
            }
        }
        return false;
    }


    // compute the size of the connected component of vertex of index "vindex"
    // return 0 if vindex is not a vertex index
    sizeConnectedComponentOf(vindex: number): number {
        if (this.vertices.has(vindex) == false){
            return 0;
        }
        let counter = 0;
        const visited = new Set();
        const stack = Array();
        stack.push(vindex);

        while (stack.length > 0) {
            const u_index = stack.pop();
            if (!visited.has(u_index)) {
                counter += 1;
                visited.add(u_index);
                const neighbors = this.getNeighborsList(u_index);
                for (const n_index of neighbors) {
                    
                    stack.push(n_index);
                }
            }
        }
    
        return counter;
    }


    sizeConnectedComponentExcludingLinks(vindex: number, excluded: Set<number>): number {
        if (this.vertices.has(vindex) == false){
            return 0;
        }
        let counter = 0;
        const visited = new Set();
        const stack = Array();
        stack.push(vindex);

        while (stack.length > 0) {
            const u_index = stack.pop();
            if (!visited.has(u_index)) {
                counter += 1;
                visited.add(u_index);
                const neighbors = this.getNeighborsListExcludingLinks(u_index, excluded);
                for (const n_index of neighbors) {
                    stack.push(n_index);
                }
            }
        }
    
        return counter;
    }

    // compute the size of the connected component of vertex of index "vindex"
    // return 0 if vindex is not a vertex index
    getConnectedComponentOf(vindex: number): Graph<V,L> {
        const g = new Graph<V,L>();
        const initVertex = this.vertices.get(vindex);
        if ( typeof initVertex == "undefined"){
            return g;
        }
        const visited = new Set();
        const stack = Array<Vertex<V>>();
        stack.push(initVertex);

        
        while (stack.length > 0) {
            const u = stack.pop();
            if (typeof u == "undefined") break;
            g.setVertex(u.index, u.data);
            if (!visited.has(u.index)) {
                visited.add(u.index);
                for (const [link_index, link] of this.links.entries()){
                    if ( link.orientation == ORIENTATION.UNDIRECTED){
                        if ( link.startVertex.index == u.index){
                            stack.push(link.endVertex);
                            g.links.set(link_index, link);
                        } else if ( link.endVertex.index == u.index){
                            stack.push(link.startVertex);
                            g.links.set(link_index, link);
                        }
                    }
                }
            }
        }
    
        return g;
    }

    /**
     * Return a cut edge which maximizes the minimum of the size of the connected components of its endvertices.
     * Return -1 if there is no cut edge 
     */
    maxCutEdge(): number{
        const n = this.vertices.size;
        let record = 0;
        let record_link_index = -1;
        for ( const [link_index, link] of this.links.entries()){

            const n1 = this.sizeConnectedComponentExcludingLinks(link.startVertex.index, new Set([link_index]));
            if (n1 < n ){
                const n2 = this.sizeConnectedComponentExcludingLinks(link.endVertex.index, new Set([link_index]));
                const m = Math.min(n1,n2);
                if ( m > record){
                    record = m;
                    record_link_index = link_index;
                }
            }
        }
        return record_link_index;
    }
    

    /**
     * An undirected graph is said to be connected if there is a path between any pair of vertices.
     * @returns true iff the graph is connected
     */
    isConnected(): boolean {
        if (this.vertices.size < 2) {
            return true;
        }
    
        const indices = Array.from(this.vertices.keys());
        const visited = new Map();
        for (const index of this.vertices.keys()) {
            visited.set(index, false);
        }
    
        this.DFSrecursive( indices[0], visited);
    
        for (const is_visited of visited.values()) {
            if (!is_visited) {
                return false;
            }
        }
        return true;
    }

    
    /**
     * A strongly connected component is a subset of vertices ot the graph such that for any pair (v,w) of vertices in this subset, there is a directed path from v to w.
     * @returns the strongly connected components. By denoting `r` the returned array, then r[i] is an array containing all the vertices indices in the i-th strongly connected component.
     * @algorithm Kosaraju's algorithm: https://en.wikipedia.org/wiki/Kosaraju's_algorithm
     */
    stronglyConnectedComponents(): Array<Array<number>> {
	    const graph = this;
	    let scc: Array<Array<number>> = Array(); // Strongly Connected Components
	    var stack = Array();
	    var visited = new Set();

	    const visit = function (cur: number) {
            if (visited.has(cur)) return;
            visited.add(cur);
            for (const neigh of graph.getOutNeighborsList(cur)) {
                visit(neigh);
            }
            stack.push(cur);
	    }

	    for (const key of this.vertices.keys()) {
		    visit(key);
	    } // O(n) due to caching

        let assigned = new Set();
	    
	    const assign_fn = function (cur: number) {
		if (!assigned.has(cur)) {
		    assigned.add(cur);
		    const rootStack = scc.pop();
            if (typeof rootStack != "undefined"){
                rootStack.push(cur);
                scc.push(rootStack);
                for (const neigh of graph.getInNeighborsList(cur)) {
                    assign_fn(neigh);
                }
            }
		}

	    }

	    while (stack.length != 0) {
		    let stack_head = stack.pop();
	            if (!assigned.has(stack_head)) {
			scc.push([]); // The array to stock the new component
			assign_fn(stack_head);
		    }
	    }

	    return scc; 
    }

    

    

    /**
     * Paste other graph in this by cloning the vertices and links of the other graph.
     * It creates new indices for the vertices and links of the other graph.
     * Therefore if 0 was a vertex index of this and 0 also a vertex index of the other graph, then it creates index 1 (or another possible index).
     * 
     */
    pasteGraph(other: Graph<V,L>){
        const corresp = new Map<number,number>();
        for(const [oldIndex, vertex] of other.vertices){
            const newVertex = this.addVertex(vertex.data); // TODO faut cloner
            corresp.set(oldIndex, newVertex.index);
        }
        for (const link of other.links.values()){
            const newIndexV1 = corresp.get(link.startVertex.index);
            const newIndexV2 = corresp.get(link.endVertex.index);
            if (typeof newIndexV1 !== "undefined" && typeof newIndexV2 !== "undefined"){
                this.addLink(newIndexV1, newIndexV2, link.orientation, link.data);  // TODO faut cloner
            }
        }
    }

    /**
     * WARNING: UNTESTED
     * Clones the graph.
     */
    // clone(): Graph<V,L> {
    //     const newGraph = new Graph<V,L>();
    //     for(const [index, vertex] of this.vertices){
    //         newGraph.setVertex(index, vertex.data.clone());
    //     }
    //     for(const [index, link] of this.links){
    //         newGraph.setLink(index, link.data.clone());
    //     }
    //     return newGraph;
    // }




    /**
     * Compute a clique with a greedy algorithm.
     */
    greedyClique(): Set<number>{
        const clique = new Set<number>();
        while (true){
            let maxd = 0;
            let maxIndex = undefined;
            for (const v of this.vertices.values()){
                let k = 0;
                for (const neighbor of this.getNeighborsFromIndex(v.index)){
                    if (clique.has(neighbor.index)){
                        k ++;
                    }
                }
                if (k < clique.size){
                    continue;
                }
                const d = this.degree(v.index);
                if (d > maxd){
                    maxd = d;
                    maxIndex = v.index;
                }
            }
            if (typeof maxIndex == "undefined"){
                return clique;
            } else {
                clique.add(maxIndex);
            }
        }
    }


    /**
     * Return the degree of the vertex of index `vIndex`.
     * If `vIndex` is not a vertex index, then 0 is returned.
     */
    degree(vIndex: number): number {
        let d = 0;
        for (const link of this.links.values()){
            if ( link.startVertex.index == vIndex || link.endVertex.index == vIndex){
                d ++;
            }
        }
        return d;
    }

    /**
     * Return the index of a maximal degree vertex or `undefined` if there is no vertices.
     */
    maximalDegreeVertex(): Option<number> {
        let record = -1;
        let index = undefined;
        for (const vIndex of this.vertices.keys()){
            if (this.degree(vIndex) > record){
                index = vIndex;
            }
        }
        return index;
    }


    

    /**
     * Return true if the current coloring can be completed
     */
    private auxChroma(k: number, coloring: Map<number,number>, possibleColors: Map<number,Set<number>>, neighbors: Map<number, Array<Vertex<V>>>, cliques?: Set<Set<number>>): boolean{

        // If a clique has not enough colors to color itself then stop
        if (typeof cliques != "undefined"){
            for (const clique of cliques){
                const pColors = new Set<number>();
                let s = 0;
                for (const vId of clique){
                    if (coloring.has(vId) == false){
                        s ++;
                        const possibleColorsV = possibleColors.get(vId);
                        if (typeof possibleColorsV == "undefined") continue;
                        for( const color of possibleColorsV){
                            pColors.add(color);
                        }
                    }
                }
                if (pColors.size < s){
                    return false;
                }
            }
        }
        

        let minPoss = k+1;
        let minId = undefined;
        // Choose the uncolored vertex which has the less color choice
        for (const [vIndex, possibilities] of possibleColors){
            if (coloring.has(vIndex) == false && possibilities.size < minPoss){
                minPoss = possibilities.size;
                minId = vIndex;
                if (minPoss == 0){
                    return false;
                }
            }
        }
        if (typeof minId == "undefined"){
            // All vertices have a color
            // console.log(coloring);
            return true;
        } else {
            const possib = possibleColors.get(minId);
            if (typeof possib == "undefined") return false;
            for (const color of possib){
                coloring.set(minId, color);
                const modified = new Array();
                const neighborsMinId = neighbors.get(minId);
                if (typeof neighborsMinId == "undefined") continue;
                for (const neighbor of neighborsMinId){
                    const set = possibleColors.get(neighbor.index);
                    if (typeof set == "undefined") continue;
                    if (set.has(color) && coloring.has(neighbor.index) == false){
                        set.delete(color);
                        modified.push(neighbor.index);                        
                    }
                }
                const result = this.auxChroma(k, coloring, possibleColors, neighbors, cliques);
                if (result) return true;

                // If cannot extend: backtrack
                coloring.delete(minId);
                for (const modifiedNeigborId of modified){
                    possibleColors.get(modifiedNeigborId)?.add(color);
                }

                
            }
            return false;
        }
    }

     /**
     * Returns the chromatic number of the graph.
     * The chromatic number is the minimum integer k such that there exists a proper coloring with k colors.
     * TODO: What happens with arcs? I dont know.
     * Algorithm: Backtrack
     * @param cliques is a set of cliques (sets of vIndices) of the graph. There are used to cut the search. The best would be to give the set of maximal cliques but it is NP-hard to compute. So if your graph has known cliques it is better.
     */
    chromaticNumber(cliques?: Set<Set<number>>): number {
        const coloring = this.minimalProperColoring(cliques);
        let colors = new Set();
        for (const color of coloring.values()){
            colors.add(color);
        }
        return colors.size;
    }

    /**
     * Return a miniaml proper coloring.
     * A coloring is proper if any two adjacent vertices have different colors.
     * The chromatic number is the size of a minimal proper coloring.
     * @param cliques is a set of cliques (sets of vIndices) of the graph. There are used to cut the search.
     */
    minimalProperColoring(cliques?: Set<Set<number>>) : Map<number, number> {
        const n = this.vertices.size;
        if (n == 0) return new Map();

        let clique = new Set<number>();
        if(typeof cliques == "undefined"){
            clique = this.greedyClique();
        } else {
            for (const c of cliques){
                if (c.size > clique.size){
                    clique = c;
                }
            }
        }

        const neighbors = new Map<number, Array<Vertex<V>>>();
        for (const vId of this.vertices.keys()){
            neighbors.set(vId, this.getNeighborsFromIndex(vId));
        }

        let k = clique.size;
        while (true){
            const coloring = new Map<number,number>();
            const possibleColors = new Map<number,Set<number>>();
            for (const vIndex of this.vertices.keys()){
                possibleColors.set(vIndex, new Set(Array.from({length: k}, (_, i) => i)))
            }

            let i = 0;
            for (const vId of clique){
                coloring.set(vId, i);
                for (const neighbor of this.getNeighborsFromIndex(vId)){
                    possibleColors.get(neighbor.index)?.delete(i);
                }
                i ++;
            }

            if (this.auxChroma(k, coloring, possibleColors, neighbors, cliques)) return coloring;
            k += 1;
        }
    }


    /**
     * The dichromatic number is the minimum k such that if the vertices are colored with k colors, then the subgraph induced by each color is acyclic (there is no directed cycle)
     * @returns 
     * 
     * What happens if a graph has a directed loop?
     * 
     */
    minimumProperDicoloring(): Array<number> {
        for (let i = 1; i < this.vertices.size; i ++){
            const coloring = acyclicColoring(this, i);
            if (coloring.length > 0){
                return coloring;
            }
        }
        return [];
    }

    /**
     * The dichromatic number is the minimum k such that if the vertices are colored with k colors, then the subgraph induced by each color is acyclic (there is no directed cycle)
     * @returns 
     * 
     * What happens if a graph has a directed loop?
     * 
     */
    dichromaticNumber(): number {
        return dichromatic(this);
    }
    

    /**
     * Undirected Feedback Vertex Set (UFVS)
     * 
     * UNDER DEVELOPPEMENT
     */
    private auxUFVS(k: number, links: Array<Link<V,L>>, selection: Set<number>): boolean {

        // Kernelization
        // Removes all degree 1 vertices (leaves)
        while(true){
            let degrees = new Map<number, number>();
            for ( const link of links){
                const extremities = [link.startVertex.index, link.endVertex.index];
                for (const x of extremities){
                    const dx = degrees.get(x);
                    if (typeof dx == "undefined"){
                        degrees.set(x, 1);
                    } else {
                        degrees.set(x, dx +1);
                    }
                }
            }

            const degree1vertices = new Set<number>();
            for (const [x,dx] of degrees.entries()){
                if (dx == 1){
                    degree1vertices.add(x);
                }
            }

            links = links.filter( link => {return !link.hasAnExtrimityIn(degree1vertices)})

            if (degree1vertices.size == 0) break;
        }

        // Manage degree 2 vertices
        // TODO ...

        // Manage flowers
        // TODO ...

        // End of kernelization

        // Branch
        const link = links.pop();
        if (typeof link == "undefined"){
            return true;
        } else {
            const x = link.startVertex.index;

            if (this.auxUFVS(k, links, selection)) {
                links.push(link);   
                return true;
            }
            selection.add(x);
            const newLinks = links.filter( l => {return l.hasAnExtrimityIn(new Set([x])) })
            const r = this.auxUFVS(k-1, newLinks, selection);
            selection.delete(x);

            links.push(link);
            return r;
        }

    }

    /**
     * UNDER DEVELOPPEMENT
     */
    private ufvsLauncher(k : number): boolean {
        const links = new Array<Link<V,L>>();

        for (const link of this.links.values()){
            links.push(link);
        }

        return this.auxUFVS(k, links, new Set());
    }

    /** 
     * # Feedback Vertex Set Number 
     * A subset X of V(G) is a Feedback Vertex Set if G-X (deletion of vertices) is acyclic.
     * The Feedback Vertex Set Number (FVSN) is the minimum size of a FVS.
     * @returns the FVSN
     * @example fvsn(directed cycle 3) = 1 
     */
    fvsn(): number {
        const n = this.vertices.size;

        const selection = new Array<boolean>();
        const indices = new Map<number, number>();
        let j = 0;
        for ( const index of this.vertices.keys()){
            selection.push(false);
            indices.set(index,j);
            j ++;
        }

        for ( let k = 0 ; k <= n ; k ++){
            // Check if there exists a FVS of size k

            // Initialize the selection to the first k vertices
            for (let i = 0 ; i < n ; i ++){
                selection[i] = i < k;
            }

            while (true){
                // Check if the selection is a FVS
                let isFeedbackVertexSet = true;
                const outDegrees = new Set<number>();
                for (const v of this.vertices.values()){
                    const i = indices.get(v.index);
                    if (typeof i != "undefined"){
                        let outDegree = 0;
                        if ( selection[i] == false){
                            for (const neighbor of this.getOutNeighbors(v)){
                                const j = indices.get(neighbor.index);
                                if (typeof j == "undefined") return 0; // bug
                                if ( selection[j] == false ){
                                    outDegree += 1
                                }
                            }
                            if (outDegrees.has(outDegree)){
                                isFeedbackVertexSet = false;
                                break;
                            } else {
                                outDegrees.add(outDegree);
                            }
                        }
                    }
                }

                // If selection is a FVS then return its size
                if (isFeedbackVertexSet){
                    let count = 0;
                    for (const v of selection){
                        if (v) {
                            count ++;
                        }
                    }
                    return count;
                }

                // Compute next selection if possible
                let i = n-1;
                let nbTrue = 0;
                while (selection[i] == true){
                    i --;
                    nbTrue ++;
                }
                let nbFalse = 0;
                while (i >= 0 && selection[i] == false){
                    i --;
                    nbFalse ++;
                }
                if (i == -1){ 
                    break;
                }
                if (nbTrue == 0){
                    selection[n-1-nbFalse] = false;
                    selection[n-1-nbFalse+1] = true;
                } else {
                    for (let h = 0; n-1-nbFalse-nbTrue+h < n ; h ++){
                        selection[n-1-nbFalse-nbTrue+h] = false;
                    }

                    for (let h = 1; h <= nbTrue+1 ; h ++){
                        selection[n-1-nbFalse-nbTrue+h] = true;
                    }
                }
                // console.log(booleanArrayToString(selection));
            }
        }

        return -1; // Should not happen
    }


    /**
     * OSBOLETE by V4
     * Return true if the selection of vertices can be completed to a vertex cover of size at most k.
     * @param k a nonnegative integer 
     * @param selection the vertices currently selection
     */
    private auxVertexCoverV2K(k: number, selection: Set<number>, rec: number): boolean {
        // console.log("aux", k, selection, rec);
        if (selection.size > k){
            return false;
        }
        for (const link of this.links.values()){
            if (!selection.has(link.startVertex.index) && !selection.has(link.endVertex.index)){
                // console.log(link.index, link.startVertex.index, link.endVertex.index);

                // Branch
                selection.add(link.startVertex.index);
                const r = this.auxVertexCoverV2K(k, selection, rec+1);
                selection.delete(link.startVertex.index);
                if (r){
                    
                    return true;
                } else {
                    selection.add(link.endVertex.index);
                    const r2 = this.auxVertexCoverV2K(k, selection, rec+1);
                    selection.delete(link.endVertex.index);
                    return r2;
                }
            }
        }
        // If this line is reached, then all links have been covered
        return true; 
    }

    /**
     * OSBOLETE by V4
     * @param k 
     * @returns 
     */
    private vertexCoverV2K(k: number): boolean{
        return this.auxVertexCoverV2K(k, new Set(), 0);
    }

     /**
     * OSBOLETE by V4
     * @param k 
     * @returns 
     */
     private auxVertexCover3(links: Array<Link<V,L>>, selection: Set<number>, record: number): number {
        // console.log("aux", k, selection, rec);
        if (selection.size > record){
            return record;
        }
        const link = links.pop();
        if (typeof link == "undefined"){
            return selection.size;
        } else {
            // Branch
            const x = link.startVertex.index;
            selection.add(x);
            const links1 = new Array();
            for (const l of links){
                if (l.startVertex.index != x && l.endVertex.index != x){
                    links1.push(l);
                }
            }
            const r = this.auxVertexCover3(links1, selection, record);
            selection.delete(x);
            if (r < record) record = r;

            const y = link.endVertex.index;
            const links2 = new Array();
            for (const l of links){
                if (l.startVertex.index != y && l.endVertex.index != y){
                    links2.push(l);
                }
            }
            selection.add(y);
            const r2 = this.auxVertexCover3(links2, selection, record);
            selection.delete(y);
            if (r2 < record) record = r2;
            return record;
        }
    }

     /**
     * OSBOLETE by V4
     */
     private vertexCoverV3(): number {
        const links = new Array();
        for (const link of this.links.values()){
            links.push(link);
        }
        return this.auxVertexCover3(links, new Set(), this.vertices.size);
    }

     /**
     * OSBOLETE by V4
     */
     private auxVertexCover3Bis(links: Array<Link<V,L>>, selection: Set<number>, record: number): number {
        // console.log("aux", k, selection, rec);

        const approx = this.vertexCover2Approx(links);
        if (selection.size + approx/2 > record ){
            return record;
        }


        const link = links.pop();
        if (typeof link == "undefined"){
            return selection.size;
        } else {
            // Branch
            const x = link.startVertex.index;
            selection.add(x);
            const links1 = new Array();
            for (const l of links){
                if (l.startVertex.index != x && l.endVertex.index != x){
                    links1.push(l);
                }
            }
            const r = this.auxVertexCover3Bis(links1, selection, record);
            selection.delete(x);
            if (r < record) record = r;

            const y = link.endVertex.index;
            const links2 = new Array();
            for (const l of links){
                if (l.startVertex.index != y && l.endVertex.index != y){
                    links2.push(l);
                }
            }
            selection.add(y);
            const r2 = this.auxVertexCover3Bis(links2, selection, record);
            selection.delete(y);
            if (r2 < record) record = r2;
            return record;
        }
    }

     /**
     * OSBOLETE by V4
     */
     privatevertexCoverV3Bis(): number {
        const links = new Array();
        for (const link of this.links.values()){
            links.push(link);
        }
        return this.auxVertexCover3Bis(links, new Set(), this.vertices.size);
    }

    private auxVertexCover4(k: number, links: Array<Link<V,L>>, selection: Set<number>): boolean {
        // console.log("aux", k, selection, rec);
        

        // const approx = this.vertexCover2Approx(links);
        // if (selection.size + approx/2 > k ){
        //     return false;
        // }

        // Kernelization
        // Add recursively all vertex such that d(v) > k-|selection|
        const kernelSelection = new Set<number>();
        while(true){
            let found = false;
            for (const vertex of this.vertices.values()){
                const x = vertex.index;
                if (selection.has(x) == false){
                    let degree = 0;
                    for (const link of links){
                        if (link.startVertex.index == x || link.endVertex.index == x){
                            degree ++;
                        }
                    }
                    if (degree > k- selection.size){
                        selection.add(vertex.index);
                        kernelSelection.add(vertex.index);
                        links = links.filter( (link) => {return link.startVertex.index != x && link.endVertex.index != x })
                        found = true;
                        break;
                    }
                }
            }
            if (found == false){
                break;
            }
        }
        // console.log(kernelSelection.size);
        if (selection.size > k ){
            // TODO: faudrait pas annuler ici kernel selection ?
            return false;
        }
        

        // const matching = this.generateRandomMaximalSubMatching(links);
        // if (selection.size + matching > k){
        //     return false;
        // }

        const link = links.pop();
        if (typeof link == "undefined"){ // THere is no link to cover
            // for (const x of kernelSelection){
            //     selection.delete(x);
            // }
            return true;
        } else {
            // Branch
            const x = link.startVertex.index;
            selection.add(x);
            const links1 = new Array();
            for (const l of links){
                if (l.startVertex.index != x && l.endVertex.index != x){
                    links1.push(l);
                }
            }
            const r = this.auxVertexCover4(k, links1, selection);
            
            if (r){
                // for (const x of kernelSelection){
                //     selection.delete(x);
                // }
                return true;
            } 
            selection.delete(x); // il était au dessus du if avant

            const y = link.endVertex.index;
            const links2 = new Array();
            for (const l of links){
                if (l.startVertex.index != y && l.endVertex.index != y){
                    links2.push(l);
                }
            }
            selection.add(y);
            const r2 = this.auxVertexCover4(k, links2, selection);
            if (r2 == false){
                selection.delete(y);
                for (const x of kernelSelection){
                    selection.delete(x);
                }
            }
            
            return r2;
        }
    }

    private vertexCoverV4launcher(k :number): undefined | Set<number> {
        let links = new Array<Link<V,L>>();
        for (const link of this.links.values()){
            links.push(link);
        }

        const preselection = new Set<number>();
        let nbKer = 0;

        while(true){
            let found = false;
            for (const vertex of this.vertices.values()){
                const x = vertex.index;
                if (preselection.has(x) == false){
                    let degree = 0;
                    for (const link of links){
                        if (link.startVertex.index == x || link.endVertex.index == x){
                            degree ++;
                        }
                    }
                    if (degree > k){
                        preselection.add(vertex.index);
                        links = links.filter( (link) => {return link.startVertex.index != x && link.endVertex.index != x })
                        found = true;
                        nbKer ++;
                        break;
                    }
                }
            }
            if (found == false){
                break;
            }
        }
        // console.log(nbKer)
        if (this.auxVertexCover4(k, links, preselection)){
            return preselection;
        } else {
            return undefined;
        }
    }

    private vertexCoverV4(): [number, Set<number>] {
        const matching = this.generateRandomMaximalMatching();
        for (let k = matching.length ; k <= this.vertices.size ; k ++ ){
            const r = this.vertexCoverV4launcher(k);
            if (typeof r != "undefined"){
                return [k, r];
            }
        }
        return [0, new Set()]; // Should not happen
    }

    

    private vertexCoverV2(): number {
        for (let k = 0 ; k <= this.vertices.size ; k ++ ){
            // console.log(k);
            if (this.vertexCoverV2K(k)){
                return k;
            }
        }
        return 0; // Should not happen
    }

    /**
     * Return a 2-approximation of the vertex number of the subgraphLinks
     * @param subgraphLinks 
     * @returns 
     */
    vertexCover2Approx(subgraphLinks: Array<Link<V,L>>): number {
        // Copy subgraph links
        let links = new Array<Link<V,L>>();
        for (const link of subgraphLinks){
            links.push(link);
        }

        let approx = 0;
        let link = links.pop();
        while (typeof link != "undefined"){
            approx += 2;
            const x = link.startVertex.index;
            const y = link.endVertex.index;
            // console.log( link.index, x, y);

            links = links.filter( l => {
                return l.startVertex.index != x &&
                l.startVertex.index != y &&
                l.endVertex.index != x &&
                l.endVertex.index != y })
            link = links.pop();
        }

        return approx;

    }


    generateRandomMaximalSubMatching(subgraphLinks: Array<Link<V,L>>): number{

        // Copy subgraph links
        let links = new Array<Link<V,L>>();
        for (const link of subgraphLinks){
            links.push(link);
        }

        let matchingSize = 0;

        let link = links.pop();
        while (typeof link != "undefined"){
            matchingSize ++;
            const x = link.startVertex.index;
            const y = link.endVertex.index;

            links = links.filter( l => {
                return l.startVertex.index != x &&
                l.startVertex.index != y &&
                l.endVertex.index != x &&
                l.endVertex.index != y })
            link = links.pop();
        }

        return matchingSize;
    }

    generateRandomMaximalMatching(): Array<Link<V,L>>{
        
        // console.log(this.links.size);
        const matching = new Array<Link<V,L>>();
        let links = new Array<Link<V,L>>();
        for (const link of this.links.values()){
            links.push(link);
        }
        const vertices = new Set<number>();

        let link = links.pop();
        while (typeof link != "undefined"){
            matching.push(link);
            const x = link.startVertex.index;
            const y = link.endVertex.index;

            vertices.add(x);
            vertices.add(y);

            links = links.filter( l => {return !vertices.has(l.startVertex.index) && !vertices.has(l.endVertex.index)})
            link = links.pop();
        }

        return matching;
    }

    
    /**
     * Compute the vertex cover number of the graph.
     * It is the minimum integer k such that there exists a subset X of the vertices which is of size k and such that every edge is incident to at least one vertex of X.
     * TODO: optional parameter m: asserts that the result it at least m
     * TODO: return a certificate that it has a k-vertex-cover
     * ALGO: uses kernelization and branch
     */
    vertex_cover_number(): number {
        return this.vertexCoverV4()[0];
    }

    minVertexCover(): Set<number> {
        return this.vertexCoverV4()[1];
    }


    /**
     * Return the maximum size of a clique extending `clique` if it is higher than record.
     * @param commonNeighbors is the set of commonNeighbors of clique. Therefore any vertex extending the clique should be taken in this set.
     * @param neighbors is the map of all the neighbors of every vertex.
     * @param currentMaximumClique It is immediately updated by the size of the clique.
    */
    private auxCliqueNumber( clique: Set<number>, commonNeighbors: Set<number>, neighbors: Map<number, Set<number>>, currentMaximumClique: Set<number>): Set<number>{

        // Cut if clique + cliqueNeighbors < record
        if (clique.size + commonNeighbors.size <= currentMaximumClique.size){
            return currentMaximumClique;
        }

        if (clique.size > currentMaximumClique.size){
            currentMaximumClique = new Set(clique);
        }

        const commonNeighborsList = Array.from(commonNeighbors);
        for (const neighbor of commonNeighborsList){
            clique.add(neighbor);

            const deletedCommonNeighbors = [neighbor];
            for (const a of commonNeighbors){
                const na = neighbors.get(a);
                if (typeof na != "undefined" && na.has(neighbor) == false){
                    commonNeighbors.delete(a);
                    deletedCommonNeighbors.push(a);
                }
            }

            const newClique = this.auxCliqueNumber(clique, commonNeighbors, neighbors, currentMaximumClique);
            if (newClique.size > currentMaximumClique.size){
                currentMaximumClique = newClique;
            }

            for (const a of deletedCommonNeighbors){
                commonNeighbors.add(a);
            }
            clique.delete(neighbor);
        }
        return currentMaximumClique;
    }

            
    /**
     * Compute the clique number of the graph.
     * It is the maximum size of a clique of the graph.
     * @param cliqueSample is a clique known before computation
     */
    cliqueNumber(cliqueSample?: Set<number>): number {
        return this.maximumClique(cliqueSample).size;
    }

    /**
     * Compute a maximum clique of the graph.
     * @param cliqueSample is a clique known before computation
     */
    maximumClique(cliqueSample?: Set<number>): Set<number> {
        const neighbors = new Map<number, Set<number>>();
        for (const vertex of this.vertices.values()){
            neighbors.set(vertex.index, new Set());
        }
        for (const link of this.links.values()){
            neighbors.get(link.startVertex.index)?.add(link.endVertex.index);
            neighbors.get(link.endVertex.index)?.add(link.startVertex.index);
        }

        let currentMaximumClique = (typeof cliqueSample != "undefined") ? cliqueSample: new Set<number>();

        for (const [index, v] of this.vertices){
            const clique = new Set([index]);
            
            const commonNeighbors = new Set<number>();
            const vNeighbors = neighbors.get(index);
            if (typeof vNeighbors == "undefined") continue;
            for (const neighbor of vNeighbors){
                commonNeighbors.add(neighbor)
            }
            currentMaximumClique = this.auxCliqueNumber(clique, commonNeighbors, neighbors, currentMaximumClique);
        }
        return currentMaximumClique;
    }



    /**
     * @param subset the subset that we try to extend to a dominating set
     * @param toDominate the vertices that remain to dominate
     * @param choosable the vertices that can be added to the subset
     * @param currentMin the current min dominating set
     * @param variant depending on this variant, the final check of a branch leads to a solution or not. Better algorithms exist for these variants.
     * @param lowerBound a lower bound on any minimum dominating set
     * @returns a better dominating set than currentMin
     */
    private auxMinDominatingSet(subset: Set<number>, toDominate: Array<number>, choosable: Array<number>, currentMin: Set<number>, variant: undefined | DominationVariant, neighbors: Map<number, Array<number>>, lowerBound: number): Set<number>{
        if (toDominate.length == 0){
            if (subset.size < currentMin.size){
                if (variant == DominationVariant.Independent){
                    // Check that subset is Indep
                    // If there is an edge between the subset, then return the curretMin (and therefore do not update it)
                    // This branch could have cut above.
                    for (const x of subset){
                        for (const y of subset){
                            if (x != y){
                                const nx = neighbors.get(x);
                                if (typeof nx != "undefined"){
                                    if (nx.indexOf(y) >= 0){
                                        return currentMin;
                                    }
                                }
                            }
                        }
                    }
                }

                if (variant == DominationVariant.OrientedIndependent){
                    // Check that subset is Indep
                    // If there is an edge between the subset, then return the curretMin (and therefore do not update it)
                    // This branch could have cut above.
                    for (const x of subset){
                        for (const y of subset){
                            if (x != y){
                                const nx = this.getInNeighborsList(x);
                                if (typeof nx != "undefined"){
                                    if (nx.indexOf(y) >= 0){
                                        return currentMin;
                                    }
                                }
                                const nx2 = this.getOutNeighborsList(x);
                                if (typeof nx2 != "undefined"){
                                    if (nx2.indexOf(y) >= 0){
                                        return currentMin;
                                    }
                                }
                            }
                        }
                    }
                }

                const subsetCopy = new Set(subset);
                return subsetCopy;
            } else {
                return currentMin;
            }
        }
        /*
        Algorithm: branch on a vertex of choosable
        - either add the vertex to the subset
        - either not
        */

        if (choosable.length == 0){
            return currentMin;
        }

        if (subset.size +1 >= currentMin.size){
            return currentMin;
        }

        if (currentMin.size == lowerBound){
            return currentMin;
        }

        // Search for the choosable vertex which maximizes the number of newly dominated vertices
        let best: undefined | number = undefined;
        let bestCounter = -1;
        for (let i = 0; i < choosable.length; i++){
            const v = choosable[i];
            const vNeighbors = neighbors.get(v);
            if (typeof vNeighbors != "undefined"){
                let counter = 0;
                for (const x of toDominate){
                    if (vNeighbors.indexOf(x) >= 0 || x == v){
                        counter ++;
                    }
                }
                if (counter > bestCounter){
                    bestCounter = counter;
                    best = i;
                }
            }
        }
        // let best = Math.floor(Math.random()*choosable.length);
        if (typeof best == "undefined"){
            return currentMin;
        } else {
            const v = choosable[best]
            const vNeighbors = neighbors.get(v);
            if (typeof vNeighbors != "undefined"){
                const newToDominate = new Array();
                for (const x of toDominate){
                    if ( vNeighbors.indexOf(x) == -1 && x != v){
                        newToDominate.push(x);
                    }
                }

                choosable.splice(best, 1);
                
                if (newToDominate.length < toDominate.length){
                    subset.add(v);
                    currentMin = this.auxMinDominatingSet(subset, newToDominate, choosable, currentMin, variant, neighbors, lowerBound);
                    subset.delete(v);
                }
                currentMin = this.auxMinDominatingSet(subset, toDominate, choosable, currentMin, variant, neighbors, lowerBound);
                
                choosable.push(v);

                return currentMin;
            } else {
                return currentMin;
            }
        }

    }


    private auxMinConnectedDominatingSet(subset: Set<number>, toDominate: Array<number>, choosable: Array<number>, currentMin: Set<number>, neighbors: Map<number, Array<number>>, lowerBound: number): Set<number>{
        // console.log("-------");
        // console.log("subset", subset);
        // console.log("toDom", toDominate);
        // console.log("choosable", choosable);
        // console.log("currentMin", currentMin);
        if (toDominate.length == 0){
            if (subset.size < currentMin.size){
                const subsetCopy = new Set(subset);
                return subsetCopy;
            } else {
                return currentMin;
            }
        }
        /*
        Algorithm: branch on a vertex of choosable
        - either add the vertex to the subset (and then change choosable)
        - either not
        */

        if (choosable.length == 0){
            return currentMin;
        }

        if (subset.size +1 >= currentMin.size){
            return currentMin;
        }

        if (currentMin.size == lowerBound){
            return currentMin;
        }

        // Search for the choosable vertex which maximizes the number of newly dominated vertices
        let best: undefined | number = undefined;
        let bestCounter = -1;
        for (let i = 0; i < choosable.length; i++){
            const v = choosable[i];
            const vNeighbors = neighbors.get(v);
            if (typeof vNeighbors != "undefined"){
                let counter = 0;
                for (const x of toDominate){
                    if (vNeighbors.indexOf(x) >= 0 || x == v){
                        counter ++;
                    }
                }
                if (counter > bestCounter){
                    bestCounter = counter;
                    best = i;
                }
            }
        }
        // let best = Math.floor(Math.random()*choosable.length);
        if (typeof best == "undefined"){
            return currentMin;
        } else {
            const v = choosable[best]
            const vNeighbors = neighbors.get(v);
            // console.log("branch ", v, vNeighbors);

            if (typeof vNeighbors != "undefined"){
                const newToDominate = new Array();
                for (const x of toDominate){
                    if ( vNeighbors.indexOf(x) == -1 && x != v){
                        newToDominate.push(x);
                    }
                }

                // Update choosable
                // choosable.splice(best, 1);
                const updatedChoosable = new Array();
                for (const u of choosable){
                    if (u != v){
                        updatedChoosable.push(u);
                    }
                }
                // Insert unselected neighbors of v into updatedChoosable
                for (const neighbor of vNeighbors){
                    if (subset.has(neighbor) == false){
                        updatedChoosable.push(neighbor);
                    }
                }

                // console.log(updatedChoosable);
                // Case: take v
                // if (newToDominate.length < toDominate.length){
                    subset.add(v);
                    currentMin = this.auxMinConnectedDominatingSet(subset, newToDominate, updatedChoosable, currentMin, neighbors, lowerBound);
                    subset.delete(v);
                // }
                // Case: do not take v

                choosable.splice(best, 1);
                currentMin = this.auxMinConnectedDominatingSet(subset, toDominate, choosable, currentMin, neighbors, lowerBound);
                choosable.push(v);

                return currentMin;
            } else {
                return currentMin;
            }
        }

    }

    /**
     * @returns a distance-2 independent set
     * @algorithm random
     * @example
     * AbstractGraph.path(5).greedyLowerBoundDS().size; // = 2
     * @todo make it greedy by taking vertices that have the lowest degrees
     */
    private greedyLowerBoundDS(): Set<number>{
        let choosable = new Array();
        const subset = new Set<number>();
        for (const vId of this.vertices.keys()){
            choosable.push(vId);
        }

        while (choosable.length > 0){
            const vId = choosable.pop();
            if (typeof vId != "undefined"){
                subset.add(vId);
                const newChoosable = new Array();

                const vNeighbors = this.getNeighborsList(vId);
                for (const wId of choosable){
                    if (vNeighbors.indexOf(wId) == -1 && wId != vId){
                        const wNeighbors = this.getNeighborsList(wId);
                        let dist2 = false;
                        for (const wNeighbor of wNeighbors){
                            if (vNeighbors.indexOf(wNeighbor) >= 0){
                                dist2 = true;
                                break;
                            }
                        }
                        if (dist2 == false){
                            newChoosable.push(wId);
                        }
                    }
                }
                choosable = newChoosable;
            }
        }

        return subset;
    }

    /**
     * @returns a minimum connected dominating set if the graph is connected: it is a connected subset X of the vertices such that all vertices of the graph are in X or adjacent to a vertex of X.
     * @returns undefined if the graph is not connected
     * @example 
     * AbstractGraph.generatePath(5).minConnectedDominatingSet().size; // = 3
     * AbstractGraph.generateClique(3).minConnectedDominatingSet().size; // = 1
    */
    minConnectedDominatingSet(): Set<number> | undefined{

        // If the graph is not connected, then there is no connected dominating set
        if (this.isConnected() == false){
            return undefined;
        }

        // Compute in polynomial time a dist2 independent set
        // The size of this set gives a lower bound on the minCDS
        const dist2independentSet = this.greedyLowerBoundDS();

        // Prepare for the algorithm
        let currentMin = new Set<number>();
        const neighbors = new Map<number, Array<number>>();
        for (const vId of this.vertices.keys()){
            currentMin.add(vId);
            neighbors.set(vId, this.getNeighborsList(vId));
        }


        // Start with every vertex
        for (const startVertexId of this.vertices.keys()){
            // console.log("start vertex", startVertexId);
            const choosable = new Array<number>();
            choosable.push(startVertexId);

            const toDominate = new Array<number>();
            for (const vId of this.vertices.keys()){
                toDominate.push(vId);
            }
            // console.log(choosable);
            // console.log(currentMin);

            currentMin = this.auxMinConnectedDominatingSet(new Set(), toDominate, choosable, currentMin, neighbors, dist2independentSet.size);
        }
        console.log(currentMin);
        return currentMin;
    }

    /**
     * @returns a minimum dominating set: it is a subset X of the vertices such that all vertices of the graph are in X or adjacent to a vertex of X.
     * @example 
     * AbstractGraph.generatePath(5).minDominatingSet().size; // = 2
    */
    minDominatingSet(variant: undefined | DominationVariant): Set<number>{

        // Compute in polynomial time a dist2 independent set
        // The size of this set gives a lower bound on the minDS
        // If it is a DS, then we have found a minDS
        const dist2independentSet = this.greedyLowerBoundDS();
        let isDominating = true;
        for (const vId of this.vertices.keys()){
            let dominated = false;
            if (dist2independentSet.has(vId)){
                dominated = true;
                continue;
            }
            for (const vNeighbor of this.getNeighborsList(vId)){
                if (dist2independentSet.has(vNeighbor)){
                    dominated = true;
                    break;
                }
            }
            if (dominated == false){
                isDominating = false;
                break;
            }
        }
        if (isDominating){
            return dist2independentSet;
        }

        // Prepare for the algorithm
        const toDominate = new Array<number>();
        const allVertices = new Set<number>();
        const choosable = new Array<number>();
        const neighbors = new Map<number, Array<number>>();
        for (const vId of this.vertices.keys()){
            allVertices.add(vId);
            toDominate.push(vId);
            choosable.push(vId);
            neighbors.set(vId, this.getNeighborsList(vId));
        }
        return this.auxMinDominatingSet(new Set(), toDominate, choosable, allVertices, variant, neighbors, dist2independentSet.size);
    }


    /**
     * @returns the size of a minimum dominating set
     * @example AbstractGraph.petersen().dominationNumber(); // = 3
     */
    dominationNumber(): number {
        return this.minDominatingSet(undefined).size;
    }

    /**
     * @returns the size of a minimum independent dominating set
     * @example AbstractGraph.petersen().independentDominationNumber(); // = 3
     */
    independentDominationNumber(): number {
        return this.minDominatingSet(DominationVariant.Independent).size;
    }

    /**
     * @returns the size of a minimum connected dominating set if the graph is connected
     * @returns undefined if the graph is not connected
     * @example 
     * AbstractGraph.generatePath(5).connectedDominationNumber(); // = 3
     * AbstractGraph.petersen().connectedDominationNumber(); // = 4
     */
    connectedDominationNumber(): number | undefined {
        const cds = this.minConnectedDominatingSet();
        if (typeof cds == "undefined"){
            return undefined;
        } else {
            return cds.size;
        }
    }


    /**
     * @returns an oriented distance-2 independent set
     * @algorithm random
     * @example
     * AbstractGraph.path(5).greedyLowerBoundDS().size; // = 2
     * @todo make it greedy by taking vertices that have the lowest degrees
     */
    greedyOrientedDist2IndepSet(): Set<number>{
        let choosable = new Array();
        const subset = new Set<number>();
        for (const vId of this.vertices.keys()){
            choosable.push(vId);
        }

        while (choosable.length > 0){
            const vId = choosable.pop();
            if (typeof vId != "undefined"){
                subset.add(vId);
                const newChoosable = new Array();

                const vNeighbors = this.getClosedDistInNeighborhood(vId, 2);
                for (const wId of choosable){
                    if (vNeighbors.indexOf(wId) == -1){
                        const wNeighbors = this.getClosedDistInNeighborhood(wId, 2);
                        let dist2 = false;
                        for (const wNeighbor of wNeighbors){
                            if (vNeighbors.indexOf(wNeighbor) >= 0){
                                dist2 = true;
                                break;
                            }
                        }
                        if (dist2 == false){
                            newChoosable.push(wId);
                        }
                    }
                }
                choosable = newChoosable;
            }
        }

        return subset;
    }

    /**
     * DFVS: a subset X of the vertices such that all cycles contain a vertex of this subset.
     * Equivalently: G-X has no cycle
     * Equivalently: G-X is a DAG
     */
    minDirectedFeedbackVertexSet(): Set<number>{
        return minDFVS(this);
    }

    /**
     * 
     * @returns the minimum size of a DFVS
     * @example
     * AbstractGraph.orientedPath(5).directedFeedbackVertexSetNumber() == 0;
     * AbstractGraph.orientedCycle(3).directedFeedbackVertexSetNumber() == 1;
     * AbstractGraph.paley(7).directedFeedbackVertexSetNumber() == 4;
     */
    directedFeedbackVertexSetNumber(): number {
        return minDFVS(this).size;
    }

    /**
     * @returns a minimum quasi kernel: it is an independent subset X of the vertices such that all vertices of the digraph are at distance at most 2 to a vertex of X.
     * @remark the edges are not considered
     * @example 
     * AbstractGraph.orientedCycle(4).minQuasiKernel().size == 2;
     * @todo specific algo for the independent. Should cut branching when to adjacent vertices are taken.
    */
    minQuasiKernel(): Set<number>{

        // Compute in polynomial time a dist2 independent set
        const dist2independentSet = this.greedyOrientedDist2IndepSet();
        // Check if it is a quasi kernel
        let isDominating = true;
        for (const vId of this.vertices.keys()){
            let dominated = false;
            for (const vNeighbor of this.getClosedDistOutNeighborhood(vId,2)){
                if (dist2independentSet.has(vNeighbor)){
                    dominated = true;
                    break;
                }
            }
            if (dominated == false){
                isDominating = false;
                break;
            }
        }
        if (isDominating){
            return dist2independentSet;
        }

        // Prepare for the algorithm
        const toDominate = new Array<number>();
        const allVertices = new Set<number>();
        const choosable = new Array<number>();
        const neighborsDistAtMost2 = new Map<number, Array<number>>();
        for (const vId of this.vertices.keys()){
            allVertices.add(vId);
            toDominate.push(vId);
            choosable.push(vId);
            const vNeighborsDist2 = new Array<number>();
            const neighbors = this.getInNeighborsList(vId);
            for (const neighbor of neighbors){
                if (vNeighborsDist2.indexOf(neighbor) == -1){
                    vNeighborsDist2.push(neighbor);
                }
                for (const n2 of this.getInNeighborsList(neighbor)){
                    if (vNeighborsDist2.indexOf(n2) == -1){
                        vNeighborsDist2.push(n2);
                    }
                }
            }
            neighborsDistAtMost2.set(vId, vNeighborsDist2);
        }
        return this.auxMinDominatingSet(new Set(), toDominate, choosable, allVertices, DominationVariant.OrientedIndependent, neighborsDistAtMost2, dist2independentSet.size);
    }



    /**
     * Returns true if the graph is bipartite.
     * A graph is said to be bipartite if it is 2-colorable.
     * TODO: optimize
     */
    isBipartite(): boolean {
        return this.chromaticNumber() <= 2;
    }


    /**
     * Return true if is is possible to complete the positions of vertices so that dw(v) <= alpha(v) for every vertex.
     * 
     * NOTE: there is a ruin of cut strategy, but it was not so much better.
     * For each vertex x,
     * if the number of vertices v such that indegree(v,x) > alpha(v)
     * (where indegree(v,x) is the number of inneighbor of v which are outneighbors of x)
     * is bigger than alpha(x), then it is not possible to complete the positions.
     * Thus cut there.
     * The PROBLEM is that it is too long to compute.
     * 
     * IDEA: to improve the algorithm, use a matrix for the adjacency
     * and a stack (or a set) for the vertices that remain to position
     * 
     * @param i the number of vertices already positioned
     * @param outNeighbors not mutated
     * @param pos the position of the vertices in the order
     * @param indegree the indegree array
     * @param alpha the alpha array
     * @returns 
     */
    private auxDegreewidth( i: number, outNeighbors: Array<Set<number>>, pos: Array<number>, indegree: Array<number>, alpha: Array<number>): boolean {
        
        const n = pos.length;
        if (i == n){
            return true;
        }

        // -------------
        // With the alpha[x] 
        //-------------
        // let cont = true;
        // for (let x = 0 ; x < n ; x ++){
        //     if (pos[x] != -1) continue;
        //     let counter = 0;
        //     for (let y = 0; y < n ; y ++){
        //         if (pos[y] != -1) continue;
        //         if (outNeighbors[x].has(y)) continue;
        //         if (ind2[y][x] > alpha[y]) counter ++;
        //     }
        //     if (counter > alpha[x]){
        //         cont = false;
        //         return false;
        //     }
        // }
        




        for (let j = 0 ; j < n; j++){
            if (pos[j] == -1 && indegree[j] <= alpha[j]){
                let ok = true;
                for (let l = 0 ; l < n; l++){
                    if (pos[l] == -1 && l != j && alpha[l] == 0){
                        if (outNeighbors[j].has(l) == false){
                            ok = false;
                            break;
                        }
                    }
                } 
                if (ok){
                    // console.log("branch",i, j);
                    // Branch
                    pos[j] = i;
                    for (let l = 0 ; l < n ; l ++){
                        if (pos[l] == -1){
                            if (outNeighbors[j].has(l)){
                                indegree[l] --;
                            }
                            if (outNeighbors[l].has(j)){
                                alpha[l] --;
                            }
                        }
                    }

                    // -------------
                    // With the alpha[x] 
                    //-------------
                    // for (let x = 0 ; x < n ; x ++){
                    //     if (pos[x] == -1 && outNeighbors[x].has(j)){
                    //         for (let y = 0 ; y < n ; y ++){
                    //             if (pos[y] == -1 && outNeighbors[j].has(y)){
                    //                 ind2[y][x] --;
                    //             }
                    //         }
                    //     }
                    // }

                    // console.log(pos, indegree, alpha);
                    const r = this.auxDegreewidth( i+1, outNeighbors, pos, indegree, alpha);

                    // -------------
                    // With the alpha[x] branch cut
                    //-------------
                    // const r = this.auxDegreewidth(k, i+1, outNeighbors, pos, indegree, alpha, ind2);

                    if (r) return true;

                    // -------------
                    // With the alpha[x] branch cut
                    //-------------
                    // for (let x = 0 ; x < n ; x ++){
                    //     if (pos[x] == -1 && outNeighbors[x].has(j)){
                    //         for (let y = 0 ; y < n ; y ++){
                    //             if (pos[y] == -1 && outNeighbors[j].has(y)){
                    //                 ind2[y][x] ++;
                    //             }
                    //         }
                    //     }
                    // }

                    for (let l = 0 ; l < n ; l ++){
                        if (pos[l] == -1){
                            if (outNeighbors[j].has(l)){
                                indegree[l] ++;
                            }
                            if (outNeighbors[l].has(j)){
                                alpha[l] ++; 
                            }
                        }
                    }
                    pos[j] = -1;
                }
            }
        }

        return false;
    }

    /**
     * Return [dw, ordering] where dw is the degreewidth
     * and ordering is an optimal ordering of the vertices.
     */
    degreewidth(): [number, Array<number>] {

        const corresp = new Map<number, number>();
        const icorresp = new Array<number>();
        const indegrees = new Array<number>();
        const outNeighbors = new Array<Set<number>>();
        let minInDegree = this.vertices.size;
        const pos = new Array<number>();
        const alpha = new Array();

        let n = 0;
        for (const v of this.vertices.values()){
            corresp.set(v.index, n);
            icorresp.push(v.index);
            const indegree = this.getInNeighbors(v).length;
            indegrees.push(indegree);
            if (indegree < minInDegree) minInDegree = indegree;
            pos.push(-1);
            alpha.push(0);
            outNeighbors.push(new Set());
            n ++;
        }

        for (const link of this.links.values()){
            if (link.orientation == ORIENTATION.DIRECTED){
                const x = link.startVertex.index;
                const y = link.endVertex.index;
                const nx = corresp.get(x);
                const ny = corresp.get(y);
                if (typeof nx != "undefined" && typeof ny != "undefined"){
                    outNeighbors[nx].add(ny);
                }
            }
        }

        // For the forgotten cut strategy.

        // const ind2 = new Array<Array<number>>();
        // for (let x = 0 ; x < n ; x ++){
        //     ind2.push(new Array<number>());
        //     for (let y = 0 ; y < n ; y ++){
        //         ind2[x].push(0);
        //     }
        // }
        // for (let x = 0 ; x < n ; x ++){
        //     for (let y = 0 ; y < n ; y ++){
        //         for (const z of outNeighbors[x]){
        //             if (outNeighbors[z].has(y)) ind2[y][x] ++;
        //         }
        //     }
        // }


        // console.log(minInDegree);
        // console.log(corresp);
        // console.log(indegrees);
        // for (let i = 0 ; i < n ; i ++){
        //     console.log(`neighbors(${i})`, outNeighbors[i])
        // }
    

        for (let k = minInDegree ; k < n ; k ++){
            for (let i = 0 ; i < n ; i ++){
                alpha[i] = k;
            }
            if (this.auxDegreewidth(0, outNeighbors, pos, indegrees, alpha)){
                const ordering = new Array();
                for (let i = 0 ; i < n ; i ++){
                    ordering.push(-1);
                }
                for (let i = 0 ; i < n ; i ++){
                    ordering[pos[i]] = icorresp[i];
                }
                // console.log(cutnb, lol, cutnb/lol);
                // console.log(ordering);
                return [k, ordering];
            }
        }

        return [0,new Array()]; // Should not happen

    }



}






export class BasicGraph<V extends BasicVertexData, L extends BasicLinkData> extends Graph<V,L> {
    vertices: Map<number, BasicVertex<V>>;
    links: Map<number, BasicLink<V,L>>;

    constructor() {
        super();
        this.vertices = new Map<number, BasicVertex<V>>();
        this.links = new Map<number, BasicLink<V,L>>();
    }

    /**
     * @param rawVerticesList list of [x,y,w] where (x,y) is the position and w is the weight
     * @param rawEdgesList list of [sId, eId, w] where sId is the startVertexId, eId is the endVertexId
     * @returns a BasicGraph
     */
    static from(rawVerticesList: Array<[number,number,string]>, rawEdgesList: Array<[number, number, string]> ): BasicGraph<BasicVertexData, BasicLinkData>{
        const g = new BasicGraph<BasicVertexData, BasicLinkData>();

        for (let i = 0; i < rawVerticesList.length; i ++){
            const [x,y,w] = rawVerticesList[i];
            const v = new BasicVertex(i, new BasicVertexData(new Coord(x,y), w, "black"));
            g.vertices.set(i, v);
        }

        for (const [startId,endId,w] of rawEdgesList){
            const lId = g.getNextAvailableIndexLinks();
            const startVertex = g.vertices.get(startId);
            const endVertex = g.vertices.get(endId);
            if (typeof startVertex != "undefined" && typeof endVertex != "undefined"){
                const link = new BasicLink(lId, startVertex, endVertex, ORIENTATION.UNDIRECTED, new BasicLinkData(undefined, w, "black") )
                g.links.set(lId, link);
            }
        }

        return g;
    }


    /**
     * @returns an undirected cycle of length `n`.
     * 
     * This graph has n vertices and n edges.
     */
    static cycle(n: number){
        const rawVertices = new Array<[number, number, string]>();
        const rawLinks = new Array<[number, number, string]>();
        for (let i = 0 ; i < n ; i ++){
            rawVertices.push([Math.cos( (2*Math.PI*i) /n), Math.sin( (2*Math.PI*i) /n), ""]);
            rawLinks.push([i,(i+1)%n, ""]);
        }
        return BasicGraph.from(rawVertices, rawLinks);
    }

    /**
     * 
     * @returns Petersen graph
     * @see https://en.wikipedia.org/wiki/Petersen_graph
     */
    static petersen(){
        return BasicGraph.from(
            [[0,0,""], [0,0,""],[0,0,""] ,[0,0,""],[0,0,""],
            [0,0,""],[0,0,""],[0,0,""],[0,0,""],[0,0,""]],
            [[0,1,""],[1,2,""],[2,3,""],[3,4,""],[4,0,""],
            [5,6,""],[6,7,""],[7,8,""],[8,9,""],[9,5,""],
            [0,5,""],[1,7,""],[2,9,""],[3,6,""],[4,8,""]]
        );
    }

    /**
     * @returns an undirected cycle of length `n`.
     * 
     * This graph has n vertices and n(n-1)/2 edges.
     */
    static clique(n: number){
        const rawVertices = new Array<[number, number, string]>();
        const rawLinks = new Array<[number, number, string]>();
        for (let i = 0 ; i < n ; i ++){
            rawVertices.push([Math.cos( (2*Math.PI*i) /n), Math.sin( (2*Math.PI*i) /n), ""]);
            for (let j = 0; j < i; j ++){
                rawLinks.push([i,j, ""]);
            }
        }
        return BasicGraph.from(rawVertices, rawLinks);
    }

    /**
     * @param rawVerticesList list of [x,y,w] where (x,y) is the position and w is the weight
     * @param rawArcsList list of [sId, eId, w] where sId is the startVertexId, eId is the endVertexId
     * @returns a BasicGraph
     */
    static fromArcs(rawVerticesList: Array<[number,number,string]>, rawArcsList: Array<[number, number, string]> ): BasicGraph<BasicVertexData, BasicLinkData>{
        const g = new BasicGraph<BasicVertexData, BasicLinkData>();

        for (let i = 0; i < rawVerticesList.length; i ++){
            const [x,y,w] = rawVerticesList[i];
            const v = new BasicVertex(i, new BasicVertexData(new Coord(x,y), w, "black"));
            g.vertices.set(i, v);
        }

        for (const [startId,endId,w] of rawArcsList){
            const lId = g.getNextAvailableIndexLinks();
            const startVertex = g.vertices.get(startId);
            const endVertex = g.vertices.get(endId);
            if (typeof startVertex != "undefined" && typeof endVertex != "undefined"){
                const link = new BasicLink(lId, startVertex, endVertex, ORIENTATION.DIRECTED, new BasicLinkData(undefined, w, "black") )
                g.links.set(lId, link);
            }
        }

        return g;
    }

    static fromBasicEdgesList<V extends BasicVertexData, L extends BasicLinkData>(edgesList: Array<[number,number]>): BasicGraph<BasicVertexData,BasicLinkData>{
        const fmtEdgesList = new Array<[number,number,BasicLinkData]>();
        for (const [x,y] of edgesList){
            fmtEdgesList.push([x,y,  new BasicLinkData(undefined, "", "")]);
        }

        const g = new BasicGraph<BasicVertexData,BasicLinkData>();

        for ( const [x,y,_] of fmtEdgesList){
            if (g.vertices.has(x) == false){
                g.vertices.set(x, new BasicVertex(x, new BasicVertexData(new Coord(0,0), "", "") ));
            }
            if (g.vertices.has(y) == false){
                g.vertices.set(y, new BasicVertex(y, new BasicVertexData(new Coord(0,0), "", "") ));
            }
        }
        for ( const [indexV1,indexV2, data] of fmtEdgesList.values()){
            const newLinkIndex = g.getNextAvailableIndexLinks();
            const startVertex = g.vertices.get(indexV1);
            const endVertex = g.vertices.get(indexV2);
            if (typeof startVertex == "undefined" || typeof endVertex == "undefined") continue;
            g.links.set(newLinkIndex, new BasicLink(newLinkIndex, startVertex, endVertex, ORIENTATION.UNDIRECTED, data) )
        }

        return g;
    }


    static fromWeightedEdgesList<V extends BasicVertexData, L extends BasicLinkData>(edgesList: Array<[number,number, string]>): BasicGraph<BasicVertexData,BasicLinkData>{
        const fmtEdgesList = new Array<[number,number,BasicLinkData]>();
        for (const [x,y,w] of edgesList){
            fmtEdgesList.push([x,y,  new BasicLinkData(undefined, w, "black")]);
        }

        const g = new BasicGraph<BasicVertexData,BasicLinkData>();

        for ( const [x,y,_] of fmtEdgesList){
            if (g.vertices.has(x) == false){
                g.vertices.set(x, new BasicVertex(x, new BasicVertexData(new Coord(0,0), "", "") ));
            }
            if (g.vertices.has(y) == false){
                g.vertices.set(y, new BasicVertex(y, new BasicVertexData(new Coord(0,0), "", "") ));
            }
        }
        for ( const [indexV1,indexV2, data] of fmtEdgesList.values()){
            const newLinkIndex = g.getNextAvailableIndexLinks();
            const startVertex = g.vertices.get(indexV1);
            const endVertex = g.vertices.get(indexV2);
            if (typeof startVertex == "undefined" || typeof endVertex == "undefined") continue;
            g.links.set(newLinkIndex, new BasicLink(newLinkIndex, startVertex, endVertex, ORIENTATION.UNDIRECTED, data) )
        }

        return g;
    }


    override addVertex(vertexData: V): BasicVertex<V> {
        const index = this.getNextAvailableIndexVertex();
        const newVertex = new BasicVertex(index, vertexData);
        this.vertices.set(index, newVertex);
        return newVertex;
    }


    setLinkCp(index: number, cp: Option<Coord>){
        const link = this.links.get(index);
        if (typeof link !== "undefined"){
            link.data.cp = cp;
        }
    }


    /**
     * WARNING: UNTESTED
     * Translates the graph.
     */
    translate(shift: Vect){
        for(const [index, vertex] of this.vertices){
            vertex.translate(shift)
        }
        for(const [index, link] of this.links){
            if (typeof link.data.cp !== "undefined"){
                link.data.cp.translate(shift);
            }
        }
    }



    verticesContaintedByArea<A extends Area>(area: A): Set<number>{
        const set = new Set<number>();
        this.vertices.forEach((vertex,vertex_index)=> {
            if (area.is_containing(vertex)){
                set.add(vertex_index);
            }
        })
        return set;
    }

    translateVertices(indices: Iterable<number>, shift: Vect) {
        for (const index of indices) {
            const vertex = this.vertices.get(index);
            if (typeof vertex !== "undefined") {
                const previous_pos = vertex.data.getPos().copy();
                vertex.data.getPos().translate(shift);
                const new_pos = vertex.data.getPos().copy();

                for (const [link_index, link] of this.links.entries()) {
                    if (link.startVertex.index == index) {
                        const end_vertex = this.vertices.get(link.endVertex.index);
                        if (typeof end_vertex !== "undefined"){
                            link.transformCP(new_pos, previous_pos, end_vertex.data.getPos());
                        }
                    } else if (link.endVertex.index == index) {
                        const start_vertex = this.vertices.get(link.startVertex.index);
                        if (typeof start_vertex !== "undefined"){
                            link.transformCP(new_pos, previous_pos, start_vertex.data.getPos());
                        }
                    }
                }
            }
        }
    }


    /**
     * !!!!!!!!!!!!!!!!!!!!! DOES NOT WORK
     * it creates Link and not BasicLink
     * TODO: change this by adding a creation function in the arguements like in complete in tournament
     * 
     * 
     * Warning: UNTESTED
     * @param c1 a corner from the rectangle
     * @param c2 the opposite corner
     * @returns the subgraph of this formed by the vertices contained in the rectangle. The links between these vertices are kept.
     * These links could go out of the rectangle if they are bended.
     * Vertices and links are not copied, so any modification on these elements affect the original graph.
     */
    getSubgraphFromRectangle(c1: Coord, c2: Coord): BasicGraph<V,L>{
        const newGraph = new BasicGraph<V,L>();
    
        for (const [index,vertex] of this.vertices.entries()){
            if (vertex.isInRectangle(c1,c2)){
                newGraph.setVertex(index,vertex.data);
            }
        }
        for (const [index,link] of this.links.entries()){
            if (newGraph.vertices.has(link.startVertex.index) && newGraph.vertices.has(link.endVertex.index)){
                newGraph.setLink(index, link.startVertex.index, link.endVertex.index, link.orientation, link.data);
            }
        }
        return newGraph;
    }


    /**
     * Resets the edges of the graph so that they respect the Delaunay adjacency rule.
     */
    resetDelaunayGraph(linkConstructor: (i: number, j: number) => L){
        this.links.clear();

        for (const [i1, v1] of this.vertices){
            for (const [i2, v2] of this.vertices){
                for (const [i3, v3] of this.vertices){
                    if ( !( (i1 < i2 && i2 < i3) || (i1 > i2 && i2 > i3) )){
                        continue;
                    }
                    // Check if the points are in counterclowise order.
                    if ( (v2.getPos().x - v1.getPos().x)*(v3.getPos().y-v1.getPos().y)-(v3.getPos().x -v1.getPos().x)*(v2.getPos().y-v1.getPos().y) <= 0){
                        // console.log("not ccw", i1, i2, i3);
                        continue;
                    }
                    // console.log("ccw", i1, i2, i3);

                    let isPointInside = false;
                    for (const [i4,v4] of this.vertices){
                       if( i1 != i4 && i2 != i4 && i3 != i4){
                            const mat = 
                            [[v1.getPos().x, v1.getPos().y, v1.getPos().x**2 + v1.getPos().y**2, 1],
                             [v2.getPos().x, v2.getPos().y, v2.getPos().x**2 + v2.getPos().y**2, 1],
                             [v3.getPos().x, v3.getPos().y, v3.getPos().x**2 + v3.getPos().y**2, 1],
                             [v4.getPos().x, v4.getPos().y, v4.getPos().x**2 + v4.getPos().y**2, 1]];
                            if (det(mat) > 0){
                                isPointInside = true;
                                break;
                            }
                        }
                    }
                    if (isPointInside == false){
                        this.addLink(i1,i2, ORIENTATION.UNDIRECTED, linkConstructor(i1,i2));
                        this.addLink(i1,i3, ORIENTATION.UNDIRECTED, linkConstructor(i1,i2));
                        this.addLink(i2,i3, ORIENTATION.UNDIRECTED, linkConstructor(i1,i2));
                    }
                }
            }
        }
    }


    




    // TODO consider cubic bezier
    // The drawing of a graph is said to be planar if no link intersect another link
    // Return true iff the drawing is planar
    // How it works:
    // Considering two links, if both have no control points, then we check if the straight segments between the endpoints have an intersection with the is_segments_intersection
    // If both have cps, then ???
    // If only one has a cp then ???
    isDrawingPlanar(): boolean{
        return this.crossings(true).length == 0;
    }

    /**
     * A crossing is pair of links whose curves intersect.
     * @param stopAtFirst if a crossing is detected then it is immediately returned
     * @returns a list of the indices of the crossings
     * @todo improve bezier curve intersection
     */
    crossings(stopAtFirst?: boolean): Array<[number, number]>{
        const stop = typeof stopAtFirst == "undefined" ? false : stopAtFirst; 
        const crossings = new Array();

        for (const [linkId1, link1] of this.links) {
            const v1 = link1.startVertex as BasicVertex<V>;
            const w1 = link1.endVertex as BasicVertex<V>;
            let z1 = v1.getPos().middle(w1.getPos());
            if (typeof link1.data.cp != "undefined"){
                z1 = link1.data.cp;
            }
            for (const [linkId2, link2] of this.links) {
                if ( linkId2 < linkId1){
                    const v2 = link2.startVertex as BasicVertex<V>;
                    const w2 = link2.endVertex as BasicVertex<V>;
                    let is_intersecting = false;
                    let z2 = v2.getPos().middle(w2.getPos());
                    // TODO: faster algorithm for intersection between segment and bezier
                    if (typeof link2.data.cp != "undefined"){
                        z2 = link2.data.cp;
                        is_intersecting = is_quadratic_bezier_curves_intersection(v1.getPos(), z1, w1.getPos(), v2.getPos(), z2, w2.getPos());
                    }
                    else {
                        if (typeof link1.data.cp == "undefined"){
                            is_intersecting = typeof segmentsInteriorIntersection(v1.getPos(), w1.getPos(), v2.getPos(), w2.getPos()) != "undefined"
                        } else {
                            is_intersecting = is_quadratic_bezier_curves_intersection(v1.getPos(), z1, w1.getPos(), v2.getPos(), z2, w2.getPos());
                        }
                    }
    
                    if (is_intersecting){
                        crossings.push([linkId1, linkId2]);
                        if (stop){
                            return crossings;
                        }
                    }
                }
            }
        }
        return crossings;
    }


    /**
     * @returns the number of crossings of the graph.
     */
    crossingNumber(): number {
        return this.crossings().length;
    }


    /**
     * Subdivide links from linksIndices into k+1 links (rectilinear, with the same color, weight = "").
     * @param linksIndices 
     * @param k >= 1, number of vertices inserted between each links.
     * @param vertexDefault vertex default constructor
     * @param linkDefault link default constructor
     */
    subdivideLinks(linksIndices: Set<number>, k: number, 
        vertexDefault: (index: number, pos: Coord) => BasicVertex<V>,
        linkDefault: (index: number, orientation: ORIENTATION, color: string, startVertex: BasicVertex<V>, endVertex: BasicVertex<V>) => BasicLink<V,L>){
        
        
        for (const linkId of linksIndices){
            const link = this.links.get(linkId);
            if (typeof link != "undefined"){

                // Create k vertices and k links
                let previousVertex = link.startVertex;
                for (let i = 0 ; i < k ; i ++){
                    const bezierPoints = typeof link.data.cp == "undefined" ? 
                    [link.startVertex.getPos(), link.endVertex.getPos()] :
                    [link.startVertex.getPos(), link.data.cp, link.endVertex.getPos()];
                    const vertexPos = bezier_curve_point(i/k, bezierPoints);
                    const newVertexId = this.getNextAvailableIndexVertex();
                    const v = vertexDefault(newVertexId, vertexPos);
                    this.vertices.set(newVertexId, v);

                    const newLinkId = this.getNextAvailableIndexLinks();
                    const newLink = linkDefault(newLinkId, link.orientation, link.data.color, previousVertex, v);
                    this.links.set(newLinkId, newLink);
                    
                    previousVertex = v;
                }

                const newLinkId = this.getNextAvailableIndexLinks();
                const newLink = linkDefault(newLinkId, link.orientation, link.data.color, previousVertex, link.endVertex);
                this.links.set(newLinkId, newLink);

                // Delete link
                this.links.delete(link.index);

            }
        }

    }

    /**
     * for every vertex of vertices_indices
     * add arcs between these vertices according to their x-coordinate
     */
    completeSubgraphIntoTournament(vertices_indices: Iterable<number>, arcDefault: (index: number, startVertex: BasicVertex<V>, endVertex: BasicVertex<V>) => BasicLink<V,L>){
        for (const index1 of vertices_indices){
            const v1 = this.vertices.get(index1);
            if ( typeof v1 === "undefined"){
                continue;
            }
            for (const index2 of vertices_indices){
                const v2 = this.vertices.get(index2);
                if ( typeof v2 === "undefined"){
                    continue;
                }
                if (index1 < index2 ){
                    if ( v1.getPos().x < v2.getPos().x ){
                        if( this.hasArc(index1, index2) == false && this.hasArc(index2, index1) == false){
                            const arcIndex = this.getNextAvailableIndexLinks();
                            const newArc = arcDefault(arcIndex, v1, v2);
                            this.links.set(arcIndex, newArc);
                        }
                    } else {
                        if( this.hasArc(index1, index2) == false && this.hasArc(index2, index1) == false){
                            const arcIndex = this.getNextAvailableIndexLinks();
                            const newArc = arcDefault(arcIndex, v2, v1);
                            this.links.set(arcIndex, newArc);
                        }
                    }
                }
                
            }
        }
    }

    /**
     * The radius of the graph is the minimum `d` such that there exists a vertex v such that for every vertex w, d(v,w) <= d.
     * Such a v is called a center.
     * @returns [radius, centerIndex] 
     */
    radius(weights: undefined | Map<number, number>): [number, number] {
        const {distances, next} = this.FloydWarshall(weights);
        let currentMinRadius = Infinity;
        let currentCenter = 0;
        for (const v of this.vertices.values()){
            const distancesToV = distances.get(v.index);
            if (typeof distancesToV != "undefined"){
                let maxDist = 0;
                for (const w of this.vertices.values()){
                    const distVW = distancesToV.get(w.index);
                    if (typeof distVW != "undefined"){
                        if ( distVW > maxDist){
                            maxDist = distVW;
                        }
                        if (maxDist > currentMinRadius){
                            break;
                        }
                    }
                }
                if (maxDist < currentMinRadius){
                    currentMinRadius = maxDist;
                    currentCenter = v.index;
                }
            }
        }
        return [currentMinRadius, currentCenter];
    }


    /**
     * @returns the distances between each pair of vertices. 
     * @next next.get(u).get(v) is the adjacent vertex of u to go to v.
     * It uses the algorithm of Floyd-Warshall.
     * @param weights if undefined, the weigth of an edge `e` is 1 if `e.weight == ""` or `parseFloat(e.weight)`. Otherwise use the values of the map `weights` for the weights.
     */
    FloydWarshall( weights: undefined | Map<number, number>) {
        // TODO try to implement it with a matrix
        const dist = new Map<number, Map<number, number>>();
        const next = new Map<number, Map<number, number>>();

        for (const vIndex of this.vertices.keys()) {
            const distFromV = new Map<number, number>();
            const nextFromV = new Map<number, number>();
            for (const uIndex of this.vertices.keys()) {
                if (vIndex === uIndex) {
                    distFromV.set(vIndex, 0);
                    nextFromV.set(vIndex, vIndex);
                }
                else {
                    distFromV.set(uIndex, Infinity);
                    nextFromV.set(uIndex, Infinity);
                }
            }
            dist.set(vIndex, distFromV);
            next.set(vIndex, nextFromV);
        }

        for (const [linkIndex, link] of this.links) {
            let weight = 1;
            if (typeof weights == "undefined") {
                if (link.getWeight() == ""){
                    weight = 1;
                } else {
                    weight = parseFloat(link.getWeight());
                }
            } else {
                const w = weights.get(linkIndex);
                if (typeof w != "undefined"){
                    weight = w;
                }
            }
            if (link.orientation == ORIENTATION.UNDIRECTED){
                dist.get(link.startVertex.index)?.set(link.endVertex.index, weight);
                dist.get(link.endVertex.index)?.set(link.startVertex.index, weight);
    
                next.get(link.startVertex.index)?.set(link.endVertex.index, link.endVertex.index);
                next.get(link.endVertex.index)?.set(link.startVertex.index, link.startVertex.index);
            } else {
                dist.get(link.startVertex.index)?.set(link.endVertex.index, weight);
                next.get(link.startVertex.index)?.set(link.endVertex.index, link.endVertex.index);
            }
            
        }

        for (const kIndex of this.vertices.keys()) {
            const distFromK = dist.get(kIndex);
            if (typeof distFromK == "undefined") continue;
            for (const iIndex of this.vertices.keys()) {
                const distFromI = dist.get(iIndex);
                if (typeof distFromI == "undefined") continue;
                for (const jIndex of this.vertices.keys()) {
                    const dij = distFromI.get(jIndex);
                    const dik = distFromI.get(kIndex);
                    const dkj = distFromK.get(jIndex);
                    if (typeof dij == "undefined" || typeof dik == "undefined" || typeof dkj == "undefined" ) continue;

                    if (dij > dik + dkj) {
                        // console.log(`shortcut from ${iIndex} to ${jIndex} via ${kIndex}`, dij, dik, dkj);
                        distFromI.set(jIndex, dik + dkj);
                        const nextFromI = next.get(iIndex);
                        if (typeof nextFromI != "undefined"){
                            const nextFromItoK = nextFromI.get(kIndex);
                            if (typeof nextFromItoK != "undefined"){
                                nextFromI.set(jIndex, nextFromItoK);
                            }
                        }
                    }
                }
            }
        }

        return { distances: dist, next: next };

    }


    /**
     * @returns a geodesic (or shortest path) of maximal weight and its weight
     * @param weights if provided, it tells the shortest path computer to use the given weights. Otherwise it will use the weights of the links or 1 if a link has no weight.
     * @example BasicGraph.cycle(5).longestGeodesic(undefined)[1]; // == 2
     */
    longestGeodesic(weights: undefined | Map<number, number>): [Array<number>, number]{
        const f = this.FloydWarshall(weights);
        let maxDist = 0;
        const longestPath = new Array();

        for (const [vIndex, distFromV] of f.distances.entries()){
            for (const [uIndex, d] of distFromV.entries()){
                if (d > maxDist){
                    maxDist = d;

                    longestPath.splice(0, longestPath.length);
                    let currentId = vIndex;
                    if (d == Infinity) {
                        return [[uIndex, vIndex],d];
                    }
                    while (currentId != uIndex){
                        longestPath.push(currentId);
                        const r = f.next.get(currentId)?.get(uIndex);
                        if (typeof r != "undefined"){
                            currentId = r;
                        } else {
                            break;
                        }
                    }
                    longestPath.push(uIndex);
                }
            }
        }
        return [longestPath, maxDist];
    }

    /**
     * 
     * @returns the diameter of the graph which is the maximal length (or the maximal weight if weights are considered) of a shortest path in the graph.
     * @param weights if provided, it tells the shortest path computer to use the given weights. Otherwise it will use the weights of the links or 1 if a link has no weight.
     * @example BasicGraph.cycle(5).diameter(); // == 2
     * @example BasicGraph.clique(4).diameter(); // == 1
     */
    diameter(weights: undefined | Map<number, number>): number{
        return this.longestGeodesic(weights)[1];
    }




    
    /**
     * Compute a minimum spanning tree using Kruskal algorithm
     * https://en.wikipedia.org/wiki/Kruskal%27s_algorithm.
     * Return the weight of the spanning tree and the list of the edges of the tree.
     * @note if weight of edge is "" or cannot be parsed into a float, then weight is set to 1
     * @note it only considers edges
     */
    minimumSpanningTree(): [number, Array<Link<V,L>>] {
        const edges = new Array<[Link<V,L>,number]>();
        for (const link of this.links.values()){
            if (link.orientation == ORIENTATION.UNDIRECTED){
                const parsedWeight = parseFloat(link.getWeight());
                const weight = isNaN(parsedWeight) ? 1 : parsedWeight;
                edges.push([link, weight]);
            }
        }
        edges.sort(([e,w],[e2,w2]) => w-w2);

        const component = new Map<number,number>();
        for (const index of this.vertices.keys()){
            component.set(index, index);
        }

        let treeWeight = 0;
        const treeEdges = new Array<Link<V,L>>();
        for (const edge of edges){
            const c1 = component.get(edge[0].startVertex.index);
            const c2 = component.get(edge[0].endVertex.index);
            if (typeof c1 == "undefined" || typeof c2 == "undefined") continue;
            if ( c1 != c2 ){
                treeEdges.push(edge[0]);
                treeWeight += edge[1];
                for (const [vindex, c] of component.entries()){
                    if (c == c1){
                        component.set(vindex, c2);
                    }
                }
            }else {
            }
        }
        return [treeWeight, treeEdges];
    }


    /**
     * Sets all weights of links to the euclidian distance between vertices.
     * TODO: generalize to other distances.
     */
        setEuclidianLinkWeights() {
            for (const link of this.links.values()){
                const v1 = this.vertices.get(link.startVertex.index);
                const v2 = this.vertices.get(link.endVertex.index);
                if (typeof v1 !== "undefined" && typeof v2 !== "undefined"){
                    const d = v1.distTo(v2);
                    link.setWeight(String(d));
                }
            }
        }
    

    /**
     * Returns the stretch of the graph.
     * The stretch is defined as the maximal stretch between pairs of vertices.
     * The stretch of a pair of vertices is defined as the ratio between the euclidian distance in the graph between them and the euclidian distance between them.
     * @returns 1 if there is 1 vertex or less and the shortestPath maximizing the stretch.
     */
    stretch(): [number, Array<number>]{
        if (this.vertices.size <= 1) return [1, new Array()];

        const euclidianDist = new Map<number, number>();
        for (const link of this.links.values()){
            euclidianDist.set(link.index, link.startVertex.distTo(link.endVertex));
        }

        const data = this.FloydWarshall(euclidianDist);
        const distances = data.distances;

        let shortestPath = new Array();
        let maxStretch: number = 1;
        for (const [indexV1, v1] of this.vertices){
            for (const [indexV2, v2] of this.vertices){
                if (indexV1 != indexV2){
                    const v1distances = distances.get(indexV1);
                    if (v1distances){
                        const graphDist = v1distances.get(indexV2);
                        if (graphDist){
                            const stretch = graphDist / v1.distTo(v2);
                            if ( stretch >= maxStretch ){
                                shortestPath.splice(0, shortestPath.length);
                                if (stretch == Infinity){
                                    shortestPath.push(indexV1, indexV2);
                                } else {
                                    let currentId = indexV1;
                                    while (currentId != indexV2){
                                        shortestPath.push(currentId);
                                        const r = data.next.get(currentId)?.get(indexV2);
                                        if (typeof r != "undefined"){
                                            currentId = r;
                                        } else {
                                            break;
                                        }
                                    }
                                    shortestPath.push(indexV2);
                                }

                                maxStretch = stretch;
                            }
                        }
                    }
                }
            }
        }
        return [maxStretch, shortestPath];
    }


   
} 



