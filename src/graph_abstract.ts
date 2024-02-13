import { generatePaleyGraph } from "./generators";
import { BasicGraph, Graph } from "./graph";
import { ORIENTATION } from "./link";
import { BasicLinkData, BasicVertexData } from "./traits";
import { Vertex } from "./vertex";

export class AbstractGraph extends Graph<void,void> {

    constructor(){
        super();
    }

    static fromEdgesListDefault(edgesList: Array<[number,number]>): AbstractGraph{
        const g = new AbstractGraph();
        for ( const [x,y] of edgesList){
            if (g.vertices.has(x) == false){
                g.set_vertex(x);
            }
            if (g.vertices.has(y) == false){
                g.set_vertex(y);
            }
        }
        for ( const [indexV1,indexV2] of edgesList){
            g.addLink(indexV1, indexV2, ORIENTATION.UNDIRECTED);
        }
        return g;
    }

    static fromArcsListDefault(arcsList: Array<[number,number]>): AbstractGraph{
        const g = new AbstractGraph();
        for ( const [x,y] of arcsList){
            if (g.vertices.has(x) == false){
                g.set_vertex(x);
            }
            if (g.vertices.has(y) == false){
                g.set_vertex(y);
            }
        }
        for ( const [indexV1,indexV2] of arcsList){
            g.addLink(indexV1, indexV2, ORIENTATION.DIRECTED);
        }
        return g;
    }

    /**
     * Returns a random graph with n vertices.
     * @param n number of vertices. Should be >= 0. Return empty graph if n < 1.
     * @param p probabilty of appearance of an edge. Should be between 0 and 1.
     */
    static generateRandomGNP(n: number, p: number): AbstractGraph {
        const g = new AbstractGraph();
        if (n < 1){
            return g;
        }
        for (let i = 0 ; i < n ; i ++){
            g.addVertex();
            for (let j = 0; j < i ; j ++){
                if (Math.random() < p){
                    g.addLink(i,j, ORIENTATION.UNDIRECTED);
                }
            }
        }
        return g;
    }

    static generateClique(n: number): AbstractGraph{
        const g = new AbstractGraph();
        for (let i = 0 ; i < n ; i ++){
            g.addVertex();
            for (let j = 0 ; j < i ; j ++){
                g.addLink(j,i, ORIENTATION.UNDIRECTED);
            }
        }
        return g;
    }

    /**
     * @param n is the number of vertices
     */
    static generatePath(n: number): AbstractGraph{
        const g = new AbstractGraph();
        for (let i = 0 ; i < n ; i ++){
            g.addVertex();
            if (i > 0) g.addLink(i-1,i, ORIENTATION.UNDIRECTED);
        }
        return g;
    }

    /**
     * See generatePaleyGraph for EmbeddedGraph
     */
    static generatePaley(p: number): AbstractGraph{
        const ge = generatePaleyGraph(p);
        const g = new AbstractGraph();
        for (const v of ge.vertices.values()){
            g.addVertex();
        }
        for (const link of ge.links.values()){
            g.addLink(link.startVertex.index, link.endVertex.index, link.orientation);
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
            g.set_vertex(linkId);
        }
        for (const link1 of graph.links.values()){
            for (const link2 of graph.links.values()){
                if (link1.index <= link2.index) continue;
                if (link1.startVertex.index == link2.startVertex.index || link1.startVertex.index == link2.endVertex.index || link1.endVertex.index == link2.startVertex.index || link1.endVertex.index == link2.endVertex.index){
                    g.addLink(link1.index, link2.index, ORIENTATION.UNDIRECTED);
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
            g.set_vertex(linkId);
        }
        for (const link1 of graph.links.values()){
            for (const link2 of graph.links.values()){
                if (link1.index <= link2.index) continue;
                if (link1.startVertex.index == link2.startVertex.index || link1.startVertex.index == link2.endVertex.index || link1.endVertex.index == link2.startVertex.index || link1.endVertex.index == link2.endVertex.index){
                    g.addLink(link1.index, link2.index, ORIENTATION.UNDIRECTED);
                } else if (link1.intersectsLink(link2)){
                    g.addLink(link1.index, link2.index, ORIENTATION.UNDIRECTED);
                }
            }
        }
        return g;
    }
}

