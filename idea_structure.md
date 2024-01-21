# Ideas for V2

## Neighbors, inNeighbors and outNeighbors in Graph class

In some cases, having the list of neighbors would be more efficient:

class Graph could have attributes
- `neighbors: Map<VertexIndex, Set<VertexIndex>>`
- same with inNeighbors and outNeighbors

but it is redondant with Links.

## Vertex and links methods using the Graph ?? Bof bof

Vertex can include the Graph so that it could be possible 
- v.degree() 
- v.connectedComponent()

But they should only be refacto of Graph methods:
- v.degree() = g.degree(v)
- v.connectedComponent() = g.connectedComponentOf(v)

Problem: it creates a recursive class