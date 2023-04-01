export default class Graphics{
    constructor(game){
        this.game = game

        this.canvas = document.getElementById('game')
        this.ctx = this.canvas.getContext('2d')

        this.canvas2 = document.getElementById('game2')
        this.ctx2 = this.canvas.getContext('2d')

        this.ctx.fillStyle = "#111"
        this.ctx.fillRect(0,0,800,800)
                this.tileSize = 50

        this.wallTile = new Image()
        this.wallTile.src = "../imgs/wall.jpg"
        this.outOfMapTile = new Image()
        this.outOfMapTile.src = "../imgs/outOfMap.jpg"
        this.floorTile1 = new Image()
        this.floorTile1.src = "../imgs/floor1.jpg"
        this.floorTile2 = new Image()
        this.floorTile2.src = "../imgs/floor2.jpg"
        this.floorTile3 = new Image()
        this.floorTile3.src = "../imgs/floor3.jpg"
        this.playerTile = new Image()
        this.playerTile.src = "../imgs/player.png"
        this.enemyTile = new Image()
        this.enemyTile.src = "../imgs/enemy.png"
        this.bulletTIle = new Image()
        this.bulletTIle.src = "../imgs/bullet.png"
        this.pelletTile = new Image()
        this.pelletTile.src = "../imgs/pellet.png"

        this.rifleIcon = new Image()
        this.rifleIcon.src = "../imgs/rifleIcon.png"
        this.pistolIcon = new Image()
        this.pistolIcon.src = "../imgs/pistolIcon.png"
        this.shotgunIcon = new Image()
        this.shotgunIcon.src = "../imgs/shotgunIcon.png"

        this.floorTiles = [
            this.floorTile1,
            this.floorTile2,
            this.floorTile3,
        ]

        this.viewport = {
            screen: {x:800,y:800},
            startTile: {x:0,y:0},
            endTile: {x:0,y:0},
            offset: {x:0,y:0}
        }
    }

    drawLineToMouse(){
        const {ctx2, viewport} = this
        const {cursor} = this.game.controls
        const {x,y} = this.game.player.position

        const px = x + viewport.offset.x
        const py = y + viewport.offset.y
        
        const mx = cursor.x
        const my = cursor.y

        ctx2.strokeStyle = "rgba(255,255,0,0.25)"
        ctx2.beginPath();
        ctx2.moveTo(px,py);
        ctx2.lineTo(mx,my);
        ctx2.stroke();
    }

    drawBullets(){
        this.game.activeBullets.forEach( bullet => {
            if(bullet.active){
                const finalX = bullet.x + this.viewport.offset.x -(bullet.size/2)
                const finalY = bullet.y + this.viewport.offset.y -(bullet.size/2)

                let type
                if(bullet.type === "pistol" || bullet.type === "rifle") type = this.bulletTIle
                else if(bullet.type === "shotgun") type = this.pelletTile

                this.ctx2.fillStyle = "yellow"
                this.ctx2.drawImage(type ,finalX, finalY, bullet.size,bullet.size)
            }
        })
    }

    updateViewport(targetX,targetY){
        this.viewport.offset.x = Math.floor((this.viewport.screen.x/2) - Math.round(targetX))
        this.viewport.offset.y = Math.floor((this.viewport.screen.y/2) - Math.round(targetY))

        const tile = {
            x:Math.floor(targetX/this.tileSize),
            y:Math.floor(targetY/this.tileSize)
        }

        this.viewport.startTile.x = tile.x - 1 - Math.ceil((this.viewport.screen.x/2) / this.tileSize)
        this.viewport.startTile.y = tile.y - 1 - Math.ceil((this.viewport.screen.y/2) / this.tileSize)  

        if(this.viewport.startTile.x < 0) this.viewport.startTile.x = 0
        if(this.viewport.startTile.y < 0) this.viewport.startTile.y = 0

        this.viewport.endTile.x = tile.x + 1 + Math.ceil((this.viewport.screen.x/2) / this.tileSize)
        this.viewport.endTile.y = tile.y + 1 + Math.ceil((this.viewport.screen.y/2) / this.tileSize)

        if(this.viewport.endTile.x >= this.game.map.widthInTiles) this.viewport.endTile.x = this.game.map.widthInTiles -1
        if(this.viewport.endTile.y >= this.game.map.heightInTiles) this.viewport.endTile.y = this.game.map.heightInTiles -1
    }

    drawViewport(){

        this.ctx.fillStyle = "#111"
        this.ctx.fillRect(0,0,800,800)
        this.ctx2.clearRect(0,0,800,800)

        
        for(let x = this.viewport.startTile.x; x < this.viewport.endTile.x; x++){
            for(let y = this.viewport.startTile.y; y < this.viewport.endTile.y; y++){
                
                let tile = this.game.map.tileMap[x][y]

                // ??????????? => profit !
                const finalX = (x * this.tileSize) + this.viewport.offset.x
                const finalY = (y * this.tileSize) + this.viewport.offset.y

                if(tile.isWall === true && tile.outOfMap === false){        // WALLS
                    this.ctx.fillStyle = "#111"
                    this.ctx.drawImage(
                        this.wallTile,
                        finalX,
                        finalY,
                        this.tileSize - 1,this.tileSize - 1)

                }else if(tile.isWall === false && tile.outOfMap === false){ // FLOORS
                    this.ctx.drawImage(
                        this.floorTiles[tile.floorTileNumber],
                        finalX,
                        finalY,
                        this.tileSize - 1,
                        this.tileSize - 1
                    )
                }
                else{                                                        // BORDERS
                    this.ctx.drawImage(
                        this.outOfMapTile,
                        finalX,
                        finalY,
                        this.tileSize - 1,
                        this.tileSize - 1
                    )
                }

                if(this.game.DEBUG.tileNumbers){
                    this.ctx.font = "12px Arial";
                    this.ctx.fillStyle = "white"
                    this.ctx.fillText(`${x} - ${y}`, finalX, finalY);
                }
            }
        }
    }

    drawPlayer(){

        this.ctx2.save()
        this.ctx2.translate(400,400);
        this.ctx2.rotate(this.game.player.playerAngle)
        this.ctx2.translate(-400, -400); 

        this.ctx2.fillStyle = "green"
        //this.ctx2.fillRect(400-(this.tileSize/4),400-(this.tileSize/4),this.tileSize/2,this.tileSize/2)
        this.ctx2.drawImage(
            this.playerTile,
            400-(this.tileSize/2),
            400-(this.tileSize/2),
            this.tileSize,
            this.tileSize
        )
        
        if(this.game.DEBUG.playerDirection){
            this.ctx2.fillStyle = "red"
            this.ctx2.fillRect(400,400,this.tileSize,1)
        }

        this.ctx2.restore()

        if(this.game.DEBUG.centerLines){
            this.ctx2.fillStyle = "rgba(255,255,0,0.15)"
            this.ctx2.fillRect(0,400,800,1)
            this.ctx2.fillRect(400,0,1,800)
        }

        if(this.game.DEBUG.tileNumbers){
            this.ctx.font = "12px Arial";
            this.ctx.fillStyle = "yellow"
            this.ctx.fillText(`${Math.floor(this.game.player.position.x/this.tileSize)} - ${Math.floor(this.game.player.position.y/this.tileSize)}`, 400, 400);
        }
    }

    drawCurrentPath(){
        this.game.enemies.forEach( enemy => {
            if(enemy.pathToPlayer !== null){
                enemy.pathToPlayer.forEach( tile => {
                    const finalX = (tile.x * this.tileSize) + this.viewport.offset.x
                    const finalY = (tile.y * this.tileSize) + this.viewport.offset.y
                    
                    this.ctx2.fillStyle = "rgba(255,255,0,0.1)"
                    this.ctx2.fillRect(finalX,finalY,this.tileSize,this.tileSize)
                })
            }
        })
    }

    drawEnemies(){

        this.game.enemies.forEach( enemy => {
            
            const finalX = enemy.position.x + this.viewport.offset.x -(enemy.size/2)
            const finalY = enemy.position.y + this.viewport.offset.y -(enemy.size/2)

            const healthPercent = enemy.hp/enemy.maxHp

            if(enemy.hp < enemy.maxHp){
                this.ctx2.fillStyle = "rgb(168, 56, 50)"
                this.ctx2.fillRect(finalX-6,finalY-10,25,5)

                if(healthPercent >= 0.8){
                    this.ctx2.fillStyle = "rgb(50, 168, 82)"
                }
                else if(healthPercent >= 0.6){
                    this.ctx2.fillStyle = "rgb(109, 168, 50)"
                }
                else if(healthPercent >= 0.4){
                    this.ctx2.fillStyle = "rgb(156, 168, 50)"
                }
                else if(healthPercent >= 0.2){
                    this.ctx2.fillStyle = "rgb(168, 125, 50)"
                }else{
                    this.ctx2.fillStyle = "rgb(168, 56, 50)"
                }
                this.ctx2.fillRect(finalX-6,finalY-10,25*healthPercent,5)
            }

            this.ctx2.save()
            this.ctx2.translate(finalX,finalY);
            this.ctx2.rotate(enemy.angle)
            this.ctx2.translate(-finalX, -finalY); 
        
            this.ctx2.fillStyle = "white"
            this.ctx2.drawImage(this.enemyTile, finalX, finalY, enemy.size,enemy.size)
        
            this.ctx2.restore()


            // detection range
            if(this.game.DEBUG.showEnemyRanges){
                this.ctx2.strokeStyle = "rgba(255,0,0,0.15)"
                this.ctx2.beginPath();
                this.ctx2.arc(finalX, finalY, enemy.detectionRange, 0, 2 * Math.PI);
                this.ctx2.stroke();
                this.ctx2.strokeStyle = "rgba(255,0,255,0.15)"
                this.ctx2.beginPath();
                this.ctx2.arc(finalX, finalY, enemy.visionRange, 0, 2 * Math.PI);
                this.ctx2.stroke();
                this.ctx2.strokeStyle = "black"
            }
        })
    }

    drawUI(){

        const {player} = this.game

        if(this.game.player.selectedWeapon.type === "rifle"){
            this.ctx2.drawImage(this.rifleIcon,500,700,300,100);
            this.ctx2.font = "30px Arial";
            this.ctx2.fillStyle = "white"
            this.ctx2.fillText(`${this.game.player.selectedWeapon.rounds} / ${this.game.player.selectedWeapon.extraRounds}`, 390, 780);
        }
        else if(this.game.player.selectedWeapon.type === "pistol"){
            this.ctx2.drawImage(this.pistolIcon,625,690,175,100);
            this.ctx2.font = "30px Arial";
            this.ctx2.fillStyle = "white"
            this.ctx2.fillText(`${this.game.player.selectedWeapon.rounds} / ${this.game.player.selectedWeapon.extraRounds}`, 555, 780);
        }
        else if(this.game.player.selectedWeapon.type === "shotgun"){
            this.ctx2.drawImage(this.shotgunIcon,500,705,300,100);
            this.ctx2.font = "30px Arial";
            this.ctx2.fillStyle = "white"
            this.ctx2.fillText(`${this.game.player.selectedWeapon.rounds} / ${this.game.player.selectedWeapon.extraRounds}`, 425, 785);
        }

        // hp

        const healthPercent = player.hp/player.maxHp

        this.ctx2.fillStyle = "rgb(168, 56, 50)"
        this.ctx2.fillRect(25,25,400,40)

        if(healthPercent >= 0.8){
            this.ctx2.fillStyle = "rgb(50, 168, 82)"
        }
        else if(healthPercent >= 0.6){
            this.ctx2.fillStyle = "rgb(109, 168, 50)"
        }
        else if(healthPercent >= 0.4){
            this.ctx2.fillStyle = "rgb(156, 168, 50)"
        }
        else if(healthPercent >= 0.2){
            this.ctx2.fillStyle = "rgb(168, 125, 50)"
        }else{
            this.ctx2.fillStyle = "rgb(168, 56, 50)"
        }
        this.ctx2.fillRect(25,25,400*healthPercent,40)
        
    }

    update(){
        this.updateViewport(this.game.player.position.x,this.game.player.position.y)
        this.drawViewport()
        this.drawPlayer()
        this.drawBullets()
        this.drawEnemies()
        if(this.game.DEBUG.showEnemyRanges){
            this.drawCurrentPath()
        }

        this.drawUI()
        
        if(this.game.DEBUG.lineToMouse){
            this.drawLineToMouse()
        }
    }
}