const _WEAPONS = {
    pistol:{
        type: "pistol",
        maxRounds: 6,
        extraRounds: 36,
        rateOfFire: 500,
        speed: 25,
        damage: 30,
        bulletSize: 5,
        shotSoundId: "pistolShot",
        reloadSoundId: "pistolReload",
        noAmmoSoundId: "noAmmo"
    },
    rifle:{
        type: "rifle",
        maxRounds: 30,
        extraRounds: 120,
        rateOfFire: 100,
        speed: 25,
        damage: 10,
        bulletSize: 5,
        shotSoundId: "rifleShot",
        reloadSoundId: "rifleReload",
        noAmmoSoundId: "noAmmo"
    },
    shotgun:{
        type: "shotgun",
        maxRounds: 8,
        extraRounds: 8,
        rateOfFire: 1000,
        speed: 25,
        damage: 5,
        bulletSize: 5,
        shotSoundId: "shotgunShot",
        reloadSoundId: "shotgunReload",
        noAmmoSoundId: "noAmmo"
    }
}

export default _WEAPONS