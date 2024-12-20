import { Graph } from "../graph";


function swapAroundRand(i: number,j: number, sums: Array<number>, adj: Array<Array<number>>, labels: Array<number>, edgeAdj: Array<[number, number]>){
    console.log("swap", i, j)
    while(true){
        const ri = Math.floor(Math.random()*adj[i].length);
        const rj = Math.floor(Math.random()*adj[j].length);
        const ei = adj[i][ri];
        const ej = adj[j][rj];
    
        if (ei != ej){
            const diff = labels[ei] - labels[ej];
            const [i1, i2] = edgeAdj[ei];
            sums[i1] -= diff;
            sums[i2] -= diff;
            const [j1, j2] = edgeAdj[ej];
            sums[j1] += diff;
            sums[j2] += diff;
            const temp = labels[ei];
            labels[ei] = labels[ej];
            labels[ej] = temp;
            return;
        }
    }
}




export function antimagicGreedyLabelling<V,L>(g: Graph<V,L>): Map<number, number> {
    const n = g.vertices.size;
    const m = g.links.size;
    const edgeIds = new Map<number, number>();
    const vertexIds = new Map<number,number>();
    const labels = new Array<number>(m); // init: labels[i] = i
    const sums = new Array<number>(n); // init: 0
    const edgeAdj = new Array<[number, number]>(m);

    let k = 0;
    for (const [linkId, link] of g.links){
        edgeIds.set(linkId, k);
        k ++;
    }

    k = 0;
    for (const [vId, vertex] of g.vertices){
        vertexIds.set(vId, k);
        k ++;
    }

    for (let i = 0; i < m ; i ++){
        labels[i] = i+1;
    }

    const adj = new Array<Array<number>>(n);
    for (let i = 0; i < n ; i ++){
        adj[i] = new Array<number>();
    }

    for ( const [linkId, link] of g.links){
        const v1 = vertexIds.get(link.startVertex.index);
        const v2 = vertexIds.get(link.endVertex.index);
        const e = edgeIds.get(linkId);
        if (typeof e != "undefined" && typeof v1 != "undefined" && typeof v2 != "undefined"){
            edgeAdj[ e ] = [v1, v2];
            adj[v1].push(e)
            adj[v2].push(e);
        }
    }

    for (let i = 0; i < n ; i ++){
        sums[i] = 0;
        for (const edgeId of adj[i]){
            sums[i] += labels[edgeId];
        }
    }

    console.log("labels", labels)
    console.log("sums", sums)
    console.log("adj (v, [edge])", adj)
    console.log("edge adj (edge, [v1,v2])", edgeAdj);

    while (true){
        let isThereConflict = false;
        for (let i = 0; i < n ; i ++){
            for (let j = 0; j < i; j ++){
                if (sums[i] == sums[j]){
                    swapAroundRand(i,j, sums, adj, labels, edgeAdj);
                    isThereConflict = true;
                    break;
                }
            }
            if (isThereConflict){
                break;
            }
        }
        if (isThereConflict == false){
            const res = new Map();
            for (const [linkId, link] of g.links){
                const stackId = edgeIds.get(linkId);
                if (typeof stackId != "undefined"){
                    res.set(linkId, labels[stackId])
                }
            }
            return res;
        }
    }
}



export function isAntimagic<V,L>(g: Graph<V,L>): boolean {
    const m = g.links.size;

    const matrix = g.getMatrix();

    
    
    

    return false;
}