import { BasicGraph } from "../graph";


const g1 = BasicGraph.from([[0,0,""], [0,0,""], [0,0,""], [0,0,""]],
    [[0,1,""],
    [1,2,""],
    [2,3,""],
    [3,1,""]]);

const f1 = g1.Floyd_Warhall(false);
// console.log([...distances])
// console.log([...next])
console.log(f1.distances.get(0)?.get(2) == 2)
console.log(f1.next.get(0)?.get(2) == 1)
console.log(f1.distances.get(0)?.get(3) == 2)
console.log(f1.next.get(0)?.get(3) == 1)

const g2 = BasicGraph.from([[0,0,""], [0,0,""], [0,0,""], [0,0,""], [0,0,""], [0,0,""]],
    [[0,3,""],
    [3,1,""],
    [1,2,""],
    [2,5,""],
    [5,1,""],
    [1,4,""],
    [4,0,""]]);

const f2 = g2.Floyd_Warhall(false);
console.log(f2.distances.get(3)?.get(2) == 2)
console.log(f2.next.get(3)?.get(2) == 1)
console.log(f2.distances.get(0)?.get(5) == 3)
console.log(f2.next.get(5)?.get(0) == 1)