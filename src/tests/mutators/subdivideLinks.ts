import { Coord } from "../../coord";
import { BasicGraph } from "../../graph";
import { BasicLink, ORIENTATION } from "../../link";
import { BasicLinkData, BasicVertexData } from "../../traits";
import { BasicVertex } from "../../vertex";

const g = new BasicGraph();

const v0 = new BasicVertex(0, new BasicVertexData(new Coord(0,0), "", "" ))
const v1 = new BasicVertex(1, new BasicVertexData(new Coord(1,1), "", "" ))
const a1 = new BasicLink(0, v0, v1, ORIENTATION.DIRECTED, new BasicLinkData(undefined, "", "blue"));
g.vertices.set(0,v0);
g.vertices.set(1,v1);
g.links.set(0,a1);

g.subdivideLinks(new Set([0]), 3, (index, pos) => new BasicVertex(index, new BasicVertexData(pos, "", "")), (index, orientation, color, startVertex, endVertex) => new BasicLink(index, startVertex, endVertex, orientation, new BasicLinkData(undefined, "", color)) );

for (const v of g.vertices.values()){
    console.log(v.index, v.data.pos, v.data.color, v.data.weight);
}

for (const link of g.links.values()){
    console.log(link.index, link.startVertex.index, link.endVertex.index, link.orientation, link.data.cp, link.data.color, link.data.weight);
}




