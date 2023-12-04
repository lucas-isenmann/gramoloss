import { BasicLink, Link, ORIENTATION } from './link';
import { BasicVertex, Vertex } from './vertex';
import { Coord, Vect } from './coord';
import { Area } from './area';
import { det, is_quadratic_bezier_curves_intersection, is_segments_intersection } from './utils';
import { Option } from "./option";
import { BasicLinkData, BasicVertexData, Geometric, Weighted } from './traits';

export enum ELEMENT_TYPE {
    VERTEX = "VERTEX",
    LINK = "LINK",
    STROKE = "STROKE",
    AREA = "AREA"
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
                g.set_vertex(x, vertexConstructor());
            }
            if (g.vertices.has(y) == false){
                g.set_vertex(y, vertexConstructor());
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
            g.set_vertex(index, data);
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
    //             g.set_vertex(x,vertex_default(x));
    //         }
    //         if (indices.has(y) == false){
    //             indices.add(y);
    //             g.set_vertex(y,vertex_default(y));
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
    //             g.set_vertex(x,vertex_default(x));
    //         }
    //         if (indices.has(y) == false){
    //             indices.add(y);
    //             g.set_vertex(y,vertex_default(y));
    //         }
    //         const link = arc_default(x,y,"");
    //         g.addLink(link);
    //     }

        
    //     return g;
    // }



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

    




    get_next_n_available_vertex_indices(n: number): Array<number> {
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

    get_next_available_index_links() {
        let index = 0;
        while (this.links.has(index)) {
            index += 1;
        }
        return index;
    }

    get_next_n_available_link_indices(n: number): Array<number> {
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

    /**
     * SHOULD BE REMOVED
     * index should be in the vertex
     */
    get_index(v: Vertex<V>) {
        for (let [index, vertex] of this.vertices.entries()) {
            if (vertex === v) {
                return index;
            }
        }
        return;
    }

    get_next_available_index_vertex() {
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
        const index = this.get_next_available_index_vertex();
        const newVertex = new Vertex(index, vertexData);
        this.vertices.set(index, newVertex);
        return newVertex;
    }

    set_vertex(index: number, vertexData: V): Vertex<V> {
        const newVertex = new Vertex(index, vertexData);
        this.vertices.set(index, newVertex);
        return newVertex;
    }

    has_link(index_start: number,index_end: number, orientation: ORIENTATION): boolean{
        for (const link of this.links.values()){
            if (link.signatureEquals(index_start, index_end, orientation)){
                return true;
            }
        }
        return false;
    }

    has_arc(index_start: number, index_end: number): boolean {
        return this.has_link(index_start, index_end, ORIENTATION.DIRECTED);
    }

    check_link(link: Link<V,L>): boolean {
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
        const index = this.get_next_available_index_links();
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
        if (this.check_link(newLink) == false) {
            return undefined;
        }
        this.links.set(linkIndex, newLink);
        return newLink;
    }






    /**
     * Returns the list of the neighbors indices of a vertex.
     */
    get_neighbors_list(vertexIndex: number): Array<number> {
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



    get_neighbors_list_excluding_links(i: number, excluded: Set<number>): Array<number> {
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

    get_out_neighbors_list(i: number): Array<number> {
        let neighbors = new Array<number>();
        for (let e of this.links.values()) {
            if (e.orientation == ORIENTATION.DIRECTED) {
                if (e.startVertex.index == i) {
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
                    neighbors.push(link.endVertex);
                }
            }
        }
        return neighbors;
    }



    get_in_neighbors_list(i: number): Array<number> {
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

    delete_vertex(vertex_index: number) {
        this.vertices.delete(vertex_index);

        this.links.forEach((link, link_index) => {
            if (link.endVertex.index === vertex_index || link.startVertex.index === vertex_index) {
                this.links.delete(link_index);
            }
        })
    }

    delete_link(link_index: number) {
        this.links.delete(link_index);
    }



    clear() {
        this.vertices.clear();
        this.links.clear();
    }

    



    




    get_degrees_data() {
        if (this.vertices.size == 0) {
            return { min_value: 0, min_vertices: null, max_value: 0, max_vertices: null, avg: 0 };
        }

        const index_first = this.vertices.keys().next().value;
        let min_indices = new Set([index_first]);
        let min_degree = this.get_neighbors_list(index_first).length;
        let max_indices = new Set([index_first]);
        let max_degree = this.get_neighbors_list(index_first).length;
        let average = 0.0;

        for (const v_index of this.vertices.keys()) {
            const neighbors = this.get_neighbors_list(v_index);
            if (min_degree > neighbors.length) {
                min_degree = neighbors.length;
                min_indices = new Set([v_index]);
            }
            if (min_degree === neighbors.length) {
                min_indices.add(v_index);
            }

            if (max_degree < neighbors.length) {
                max_degree = neighbors.length;
                max_indices = new Set([v_index]);
            }
            if (max_degree === neighbors.length) {
                max_indices.add(v_index);
            }

            average += neighbors.length;
        }

        average = average / this.vertices.size;

        return { min_value: min_degree, min_vertices: min_indices, max_value: max_degree, max_vertices: max_indices, avg: average };
    }

    // return maximum (undirected) degree of the graph
    // return -1 if there is no vertex
    max_degree(): number{
        let record = -1;
        for ( const v_index of this.vertices.keys()){
            let degree = this.get_neighbors_list(v_index).length;
            if ( degree > record ){
                record = degree;
            }
        }
        return record;
    }

    // return minimum indegree of the graph
    // return "" if there is no vertex
    min_indegree(): number | string{
        let record: number | string = "";
        for ( const v_index of this.vertices.keys()){
            let indegree = this.get_in_neighbors_list(v_index).length;
            if (typeof record == "string"){
                record = indegree;
            } else if ( indegree < record ){
                record = indegree;
            }
        }
        return record;
    }

    // return minimum outdegree of the graph
    // return "" if there is no vertex
    min_outdegree(): number | string{
        let record: number | string = "";
        for ( const v_index of this.vertices.keys()){
            let indegree = this.get_out_neighbors_list(v_index).length;
            if (typeof record == "string"){
                record = indegree;
            } else if ( indegree < record ){
                record = indegree;
            }
        }
        return record;
    }


     DFS_recursive( v_index: number, visited: Map<number, boolean>) {
        visited.set(v_index, true);
        const neighbors = this.get_neighbors_list(v_index);

        for (const u_index of neighbors) {
            if (visited.has(u_index) && !visited.get(u_index)) {
                this.DFS_recursive( u_index, visited);
            }
        }
    }

    DFS_iterative( v_index: number) {
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
                const neighbors = this.get_neighbors_list(u_index);
                for (const n_index of neighbors) {
                    S.push(n_index);
                }
            }
        }

        return visited;
    }

    has_cycle(): boolean {
        let ok_list = new Set();
        let g = this;

        function _has_cycle(d: number, origin: number, s: Array<number>): boolean {
            for (const v of g.get_neighbors_list(d)) {
                if (v == origin || ok_list.has(v)) {
                    continue;
                }
                if (s.indexOf(v) > -1) {
                    return true;
                }
                s.push(v);
                let b = _has_cycle(v,d, s)
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
            if (_has_cycle(v,-1, [v])) {
                return true;
            }
        }
        return false;
    }

    // iterative version of has_cycle
    // seems better on trees
    has_cycle2(): boolean {
        let visited = new Set();
        for (const v of this.vertices.keys()) {
            if ( visited.has(v) == false){
                let stack = new Array();
                stack.push(v);
                let last = -1;
                while (stack.length > 0){
                    const u_index = stack.pop();
                    if (visited.has(u_index)){
                        return true;
                    }
                    visited.add(u_index);
                    
                    const neighbors = this.get_neighbors_list(u_index);
                    for (const n_index of neighbors) {
                        if ( n_index != last ){
                            stack.push(n_index);
                            last = u_index;
                        }
                    }
                }
            }
        }
        return false;
    }

    has_directed_cycle():boolean {
        let ok_list = new Set();
        let g = this;
        
        function _has_directed_cycle(d: number, s: Array<number>): boolean {
            for (const v of g.get_out_neighbors_list(d)) {
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
    size_connected_component_of(vindex: number): number {
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
                const neighbors = this.get_neighbors_list(u_index);
                for (const n_index of neighbors) {
                    
                    stack.push(n_index);
                }
            }
        }
    
        return counter;
    }


    size_connected_component_excluding_links(vindex: number, excluded: Set<number>): number {
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
                const neighbors = this.get_neighbors_list_excluding_links(u_index, excluded);
                for (const n_index of neighbors) {
                    stack.push(n_index);
                }
            }
        }
    
        return counter;
    }

    // compute the size of the connected component of vertex of index "vindex"
    // return 0 if vindex is not a vertex index
    get_connected_component_of(vindex: number): Graph<V,L> {
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
            g.set_vertex(u.index, u.data);
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

    // return a cut edge which maximizes the minimum of the size of the connected components of its endvertices
    // return -1 if there is no cut edge 
    max_cut_edge(){
        const n = this.vertices.size;
        let record = 0;
        let record_link_index = -1;
        for ( const [link_index, link] of this.links.entries()){

            const n1 = this.size_connected_component_excluding_links(link.startVertex.index, new Set([link_index]));
            if (n1 < n ){
                const n2 = this.size_connected_component_excluding_links(link.endVertex.index, new Set([link_index]));
                const m = Math.min(n1,n2);
                if ( m > record){
                    record = m;
                    record_link_index = link_index;
                }
            }
        }
        return record_link_index;
    }
    

    is_connected(): boolean {
        if (this.vertices.size < 2) {
            return true;
        }
    
        const indices = Array.from(this.vertices.keys());
        const visited = new Map();
        for (const index of this.vertices.keys()) {
            visited.set(index, false);
        }
    
        this.DFS_recursive( indices[0], visited);
    
        for (const is_visited of visited.values()) {
            if (!is_visited) {
                return false;
            }
        }
        return true;
    }

    
    // Kosaraju's algorithm: https://en.wikipedia.org/wiki/Kosaraju's_algorithm
    strongly_connected_components(): Array<Array<number>> {
	    const graph = this;
	    let scc: Array<Array<number>> = Array(); // Strongly Connected Components
	    var stack = Array();
	    var visited = new Set();

	    const visit_fn = function (cur: number) {
		if (visited.has(cur)) return;
		visited.add(cur);
		for (const neigh of graph.get_out_neighbors_list(cur)) {
			visit_fn(neigh);
		}
		stack.push(cur);
	    }

	    for (const key of this.vertices.keys()) {
		    visit_fn(key);
	    } // O(n) due to caching

            let assigned = new Set();
	    
	    const assign_fn = function (cur: number) {
		if (!assigned.has(cur)) {
		    assigned.add(cur);
		    let root_stack = scc.pop();
		    root_stack.push(cur);
		    scc.push(root_stack);
		    for (const neigh of graph.get_in_neighbors_list(cur)) {
		        assign_fn(neigh);
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
    //         newGraph.set_vertex(index, vertex.data.clone());
    //     }
    //     for(const [index, link] of this.links){
    //         newGraph.setLink(index, link.data.clone());
    //     }
    //     return newGraph;
    // }





    /**
     * Returns the chromatic number of the graph.
     * The chromatic number is the minimum integer k such that there exists a proper coloring with k colors.
     * What happens with arcs? I dont know. TODO
     */
    // chromatic_number() : number {
    //     let k = 1;
    //     const n = this.vertices.size;

    //     while (true){
    //         const color = new Array();
    //         const indices = new Map();
    //         let j = 0;
    //         for ( const index of this.vertices.keys()){
    //             color.push(0);
    //             indices.set(index,j);
    //             j ++;
    //         }
    //         while (true){
    //             let i = n-1;
    //             while (i >= 0 && color[i] == k-1){
    //                 color[i] = 0;
    //                 i --;
    //             }
    //             if ( i == -1 ){ // every color was set to k-1
    //                 break;      // all assignements have been tried
    //             }
    //             color[i] ++;
    //             // else next color assignement
    //             // check it
    //             let is_proper_coloring = true;
    //             for (const link of this.links.values()){
    //                 if ( link.orientation == ORIENTATION.UNDIRECTED){
    //                     if( color[indices.get(link.startVertex.index)] == color[indices.get(link.endVertex.index)]){
    //                         is_proper_coloring = false;
    //                         break;
    //                     }
    //                 }
    //             }
    //             if (is_proper_coloring){
    //                 return k;
    //             }
    //         }
    //         k += 1;
    //     }
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
                        for( const color of possibleColors.get(vId)){
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
            for (const color of possib){
                coloring.set(minId, color);
                const modified = new Array();
                for (const neighbor of neighbors.get(minId)){
                    const set = possibleColors.get(neighbor.index);
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
                    const set = possibleColors.get(modifiedNeigborId);
                    set.add(color);
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
    chromatic_number(cliques?: Set<Set<number>>): number {
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
                    const set = possibleColors.get(neighbor.index);
                    set.delete(i);
                }
                i ++;
            }

            if (this.auxChroma(k, coloring, possibleColors, neighbors, cliques)) return coloring;
            k += 1;
        }
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
    }


    
    /**
     * Compute the vertex cover number of the graph.
     * It is the minimum integer k such that there exists a subset X of the vertices which is of size k and such that every edge is incident to at least one vertex of X.
     * TODO: optional parameter m: asserts that the result it at least m
     * TODO: return a certificate that it has a k-vertex-cover
     * TODO: better algorithm than the backtract way
     */
    vertex_cover_number(): number {
        const n = this.vertices.size;
        let record = n;

        const selection = new Array<boolean>();
        const indices = new Map();
        let j = 0;
        for ( const index of this.vertices.keys()){
            selection.push(false);
            indices.set(index,j);
            j ++;
        }

        while (true){
            let i = n-1;
            while (i >= 0 && selection[i]){
                selection[i] = false;
                i --;
            }
            if ( i == -1 ){
                break;      // all assignements have been tried
            }
            selection[i] = true;
            // else next selection
            // check it
            let is_vertex_cover = true;
            for (const link of this.links.values()){
                if ( link.orientation == ORIENTATION.UNDIRECTED){
                    if( !selection[indices.get(link.startVertex.index)] && !selection[indices.get(link.endVertex.index)]){
                        is_vertex_cover = false;
                        break;
                    }
                }
            }
            if (is_vertex_cover){
                let count = 0;
                for (const v of selection){
                    if (v) {
                        count ++;
                    }
                }
                if (count < record){
                    record = count;
                }
            }
        }

        return record;
    }
        
    // Compute the clique number of the graph.
    // It is the minimum integer k such that there exists a subset X of the vertices which is a clique.
    // TODO: optional parameter m: asserts that the result it at least m
    // TODO: return a certificate that it has a k-vertex-cover
    // TODO: better algorithm than the backtract way
    clique_number(): number {
        const n = this.vertices.size;
        let record = 0;

        const selection = new Array<boolean>();
        const indices = new Map();
        const reverse_indices = new Map<number, number>();
        let j = 0;
        for ( const index of this.vertices.keys()){
            selection.push(false);
            indices.set(index,j);
            reverse_indices.set(j,index);
            j ++;
        }

        while (true){
            let i = n-1;
            while (i >= 0 && selection[i]){
                selection[i] = false;
                i --;
            }
            if ( i == -1 ){
                break;      // all assignements have been tried
            }
            selection[i] = true;
            // else next selection
            // check it
            let is_clique = true;
            let selected_indices = new Set<number>();
            for (const [key,is_selected] of selection.entries()){
                 if (is_selected){
                    const index = reverse_indices.get(key);
                    if (typeof index !== "undefined"){
                        for (const index2 of selected_indices.values()){
                            if (!this.has_link(index, index2, ORIENTATION.UNDIRECTED)){
                                is_clique = false;
                            }
                        }
                        selected_indices.add(index);
                    } else {
                        console.log("bug");
                    }
                 }
            }
            
            if (is_clique){
                let count = 0;
                for (const v of selection){
                    if (v) {
                        count ++;
                    }
                }
                if (count > record){
                    record = count;
                }
            }
        }

        return record;
    }





    /**
     * Returns true if the graph is bipartite.
     * A graph is said to be bipartite if it is 2-colorable.
     * TODO: optimize
     */
    isBipartite(): boolean {
        return this.chromatic_number() <= 2;
    }





}




export class AbstractGraph extends Graph<void,void> {

    constructor(){
        super();
    }

    static fromEdgesListDefault(edgesList: Array<[number,number]>): AbstractGraph{
        const fmtEdgesList = new Array<[number,number,void]>();
        for (const [x,y] of edgesList){
            fmtEdgesList.push([x,y,null]);
        }
        const g = Graph.fromEdgesList(fmtEdgesList, () => {return});
        return g as AbstractGraph;
    }

    static fromArcsListDefault(arcsList: Array<[number,number]>): AbstractGraph{
        const fmtArcsList = new Array<[number,number,void]>();
        for (const [x,y] of arcsList){
            fmtArcsList.push([x,y,null]);
        }
        const g = Graph.fromArcsList(fmtArcsList, () => {return});
        return g as AbstractGraph;
    }

    static generateClique(n: number): AbstractGraph{
        const g = new AbstractGraph();
        for (let i = 0 ; i < n ; i ++){
            g.addVertex();
            for (let j = 0 ; j < i ; j ++){
                g.addLink(j,i, ORIENTATION.UNDIRECTED, null);
            }
        }
        return g;
    }

    /**
     * The line graph is the graph associated to an undirected graph where the vertices are the edges of the initial graph.
     * Two edges are adjacent in the line graph if they share a common endpoint.
     * @returns 
     */
    static lineGraph<V,L>(graph: Graph<V,L>): AbstractGraph{
        const g = new AbstractGraph();
        for (const linkId of graph.links.keys()){
            g.set_vertex(linkId, null);
        }
        for (const link1 of graph.links.values()){
            for (const link2 of graph.links.values()){
                if (link1.index <= link2.index) continue;
                if (link1.startVertex.index == link2.startVertex.index || link1.startVertex.index == link2.endVertex.index || link1.endVertex.index == link2.startVertex.index || link1.endVertex.index == link2.endVertex.index){
                    g.addLink(link1.index, link2.index, ORIENTATION.UNDIRECTED, null);
                }
            }
        }
        return g;
    }


    /**
     * Return the geometric line graph is the graph whose vertices are the links of the initial graph.
     * Two links are considered adjacent if the geometric paths intersect (they can intersect at their endpoints).
     * Therefore the geometric line graph is a super graph of the line graph.
     * @example for K4
     * o---o
     * |\ /|   This K4 embedding
     * | X |   has one more edge in the geometric line graph
     * |/ \|
     * o---o
     * 
     * @example
     *      o
     *     /|\
     *    / | \    This K4 embedding
     *   /  o  \   has the same geometric line graph and line graph
     *  /__/ \__\
     * o---------o
     * 
     * 
     */
    static geometricLineGraph<V extends BasicVertexData,L extends BasicLinkData>(graph: BasicGraph<V,L>): AbstractGraph{
        const g = new AbstractGraph();
        for (const linkId of graph.links.keys()){
            g.set_vertex(linkId, null);
        }
        for (const link1 of graph.links.values()){
            for (const link2 of graph.links.values()){
                if (link1.index <= link2.index) continue;
                if (link1.startVertex.index == link2.startVertex.index || link1.startVertex.index == link2.endVertex.index || link1.endVertex.index == link2.startVertex.index || link1.endVertex.index == link2.endVertex.index){
                    g.addLink(link1.index, link2.index, ORIENTATION.UNDIRECTED, null);
                } else if (link1.intersectsLink(link2)){
                    g.addLink(link1.index, link2.index, ORIENTATION.UNDIRECTED, null);
                }
            }
        }
        return g;
    }
}




export class BasicGraph<V extends BasicVertexData, L extends BasicLinkData> extends Graph<V,L> {
    vertices: Map<number, BasicVertex<V>>;
    links: Map<number, BasicLink<V,L>>;


    static from<V extends BasicVertexData, L extends BasicLinkData>(rawVerticesList: Array<[number,number,string]>, rawEdgesList: Array<[number, number, string]> ): BasicGraph<V,L>{
        const verticesList = new Array<BasicVertexData>();
        for (const [x,y,w] of rawVerticesList){
            verticesList.push(new BasicVertexData(new Coord(x,y), w, "black"));
        }

        const edgesList = new Array<[number,number,BasicLinkData]>();
        for (const [x,y,w] of rawEdgesList){
            edgesList.push([x,y,  new BasicLinkData(undefined, w, "black")]);
        }

        const g = Graph.fromList(verticesList, edgesList, ORIENTATION.UNDIRECTED);
        return g as BasicGraph<V,L>;
    }

    static fromWeightedEdgesList<V extends BasicVertexData, L extends BasicLinkData>(edgesList: Array<[number,number, string]>): BasicGraph<V,L>{
        const fmtEdgesList = new Array<[number,number,BasicLinkData]>();
        for (const [x,y,w] of edgesList){
            fmtEdgesList.push([x,y,  new BasicLinkData(undefined, w, "black")]);
        }

        const g = Graph.fromEdgesList(fmtEdgesList, () => { return new BasicVertexData(new Coord(0,0), "", "black")});
        return g as BasicGraph<V,L>;
    }


    override addVertex(vertexData: V): BasicVertex<V> {
        const index = this.get_next_available_index_vertex();
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



    vertices_contained_by_area<A extends Area>(area: A): Set<number>{
        const set = new Set<number>();
        this.vertices.forEach((vertex,vertex_index)=> {
            if (area.is_containing(vertex)){
                set.add(vertex_index);
            }
        })
        return set;
    }

    translate_vertices(indices: Iterable<number>, shift: Vect) {
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
                newGraph.set_vertex(index,vertex.data);
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
    is_drawing_planar(): boolean{
        for (const [link_index, link1] of this.links) {
            const v1 = link1.startVertex as BasicVertex<V>;
            const w1 = link1.endVertex as BasicVertex<V>;
            let z1 = v1.getPos().middle(w1.getPos());
            if (typeof link1.data.cp != "undefined"){
                z1 = link1.data.cp;
            }
            for (const [link_index2, link2] of this.links) {
                if ( link_index2 < link_index){
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
                            is_intersecting = is_segments_intersection(v1.getPos(), w1.getPos(), v2.getPos(), w2.getPos());
                        } else {
                            is_intersecting = is_quadratic_bezier_curves_intersection(v1.getPos(), z1, w1.getPos(), v2.getPos(), z2, w2.getPos());
                        }
                    }
    
                    if (is_intersecting){
                        return false;
                    }
                }
            }
        }
        return true;
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
                        if( this.has_arc(index1, index2) == false && this.has_arc(index2, index1) == false){
                            const arcIndex = this.get_next_available_index_links();
                            const newArc = arcDefault(arcIndex, v1, v2);
                            this.links.set(arcIndex, newArc);
                        }
                    } else {
                        if( this.has_arc(index1, index2) == false && this.has_arc(index2, index1) == false){
                            const arcIndex = this.get_next_available_index_links();
                            const newArc = arcDefault(arcIndex, v2, v1);
                            this.links.set(arcIndex, newArc);
                        }
                    }
                }
                
            }
        }
    }

    /**
     * Returns the distances between each pair of vertices using only edges (undirected links).
     * It uses the algorithm of Floyd-Warshall.
     * @param weighted: if true then the distance between a pair of adjacent vertices is not 1 but e.weight.
     * TODO: oriented case 
     */
    Floyd_Warhall( weighted: boolean) {
        const dist = new Map<number, Map<number, number>>();
        const next = new Map<number, Map<number, number>>();

        for (const v_index of this.vertices.keys()) {
            dist.set(v_index, new Map<number, number>());
            next.set(v_index, new Map<number, number>());

            for (const u_index of this.vertices.keys()) {
                if (v_index === u_index) {
                    dist.get(v_index).set(v_index, 0);
                    next.get(v_index).set(v_index, v_index);
                }
                else {
                    dist.get(v_index).set(u_index, Infinity);
                    next.get(v_index).set(u_index, Infinity);
                }
            }
        }

        for (const [e_index,e] of this.links) {
            // TODO: Oriented Case
            let weight = 1;
            if (weighted) {
                weight = parseFloat(e.getWeight());
            }
            dist.get(e.startVertex.index).set(e.endVertex.index, weight);
            dist.get(e.endVertex.index).set(e.startVertex.index, weight);

            next.get(e.startVertex.index).set(e.endVertex.index, e.startVertex.index);
            next.get(e.endVertex.index).set(e.startVertex.index, e.endVertex.index);
        }

        for (const k_index of this.vertices.keys()) {
            for (const i_index of this.vertices.keys()) {
                for (const j_index of this.vertices.keys()) {
                    const direct = dist.get(i_index).get(j_index);
                    const shortcut_part_1 = dist.get(i_index).get(k_index);
                    const shortcut_part_2 = dist.get(k_index).get(j_index);

                    if (direct > shortcut_part_1 + shortcut_part_2) {
                        dist.get(i_index).set(j_index, shortcut_part_1 + shortcut_part_2);
                        next.get(i_index).set(j_index, next.get(i_index).get(k_index));
                    }
                }
            }
        }

        return { distances: dist, next: next };

    }




    // Compute a minimum spanning tree using Kruskal algorithm
    // https://en.wikipedia.org/wiki/Kruskal%27s_algorithm
    // edges in the tree are colored red
    // other edges are colored black
    // return the weight of the spanning tree
    minimum_spanning_tree(): number {
        const edges = new Array<[Link<V,L>,number]>();
        for (const link of this.links.values()){
            if (link.orientation == ORIENTATION.UNDIRECTED){
                edges.push([link, parseFloat(link.getWeight())]);
                
            }
        }
        edges.sort(([e,w],[e2,w2]) => w-w2);

        const component = new Map<number,number>();
        for (const index of this.vertices.keys()){
            component.set(index, index);
        }

        let tree_weight = 0;
        for (const edge of edges){
            const c1 = component.get(edge[0].startVertex.index);
            const c2 = component.get(edge[0].endVertex.index);
            if ( c1 != c2 ){
                // edge[0].color = "red";
                tree_weight += edge[1];
                for (const [vindex, c] of component.entries()){
                    if (c == c1){
                        component.set(vindex, c2);
                    }
                }
            }else {
                // edge[0].color = "black";
            }
        }
        return tree_weight;
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
     * Returns undefined if there is 1 vertex or less.
     */
    stretch(): number | undefined{
        this.setEuclidianLinkWeights();
        const data = this.Floyd_Warhall(true);
        const distances = data.distances;
        let maxStretch: number | undefined = undefined;
        for (const [indexV1, v1] of this.vertices){
            for (const [indexV2, v2] of this.vertices){
                if (indexV1 != indexV2){
                    const v1distances = distances.get(indexV1);
                    if (v1distances){
                        const graphDist = v1distances.get(indexV2);
                        if (graphDist){
                            const stretch = graphDist / v1.distTo(v2);
                            if (typeof maxStretch === "undefined" ){
                                maxStretch = stretch;
                            } else if (stretch > maxStretch){
                                maxStretch = stretch;
                            }
                        }
                    }
                }
            }
        }
        return maxStretch;
    }

} 



