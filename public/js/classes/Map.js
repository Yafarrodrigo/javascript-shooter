import MapGenerator from './MapGenerator.js'
import Utils from './Utils.js'

export default class Map{
    constructor(game){
        this.game = game

        this.mapGen = new MapGenerator({
            startPos: {x:0,y:0, isWall:false},
            iterations: 5,
            walkLength: 50,
            startRandom: true,
            corridorLength: 5,
            corridorCount: 10,
            roomPercent: 1
        })

        // standard
        /* {
            startPos: {x:0,y:0, isWall:false},
            iterations: 5,
            walkLength: 50,
            startRandom: true,
            corridorLength: 15,
            corridorCount: 5,
            roomPercent: 1
        } */

        // pasillos largos
        /* {
            startPos: {x:0,y:0, isWall:false},
            iterations: 5,
            walkLength: 50,
            startRandom: true,
            corridorLength: 25,
            corridorCount: 10,
            roomPercent: 1
        } */

        // area abierta
        /* {
            startPos: {x:0,y:0, isWall:false},
            iterations: 5,
            walkLength: 50,
            startRandom: true,
            corridorLength: 5,
            corridorCount: 10,
            roomPercent: 1
        } */

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
        startTile.h = Utils.distanceManhattan(startTile.x, endTile.x, startTile.y, endTile.y);
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
                let neighbourTile = currentTile.neighbours[i]

                if(closedSet.includes(neighbourTile) || neighbourTile.isWall){
                    continue;
                }
                let tentativeGScore = currentTile.g + 1;
                let gScoreBest = false

                if (!openSet.includes(neighbourTile)){
                    gScoreBest = true
                    neighbourTile.h = Utils.distanceEuclidean(neighbourTile.x, endTile.x,neighbourTile.y, endTile.y);
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
        const {tileSize} = this.game
        const xx = Math.round(Math.abs(x/tileSize))
        const yy = Math.round(Math.abs(y/tileSize))
        return this.tileMap[xx][yy]
    }
    getTileAt2(x,y){
        const {tileSize} = this.game
        const xx = Math.floor(Math.abs(x/tileSize))
        const yy = Math.floor(Math.abs(y/tileSize))
        return this.tileMap[xx][yy]
    }
    
    getRandomFloorTile(){
        let rndFloor = this.onlyFloors[Utils.random(0,this.onlyFloors.length-1)]
        return rndFloor
    }
}