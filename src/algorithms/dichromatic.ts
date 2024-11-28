import { Graph } from "../graph";
import { Option } from "../option";
import { Vertex } from "../vertex";

function isConflict(triangle: [number, number, number], coloring: Array<number>): boolean {
    return coloring[triangle[0]] == coloring[triangle[1]] && coloring[triangle[0]] == coloring[triangle[2]] && coloring[triangle[0]] > 0;
}

function isSatisfied(triangle: [number, number, number], coloring: Array<number>): boolean {
    let color1 = 0;

    for (const x of triangle){
        if (coloring[x] > 0){
            if (color1 > 0 && coloring[x] != color1){
                return true;
            } else if (color1 == 0) {
                color1 = coloring[x];
            }
        }
    }
    return false;
}

function nbColored(triangle: [number, number, number], coloring: Array<number>): number {
    let nbCol = 0;
    for (const x of triangle){
        if (coloring[x] > 0){
            nbCol += 1;
        }
    }
    return nbCol;
}

function clean(todo: Array<number>, triangles: Array<[number, number, number]>,  coloring: Array<number>, colorMax: number): Array<number>{
    const newTodo = [];
    for (const i of todo){
        if ( isConflict(triangles[i], coloring)){ // coloring is the same
            return [];
        } else {
            if (isSatisfied(triangles[i], coloring)){ // there are 2 vertices having different colors
                continue;
            }
            newTodo.push(i);
        }
    }

    // sort newTodo by increasing number of colored
    return searchProperColoring(newTodo, triangles, coloring, colorMax )
}

function searchOptimalVertex(todo: Array<number>, triangles: Array<[number, number, number]>, coloring: Array<number>): number {
    const count = new Array(coloring.length).fill(0);
    let record = 0;
    let vertex = 0;
    for (const x of todo){
        const triangle = triangles[x];
        for (const v of triangle){
            if (coloring[v] == 0){
                count[v] ++;
                if (count[v] > record){
                    record = count[v];
                    vertex = v;
                }
            }
        }
    }
    return vertex;
}

function searchProperColoring(todo: Array<number>, triangles: Array<[number, number, number]>, coloring: Array<number>, colorMax: number): Array<number>{
    if (todo.length == 0){
        return coloring;
    }



    // plutot le x qui est dans le plus de todo triangles?

    const x = searchOptimalVertex(todo, triangles, coloring);
    for (let c = 1; c <= colorMax; c++){
        coloring[x] = c;
        const r = clean(todo, triangles,  coloring, colorMax);
        if (r.length > 0){
            return r;
        }
        coloring[x] = 0;
    }

    // const triangle = triangles[todo[0]];
    // for (const x of triangle){
    //     if (coloring[x] == 0){
    //         for (let c = 1; c <= colorMax; c++){
    //             coloring[x] = c;
    //             const r = clean(todo, triangles,  coloring, colorMax);
    //             if (r.length > 0){
    //                 return r;
    //             }
    //             coloring[x] = 0;
    //         }
    //         break;
    //     }
    // }
    return [];
}

export function acyclicColoring<V,L>(g: Graph<V,L>, colorMax: number): Array<number> {
    let n = g.vertices.size;
    const triangles = new Array<[number, number, number]>();
    let c = 0;
    const todo = [];
    for (let i = 0; i < n ; i ++){
        for (let j = 0; j < n; j ++){
            for (let k = 0; k < n ; k ++){
                if ( (i < j && j < k) || (i > j && j > k)){
                    if (g.hasArc(i,j) && g.hasArc(j,k) && g.hasArc(k,i)){
                        triangles.push([i,j,k]);
                        todo.push(c);
                        c += 1;
                    }
                }
               
            }
        }
    }
    const coloring = new Array(n).fill(0);
    return searchProperColoring(todo, triangles, coloring, colorMax)

    
}

export function dichromatic<V,L>(g: Graph<V,L>): number {
    for (let i = 1; i < g.vertices.size; i ++){
        if (acyclicColoring(g, i).length > 0){
            return i;
        }
    }
    return g.vertices.size;
}