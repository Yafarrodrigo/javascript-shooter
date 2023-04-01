import _WEAPONS from "../_weapons.js";

export default class Weapon{
    constructor(weaponId){
        this.type = _WEAPONS[weaponId].type
        this.rounds = _WEAPONS[weaponId].maxRounds
        this.maxRounds = _WEAPONS[weaponId].maxRounds
        this.extraRounds = _WEAPONS[weaponId].extraRounds
        this.rateOfFire = _WEAPONS[weaponId].rateOfFire
        this.speed = _WEAPONS[weaponId].speed
        this.damage = _WEAPONS[weaponId].damage
        this.size = _WEAPONS[weaponId].bulletSize
        
        this.reloading = false
        this.startedReloadingTimestamp = 0
        this.alreadyFired = false,
        this.firedTimeStamp = 0
    }
}