# Gramoloss

Graph (or network) theory tools.

This package contains a graph structure based on a map of edges and arcs (called links). Matrix graph structure is on the road map but not implemented for the moment. Several graph parameters are implemented (like degree statistics, chromatic number, vertex cover number, clique number, ...).

It is still in developpement.

This package is mainly devoted to the online collaborative graph editor [gracoon.com](http://gracoon.com) :rocket:

## Install

    npm install gramoloss

## Examples

```typescript
import {AbstractGraph} from "gramoloss";
const g = AbstractGraph.fromEdgesListDefault([[0,1],[0,2],[1,2]]); // create an undirected graph from list of edges
const d = g.maxDegree(); // d = 2
const b = g.hasCycle(); // b = true
for (const v of g.getNeighborsList(0)){
    console.log(v) // print 1 and 2
}
```

Chromatic number:

```typescript
import {AbstractGraph} from "gramoloss";
const g = AbstractGraph.fromEdgesListDefault([[0,1],[0,2],[1,2]]); // create the graph K3
console.log(g.chromaticNumber()); // prints 3
```

## Notions

*Links* are either edges or arcs. Loops are for the moment unimplemented.

*Parameters* are function which do not modify the graph and which computes in most cases an integer (for example the chromatic number).

*Generators* are function which return a graph (like generating a random graph with the GNP method).

*Mutators* are function which modify the underlying graph and which do not return anything (like removing all the leaves of a graph).

*Representations* are structures which represent the graph with a particular geometrical point of view. For example planar graphs can be represented by contact of circles (unimplemented). An other example is to represent tournaments on a line with only the backwards which are drawn.

## Contribute

There are a lot of parameters, generators, modifiers and tests to write. It is planned also to rewrite this package in Rust and to generate a typescript package with WASM.

## License

MIT
