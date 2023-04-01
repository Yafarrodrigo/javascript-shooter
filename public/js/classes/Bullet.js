import _WEAPONS from "../_weapons.js"

export default class Bullet{
    constructor(game,weaponId, x, y){
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
        this.direction = this.game.player.normalizeVector(this.game.player.direction.x, this.game.player.direction.y)
        this.enemiesHit = 0

        if (weaponId === "shotgun"){
            const spread = 25
            const rndX = Math.random() < 0.5 ? Math.floor(Math.random()*spread) : Math.floor(Math.random()*(-spread))
            const rndY = Math.random() < 0.5 ? Math.floor(Math.random()*spread) : Math.floor(Math.random()*(-spread))
            this.direction = this.game.player.normalizeVector(this.game.controls.cursor.x - 400 + rndX, this.game.controls.cursor.y - 400 + rndY)
        }
        
        const finalXspeed = this.baseSpeed * this.direction.x
        const finalYspeed = this.baseSpeed * this.direction.y

        this.speed = {x: finalXspeed,y: finalYspeed}
    }

    update(){

        if(this.x/this.game.graphics.tileSize > 800 || this.x/this.game.graphics.tileSize < 0 || this.y/this.game.graphics.tileSize < 0 || this.y/this.game.graphics.tileSize > 800 || this.hitSomething){
            this.active = false
            return
        }

        const newX = this.x + (this.speed.x/2) - this.game.graphics.tileSize/2
        const newY = this.y + (this.speed.y/2)  - this.game.graphics.tileSize/2
        const nextTile = this.game.map.getTileAt(newX,newY)

        if(nextTile.isWall){
            this.active = false
            return
        }

        this.game.enemies.forEach( enemy => {
            if(Math.abs(this.x - enemy.position.x) < (enemy.size - 2) && Math.abs(this.y - enemy.position.y) < (enemy.size - 2)){
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