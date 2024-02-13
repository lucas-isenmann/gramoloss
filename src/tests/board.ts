import { Board } from "../board";
import { Coord } from "../coord";
import { TextZone } from "../text_zone";
import { BasicVertexData } from "../traits";

const b = new Board();

b.graph.addVertex(new BasicVertexData(new Coord(0,0), "hello", "Neutral"));

console.log(b.get_value("Vertex", 0, "weight") == "hello");
console.log(b.get_value("Vertex", 0, "color") == "Neutral");

b.text_zones.set(0, new TextZone(new Coord(0,0), 100, "salut", 0))

const data1 = b.get_value("TextZone", 0, "text");
console.log(data1 == "salut"); // should return "salut"

console.log( b.get_value("TextZone", 0, "width") == 100);

const data2 = b.get_value("TextZone", 0, "c1");
console.log(data2); // should return undefined

const data3 = b.get_value("TextZone", 1, "text");
console.log(data3); // should return undefined