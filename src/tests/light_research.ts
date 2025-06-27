import { searchHeavyArc } from "../algorithms/isTournamentLight";
import { AbstractGraph } from "../graph_abstract";
import { ORIENTATION } from "../link";

const g = new AbstractGraph();

for (let i = 0; i < 9; i ++){
    g.addVertex()
}

for ( let i = 0 ; i < 9 ; i ++){
    if (i % 3 == 0){
        g.addLink(i, (i+1)%9, ORIENTATION.DIRECTED, undefined);
        g.addLink(i, (i+2)%9, ORIENTATION.DIRECTED, undefined);
        g.addLink(i, (i+3)%9, ORIENTATION.DIRECTED, undefined);
        g.addLink(i, (i+4)%9, ORIENTATION.DIRECTED, undefined);
    } else if (i%3 == 1){
        g.addLink(i, (i+1)%9, ORIENTATION.DIRECTED, undefined);
        g.addLink(i, (i+2)%9, ORIENTATION.DIRECTED, undefined);
        g.addLink(i, (i+6)%9, ORIENTATION.DIRECTED, undefined);
    } else if (i%3 == 2){
        g.addLink(i, (i+1)%9, ORIENTATION.DIRECTED, undefined);
        g.addLink(i, (i+2)%9, ORIENTATION.DIRECTED, undefined);
        g.addLink(i, (i+4)%9, ORIENTATION.DIRECTED, undefined);
        g.addLink(i, (i+5)%9, ORIENTATION.DIRECTED, undefined);
        g.addLink(i, (i+6)%9, ORIENTATION.DIRECTED, undefined);
    }
}

function boolToNum(b: boolean): number {
    return b ? 1 : 0;
  }

const m = g.getDirectedMatrix();

for (let i = 0; i < 9 ; i ++){
    for(let j = i+1; j < 9; j++){
        if ( m[i][j] == false && m[j][i] == false){
            console.log(`${i} ${j} false false`)
        }
        if (m[i][j] == true && m[j][i] == true){
            console.log(`${i} ${j} true true`)
        }
    }
}


const transformedData = m.map(row => row.map(boolToNum));
const formattedMatrix = transformedData.map(row => row.join(' ')).join('\n');
console.log(formattedMatrix);
console.log(searchHeavyArc(m))

/*
For i=0,3,6, 
 i->i+1; i->i+2; i->i+3; i->i+4.

For i=1,4,7, 
 i->i+1; i->i+2; i->i+6.

For i=2,5,8
i->i+1; i->i+2; i->i+4; i->i+5, i->6.
*/
