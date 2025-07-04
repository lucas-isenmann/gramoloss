# Gramoloss

Graph (or network) theory tools.

This package contains a graph structure mixing list adjacencies and matrices. Several graph parameters are implemented (degree statistics, chromatic number, vertex cover number, clique number, domination number, ...).

This package is mainly devoted to the online collaborative graph editor [gracoon.com](https://www.gracoon.com) :rocket:

## Install

    npm install gramoloss

## Examples

### Graph edition

```typescript
import {Graph} from "gramoloss";
const g = new Graph();
g.addVertex(0);
g.addVertex('a');
g.addLink(0, 'a');
g.nbVertices(); // = 2
g.nbEdges(); // = 1
```

```typescript
const g = Graph.fromEdges([[0,1],[0,2],[1,2]]); // Create an undirected graph from list of edges
g.maxDegree(); // = 2
g.hasCycle(); // = true
```

### Chromatic number

```typescript
const g = Graph.clique(3); // Create the graph K3
g.chromaticNumber(); // = 3
```

## Notions

- Graph structure allow having edges and arcs simultaneously
- Multiple edges and multiple arcs are allowed
- Loops are allowed



## Contribute

There are a lot of parameters, generators, modifiers and tests to write. It is planned also to rewrite this package in Rust and to generate a typescript package with WASM.

## License

MIT
