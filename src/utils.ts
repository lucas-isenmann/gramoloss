import { Coord } from "./coord";
import { Option } from "./option";

// ---------------------
// decide if there is equality between two sets xs and ys
export function eqSet (xs: Set<number>, ys: Set<number>): boolean {
    return xs.size === ys.size && [...xs].every((x) => ys.has(x));
}

/**
 * (1-t)^2 p0 + 2t(1-t)p1 + t^2 p2
 */
export function bezierValue(t: number, p0: number, p1: number, p2: number) {
    return (1.0 - t) * (1.0 - t) * p0 + 2.0 * (1.0 - t) * t * p1 + t * t * p2;
}

/**
 *  Compute the binomial coefficient C(n,k) by recurrence
 *  */
export function binomial_coef(n: number, k: number): number{
    if ( k == 0 || k == n ){
        return 1;
    }else if ( n < k){
        return 0;
    } else {
        return binomial_coef(n-1,k) + binomial_coef(n-1,k-1)
    }
}

// -------------
// Compute B(t) where t is in [0,1] and B is a Bezier curve given by its list of points
export function bezier_curve_point(t: number, points: Array<Coord>): Coord {
    const n = points.length-1;
    const q = 1 - t;
    let r = new Coord(0,0);
    let ti = 1; // ti = t^i
    let qi = q**n // qi = q^(n-i)
    for (let i = 0 ; i <= n ; i ++){
        const cni = binomial_coef(n,i);
        r.x += cni * qi * ti * points[i].x;
        r.y += cni * qi * ti * points[i].y;
        ti *= t;
        qi /= q;
    }
    return r;
}



// ---------------------
// Solve equation t u + t'v = c where u, v and c are 2d vectors
// return false if there is no solution
export function solve_linear_equation_2d( u: Coord, v: Coord, c: Coord){
    const det = u.x * v.y - u.y * v.x;
    if (det == 0){
        return false;
    }
    const t1 = (c.x * v.y - c.y * v.x )/det;
    const t2 = (c.y * u.x - c.x * u.y )/det;
    return [t1,t2];
}

// ---------------------
// TODO : check the 0.01 precision
/**
 * Search for an intersection between the segments [a,b] and [c,d].
 * Returns an Option with the coord of the intersection if it exists.
 */
export function is_segments_intersection(a: Coord, b: Coord, c: Coord, d: Coord): boolean{
    const r = segmentsIntersection(a,b,c,d);
    return typeof r === "undefined" ? false : true;
}

/**
 * UNTESTED
 * Search for an intersection between the segments [a,b] and [c,d].
 * Returns an Option with the coord of the intersection if it exists.
 */
export function segmentsIntersection(a: Coord, b: Coord, c: Coord, d: Coord): Option<Coord>{
    const det = (a.x-b.x)*(d.y-c.y) - (a.y-b.y)*(d.x-c.x);
    if ( det == 0) {
        return undefined;
    }
    const t1 = ((d.x-b.x)*(d.y-c.y) + (d.y-b.y)*(-(d.x-c.x))) / det;
    const t2 = ((d.x-b.x)*(-(a.y-b.y))+(d.y-b.y)*(a.x-b.x)) / det;
    const condition =  0.01 < t1 && t1 < 0.99 && 0.01 < t2 && t2 < 0.99;
    if (condition){
        return new Coord(b.x + t1*(a.x-b.x), b.y + t1*(a.y-b.y));
    } else {
        return undefined;
    }
}

/**
 * UNTESTED
 * Search for an intersection between the lines (AB) and (CD).
 * Returns an Option with the coord of the intersection if it exists.
 */
export function linesIntersection(a: Coord, b: Coord, c: Coord, d: Coord): Option<Coord>{
    const det = (a.x-b.x)*(d.y-c.y) - (a.y-b.y)*(d.x-c.x);
    if ( det == 0) {
        return undefined;
    }
    const t1 = ((d.x-b.x)*(d.y-c.y) + (d.y-b.y)*(-(d.x-c.x))) / det;
    return new Coord(b.x + t1*(a.x-b.x), b.y + t1*(a.y-b.y));
}



// ---------------------
// Given a point and triangle defined by its three corners q1, q2 and q3
// Returns true iff point is in the triangle
export function is_point_in_triangle(point: Coord, q1: Coord, q2: Coord, q3: Coord): boolean{
    const sol = solve_linear_equation_2d(q1.sub(q3), q2.sub(q3), point.sub(q3));
    if ( typeof sol == "boolean"){
        return false;
    }
    else {
        const r = sol[0];
        const s = sol[1];
        return 0 <= r && 0 <= s && 0 <= 1-r-s 
    }
}

// ---------------------
// return true iff there is an intersection between two triangles given by their corners
// this includes convex hull intersection (if a triangle is included in the other triangle)
export function is_triangles_intersection(p1: Coord, p2: Coord, p3: Coord, q1: Coord, q2: Coord, q3: Coord): boolean{

    if( is_point_in_triangle(p1, q1,q2,q3) && is_point_in_triangle(p2, q1,q2,q3) && is_point_in_triangle(p3, q1,q2,q3 )){
        return true;
    }
    if ( is_point_in_triangle(q1, p1,p2,p3) && is_point_in_triangle(q2, p1,p2,p3) && is_point_in_triangle(q3, p1,p2,p3)){
        return true;
    }

    if( is_segments_intersection(p1,p2, q1,q2) ||
    is_segments_intersection(p1,p2, q1,q3) ||
    is_segments_intersection(p1,p2, q2,q3) ||
    is_segments_intersection(p1,p3, q1,q2) ||
    is_segments_intersection(p1,p3, q1,q3) ||
    is_segments_intersection(p1,p3, q2,q3) ||
    is_segments_intersection(p3,p2, q1,q2) ||
    is_segments_intersection(p3,p2, q1,q3) ||
    is_segments_intersection(p3,p2, q2,q3)){
        return true;
    }
    return false;
}



// --------------------
// Decide if there is an intersection between two quadratic Bezier curves
export function is_quadratic_bezier_curves_intersection(p1: Coord, cp1: Coord, p2: Coord, q1: Coord, cp2: Coord, q2: Coord): boolean{
    if ( is_triangles_intersection(p1, cp1, p2, q1, cp2, q2) == false){
        return false;
    }

    const m = 10;
    const bezier1 = new Array(p1,cp1,p2);
    const bezier2 = new Array(q1,cp2,q2);

    for (let i = 0 ; i < m ; i ++){
        const a = bezier_curve_point(i/m, bezier1);
        const b = bezier_curve_point((i+1)/m, bezier1);

        for (let j = 0 ; j <= m ; j ++){
            const c = bezier_curve_point(j/m, bezier2);
            const d = bezier_curve_point((j+1)/m, bezier2);
            
            if (is_segments_intersection(a,b,c,d)){
                return true;
            }
        }
    }
    return false; 
}



/**
 * Returns the determinant of the matrix.
 * Algorithm: Leibniz formula (recursive).
 * @param matrix is supposed to be square and not of size 0
 * No error are triggered it is not the case.
 */
export function det(matrix: Array<Array<number>>){
    const n = matrix.length;
    if (n === 1) {
        return matrix[0][0];
    }
    let d = 0;
    for (let i = 0; i < n; i++) {
        const subMatrix = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
        const sign = i % 2 === 0 ? 1 : -1;
        d += sign * matrix[0][i] * det(subMatrix);
    }

    return d;
}



/**
 * Return true if n is a square modulo m.
 * @param n integer
 * @param m integer
 * @example
 * isModSquare(4,5) == true // because 4 = 2^2 mod 5
 * isModSquare(3,5) == false // because 0, 1 and 4 are the only squares in Z/5Z.
 */
export function isModSquare(n: number, m: number){
    for( let i = 0 ; i < m ; i ++){
        if ( (n - i*i) % m == 0 ){
            return true;
        }
    }
    return false;
}






export function booleanArrayToString(array: boolean[]): string {
    return array.map((value) => value ? '1' : '0').join('');
}