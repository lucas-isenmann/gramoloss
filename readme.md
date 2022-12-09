# Gramoloss

Graph theory tools

## Install

    npm install gramoloss

## Use

## Example

```typescript
import {Graph} from "gramoloss";
const g = Graph.from_list([[0,1],[0,2],[1,2]]); // create an undirected graph from list of edges
const d = g.max_degree(); // d = 2
const b = g.has_cycle(); // b = true
for (const v of g.get_neighbors_list(0)){
    console.log(v) // print 1 and 2
}

```

## Contribute

## License

MIT
