import Utils from "./Utils.js"

export default class Tile{
    constructor(x,y, size,isWall,outOfMap, wallNeightbours,firstTile){
        this.x = x,
        this.y = y,
        this.f = 0
        this.g = 0
        this.h = 0
        this.size = size
        this.previous = null
        this.isWall = isWall
        if(!this.isWall && !outOfMap){
            this.floorTileNumber = Utils.random(0,2)
        }
        this.neighbours = []
        this.outOfMap = outOfMap
        this.wallNeightbours = wallNeightbours
        this.firstTile = firstTile
    }

    get l() {return (this.x*this.size)}
    get r() {return (this.x*this.size)+this.size}
    get t() {return (this.y*this.size)}
    get b() {return (this.y*this.size)+this.size}
    get center() { return {x:this.x+this.size/2,y:this.y+this.size/2}}
}