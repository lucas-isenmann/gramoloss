import { generatePaleyGraph } from "./generators";
import { BasicGraph, Graph } from "./graph";
import { ORIENTATION } from "./link";
import { BasicLinkData, BasicVertexData } from "./traits";

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
     * @param n is the number of vertices
     */
    static generatePath(n: number): AbstractGraph{
        const g = new AbstractGraph();
        for (let i = 0 ; i < n ; i ++){
            g.addVertex();
            if (i > 0) g.addLink(i-1,i, ORIENTATION.UNDIRECTED, null);
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
            g.addLink(link.startVertex.index, link.endVertex.index, link.orientation, null);
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

