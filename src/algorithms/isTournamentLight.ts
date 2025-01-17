import { Graph } from "../graph";
import { Option } from "../option";
import { Vertex } from "../vertex";


/**
 * @param m is the TRANSPOSED adjacency matrix of a directed graph
 * @todo CHECK for loops
 * 
 * An arc u->v is said to be heavy if there exists vertices a, b, c such that
 * - a -> b -> c -> a is a cycle
 * - a,b,c -> u
 * - v -> a,b,c
 * 
 * @returns undefined if there is no heavy arc (in that case the matrix is light)
 * @returns [u,v,a,b,c] where u->v is an heavy arc
 */
export function searchHeavyArc(m: Array<Array<boolean>>): Option<Array<number>> {

    let n = m.length;

    const order = new Array<number>();
    for (let u = 0; u < n; u ++){
        for (let v = 0; v < n; v ++){
            if ( m[v][u] == false) { continue }; // Suppose m[v][u] = true so v <- u

            // If u->v is not heavy then the vertices x such that v -> x -> u should be acyclic
            // So there should be a partial order for them
            // So we reconstruct the partial order incrementally
            // If there is a vertex that cannot be inserted without conflicting with the current partial order then there is a triangle
            order.splice(0, order.length);

            for (let b = 0; b < n ; b ++){
                if ( m[b][v] ){ // b <- v
                    if (m[u][b] == false){ // u <- b
                        continue;
                    }
                    if( u== 4 && v == 1){
                        console.log("---", b)
                    }
                    let i = 0;
                    while (i < order.length){
                        const a = order[i];
                        if ( m[a][b] ){ // if a <- b break, it is the first in order, so order[k] -> b for every k<i
                            break;
                        }
                        i ++;
                    }
                    let isCycle = false;
                    let j = i+1;
                    while (j < order.length){
                        const c = order[j];
                        if ( m[b][c] ){ //  b <- order[j]
                            isCycle = true;
                            break;
                        }
                        j ++;
                    }
                    if( u== 4 && v == 1){
                        console.log(i, j, order, isCycle)
                    }
                    if (isCycle){
                        return [u,v,order[j],b,order[i]];
                    } else {
                        order.splice( i, 0, b);
                    }
                }
                
            }
        }
            
    }
    

    return undefined;
}

/**
 * We suppose u->v
 * @param outNeighbors 
 * @param inNeighbors 
 * @param u
 * @param v
 * @returns 
 */
export function searchHeavyArcDigraphAUXlocal(outNeighbors: Array<Array<number>>, inNeighbors: Array<Array<number>>, u: number, v: number ): Array<number>{
    const n = outNeighbors.length;

    // Type 1 conflict with uv (u->v is an heavy arc)
    const vertices = new Array<number>();
    for (const x of inNeighbors[u]){
        if (outNeighbors[v].includes(x)){
            vertices.push(x);
        }
    }

    for (const a of vertices){
        for (const b of vertices){
            if (outNeighbors[a].includes(b)){
                for (const c of vertices){
                    if (outNeighbors[b].includes(c) && inNeighbors[a].includes(c)){
                        // console.log("type 1")
                        return [u,v,a,b,c]
                    }
                }
            }
            
        }
    }

    // Type 2: uv is in the triangle (search for w the third vertex of the triangle)
    for (const w of outNeighbors[v]){
        if (outNeighbors[w].includes(u)){
            const dominated = new Array();
            for (const a of outNeighbors[v]){
                if (outNeighbors[u].includes(a) && outNeighbors[w].includes(a)){
                    dominated.push(a);
                }
            }
            for (const b of inNeighbors[v]){
                if (inNeighbors[u].includes(b) && inNeighbors[w].includes(b)){
                    for (const a of dominated){
                        if (outNeighbors[a].includes(b)){
                            // console.log("type 2")
                            return [a,b,u,v,w]
                        }
                    }
                }
            }
        }
    }


    // Type 3: v is in the triangle and u is endvertex of the searched heavy arc
    for (const w of outNeighbors[v]){
        if (outNeighbors[u].includes(w)){
            for (const x of outNeighbors[w]){
                if (outNeighbors[u].includes(x) && outNeighbors[x].includes(v)){
                    for (const y of outNeighbors[v]){
                        if (outNeighbors[x].includes(y) && outNeighbors[w].includes(y) && outNeighbors[y].includes(u)){
                            // console.log("type 3")
                            return [y,u,v,w,x]
                        }
                    }
                }
            }
        }
    }

    // Type 4: u is in the triangle and v is the start vertex of the searched heavy arc
    for (const w of outNeighbors[u]){
        if (outNeighbors[w].includes(v)){
            for (const x of outNeighbors[w]){
                if (outNeighbors[x].includes(v) && outNeighbors[x].includes(u)){
                    for (const y of outNeighbors[v]){
                        if (outNeighbors[y].includes(u) && outNeighbors[y].includes(w) && outNeighbors[y].includes(x)){
                            // console.log("type 4")
                            return [v,y,u,w,x]
                        }
                    }
                }
            }
        }
    }
    

    return []


    
}


export function searchLocalHeavyArcMatrix(matrix: Array<Array<boolean>>, u: number, v: number ): Array<number>{
    const n = matrix.length;

    // Type 1 conflict with uv (u->v is an heavy arc)
    const vertices = new Array<number>();
    for (let x = 0; x < n ; x ++){
        if (matrix[x][u] && matrix[v][x]){
            vertices.push(x);
        }
    }

    for (const a of vertices){
        for (const b of vertices){
            if (matrix[a][b]){
                for (const c of vertices){
                    if (matrix[b][c] && matrix[c][a]){
                        // console.log("type 1")
                        return [u,v,a,b,c]
                    }
                }
            }
            
        }
    }

    // Type 2: uv is in the triangle (search for w the third vertex of the triangle)
    for (let w = 0; w < n ; w ++){
        if (matrix[v][w] && matrix[w][u]){
            const dominated = new Array();
            for (let a = 0; a < n ; a ++){
                if (matrix[v][a] && matrix[u][a] && matrix[w][a]){
                    dominated.push(a);
                }
            }
            for (let b = 0 ; b < n ; b ++){
                if (matrix[b][v] && matrix[b][u] && matrix[b][w]){
                    for (const a of dominated){
                        if (matrix[a][b]){
                            // console.log("type 2")
                            return [a,b,u,v,w]
                        }
                    }
                }
            }
        }
    }


    // Type 3: v is in the triangle and u is endvertex of the searched heavy arc
    for (let w = 0; w < n; w ++){
        if (matrix[v][w] && matrix[u][w]){
            for (let x = 0; x < n ; x ++){
                if (matrix[w][x] && matrix[u][x] && matrix[x][v]){
                    for (let y = 0; y < n ; y ++){
                        if (matrix[v][y] && matrix[x][y] && matrix[w][y] && matrix[y][u]){
                            // console.log("type 3")
                            return [y,u,v,w,x]
                        }
                    }
                }
            }
        }
    }

    // Type 4: u is in the triangle and v is the start vertex of the searched heavy arc
    for (let w = 0; w < n ; w ++){
        if (matrix[u][w] && matrix[w][v]){
            for (let x = 0; x < n ; x ++){
                if (matrix[w][x] && matrix[x][v] && matrix[x][u]){
                    for (let y = 0; y < n ; y ++){
                        if (matrix[v][y] && matrix[y][u] && matrix[y][w] && matrix[y][x]){
                            // console.log("type 4")
                            return [v,y,u,w,x]
                        }
                    }
                }
            }
        }
    }
    

    return []

}



export function searchHeavyArcDigraphAUX(outNeighbors: Array<Array<number>>, inNeighbors: Array<Array<number>> ): Array<number>{
    const n = outNeighbors.length;
    for (let u = 0; u < n ; u ++){
        for (const v of outNeighbors[u]){
            const vertices = new Array<number>();
            for (const x of inNeighbors[u]){
                if (outNeighbors[v].includes(x)){
                    vertices.push(x);
                }
            }

            for (const a of vertices){
                for (const b of vertices){
                    if (outNeighbors[a].includes(b)){
                        for (const c of vertices){
                            if (outNeighbors[b].includes(c) && inNeighbors[a].includes(c)){
                                return [u,v,a,b,c]
                            }
                        }
                    }
                    
                }
            }
        }
    }
    

    return []

}


function getDiAdjacencyLists<V,L>(g: Graph<V,L>): [Array<Array<number>>, Array<Array<number>>] {
    let [indices, reverse] = g.getStackedIndices();
    const n = g.vertices.size;
    let outNeighbors = new Array<Array<number>>(n);
    let inNeighbors = new Array<Array<number>>(n);
    
    for (let u = 0; u < n; u ++){
        outNeighbors[u] = new Array<number>();
        for (const vId of g.getOutNeighborsList(reverse[u])){
            const v = indices.get(vId);
            if (typeof v != "undefined"){
                outNeighbors[u].push(v);
            }
        }
        inNeighbors[u] = new Array<number>();
        for (const vId of g.getInNeighborsList(reverse[u])){
            const v = indices.get(vId);
            if (typeof v != "undefined"){
                inNeighbors[u].push(v);
            }
        }
    }

    return [outNeighbors, inNeighbors]

}


export function searchHeavyArcDigraph<V,L>(g: Graph<V,L>): Array<number>{

    const [outNeighbors, inNeighbors] = getDiAdjacencyLists(g);


    return searchHeavyArcDigraphAUX(outNeighbors, inNeighbors);
}


export function tournamentLightConflict<V,L>(g: Graph<V,L>): Option<Array<Vertex<V>>> {
    for (const [_, u] of g.vertices){
        for (const v of g.getOutNeighbors(u)){
            const order = new Array<Vertex<V>>();


            for (const b of g.getOutNeighbors(v)){
                if (g.hasArc(b.index,u.index) == false){
                    continue;
                }
                let i = 0;
                while (i < order.length){
                    const a = order[i];
                    if ( g.hasArc(b.index, a.index) ){
                        break;
                    }
                    i ++;
                }
                let isCycle = false;
                let j = i+1;
                while (j < order.length){
                    const c = order[j];
                    if ( g.hasArc(b.index, c.index)){
                    } else {
                        isCycle = true;
                        break;
                    }
                    j ++;
                }
                if (isCycle){
                    return [u,v,order[j],b,order[i]];
                } else {
                    order.splice( i, 0, b);
                }
            }
        }
    }
    return undefined;
}



/**
 * A tournament is light if there is no arc uv such that there exists a cycle abc such that abc dominates u and v dominates abcs.
 * If you want to get a conflict, if there is some, use the function tournamentLightConflict
 * @param g 
 * @returns 
 */
export function isTournamentLight<V,L>(g: Graph<V,L>): boolean {
    // const m = g.getDirectedMatrix();
    return searchHeavyArcDigraph(g).length == 0;
    if (typeof searchHeavyArcDigraph(g) == "undefined"){
        return true;
    } else {
        return false;
    }
}


function findDeductions(outNeighbors: Array<Array<number>>, inNeighbors: Array<Array<number>>, u: number, v: number): Array<[number,number]>{
    const n = outNeighbors.length;
    const pairs = new Array();
    const inDominators = new Array();
    const outDominators = new Array();
    for (let w = 0; w < n; w ++){
        if( outNeighbors[v].includes(w) && inNeighbors[u].includes(w)){
            inDominators.splice(0, inDominators.length)
            outDominators.splice(0, outDominators.length);
            for (let a = 0; a < n ; a ++){
                let c = 0;
                for (const x of outNeighbors[a]){
                    if (x == u || x == v || x == w){
                        c ++;
                    }
                }
                if (c == 3){
                    inDominators.push(a);
                    for (const b of outDominators){
                        if ( outNeighbors[a].includes(b) == false){
                            pairs.push([a,b]);
                        }
                    }
                    continue;
                }

                c = 0;
                for (const x of inNeighbors[a]){
                    if (x == u || x == v || x == w){
                        c ++;
                    }
                }
                if (c == 3){
                    outDominators.push(a);
                    for (const b of inDominators){
                        if ( inNeighbors[a].includes(b) == false){
                            pairs.push([b,a]);
                        }
                    }
                }
            }
        }
    }

    return pairs;
}





export function hasLightTournamentExtension<V,L>(g: Graph<V,L>): [boolean, Array<[number, number, boolean, Array<[number, number]>, boolean]>] {

    const n = g.vertices.size;
    const [indices, reverse] = g.getStackedIndices();

    const [outNeighbors, inNeighbors] = getDiAdjacencyLists(g);
    // console.log(n)
    // console.log(outNeighbors)
    // console.log(inNeighbors);


    const todo = new Array<[number, number, boolean]>();

    for (let i = 0; i < n ; i ++){
        for (let j = i+1; j < n ; j ++){
            if (outNeighbors[i].includes(j) == false && inNeighbors[i].includes(j) == false){
                todo.push([i,j,false]);
            }
        }
    }

    // console.log(todo);


    const done = new Array<[number, number, boolean, Array<[number, number]>, boolean]>();

    while (true){
        // console.log("-------")
        // console.log("todo", todo)
        // console.log("done", done);
        let edge = todo.pop();
        if (typeof edge == "undefined"){
            // console.log(done)
            return [true, done];
        } 
        let [u,v, b] = edge;

        if (b == false){
            if (outNeighbors[u].includes(v)){
                done.push([u,v,false, [], true])
                console.log("yo")
                continue;
            }
        } else {
            if (outNeighbors[v].includes(u)){
                done.push([u,v,true, [], true])
                console.log("ya")
                continue;
            }
        }


        if (b == false){

            if (outNeighbors[u].includes(v)){
                console.log("BUG",u, v)
            }

            outNeighbors[u].push(v);
            inNeighbors[v].push(u);

            


            if (searchHeavyArcDigraphAUXlocal(outNeighbors, inNeighbors, u, v).length > 0){
                outNeighbors[u].pop();
                inNeighbors[v].pop();
    
                todo.push([u,v,true])
                    
    
            } else {
                const pairs = findDeductions(outNeighbors, inNeighbors, u, v);
                for (const [a,b] of pairs){
                    outNeighbors[a].push(b);
                    inNeighbors[b].push(a);
                }

                let isDeductionOK = true;
                for (const [a,b] of pairs){
                    if (searchHeavyArcDigraphAUXlocal(outNeighbors, inNeighbors, a, b).length > 0){
                        isDeductionOK = false;
                    }
                }
                if (isDeductionOK == false){
                    outNeighbors[u].pop();
                    inNeighbors[v].pop();
                    for (const [a,b] of pairs){
                        outNeighbors[a].pop();
                        inNeighbors[b].pop();
                    }
        
                    todo.push([u,v,true])
                } else {
                    done.push([u,v,false, pairs, false])
                }
            }
        } else {
            outNeighbors[v].push(u);
            inNeighbors[u].push(v);
            let isBad = searchHeavyArcDigraphAUXlocal(outNeighbors, inNeighbors,v, u).length > 0;

            let deductions = new Array<[number,number]>;
            let isDeductionOK = true;

            if (isBad == false){
                deductions = findDeductions(outNeighbors, inNeighbors, u, v);
                for (const [a,b] of deductions){
                    outNeighbors[a].push(b);
                    inNeighbors[b].push(a);
                }
                for (const [a,b] of deductions){
                    if (searchHeavyArcDigraphAUXlocal(outNeighbors, inNeighbors, a, b).length > 0){
                        isDeductionOK = false;
                    }
                }
            }
            

            if (isBad || isDeductionOK == false ){
                outNeighbors[v].pop();
                inNeighbors[u].pop();

                for (const [a,b] of deductions){
                    outNeighbors[a].pop();
                    inNeighbors[b].pop();
                }

                todo.push([u,v,false])
                let i = 0;
                 // backtrack
                 while(true){
                    i ++;
                    const pair = done.pop()
                    if (typeof pair == "undefined"){
                        return [false, []];
                    } else {
                        const [x,y,t, pairs, isDeduced] = pair;
                        if (isDeduced){
                            continue;
                        }
                        for (const [a,b] of pairs){
                            outNeighbors[a].pop();
                            inNeighbors[b].pop();
                        }
                        if (t == false){
                            outNeighbors[x].pop();
                            inNeighbors[y].pop();
                            todo.push([x,y,true])
                            break
                        }
                        else {
                            outNeighbors[y].pop();
                            inNeighbors[x].pop();
                            todo.push([x,y,false])
                        }
                    }
                }
                
            } else {
                
                done.push([u,v,true, deductions, false])
            }
        }

    }

    console.log("empty graph case")
    return [true, []];
}







// -------------------
// V 2 with matrix



function findDeductionsMatrix(matrix: Array<Array<boolean>>, u: number, v: number): Array<[number,number]>{
    const n = matrix.length;
    const pairs = new Array();
    const inDominators = new Array();
    const outDominators = new Array();
    for (let w = 0; w < n; w ++){
        if( matrix[v][w] && matrix[w][u] ){
            inDominators.splice(0, inDominators.length)
            outDominators.splice(0, outDominators.length);
            for (let a = 0; a < n ; a ++){
                let c = 0;
                for (let x = 0; x < n ; x ++){
                    if (matrix[a][x] && (x == u || x == v || x == w)){
                        c ++;
                    }
                }
                if (c == 3){
                    inDominators.push(a);
                    for (const b of outDominators){
                        if (matrix[a][b] == false){
                            pairs.push([a,b]);
                        }
                    }
                    continue;
                }

                c = 0;
                for (let x = 0; x < n ; x ++){
                    if (matrix[x][a] && (x == u || x == v || x == w)){
                        c ++;
                    }
                }
                if (c == 3){
                    outDominators.push(a);
                    for (const b of inDominators){
                        if ( matrix[b][a] == false){
                            pairs.push([b,a]);
                        }
                    }
                }
            }
        }
    }

    return pairs;
}




export function hasLightTournamentExtension2<V,L>(g: Graph<V,L>): [boolean, Array<[number, number, boolean, Array<[number, number]>, boolean]>] {

    const n = g.vertices.size;
    const [indices, reverse] = g.getStackedIndices();

    const m = g.getDirectedMatrix()


    const todo = new Array<[number, number, boolean]>();

    for (let i = 0; i < n ; i ++){
        for (let j = i+1; j < n ; j ++){
            if (m[i][j] == false && m[j][i] == false){
                todo.push([i,j,false]);
            }
        }
    }

    // console.log(todo);


    const done = new Array<[number, number, boolean, Array<[number, number]>, boolean]>();

    while (true){
        // console.log("-------")
        // console.log("todo", todo)
        // console.log("done", done);
        let edge = todo.pop();
        if (typeof edge == "undefined"){
            // console.log(done)
            return [true, done];
        } 
        let [u,v, b] = edge;

        if (b == false){
            if (m[u][v]){
                done.push([u,v,false, [], true])
                // console.log("yo")
                continue;
            }
        } else {
            if (m[v][u]){
                done.push([u,v,true, [], true])
                // console.log("ya")
                continue;
            }
        }


        if (b == false){

            if (m[u][v]){
                console.log("BUG",u, v)
            }

            m[u][v] = true;

            


            if (searchLocalHeavyArcMatrix(m, u, v).length > 0){
                m[u][v] = false;
                todo.push([u,v,true])
    
            } else {
                const pairs = findDeductionsMatrix(m, u, v);
                for (const [a,b] of pairs){
                    m[a][b] = true;
                }

                let isDeductionOK = true;
                for (const [a,b] of pairs){
                    if (searchLocalHeavyArcMatrix(m,u,v).length > 0){
                        isDeductionOK = false;
                    }
                }
                if (isDeductionOK == false){
                    m[u][v] = false;
                    for (const [a,b] of pairs){
                        m[a][b] = false;
                    }
        
                    todo.push([u,v,true])
                } else {
                    done.push([u,v,false, pairs, false])
                }
            }
        } else {
            m[v][u] = true;
            let isBad = searchLocalHeavyArcMatrix(m, v, u).length > 0;

            let deductions = new Array<[number,number]>;
            let isDeductionOK = true;

            if (isBad == false){
                deductions = findDeductionsMatrix(m, u, v);
                for (const [a,b] of deductions){
                    m[a][b] = true;
                }
                for (const [a,b] of deductions){
                    if (searchLocalHeavyArcMatrix(m, a, b).length > 0){
                        isDeductionOK = false;
                    }
                }
            }
            

            if (isBad || isDeductionOK == false ){
                m[v][u] = false

                for (const [a,b] of deductions){
                    m[a][b] = false;
                }

                todo.push([u,v,false])
                let i = 0;
                 // backtrack
                 while(true){
                    i ++;
                    const pair = done.pop()
                    if (typeof pair == "undefined"){
                        return [false, []];
                    } else {
                        const [x,y,t, pairs, isDeduced] = pair;
                        if (isDeduced){
                            continue;
                        }
                        for (const [a,b] of pairs){
                            m[a][b] = false;
                        }
                        if (t == false){
                            m[x][y] = false;
                            todo.push([x,y,true])
                            break
                        }
                        else {
                            m[y][x] = false
                            todo.push([x,y,false])
                        }
                    }
                }
                
            } else {
                
                done.push([u,v,true, deductions, false])
            }
        }

    }

    console.log("empty graph case")
    return [true, []];
}