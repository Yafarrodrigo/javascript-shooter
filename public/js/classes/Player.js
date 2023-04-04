import Bullet from "./Bullet.js"
import Utils from "./Utils.js"
import Weapon from "./Weapon.js"

export default class Player{
    constructor(game){
        this.game = game

        this.size = 50

        this.hp = 100
        this.maxHp = 100
        this.stamina = 100
        this.maxStamina = 100
        this.staminaRegen = 0.05
        this.staminaCost = 0.5
        this.running = false
        this.speed = {x:0,y:0}
        this.maxSpeed = 2.5
        this.maxRunSpeed = 4
        this.acceleration = 0.3
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
    
        this.x = 0
        this.y = 0
        this.oldPosition = {x:0,y:0}
    }

    get l() {return this.x}
    get r() {return this.x+this.size}
    get t() {return this.y}
    get b() {return this.y+this.size}
    get ol() {return this.oldPosition.x}
    get or() {return this.oldPosition.x+this.size}
    get ot() {return this.oldPosition.y}
    get ob() {return this.oldPosition.y+this.size}
    get tile() {
        return this.game.map.tileMap
            [Math.floor((this.x) / this.game.tileSize)]
            [Math.floor((this.y) / this.game.tileSize)]
    }
    get tileLeft() {
        return this.game.map.tileMap
            [Math.floor((this.x) / this.game.tileSize) - 1]
            [Math.floor((this.y) / this.game.tileSize)]
    }
    get tileRight() {
        return this.game.map.tileMap
            [Math.floor((this.x) / this.game.tileSize) + 1]
            [Math.floor((this.y) / this.game.tileSize)]
    }
    get tileUp() {
        return this.game.map.tileMap
            [Math.floor((this.x) / this.game.tileSize)]
            [Math.floor((this.y) / this.game.tileSize) - 1]
    }
    get tileDown() {
        return this.game.map.tileMap
            [Math.floor((this.x) / this.game.tileSize)]
            [Math.floor((this.y) / this.game.tileSize) + 1]
    }

    spawn(){
        const {x,y} = this.game.map.firstFloorTile() //this.game.map.onlyFloors[0]
        const {tileSize} = this.game
        this.x = (x*tileSize) + (tileSize/2)
        this.y = (y*tileSize) + (tileSize/2)
    }

    cycleWeapons(){
        let currentWeaponIndex = this.weapons.indexOf(this.selectedWeapon)
        let nextIndex = currentWeaponIndex + 1
        if(nextIndex === this.weapons.length){
            nextIndex = 0
        }
        this.selectedWeapon = this.weapons[nextIndex]

    }

    selectWeapon(number){
        if(number > this.weapons.length) return
        this.game.player.selectedWeapon = this.game.player.weapons[number]
    }

    startReload(){
        if(this.selectedWeapon.extraRounds <= 0 ||
            this.game.player.selectedWeapon.rounds >= this.game.player.selectedWeapon.maxRounds ||
            this.game.player.selectedWeapon.reloading ) return
            
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

        const {x,y} = this
        if(selectedWeapon.type === "pistol"){
            const newBullet = new Bullet(game, "pistol", x, y)
            game.playSound('pistolShot', true)
            game.activeBullets.push(newBullet)
        }
        else if(selectedWeapon.type === "rifle"){
            const newBullet = new Bullet(game, "rifle", x, y)
            game.playSound('rifleShot', true)
            game.activeBullets.push(newBullet)
        }else if(selectedWeapon.type === "shotgun"){
            const pelletsQty = 16
            for(let i = 0; i < pelletsQty; i++){                
                const newBullet = new Bullet(game,"shotgun",x,y)
                game.activeBullets.push(newBullet)
            }
            game.playSound('shotgunShot', true)
        }
        selectedWeapon.alreadyFired = true
        selectedWeapon.firedTimeStamp = this.game.dt
    }

    update(){

        const { tileSize } = this.game
        const {width, height} = this.game.graphics
        const {RIGHT,LEFT,UP,DOWN,SHIFT} = this.game.controls

        // HANDLE RELOADS
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
            // SHOTS
        }else {
            if(this.game.controls.mouseDown) this.fireWeapon(false)
        }

        // ROTATION
        let cursorAngle = Math.atan2(this.game.controls.cursor.x - width/2, -(this.game.controls.cursor.y - height/2)) - Math.PI/2
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

        this.direction = Utils.normalizeVector(Math.cos(this.playerAngle),Math.sin(this.playerAngle))

        // MOVEMENT
        if(RIGHT){
            if(SHIFT){
                this.running = true;
                (this.speed.x + this.acceleration*2) < this.maxRunSpeed ? this.speed.x += this.acceleration*2 : this.speed.x = this.maxRunSpeed
            }else{
                this.running = false;
                (this.speed.x + this.acceleration) < this.maxSpeed ? this.speed.x += this.acceleration : this.speed.x = this.maxSpeed
            }
        }
        else if(LEFT){
            if(SHIFT){
                this.running = true;
                (this.speed.x - this.acceleration*2) > -this.maxRunSpeed ? this.speed.x -= this.acceleration*2 : this.speed.x = -this.maxRunSpeed
            }else{
                this.running = false;
                (this.speed.x - this.acceleration) > -this.maxSpeed ? this.speed.x -= this.acceleration : this.speed.x = -this.maxSpeed
            }
        }
        else{
            if(this.speed.x > 0 && this.speed.x - this.acceleration >= 0) this.speed.x -= this.acceleration
            else if(this.speed.x < 0 && this.speed.x + this.acceleration <= 0) this.speed.x += this.acceleration
            else this.speed.x = 0
        }

        if(DOWN){
            if(SHIFT){
                this.running = true;
                (this.speed.y + this.acceleration*2) < this.maxRunSpeed ? this.speed.y += this.acceleration*2 : this.speed.y = this.maxRunSpeed
            }else{
                this.running = false;
                (this.speed.y + this.acceleration) < this.maxSpeed ? this.speed.y += this.acceleration : this.speed.y = this.maxSpeed
            }
        } else if(UP){
            if(SHIFT){
                this.running = true;
                (this.speed.y - this.acceleration*2) > -this.maxRunSpeed ? this.speed.y -= this.acceleration*2 : this.speed.y = -this.maxRunSpeed
            }else{
                this.running = false;
                (this.speed.y - this.acceleration) > -this.maxSpeed ? this.speed.y -= this.acceleration : this.speed.y = -this.maxSpeed
            }
            
        }else{
            if(this.speed.y > 0 && this.speed.y - this.acceleration >= 0) this.speed.y -= this.acceleration
            else if(this.speed.y < 0 && this.speed.y + this.acceleration <= 0) this.speed.y += this.acceleration
            else this.speed.y = 0
        }

        if(this.running && this.stamina === 0){
            this.game.controls.SHIFT = false
            this.running = false
        }
        if(!SHIFT && !this.running) (this.stamina + this.staminaRegen) < this.maxStamina ? this.stamina += this.staminaRegen : this.stamina = this.maxStamina
        if(SHIFT && this.running && this.stamina && (this.speed.x !== 0 || this.speed.y !== 0)){
            (this.stamina - this.staminaCost) > 0 ? this.stamina -= this.staminaCost : this.stamina = 0;
        }

        this.oldPosition.x = this.x
        this.oldPosition.y = this.y

        if(this.speed.y < 0) this.moving.up = true
        else this.moving.up = false;
        if(this.speed.x > 0) this.moving.right = true
        else this.moving.right = false;
        if(this.speed.y > 0) this.moving.down = true
        else this.moving.down = false;
        if(this.speed.x < 0) this.moving.left = true
        else this.moving.left = false;

        if(this.moving.up || this.moving.down){
            const newX = this.x - (tileSize/2)
            const newY = this.y - (tileSize/2) + this.speed.y
            const nextTile = this.game.map.getTileAt(newX,newY)
            if(!nextTile.isWall){
                this.y += this.speed.y
            }else{
                this.speed.y = 0
            }
        }
        if(this.moving.left || this.moving.right){
            const newX = this.x - (tileSize/2) + this.speed.x
            const newY = this.y - (tileSize/2)
            const nextTile = this.game.map.getTileAt(newX,newY)
            if(!nextTile.isWall){
                this.x += this.speed.x
            }else{
                this.speed.x = 0
            }
        }        
    }
}