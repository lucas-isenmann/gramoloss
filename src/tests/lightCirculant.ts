import { dichromatic } from "../algorithms/dichromatic";
import { AbstractGraph } from "../graph_abstract";
import { ORIENTATION } from "../link";


function createCirculantMatrix(k: number){
    
    let n = 1+Math.floor(Math.log2(k));
    // console.log(n)
    let N = 2*n+1;

    let m = new Array<Array<number>>();
    for (let i = 0; i < N; i ++){
        m.push([]);
        for (let j = 0; j < N; j ++){
            m[i].push(0)
        }
    }

    let d = n;
    while (k >= 1){
        // console.log(k, k%2)
        if (k % 2 == 1){
            for (let i = 0; i <N; i ++){
                m[i][ (i+d)%N] = 1;
            }
        } else {
            for (let i = 0; i <N; i ++){
                m[i][ (i+N-d)%N] = 1;
            }
        }
        d -= 1;
        k = Math.floor(k / 2);
    }

    return m;
}





function isTournamentMatrixLight(adj: Array<Array<number>>): boolean{
    const n = adj.length;
    const u = 0;
    // for (let u = 0; u < n; u ++){
        for (let v = 0; v < n ; v ++){
            if (adj[u][v]){
                for (let a = 0; a < n; a ++){
                    if (adj[a][u] && adj[v][a]){
                        for (let b = 0; b < n ; b ++){
                            if (adj[b][u] && adj[v][b] && adj[a][b]){
                                for (let c = 0; c < n; c ++){
                                    if (adj[c][u] && adj[v][c] && adj[b][c] && adj[c][a]){
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    // }
    return true;
}


for (let i = 1; i < 2**35; i ++){
    const m = createCirculantMatrix(i);
    if (isTournamentMatrixLight(m)){

        const g = new AbstractGraph();
        let n = m.length;
        for (let i= 0; i < n ; i ++){
            g.addVertex();
            for (let j = 0; j < i; j ++){
                if (m[i][j]){
                    g.addLink(i,j, ORIENTATION.DIRECTED);
                } else {
                    g.addLink(j,i, ORIENTATION.DIRECTED);
                }
            }
        }

        const dichro = dichromatic(g);
        if (dichro >= 3){
            console.log(i, i.toString(2), isTournamentMatrixLight(m), dichromatic(g));

        }

    }
}