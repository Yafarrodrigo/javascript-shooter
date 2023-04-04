import Controls from './classes/Controls.js'
import Enemy from './classes/Enemy.js'
import Graphics from './classes/Graphics.js'
import Map from './classes/Map.js'
import Player from './classes/Player.js'
import Utils from './classes/Utils.js'

export default class Game{
    constructor(){
        this.tileSize = 50
        this.map = new Map(this)
        this.player = new Player(this)
        this.graphics = new Graphics(this)
        this.controls = new Controls(this)

        this.idgen = 0
        this.dt = 0

        this.DEBUG = {
            centerLines: false,
            tileNumbers: false,
            playerDirection: false,
            showFullMap: false,
            lineToMouse: false,
            showEnemyRanges: true,
            showEnemyPaths: true
        }

        this.player.spawn()
        
        this.enemies = []
        this.enemiesPerGroup = 1
        this.enemyGroups = 10
        this.spawnEnemies()

        this.activeBullets = []

        this.sounds = {
            pistolShot: new Audio("../sounds/pistolShot.mp3"),
            shotgunShot: new Audio("../sounds/shotgunShot.mp3"),
            pistolReload: new Audio("../sounds/pistolReload.mp3"),
            shotgunReload: new Audio("../sounds/shotgunReload.mp3"),
            noAmmo: new Audio("../sounds/noAmmo.mp3"),
            rifleShot: new Audio("../sounds/rifleShot.mp3"),
            rifleReload: new Audio("../sounds/rifleReload.mp3")
        }
    }

    playSound(soundId, retrigger){
        const audioToPlay = retrigger === true ? this.sounds[soundId].cloneNode(true) : this.sounds[soundId]
        audioToPlay.volume = 0.1
        audioToPlay.play()
    }

    spawnEnemies(){
        const {x: playerX,y: playerY } = this.player
        const {tileSize} = this

        for(let i = 0; i < this.enemyGroups; i++){
            let  tile = this.map.getRandomFloorTile()
            while(Utils.distanceEuclidean(tile.x, playerX/tileSize, tile.y, playerY/tileSize) < 10){
                tile = this.map.getRandomFloorTile()
            }
            this.spawnGroupOfEnemies(tile.x * tileSize, tile.y * tileSize, this.enemiesPerGroup, 150)
        }
    }

    spawnGroupOfEnemies(spawnX, spawnY, qty, separation){
        for(let i = 0; i < qty; i++){
            
            try {
                let rndY = Utils.randomBool() ? Utils.random(0,separation) : Utils.random(0,separation)*(-1)
                let rndX = Utils.randomBool() ? Utils.random(0,separation) : Utils.random(0,separation)*(-1)
                const newEnemy = new Enemy(this, spawnX + rndX, spawnY + rndY, 100)
                let insideWall = this.map.getTileAt(
                    newEnemy.x - this.tileSize/2,
                    newEnemy.y - this.tileSize/2
                    ).isWall
    
                if(!insideWall){
                    this.enemies.push(newEnemy)
                }else{
                    console.log("spawn dentro de pared");
                }
            } catch (error) {
                console.log("spawning chobis: ",error);
            }
            
        }
    }

    // delta time
    update(dt){

        this.dt = dt

        if(this.DEBUG.showFullMap){
            this.tileSize = 5
            this.player.x = 200
            this.player.y = 200
        }
        else{
            this.tileSize = 50
        }

        this.activeBullets.forEach( bullet => {
            if(!bullet.active){
                this.activeBullets = this.activeBullets.filter( e => e.id !== bullet.id)
            }
        })
        this.enemies.forEach( enemy => {
            enemy.update()
        })

        this.player.update()
        this.activeBullets.forEach( bullet => bullet.update())
        this.graphics.update()
    }
}