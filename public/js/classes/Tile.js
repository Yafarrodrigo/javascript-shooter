import typeOfWalls from "./wallTilesHelper.js"

export default class Tile{
    constructor(x,y,isWall,outOfMap, wallNeightbours,firstTile){
        this.x = x,
        this.y = y,
        this.f = 0
        this.g = 0
        this.h = 0
        this.previous = null
        this.isWall = isWall
        if(!this.isWall && !outOfMap){
            this.floorTileNumber = Math.floor(Math.random()*3)
        }
        this.neighbours = []
        this.outOfMap = outOfMap
        this.wallNeightbours = wallNeightbours
        this.firstTile = firstTile
        let whichOrientation
        if(wallNeightbours){
            if(typeOfWalls.wallTop.includes(wallNeightbours)) whichOrientation = "top"
            else if(typeOfWalls.wallSideLeft.includes(wallNeightbours)) whichOrientation = "left"
            else if(typeOfWalls.wallSideRight.includes(wallNeightbours)) whichOrientation = "right"
            else if(typeOfWalls.wallBottom.includes(wallNeightbours)) whichOrientation = "bottom"

            else if(typeOfWalls.wallFull.includes(wallNeightbours)) whichOrientation = "top"
/*             else if(typeOfWalls.wallDiagonalCornerDownLeft.includes(wallNeightbours)) whichOrientation = "bottom-left"
            else if(typeOfWalls.wallDiagonalCornerDownRight.includes(wallNeightbours)) whichOrientation = "bottom-right"
            else if(typeOfWalls.wallDiagonalCornerUpLeft.includes(wallNeightbours)) whichOrientation = "top-left"
            else if(typeOfWalls.wallDiagonalCornerUpRight.includes(wallNeightbours)) whichOrientation = "top-right"
            else if(typeOfWalls.wallFullEightDirections.includes(wallNeightbours)) whichOrientation = "top"
            else if(typeOfWalls.wallBottomEightDirections.includes(wallNeightbours)) whichOrientation = "bottom"
            else if(typeOfWalls.wallInnerCornerDownLeft.includes(wallNeightbours)) whichOrientation = "top"
            else if(typeOfWalls.wallInnerCornerDownRight.includes(wallNeightbours)) whichOrientation = "top"
            else if(typeOfWalls.wallOuterCornerTopLeft.includes(wallNeightbours)) whichOrientation = "top-left" */
            else{
                console.log("que pared pongo aca?",this);
            }
        }
        this.orientation = whichOrientation
    }
}