# Gramoloss

Graph (or network) theory tools.

This package contains a graph structure based on a map of edges and arcs (called links). Matrix graph structure is on the road map but not implemented for the moment. Several graph parameters are implemented (like degree statistics, chromatic number, ...). Furthermore it contains board structure for editing and interacting with a graph (with areas, strokes, text zones).

## Install

    npm install gramoloss

## Examples

```typescript
import {Graph} from "gramoloss";
const g = Graph.from_list([[0,1],[0,2],[1,2]]); // create an undirected graph from list of edges
const d = g.max_degree(); // d = 2
const b = g.has_cycle(); // b = true
for (const v of g.get_neighbors_list(0)){
    console.log(v) // print 1 and 2
}
```

Chromatic number:

```typescript
import {Graph} from "gramoloss";
const g = Graph.from_list([[0,1],[0,2],[1,2]]); // create the graph K3
console.log(g.chromatic_number()); // prints 3
```

## Notions

*Links* are either edges or arcs. Loops are for the moment unimplemented.

*Parameters* are function which do not modify the graph and which computes in most cases an integer (for example the chromatic number).

*Generators* are function which return a graph (like generating a random graph with the GNP method).

*Modifiers* are function which modify the underlying graph and which do not return anything (like removing all the leaves of a graph).

*Representations* are structures which represent the graph with a particular geometrical point of view. For example planar graphs can be represented by contact of circles (unimplemented). An other example is to represent tournaments on a line with only the backwards which are drawn.

## Contribute

There are a lot of parameters, generators, modifiers and tests to write. It is planned also to rewrite this package in Rust and to generate a typescript package with WASM.

## License

MIT
