export default class Controls{
    constructor(game){
        this.game = game

        this.cursor = {x:0,y:0}

        this.LEFT = false
        this.RIGHT = false
        this.UP = false
        this.DOWN = false

        this.mouseDown = false

        this.addListeners()
    }

    addListeners(){
        
        this.game.graphics.canvas.addEventListener('mousedown', (e) => {
            if(e.which === 1){          // LEFT CLICK
                this.mouseDown = true
                /* if(!this.game.player.weapon.reloading) {
                    this.game.player.fireWeapon(true)
                } */
            }
        })
        this.game.graphics.canvas.addEventListener('mouseup', (e) => {
            this.mouseDown = false
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

                case "R":
                case "r":
                    if(this.game.player.selectedWeapon.rounds < this.game.player.selectedWeapon.maxRounds && !this.game.player.selectedWeapon.reloading){
                        this.game.player.startReload()
                    }
                    break

                case "Q":
                case "q":
                    if(this.game.player.selectedWeapon.type === "rifle") this.game.player.selectedWeapon = this.game.player.weapons[1]
                    else if(this.game.player.selectedWeapon.type === "shotgun") this.game.player.selectedWeapon = this.game.player.weapons[2]
                    else if(this.game.player.selectedWeapon.type === "pistol") this.game.player.selectedWeapon = this.game.player.weapons[0]
                    break

                case "1":
                    this.game.player.selectedWeapon = this.game.player.weapons[0]
                    break
                case "2":
                    this.game.player.selectedWeapon = this.game.player.weapons[1]
                    break
                case "3":
                    this.game.player.selectedWeapon = this.game.player.weapons[2]
                    break
            }
        })
    }
}