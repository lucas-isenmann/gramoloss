import { hasLightTournamentExtension, hasLightTournamentExtension2 } from "../algorithms/isTournamentLight";
import { AbstractGraph } from "../graph_abstract";
import { ORIENTATION } from "../link";


{
    // const g = new AbstractGraph();
    // for (let i =0; i < 5; i ++){
    //     g.addVertex();
    // }

    // g.addLink(0,1, ORIENTATION.DIRECTED, undefined)
    // g.addLink(1,2, ORIENTATION.DIRECTED, undefined)
    // g.addLink(1,3, ORIENTATION.DIRECTED, undefined)
    // g.addLink(1,4, ORIENTATION.DIRECTED, undefined)
    // g.addLink(4,0, ORIENTATION.DIRECTED, undefined)
    // g.addLink(3,0, ORIENTATION.DIRECTED, undefined)
    // g.addLink(2,0, ORIENTATION.DIRECTED, undefined)
    // g.addLink(4,2, ORIENTATION.DIRECTED, undefined)
    // console.log(hasLightTournamentExtension(g))
}

if (false)
{
    const g = new AbstractGraph();
    for (let i =0; i < 12; i ++){
        g.addVertex();
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
            g.addLink(i, (i+3)%9, ORIENTATION.DIRECTED, undefined);
            g.addLink(i, (i+4)%9, ORIENTATION.DIRECTED, undefined);
            g.addLink(i, (i+5)%9, ORIENTATION.DIRECTED, undefined);
        }
    }
    g.addLink(0,9, ORIENTATION.DIRECTED, undefined);
    g.addLink(9,3, ORIENTATION.DIRECTED, undefined);
    g.addLink(9,1, ORIENTATION.DIRECTED, undefined);
    g.addLink(2,9, ORIENTATION.DIRECTED, undefined);

    g.addLink(3,10, ORIENTATION.DIRECTED, undefined);
    g.addLink(10,6, ORIENTATION.DIRECTED, undefined);
    g.addLink(10,4, ORIENTATION.DIRECTED, undefined);
    g.addLink(5,10, ORIENTATION.DIRECTED, undefined);

    g.addLink(6,11, ORIENTATION.DIRECTED, undefined);
    g.addLink(11,7, ORIENTATION.DIRECTED, undefined);
    g.addLink(8,11, ORIENTATION.DIRECTED, undefined);
    g.addLink(11,0, ORIENTATION.DIRECTED, undefined);


    const [b, done] = hasLightTournamentExtension(g);

     console.log(b)
     console.log(done.length);

    for (const [u,v,dir] of done){
        if (dir == false){
            g.addLink(u,v, ORIENTATION.DIRECTED, undefined)
        } else {
            g.addLink(v,u, ORIENTATION.DIRECTED, undefined);
        }
    }

    console.log(g.isTournamentLight());
    console.log(g.dichromaticNumber());

}



// Ring with k groups
if (false)
{
    const g = new AbstractGraph();
    const k = 4;
    const n = 4*k;
    for (let i =0; i < n; i ++){
        g.addVertex();
    }

    for ( let i = 0 ; i < n ; i ++){
        if (i % 4 == 0){
            g.addLink(i, (i+1)%n, ORIENTATION.DIRECTED, undefined);
            g.addLink(i, (i+2)%n, ORIENTATION.DIRECTED, undefined);
            g.addLink(i, (i+3)%n, ORIENTATION.DIRECTED, undefined);

            g.addLink(i, (i+4)%n, ORIENTATION.DIRECTED, undefined);
            g.addLink(i, (i+5)%n, ORIENTATION.DIRECTED, undefined);
            g.addLink((i+6)%n, i, ORIENTATION.DIRECTED, undefined); // by minimality of the ring

            // ---- NOT NECESSARY
            // g.addLink(i, (i+7)%n, ORIENTATION.DIRECTED, undefined);
            // g.addLink(i, (i+8)%n, ORIENTATION.DIRECTED, undefined);

            // g.addLink((i+7)%n, (i+1)%n, ORIENTATION.DIRECTED, undefined);
            // g.addLink((i+2)%n, (i+7)%n, ORIENTATION.DIRECTED, undefined);
            // g.addLink((i+3)%n, (i+6)%n, ORIENTATION.DIRECTED, undefined);
            // g.addLink((i+2)%n, (i+6)%n, ORIENTATION.DIRECTED, undefined);
            // g.addLink((i+6)%n, (i+1)%n, ORIENTATION.DIRECTED, undefined);


            // make 4i vertices a Paley
            // g.addLink(i, (i+4*2)%n, ORIENTATION.DIRECTED, undefined);
            // g.addLink(i, (i+4*4)%n, ORIENTATION.DIRECTED, undefined);

            // g.addLink((i+1)%n, (i+1+4*1)%n, ORIENTATION.DIRECTED, undefined);
            // g.addLink((i+1)%n, (i+1+4*2)%n, ORIENTATION.DIRECTED, undefined);
            // g.addLink((i+1)%n, (i+1+4*3)%n, ORIENTATION.DIRECTED, undefined);

            // g.addLink((i+2)%n, (i+2+4*1)%n, ORIENTATION.DIRECTED, undefined);
            // g.addLink((i+2)%n, (i+2+4*2)%n, ORIENTATION.DIRECTED, undefined);
            // g.addLink((i+2)%n, (i+2+4*3)%n, ORIENTATION.DIRECTED, undefined);

            // g.addLink((i+3)%n, (i+3+4*1)%n, ORIENTATION.DIRECTED, undefined);
            // g.addLink((i+3)%n, (i+3+4*2)%n, ORIENTATION.DIRECTED, undefined);
            // g.addLink((i+3)%n, (i+3+4*3)%n, ORIENTATION.DIRECTED, undefined);


            // -------
            g.addLink((i+1)%n, (i+4)%n, ORIENTATION.DIRECTED, undefined);
            g.addLink((i+2)%n, (i+4)%n, ORIENTATION.DIRECTED, undefined);
            g.addLink((i+3)%n, (i+4)%n, ORIENTATION.DIRECTED, undefined);

            g.addLink((i+1)%n, (i+2)%n, ORIENTATION.DIRECTED, undefined);
            g.addLink((i+2)%n, (i+3)%n, ORIENTATION.DIRECTED, undefined);
            g.addLink((i+3)%n, (i+1)%n, ORIENTATION.DIRECTED, undefined);
        }
    }

    console.log("nb arcs", g.links.size);



    const [b, done] = hasLightTournamentExtension2(g);

    console.log("n=", g.vertices.size)
    console.log("m=", g.links.size);
    console.log(b)
    console.log(done.length);

    for (const [u,v,dir, deductions, isDeduced] of done){
        if (dir == false){
            g.addLink(u,v, ORIENTATION.DIRECTED, undefined)
        } else {
            g.addLink(v,u, ORIENTATION.DIRECTED, undefined);
        }
        for (const [a,b] of deductions){
            g.addLink(a,b, ORIENTATION.DIRECTED, undefined);
        }
    }

    console.log(g.links.size)
    console.log(g.isTournamentLight());
    console.log(g.dichromaticNumber());
    console.log(g.minimumProperDicoloring())
}



if (true)
{
    console.log("Paley extension")
    const g = new AbstractGraph();
    const n = 7;
    for (let i =0; i < n; i ++){
        g.addVertex();
    }

    for ( let i = 0 ; i < n ; i ++){
        g.addLink(i, (i+1)%n, ORIENTATION.DIRECTED, undefined);
        g.addLink(i, (i+2)%n, ORIENTATION.DIRECTED, undefined);
        g.addLink(i, (i+4)%n, ORIENTATION.DIRECTED, undefined);
    }

    g.addVertex();
    g.addLink(0,7, ORIENTATION.DIRECTED, undefined);
    g.addLink(7,1, ORIENTATION.DIRECTED, undefined);

    console.log("nb arcs", g.links.size);



    const [b, done] = hasLightTournamentExtension(g);

    console.log("n=", g.vertices.size)
    console.log("m=", g.links.size);
    console.log(b)
    console.log(done.length);
    console.log(done)

    for (const [u,v,dir] of done){
        if (dir == false){
            g.addLink(u,v, ORIENTATION.DIRECTED, undefined)
        } else {
            g.addLink(v,u, ORIENTATION.DIRECTED, undefined);
        }
    }

    console.log(g.links.size)
    console.log(g.isTournamentLight());
    console.log(g.dichromaticNumber());
    console.log(g.minimumProperDicoloring())
}