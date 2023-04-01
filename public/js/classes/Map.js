import MapGenerator from './MapGenerator.js'

export default class Map{
    constructor(game){
        this.game = game

        this.mapGen = new MapGenerator({
            startPos: {x:0,y:0, isWall:false},
            iterations: 5,
            walkLength: 50,
            startRandom: true,
            corridorLength: 15,
            corridorCount: 5,
            roomPercent: 1
        })

        const {floors,walls} = this.mapGen.generateMap2()
        this.floors = floors
        this.walls = walls
        this.allTiles = Array.from(new Set([...floors,...walls]))
        this.tileMap = this.mapGen.generateTileMap(this.allTiles)
        this.widthInTiles = this.tileMap.length
        this.heightInTiles = this.tileMap[0].length

        const allTilesArr = [].concat(...this.tileMap)
        this.onlyFloors = allTilesArr.filter( tile => !tile.isWall && !tile.outOfMap)
        this.onlyWalls2D = this.mapGen.get2DArrayOfWalls(this.tileMap)
    }

    findPath(startTile, endTile){
        //console.log(startTile.isWall,startTile.outOfMap,endTile.isWall, endTile.outOfMap);
        if(startTile.isWall || startTile.outOfMap || endTile.isWall || endTile.outOfMap || (startTile === endTile)) return []

        for(let x = 0; x < this.tileMap.length; x++){
            for(let y = 0; y < this.tileMap[0].length; y++){
                this.tileMap[x][y].g = 0
                this.tileMap[x][y].h = 0
                this.tileMap[x][y].f = 0
                this.tileMap[x][y].previous = null
            }
        }

        let openSet = [startTile];
        let closedSet = [];
        let counter = 0

        startTile.g = 0;
        startTile.h = this.distance(startTile.x, endTile.x, startTile.y, endTile.y);
        startTile.f = startTile.g + startTile.h;

        while ((openSet.length > 0) || counter < 1000) {
            counter++
            let winner = 0
            for(let i = 0; i < openSet.length; i++){
                if(openSet[i].f < openSet[winner]){
                    winner = i
                }
            }
            let currentTile = openSet[winner]
        
            
            if (currentTile === endTile) {
            
                let path = [currentTile];
                let counter2 = 0
                while (currentTile.previous && counter2 < 1000) {
                    counter2++
                    currentTile = currentTile.previous;
                    path.unshift(currentTile);
                }
                return path;
            }

            openSet.splice(openSet.indexOf(currentTile), 1);
            closedSet.push(currentTile);
            
            let neighbours = currentTile.neighbours || []
            
            for (let i = 0; i < neighbours.length; i++) {
                let neighbourTile = currentTile.neighbours[i];

                if(closedSet.includes(neighbourTile) || neighbourTile.isWall){
                    continue;
                }
                let tentativeGScore = currentTile.g + 1;
                let gScoreBest = false

                if (!openSet.includes(neighbourTile)){
                    gScoreBest = true
                    neighbourTile.h = this.game.distance(neighbourTile.x, endTile.x,neighbourTile.y, endTile.y);
                    openSet.push(neighbourTile)
                }
                else if(tentativeGScore < neighbourTile.g){
                    gScoreBest = true
                }

                if(gScoreBest){
                    neighbourTile.previous = currentTile;
                    neighbourTile.g = tentativeGScore;
                    neighbourTile.f = neighbourTile.g + neighbourTile.h;
                }
            }
                
        }
        return [];
    }

    removeFromArray(arr, elem){
        for(let i = arr.length-1; i >= 0; i--){
            if(arr[i].x === elem.x && arr[i].y === elem.y){
                arr.splice(i,1)
            }
        }
    }

    distance(x0,x1,y0,y1){
        const x = Math.abs(x1 - x0)
        const y = Math.abs(y1 - y0)
        return x+y
    }

    firstFloorTile(){
        let result = {x:0,y:0}
        this.tileMap.forEach( col => {
            col.forEach( tile => {
                if(tile.firstTile){
                    result.x = tile.x
                    result.y = tile.y
                }
            })
        }) 
        return result
    }

    getTileAt(x,y){
        const {tileSize} = this.game.graphics
        const xx = Math.round(Math.abs(x/tileSize))
        const yy = Math.round(Math.abs(y/tileSize))
        return this.tileMap[xx][yy]
    }
    getTileAt2(x,y){
        const {tileSize} = this.game.graphics
        const xx = Math.floor(Math.abs(x/tileSize))
        const yy = Math.floor(Math.abs(y/tileSize))
        return this.tileMap[xx][yy]
    }

    getTileAt3(x,y){
        const {tileSize} = this.game.graphics
        const xx = Math.abs(x%tileSize)
        const yy = Math.abs(y%tileSize)
        return this.tileMap[xx][yy]
    }

    getRandomFloorTile(){
        let rndFloor = this.onlyFloors[Math.floor(Math.random()*this.onlyFloors.length)]
        return rndFloor
    }
}