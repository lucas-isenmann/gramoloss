    /*
    GENERIC Graph definition


    */


    interface Vertexable {
        index: number;
    }

    interface Linkable<V extends Vertexable, LD> {
        index: number;
        startVertex: V;
        endVertex: V;
        data: LD;
        from(index: number) : boolean
    }

    export class Graph2< LinkData, Vertex2 extends Vertexable, Link2 extends Linkable<Vertex2, LinkData> > {
        vertices: Map<number, Vertex2>;
        links: Map<number, Link2>;

        constructor() {
            this.vertices = new Map();
            this.links = new Map();
        }

        setLink(index: number, startId: number, endId: number, data: LinkData){
            const newLink = Link2.from(index);
            // -> c'est la merde non ?
        }

    }