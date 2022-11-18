# Gramoloss

Graph theory tools

## Install

    npm install gramoloss

## Use

## Example

```typescript
import {Graph,Vertex,Link, ORIENTATION} from "gramoloss";
const g = new Graph();
g.add_vertex(new Vertex(100,300,""));
g.add_vertex(new Vertex(200,300,""));
g.add_link(new Link(0,1,new Coord(200,200), ORIENTATION.UNDIRECTED, "black", ""));
```

## Contribute

## License

MIT
