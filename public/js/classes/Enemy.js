import Utils from "./Utils.js"

export default class Enemy{
    constructor(game, x,y,hp){
        this.game = game
        this.id = this.game.idgen++
        this.x = x,
        this.y = y
        this.speed = {x:3,y:3}
        this.maxSpeed = 0.1
        this.angle = Utils.random(0,Math.PI) * [1,-1][Utils.random(0,1)]
        this.moving = {
            UP: false,
            DOWN: false,
            LEFT: false,
            RIGHT: false
        }
        this.acceleration = 0.01
        this.size = this.game.tileSize/2
        this.hp = hp
        this.maxHp = hp
        this.damage = 10
        this.alerted = false
        this.detectionRange = 400
        this.visionRange = 400
        this.state = "waiting" // waiting, searching,following, attacking
        this.pathToPlayer = []
        this.pathToPlayerIndex = 0

        this.recentlyAttacked = false
        this.recentlyAttackedTime = 0
    }

    alert(){
        this.alerted = true
    }

    attackPlayer(){
        const {player} = this.game
        const dist = Utils.distanceEuclidean(this.x,player.x,this.y,player.y)
        console.log("attacking");
        console.log(dist);
        if(!this.recentlyAttacked && dist <= 25){
            if(player.hp - this.damage >= 0){
                player.hp -= this.damage
            }else{
                player.hp = 0
                location.reload()
            }
            this.recentlyAttacked = true
            this.recentlyAttackedTime = this.game.dt
        }
    }

    searchPlayer(){
        const {map, player} = this.game
        const {tileSize} = this.game
        try {
            const playerTile = map.getTileAt(player.x-(tileSize/2), player.y-(tileSize/2))
            const meTile = map.getTileAt(this.x-(tileSize/2), this.y-(tileSize/2))
            let path = this.game.map.findPath(meTile, playerTile)
            this.pathToPlayer = path
            this.pathToPlayerIndex = 1
        } catch (error) {
            console.log(error);
        }
    }

    clearPathToPlayer(){
        this.pathToPlayer = []
        this.pathToPlayerIndex = 0
    }

    update(){
        
        const dist = Utils.distanceEuclidean(this.x,this.game.player.x,this.y,this.game.player.y)
        const timeSinceLastAttack = Math.round(this.game.dt - this.recentlyAttackedTime)
        if(timeSinceLastAttack > 250){
            this.recentlyAttacked = false
        }
        if(dist < 50){
            const {x,y} = this
            const {x:px,y:py} = this.game.player
            this.angle =  Math.atan2(px - x, py - y) - Math.PI/2
            this.clearPathToPlayer()
            this.moveToPlayer()
            this.attackPlayer()
        }
        else if(dist <= this.detectionRange || this.alerted){
            this.searchPlayer()
            this.moveToPlayerTile()
            
        }else{
            this.clearPathToPlayer()
        }
    }

    moveToPlayer(){
        const {x,y} = this
        const {x:px,y:py} = this.game.player
        const {tileSize} = this.game

        if(x > px){
            this.moving.LEFT = true
            this.speed.x = -3
        }else{
            this.moving.LEFT = false
        }
        if(x < px){
            this.moving.RIGHT = true
            this.speed.x = 3
        }else{
            this.moving.RIGHT = false
            
        }
        if(y > py){
            this.moving.UP = true
            this.speed.y = -3
        }else{
            this.moving.UP = false
        }
        if(y < py){
            this.moving.DOWN = true
            this.speed.y = 3
        }else{
            this.moving.DOWN = false
        }

        if(this.moving.UP || this.moving.DOWN){
            const newX = x - tileSize/2
            const newY = y + this.speed.y - tileSize/2
            const nextTile = this.game.map.getTileAt(newX,newY)
            if(!nextTile.isWall){
                this.y += this.speed.y
            }  
        }
        if(this.moving.LEFT || this.moving.RIGHT){
            const newX = x + this.speed.x - tileSize/2
            const newY = y - tileSize/2
            const nextTile = this.game.map.getTileAt(newX,newY)
            if(!nextTile.isWall){
                this.x += this.speed.x
            }
        }   
    }
    
    moveToPlayerTile(){
        const {tileSize} = this.game
        const {x,y} = this

        this.speed = {x:3,y:3}
        if(!this.pathToPlayer[this.pathToPlayerIndex]){
            return
        }
        const {x:tx,y:ty} = this.pathToPlayer[this.pathToPlayerIndex]
        const enemyTile = this.game.map.getTileAt2(x,y)
        const targetTile = this.game.map.tileMap[tx][ty]
        const targetX = (targetTile.x * tileSize) + (tileSize/2)
        const targetY = (targetTile.y * tileSize) + (tileSize/2)

        if(enemyTile !== targetTile){
            if(x < targetX) {this.x += this.speed.x;this.angle = 0}
            else if(x > targetX) {this.x -= this.speed.x;this.angle = -Math.PI}
            if(y < targetY) {this.y += this.speed.y;this.angle = Math.PI/2}
            else if(y > targetY) {this.y -= this.speed.y;this.angle = -Math.PI/2}
        }else{
            if((this.pathToPlayerIndex + 1) <= this.pathToPlayer.length){
                this.pathToPlayerIndex += 1
            }else{
                this.clearPathToPlayer()
            }
        }
    }
    
}
