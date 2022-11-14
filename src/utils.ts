// decide if there is equality between two sets xs and ys
export function eqSet (xs: Set<number>, ys: Set<number>): boolean {
    return xs.size === ys.size && [...xs].every((x) => ys.has(x));
}