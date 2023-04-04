export default class Controls{
    constructor(game){
        this.game = game

        this.cursor = {x:0,y:0}

        this.LEFT = false
        this.RIGHT = false
        this.UP = false
        this.DOWN = false
        this.SHIFT = false

        this.mouseDown = false

        this.addListeners()
    }

    addListeners(){
        
        this.game.graphics.canvas.addEventListener('mousedown', (e) => {
            if(e.which === 1){          // LEFT CLICK
                this.mouseDown = true
            }
        })
        this.game.graphics.canvas.addEventListener('mouseup', (e) => {
            this.mouseDown = false


            // CLICK TILE
            if(e.which === 3){
                const {tileSize} = this.game
                const {viewport} = this.game.graphics

                const rect = this.game.graphics.canvas.getBoundingClientRect();

                const x = Math.floor(e.clientX - rect.left) - viewport.offset.x - tileSize/2
                const y = Math.floor(e.clientY - rect.top) - viewport.offset.y - tileSize/2
                const tile = this.game.map.getTileAt(x,y)

                console.log(tile);
            }
        })

        this.game.graphics.canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault()
        })

        this.game.graphics.canvas.addEventListener('mousemove', (e) => {
            const rect = this.game.graphics.canvas.getBoundingClientRect();
            this.cursor =  {
                x: e.clientX - rect.left,
                y: e.clientY - rect.top,
            };

        })

        document.addEventListener('keydown', (e) => {
            switch (e.key) {
                case "A":
                case "a":
                    this.LEFT = true
                    break;
                case "D":
                case "d":
                    this.RIGHT = true
                    break;
                case "W":
                case "w":
                    this.UP = true
                    break;
                case "S":
                case "s":
                    this.DOWN = true
                    break;
                
                case "Shift":
                    if(this.game.player.stamina >= 25){
                        this.SHIFT = true
                    }
                    break;

                case "1":
                    this.game.player.selectWeapon(0)
                    break
                case "2":
                    this.game.player.selectWeapon(1)
                    break
                case "3":
                    this.game.player.selectWeapon(2)
                    break
            }
        })
        document.addEventListener('keyup', (e) => {
            switch (e.key) {
                case "A":
                case "a":
                    this.LEFT = false
                    break;
                case "D":
                case "d":
                    this.RIGHT = false
                    break;
                case "W":
                case "w":
                    this.UP = false
                    break;
                case "S":
                case "s":
                    this.DOWN = false
                    break;

                case "Shift":
                    this.SHIFT = false
                    break;

                case "R":
                case "r":
                        this.game.player.startReload()
                    break

                case "Q":
                case "q":
                    this.game.player.cycleWeapons()
                    break
            }
        })
    }
}