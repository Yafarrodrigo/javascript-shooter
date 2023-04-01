import Bullet from "./Bullet.js"
import Weapon from "./Weapon.js"

export default class Player{
    constructor(game){
        this.game = game

        this.hp = 100
        this.maxHp = 100
        this.speed = {x:0,y:0}
        this.maxSpeed = 4
        this.acceleration = 0.5
        this.rotationSpeed = 0.1
        this.playerAngle = 0
        this.targetAngle = 0
        this.weapons = [
            new Weapon("rifle"),
            new Weapon("shotgun"),
            new Weapon("pistol")
        ]
        this.selectedWeapon = this.weapons[0]

        this.moving = {
            up: false,
            right: false,
            down: false,
            left:false
        }
        this.direction = {x:0,y:0}
    
        this.position = {x:0,y:0}

    }

    spawn(){
        const {x,y} = this.game.map.firstFloorTile()
        this.position = {
            x: (x*this.game.graphics.tileSize) + (this.game.graphics.tileSize/2),
            y: (y*this.game.graphics.tileSize) + (this.game.graphics.tileSize/2)
        }
    }

    normalizeVector(x,y){
        const length = Math.sqrt((x*x)+(y*y));
        const newX = x/length
        const newY = y/length

        return {x:newX, y:newY}
    }

    startReload(){
        if(this.selectedWeapon.extraRounds <= 0) return
        this.selectedWeapon.reloading = true
        this.selectedWeapon.startedReloadingTimestamp = this.game.dt
        if(this.selectedWeapon.type === "pistol"){
            this.game.playSound("pistolReload",false)
        }
        else if(this.selectedWeapon.type === "rifle"){
            this.game.playSound("rifleReload",false)
        }
        console.log("start reload");
    }

    stopReload(){
        let dif = this.selectedWeapon.maxRounds - this.selectedWeapon.rounds
        if(this.selectedWeapon.extraRounds < dif){
            this.selectedWeapon.rounds += this.selectedWeapon.extraRounds
        }else{
            this.selectedWeapon.rounds = this.selectedWeapon.maxRounds
        }

        if(this.selectedWeapon.extraRounds - dif >= 0) this.selectedWeapon.extraRounds -= dif
        else this.selectedWeapon.extraRounds = 0

        this.selectedWeapon.reloading = false
        this.selectedWeapon.startedReloadingTimestamp = 0
        console.log("stop reload");
    }

    fireWeapon(){
        const {position,selectedWeapon, game} = this

        if(selectedWeapon.alreadyFired) return
        
        if(!selectedWeapon.reloading){
            if(selectedWeapon.rounds > 0){
                selectedWeapon.rounds--
            }else{
                game.playSound('noAmmo', true)
                selectedWeapon.firedTimeStamp = this.game.dt
                selectedWeapon.alreadyFired = true
                return
            }
        }else{
            return
        }

        const {x,y} = position
        if(selectedWeapon.type === "pistol"){
            const newBullet = new Bullet(game, "pistol", x, y)
            game.playSound('pistolShot', true)
            game.activeBullets.push(newBullet)
            selectedWeapon.alreadyFired = true
            selectedWeapon.firedTimeStamp = this.game.dt
        }
        else if(selectedWeapon.type === "rifle"){
            const newBullet = new Bullet(game, "rifle", x, y)
            game.playSound('rifleShot', true)
            game.activeBullets.push(newBullet)
            selectedWeapon.alreadyFired = true
            selectedWeapon.firedTimeStamp = this.game.dt
        }else{
            for(let i = 0; i < 16; i++){                
                const newBullet = new Bullet(game,"shotgun",x,y)
                game.activeBullets.push(newBullet)
            }
            game.playSound('shotgunShot', true)
            selectedWeapon.alreadyFired = true
            selectedWeapon.firedTimeStamp = this.game.dt
        }
    }

    update(){

        

        const lastShot = Math.round((this.game.dt - this.selectedWeapon.firedTimeStamp))
        if(lastShot > this.selectedWeapon.rateOfFire) this.selectedWeapon.alreadyFired = false

        if(this.selectedWeapon.reloading){
            const timePassed = Math.round((this.game.dt - this.selectedWeapon.startedReloadingTimestamp)) 
            
            if(this.selectedWeapon.type === "shotgun"){
                if(this.selectedWeapon.rounds > this.selectedWeapon.maxRounds){
                    this.stopReload()
                }

                if(timePassed > (400 * this.selectedWeapon.rounds)){
                    this.game.playSound('shotgunReload', true)
                    if(this.selectedWeapon.rounds + 1 <= this.selectedWeapon.maxRounds && this.selectedWeapon.extraRounds - 1 >= 0){
                        this.selectedWeapon.rounds++
                        this.selectedWeapon.extraRounds--
                    }else{
                        this.stopReload()
                    }
                    if(this.selectedWeapon.rounds >= this.selectedWeapon.maxRounds) this.stopReload()
                }
                
            }else if(this.selectedWeapon.type === "pistol" || this.selectedWeapon.type === "rifle"){
                if(timePassed >= 2500){
                    this.stopReload()
                }
            }   
        }else {
            if(this.game.controls.mouseDown) this.fireWeapon(false)
        }

        // ROTATION
        let cursorAngle = Math.atan2(this.game.controls.cursor.x - 400, -(this.game.controls.cursor.y - 400)) - Math.PI/2
        if (this.playerAngle < 0) {
            this.playerAngle += Math.PI * 2;
        } 

        let diff = cursorAngle - this.playerAngle;
        if (diff > Math.PI) {
            diff -= Math.PI * 2;
        } else if (diff < -Math.PI) {
            diff += Math.PI * 2;
        }

        let targetAngle = this.playerAngle + diff * this.rotationSpeed;
        this.playerAngle = targetAngle;

        this.direction = this.normalizeVector(Math.cos(this.playerAngle),Math.sin(this.playerAngle))

        // MOVEMENT
    
        if(this.game.controls.RIGHT){
            (this.speed.x + this.acceleration) < this.maxSpeed ? this.speed.x += this.acceleration : this.speed.x = this.maxSpeed
        }
        else if(this.game.controls.LEFT){
            (this.speed.x - this.acceleration) > -this.maxSpeed ? this.speed.x -= this.acceleration : this.speed.x = -this.maxSpeed
        }
        else{
            if(this.speed.x > 0 && this.speed.x - this.acceleration >= 0) this.speed.x -= this.acceleration
            else if(this.speed.x < 0 && this.speed.x + this.acceleration <= 0) this.speed.x += this.acceleration
            else this.speed.x = 0
        }

        if(this.game.controls.DOWN){
            (this.speed.y + this.acceleration) < this.maxSpeed ? this.speed.y += this.acceleration : this.speed.y = this.maxSpeed
        } else if(this.game.controls.UP){
            (this.speed.y - this.acceleration) > -this.maxSpeed ? this.speed.y -= this.acceleration : this.speed.y = -this.maxSpeed
        }else{
            if(this.speed.y > 0 && this.speed.y - this.acceleration >= 0) this.speed.y -= this.acceleration
            else if(this.speed.y < 0 && this.speed.y + this.acceleration <= 0) this.speed.y += this.acceleration
            else this.speed.y = 0
        }

        if(this.speed.y < 0) this.moving.up = true
        else this.moving.up = false
        if(this.speed.x > 0) this.moving.right = true
        else this.moving.right = false
        if(this.speed.y > 0) this.moving.down = true
        else this.moving.down = false
        if(this.speed.x < 0) this.moving.left = true
        else this.moving.left = false

        
        if(this.moving.up || this.moving.down){
            const newX = this.position.x - this.game.graphics.tileSize/2
            const newY = this.position.y + this.speed.y - this.game.graphics.tileSize/2
            const nextTile = this.game.map.getTileAt(newX,newY)
            if(!nextTile.isWall){
                this.position.y += this.speed.y
            }else{
                this.speed.y = 0
            }    
        }
        if(this.moving.left || this.moving.right){
            const newX = this.position.x + this.speed.x - this.game.graphics.tileSize/2
            const newY = this.position.y - this.game.graphics.tileSize/2
            const nextTile = this.game.map.getTileAt(newX,newY)
            if(!nextTile.isWall){
                this.position.x += this.speed.x
            }else{
                this.speed.x = 0
            }
        }        

    }
}