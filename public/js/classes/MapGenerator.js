import Tile from "./Tile.js"
import Utils from "./Utils.js"

export default class MapGenerator{

    directions = [{x:0,y:1},{x:1,y:0},{x:0,y:-1},{x:-1,y:0}] // up - right - down- left
    diagonalDirections = [{x:1,y:1},{x:1,y:-1},{x:-1,y:-1},{x:-1,y:1}] // upRight - downRight - downLeft - downRight
    allDirections = [{x:0,y:1},{x:1,y:1},{x:1,y:0},{x:1,y:-1},{x:0,y:-1},{x:-1,y:-1},{x:-1,y:0},{x:-1,y:1}] // todo

    constructor({startPos, iterations, walkLength, startRandom, corridorLength, corridorCount, roomPercent, tileSize}){
        this.startPos = startPos
        this.iterations = iterations
        this.walkLength = walkLength
        this.startRandom = startRandom
        this.corridorLength = corridorLength
        this.corridorCount = corridorCount
        this.roomPercent = roomPercent
        this.maxWidth = 0
        this.maxHeight = 0
        this.tileSize = tileSize
    }

    generateMap(){

        const floors = Array.from(this.generateFloor(this.startPos,this.iterations,this.walkLength,this.startRandom))  
        const walls = Array.from(this.generateWalls(floors))

        return {floors, walls}
    }

    generateMap2(){

        const potentialRoomPositions = new Set()

        let floors = this.generateCorridorFloors(this.startPos, this.corridorCount, this.corridorLength, potentialRoomPositions)
        let roomFloors = this.createRooms(potentialRoomPositions, this.roomPercent)

        floors = new Set([...floors, ...roomFloors])
        let walls = this.generateWalls(Array.from(floors))

        floors = [...floors]
        walls = [...walls]

        return {floors, walls}
    }

    generateTileMap(map){
        const {mapWidth,mapHeight, mins} = this.getDimentions(map)
        const {minX,minY} = mins
        const offsetX = Math.abs(minX)
        const offsetY = Math.abs(minY)

        let result = new Array(mapWidth).fill(0).map(() => new Array(mapHeight).fill(0));
        let finalWallThickness = 1
        for(let x = 0; x < mapWidth; x++){
            for(let y = 0; y < mapHeight; y++){

                let tile = map.find( e => e.x === x+minX && e.y === y+minY)
                if(x < finalWallThickness || y < finalWallThickness || x >= mapWidth- 1-finalWallThickness || y >= mapHeight- 1-finalWallThickness){
                    result[x][y] = new Tile(x,y,this.tileSize, true, false,"", false)
                }
                else if(tile){
                    if(tile.isWall){
                        result[x][y] = new Tile(tile.x+offsetX, tile.y+offsetY,this.tileSize, true, false, tile.wallNeighbours, false)
                    }else{
                        if(tile.x === map[0].x && tile.y === map[0].y){
                            result[x][y] = new Tile(tile.x+offsetX, tile.y+offsetY,this.tileSize, false, false,"", true)
                        }else{
                            result[x][y] = new Tile(tile.x+offsetX, tile.y+offsetY,this.tileSize, false, false,"", false)
                        }
                    }
                }else{
                    result[x][y] = new Tile(x,y,this.tileSize, true, true,"", false)
                }
            }
        }
        this.addNeighbours(result)
        return result
    }

    get2DArrayOfWalls(map){
        let bigArray = []
        for(let x = 0; x < map.length; x++){
            let smallArray = []
            for(let y = 0; y < map[0].length; y++){
                if(map[x][y].isWall) smallArray.push(1)
                else smallArray.push(0)
            }
            bigArray.push(smallArray)
        }
        return bigArray
    }

    addNeighbours(map){
        for(let x = 0; x < map.length; x++){
            for(let y = 0; y < map[0].length; y++){
                // 4 directions
                if(x > 0) map[x][y].neighbours.push(map[x-1][y])
                if(x < map.length -1) map[x][y].neighbours.push(map[x+1][y])
                if(y < map[0].length- 1) map[x][y].neighbours.push(map[x][y+1])
                if(y > 0) map[x][y].neighbours.push(map[x][y-1])
                // diagonals
                // if(x > 0 && y > 0) map[x][y].neighbours.push(map[x-1][y-1])
                // if(x < map.length -1 && y > 0) map[x][y].neighbours.push(map[x+1][y-1])
                // if(y < map[0].length- 1 && x > 0) map[x][y].neighbours.push(map[x-1][y+1])
                // if(y < map[0].length- 1 && x < map.length - 1) map[x][y].neighbours.push(map[x+1][y+1])
            }
        }
    }

    getDimentions(tiles){
        this.mapWidth = this.getMaxWidth(tiles)
        this.mapHeight = this.getMaxHeight(tiles)
        this.mins = this.getMins(tiles)
        this.maxs = this.getMaxs(tiles)
        return {
            mapWidth: this.mapWidth,
            mapHeight: this.mapHeight,
            mins: this.mins,
            maxs: this.maxs 
        }
    }

    getMaxWidth(map){
        let min = 0
        let max = 0
        map.forEach( tile => {
            if(tile.x < min) min = tile.x
            if(tile.x > max) max = tile.x
        })
        return Math.abs(min) + Math.abs(max)
    }

    getMaxHeight(map){
        let min = 0
        let max = 0
        map.forEach( tile => {
            if(tile.y < min) min = tile.y
            if(tile.y > max) max = tile.y
        })
        return Math.abs(min) + Math.abs(max)
    }

    getMins(arr){
        let minX = 0
        let minY = 0

        arr.forEach( item => {
            if(item.x < minX) minX = item.x
            if(item.y < minY) minY = item.y
        })

        return {minX,minY}
    }

    getMaxs(arr){
        const maxX = this.getMaxWidth(arr)
        const maxY = this.getMaxHeight(arr)

        arr.forEach( item => {
            if(item.x > maxX) maxX = item.x
            if(item.y > maxY) maxY = item.y
        })

        return {maxX,maxY}
    }

    createRooms(potentialRoomPositions, roomPercent){
        let roomPositions = new Set()
        const roomsToCreateCount = Math.round(potentialRoomPositions.size * roomPercent)

        let roomToCreate = [...potentialRoomPositions].sort(()=>Utils.randomBool()).slice(0,roomsToCreateCount)
        
        for(let i = 0; i < roomToCreate.length; i++){
            const newRoomFloor = this.generateFloor({x:roomToCreate[i].x, y:roomToCreate[i].y, isWall:false},this.iterations,this.walkLength,this.startRandom)
            roomPositions = new Set([...roomPositions, ...newRoomFloor])
        }

        return roomPositions
    }
    
    generateFloor(startPos, iterations, walkLength, startRandom){
        let floorPositions = new Set()
        let currentPos = startPos

        for(let i = 0; i < iterations; i++){
            const path = this.simpleRandomWalk(currentPos, walkLength)
            floorPositions = new Set([...floorPositions, ...path])
            
            if(startRandom === true){
                currentPos = [...floorPositions][Utils.random(0,floorPositions.size-1)]
            }
        }

        return floorPositions
    }

    generateCorridorFloors(startPos, corridorCount, corridorLength, potentialRoomPositions){
        let corridorFloors = new Set()
        let currentPos = startPos
        potentialRoomPositions.add(currentPos)

        for(let i = 0; i < corridorCount; i++){
            const corridor = this.generateCorridor(currentPos, corridorLength)
            currentPos = corridor[corridor.length-1]
            potentialRoomPositions.add(currentPos)
            corridorFloors = new Set([...corridorFloors, ...corridor])
        }

        return corridorFloors
    }

    generateCorridor(startPos, length){
        let corridor = []
        const randomDir = this.getRandomDirection()
        let currentPos = startPos

        for(let i = 0; i < length; i++){
            currentPos = {x:currentPos.x - randomDir.x, y:currentPos.y + randomDir.y, isWall: false} 
            corridor.push(currentPos)

        }
        return corridor
    }

    getRandomDirection(){
        return this.directions[Utils.random(0,3)]
    }

    generateWalls(floorPositions){
        let wallPositions = new Set()
        floorPositions.forEach( floor => {
            this.directions.forEach( dir => {
                const neightbourPos = {x:floor.x + dir.x, y:floor.y + dir.y}
                if(!floorPositions.filter( e => e.x === neightbourPos.x && e.y === neightbourPos.y).length){
                    wallPositions.add(neightbourPos)
                }
            })
        })
        wallPositions.forEach( (wall) => {
            let typeWall = ""
            wall.isWall = true
            this.directions.forEach( dir => {
                const neightbourPos = {x:wall.x + dir.x, y:wall.y + dir.y,}
                if(!floorPositions.some( e => e.x === neightbourPos.x && e.y === neightbourPos.y)){
                    typeWall += 1
                }else{
                    typeWall += 0
                }
            })
            wall.wallNeighbours = typeWall
        })
        
        return new Set([...wallPositions])
    }

    simpleRandomWalk(startPos, length){

        const path = new Set()
        path.add({x:startPos.x, y:startPos.y, isWall: false})
        let prevPos = startPos

        for(let i = 0; i < length; i++){
            const {x,y} = this.getRandomDirection()
            let newPos = {x:prevPos.x + x, y: prevPos.y + y, isWall: false}
            path.add(newPos)
            prevPos = newPos
        }

        return path
    }
}