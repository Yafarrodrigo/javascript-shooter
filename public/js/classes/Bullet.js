import _WEAPONS from "../_weapons.js"
import Utils from "./Utils.js"

export default class Bullet{
    constructor(game,weaponId, x, y){
        const {player,graphics, controls} = game
        this.game = game
        this.id = this.game.idgen++
        this.x = x,
        this.y = y,
        this.type = _WEAPONS[weaponId].type
        this.baseSpeed = _WEAPONS[weaponId].speed
        this.damage = _WEAPONS[weaponId].damage
        this.size = _WEAPONS[weaponId].bulletSize
        this.active = true
        this.hitSomething = false
        this.direction = Utils.normalizeVector(player.direction.x, player.direction.y)
        this.enemiesHit = 0


        if (weaponId === "shotgun"){
            const spread = 25
            const rndX = Utils.randomBool() ? Utils.random(0,spread) : Utils.random(0,spread)*(-1)
            const rndY = Utils.randomBool() ? Utils.random(0,spread) : Utils.random(0,spread)*(-1)
            this.direction = Utils.normalizeVector(controls.cursor.x - (graphics.width/2) + rndX, controls.cursor.y - (graphics.height/2) + rndY)
        }
        
        const finalXspeed = this.baseSpeed * this.direction.x
        const finalYspeed = this.baseSpeed * this.direction.y

        this.speed = {x: finalXspeed,y: finalYspeed}
    }

    update(){

        const {graphics, tileSize} = this.game

        if(this.x/tileSize > graphics.width || this.x/tileSize < 0 || this.y/tileSize < 0 || this.y/tileSize > graphics.height || this.hitSomething){
            this.active = false
            return
        }

        const newX = this.x + (this.speed.x/2) - tileSize/2
        const newY = this.y + (this.speed.y/2)  - tileSize/2
        const nextTile = this.game.map.getTileAt(newX,newY)

        if(nextTile.isWall){
            this.active = false
            return
        }

        this.game.enemies.forEach( enemy => {
            if(Math.abs(this.x - enemy.x) < (enemy.size - 2) && Math.abs(this.y - enemy.y) < (enemy.size - 2)){
                if(this.active){
                    if(enemy.state === "waiting") enemy.alert()
                    if(enemy.hp - this.damage > 0) enemy.hp -= this.damage
                    else{
                        this.game.enemies = this.game.enemies.filter( e => e.id !== enemy.id)
                    }
                    this.enemiesHit++
                    if(this.weapon === "shotgun" && this.enemiesHit > 1){
                        this.active = false
                    }else{
                        this.active = false
                    }
                }
            }
        })

        this.x += this.speed.x
        this.y += this.speed.y
    }
}