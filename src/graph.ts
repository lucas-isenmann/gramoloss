import { Link, ORIENTATION } from './link';
import { Vertex, VertexIndex } from './vertex';
import { Coord, Vect } from './coord';
import { bezierCurvePoint, det, isQuadraticBezierCurvesIntersection, isSegmentsIntersection, isModSquare, isPrime, segmentsInteriorIntersection } from './utils';
import { Option } from "./option";
import { minDFVS } from './algorithms/dfvs';
import { getDirectedCycle } from './algorithms/cycle';
import { hasLightTournamentExtension2, isTournamentLight, searchHeavyArc, searchHeavyArcDigraph } from './algorithms/isTournamentLight';
import { acyclicColoring, dichromatic } from './algorithms/dichromatic';



/**
 * For the Dominating Set Algo
 * @todo should be removed by implementing a method for IDS
 */
export enum DominationVariant {
    Independent,
    OrientedIndependent
}





export class Graph {
    
    vertices: Map<VertexIndex, Vertex>;
    links: Map<number, Link>;
    matrix: Array<Array<number>>;
    private n: number = 0;
    private linksCounter: number = 0;


    constructor(n?: number) {
        this.vertices = new Map();
        this.links = new Map();
        this.matrix = new Array();

        if (typeof n != "undefined"){
            for (let i = 0; i < n ; i ++){
                const angle = i*2*3.14 / n;
                this.addVertex(i, Math.cos(angle), Math.sin(angle));
            }
        }
    }


    nbVertices(): number {
        return this.n;
    }

    nbEdges(): number {
        let c = 0;
        for (const link of this.links.values()){
            if (link.orientation == ORIENTATION.UNDIRECTED){
                c += 1;
            }
        }
        return c;
    }

    nbArcs(): number {
        let c = 0;
        for (const link of this.links.values()){
            if (link.orientation == ORIENTATION.DIRECTED){
                c += 1;
            }
        }
        return c;
    }

    getAvailableVertexIndex(): VertexIndex {
        let c = this.vertices.size;
        while (this.vertices.has(c)){
            c += 1;
        }
        return c;
    }


    /**
     * Add a vertex to the graph.
     */ 
    addVertex(index: VertexIndex, x?: number, y?: number): Vertex {
        const vx = x ?? 0;
        const vy = y ?? 0;


        const newVertex = new Vertex( this, index, this.n, vx, vy);
        this.vertices.set(index, newVertex);
        this.n += 1;

        this.matrix.push(new Array<number>(this.n).fill(0));
        for (let i = 0; i < this.n-1 ; i ++){
            this.matrix[i].push(0);
        }

        return newVertex;
    }

    deleteVertex(v: Vertex) {
        // Update the neighbors, in-neighbors and out-neighbors
        for (const [linkIndex, link] of v.incidentLinks){
            const u = link.endVertex;
            if (link.startVertex.index == v.index){
                if (link.orientation == ORIENTATION.UNDIRECTED){
                    u.incidentLinks.delete(linkIndex);
                    u.neighbors.delete(v.index);
                } else {
                    u.incidentLinks.delete(linkIndex);
                    u.inNeighbors.delete(v.index);
                }
            } else if (link.endVertex.index == v.index){
                if (link.orientation == ORIENTATION.UNDIRECTED){
                    u.incidentLinks.delete(linkIndex);
                    u.neighbors.delete(v.index);
                } else {
                    u.incidentLinks.delete(linkIndex);
                    u.outNeighbors.delete(v.index);
                }
            }
            this.links.delete(linkIndex);
        }

        // Update the matrix
        v.stackedIndex;
        this.matrix.splice(v.stackedIndex, 1)
        this.n -= 1;
        for (let i = 0; i < this.n; i ++){
            this.matrix[i].splice(v.stackedIndex, 1)
        }


        this.vertices.delete(v.index);
    }


    addEdge(u: Vertex | VertexIndex, v: Vertex | VertexIndex): Link | Error{

        const source = typeof u === "number" || typeof u === "string" 
            ? this.vertices.get(u)
            : u;

        if (typeof source == "undefined"){
            return new Error(`Vertex with id ${u} not found`);
        }

         const target = typeof v === "number" || typeof v === "string" 
            ? this.vertices.get(v)
            : v;

        if (typeof target == "undefined"){
            return new Error(`Vertex with id ${v} not found`);
        }

        const index = this.linksCounter;


        const newLink = new Link(index, this, source, target,ORIENTATION.UNDIRECTED);
        this.links.set(index, newLink);
        this.linksCounter += 1;

        this.matrix[source.stackedIndex][target.stackedIndex] += 1;
        this.matrix[target.stackedIndex][source.stackedIndex] += 1;

        if (source.neighbors.has(target.index) == false){
            source.neighbors.set(target.index, target);
        }
        if (target.neighbors.has(source.index) == false){
            target.neighbors.set(source.index, source);
        }
        return newLink;
    }

    hasEdge(a: Vertex | VertexIndex, b: Vertex | VertexIndex){
        const u = (a instanceof Vertex) ? a : this.vertices.get(a);
        const v = (b instanceof Vertex) ? b : this.vertices.get(b);

        if (typeof u == "undefined"){
            throw Error(`No vertex with index ${a} found in graph`)
        }
        if (typeof v == "undefined"){
            throw Error(`No vertex with index ${b} found in graph`)
        }

        return u.neighbors.has(v.index)
    }


    /**
     * Delete the edge between u and v if any.
     * If the graph is not simple, there may be several edges between u and v.
     * Therefore all the edges between u and v are deleted. 
     */
    deleteEdge(u: Vertex, v: Vertex){
        if (u.neighbors.has(v.index)){
            u.neighbors.delete(v.index);
            v.neighbors.delete(u.index);

            this.matrix[u.stackedIndex][v.stackedIndex] = 0;
            this.matrix[v.stackedIndex][u.stackedIndex] = 0;

            for (const [linkIndex, link] of u.incidentLinks){
                if (link.orientation == ORIENTATION.UNDIRECTED && 
                    (link.startVertex.index == v.index || link.endVertex.index == v.index)){
                        u.incidentLinks.delete(linkIndex);
                        v.incidentLinks.delete(linkIndex);
                        this.links.delete(linkIndex);
                    }
            }
        }
    }


    addArc(u: Vertex | VertexIndex, v: Vertex | VertexIndex): Link | Error{
        const source = typeof u === "number" || typeof u === "string" 
            ? this.vertices.get(u)
            : u;

        if (typeof source == "undefined"){
            return new Error(`Vertex with id ${u} not found`);
        }

         const target = typeof v === "number" || typeof v === "string" 
            ? this.vertices.get(v)
            : v;

        if (typeof target == "undefined"){
            return new Error(`Vertex with id ${v} not found`);
        }


        const index = this.linksCounter;
        const newLink = new Link(index, this, source, target, ORIENTATION.DIRECTED);
        this.links.set(index, newLink);
        this.linksCounter += 1;

        this.matrix[source.stackedIndex][target.stackedIndex] += 1;

        if (source.outNeighbors.has(target.index) == false){
            source.outNeighbors.set(target.index, target);
        }
        if (target.inNeighbors.has(source.index) == false){
            target.inNeighbors.set(source.index, source);
        }
        return newLink;
    }

    hasArc(a: Vertex | VertexIndex, b: Vertex | VertexIndex){
        const u = (a instanceof Vertex) ? a : this.vertices.get(a);
        const v = (b instanceof Vertex) ? b : this.vertices.get(b);

        if (typeof u == "undefined"){
            throw Error(`No vertex with index ${a} found in graph`)
        }
        if (typeof v == "undefined"){
            throw Error(`No vertex with index ${b} found in graph`)
        }

        return u.outNeighbors.has(v.index)
    }


    degree(v: VertexIndex | Vertex): number{
        if (v instanceof Vertex){
            return v.degree();
        } else {
            const u = this.vertices.get(v);
            if (typeof u != "undefined"){
                return u.degree();
            } else {
                throw Error(`No vertex with index ${v} found in the graph`)
            }
        }
    }

    indegree(v: VertexIndex | Vertex): number{
        if (v instanceof Vertex){
            return v.indegree();
        } else {
            const u = this.vertices.get(v);
            if (typeof u != "undefined"){
                return u.indegree();
            } else {
                throw Error(`No vertex with index ${v} found in the graph`)
            }
        }
    }

    outdegree(v: VertexIndex | Vertex): number{
        if (v instanceof Vertex){
            return v.outdegree();
        } else {
            const u = this.vertices.get(v);
            if (typeof u != "undefined"){
                return u.outdegree();
            } else {
                throw Error(`No vertex with index ${v} found in the graph`)
            }
        }
    }



    // TODO : delete arc
   

   


    // PRINTERS

    print(){
        console.log("-----------")
        console.log("adjacencies")
        for (const v of this.vertices.values()){
            if (v.neighbors.size > 0){
                console.log(`${v.index} -- `, new Set(v.neighbors.keys()));
            }
            if (v.outNeighbors.size > 0){
                console.log(`${v.index} -> `, new Set(v.outNeighbors.keys()));
            }
            if (v.inNeighbors.size > 0){
                console.log(`${v.index} <- `, new Set(v.inNeighbors.keys()));
            }
        }

        console.log("matrix")
        const matrixFormatted = this.matrix.map(row => row.join(' ')).join('\n');
        console.log(matrixFormatted)
    }

    /**
     * @todo TRANSPOSED
     * Only print arcs
     */
    printDirectedAdjacencyMatrix() {

        function boolToNum(b: number): number {
            return b ? b : 0;
        }
        const matrix01 = this.matrix.map(row => row.map(boolToNum));
        const matrixFormatted = matrix01.map(row => row.join(' ')).join('\n');

        console.log(matrixFormatted)
    }



    /**
     * Returns an undirected Graph given by its edges.
     * @param edgesList
     */
    static fromEdges( edgesList: Array<[number,number, string?]>, verticesPositions?: Array<[number, number]> ){
        const g = new Graph();
        for ( const [x,y] of edgesList){
            if (g.vertices.has(x) == false){
                g.addVertex(x);
            }
            if (g.vertices.has(y) == false){
                g.addVertex(y);
            }
        }
        if (typeof verticesPositions != "undefined"){
            for (let i = 0; i < verticesPositions.length; i++){
                const v = g.vertices.get(i);
                if (typeof v != "undefined"){
                    v.pos.x = verticesPositions[i][0];
                    v.pos.y = verticesPositions[i][1];
                }
            }
        }
        for ( const [indexV1, indexV2, w] of edgesList){
            const edge = g.addEdge(indexV1, indexV2);
            if (typeof w != "undefined" && edge instanceof Link){
                edge.weight = w;
            }
        }
        return g;
    }

    /**
     * Returns an undirected Graph given by its edges.
     * @param arcs
     */
    static fromArcs( arcs: Array<[number,number, string?]>, verticesPositions?: Array<[number, number]> ){
        const g = new Graph();
        for ( const [x,y] of arcs){
            if (g.vertices.has(x) == false){
                g.addVertex(x);
            }
            if (g.vertices.has(y) == false){
                g.addVertex(y);
            }
        }
        if (typeof verticesPositions != "undefined"){
            for (let i = 0; i < verticesPositions.length; i++){
                const v = g.vertices.get(i);
                if (typeof v != "undefined"){
                    v.pos.x = verticesPositions[i][0];
                    v.pos.y = verticesPositions[i][1];
                }
            }
        }
        for ( const [indexV1, indexV2, w] of arcs){
            const arc = g.addArc(indexV1, indexV2);
            if (typeof w != "undefined" && arc instanceof Link){
                arc.weight = w;
            }
        }
        return g;
    }

   
    /**
     * @returns Petersen graph (10 vertices, 15 edges)
     * @see https://en.wikipedia.org/wiki/Petersen_graph
     */
    static petersen(): Graph{
        return Graph.fromEdges([[0,1],[1,2],[2,3],[3,4],[4,0],
        [5,6],[6,7],[7,8],[8,9],[9,5],
        [0,5],[1,7],[2,9],[3,6],[4,8]]);
    }
    

    /**
     * Returns a random graph with n vertices.
     * @param n number of vertices. Should be >= 0. Return empty graph if n < 1.
     * @param p probabilty of appearance of an edge. Should be between 0 and 1.
     */
    static randomGNP(n: number, p: number): Graph {
        const g = new Graph(n);
        if (n < 1){
            return g;
        }
        for (let i = 0 ; i < n ; i ++){
            for (let j = 0 ; j < i; j ++){
                if (Math.random() < p){
                    g.addEdge(i, j);
                }
            }
        }
        return g;
    }


     
    /**
     * Returns a graph with vertex set indices [0, sum(sizes)-1]
     * Vi = sum( sizes[k], k < i) + [0, sizes[i]-1]
     * For every i and j, every vertex of Vi is adjacent to every vertex of Vj
     * @param sizes list of the sizes of the parts
     * @example
     * For sizes = [5,4,3], the graph has 5+4+3 vertices
     * The sum of the degrees is 5*(4+3) + 4*(5+3) + 3*(5+4). 
     */
    static completeMultipartite(sizes: Array<number>): Graph {
        const graph = new Graph();
        const k = sizes.length;
        const r = 50;
        let counter = 0;
        for ( let i = 0 ; i < k ; i ++){
            for (let ki = 0; ki < sizes[i]; ki ++){
                graph.addVertex( 
                        counter,
                            r*Math.cos( (2*Math.PI*i) /k )+ (-Math.sin( (2*Math.PI*i) /k))*(ki-sizes[i]/2),  
                            r*Math.sin( (2*Math.PI*i) /k) + (Math.cos( (2*Math.PI*i) /k))*(ki-sizes[i]/2) );
                            counter += 1;
            }
        }

        let sumi = 0;
        for (let i = 0; i < k ; i ++){

            let sumj = 0;
            for (let j = 0; j < i; j ++){
                for (let ki = 0; ki < sizes[i]; ki ++){
                    for (let kj = 0; kj < sizes[j]; kj ++){
                        graph.addArc(sumi+ki, sumj+kj)
                    }
                }
                sumj += sizes[j];
            }
            sumi += sizes[i];
        }
        return graph;
    }


    /**
     * Special case of `completeMultipartite`
     * @param n 
     * @param m 
     * @returns 
     */
    static completeBipartite(n: number, m: number): Graph {
        return this.completeMultipartite([n,m]);
    }



    /**
     * Returns a random oriented graph with n vertices.
     * @param n number of vertices. Should be >= 0. Return empty graph if n < 1.
     * @param p probabilty of appearance of an edge. Should be between 0 and 1.
     */
    static randomOGNP(n: number, p: number): Graph {
        const g = new Graph(n);
        if (n < 1){
            return g;
        }
        for (let i = 0 ; i < n ; i ++){
            for (let j = 0; j < n; j ++){
                if (Math.random() < p){
                    if (Math.random() < 0.5){
                        g.addArc(i, j);
                    } else {
                        g.addArc(j, i);
                    }
                }
            }
        }
        return g;
    }




/**
 * An acyclic tournament is a tournament which contains no directed cycle.
 * Such a graph is a Directed Acyclic Graph (DAG).
 * @param n number of vertices
 */
    static acyclicTournament(n: number): Graph {
        return Graph.UGtournament(n, 0);
    }







    /**
     * for every i < j, i -> j iff i+j is prime
     * @param n 
     */
    static testTournament(n: number): Graph {
        const graph = new Graph(n);
        for ( let i = 0 ; i < n ; i ++){
            for ( let j = 0 ; j < i ; j ++ ){
                if (isPrime(i+j)){
                    graph.addArc(j, i);
                } else {
                    graph.addArc(i, j);
                }
                
            }
        }
        return graph;
    }



    static generateAztecDiamond(n: number): Graph {
        const graph = new Graph();

        function check(i: number,j: number,n: number): boolean {
            return (i+j >= n-1 && i+j <= 3*n+1 && j-i <= n+1 && i-j <= n+1);
        }

        const indices = new Array();
        let counter = 0;
        for ( let i = 0 ; i < 2*n+1 ; i++){
            indices.push(new Array());
            for ( let j = 0 ; j < 2*n+1 ; j ++){
                indices[i].push(-1);
                if ( check(i,j,n) ){
                    const v = graph.addVertex( counter, i*30-n*30, j*30-n*30);
                    indices[i][j] = v.index;
                    counter += 1;
                }
            }
        }

        for ( let i = 0 ; i < 2*n+1 ; i++){
            for (let j = 0 ; j < 2*n+1 ; j ++){
                if (indices[i][j] != -1){
                    if (check(i+1, j, n) && i+1 < 2*n+1){
                        graph.addArc(indices[i][j], indices[i+1][j]);
                    }
                    if (check(i,j+1,n) && j+1 < 2*n+1){
                        graph.addArc(indices[i][j], indices[i][j+1]);

                    }
                }
            }
        }
        return graph;
    }

    static generateGrid(n: number, m: number): Graph {
        const graph = new Graph();
        
        let counter = 0;
        for ( let i = 0 ; i < n ; i++){
            for ( let j = 0 ; j < m ; j ++){
                graph.addVertex(counter, i*30, j*30 );
                counter += 1;
            }
        }

        for ( let i = 0 ; i < n ; i ++){
            for ( let j = 0 ; j < m ; j ++){
                let current_index = i*m + j;
                if( j < m - 1){
                    graph.addArc(current_index, current_index + 1);
                }
                if( i < n-1 ){
                    graph.addArc(current_index, current_index+m);
                }
            }
        }
        return graph;
    }
    



    /**
     * @returns an undirected cycle of length `n`.
     * 
     * This graph has n vertices and n edges.
     */
    static cycle(n: number){
        const g = Graph.path(n);
        g.addEdge(n-1, 0);
        return g;
    }



    static clique(n: number): Graph{
        const g = new Graph(n);
        
      
        for (let i = 0; i < n; i ++){
            for (let j = 0; j < n; j ++){
                g.addEdge(i, j);
            }
        }
        return g;
    }

    /**
     * @param n is the number of vertices
     */
    static path(n: number): Graph{
        const g = new Graph(n);
        for (let i = 0 ; i < n ; i ++){
            if (i > 0) {
                g.addEdge(i-1, i)   
            }
        }
        return g;
    }

    /**
     * @param n is the number of vertices
     * @returns an oriented path (`n` vertices and `n-1` edges)
     */
    static orientedPath(n: number): Graph{
        const g = new Graph(n);
        for (let i = 0 ; i < n ; i ++){
            if (i > 0) {
                g.addArc(i-1, i)   
            }
        }
        return g;
    }

    /**
     * @param n is the number of vertices
     * @returns an oriented cycle (`n` vertices and `n` edges)
     */
    static orientedCycle(n: number): Graph{
        const g = new Graph();
        const vertices = new Array();
        for (let i = 0 ; i < n ; i ++){
            const v = g.addVertex(0, 0);
            if (i > 0) {
                g.addArc(vertices[vertices.length -1], v)   
            }
            vertices.push(v);
        }
        g.addArc(vertices[vertices.length-1], vertices[0]);
        return g;
    }

    /**
     * Tournarment with n vertices such that  v(i) -> v(i-j) for all j in [1,k]
     * @param n number of vertices
     * @param k order
     * @example k = 0: acyclic
     * @example k = 1: U-tournaments
     */
    static UGtournament(n: number, k: number): Graph {
        const graph = new Graph(n);
        for ( let i = 0 ; i < n ; i ++){
            for ( let j = 1; j <= k; j ++){
                if (i-j >= 0){
                    graph.addArc(i, i-j);
                }
            }
            for ( let j = 0 ; j < i-k ; j ++ ){
                graph.addArc(j, i);
            }
        }
        return graph;
    }

        /**
     * Return a random Unit Disk graph where vertices are set uniformely randomly in [-50,50]^2.
     * @param n integer >= 0, the number of vertices
     * @param d maximum distance between adjacent vertiecs
     */
    static generateUnitDisk(n: number, d: number): Graph {
        const graph = new Graph();

        const vertices = new Array<Vertex>();
        for (let i = 0 ; i < n ; i ++){
            vertices.push(graph.addVertex(i, Math.random()*100-50, Math.random()*100 -50));
        }
        for (let i = 0 ; i < n ; i ++){
            for (let j = i+1 ; j < n ; j ++){
                const dist = vertices[i].distTo(vertices[j]);
                if (dist < d){
                    graph.addArc(i, j);
                }
            }
        }

        return graph;
    }

    static randomTournament(n: number): Graph {
        const graph = new Graph(n);
        for ( let i = 0 ; i < n ; i ++){
            for ( let j = 0 ; j < i ; j ++ ){
                if ( Math.random() < 0.5 ){
                    graph.addArc(j, i);
                }else {
                    graph.addArc(i, j);
                }
            }
        }
        return graph;
    }

    /**
     * @param n 
     * @returns Star with n+1 vertices and n edges
     */
    static star(n: number): Graph {
        const graph = new Graph(n+1);
        const r = 50;
        if ( n > 0 ){
            for ( let i = 1 ; i <= n ; i ++){
                graph.addArc(0,i);
            }
        }
        return graph;
    }


    static generateIndependentCircle(n: number): Graph {
        return new Graph(n);
    }


    /**
     * With Markov Chain strategy
     * @param n number of vertices
     * @returns a tree
     */
    static randomTree(n: number): Graph {
    
        const root = Math.floor(n/2);
        const leaves = [0,n-1];
        const kids = new Array<Set<number>>();
        const parents = new Array();
        for (let i = 0; i < n ; i ++){
            parents.push(root);
            kids.push(new Set());
        } 
        for (let i = root; i-1 >= 0; i --){
            parents[i-1] = i;
            kids[i].add(i-1);
        }
        for (let i = root; i+1 < n; i ++){
            parents[i+1] = i;
            kids[i].add(i+1);
        }

        for (let k = 0; k < 20; k ++){
            const leafId = Math.floor(Math.random()*leaves.length);
            const leaf = leaves[leafId];
            // Delete edge
            kids[parents[leaf]].delete(leaf);

            
            let newParent = Math.floor(Math.random()*n);
            if (newParent >= leaf){
                newParent += 1;
            }
            if (kids[newParent].size == 0){
                leaves // remove newp
            }
            kids[newParent].add(leaf);
            parents[leaf] = newParent;


            
        }

        const graph = new Graph(n);
        for (let i = 0; i <n-1; i ++){
            graph.addArc(i, i+1);
        }


        return graph;
    }



    static circulantTournament(n: number, gaps: Array<number>): Graph {
        const graph = new Graph(2*n+1);

        for ( let i = 0 ; i < (2*n+1)  ; i ++){
            for (const k of gaps ){
                const j = ((2*n+1)+i+k)%(2*n+1) ;
                graph.addArc(i, j);
            }
        }
        
        return graph;
    }






    /**
        * PaleyGraph is unoriented if p = 1 mod 4.
        * It is oriented if p = -1 mod 4.
        * @param p should be a prime number = +-1 mod 4
        * @returns Error if p is not such a number
        * @example undirected: 5 13 17, directed: 3 7 11
     */
    static Paley(p: number): Graph {
        if ( Number.isInteger(p) == false ) throw Error(`p (given ${p}) should be an integer`);
        if ( (p -1) % 4 != 0 && (p+1) % 4 != 0 ) throw Error(`param p (given ${p}) should be = +-1 mod 4 (here p = ${p%4} mod 4)`);
    
        const orientation = (p-1)%4 == 0 ? ORIENTATION.UNDIRECTED : ORIENTATION.DIRECTED;
    
        const graph = new Graph(p);
    
        if (orientation == ORIENTATION.UNDIRECTED){
            for ( let i = 0 ; i < p ; i ++){
                for (let j = i+1 ; j < p ; j ++){
                    if ( isModSquare(j-i, p) ){
                        graph.addArc(i, j);
                    }
                }
            }
        } else {
            for ( let i = 0 ; i < p ; i ++){
                for (let j = 0 ; j < p ; j ++){
                    if ( i != j &&  isModSquare(j-i, p) ){
                        graph.addArc(i, j);
                    }
                }
            }
        }
        
        return graph;
    }

    /**
     * The line graph is the graph associated to an undirected graph where the vertices are the edges of the initial graph.
     * Two edges are adjacent in the line graph if they share a common endpoint.
     * @returns 
     */
    static lineGraph(graph: Graph): Graph{
        const g = new Graph(graph.links.size);

        for (const link1 of graph.links.values()){
            for (const link2 of graph.links.values()){
                if (link1.index <= link2.index) continue;
                if (link1.startVertex.index == link2.startVertex.index || link1.startVertex.index == link2.endVertex.index || link1.endVertex.index == link2.startVertex.index || link1.endVertex.index == link2.endVertex.index){
                    g.addEdge(link1.index, link2.index);
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
    static geometricLineGraph(graph:Graph): Graph{
        const g = new Graph(graph.links.size);

        for (const link1 of graph.links.values()){
            for (const link2 of graph.links.values()){
                if (link1.index <= link2.index) continue;
                if (link1.startVertex.index == link2.startVertex.index || link1.startVertex.index == link2.endVertex.index || link1.endVertex.index == link2.startVertex.index || link1.endVertex.index == link2.endVertex.index){
                    g.addEdge(link1.index, link2.index);
                } else if (link1.intersectsLink(link2)){
                    g.addArc(link1.index, link2.index);
                }
            }
        }
        return g;
    }



    /**
     * Returns an Undirected Graph from a list of edges represented by couples of indices.
     * Weights are set to "".
     */
    // static from_list(l: Array<[number,number]>): Graph<Vertex,Link>{
    //     const l2 = new Array();
    //     for (const [x,y] of l){
    //         l2.push([x,y,""]);
    //     }
    //     const g = Graph.from_list_default(l2, Vertex.default, Link.default_edge );
    //     return g;
    // }

    // create a Weighted Undirected Graph from a list of weighted edges represented by couples of number with the weight in third
    // static from_weighted_list(l: Array<[number,number,string]>): Graph<Vertex,Link>{
    //     const g = Graph.from_list_default(l, Vertex.default, Link.default_edge );
    //     return g;
    // }
	
    //  static directed_from_list(l: Array<[number,number]>): Graph<Vertex,Link>{
    //     const g = Graph.directed_from_list_default(l, Vertex.default, Link.default_arc );
    //     return g;
    // }

    // static directed_from_list_default<V extends Vertex,L extends Link<L>>(l: Array<[number,number]>, vertex_default: (index: number)=> V, arc_default: (x: number, y: number, weight: string) => L ): Graph{
    //     const g = new Graph();
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
    //         g.addArc(link);
    //     }

        
    //     return g;
    // }




    

    


    /**
     * Return the list of the extremeties of the arcs.
     */
    arcsList(): Array<[VertexIndex, VertexIndex]>{
        const l = new Array<[VertexIndex, VertexIndex]>();
        for (const link of this.links.values()){
            if (link.orientation == ORIENTATION.DIRECTED){
                l.push([link.startVertex.index, link.endVertex.index]);
            }
        }
        return l;
    }

    





    // update_vertex_pos(vertex_index: number, new_pos: Coord) {
    //     const vertex = this.vertices.get(vertex_index);
    //     if (typeof vertex !== "undefined"){
    //         vertex.pos = new_pos;
    //     }
    // }



    /**
     * WIP
     * @returns 
     */
    hasLightExtension(): boolean {
        const [b,done] = hasLightTournamentExtension2(this);
        console.log(done)
        return b;
    }

    /**
     * A tournament is light if and only there does not exist different vertices u,v,a,b,c such that
     * - u -> v
     * - a -> b -> c -> a is an oriented triangle
     * - v -> a,b,c
     * - a,b,c -> u
     * @returns undefined or a conflict [u,v,a,b,c]
     */
    lightnessConflict(): Option<Array<Vertex>> {
        // const m = this.getDirectedMatrix();

        const heavyArc =  searchHeavyArcDigraph(this);
        if (heavyArc.length == 0){
            return undefined
        } else {
            return heavyArc;
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






    

   


    /**
     * 
     * @param link 
     * @returns false if
     * - link is a loop
     * - there is already a link with the same signature (same orientation and start and end)
     */
    chekLink(link: Link): boolean {
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

   








    getNeighborsListExcludingLinks(i: VertexIndex, excluded: Set<VertexIndex>): Array<VertexIndex> {
        const neighbors = new Array<VertexIndex>();
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
     * @param vId vertex
     * @param d distance >= 0 (when d = 1, then it returns the closed in-neighborhood)
     * @returns the closed in-neighborhood of `vId` at dist at most `d`. That is the vertices at distance at most d to `vId`.
     * @example 
     * Graph.orientedPath(3).getClosedDistInNeighborhood(2, 2); // = [0,1,2]
     * Graph.orientedPath(3).getClosedDistInNeighborhood(2, 1); // = [1,2]
     */
    getClosedDistInNeighborhood(v: Vertex, d: number): Array<Vertex> {
        if (d <= 0){
            return [v];
        } else {
            const neighborsPrec = this.getClosedDistInNeighborhood(v, d-1);
            const neighborsD = new Array();
            for (const neighbor of neighborsPrec){
                if (neighborsD.indexOf(neighbor) == -1){
                    neighborsD.push(neighbor);
                }
                for (const nId of neighbor.inNeighbors){
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
     * Graph.orientedPath(3).getClosedDistOutNeighborhood(0, 2); // = [0,1,2]
     * Graph.orientedPath(3).getClosedDistOutNeighborhood(0, 1); // = [0,1]
     */
    getClosedDistOutNeighborhood(v: Vertex, d: number): Array<Vertex> {
        if (d <= 0){
            return [v];
        } else {
            const neighborsPrec = this.getClosedDistOutNeighborhood(v, d-1);
            const neighborsD = new Array();
            for (const neighbor of neighborsPrec){
                if (neighborsD.indexOf(neighbor) == -1){
                    neighborsD.push(neighbor);
                }
                for (const nId of neighbor.outNeighbors){
                    if (neighborsD.indexOf(nId) == -1){
                        neighborsD.push(nId);
                    }
                }
            }
            return neighborsD;
        }
    }

   

    



    




    getDegreesData() {
        if (this.vertices.size == 0) {
            return { min_value: 0, min_vertices: null, max_value: 0, max_vertices: null, avg: 0 };
        }

        const v = this.vertices.values().next().value;
        if (typeof v == "undefined"){
            return { min_value: 0, min_vertices: null, max_value: 0, max_vertices: null, avg: 0 };
        }
        let min_indices = new Set([v.index]);
        let min_degree = v.degree();
        let max_indices = new Set([v.index]);
        let maxDegree = v.degree();
        let average = 0.0;

        for (const v of this.vertices.values()) {
            if (min_degree > v.degree()) {
                min_degree = v.degree();
                min_indices = new Set([v.index]);
            }
            if (min_degree === v.degree()) {
                min_indices.add(v.index);
            }

            if (maxDegree < v.degree()) {
                maxDegree = v.degree();
                max_indices = new Set([v.index]);
            }
            if (maxDegree === v.degree()) {
                max_indices.add(v.index);
            }

            average += v.degree();
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
        for (const v of this.vertices.values()){
            if (v.degree() > record){
                record = v.degree();
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
        for (const v of this.vertices.values()){
            if (v.degree() < record){
                record = v.degree();
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
        for ( const v of this.vertices.values()){
            let indegree = v.indegree();
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
        for ( const v of this.vertices.values()){
            let indegree = v.indegree()
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
        for ( const v of this.vertices.values()){
            let d = v.outdegree();
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
        for ( const v of this.vertices.values()){
            let indegree = v.outdegree();
            if (typeof record == "string"){
                record = indegree;
            } else if ( indegree < record ){
                record = indegree;
            }
        }
        return record;
    }


     DFSrecursive( v: Vertex, visited: Map<VertexIndex, boolean>) {
        visited.set(v.index, true);

        for (const u of v.neighbors.values()) {
            if (visited.has(u.index) && !visited.get(u.index)) {
                this.DFSrecursive( u, visited);
            }
        }
    }

    DFSiterative( v: Vertex) {
        const visited = new Map();
        for (const index of this.vertices.keys()) {
            visited.set(index, false);
        }
        console.log(visited);

        const S = Array<Vertex>();
        S.push(v);

        while (S.length !== 0) {
            const u = S.pop();
            if (typeof u != "undefined" &&!visited.get(u)) {
                visited.set(u, true);
                for (const neighbor of u.neighbors.values()) {
                    S.push(neighbor);
                }
            }
        }

        return visited;
    }


    hasCycle(): boolean {
        let ok_list = new Set();
        let g = this;

        function _hasCycle(d: Vertex, origin: Vertex | undefined, s: Array<VertexIndex>): boolean {
            for (const v of d.neighbors.values()) {
                if ((typeof origin != "undefined" && v.index == origin.index) || ok_list.has(v)) {
                    continue;
                }
                if (s.indexOf(v.index) > -1) {
                    return true;
                }
                s.push(v.index);
                let b = _hasCycle(v, d, s)
                if (b) {return true}
                ok_list.add(v);
                s.pop();
            }
            return false;
        }
        for (const v of this.vertices.values()) {
            if (ok_list.has(v)) {
                continue;
            }
            if (_hasCycle(v, undefined, [v.index])) {
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
    hasCycle2(): [boolean, Array<Vertex>] {
        const visited = new Set();
        for (const v of this.vertices.values()) {
            // console.log("start", v);
            if ( visited.has(v) == false){
                const stack = new Array<[Vertex, VertexIndex]>();
                const previous = new Map<VertexIndex, Vertex>();
                stack.push([v,-1]);
                let r = stack.pop();
                while (typeof r != "undefined"){
                    const [u, last] = r;
                    // console.log("stack", uIndex);
                    if (visited.has(u)){
                        console.log("bug")
                        return [true, []];
                    }
                    visited.add(u);
                    
                    for (const neighbor of u.neighbors.values()) {
                        if ( neighbor.index != last ){
                            if (visited.has(neighbor) == false){
                                previous.set(neighbor.index, u);
                                stack.push([neighbor, u.index]);
                            }
                            else {
                                const cycle = new Array<Vertex>();
                                cycle.push(neighbor);
                                cycle.push(u);
                                let j = previous.get(u.index);
                                while ( typeof j != "undefined" && j != neighbor){
                                    cycle.push(j);
                                    j = previous.get(j.index);
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
    * Graph.generateClique(4).girth() == 3
    * Graph.generatePaley(13).girth() == 3
    * Graph.petersen().girth() == 5
    * Graph.star(3).girth() == 0
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
    * Graph.generateClique(4).shortestCycle().length == 3
    * Graph.generatePaley(13).shortestCycle().length == 3
    * Graph.petersen.shortestCycle().length == 5
    * Graph.star(3).shortestCycle().length == 0
    */
    shortestCycle(): Array<Vertex> {
        let girth = Infinity;
        const shortestCycle = new Array<Vertex>();
    
        for (const v of this.vertices.values()) {
            const visited = new Set();
            const distances = new Map<VertexIndex, number>();
            const predecessors = new Map<VertexIndex, Vertex>();
            // console.log("starting vertex", v);

            if (!visited.has(v)) {
                const queue = new Array<[Vertex, number, Vertex]>();
                queue.push([v,0, v]); // Queue for BFS, each element is [vertex, distance, predecessor]
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
                            const d = distances.get(current.index);
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
                                        const pred = predecessors.get(cycleStart.index);
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
                                        const pred = predecessors.get(cycleStart.index);
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
                            visited.add(current.index);
                            distances.set(current.index, distance);
                            predecessors.set(current.index, prede); // Set the predecessor to the last vertex in the queue
                            for (const neighbor of current.neighbors.values()) {
                                if (!visited.has(neighbor.index)) {
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
    getDirectedCycle(): undefined | Array<VertexIndex> {
        const outNeighbors = new Map<VertexIndex, Set<VertexIndex>>();
        for (const v of this.vertices.values()){
            const vOutNeighbors = new Set<VertexIndex>();
            for (const neigh of v.outNeighbors.values()){
                vOutNeighbors.add(neigh.index);
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
        
        function _has_directed_cycle(d: Vertex, s: Array<VertexIndex>): boolean {
            for (const v of d.outNeighbors.values()) {
                if (s.indexOf(v.index) > -1) {
                    return true;
                }
                s.push(v.index);
                let b = _has_directed_cycle(v, s)
                if (b) {return true}
                ok_list.add(v);
                s.pop();
            }
            return false;
        }
        for (const v of this.vertices.values()) {
            if (ok_list.has(v)) {
                continue;
            }
            if (_has_directed_cycle(v, [v.index])) {
                return true;
            }
        }
        return false;
    }


    // compute the size of the connected component of vertex of index "vindex"
    // return 0 if vindex is not a vertex index
    sizeConnectedComponentOf(u: Vertex | VertexIndex): number {
        
        const v = typeof u == "number" || typeof u == "string" ? this.vertices.get(u) : u;
        if (typeof v == "undefined"){
            throw Error(`Vertex index ${u} not in graph`)
        }
        let counter = 0;
        const visited = new Set();
        const stack = Array<Vertex>();
        stack.push(v);

        while (stack.length > 0) {
            const u = stack.pop();
            if (typeof u != "undefined" && !visited.has(u)) {
                counter += 1;
                visited.add(u);
                for (const neighbor of u.neighbors.values()) {
                    stack.push(neighbor);
                }
            }
        }
    
        return counter;
    }


    sizeConnectedComponentExcludingLinks(vindex: VertexIndex, excluded: Set<VertexIndex>): number {
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
        const v = this.vertices.values().next().value;
        if (typeof v == "undefined") {
            return true;
        }
    
        const visited = new Map();
        for (const index of this.vertices.keys()) {
            visited.set(index, false);
        }
    
        this.DFSrecursive(v , visited);
    
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
    stronglyConnectedComponents(): Array<Array<VertexIndex>> {
	    const graph = this;
	    let scc: Array<Array<VertexIndex>> = Array(); // Strongly Connected Components
	    var stack = Array();
	    var visited = new Set<VertexIndex>();

	    const visit = function (cur: Vertex) {
            if (visited.has(cur.index)) return;
            visited.add(cur.index);
            for (const neigh of cur.outNeighbors.values()) {
                visit(neigh);
            }
            stack.push(cur);
	    }

	    for (const v of this.vertices.values()) {
		    visit(v);
	    } // O(n) due to caching

        let assigned = new Set();
	    
	    const assign_fn = function (cur: Vertex) {
		if (!assigned.has(cur)) {
		    assigned.add(cur);
		    const rootStack = scc.pop();
            if (typeof rootStack != "undefined"){
                rootStack.push(cur.index);
                scc.push(rootStack);
                for (const neigh of cur.inNeighbors.values()) {
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
     * Compute a clique with a greedy algorithm.
     */
    greedyClique(): Set<Vertex>{
        const clique = new Set<Vertex>();
        while (true){
            let maxd = 0;
            let maxIndex = undefined;
            for (const v of this.vertices.values()){
                let k = 0;
                for (const neighbor of v.neighbors.values()){
                    if (clique.has(neighbor)){
                        k ++;
                    }
                }
                if (k < clique.size){
                    continue;
                }
                const d = v.degree();
                if (d > maxd){
                    maxd = d;
                    maxIndex = v;
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
     * Return the index of a maximal degree vertex or `undefined` if there is no vertices.
     */
    maximalDegreeVertex(): Option<Vertex> {
        let record = -1;
        let index = undefined;
        for (const v of this.vertices.values()){
            if (v.degree() > record){
                index = v;
            }
        }
        return index;
    }


    

    /**
     * Return true if the current coloring can be completed
     */
    private auxChroma(k: number, coloring: Map<VertexIndex,number>, possibleColors: Map<VertexIndex, Set<number>>,  cliques?: Set<Set<Vertex>>): boolean{

        // If a clique has not enough colors to color itself then stop
        if (typeof cliques != "undefined"){
            for (const clique of cliques){
                const pColors = new Set<number>();
                let s = 0;
                for (const v of clique){
                    if (coloring.has(v.index) == false){
                        s ++;
                        const possibleColorsV = possibleColors.get(v.index);
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
            const minVertex = this.vertices.get(minId);
            if (typeof minVertex == "undefined") {
                return false;
            }

            const possib = possibleColors.get(minId);
            if (typeof possib == "undefined") return false;
            for (const color of possib){
                coloring.set(minId, color);
                const modified = new Array();
                
                for (const neighbor of minVertex.neighbors.values()){
                    const set = possibleColors.get(neighbor.index);
                    if (typeof set == "undefined") continue;
                    if (set.has(color) && coloring.has(neighbor.index) == false){
                        set.delete(color);
                        modified.push(neighbor.index);                        
                    }
                }
                const result = this.auxChroma(k, coloring, possibleColors, cliques);
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
    chromaticNumber(cliques?: Set<Set<Vertex>>): number {
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
    minimalProperColoring(cliques?: Set<Set<Vertex>>) : Map<VertexIndex, number> {
        const n = this.vertices.size;
        if (n == 0) return new Map();

        let clique = new Set<Vertex>();
        if(typeof cliques == "undefined"){
            clique = this.greedyClique();
        } else {
            for (const c of cliques){
                if (c.size > clique.size){
                    clique = c;
                }
            }
        }


        let k = clique.size;
        while (true){
            const coloring = new Map<VertexIndex,number>();
            const possibleColors = new Map<VertexIndex,Set<number>>();
            for (const vIndex of this.vertices.keys()){
                possibleColors.set(vIndex, new Set(Array.from({length: k}, (_, i) => i)))
            }

            let i = 0;
            for (const vId of clique){
                coloring.set(vId.index, i);
                for (const neighbor of vId.neighbors.values()){
                    possibleColors.get(neighbor.index)?.delete(i);
                }
                i ++;
            }

            if (this.auxChroma(k, coloring, possibleColors, cliques)) return coloring;
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
    private auxUFVS(k: number, links: Array<Link>, selection: Set<VertexIndex>): boolean {

        // Kernelization
        // Removes all degree 1 vertices (leaves)
        while(true){
            let degrees = new Map<VertexIndex, number>();
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

            const degree1vertices = new Set<VertexIndex>();
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
        const links = new Array<Link>();

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
        const indices = new Map<VertexIndex, number>();
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
                            for (const neighbor of v.outNeighbors.values()){
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
    private auxVertexCoverV2K(k: number, selection: Set<VertexIndex>, rec: number): boolean {
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
     private auxVertexCover3(links: Array<Link>, selection: Set<VertexIndex>, record: number): number {
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
     private auxVertexCover3Bis(links: Array<Link>, selection: Set<VertexIndex>, record: number): number {
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

    private auxVertexCover4(k: number, links: Array<Link>, selection: Set<VertexIndex>): boolean {
        // console.log("aux", k, selection, rec);
        

        // const approx = this.vertexCover2Approx(links);
        // if (selection.size + approx/2 > k ){
        //     return false;
        // }

        // Kernelization
        // Add recursively all vertex such that d(v) > k-|selection|
        const kernelSelection = new Set<VertexIndex>();
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

    private vertexCoverV4launcher(k :number): undefined | Set<VertexIndex> {
        let links = new Array<Link>();
        for (const link of this.links.values()){
            links.push(link);
        }

        const preselection = new Set<VertexIndex>();
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

    private vertexCoverV4(): [number, Set<VertexIndex>] {
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
    vertexCover2Approx(subgraphLinks: Array<Link>): number {
        // Copy subgraph links
        let links = new Array<Link>();
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


    generateRandomMaximalSubMatching(subgraphLinks: Array<Link>): number{

        // Copy subgraph links
        let links = new Array<Link>();
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

    generateRandomMaximalMatching(): Array<Link>{
        
        // console.log(this.links.size);
        const matching = new Array<Link>();
        let links = new Array<Link>();
        for (const link of this.links.values()){
            links.push(link);
        }
        const vertices = new Set<VertexIndex>();

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
    vertexCoverNumber(): number {
        return this.vertexCoverV4()[0];
    }

    minVertexCover(): Set<VertexIndex> {
        return this.vertexCoverV4()[1];
    }


    /**
     * Return the maximum size of a clique extending `clique` if it is higher than record.
     * @param commonNeighbors is the set of commonNeighbors of clique. Therefore any vertex extending the clique should be taken in this set.
     * @param neighbors is the map of all the neighbors of every vertex.
     * @param currentMaximumClique It is immediately updated by the size of the clique.
    */
    private auxCliqueNumber( clique: Set<VertexIndex>, commonNeighbors: Set<VertexIndex>, neighbors: Map<VertexIndex, Set<VertexIndex>>, currentMaximumClique: Set<VertexIndex>): Set<VertexIndex>{

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
    maximumClique(cliqueSample?: Set<VertexIndex>): Set<VertexIndex> {
        const neighbors = new Map<VertexIndex, Set<VertexIndex>>();
        for (const vertex of this.vertices.values()){
            neighbors.set(vertex.index, new Set());
        }
        for (const link of this.links.values()){
            neighbors.get(link.startVertex.index)?.add(link.endVertex.index);
            neighbors.get(link.endVertex.index)?.add(link.startVertex.index);
        }

        let currentMaximumClique = (typeof cliqueSample != "undefined") ? cliqueSample: new Set<VertexIndex>();

        for (const [index, v] of this.vertices){
            const clique = new Set([index]);
            
            const commonNeighbors = new Set<VertexIndex>();
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
    private auxMinDominatingSet(subset: Set<Vertex>, toDominate: Array<Vertex>, choosable: Array<Vertex>, currentMin: Set<Vertex>, variant: undefined | DominationVariant, lowerBound: number): Set<Vertex>{
        if (toDominate.length == 0){
            if (subset.size < currentMin.size){
                if (variant == DominationVariant.Independent){
                    // Check that subset is Indep
                    // If there is an edge between the subset, then return the curretMin (and therefore do not update it)
                    // This branch could have cut above.
                    for (const x of subset){
                        for (const y of subset){
                            if (x.neighbors.has(y.index)){
                                return currentMin;
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
                            if (x.inNeighbors.has(y.index) || x.outNeighbors.has(y.index)){
                                return currentMin;
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
            let counter = 0;
            for (const x of toDominate){
                if (v.neighbors.has(x.index) || x.index == v.index){
                    counter ++;
                }
            }
            if (counter > bestCounter){
                bestCounter = counter;
                best = i;
            }
        }
        // let best = Math.floor(Math.random()*choosable.length);
        if (typeof best == "undefined"){
            return currentMin;
        } else {
            const v = choosable[best]
            const newToDominate = new Array();
            for (const x of toDominate){
                if (v.neighbors.has(x.index) == false && x != v){
                    newToDominate.push(x);
                }
            }

            choosable.splice(best, 1);
            
            if (newToDominate.length < toDominate.length){
                subset.add(v);
                currentMin = this.auxMinDominatingSet(subset, newToDominate, choosable, currentMin, variant, lowerBound);
                subset.delete(v);
            }
            currentMin = this.auxMinDominatingSet(subset, toDominate, choosable, currentMin, variant, lowerBound);
            
            choosable.push(v);

            return currentMin;
        }

    }


    private auxMinConnectedDominatingSet(subset: Set<Vertex>, toDominate: Array<Vertex>, choosable: Array<Vertex>, currentMin: Set<Vertex>,  lowerBound: number): Set<Vertex>{
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
                let counter = 0;
                for (const x of toDominate){
                    if (v.neighbors.has(x.index) || x.index == v.index){
                        counter ++;
                    }
                }
                if (counter > bestCounter){
                    bestCounter = counter;
                    best = i;
                }
        }
        // let best = Math.floor(Math.random()*choosable.length);
        if (typeof best == "undefined"){
            return currentMin;
        } else {
            const v = choosable[best]
            // console.log("branch ", v, vNeighbors);

                const newToDominate = new Array();
                for (const x of toDominate){
                    if ( v.neighbors.has(x.index) == false && x != v){
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
                for (const neighbor of v.neighbors.values()){
                    if (subset.has(neighbor) == false){
                        updatedChoosable.push(neighbor);
                    }
                }

                // console.log(updatedChoosable);
                // Case: take v
                // if (newToDominate.length < toDominate.length){
                    subset.add(v);
                    currentMin = this.auxMinConnectedDominatingSet(subset, newToDominate, updatedChoosable, currentMin, lowerBound);
                    subset.delete(v);
                // }
                // Case: do not take v

                choosable.splice(best, 1);
                currentMin = this.auxMinConnectedDominatingSet(subset, toDominate, choosable, currentMin, lowerBound);
                choosable.push(v);

                return currentMin;
            
        }

    }

    /**
     * @returns a distance-2 independent set
     * @algorithm random
     * @example
     * Graph.path(5).greedyLowerBoundDS().size; // = 2
     * @todo make it greedy by taking vertices that have the lowest degrees
     */
    private greedyLowerBoundDS(): Set<Vertex>{
        let choosable = new Array<Vertex>();
        const subset = new Set<Vertex>();
        for (const vId of this.vertices.values()){
            choosable.push(vId);
        }

        while (choosable.length > 0){
            const v = choosable.pop();
            if (typeof v != "undefined"){
                subset.add(v);
                const newChoosable = new Array();

                
                for (const w of choosable){
                    if (v.neighbors.has(w.index) == false && w != v){
                        let dist2 = false;
                        for (const wNeighbor of w.neighbors.keys()){
                            if (v.neighbors.has(wNeighbor)){
                                dist2 = true;
                                break;
                            }
                        }
                        if (dist2 == false){
                            newChoosable.push(w);
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
     * Graph.generatePath(5).minConnectedDominatingSet().size; // = 3
     * Graph.generateClique(3).minConnectedDominatingSet().size; // = 1
    */
    minConnectedDominatingSet(): Set<Vertex> | undefined{

        // If the graph is not connected, then there is no connected dominating set
        if (this.isConnected() == false){
            return undefined;
        }

        // Compute in polynomial time a dist2 independent set
        // The size of this set gives a lower bound on the minCDS
        const dist2independentSet = this.greedyLowerBoundDS();

        // Prepare for the algorithm
        let currentMin = new Set<Vertex>();
        for (const v of this.vertices.values()){
            currentMin.add(v);
        }


        // Start with every vertex
        for (const startVertexId of this.vertices.values()){
            // console.log("start vertex", startVertexId);
            const choosable = new Array<Vertex>();
            choosable.push(startVertexId);

            const toDominate = new Array<Vertex>();
            for (const vId of this.vertices.values()){
                toDominate.push(vId);
            }
            // console.log(choosable);
            // console.log(currentMin);

            currentMin = this.auxMinConnectedDominatingSet(new Set(), toDominate, choosable, currentMin, dist2independentSet.size);
        }
        console.log(currentMin);
        return currentMin;
    }

    /**
     * @returns a minimum dominating set: it is a subset X of the vertices such that all vertices of the graph are in X or adjacent to a vertex of X.
     * @example 
     * Graph.generatePath(5).minDominatingSet().size; // = 2
    */
    minDominatingSet(variant: undefined | DominationVariant): Set<Vertex>{

        // Compute in polynomial time a dist2 independent set
        // The size of this set gives a lower bound on the minDS
        // If it is a DS, then we have found a minDS
        const dist2independentSet = this.greedyLowerBoundDS();
        let isDominating = true;
        for (const vId of this.vertices.values()){
            let dominated = false;
            if (dist2independentSet.has(vId)){
                dominated = true;
                continue;
            }
            for (const vNeighbor of vId.neighbors.values()){
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
        const toDominate = new Array<Vertex>();
        const allVertices = new Set<Vertex>();
        const choosable = new Array<Vertex>();
        for (const vId of this.vertices.values()){
            allVertices.add(vId);
            toDominate.push(vId);
            choosable.push(vId);
        }
        return this.auxMinDominatingSet(new Set(), toDominate, choosable, allVertices, variant, dist2independentSet.size);
    }


    /**
     * @returns the size of a minimum dominating set
     * @example Graph.petersen().dominationNumber(); // = 3
     */
    dominationNumber(): number {
        return this.minDominatingSet(undefined).size;
    }

    /**
     * @returns the size of a minimum independent dominating set
     * @example Graph.petersen().independentDominationNumber(); // = 3
     */
    independentDominationNumber(): number {
        return this.minDominatingSet(DominationVariant.Independent).size;
    }

    /**
     * @returns the size of a minimum connected dominating set if the graph is connected
     * @returns undefined if the graph is not connected
     * @example 
     * Graph.generatePath(5).connectedDominationNumber(); // = 3
     * Graph.petersen().connectedDominationNumber(); // = 4
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
     * Graph.path(5).greedyLowerBoundDS().size; // = 2
     * @todo make it greedy by taking vertices that have the lowest degrees
     */
    greedyOrientedDist2IndepSet(): Set<Vertex>{
        let choosable = new Array<Vertex>();
        const subset = new Set<Vertex>();
        for (const v of this.vertices.values()){
            choosable.push(v);
        }

        while (choosable.length > 0){
            const v = choosable.pop();
            if (typeof v != "undefined"){
                subset.add(v);
                const newChoosable = new Array();

                const vNeighbors = this.getClosedDistInNeighborhood(v, 2);
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
    minDirectedFeedbackVertexSet(): Set<VertexIndex>{
        return minDFVS(this);
    }

    /**
     * 
     * @returns the minimum size of a DFVS
     * @example
     * Graph.orientedPath(5).directedFeedbackVertexSetNumber() == 0;
     * Graph.orientedCycle(3).directedFeedbackVertexSetNumber() == 1;
     * Graph.paley(7).directedFeedbackVertexSetNumber() == 4;
     */
    directedFeedbackVertexSetNumber(): number {
        return minDFVS(this).size;
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
    degreewidth(): [number, Array<Vertex>] {

        const corresp = new Map<VertexIndex, number>();
        const icorresp = new Array<Vertex>();
        const indegrees = new Array<number>();
        const outNeighbors = new Array<Set<number>>();
        let minInDegree = this.vertices.size;
        const pos = new Array<number>();
        const alpha = new Array();

        let n = 0;
        for (const v of this.vertices.values()){
            corresp.set(v.index, n);
            icorresp.push(v);
            const indegree = v.indegree();
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
                const ordering = new Array<Vertex>(n);
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





    

    
    




    setLinkCp(index: number, cp: Option<Coord>){
        const link = this.links.get(index);
        if (typeof link !== "undefined"){
            link.cp = cp;
        }
    }


    



   



   


    /**
     * Resets the edges of the graph so that they respect the Delaunay adjacency rule.
     */
    resetDelaunayGraph(){
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
                        this.addEdge(i1,i2);
                        this.addEdge(i1,i3);
                        this.addEdge(i2,i3);
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
            const v1 = link1.startVertex as Vertex;
            const w1 = link1.endVertex as Vertex;
            let z1 = v1.getPos().middle(w1.getPos());
            if (typeof link1.cp != "undefined"){
                z1 = link1.cp;
            }
            for (const [linkId2, link2] of this.links) {
                if ( linkId2 < linkId1){
                    const v2 = link2.startVertex as Vertex;
                    const w2 = link2.endVertex as Vertex;
                    let is_intersecting = false;
                    let z2 = v2.getPos().middle(w2.getPos());
                    // TODO: faster algorithm for intersection between segment and bezier
                    if (typeof link2.cp != "undefined"){
                        z2 = link2.cp;
                        is_intersecting = isQuadraticBezierCurvesIntersection(v1.getPos(), z1, w1.getPos(), v2.getPos(), z2, w2.getPos());
                    }
                    else {
                        if (typeof link1.cp == "undefined"){
                            is_intersecting = typeof segmentsInteriorIntersection(v1.getPos(), w1.getPos(), v2.getPos(), w2.getPos()) != "undefined"
                        } else {
                            is_intersecting = isQuadraticBezierCurvesIntersection(v1.getPos(), z1, w1.getPos(), v2.getPos(), z2, w2.getPos());
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
     */
    subdivideLinks(k: number, linksIndices?: Set<number>){
        linksIndices = linksIndices ?? (new Set(this.links.keys()));
        
        for (const linkId of linksIndices){
            const link = this.links.get(linkId);
            if (typeof link != "undefined"){
                link.subdivide(k);
            }
        }
    }

    /**
     * for every vertex of vertices_indices
     * add arcs between these vertices according to their x-coordinate
     */
    completeSubgraphIntoTournament(vertices_indices: Iterable<number>, arcDefault: (index: number, startVertex: Vertex, endVertex: Vertex) => Link){
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
                        if( this.hasArc(v1, v2) == false && this.hasArc(v2, v1) == false){
                            this.addArc(v1, v2);
                        }
                    } else {
                        if( this.hasArc(v1, v2) == false && this.hasArc(v2, v1) == false){
                            this.addArc(v2, v1);
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
    radius(weights: undefined | Map<number, number>): [number, VertexIndex] {
        const {distances, next} = this.FloydWarshall(weights);
        let currentMinRadius = Infinity;
        let currentCenter: VertexIndex = 0;
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
        const dist = new Map<VertexIndex, Map<VertexIndex, number>>();
        const next = new Map<VertexIndex, Map<VertexIndex, VertexIndex>>();

        for (const vIndex of this.vertices.keys()) {
            const distFromV = new Map<VertexIndex, number>();
            const nextFromV = new Map<VertexIndex, VertexIndex>();
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
     * @example Graph.cycle(5).longestGeodesic(undefined)[1]; // == 2
     */
    longestGeodesic(weights: undefined | Map<number, number>): [Array<VertexIndex>, number]{
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
     * @example Graph.cycle(5).diameter(); // == 2
     * @example Graph.clique(4).diameter(); // == 1
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
    minimumSpanningTree(): [number, Array<Link>] {
        const edges = new Array<[Link,number]>();
        for (const link of this.links.values()){
            if (link.orientation == ORIENTATION.UNDIRECTED){
                const parsedWeight = parseFloat(link.getWeight());
                const weight = isNaN(parsedWeight) ? 1 : parsedWeight;
                edges.push([link, weight]);
            }
        }
        edges.sort(([e,w],[e2,w2]) => w-w2);

        const component = new Map<VertexIndex, number>();
        for (const v of this.vertices.values()){
            component.set(v.index, v.stackedIndex);
        }

        let treeWeight = 0;
        const treeEdges = new Array<Link>();
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
                link.weight = String(d);
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



