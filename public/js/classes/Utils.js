export default class Utils{
    
    static random(min,max){
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    static randomBool(){
        return Math.random() > 0.5
    }

    static removeFromArray(arr, elem){
        for(let i = arr.length-1; i >= 0; i--){
            if(arr[i].x === elem.x && arr[i].y === elem.y){
                arr.splice(i,1)
            }
        }
    }

    static distanceManhattan(x0,x1,y0,y1){
        const x = Math.abs(x1 - x0)
        const y = Math.abs(y1 - y0)
        return x+y
    }

    static distanceEuclidean(x0,x1,y0,y1){
        return Math.sqrt((x1-x0)*(x1-x0) + (y1-y0)*(y1-y0))
    }

    static normalizeVector(x,y){
        const length = Math.sqrt((x*x)+(y*y));
        const newX = x/length
        const newY = y/length

        return {x:newX, y:newY}
    }

}