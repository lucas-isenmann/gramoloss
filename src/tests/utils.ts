import {isModSquare} from "../utils";



for (let m = 2 ; m < 7 ; m ++ ){
    for (let n = -m ; n <= 2*m ; n ++){
        console.log(n, m, isModSquare(n, m))
    }
}